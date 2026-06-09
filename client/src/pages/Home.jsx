import { useState, useEffect } from "react";
import HeroBanner from "../components/HeroBanner";
import ProductGrid from "../components/ProductGrid";
import "./Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?limit=8")
      .then((r) => r.json())
      .then((data) => setProducts(data.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <HeroBanner />

      <div className="container">
        <div className="home-categories">
          {[
            { icon: "✨", label: "Chăm sóc da", link: "/san-pham?category=cham-soc-da" },
            { icon: "💄", label: "Trang điểm", link: "/san-pham?category=trang-diem" },
            { icon: "🌿", label: "Thiên nhiên", link: "/san-pham" },
            { icon: "⭐", label: "Bán chạy", link: "/san-pham" },
          ].map((cat) => (
            <a key={cat.label} href={cat.link} className="home-category-card">
              <span className="home-category-card__icon">{cat.icon}</span>
              <span className="home-category-card__label">{cat.label}</span>
            </a>
          ))}
        </div>

        <ProductGrid products={products} loading={loading} title="Sản phẩm nổi bật" />
      </div>

      <div className="home-banner-strip">
        <div className="container home-banner-strip__inner">
          <div className="home-banner-strip__item">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <div>
              <strong>Giao hàng miễn phí</strong>
              <p>Cho đơn hàng từ 120.000đ</p>
            </div>
          </div>
          <div className="home-banner-strip__item">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            <div>
              <strong>Đổi trả dễ dàng</strong>
              <p>Trong vòng 30 ngày</p>
            </div>
          </div>
          <div className="home-banner-strip__item">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div>
              <strong>Hàng chính hãng</strong>
              <p>Cam kết 100% chính hãng</p>
            </div>
          </div>
          <div className="home-banner-strip__item">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.9 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <div>
              <strong>Hỗ trợ 24/7</strong>
              <p>0971225845</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
