import { getLocale } from "@/i18n/server";
import { uiCopy } from "@/i18n/ui-copy";
import { Button, Container } from "@/components/ui";

export default async function NotFound() {
  const copy = uiCopy(await getLocale());
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-3 font-serif text-6xl font-light text-charcoal">
        {copy.notFound}
      </h1>
      <p className="mt-4 max-w-sm text-mid">
        {copy.notFoundBody}
      </p>
      <div className="mt-8">
        <Button href="/">{copy.home}</Button>
      </div>
    </Container>
  );
}
