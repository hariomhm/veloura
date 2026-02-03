import express from "express";
import { Product } from "../models/Product.js";
import { env } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const seoRouter = express.Router();

const url = (path) => {
  const base = env.siteUrl.replace(/\/$/, "");
  return `${base}${path}`;
};

seoRouter.get(
  "/sitemap.xml",
  asyncHandler(async (_req, res) => {
    const products = await Product.find({ isActive: true })
      .select("slug updatedAt")
      .lean();

    const staticRoutes = [
      "/",
      "/products",
      "/mens",
      "/womens",
      "/kids",
      "/about",
      "/contact",
      "/help",
      "/terms",
      "/returns",
    ];

    const urls = [
      ...staticRoutes.map((route) => ({
        loc: url(route),
        lastmod: new Date().toISOString(),
      })),
      ...products.map((p) => ({
        loc: url(`/product/${p.slug}`),
        lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString() : new Date().toISOString(),
      })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  })
);

seoRouter.get("/robots.txt", (_req, res) => {
  const content = `User-agent: *
Allow: /
Sitemap: ${url("/sitemap.xml")}
`;
  res.header("Content-Type", "text/plain");
  res.send(content);
});

