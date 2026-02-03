import React from "react";
import { Helmet } from "react-helmet-async";
import config from "../config";

const Seo = ({ title, description, image, url, type = "website", jsonLd }) => {
  const siteUrl = config.siteUrl || "";
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const metaTitle = title ? `${title} | Veloura` : "Veloura | Premium Fashion Store";
  const metaDescription =
    description ||
    "Veloura â€“ premium fashion for men, women & kids. Shop the latest trends with secure payments and fast delivery.";
  const metaImage = image
    ? image.startsWith("http")
      ? image
      : `${siteUrl}${image}`
    : `${siteUrl}/og-image.png`;

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={metaImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default Seo;
