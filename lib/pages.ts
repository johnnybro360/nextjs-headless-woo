import he from "he";
import { wpFetch } from "@/lib/wp-fetch";

type WpRenderedField = {
  rendered: string;
};

type WpPageResponse = {
  slug: string;
  title: WpRenderedField;
  content: WpRenderedField;
  excerpt: WpRenderedField;
  modified: string;
};

export type CmsPageViewModel = {
  slug: string;
  title: string;
  contentHtml: string;
  excerpt: string;
  modified: string;
};

export const CMS_PAGE_SLUGS = {
  about: process.env.WP_PAGE_ABOUT_SLUG ?? "about",
  policy: process.env.WP_PAGE_POLICY_SLUG ?? "privacy-policy",
} as const;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function mapPage(page: WpPageResponse): CmsPageViewModel {
  return {
    slug: page.slug,
    title: he.decode(stripHtml(page.title.rendered)),
    contentHtml: page.content.rendered,
    excerpt: he.decode(stripHtml(page.excerpt.rendered)),
    modified: page.modified,
  };
}

export async function getPageBySlug(
  slug: string,
): Promise<CmsPageViewModel | null> {
  try {
    const pages = await wpFetch<WpPageResponse[]>("/pages", {
      slug,
      status: "publish",
    });

    const page = pages[0];
    return page ? mapPage(page) : null;
  } catch (error) {
    console.error(`Failed to fetch WordPress page "${slug}":`, error);
    return null;
  }
}
