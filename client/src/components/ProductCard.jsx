import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

function Stars({ rating }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? "star star--filled" : "star"}>★</span>
      ))}
    </div>
  );
}

export function formatPrice(price) {
  return price.toLocaleString("vi-VN") + " đ";
}

const BADGE_CLASS = {
  "Sale":      "product-card__badge--sale",
  "Hot":       "product-card__badge--hot",
  "Mới":       "product-card__badge--new",
  "Bán chạy":  "product-card__badge--bestseller",
};

const BUTTON_CONFIG = {
  add_to_cart:  { label: "Thêm vào giỏ", disabled: false, cls: ""                        },
  out_of_stock: { label: "Hết hàng",     disabled: true,  cls: " product-card__btn--out" },
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const badgeClass = `product-card__badge${product.badge && BADGE_CLASS[product.badge] ? " " + BADGE_CLASS[product.badge] : ""}`;
  const btnCfg = BUTTON_CONFIG[product.buttonMode] ?? BUTTON_CONFIG.add_to_cart;
  const productId = product._id || product.id;

  return (
    <div className="product-card">
      {product.badge && <span className={badgeClass}>{product.badge}</span>}

      <Link to={`/san-pham/${productId}`} className="product-card__img-wrap">
        {product.image ? (
          <img
            src={`/api/upload/image/${product.image}`}
            alt={product.name}
            className="product-card__img"
            onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
          />
        ) : null}
        <div className="product-card__img-placeholder" style={product.image ? { display: "none" } : {}}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <div className="product-card__overlay">
          <span className="product-card__detail">Xem chi tiết</span>
        </div>
      </Link>

      <div className="product-card__body">
        <Link to={`/san-pham/${productId}`}>
          <h3 className="product-card__name">{product.name}</h3>
        </Link>
        <Stars rating={product.rating} />
        <div className="product-card__footer">
          <span className="product-card__price">{formatPrice(product.price)}</span>
          <button
            className={`btn-primary product-card__btn${added ? " product-card__btn--added" : btnCfg.cls}`}
            onClick={btnCfg.disabled ? undefined : handleAdd}
            disabled={btnCfg.disabled}
          >
            {added ? "Đã thêm ✓" : btnCfg.label}
          </button>
        </div>
      </div>
    </div>
  );
}
