import Link from "next/link";

const NotFoundView = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex w-full max-w-xl flex-col items-center gap-6">
        <p className="font-heading text-[140px] leading-none tracking-wider sm:text-[180px] md:text-[220px] lg:text-[260px]">
          404
        </p>

        <h1 className="font-heading text-3xl tracking-wider md:text-4xl">
          Lost in the canvas
        </h1>

        <p className="max-w-md text-sm text-foreground/60 md:text-base">
          The page you&apos;re looking for has drifted off-canvas — or never
          existed. Find your way back below.
        </p>

        <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            BACK TO HOME
          </Link>
          <Link
            href="/shop"
            className="text-sm font-medium text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Browse the shop →
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFoundView;
