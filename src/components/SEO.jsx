import { Helmet } from "react-helmet-async";

const SITE_NAME = "Ekenobizi Property Hub";
const DEFAULT_DESCRIPTION =
  "Verified land and property listings in Ekenobizi Community, Umuahia South LGA, Abia State. Every listing reviewed by a human admin before it goes live.";

/**
 * Drop this at the top of any page component to set its title/description.
 * Falls back to sensible site-wide defaults if props are omitted.
 *
 * Usage:
 *   <SEO title="3 Bedroom Duplex, Umuzam" description="..." />
 */
export default function SEO({ title, description, image }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const metaDescription = description || DEFAULT_DESCRIPTION;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />

      {/* Open Graph — controls WhatsApp/Facebook link preview cards */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}
    </Helmet>
  );
}
