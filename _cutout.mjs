// Remove the white studio background from a product photo via edge flood-fill,
// leaving the product (whose light body is enclosed by darker edges) intact.
import sharp from "sharp";

const SRC = process.argv[2];
const OUT = process.argv[3];
const THRESH = Number(process.argv[4] ?? 236);

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
const idx = (x, y) => (y * W + x) * C;
const isWhite = (i) => data[i] >= THRESH && data[i + 1] >= THRESH && data[i + 2] >= THRESH;

const visited = new Uint8Array(W * H);
const qx = new Int32Array(W * H);
const qy = new Int32Array(W * H);
let head = 0, tail = 0;
const push = (x, y) => {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const p = y * W + x;
  if (visited[p]) return;
  visited[p] = 1;
  if (!isWhite(idx(x, y))) return;
  data[idx(x, y) + 3] = 0;
  qx[tail] = x; qy[tail] = y; tail++;
};
for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
while (head < tail) {
  const x = qx[head], y = qy[head]; head++;
  push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
}

let cleared = 0;
for (let p = 0; p < W * H; p++) if (data[p * C + 3] === 0) cleared++;
const png = await sharp(data, { raw: { width: W, height: H, channels: C } }).png().toBuffer();
await sharp(png).median(1).png({ compressionLevel: 9 }).toFile(OUT);
console.log(`${SRC.split("/").pop()} -> ${OUT.split("/").pop()}  ${W}x${H}, cleared ${(100 * cleared / (W * H)).toFixed(1)}%`);
