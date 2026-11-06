"use client";

import { useMemo, useState } from "react";
import CarCard from "./CarCard";
import { Car } from "./types";

const PRICE_OPTIONS = [150000, 250000, 350000, 500000, 750000, 1000000];

export default function CarCatalog({ cars }: { cars: Car[] }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("Todas");
  const [maxPrice, setMaxPrice] = useState(0); // 0 = sin límite

  const brands = useMemo(
    () => ["Todas", ...Array.from(new Set(cars.map((c) => c.brand))).sort()],
    [cars]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cars.filter((c) => {
      const text = `${c.brand} ${c.title} ${c.year ?? ""}`.toLowerCase();
      return (
        (!q || text.includes(q)) &&
        (brand === "Todas" || c.brand === brand) &&
        (maxPrice === 0 || c.price <= maxPrice)
      );
    });
  }, [cars, query, brand, maxPrice]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <header className="bg-[#16225a]">
        <div className="mx-auto max-w-7xl px-4 pb-6 pt-5 sm:px-6">
          <p className="text-2xl font-bold tracking-tight sm:text-3xl">
            BASTION CARS
          </p>
          <h1 className="mt-6 max-w-xl text-4xl font-bold leading-tight sm:text-5xl">
            Encuentra tu próximo automóvil
          </h1>
          <p className="mt-3 text-base text-blue-100/80 sm:text-lg">
            Los mejores vehículos usados en un solo lugar.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <label className="col-span-2 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-gray-500">
              <span aria-hidden>🔍</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar marca, modelo o año..."
                className="w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-400"
              />
            </label>

            <label className="rounded-2xl bg-white px-4 py-2 text-gray-600">
              <span className="block text-sm">Marca</span>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-transparent text-lg font-semibold text-gray-900 outline-none"
              >
                {brands.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </label>

            <label className="rounded-2xl bg-white px-4 py-2 text-gray-600">
              <span className="block text-sm">Precio máximo</span>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full bg-transparent text-lg font-semibold text-gray-900 outline-none"
              >
                <option value={0}>Sin límite</option>
                {PRICE_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {fmt(p)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </header>

      {/* Listado */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h2 className="mb-5 text-2xl font-bold">Vehículos destacados</h2>

        {filtered.length === 0 ? (
          <p className="py-12 text-center text-gray-400">
            No encontramos autos con esos filtros. Prueba con otra marca o un
            precio mayor.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {filtered.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}