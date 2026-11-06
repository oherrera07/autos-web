import { cache } from "react";
import { supabase } from "./supabase";
import { Car } from "@/components/types";

type Row = Omit<Car, "images"> & {
  car_images: { url: string; position: number }[];
};

// cache() evita consultar dos veces la misma BD
// (una para los metadatos y otra para la página)
export const getCarBySlug = cache(async (slug: string): Promise<Car | null> => {
  const { data } = await supabase
    .from("cars")
    .select(
      "id, slug, brand, title, year, price, transmission, mileage, description, car_images(url, position)"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (!data) return null;

  const { car_images, ...car } = data as unknown as Row;
  return {
    ...car,
    images: [...car_images]
      .sort((a, b) => a.position - b.position)
      .map((i) => i.url),
  };
});