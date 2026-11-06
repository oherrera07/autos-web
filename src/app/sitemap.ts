import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL!;
  const { data } = await supabase
    .from("cars")
    .select("slug, created_at")
    .eq("is_published", true);

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    ...(data ?? []).map((c) => ({
      url: `${base}/autos/${c.slug}`,
      lastModified: c.created_at as string,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}