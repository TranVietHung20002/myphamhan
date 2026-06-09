import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../components/ProductCard";
import "./Checkout.css";

const PROVINCES = [
  "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ",
  "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu",
  "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước",
  "Bình Thuận", "Cà Mau", "Cao Bằng", "Đắk Lắk", "Đắk Nông",
  "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang",
  "Hà Nam", "Hà Tĩnh", "Hải Dương", "Hậu Giang", "Hòa Bình",
  "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu",
  "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định",
  "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên",
  "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị",
  "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên",
  "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "Trà Vinh", "Tuyên Quang",
  "Vĩnh Long", "Vĩnh Phúc", "Yên Bái",
];

const PAYMENT_METHODS = [
  { id: "cod", label: "Thanh toán khi nhận hàng (COD)", icon: "💵" },
  { id: "momo", label: "Ví MoMo", icon: "💜" },
];

export default function Checkout() {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=info, 2=success
  const [payment, setPayment] = useState("cod");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [orderSnapshot, setOrderSnapshot] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    note: "",
  });

  const freeShip = totalPrice >= 120000;
  const shipping = freeShip ? 0 : 30000;
  const total = totalPrice + shipping;

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Vui lòng nhập họ tên";
    if (!/^0\d{9}$/.test(form.phone)) e.phone = "Số điện thoại không hợp lệ (VD: 0901234567)";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email không hợp lệ";
    if (!form.province) e.province = "Vui lòng chọn tỉnh/thành";
    if (!form.address.trim()) e.address = "Vui lòng nhập địa chỉ cụ thể";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }

    setSubmitting(true);
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form, items, totalPrice, shipping, total, payment }),
      });
    } catch (_) {}

    setOrderSnapshot({ items: [...items], total, shipping, totalPrice });
    setSubmitting(false);
    setStep(2);
    clearCart();
  };

  if (items.length === 0 && step === 1) {
    return (
      <div className="checkout-empty container">
        <div className="checkout-empty__icon">🛒</div>
        <h2>Giỏ hàng trống</h2>
        <p>Thêm sản phẩm vào giỏ trước khi thanh toán.</p>
        <Link to="/san-pham" className="btn-primary">Mua sắm ngay</Link>
      </div>
    );
  }

  if (step === 2 && orderSnapshot) {
    return (
      <div className="checkout-success container">
        <div className="checkout-success__icon">✅</div>
        <h2>Đặt hàng thành công!</h2>
        <p>Cảm ơn <strong>{form.fullName}</strong>! Đơn hàng của bạn đã được ghi nhận.</p>
        <p className="checkout-success__sub">Chúng tôi sẽ liên hệ qua <strong>{form.phone}</strong> để xác nhận trong vòng 30 phút.</p>

        <div className="checkout-success__items">
          {orderSnapshot.items.map((item) => (
            <div key={item.id} className="checkout-success__item-row">
              <span className="checkout-success__item-name">{item.name}</span>
              <span className="checkout-success__item-qty">x{item.qty}</span>
              <span className="checkout-success__item-price">{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
        </div>

        <div className="checkout-success__info">
          <div><span>Giao đến:</span><strong>{form.address}, {form.province}</strong></div>
          <div><span>Thanh toán:</span><strong>{PAYMENT_METHODS.find(p => p.id === payment)?.label}</strong></div>
          <div><span>Tổng tiền:</span><strong className="checkout-success__total">{formatPrice(orderSnapshot.total)}</strong></div>
        </div>
        <Link to="/" className="btn-primary" onClick={() => setStep(1)}>Tiếp tục mua sắm</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-page__hero">
        <div className="container">
          <nav className="checkout-breadcrumb">
            <Link to="/">Trang chủ</Link> / <Link to="/san-pham">Sản phẩm</Link> / Thanh toán
          </nav>
          <h1>Thanh toán</h1>
        </div>
      </div>

      <div className="container checkout-layout">
        {/* LEFT — Form */}
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>

          {/* Section 1: Thông tin cá nhân */}
          <section className="checkout-section">
            <h2 className="checkout-section__title">
              <span>1</span> Thông tin người nhận
            </h2>

            <div className="form-row">
              <div className={`form-group${errors.fullName ? " form-group--error" : ""}`}>
                <label>Họ và tên <em>*</em></label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  autoComplete="name"
                />
                {errors.fullName && <span className="form-error">{errors.fullName}</span>}
              </div>
              <div className={`form-group${errors.phone ? " form-group--error" : ""}`}>
                <label>Số điện thoại <em>*</em></label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="0901 234 567"
                  type="tel"
                  autoComplete="tel"
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>
            </div>

          </section>

          {/* Section 2: Địa chỉ giao hàng */}
          <section className="checkout-section">
            <h2 className="checkout-section__title">
              <span>2</span> Địa chỉ giao hàng
            </h2>

            <div className="form-row form-row--3">
              <div className={`form-group${errors.province ? " form-group--error" : ""}`}>
                <label>Tỉnh / Thành phố <em>*</em></label>
                <select name="province" value={form.province} onChange={handleChange}>
                  <option value="">-- Chọn tỉnh/thành --</option>
                  {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                {errors.province && <span className="form-error">{errors.province}</span>}
              </div>
              <div className="form-group">
                <label>Quận / Huyện</label>
                <input name="district" value={form.district} onChange={handleChange} placeholder="Quận / Huyện" />
              </div>
              <div className="form-group">
                <label>Phường / Xã</label>
                <input name="ward" value={form.ward} onChange={handleChange} placeholder="Phường / Xã" />
              </div>
            </div>

            <div className={`form-group${errors.address ? " form-group--error" : ""}`}>
              <label>Địa chỉ cụ thể <em>*</em></label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Số nhà, tên đường..."
                autoComplete="street-address"
              />
              {errors.address && <span className="form-error">{errors.address}</span>}
            </div>

            <div className="form-group">
              <label>Ghi chú đơn hàng</label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Ghi chú thêm cho người giao hàng (nếu có)..."
                rows={3}
              />
            </div>
          </section>

          {/* Section 3: Phương thức thanh toán */}
          <section className="checkout-section">
            <h2 className="checkout-section__title">
              <span>3</span> Phương thức thanh toán
            </h2>
            <div className="payment-methods">
              {PAYMENT_METHODS.map((m) => (
                <label key={m.id} className={`payment-method${payment === m.id ? " payment-method--active" : ""}`}>
                  <input type="radio" name="payment" value={m.id} checked={payment === m.id} onChange={() => setPayment(m.id)} />
                  <span className="payment-method__icon">{m.icon}</span>
                  <span className="payment-method__label">{m.label}</span>
                  {payment === m.id && (
                    <svg className="payment-method__check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </label>
              ))}
            </div>
          </section>

          <button type="submit" className="btn-primary checkout-submit" disabled={submitting}>
            {submitting ? "ĐANG XỬ LÝ..." : `ĐẶT HÀNG NGAY (${totalItems} sản phẩm)`}
          </button>
        </form>

        {/* RIGHT — Order summary */}
        <aside className="checkout-summary">
          <h2 className="checkout-summary__title">Đơn hàng ({totalItems} sản phẩm)</h2>

          <ul className="checkout-summary__list">
            {items.map((item) => (
              <li key={item.id} className="checkout-summary__item">
                <div className="checkout-summary__img">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="checkout-summary__qty">{item.qty}</span>
                </div>
                <span className="checkout-summary__name">{item.name}</span>
                <span className="checkout-summary__price">{formatPrice(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>

          <div className="checkout-summary__totals">
            <div className="checkout-summary__row">
              <span>Tạm tính</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="checkout-summary__row">
              <span>Phí vận chuyển</span>
              <span>{shipping === 0 ? <em className="free-ship">Miễn phí</em> : formatPrice(shipping)}</span>
            </div>
            {shipping === 0 ? (
              <p className="checkout-summary__free-note">🎉 Bạn được miễn phí vận chuyển!</p>
            ) : (
              <p className="checkout-summary__free-note" style={{background:"#fef3c7",color:"#92400e"}}>
                💡 Mua thêm <strong>{formatPrice(120000 - totalPrice)}</strong> để được miễn phí ship
              </p>
            )}
            <div className="checkout-summary__row checkout-summary__row--total">
              <span>Tổng cộng</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
