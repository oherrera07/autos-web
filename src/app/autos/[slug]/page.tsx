import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ImageCarousel from "@/components/ImageCarousel";
import { getCarBySlug } from "@/lib/cars";
import { supabase } from "@/lib/supabase";
import { formatKm, formatPrice } from "@/lib/format";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

// Genera las páginas de los autos existentes; los nuevos se crean al visitarlos
export async function generateStaticParams() {
  const { data } = await supabase
    .from("cars")
    .select("slug")
    .eq("is_published", true);
  return (data ?? []).map((c) => ({ slug: c.slug as string }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) return { title: "Auto no encontrado" };

  const title = `${car.title} en venta`;
  const description = `${car.title}: ${formatPrice(car.price)}, ${car.transmission}, ${formatKm(car.mileage)}. Fotos reales y contacto directo por WhatsApp.`;

  return {
    title,
    description,
    alternates: { canonical: `/autos/${car.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "es_MX",
      images: car.images[0] ? [{ url: car.images[0] }] : [],
    },
  };
}

export default async function CarPage({ params }: Props) {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const pageUrl = `${siteUrl}/autos/${car.slug}`;
  const price = formatPrice(car.price);

  const message = `Hola, me interesa el ${car.title} de ${price} que vi en ${pageUrl}`;
  const waUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  // Datos estructurados: ayudan a Google a entender que es un auto en venta
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: car.title,
    brand: { "@type": "Brand", name: car.brand },
    ...(car.year && { vehicleModelDate: String(car.year) }),
    image: car.images,
    description: car.description ?? `${car.title} en venta`,
    itemCondition: "https://schema.org/UsedCondition",
    vehicleTransmission: car.transmission,
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: car.mileage,
      unitCode: "KMT",
    },
    offers: {
      "@type": "Offer",
      price: car.price,
      priceCurrency: "MXN",
      availability: "https://schema.org/InStock",
      url: pageUrl,
    },
  };

  const specs = [
    { label: "Marca", value: car.brand },
    { label: "Año", value: car.year ? String(car.year) : "—" },
    { label: "Transmisión", value: car.transmission },
    { label: "Kilometraje", value: formatKm(car.mileage) },
  ];

  const WhatsAppButton = ({ className = "" }: { className?: string }) => (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-4 text-lg font-bold text-black transition hover:brightness-110 ${className}`}
    >
      <span aria-hidden>💬</span> Contactar por WhatsApp
    </a>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className="bg-[#16225a]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <Link href="/" className="text-xl font-bold tracking-tight sm:text-2xl">
            AUTO MARKET
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:pb-12">
        <Link href="/" className="text-sm text-gray-400 hover:text-white">
          ← Volver al catálogo
        </Link>

        <div className="mt-4 grid gap-8 lg:grid-cols-[3fr_2fr]">
          {/* Fotos y descripción */}
          <section>
            <div className="overflow-hidden rounded-3xl">
              <ImageCarousel
                images={car.images}
                alt={car.title}
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            </div>

            {car.description && (
              <div className="mt-8">
                <h2 className="mb-2 text-xl font-bold">Descripción</h2>
                <p className="whitespace-pre-line leading-relaxed text-gray-300">
                  {car.description}
                </p>
              </div>
            )}
          </section>

          {/* Datos y contacto */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              {car.title}
            </h1>
            <p className="mt-2 text-4xl font-bold text-green-500">{price}</p>

            <dl className="mt-6 grid grid-cols-2 gap-3">
              {specs.map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/5 p-4">
                  <dt className="text-sm text-gray-400">{s.label}</dt>
                  <dd className="mt-0.5 font-semibold">{s.value}</dd>
                </div>
              ))}
            </dl>

            <WhatsAppButton className="mt-6 hidden lg:flex" />
          </aside>
        </div>
      </main>

      {/* Barra fija en celular: el botón siempre a la vista */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center gap-3 border-t border-white/10 bg-black/90 p-3 backdrop-blur lg:hidden">
        <p className="text-xl font-bold text-green-500">{price}</p>
        <WhatsAppButton className="flex flex-1 !py-3 !text-base" />
      </div>
    </div>
  );
}