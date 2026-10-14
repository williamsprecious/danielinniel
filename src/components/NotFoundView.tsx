import Link from "next/link";
import { Button } from "@/components/ui/button";

const NotFoundView = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex w-full max-w-xl flex-col items-center gap-6">
        <p className="font-heading text-[140px] leading-none tracking-wider sm:text-[180px] md:text-[220px] lg:text-[260px]">
          404
        </p>

        <div className="space-y-3">
          <h1 className="text-2xl font-medium tracking-tight md:text-3xl">
            Page not found
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-foreground/70 md:text-base">
            This page may have moved or is no longer available.
          </p>
        </div>

        <nav
          aria-label="Page recovery"
          className="mt-2 grid w-full max-w-xs gap-3 sm:max-w-md sm:grid-cols-2"
        >
          <Button asChild size="md" className="h-12 w-full">
            <Link href="/">Go to homepage</Link>
          </Button>
          <Button asChild variant="outline" size="md" className="h-12 w-full">
            <Link href="/shop">Browse shop</Link>
          </Button>
        </nav>
      </div>
    </main>
  );
};

export default NotFoundView;
