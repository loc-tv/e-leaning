CẤU TRÚC THƯ MỤC:
-------------------
📦 project-folder/
 ┣ 📂 node_modules/       # Thư viện npm (tự động cài đặt sau khi chạy npm install)
 ┣ 📂 public/             # Static files (CSS, JS, images)
 ┃ ┣ 📂 css/             # style.css - định dạng giao diện
 ┃ ┣ 📂 js/              # script.js - xử lý JS phía client
 ┃ ┗ 📂 images/          # chứa hình ảnh dùng trong website
 ┣ 📂 views/              # Giao diện động sử dụng Handlebars (hbs)
 ┃ ┣ 📂 layouts/         # layout chính (main.hbs)
 ┃ ┣ 📂 partials/        # phần giao diện dùng lại (header.hbs)
 ┃ ┣ home.hbs, form.hbs, result.hbs
 ┣ 📂 config/             # Cấu hình kết nối MySQL (db.js)
 ┣ 📂 routes/             # Khai báo đường dẫn (index.js)
 ┣ 📂 models/             # Tương tác với cơ sở dữ liệu (userModel.js)
 ┣ 📂 controllers/        # Logic điều khiển (userController.js)
 ┣ 📂 database/           # Chứa file schema.sql để tạo bảng
 ┣ 📂 logs/               # Ghi log hệ thống
 ┣ 📜 .env                # Biến môi trường (PORT, DB config)
 ┣ 📜 package.json        # Thông tin package & dependencies
 ┣ 📜 server.js           # File chính khởi tạo và chạy ứng dụng Express

HƯỚNG DẪN CÀI ĐẶT:
-------------------
1. Giải nén file e-learning.zip
2. Mở terminal tại thư mục dự án
3. Chạy lệnh:      npm install
   → Cài đặt các package cần thiết
4. Run comment sql: mysql -u root -p < database/schema.sql
5. Chạy dự án:     npm start
   hoặc:           node server.js
6. Truy cập trình duyệt tại địa chỉ: http://localhost:3000

LƯU Ý:
-------------------
- Đảm bảo đã cài Node.js và npm
- File cấu hình kết nối CSDL nằm trong: config/db.js
- File chạy chính: server.js
- Mọi thay đổi logic nên thực hiện trong controllers/ và routes/

