import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./HeroBanner.css";

const slides = [
  {
    id: 1,
    title: 'ĐẸP RẠNG NGỜI VỚI\n"MỸ PHẨM 90+"',
    subtitle: "Khám phá vẻ đẹp tự nhiên của bạn",
    cta: "MUA NGAY",
    ctaLink: "/san-pham",
    bg: "#F0E6D8",
  },
  {
    id: 2,
    title: "CHĂM SÓC DA\nTOÀN DIỆN",
    subtitle: "Bộ sản phẩm dưỡng da cao cấp từ thiên nhiên",
    cta: "KHÁM PHÁ",
    ctaLink: "/san-pham?category=cham-soc-da",
    bg: "#D4E4D8",
  },
  {
    id: 3,
    title: "TRANG ĐIỂM\nTỰ TIN TỎA SÁNG",
    subtitle: "Bộ sưu tập son môi và phấn trang điểm mới nhất",
    cta: "XEM NGAY",
    ctaLink: "/san-pham?category=trang-diem",
    bg: "#E4D4D8",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="hero" style={{ background: slide.bg }}>
      <div className="container hero__inner">
        {/* LEFT: text */}
        <div className="hero__content">
          <h1 className="hero__title" style={{ whiteSpace: "pre-line" }}>
            {slide.title}
          </h1>
          <p className="hero__subtitle">{slide.subtitle}</p>
          <Link to={slide.ctaLink} className="btn-outline hero__cta">
            {slide.cta}
          </Link>
        </div>

      </div>

      <button className="hero__arrow hero__arrow--prev" onClick={prev} aria-label="Trước">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button className="hero__arrow hero__arrow--next" onClick={next} aria-label="Tiếp">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div className="hero__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero__dot${i === current ? " hero__dot--active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
