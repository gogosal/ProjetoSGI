"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import RecordPlayerViewer from "@/components/RecordPlayerViewer";
import { materialPresets } from "@/lib/textures";
import { Star, ShoppingCart, Heart } from "lucide-react";
import Slider from "react-slick";

// --- Dados estáticos externos ---
import { reviews, highlights, badges } from "@/lib/data";

// --- Componentes auxiliares ---
const StarRating = ({ value }) => (
  <div className="flex items-center gap-1 text-amber-500">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className="h-5 w-5"
        strokeWidth={1.5}
        fill={value > i ? "currentColor" : "none"}
      />
    ))}
  </div>
);

const ProductHeader = () => (
  <header className="border-b bg-white shadow-sm">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
      <img src="/images/La-redoute-logo.png" className="h-10" alt="logo" />
      <nav className="flex gap-6 text-sm font-medium text-slate-600">
        {["Áudio", "Vinil", "Colunas", "Acessórios", "Promoções"].map((item) => (
          <a
            key={item}
            href="#"
            className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-[#2b0f84] after:transition-transform after:origin-left hover:after:scale-x-100"
          >
            {item}
          </a>
        ))}
      </nav>
    </div>
  </header>
);

const ProductGallery = ({ activePreset, setActivePreset, presets }) => {
  const presetOrder = ["default", "luxo", "moderno", "vintage"];
  const fallback = "/images/Wood.png";

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-white shadow-lg overflow-hidden">
        <div className="aspect-square">
          <RecordPlayerViewer preset={activePreset} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {presetOrder.map((key) => {
          const preset = presets[key];
          if (!preset) return null;
          const isActive = activePreset === key;
          const thumbnail = preset.thumbnail || fallback;

          return (
            <button
              key={key}
              onClick={() => setActivePreset(key)}
              className={`rounded-2xl border transition-all duration-200 p-1 ${isActive
                  ? "border-[#2b0f84] bg-[#2b0f84]/10 shadow-inner"
                  : "border-slate-200 hover:border-[#2b0f84]/50 hover:shadow-md"
                }`}
            >
              <img
                src={thumbnail}
                alt={preset.name}
                className="h-20 w-20 rounded-2xl object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ProductHighlights = () => (
  <div className="rounded-3xl border bg-white p-6 shadow-md">
    <h2 className="text-xl font-semibold text-slate-800">Detalhes do produto</h2>
    <ul className="mt-4 space-y-3 text-sm text-slate-600">
      {highlights.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-1 h-3 w-3 rounded-full bg-[#2b0f84]" />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const ProductReviews = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">Avaliações</h2>
      <Slider {...settings}>
        {reviews.map((r) => (
          <div key={r.id} className="p-3">
            <article className="rounded-2xl border bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-200 h-full flex flex-col justify-between">
              <div className="flex justify-between text-sm mb-3">
                <div>
                  <div className="font-semibold text-slate-800">{r.author}</div>
                  <div className="text-xs text-slate-400 uppercase">
                    Compra verificada
                  </div>
                </div>
                <div className="text-xs text-slate-500">{r.date}</div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <StarRating value={r.rating} />
                <h3 className="font-medium text-slate-700">{r.title}</h3>
              </div>
              <p className="text-slate-600 text-sm">{r.content}</p>
            </article>
          </div>
        ))}
      </Slider>
    </section>
  );
};

const Footer = () => (
  <footer className="border-t bg-white mt-16">
    <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-slate-600">
      <img src="/images/La-redoute-logo.png" className="h-8" alt="logo" />
      <p className="mt-2 max-w-md text-slate-500">
        Inspiração diária para tornar cada divisão mais acolhedora.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row justify-between text-xs text-slate-500 border-t pt-4 gap-3 sm:gap-0">
        <span>
          © {new Date().getFullYear()} La Redoute. Todos os direitos reservados.
        </span>
        <div className="flex gap-4">
          {["Termos", "Privacidade", "Cookies"].map((item) => (
            <a key={item} href="#" className="hover:text-slate-700">
              {item}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default function RecordPlayerPage() {
  const [preset, setPreset] = useState("default");

  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      <ProductHeader />

      <main className="mx-auto max-w-6xl px-6 py-12 space-y-14">
        <section className="grid gap-10 lg:grid-cols-2">
          <ProductGallery
            activePreset={preset}
            setActivePreset={setPreset}
            presets={materialPresets}
          />

          <aside className="space-y-6">
            <div className="rounded-3xl border bg-white p-6 shadow-lg">
              <h1 className="text-3xl font-bold text-slate-900">
                Gira-discos vintage LX-80
              </h1>
              <StarRating value={4} />
              <div className="mt-6 flex gap-4">
                <Button className="flex items-center gap-2 bg-[#2b0f84] hover:bg-[#3c1db2] text-white">
                  <ShoppingCart className="h-5 w-5" /> Adicionar
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-slate-300 hover:border-[#2b0f84]"
                >
                  <Heart className="h-5 w-5 text-[#2b0f84]" />
                </Button>
              </div>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
                {badges.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-slate-700">
                    <Icon className="h-5 w-5 text-[#2b0f84]" /> {label}
                  </div>
                ))}
              </div>
            </div>

            <ProductHighlights />
          </aside>
        </section>

        <ProductReviews />
      </main>

      <Footer />
    </div>
  );
}
