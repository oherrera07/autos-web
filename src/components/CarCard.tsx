import Link from "next/link";
import ImageCarousel from "./ImageCarousel";
import { Car } from "./types";

export default function CarCard({ car }: { car: Car }) {
  const price = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(car.price);

  return (
    <article>
      <div className="overflow-hidden rounded-3xl">
        <ImageCarousel images={car.images} alt={car.title} />
      </div>
      <div className="mt-3 space-y-1 px-1">
        <h2 className="text-base font-semibold leading-snug sm:text-lg">
          <Link href={`/autos/${car.slug}`} className="hover:underline">
            {car.title}
          </Link>
        </h2>
        <p className="text-xl font-bold text-green-500 sm:text-2xl">{price}</p>
        <p className="text-sm text-gray-400">
          {car.transmission} · {car.mileage.toLocaleString("es-MX")} km
        </p>
      </div>
    </article>
  );
}