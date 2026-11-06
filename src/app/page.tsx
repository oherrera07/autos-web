import { supabase } from "@/lib/supabase";
import CarCatalog from "@/components/CarCatalog";
import { Car } from "@/components/types";

export const revalidate = 60;

type Row = Omit<Car, "images"> & {
  car_images: { url: string; position: number }[];
};

export default async function Home() {
  const { data, error } = await supabase
    .from("cars")
    .select(
      "id, slug, brand, title, year, price, transmission, mileage, car_images(url, position)"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="p-8 text-white">Error al cargar los autos.</p>;
  }

  const cars: Car[] = ((data ?? []) as unknown as Row[]).map(
    ({ car_images, ...car }) => ({
      ...car,
      images: [...car_images]
        .sort((a, b) => a.position - b.position)
        .map((i) => i.url),
    })
  );

  return <CarCatalog cars={cars} />;
}