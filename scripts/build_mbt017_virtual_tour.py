#!/usr/bin/env python3
"""Build and render the MBT017 Bellesenze two-floor virtual-tour scene.

Run with Blender, from the repository root:

    /Applications/Blender.app/Contents/MacOS/Blender -b \
      --python scripts/build_mbt017_virtual_tour.py

The source proposal provides concept layouts rather than a full dimension set.
The scene therefore follows the proposal's ceiling-height hierarchy and uses
the drawing grid, doors, treatment beds, and standard furniture dimensions to
establish a consistent review scale.
"""

from __future__ import annotations

import json
import math
from pathlib import Path

import bpy
from mathutils import Vector


ROOT = Path.cwd()
BUILD_DIR = ROOT / "tmp" / "blender_cubemaps" / "mbt017-r3"
OUTPUT_DIR = ROOT / "output" / "blender" / "mbt017-r3"
WEB_DIR = ROOT / "public" / "virtual-tour" / "mbt017-r3"

BUILD_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
WEB_DIR.mkdir(parents=True, exist_ok=True)


def clear_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (
        bpy.data.meshes,
        bpy.data.curves,
        bpy.data.materials,
        bpy.data.cameras,
        bpy.data.lights,
    ):
        for datablock in list(datablocks):
            if datablock.users == 0:
                datablocks.remove(datablock)


def rgba(hex_value: str, alpha: float = 1.0) -> tuple[float, float, float, float]:
    value = hex_value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) / 255 for i in (0, 2, 4)) + (alpha,)


def principled_input(node: bpy.types.ShaderNodeBsdfPrincipled, *names: str):
    for name in names:
        if name in node.inputs:
            return node.inputs[name]
    return None


def material(
    name: str,
    color: str,
    roughness: float = 0.5,
    metallic: float = 0.0,
    emission: str | None = None,
    emission_strength: float = 0.0,
    transmission: float = 0.0,
) -> bpy.types.Material:
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    principled_input(bsdf, "Base Color").default_value = rgba(color)
    principled_input(bsdf, "Roughness").default_value = roughness
    principled_input(bsdf, "Metallic").default_value = metallic
    if emission:
        emission_color = principled_input(bsdf, "Emission Color", "Emission")
        emission_power = principled_input(bsdf, "Emission Strength")
        if emission_color:
            emission_color.default_value = rgba(emission)
        if emission_power:
            emission_power.default_value = emission_strength
    if transmission:
        transmission_input = principled_input(bsdf, "Transmission Weight", "Transmission")
        if transmission_input:
            transmission_input.default_value = transmission
        principled_input(bsdf, "Alpha").default_value = 0.32
        mat.surface_render_method = "DITHERED"
    return mat


def marble_material(name: str = "Warm ivory marble") -> bpy.types.Material:
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    for node in list(nodes):
        nodes.remove(node)

    output = nodes.new("ShaderNodeOutputMaterial")
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    noise = nodes.new("ShaderNodeTexNoise")
    ramp = nodes.new("ShaderNodeValToRGB")
    bump = nodes.new("ShaderNodeBump")

    noise.inputs["Scale"].default_value = 2.4
    noise.inputs["Detail"].default_value = 7.0
    noise.inputs["Roughness"].default_value = 0.72
    noise.inputs["Distortion"].default_value = 1.6
    ramp.color_ramp.elements[0].position = 0.33
    ramp.color_ramp.elements[0].color = rgba("#f7f2e8")
    ramp.color_ramp.elements[1].position = 0.66
    ramp.color_ramp.elements[1].color = rgba("#b8aa96")
    ramp.color_ramp.elements.new(0.51).color = rgba("#ded4c5")
    principled_input(bsdf, "Roughness").default_value = 0.24
    bump.inputs["Strength"].default_value = 0.12
    bump.inputs["Distance"].default_value = 0.08

    links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
    links.new(ramp.outputs["Color"], principled_input(bsdf, "Base Color"))
    links.new(noise.outputs["Fac"], bump.inputs["Height"])
    links.new(bump.outputs["Normal"], principled_input(bsdf, "Normal"))
    links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])
    return mat


def box(
    name: str,
    location: tuple[float, float, float],
    dimensions: tuple[float, float, float],
    mat: bpy.types.Material,
    bevel: float = 0.035,
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    if bevel > 0:
        modifier = obj.modifiers.new(name="Soft architectural edges", type="BEVEL")
        modifier.width = bevel
        modifier.segments = 3
    return obj


def cylinder(
    name: str,
    location: tuple[float, float, float],
    radius: float,
    depth: float,
    mat: bpy.types.Material,
    vertices: int = 48,
    rotation: tuple[float, float, float] = (0, 0, 0),
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices,
        radius=radius,
        depth=depth,
        location=location,
        rotation=rotation,
    )
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(mat)
    bevel = obj.modifiers.new(name="Soft edge", type="BEVEL")
    bevel.width = min(0.035, depth * 0.15)
    bevel.segments = 3
    return obj


def add_text(
    body: str,
    location: tuple[float, float, float],
    rotation: tuple[float, float, float],
    size: float,
    mat: bpy.types.Material,
    name: str,
    extrude: float = 0.018,
) -> bpy.types.Object:
    bpy.ops.object.text_add(location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.data.body = body
    obj.data.align_x = "CENTER"
    obj.data.align_y = "CENTER"
    obj.data.size = size
    obj.data.extrude = extrude
    obj.data.bevel_depth = 0.004
    obj.data.materials.append(mat)
    return obj


def area_light(
    name: str,
    location: tuple[float, float, float],
    energy: float = 360.0,
    size: float = 2.4,
    color: str = "#fff1d5",
) -> bpy.types.Object:
    data = bpy.data.lights.new(name=name, type="AREA")
    data.energy = energy
    data.shape = "DISK"
    data.size = size
    data.color = rgba(color)[:3]
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler = (0, 0, 0)
    return obj


def point_light(
    name: str,
    location: tuple[float, float, float],
    energy: float = 130.0,
    color: str = "#ffe5bb",
    radius: float = 0.3,
) -> bpy.types.Object:
    data = bpy.data.lights.new(name=name, type="POINT")
    data.energy = energy
    data.color = rgba(color)[:3]
    data.shadow_soft_size = radius
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    return obj


def add_table(
    name: str,
    x: float,
    y: float,
    z: float,
    width: float,
    depth: float,
    mat_top: bpy.types.Material,
    mat_leg: bpy.types.Material,
) -> None:
    box(f"{name} top", (x, y, z + 0.76), (width, depth, 0.09), mat_top, 0.05)
    for dx in (-width * 0.38, width * 0.38):
        for dy in (-depth * 0.34, depth * 0.34):
            cylinder(f"{name} leg", (x + dx, y + dy, z + 0.38), 0.035, 0.72, mat_leg, 24)


def add_chair(name: str, x: float, y: float, z: float, facing: float, upholstery: bpy.types.Material, metal: bpy.types.Material) -> None:
    seat = box(f"{name} seat", (x, y, z + 0.47), (0.48, 0.48, 0.11), upholstery, 0.08)
    back = box(f"{name} back", (x, y + 0.20, z + 0.82), (0.48, 0.10, 0.66), upholstery, 0.10)
    for dx in (-0.18, 0.18):
        for dy in (-0.18, 0.18):
            cylinder(f"{name} leg", (x + dx, y + dy, z + 0.23), 0.018, 0.44, metal, 16)
    for obj in (seat, back):
        obj.rotation_euler[2] = facing


def add_sofa(name: str, x: float, y: float, z: float, width: float, mat: bpy.types.Material, facing: float = 0.0) -> None:
    parts = [
        box(f"{name} seat", (x, y, z + 0.40), (width, 0.78, 0.25), mat, 0.12),
        box(f"{name} back", (x, y + 0.31, z + 0.82), (width, 0.20, 0.78), mat, 0.12),
        box(f"{name} arm L", (x - width / 2 + 0.13, y, z + 0.59), (0.26, 0.80, 0.48), mat, 0.12),
        box(f"{name} arm R", (x + width / 2 - 0.13, y, z + 0.59), (0.26, 0.80, 0.48), mat, 0.12),
    ]
    for obj in parts:
        obj.rotation_euler[2] = facing


def add_treatment_bed(name: str, x: float, y: float, z: float, mat: bpy.types.Material, base: bpy.types.Material, rotation: float = 0.0) -> None:
    parts = [
        box(f"{name} base", (x, y, z + 0.35), (0.78, 1.72, 0.42), base, 0.12),
        box(f"{name} cushion", (x, y, z + 0.64), (0.86, 1.86, 0.20), mat, 0.12),
        box(f"{name} pillow", (x, y + 0.67, z + 0.81), (0.58, 0.34, 0.15), mat, 0.09),
    ]
    for obj in parts:
        obj.rotation_euler[2] = rotation


def add_shelf_wall(name: str, x: float, y: float, z: float, width: float, facing_y: bool, wood: bpy.types.Material, product_mats: list[bpy.types.Material]) -> None:
    depth = 0.20
    backing_dims = (width, depth, 2.2) if facing_y else (depth, width, 2.2)
    box(f"{name} backing", (x, y, z + 1.15), backing_dims, wood, 0.03)
    for row in range(4):
        shelf_z = z + 0.38 + row * 0.50
        dims = (width, 0.34, 0.05) if facing_y else (0.34, width, 0.05)
        box(f"{name} shelf {row + 1}", (x, y, shelf_z), dims, wood, 0.015)
        for item in range(max(3, int(width / 0.42))):
            offset = -width / 2 + 0.28 + item * (width - 0.56) / max(1, int(width / 0.42) - 1)
            if facing_y:
                loc = (x + offset, y - 0.08, shelf_z + 0.16)
            else:
                loc = (x - 0.08, y + offset, shelf_z + 0.16)
            cylinder(
                f"{name} product {row}-{item}",
                loc,
                0.055,
                0.25,
                product_mats[(row + item) % len(product_mats)],
                24,
            )


def add_cabinet_run(name: str, x: float, y: float, z: float, width: float, facing_y: bool, mat: bpy.types.Material, top_mat: bpy.types.Material) -> None:
    count = max(1, int(width / 0.62))
    section = width / count
    for idx in range(count):
        offset = -width / 2 + section / 2 + idx * section
        dims = (section - 0.025, 0.58, 0.84) if facing_y else (0.58, section - 0.025, 0.84)
        loc = (x + offset, y, z + 0.42) if facing_y else (x, y + offset, z + 0.42)
        box(f"{name} cabinet {idx + 1}", loc, dims, mat, 0.025)
    top_dims = (width + 0.05, 0.64, 0.06) if facing_y else (0.64, width + 0.05, 0.06)
    box(f"{name} counter", (x, y, z + 0.87), top_dims, top_mat, 0.02)


def build_scene() -> tuple[list[bpy.types.Object], dict[str, tuple[float, float, float]]]:
    ivory = material("Warm ivory walls", "#eee9df", 0.72)
    porcelain = material("Porcelain", "#fbfaf6", 0.24)
    greige = material("Greige joinery", "#a99e90", 0.52)
    champagne = material("Champagne metal", "#a88f65", 0.22, 0.78)
    bronze = material("Antique bronze", "#66513a", 0.28, 0.72)
    charcoal = material("Warm charcoal", "#2b2925", 0.32, 0.18)
    timber = material("Pale oak", "#b9a181", 0.48)
    fabric = material("Boucle fabric", "#d8d0c3", 0.92)
    cream_fabric = material("Cream upholstery", "#eee8dc", 0.88)
    muted_rose = material("Muted rose", "#c7a2a0", 0.64)
    sage = material("Sage product", "#879286", 0.45)
    amber = material("Amber glass", "#a97443", 0.30, 0.05)
    glass = material("Low iron glass", "#dce5e2", 0.05, transmission=0.88)
    glow = material("Warm cove light", "#fff4dc", 0.18, emission="#fff0c8", emission_strength=7.0)
    screen = material("Display screen", "#f2ddca", 0.24, emission="#ffd8bd", emission_strength=1.2)
    marble = marble_material()
    product_mats = [porcelain, champagne, muted_rose, sage, amber]

    cutaway_objects: list[bpy.types.Object] = []

    # Building shell: 6.3 m wide x 22 m deep; front faces negative Y.
    box("Ground terrazzo floor", (0, 0, -0.09), (6.45, 22.2, 0.18), marble, 0.02)
    box("First floor left slab", (-0.67, 0, 3.43), (5.15, 22.2, 0.18), marble, 0.02)
    box("First floor stair front slab", (2.55, -9.65, 3.43), (1.30, 2.5, 0.18), marble, 0.02)
    box("First floor stair rear slab", (2.55, 3.65, 3.43), (1.30, 14.4, 0.18), marble, 0.02)
    roof = box("Roof ceiling", (0, 0, 7.00), (6.45, 22.2, 0.18), ivory, 0.02)
    cutaway_objects.append(roof)

    for floor_name, base_z, wall_h in (("Ground", 0.0, 3.35), ("First", 3.52, 3.39)):
        left = box(f"{floor_name} west outer wall", (-3.18, 0, base_z + wall_h / 2), (0.18, 22.1, wall_h), ivory, 0.02)
        right = box(f"{floor_name} east outer wall", (3.18, 0, base_z + wall_h / 2), (0.18, 22.1, wall_h), ivory, 0.02)
        rear = box(f"{floor_name} rear outer wall", (0, 11.0, base_z + wall_h / 2), (6.45, 0.18, wall_h), ivory, 0.02)
        cutaway_objects.append(right)

        # Full-height front glazing and bronze frames.
        glazing = box(f"{floor_name} front glazing", (0, -11.0, base_z + 1.62), (6.25, 0.05, 3.15), glass, 0.005)
        cutaway_objects.append(glazing)
        for x in (-3.10, -1.55, 0.0, 1.55, 3.10):
            frame = box(f"{floor_name} front frame {x}", (x, -10.95, base_z + 1.62), (0.055, 0.10, 3.18), bronze, 0.006)
            cutaway_objects.append(frame)
        cutaway_objects.append(box(f"{floor_name} front lintel", (0, -10.95, base_z + 3.18), (6.30, 0.10, 0.10), bronze, 0.006))

    # Ground-floor reception and retail zone.
    cylinder("Reception halo plinth", (0.0, -8.55, 0.11), 2.15, 0.18, champagne, 96)
    cylinder("Reception halo insert", (0.0, -8.55, 0.19), 1.87, 0.06, marble, 96)
    box("Reception desk front", (0.0, -8.35, 0.62), (2.35, 0.70, 1.05), greige, 0.18)
    box("Reception desk cap", (0.0, -8.37, 1.18), (2.52, 0.86, 0.12), marble, 0.06)
    add_text("BELLESENZE", (0, -7.99, 0.72), (math.radians(90), 0, 0), 0.26, champagne, "Reception wordmark")
    add_sofa("Waiting sofa", -1.55, -5.85, 0, 2.45, cream_fabric, facing=math.radians(-24))
    cylinder("Waiting coffee table", (0.35, -5.75, 0.34), 0.70, 0.10, marble, 64)
    cylinder("Waiting coffee base", (0.35, -5.75, 0.17), 0.12, 0.32, bronze, 32)
    add_chair("Consult chair A", 1.62, -6.15, 0, math.radians(155), fabric, bronze)
    add_chair("Consult chair B", 1.48, -5.05, 0, math.radians(205), fabric, bronze)
    add_shelf_wall("Ground retail west", -3.00, -8.15, 0.08, 2.55, False, greige, product_mats)
    box("Portrait lightbox", (2.98, -8.65, 1.62), (0.09, 1.15, 2.45), screen, 0.03)

    # Ground-floor treatment corridor: five rooms plus two larger rooms.
    for side, x_wall in (("west", -0.88), ("east", 0.88)):
        for start_y, end_y in ((-4.25, -3.35), (-2.30, -0.85), (0.10, 1.55), (2.50, 3.95), (4.90, 6.05)):
            box(
                f"Ground {side} corridor wall {start_y}",
                (x_wall, (start_y + end_y) / 2, 1.55),
                (0.13, end_y - start_y, 3.10),
                ivory,
                0.02,
            )
        for idx, y in enumerate((-3.35, -0.85, 1.55, 3.95), start=1):
            room_x = -2.03 if side == "west" else 2.03
            box(f"Ground {side} room partition {idx}", (room_x, y, 1.55), (2.18, 0.13, 3.10), ivory, 0.02)
            add_treatment_bed(
                f"Ground treatment {side} {idx}",
                room_x,
                y - 1.05,
                0,
                cream_fabric,
                greige,
                rotation=0,
            )
            cylinder(f"Ground side table {side} {idx}", (room_x + (0.70 if side == "west" else -0.70), y - 0.82, 0.43), 0.24, 0.78, champagne, 32)
    for y in (-3.25, -0.75, 1.75, 4.25):
        point_light(f"Ground corridor pendant {y}", (0, y, 2.65), 95, "#ffe5bb", 0.18)
        cylinder(f"Ground pendant shade {y}", (0, y, 2.86), 0.11, 0.28, champagne, 32)

    # Ground rear pantry and toilet block.
    box("Ground rear divider west", (-1.80, 6.45, 1.55), (2.70, 0.15, 3.10), ivory, 0.02)
    box("Ground rear divider east", (2.10, 6.45, 1.55), (2.00, 0.15, 3.10), ivory, 0.02)
    add_cabinet_run("Ground pantry rear", -1.08, 10.62, 0, 3.65, True, greige, marble)
    add_cabinet_run("Ground pantry west", -2.85, 8.66, 0, 3.10, False, greige, marble)
    cylinder("Ground pantry table", (-0.25, 8.45, 0.73), 0.72, 0.10, marble, 64)
    cylinder("Ground pantry table base", (-0.25, 8.45, 0.36), 0.14, 0.68, bronze, 32)
    for idx, angle in enumerate((0, 90, 180, 270)):
        radians = math.radians(angle)
        add_chair(
            f"Ground pantry chair {idx + 1}",
            -0.25 + math.sin(radians) * 1.15,
            8.45 + math.cos(radians) * 1.15,
            0,
            radians,
            fabric,
            bronze,
        )
    box("Ground toilet partition", (1.65, 8.75, 1.55), (0.14, 4.35, 3.10), ivory, 0.02)
    box("Ground toilet separator", (2.40, 8.20, 1.55), (1.45, 0.14, 3.10), ivory, 0.02)
    for x, y in ((2.15, 9.65), (2.65, 7.15)):
        cylinder("Ground toilet bowl", (x, y, 0.43), 0.26, 0.45, porcelain, 48)
        box("Ground toilet cistern", (x, y + 0.24, 0.62), (0.48, 0.20, 0.58), porcelain, 0.07)

    # Stair, aligned with the proposal's right-hand stairwell.
    stair_start_y = -8.30
    for step in range(15):
        height = (step + 1) * (3.43 / 15)
        depth = 0.32
        box(
            f"Stair tread {step + 1:02d}",
            (2.53, stair_start_y + step * depth, height / 2),
            (1.12, depth + 0.02, height),
            marble,
            0.015,
        )
    for x in (1.93, 3.10):
        for idx in range(6):
            y = -8.25 + idx * 0.91
            z = 0.75 + idx * 0.46
            cylinder(f"Stair baluster {x}-{idx}", (x, y, z), 0.025, 0.92, bronze, 16)

    # First-floor open studio / multipurpose room.
    add_text("BELLESENZE  ACADEMY", (0, -10.88, 5.78), (math.radians(90), 0, 0), 0.30, champagne, "Academy wordmark")
    box("First studio presentation screen", (0, 0.98, 5.42), (2.70, 0.09, 1.55), screen, 0.03)
    add_table("First demonstration table", 0, -0.45, 3.52, 3.15, 0.85, marble, bronze)
    for row, y in enumerate((-7.8, -6.55, -5.30, -4.05, -2.80)):
        for col, x in enumerate((-2.15, -1.08, 0.0, 1.08, 2.15)):
            add_chair(f"Studio chair {row + 1}-{col + 1}", x, y, 3.52, 0, cream_fabric, champagne)
    add_shelf_wall("First studio west display", -3.00, -2.15, 3.62, 3.10, False, greige, product_mats)
    add_shelf_wall("First studio east display", 3.00, -2.15, 3.62, 3.10, False, greige, product_mats)
    for y in (-8.25, -5.65, -3.05, -0.45):
        area_light(f"First studio area {y}", (0, y, 6.78), 520, 2.25)
    for y in (-7.2, -4.7):
        bpy.ops.mesh.primitive_torus_add(major_radius=1.30, minor_radius=0.055, major_segments=72, location=(0, y, 6.84))
        torus = bpy.context.object
        torus.name = f"First studio halo {y}"
        torus.data.materials.append(glow)

    # First-floor landing / PA reception.
    box("First landing divider west", (-1.78, 1.65, 5.20), (2.75, 0.14, 3.15), ivory, 0.02)
    box("First landing divider east", (2.20, 1.65, 5.20), (1.90, 0.14, 3.15), ivory, 0.02)
    box("First mini reception desk", (-1.72, 3.00, 4.14), (2.15, 0.62, 1.05), greige, 0.15)
    box("First mini reception cap", (-1.72, 3.00, 4.70), (2.30, 0.76, 0.11), marble, 0.05)
    add_text("BELLESENZE", (-1.72, 2.68, 4.24), (math.radians(90), 0, 0), 0.22, champagne, "First mini reception wordmark")
    add_sofa("First landing sofa", 1.25, 3.65, 3.52, 2.25, cream_fabric, facing=math.radians(180))
    cylinder("First landing table", (0.05, 3.45, 3.88), 0.48, 0.10, marble, 48)

    # First-floor treatment and director suites.
    box("First rear central wall", (0.18, 7.55, 5.20), (0.15, 6.75, 3.15), ivory, 0.02)
    box("First rear west front wall", (-1.48, 4.60, 5.20), (2.95, 0.15, 3.15), ivory, 0.02)
    box("First rear east front wall", (1.82, 4.60, 5.20), (2.60, 0.15, 3.15), ivory, 0.02)
    add_treatment_bed("First treatment bed", -1.48, 7.25, 3.52, cream_fabric, greige, rotation=0)
    box("First treatment backlit panel", (-3.02, 7.72, 5.32), (0.10, 2.30, 1.70), glow, 0.04)
    cylinder("First treatment side table", (-0.70, 7.65, 3.97), 0.24, 0.82, champagne, 32)
    add_table("Director desk", 1.62, 7.95, 3.52, 2.30, 0.85, charcoal, champagne)
    add_chair("Director chair", 1.62, 9.00, 3.52, math.radians(180), fabric, bronze)
    add_sofa("Director sofa", 1.65, 5.75, 3.52, 2.20, cream_fabric, facing=0)
    add_cabinet_run("First rear pantry", 1.48, 10.65, 3.52, 2.65, True, greige, marble)
    add_text("PRIVATE SUITE", (0.09, 4.53, 5.93), (math.radians(90), 0, 0), 0.19, champagne, "Private suite label")

    # Cove strips and general warm interior lighting.
    for base_z in (0.0, 3.52):
        ceiling = base_z + (3.25 if base_z == 0 else 3.32)
        for x in (-2.82, 2.82):
            box(f"Cove strip {base_z}-{x}", (x, 0, ceiling), (0.07, 20.6, 0.06), glow, 0.015)
        for y in (-9.0, -5.0, -1.0, 3.0, 7.0, 9.6):
            area_light(f"General area {base_z}-{y}", (0, y, ceiling - 0.05), 280 if base_z == 0 else 220, 2.15)

    # Outside light cards keep the glass facade luminous without an HDRI.
    box("Exterior daylight card", (0, -17.0, 3.0), (20.0, 0.15, 12.0), screen, 0.0)

    nodes = {
        "ground-reception": (0.20, -8.85, 1.58),
        "ground-lounge": (0.20, -5.35, 1.58),
        "ground-corridor": (0.0, 0.30, 1.58),
        "ground-pantry": (-0.25, 8.45, 1.58),
        "first-studio": (0.0, -7.10, 5.10),
        "first-demonstration": (0.0, -1.45, 5.10),
        "first-landing": (-0.25, 3.05, 5.10),
        "first-private-suite": (1.40, 7.65, 5.10),
    }

    for node_id, location in nodes.items():
        empty = bpy.data.objects.new(f"TOUR_{node_id}", None)
        empty.empty_display_type = "SPHERE"
        empty.empty_display_size = 0.22
        empty.location = location
        empty["tour_node_id"] = node_id
        bpy.context.collection.objects.link(empty)

    return cutaway_objects, nodes


def configure_scene() -> None:
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = False
    scene.render.use_file_extension = True
    scene.render.image_settings.color_depth = "8"
    scene.eevee.taa_render_samples = 48
    scene.eevee.use_fast_gi = True
    scene.eevee.fast_gi_quality = 0.72
    scene.eevee.fast_gi_ray_count = 4
    scene.eevee.use_raytracing = True
    scene.eevee.shadow_pool_size = "256"
    scene.eevee.shadow_ray_count = 2
    scene.eevee.shadow_step_count = 4
    scene.render.resolution_x = 1024
    scene.render.resolution_y = 1024
    scene.view_settings.look = "AgX - Medium High Contrast"
    scene.view_settings.exposure = -1.30

    world = bpy.context.scene.world
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = rgba("#302b25")
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.16


def point_camera(camera: bpy.types.Object, target: Vector, up: str = "Y") -> None:
    direction = target - camera.location
    camera.rotation_euler = direction.to_track_quat("-Z", up).to_euler()


def render_overview(cutaway_objects: list[bpy.types.Object]) -> None:
    scene = bpy.context.scene
    camera_data = bpy.data.cameras.new("Overview Camera")
    camera = bpy.data.objects.new("Overview Camera", camera_data)
    bpy.context.collection.objects.link(camera)
    scene.camera = camera
    camera.location = (13.8, -18.5, 12.5)
    point_camera(camera, Vector((0, -0.7, 3.3)))
    camera_data.lens = 48

    hidden_state = {obj.name: obj.hide_render for obj in cutaway_objects}
    for obj in cutaway_objects:
        obj.hide_render = True

    scene.render.resolution_x = 2560
    scene.render.resolution_y = 1440
    scene.render.resolution_percentage = 100
    scene.render.filepath = str(WEB_DIR / "bellesenze-two-floor-overview.png")
    bpy.ops.render.render(write_still=True)

    for obj in cutaway_objects:
        obj.hide_render = hidden_state[obj.name]
    bpy.data.objects.remove(camera, do_unlink=True)


def camera_basis(camera: bpy.types.Object) -> dict[str, list[float]]:
    matrix = camera.matrix_world.to_3x3()
    right = matrix @ Vector((1, 0, 0))
    up = matrix @ Vector((0, 1, 0))
    forward = matrix @ Vector((0, 0, -1))
    return {
        "right": [round(value, 7) for value in right],
        "up": [round(value, 7) for value in up],
        "forward": [round(value, 7) for value in forward],
    }


def render_cubemaps(nodes: dict[str, tuple[float, float, float]]) -> None:
    scene = bpy.context.scene
    scene.render.resolution_x = 1024
    scene.render.resolution_y = 1024
    scene.render.resolution_percentage = 100
    camera_data = bpy.data.cameras.new("Virtual Tour Camera")
    camera_data.type = "PERSP"
    camera_data.lens_unit = "FOV"
    camera_data.angle = math.radians(90)
    camera = bpy.data.objects.new("Virtual Tour Camera", camera_data)
    bpy.context.collection.objects.link(camera)
    scene.camera = camera

    face_targets = {
        "front": Vector((0, -1, 0)),
        "right": Vector((1, 0, 0)),
        "back": Vector((0, 1, 0)),
        "left": Vector((-1, 0, 0)),
        "up": Vector((0, 0, 1)),
        "down": Vector((0, 0, -1)),
    }

    for node_id, location in nodes.items():
        node_dir = BUILD_DIR / node_id
        node_dir.mkdir(parents=True, exist_ok=True)
        camera.location = location
        metadata: dict[str, dict[str, list[float]]] = {}
        for face, direction in face_targets.items():
            camera.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
            bpy.context.view_layer.update()
            metadata[face] = camera_basis(camera)
            scene.render.filepath = str(node_dir / f"{face}.png")
            bpy.ops.render.render(write_still=True)
        (node_dir / "cube_meta.json").write_text(json.dumps(metadata, indent=2), encoding="utf-8")

    bpy.data.objects.remove(camera, do_unlink=True)


def save_outputs(nodes: dict[str, tuple[float, float, float]]) -> None:
    blend_path = OUTPUT_DIR / "bellesenze-mbt017-r3-two-floor.blend"
    glb_path = OUTPUT_DIR / "bellesenze-mbt017-r3-two-floor.glb"
    bpy.context.scene["source_document"] = "MBT017 BELLESENZE DESIGN PROPOSAL R3.pdf"
    bpy.context.scene["scale_note"] = "Proportional review model; proposal layout and ceiling-height hierarchy followed; overall dimensions inferred."
    bpy.context.scene["tour_nodes"] = json.dumps(nodes)
    bpy.ops.wm.save_as_mainfile(filepath=str(blend_path))
    bpy.ops.export_scene.gltf(
        filepath=str(glb_path),
        export_format="GLB",
        export_apply=True,
        export_cameras=False,
        export_lights=False,
    )


def main() -> None:
    clear_scene()
    configure_scene()
    cutaway_objects, nodes = build_scene()
    save_outputs(nodes)
    render_overview(cutaway_objects)
    render_cubemaps(nodes)
    bpy.ops.wm.save_as_mainfile(filepath=str(OUTPUT_DIR / "bellesenze-mbt017-r3-two-floor.blend"))
    print(f"Created Blender model in {OUTPUT_DIR}")
    print(f"Rendered cubemaps in {BUILD_DIR}")


if __name__ == "__main__":
    main()
