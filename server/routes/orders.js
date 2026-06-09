const express = require("express");
const router = express.Router();
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/orders — nhận đơn hàng + gửi email
router.post("/", async (req, res) => {
  const { form, items, totalPrice, shipping, total, payment } = req.body;

  if (!form || !items || items.length === 0) {
    return res.status(400).json({ message: "Dữ liệu đơn hàng không hợp lệ" });
  }

  const PAYMENT_LABEL = {
    cod: "Thanh toán khi nhận hàng (COD)",
    momo: "Ví MoMo",
  };

  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 16px;border-bottom:1px solid #f0e8de;">${item.name}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #f0e8de;text-align:center;">${item.qty}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #f0e8de;text-align:right;font-weight:600;">
          ${(item.price * item.qty).toLocaleString("vi-VN")}đ
        </td>
      </tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5efe6;font-family:'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">

    <!-- Header -->
    <div style="background:#1a1a1a;padding:28px 32px;">
      <h1 style="margin:0;color:#fff;font-size:22px;letter-spacing:-0.5px;">MỸ PHẨM <span style="color:#C8956B;">90+</span></h1>
      <p style="margin:6px 0 0;color:#aaa;font-size:13px;">Xác nhận đơn hàng</p>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <h2 style="margin:0 0 8px;font-size:18px;color:#1a1a1a;">Cảm ơn bạn đã đặt hàng! 🎉</h2>
      <p style="margin:0 0 24px;color:#666;font-size:14px;">
        Xin chào <strong>${form.fullName}</strong>, đơn hàng của bạn đã được ghi nhận thành công.
        Chúng tôi sẽ liên hệ qua <strong>${form.phone}</strong> để xác nhận trong vòng 30 phút.
      </p>

      <!-- Thông tin giao hàng -->
      <div style="background:#fdf9f5;border-radius:10px;padding:18px 20px;margin-bottom:24px;">
        <h3 style="margin:0 0 12px;font-size:13px;text-transform:uppercase;letter-spacing:.8px;color:#888;">Thông tin giao hàng</h3>
        <p style="margin:4px 0;font-size:14px;color:#1a1a1a;"><strong>Người nhận:</strong> ${form.fullName}</p>
        <p style="margin:4px 0;font-size:14px;color:#1a1a1a;"><strong>Điện thoại:</strong> ${form.phone}</p>
        <p style="margin:4px 0;font-size:14px;color:#1a1a1a;"><strong>Địa chỉ:</strong> ${form.address}${form.district ? ", " + form.district : ""}, ${form.province}</p>
        <p style="margin:4px 0;font-size:14px;color:#1a1a1a;"><strong>Thanh toán:</strong> ${PAYMENT_LABEL[payment] || payment}</p>
        ${form.note ? `<p style="margin:4px 0;font-size:14px;color:#1a1a1a;"><strong>Ghi chú:</strong> ${form.note}</p>` : ""}
      </div>

      <!-- Danh sách sản phẩm -->
      <h3 style="margin:0 0 12px;font-size:13px;text-transform:uppercase;letter-spacing:.8px;color:#888;">Sản phẩm đã đặt</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
        <thead>
          <tr style="background:#f5efe6;">
            <th style="padding:10px 16px;text-align:left;font-size:12px;color:#888;font-weight:600;">SẢN PHẨM</th>
            <th style="padding:10px 16px;text-align:center;font-size:12px;color:#888;font-weight:600;">SL</th>
            <th style="padding:10px 16px;text-align:right;font-size:12px;color:#888;font-weight:600;">THÀNH TIỀN</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <!-- Tổng tiền -->
      <div style="border-top:2px solid #f0e8de;padding-top:16px;">
        <div style="display:flex;justify-content:space-between;font-size:14px;color:#666;margin-bottom:8px;">
          <span>Tạm tính</span><span>${totalPrice.toLocaleString("vi-VN")}đ</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:14px;color:#666;margin-bottom:12px;">
          <span>Phí vận chuyển</span>
          <span>${shipping === 0 ? '<span style="color:#16a34a;font-weight:600;">Miễn phí</span>' : shipping.toLocaleString("vi-VN") + "đ"}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:700;color:#1a1a1a;">
          <span>Tổng cộng</span><span style="color:#C8956B;">${total.toLocaleString("vi-VN")}đ</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f5efe6;padding:20px 32px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#999;">© 2024 Mỹ Phẩm 90+ · Hotline: <a href="tel:0971225845" style="color:#C8956B;">0971225845</a></p>
    </div>
  </div>
</body>
</html>`;

  try {
    const recipients = [process.env.SHOP_EMAIL];
    if (form.email) recipients.push(form.email);

    await resend.emails.send({
      from: "Mỹ Phẩm 90+ <onboarding@resend.dev>",
      to: recipients,
      subject: `🛍 Đơn hàng mới từ ${form.fullName} — ${total.toLocaleString("vi-VN")}đ`,
      html,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Lỗi gửi email:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
