import { MetadataRoute } from "next";

const siteUrl = "https://qrlink-weld.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return routes;
}
