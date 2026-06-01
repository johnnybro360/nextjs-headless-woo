import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { StaticPage } from "@/components/static-page";
import { CMS_PAGE_SLUGS, getPageBySlug } from "@/lib/pages";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(CMS_PAGE_SLUGS.policy);

  if (!page) {
    return { title: "Privacy Policy | Ember & Oak" };
  }

  return {
    title: `${page.title} | Ember & Oak`,
    description: page.excerpt || undefined,
  };
}

export default async function PolicyPage() {
  const page = await getPageBySlug(CMS_PAGE_SLUGS.policy);

  if (!page) {
    notFound();
  }

  return <StaticPage title={page.title} htmlContent={page.contentHtml} />;
}
