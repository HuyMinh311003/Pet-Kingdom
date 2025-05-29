# Pet Kingdom – ZaloPay Integration Guide

Hướng dẫn này sẽ giúp thiết lập và chạy demo tính năng thanh toán qua ZaloPay (QR & Credit Card) trên dự án Pet Kingdom, sử dụng môi trường sandbox (ngrok) cho callback & redirect.

---

## 📋 Prerequisites

- **Node.js** ≥ v16.x  
- **npm**
# Nếu chưa cài ngrok trên máy, tải tại https://ngrok.com/download và giải nén vào PATH.
```bash
    ngrok version
# Đăng ký tài khoản miễn phí trên ngrok.com → vào Dashboard → Copy “Your Authtoken”
# Sau khi có token, chạy lệnh sau để cấu hình ngrok:
```bash
    ngrok config add-authtoken <YOUR_AUTHTOKEN>
- **ngrok** (dùng để expose localhost lên public URL) 
- MongoDB (chạy local hoặc remote)  
- (Front-end) Create React App hoặc Next.js (tuỳ dự án)
---
## 🔧 1. Backend Setup

1. **Clone repository**  
   ```bash
   git clone <your-repo-url>
   cd pet-kingdom/backend

2. **Cài đặt dependencies**
    ```bash
    npm install
3. **Tạo file .env trong thư mục backend/ với nội dung mẫu:**
    # Server
    PORT=5000
    NODE_ENV=development

    # MongoDB
    MONGO_URI=mongodb://localhost:27017/pet-kingdom

    # JWT
    JWT_SECRET=your-super-secret-jwt-key-change-in-production
    JWT_EXPIRE=7d

    # CORS (front-end)
    CORS_ORIGIN=http://localhost:3000

    # Upload
    UPLOAD_PATH=uploads
    MAX_FILE_SIZE=5000000

    # ZaloPay Credentials (sandbox) (vào link https://docs.zalopay.vn/v2/start/ để lấy 3 trường này)
    ZP_APP_ID=2554
    ZP_KEY1=sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn
    ZP_KEY2=trMrHtvjo6myautxDUiAcYsVtaeQ8nhf

    # URLs (sẽ dùng ngrok)
    # → Bạn sẽ chạy ngrok để lấy <NGROK_DOMAIN>
    ZP_REDIRECT_URL=https://<NGROK_DOMAIN>.ngrok-free.app/products
    COMMAND=ngrok http 3000 // lệnh chạy ngrok

4. **Kiểm thử**
    # Tiếp tục vào https://docs.zalopay.vn/v2/start/ mục "Thông tin thẻ ngân hàng - sử dụng cho việc test tích hợp Cổng ZaloPay" để test phần Credit Card
    # Nếu muốn test QR thì phải tải zalopay QC về



