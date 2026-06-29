import React from "react";

interface HospitalStructuredDataProps {
  lang: "ar" | "en";
}

export default function HospitalStructuredData({ lang }: HospitalStructuredDataProps) {
  const isArabic = lang === "ar";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Hospital",
    name: isArabic ? "مستشفى المبارك التخصصي" : "Al-Mubarak Specialized Hospital",
    description: isArabic
      ? "مستشفى المبارك التخصصي بكسلا، حي الجسر، السودان - نقدم خدمات طبية متكاملة ورعاية صحية متميزة لأهالي ولاية كسلا وشرق السودان."
      : "Al-Mubarak Specialized Hospital in Al-Gisr District, Kassala, Sudan - providing integrated healthcare services to Kassala State and Eastern Sudan.",
    url: "https://al-mubarak.org",
    telephone: "+24912345678",
    email: "media@al-mubarak.org",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    address: {
      "@type": "PostalAddress",
      streetAddress: isArabic ? "حي الجسر، بالقرب من كوبري القاش الرئيسي" : "Al-Gisr District, near Al-Gash Main Bridge",
      addressLocality: isArabic ? "كسلا" : "Kassala",
      addressRegion: isArabic ? "ولاية كسلا" : "Kassala State",
      addressCountry: "SD",
      postalCode: ""
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "15.4560",
      longitude: "36.3980"
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "00:00",
        closes: "23:59",
        description: isArabic ? "قسم الطوارئ - 24 ساعة" : "Emergency Department - 24 Hours"
      }
    ],
    medicalSpecialty: [
      "EmergencyMedicine",
      "InternalMedicine",
      "Cardiology",
      "Pediatrics",
      "ObstetricsAndGynecology",
      "GeneralSurgery"
    ],
    availableLanguage: ["Arabic", "English"],
    isAcceptingNewPatients: true,
    areaServed: {
      "@type": "City",
      name: isArabic ? "كسلا" : "Kassala"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }}
    />
  );
}
