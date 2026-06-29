import { Button, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-3 font-serif text-6xl font-light text-charcoal">
        Page not found
      </h1>
      <p className="mt-4 max-w-sm text-mid">
        The page you&apos;re looking for has drifted away. Let&apos;s get you
        back to something beautiful.
      </p>
      <div className="mt-8">
        <Button href="/">Return home</Button>
      </div>
    </Container>
  );
}
