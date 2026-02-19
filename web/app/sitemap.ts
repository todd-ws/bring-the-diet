import type { MetadataRoute } from 'next';
import { SITE_URL, API_URL } from '../lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/diets`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/recipes`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/foods`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/meal-plans`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  ];

  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/api/blogposts?pageSize=1000`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const posts = Array.isArray(data) ? data : data.items || [];
      blogEntries = posts
        .filter((p: { published: boolean }) => p.published)
        .map((p: { slug: string; updatedAt?: string; createdAt?: string }) => ({
          url: `${SITE_URL}/blog/${p.slug}`,
          lastModified: new Date(p.updatedAt || p.createdAt || Date.now()),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));
    }
  } catch {
    /* API unavailable — skip dynamic blog entries */
  }

  let dietEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/api/diettypes`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const diets = Array.isArray(data) ? data : data.items || [];
      dietEntries = diets.map((d: { slug: string }) => ({
        url: `${SITE_URL}/diets/${d.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
    }
  } catch {
    /* skip */
  }

  let recipeEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/api/recipes?pageSize=1000`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const recipes = data.items || [];
      recipeEntries = recipes.map(
        (r: { id: string; updatedAt?: string; createdAt?: string }) => ({
          url: `${SITE_URL}/recipes/${r.id}`,
          lastModified: new Date(r.updatedAt || r.createdAt || Date.now()),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        })
      );
    }
  } catch {
    /* skip */
  }

  return [...staticPages, ...blogEntries, ...dietEntries, ...recipeEntries];
}
