"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useMemo, useState } from "react";
import Slider from "react-slick";
import { Button } from "@/components/ui/button";
import RecordPlayerViewer from "@/components/RecordPlayerViewer";
import { materialPresets } from "@/lib/textures";
import { reviews, highlights, badges, ratingDistribution } from "@/lib/data";
import {
  ArrowRight,
  Heart,
  MessageCircle,
  Share2,
  ShoppingCart,
  Star,
} from "lucide-react";

// --- Constantes globais ---
const PRESET_ORDER = ["default", "luxo", "moderno", "vintage"];
const THUMBNAIL_FALLBACK = "/images/Wood.png";
const PRICE = { current: "349,00 €", previous: "399,00 €", discount: "-13%" };
const SHIPPING_OPTIONS = [
  { id: "home", title: "Entrega e calibração ao domicílio", timing: "16-21 Nov", price: "19,90 €" },
  { id: "store", title: "Levantamento em loja com sessão demo", timing: "1-2 dias úteis", price: "Grátis" },
];
const SUPPORT_MESSAGE = "Tem dúvidas sobre cápsulas ou calibração? Fale connosco no chat ao vivo ou envie uma mensagem.";

// --- Componentes genéricos ---
const StarRating = ({ value = 0, ariaLabel }) => (
  <div className="flex items-center gap-1 text-amber-500" aria-label={ariaLabel ?? `${value}/5 estrelas`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className="size-4" strokeWidth={1.5} fill={value > i ? "currentColor" : "none"} />
    ))}
  </div>
);

const ProductHeader = ({ title }) => (
  <header className="border-b bg-white">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-6 px-4 py-5">
      <img src="/images/La-redoute-logo.png" alt="La Redoute" className="h-10 w-auto" />
      <span className="ml-auto hidden text-sm font-medium text-slate-500 lg:block">{title}</span>
      <nav className="ml-auto flex flex-wrap items-center gap-5 text-sm text-slate-600">
        {["Áudio", "Vinil", "Colunas", "Acessórios", "Promoções"].map((item) => (
          <a key={item} href="#" className="hover:text-slate-900">{item}</a>
        ))}
      </nav>
    </div>
  </header>
);

const ProductGallery = ({ activePreset, onSelectPreset }) => (
  <div className="space-y-5">
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm aspect-square">
      <RecordPlayerViewer preset={activePreset} />
    </div>
    <div className="grid grid-cols-4 gap-4">
      {PRESET_ORDER.map((key) => {
        const preset = materialPresets[key];
        if (!preset) return null;
        const isActive = activePreset === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelectPreset(key)}
            aria-pressed={isActive}
            className={`group flex h-24 w-24 items-center justify-center rounded-full border transition ${isActive ? "border-[#2b0f84] bg-[#2b0f84]/10 shadow-sm" : "border-slate-200 bg-white hover:border-[#2b0f84]/60 hover:bg-[#2b0f84]/5"}`}
          >
            <img src={preset.thumbnail || THUMBNAIL_FALLBACK} alt={preset.name} className="h-20 w-20 rounded-full object-cover shadow-sm" />
          </button>
        );
      })}
    </div>
  </div>
);

const ProductInfo = ({ averageRating, reviewCount }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8 space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e02d4b]">Exclusivo online</span>
        <h1 className="text-3xl font-semibold leading-tight text-slate-900">Gira-discos vintage LX-80</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <StarRating value={Math.round(averageRating)} ariaLabel={`Classificação média ${averageRating.toFixed(1)} de 5`} />
          <span>{averageRating.toFixed(1)} · {reviewCount} avaliações</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="icon"><Share2 className="size-4" /></Button>
        <Button variant="outline" size="icon"><Heart className="size-4" /></Button>
      </div>
    </div>

    <div className="rounded-2xl bg-slate-50 p-4 space-y-2">
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-semibold text-slate-900">{PRICE.current}</span>
        <span className="text-sm text-slate-500 line-through">{PRICE.previous}</span>
        <span className="rounded-full bg-[#e02d4b]/10 px-3 py-1 text-xs font-semibold text-[#e02d4b]">{PRICE.discount}</span>
      </div>
      <p className="text-sm text-slate-600">Pagamento em 3x sem juros com Klarna. Clube Sound+ garante 10% extra em cápsulas e acessórios.</p>
    </div>

    <div className="grid gap-3 sm:grid-cols-[1.2fr_1fr]">
      <Button className="h-12 text-base font-semibold uppercase tracking-wide flex items-center justify-center gap-2"><ShoppingCart className="size-4" />Adicionar ao carrinho</Button>
      <Button variant="outline" className="h-12 text-base font-semibold">Comprar agora</Button>
    </div>

    <div className="space-y-2 text-sm text-slate-600">
      {badges.map(({ icon: Icon, label }) => (
        <span key={label} className="flex items-center gap-2"><Icon className="size-4 text-[#2b0f84]" />{label}</span>
      ))}
    </div>

    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Opções de entrega</h2>
      {SHIPPING_OPTIONS.map(({ id, title, timing, price }, idx) => (
        <label key={id} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-sm ${idx === 0 ? "border-[#2b0f84] bg-[#2b0f84]/5" : "border-slate-200 hover:border-slate-300"}`}>
          <input type="radio" name="shipping" defaultChecked={idx === 0} className="mt-1.5 size-5 accent-[#2b0f84]" />
          <div className="flex w-full items-start justify-between gap-4">
            <div><div className="font-medium text-slate-900">{title}</div><div className="text-slate-600">{timing}</div></div>
            <div className="font-semibold text-slate-900">{price}</div>
          </div>
        </label>
      ))}
    </div>

    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 flex items-center gap-3"><MessageCircle className="size-4 text-[#2b0f84]" />{SUPPORT_MESSAGE}</div>
  </div>
);

const ProductHighlights = () => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-lg font-semibold text-slate-900">Detalhes do produto</h2>
    <ul className="mt-4 space-y-3 text-sm text-slate-600">
      {highlights.map((item) => (
        <li key={item} className="flex items-start gap-2"><span className="mt-1 size-1.5 rounded-full bg-[#2b0f84]" />{item}</li>
      ))}
    </ul>
  </div>
);

const ReviewsCarousel = () => {
  const settings = useMemo(() => ({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  }), []);

  return (
    <Slider {...settings}>
      {reviews.map((r) => (
        <div key={r.id} className="px-2">
          <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <div><div className="font-semibold text-slate-900">{r.author}</div><div className="text-xs uppercase tracking-[0.2em] text-slate-400">Compra verificada</div></div>
              <div className="text-xs text-slate-500">{r.date}</div>
            </div>
            <div className="mt-3 flex items-center gap-2"><StarRating value={r.rating} /><h3 className="font-medium text-slate-900">{r.title}</h3></div>
            <p className="mt-3 text-sm text-slate-600">{r.content}</p>
          </article>
        </div>
      ))}
    </Slider>
  );
};

const ReviewsSection = ({ averageRating, reviewCount }) => {
  const recommendationPercent = ratingDistribution.filter(({ stars }) => stars >= 4).reduce((total, { percentage }) => total + percentage, 0);
  return (
    <section className="grid gap-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:p-10">
      <div className="space-y-6">
        <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Avaliação dos clientes</p>
          <div className="mt-4 flex items-end gap-4">
            <span className="text-6xl font-semibold text-slate-900">{averageRating.toFixed(1)}</span>
            <div className="space-y-2 text-sm text-slate-600">
              <StarRating value={Math.round(averageRating)} />
              <div>{reviewCount} avaliações totais</div>
              <div className="font-medium text-emerald-600">{recommendationPercent}% recomendam este artigo</div>
            </div>
          </div>
        </div>
        <div className="space-y-3 text-sm text-slate-600">
          {ratingDistribution.map(({ stars, percentage }) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="w-10">{stars}★</span>
              <div className="h-2 flex-1 rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#2b0f84]" style={{ width: `${percentage}%` }} /></div>
              <span className="w-12 text-right">{percentage}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-slate-900">Avaliações em destaque</h2>
        <ReviewsCarousel />
        <Button variant="outline" className="h-12 w-full text-base font-semibold">Ver todas as avaliações</Button>
      </div>
    </section>
  );
};

const SupportCallout = () => (
  <section className="rounded-3xl bg-gradient-to-br from-[#143f4d] via-[#0f5865] to-[#0f3059] p-10 text-white shadow-2xl flex flex-wrap items-center justify-between gap-6">
    <div className="max-w-xl space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">Em destaque</p>
      <h2 className="text-3xl font-semibold leading-snug">Complete o seu setup hi-fi com colunas activas, pré-amplificadores e suportes dedicados.</h2>
      <p className="text-sm text-white/80">Descubra combinações curadas pelos nossos especialistas de áudio e receba sugestões semanais para tirar o máximo partido da sua colecção de vinil.</p>
    </div>
    <Button className="h-12 rounded-full bg-white text-base font-semibold text-[#10395b] hover:bg-white/90 flex items-center gap-2">
      Explorar equipamentos <ArrowRight className="size-4" />
    </Button>
  </section>
);

const Footer = () => (
  <footer className="border-t bg-white">
    <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-6 px-4 py-8 text-sm text-slate-600">
      <div>
        <img src="/images/La-redoute-logo.png" alt="La Redoute" className="h-9 w-auto" />
        <p className="mt-2 max-w-sm text-sm text-slate-500">Inspiração diária para elevar cada divisão e criar experiências memoráveis.</p>
      </div>
      <div className="flex flex-wrap gap-8">
        {["Contactos", "Perguntas frequentes", "Apoio pós-venda"].map(item => <a key={item} href="#" className="hover:text-slate-900">{item}</a>)}
        {["Instagram", "Pinterest", "YouTube"].map(item => <a key={item} href="#" className="hover:text-slate-900">{item}</a>)}
      </div>
    </div>
    <div className="border-t bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-slate-500">
        <span>© {new Date().getFullYear()} La Redoute. Todos os direitos reservados.</span>
        <div className="flex flex-wrap gap-3">{["Termos & Condições", "Política de privacidade", "Cookies"].map(item => <a key={item} href="#" className="hover:text-slate-700">{item}</a>)}</div>
      </div>
    </div>
  </footer>
);

export default function RecordPlayerPage() {
  const [activePreset, setActivePreset] = useState("default");
  const reviewCount = reviews.length;
  const averageRating = useMemo(() => reviewCount ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : 0, [reviewCount]);

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-slate-900">
      <ProductHeader title="Gira-discos vintage LX-80" />
      <main className="mx-auto max-w-6xl space-y-16 px-4 py-10 lg:py-14">
        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
          <ProductGallery activePreset={activePreset} onSelectPreset={setActivePreset} />
          <aside className="space-y-6">
            <ProductInfo averageRating={averageRating} reviewCount={reviewCount} />
            <ProductHighlights />
          </aside>
        </section>
        <ReviewsSection averageRating={averageRating} reviewCount={reviewCount} />
        <SupportCallout />
      </main>
      <Footer />
    </div>
  );
}