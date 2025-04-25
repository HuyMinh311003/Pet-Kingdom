
# 🐶 Pet Commerce Platform - MCP Server Prompt

## 🎯 MỤC TIÊU

Dự án này nhằm tạo một hệ thống thương mại điện tử chuyên về **thú cưng và vật dụng chăm sóc**, trong đó toàn bộ thiết kế cơ sở dữ liệu sẽ được sinh tự động bởi **MCP server AI**. Mục tiêu là xây dựng **cấu trúc database MongoDB** hỗ trợ tối đa cho:

- Việc viết các API RESTful rõ ràng, dễ mở rộng.
- Phục vụ tốt cho frontend hiển thị và xử lý.
- Tối ưu cho gợi ý sản phẩm, theo dõi đơn hàng, phân quyền người dùng, và các tác vụ quản trị.

## 📌 TỔNG QUAN NỘI DUNG DỰ ÁN

### 1. Loại sản phẩm

- **Thú cưng**: Mỗi con là một thực thể độc lập, có mã riêng biệt. Ví dụ: chó Husky 3 tháng tuổi đã tiêm vaccine.
- **Vật dụng**: Bán theo lô (100 cái giống nhau), ví dụ: dây xích, lược chải lông.

### 2. Chức năng chính (Frontend sẽ dùng API cho các chức năng này)

#### 2.1 Khách hàng

- Duyệt danh mục sản phẩm (theo loại, giống, giá...)
- Tìm kiếm, lọc, so sánh sản phẩm.
- Gợi ý sản phẩm liên quan (VD: mua chó sẽ gợi ý thêm dây dắt, thức ăn...)
- Thêm vào giỏ hàng, lưu giỏ hàng khi logout.
- Thanh toán tiền mặt → theo dõi đơn hàng qua nhiều giai đoạn:
  - Chờ xác nhận
  - Đã xác nhận
  - Đang giao
  - Giao thành công / Hủy / Đổi trả
- Đánh giá, nhận xét sản phẩm sau mua.

#### 2.2 Quản trị viên (Admin / Nhân viên)

- Quản lý sản phẩm (CRUD thú cưng & vật dụng).
- Quản lý đơn hàng ở các trạng thái.
- Nhập tay chi phí giao hàng (tích hợp Grab API là tuỳ chọn).
- Tạo mã khuyến mãi:
  - Áp dụng theo điều kiện giá trị đơn, loại sản phẩm hoặc thời gian.
- Thống kê theo tháng/quý/năm:
  - Doanh thu, chi phí vận chuyển, sản phẩm bán chạy, v.v.
- Phân quyền:
  - `admin`: toàn quyền.
  - `employee`: chỉ được giao hàng, xem đơn cần xử lý.

#### 2.3 Menu động

- Các danh mục sản phẩm được quản lý từ backend và ảnh hưởng trực tiếp đến menu frontend và dashboard admin.
- Menu có thể thay đổi tùy theo danh mục sản phẩm hiện tại, và tự động cập nhật UI.

## ⚠️ QUY TẮC VÀ YÊU CẦU DB QUAN TRỌNG

1. **Tách biệt thú cưng và vật dụng rõ ràng**, nhưng vẫn cho phép tìm kiếm/gợi ý kết hợp.
2. **Gợi ý sản phẩm** cần logic hỗ trợ việc truy xuất sản phẩm tương đồng hoặc liên quan.
3. **Trạng thái đơn hàng** cần phản ánh đầy đủ luồng thực tế: chờ xác nhận → shop duyệt → giao hàng → kết thúc hoặc hủy/đổi.
4. **Phân quyền rõ ràng** trong người dùng hệ thống (admin vs employee).
5. **Giỏ hàng lưu vĩnh viễn**, kể cả khi logout (tức là gắn với user).
6. **Đơn hàng lưu lại giá tại thời điểm mua**, không bị ảnh hưởng nếu sau này giá thay đổi.
7. **Thống kê doanh thu/chi phí theo thời gian** là tính năng quan trọng hỗ trợ quản trị.


