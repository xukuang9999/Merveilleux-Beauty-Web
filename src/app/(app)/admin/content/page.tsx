import { requireMasterAdmin } from "@/lib/auth";
import { getCopyOverrides } from "@/lib/settings";
import { saveCopy } from "@/lib/admin-actions";
import { COPY_ITEMS, COPY_GROUPS } from "@/lib/copy-registry";
import { DashHeading, Panel } from "@/components/dash";
import { getDict, getDictionary } from "@/i18n/server";
import { locales, localeNames } from "@/i18n/config";

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-bronze";

export default async function AdminContentPage() {
  await requireMasterAdmin();
  const dict = await getDict();
  const overrideMaps = await Promise.all(
    locales.map((l) => getCopyOverrides(l)),
  );
  const c = dict.admin.content;

  const overrideFor = (locale: (typeof locales)[number]) =>
    overrideMaps[locales.indexOf(locale)];

  return (
    <>
      <DashHeading eyebrow={c.eyebrow} title={c.title} subtitle={c.sub} />

      <form action={saveCopy} className="space-y-6">
        {COPY_GROUPS.map((group) => (
          <Panel key={group} title={c.groups[group]}>
            <div className="space-y-6">
              {COPY_ITEMS.filter((it) => it.group === group).map((it) => (
                <div key={it.key}>
                  <p className="mb-2 text-sm font-medium text-charcoal">
                    {it.label}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {locales.map((l) => {
                      const value =
                        overrideFor(l).get(it.key) ??
                        it.resolve(getDictionary(l));
                      const name = `${it.key}__${l}`;
                      return (
                        <label key={l} className="block">
                          <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-mid">
                            {localeNames[l]}
                          </span>
                          {it.multiline ? (
                            <textarea
                              name={name}
                              defaultValue={value}
                              rows={4}
                              lang={l}
                              className={inputClass}
                            />
                          ) : (
                            <input
                              name={name}
                              defaultValue={value}
                              lang={l}
                              className={inputClass}
                            />
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        ))}

        <button className="rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-umber">
          {c.save}
        </button>
      </form>
    </>
  );
}
