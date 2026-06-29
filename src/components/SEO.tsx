import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  lang?: "ar" | "en";
  image?: string;
  url?: string;
}

export default function SEO({
  title = "مستشفى المبارك التخصصي - كسلا، السودان",
  description = "الموقع الرسمي لمستشفى المبارك التخصصي بكسلا، حي الجسر، السودان. نقدم خدمات طبية متكاملة ورعاية صحية متميزة لأهالي ولاية كسلا وشرق السودان.",
  lang = "ar",
  image = "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
  url = "https://al-mubarak.org",
}: SEOProps) {
  const isArabic = lang === "ar";

  const fullTitle = isArabic
    ? `${title} | مستشفى المبارك`
    : `${title} | Al-Mubarak Hospital`;

  const fullDescription = isArabic
    ? description
    : "Official website of Al-Mubarak Specialized Hospital, Al-Gisr District, Kassala, Sudan. Delivering integrated healthcare and distinguished medical services to Kassala State and Eastern Sudan.";

  return (
    <Helmet>
      {/* Basic */}
      <html lang={lang} dir={isArabic ? "rtl" : "ltr"} />
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={isArabic ? "ar_SD" : "en_US"} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image} />

      {/* Geolocation */}
      <meta name="geo.region" content="SD-KA" />
      <meta name="geo.placename" content="Kassala, Al-Gisr" />
      <meta name="geo.position" content="15.4560;36.3980" />
      <meta name="ICBM" content="15.4560, 36.3980" />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="قسم الإعلام والتواصل - مستشفى المبارك" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
