
# Nếu chưa cài ngrok trên máy, tải tại https://ngrok.com/download và giải nén vào PATH.
    ngrok version
    # Đăng ký tài khoản miễn phí trên ngrok.com → vào Dashboard → Copy “Your Authtoken”
    # Sau khi có token, chạy lệnh sau để cấu hình ngrok:
    ngrok config add-authtoken <YOUR_AUTHTOKEN>
- **ngrok** (dùng để expose localhost lên public URL) 
---
## 🔧 1. Backend Setup
1. **update file .env trong thư mục backend/ với nội dung mẫu:**
    # ZaloPay Credentials (sandbox) (vào link https://docs.zalopay.vn/v2/start/ để lấy 3 trường này)
    ZP_APP_ID=2554
    ZP_KEY1=sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn
    ZP_KEY2=trMrHtvjo6myautxDUiAcYsVtaeQ8nhf

    # URLs (sẽ dùng ngrok)
    # → Bạn sẽ chạy ngrok để lấy <NGROK_DOMAIN>
    ZP_REDIRECT_URL=http://localhost:3000/products
    ZP_CALLBACK_URL=https://<NGROK_DOMAIN>.ngrok-free.app/api/payments/zalo-callback

    ngrok http 5000 // lệnh chạy ngrok

4. **Kiểm thử**
    # Tiếp tục vào https://docs.zalopay.vn/v2/start/ mục "Thông tin thẻ ngân hàng - sử dụng cho việc test tích hợp Cổng ZaloPay" để test phần Credit Card
    # Nếu muốn test QR thì phải tải zalopay QC về



