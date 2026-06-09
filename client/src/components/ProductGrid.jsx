import ProductCard from "./ProductCard";
import "./ProductGrid.css";

export default function ProductGrid({ products, loading, title }) {
  return (
    <section className="product-grid-section">
      {title && (
        <div className="product-grid-section__header">
          <h2 className="product-grid-section__title">{title}</h2>
          <div className="product-grid-section__line" />
        </div>
      )}

      {loading ? (
        <div className="product-grid product-grid--skeleton">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-img" />
              <div className="skeleton-body">
                <div className="skeleton-line" />
                <div className="skeleton-line skeleton-line--short" />
                <div className="skeleton-line skeleton-line--price" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="product-grid__empty">Không tìm thấy sản phẩm nào.</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
