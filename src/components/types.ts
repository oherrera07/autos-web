export type Car = {
  id: string;
  slug: string;
  brand: string;
  title: string;
  year: number | null;
  price: number;
  transmission: string;
  mileage: number;
  description?: string | null;
  images: string[];
};