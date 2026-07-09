import { requireMasterAdmin } from "@/lib/auth";
import {
  getAppearance,
  COLOR_TOKENS,
  FONT_SERIF_OPTIONS,
  FONT_SANS_OPTIONS,
} from "@/lib/settings";
import { saveAppearance, resetAppearance } from "@/lib/admin-actions";
import { DashHeading, Panel } from "@/components/dash";
import { getDict } from "@/i18n/server";

// Font family names are proper nouns — shown as-is across locales.
const SERIF_LABELS: Record<string, string> = {
  cormorant: "Cormorant Garamond",
  georgia: "Georgia",
  palatino: "Palatino",
  times: "Times New Roman",
};
const SANS_LABELS: Record<string, string> = {
  dmSans: "DM Sans",
  system: "System UI",
  helvetica: "Helvetica",
  verdana: "Verdana",
};

const selectClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-bronze";

export default async function AdminAppearancePage() {
  await requireMasterAdmin();
  const [appearance, dict] = await Promise.all([getAppearance(), getDict()]);
  const a = dict.admin.appearance;

  return (
    <>
      <DashHeading eyebrow={a.eyebrow} title={a.title} subtitle={a.sub} />

      <form action={saveAppearance}>
        <Panel title={a.colorsTitle}>
          <div className="grid gap-4 sm:grid-cols-2">
            {COLOR_TOKENS.map((t) => (
              <label
                key={t.key}
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-2.5"
              >
                <span className="text-sm text-charcoal">{a.colors[t.key]}</span>
                <input
                  type="color"
                  name={`color_${t.key}`}
                  defaultValue={appearance.colors[t.key]}
                  aria-label={a.colors[t.key]}
                  className="h-8 w-14 cursor-pointer rounded border border-line bg-white"
                />
              </label>
            ))}
          </div>
        </Panel>

        <Panel title={a.fontsTitle} className="mt-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm text-charcoal">
                {a.serifLabel}
              </span>
              <select
                name="fontSerif"
                defaultValue={appearance.fontSerif}
                className={selectClass}
              >
                {Object.keys(FONT_SERIF_OPTIONS).map((k) => (
                  <option key={k} value={k}>
                    {SERIF_LABELS[k] ?? k}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-charcoal">
                {a.sansLabel}
              </span>
              <select
                name="fontSans"
                defaultValue={appearance.fontSans}
                className={selectClass}
              >
                {Object.keys(FONT_SANS_OPTIONS).map((k) => (
                  <option key={k} value={k}>
                    {SANS_LABELS[k] ?? k}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Panel>

        <div className="mt-5">
          <button className="rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-umber">
            {a.save}
          </button>
        </div>
      </form>

      <form action={resetAppearance} className="mt-3">
        <button className="text-sm text-mid underline transition-colors hover:text-charcoal">
          {a.reset}
        </button>
      </form>
    </>
  );
}
