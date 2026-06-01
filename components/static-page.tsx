import type { ReactNode } from "react";
import { WpPageContent } from "@/components/wp-page-content";

type StaticPageProps = {
  title: string;
  htmlContent?: string;
  children?: ReactNode;
};

export function StaticPage({ title, htmlContent, children }: StaticPageProps) {
  return (
    <main className="min-h-screen px-5 sm:px-8 lg:px-10 py-12 md:py-16 lg:py-20">
      <article className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl tracking-[0.04em] text-foreground md:text-5xl">
          {title}
        </h1>
        <div className="mt-10">
          {htmlContent ? <WpPageContent html={htmlContent} /> : children}
        </div>
      </article>
    </main>
  );
}
