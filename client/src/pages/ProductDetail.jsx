import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../components/ProductCard";
import "./ProductDetail.css";

function Stars({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map((s) => (
        <span key={s} className={s <= rating ? "star star--filled" : "star"}>★</span>
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => setProduct(data.data || null))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="product-detail__loading container">Đang tải...</div>;
  if (!product) return (
    <div className="product-detail__not-found container">
      <p>Không tìm thấy sản phẩm.</p>
      <Link to="/san-pham" className="btn-primary">← Quay lại</Link>
    </div>
  );

  return (
    <div className="container product-detail">
      <nav className="product-detail__breadcrumb">
        <Link to="/">Trang chủ</Link> / <Link to="/san-pham">Sản phẩm</Link> / {product.name}
      </nav>

      <div className="product-detail__inner">
        <div className="product-detail__img">
          {product.image ? (
            <img
              src={`/api/upload/image/${product.image}`}
              alt={product.name}
              className="product-detail__img-real"
              onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
            />
          ) : null}
          <div className="product-detail__img-placeholder" style={product.image ? { display: "none" } : {}}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        </div>

        <div className="product-detail__info">
          {product.badge && <span className="product-detail__badge">{product.badge}</span>}
          <h1 className="product-detail__name">{product.name}</h1>
          <div className="product-detail__rating">
            <Stars rating={product.rating} />
            <span>({product.reviewCount} đánh giá)</span>
          </div>
          <p className="product-detail__price">{formatPrice(product.price)}</p>
          <p className="product-detail__desc">{product.description}</p>

          <div className="product-detail__stock">
            {product.inStock
              ? <span className="in-stock">✓ Còn hàng</span>
              : <span className="out-stock">✕ Hết hàng</span>}
          </div>

          <div className="product-detail__actions">
            <div className="product-detail__qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <button
              className={`btn-primary product-detail__add${added ? " product-detail__add--done" : ""}`}
              onClick={handleAdd}
              disabled={!product.inStock}
            >
              {added ? "Đã thêm vào giỏ ✓" : "THÊM VÀO GIỎ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
