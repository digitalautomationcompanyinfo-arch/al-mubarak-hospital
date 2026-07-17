import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  lang?: "ar" | "en";
  image?: string;
  url?: string;
}

export default function SEO({
  title,
  description,
  lang = "ar",
  image = "/pptx_images/slide10_img17.jpg",
  url = "https://al-mubarak.org",
}: SEOProps) {
  const isArabic = lang === "ar";

  const defaultTitle = isArabic
    ? "مستشفى المبارك التخصصي - السودان"
    : "Al-Mubarak Specialized Hospital - Sudan";

  const defaultDesc = isArabic
    ? "الموقع الرسمي لمستشفى المبارك التخصصي. نقدم خدمات طبية متكاملة ورعاية صحية متميزة لجميع المرضى."
    : "Official website of Al-Mubarak Specialized Hospital. Delivering integrated healthcare and distinguished medical services to all patients.";

  const currentTitle = title || defaultTitle;
  const currentDesc = description || defaultDesc;

  const fullTitle = isArabic
    ? `${currentTitle} | مستشفى المبارك`
    : `${currentTitle} | Al-Mubarak Hospital`;

  const fullDescription = currentDesc;

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
