import { desc } from "drizzle-orm";
import { requireAdmin, isMasterAdmin } from "@/lib/auth";
import { db } from "@/db";
import { mediaAssets } from "@/db/schema";
import { deleteMediaAsset } from "@/lib/admin-actions";
import { getInUseMediaUrls } from "@/lib/media-usage";
import { DashHeading, Panel } from "@/components/dash";
import MediaUploadButton from "@/components/MediaUploadButton";
import { getDict } from "@/i18n/server";

export default async function AdminMediaPage() {
  const user = await requireAdmin();
  const [assets, inUse, dict] = await Promise.all([
    db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt)),
    getInUseMediaUrls(),
    getDict(),
  ]);
  const m = dict.admin.media;
  const canDelete = isMasterAdmin(user.role);

  return (
    <>
      <DashHeading eyebrow={m.eyebrow} title={m.title} subtitle={m.sub} />

      <div className="mb-6">
        <MediaUploadButton label={m.upload} />
      </div>

      {assets.length === 0 ? (
        <Panel>
          <p className="text-sm text-mid">{m.empty}</p>
        </Panel>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {assets.map((a) => (
            <div
              key={a.id}
              className="overflow-hidden rounded-xl border border-line bg-white"
            >
              <div className="aspect-square bg-cream">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.url} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="p-2.5">
                <p className="truncate text-[11px] text-mid" title={a.url}>
                  {a.url}
                </p>
                {inUse.has(a.url) ? (
                  <span className="mt-1.5 inline-block rounded-full bg-champagne/60 px-2 py-0.5 text-[10px] font-medium text-bronze">
                    {m.inUse}
                  </span>
                ) : (
                  canDelete && (
                    <form action={deleteMediaAsset} className="mt-1.5">
                      <input type="hidden" name="id" value={a.id} />
                      <button className="text-[11px] font-medium text-bronze hover:underline">
                        {m.delete}
                      </button>
                    </form>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
