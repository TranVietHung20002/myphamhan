import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "./ProductCard";
import "./CartDrawer.css";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeFromCart, updateQty, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {isOpen && <div className="cart-overlay" onClick={() => setIsOpen(false)} />}
      <aside className={`cart-drawer${isOpen ? " cart-drawer--open" : ""}`}>
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">
            Giỏ hàng {totalItems > 0 && <span>({totalItems})</span>}
          </h2>
          <button className="cart-drawer__close" onClick={() => setIsOpen(false)} aria-label="Đóng">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <p>Giỏ hàng trống</p>
          </div>
        ) : (
          <>
            <ul className="cart-drawer__list">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item__img">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <div className="cart-item__info">
                    <p className="cart-item__name">{item.name}</p>
                    <p className="cart-item__price">{formatPrice(item.price)}</p>
                    <div className="cart-item__qty">
                      <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                    </div>
                  </div>
                  <button className="cart-item__remove" onClick={() => removeFromCart(item.id)} aria-label="Xóa">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__total">
                <span>Tổng cộng</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <button
                className="btn-primary cart-drawer__checkout"
                onClick={() => { setIsOpen(false); navigate("/thanh-toan"); }}
              >
                THANH TOÁN
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
