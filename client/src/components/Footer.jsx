import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__col">
          <h3 className="footer__logo">MỸ PHẨM <span>90+</span></h3>
          <p className="footer__desc">Khám phá vẻ đẹp tự nhiên của bạn cùng các sản phẩm chất lượng cao từ Mỹ Phẩm 90+.</p>
          <div className="footer__social">
            <a href="#" aria-label="Facebook" className="footer__social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className="footer__social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="#" aria-label="TikTok" className="footer__social-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer__col">
          <h4 className="footer__heading">Về chúng tôi</h4>
          <ul className="footer__links">
            <li><a href="#">Về chúng tôi</a></li>
            <li><a href="#">Chính sách</a></li>
            <li><a href="#">Điều khoản</a></li>
            <li><a href="#">Trang điểm</a></li>
            <li><a href="#">Thương hiệu</a></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__heading">Chính sách</h4>
          <ul className="footer__links">
            <li><a href="#">Điều kiện</a></li>
            <li><a href="#">Chính sách</a></li>
            <li><a href="#">Bảo mật</a></li>
            <li><a href="#">Đổi trả</a></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__heading">Liên hệ</h4>
          <ul className="footer__links">
            <li>TP. Hồ Chí Minh</li>
            <li>
              <a href="tel:0971225845">0971225845</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© 2024 Mỹ phẩm 90+. All Rights Reserved</p>
      </div>
    </footer>
  );
}
