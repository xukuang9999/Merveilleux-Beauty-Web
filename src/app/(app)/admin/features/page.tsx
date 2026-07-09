import { requireMasterAdmin } from "@/lib/auth";
import { getFeatureFlags, FEATURE_KEYS } from "@/lib/settings";
import { setFeatureFlag } from "@/lib/admin-actions";
import { DashHeading, Panel } from "@/components/dash";
import { getDict } from "@/i18n/server";

export default async function AdminFeaturesPage() {
  await requireMasterAdmin();
  const [flags, dict] = await Promise.all([getFeatureFlags(), getDict()]);
  const f = dict.admin.features;

  return (
    <>
      <DashHeading eyebrow={f.eyebrow} title={f.title} subtitle={f.sub} />
      <Panel>
        <div className="divide-y divide-line">
          {FEATURE_KEYS.map((key) => {
            const enabled = flags[key];
            return (
              <div
                key={key}
                className="flex items-center justify-between gap-3 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className={`h-2.5 w-2.5 rounded-full ${
                      enabled ? "bg-green" : "bg-line"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-charcoal">
                      {f.labels[key]}
                    </p>
                    <p className="text-xs text-mid">{enabled ? f.on : f.off}</p>
                  </div>
                </div>
                <form action={setFeatureFlag}>
                  <input type="hidden" name="key" value={key} />
                  <input
                    type="hidden"
                    name="enabled"
                    value={enabled ? "false" : "true"}
                  />
                  <button
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                      enabled
                        ? "border border-line text-mid hover:border-bronze hover:text-charcoal"
                        : "bg-charcoal text-cream hover:bg-umber"
                    }`}
                  >
                    {enabled ? f.disable : f.enable}
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      </Panel>
    </>
  );
}
