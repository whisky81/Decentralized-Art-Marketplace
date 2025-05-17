# Hướng dẫn Chạy Demo Dự án
## Yêu cầu Cài đặt (Quan trọng)
1.  **Node.js**: Đây là môi trường để chạy mã JavaScript phía máy chủ.
    * Truy cập [https://nodejs.org/](https://nodejs.org/) để tải về và cài đặt phiên bản Node.js phù hợp với hệ điều hành của bạn. Chúng tôi khuyến nghị sử dụng phiên bản LTS (Long Term Support) mới nhất.
2.  **npm (Node Package Manager)**: npm thường được cài đặt kèm với Node.js. Đây là công cụ giúp bạn quản lý các thư viện (packages) cần thiết cho dự án.
    * Sau khi cài đặt Node.js, bạn có thể kiểm tra phiên bản npm bằng cách mở terminal (hoặc Command Prompt/PowerShell trên Windows) và gõ lệnh: `npm -v`
3.  **MetaMask Extension**: Đây là một ví tiền điện tử dưới dạng tiện ích mở rộng cho trình duyệt, giúp bạn tương tác với các ứng dụng phi tập trung (DApps).
    * Truy cập [https://metamask.io/](https://metamask.io/) và làm theo hướng dẫn để cài đặt MetaMask cho trình duyệt của bạn (ví dụ: Chrome, Firefox, Brave, Edge).

## Chạy Demo

Sau khi đã hoàn tất các yêu cầu cài đặt ở trên, bạn có thể tiến hành chạy demo theo các bước sau:

### Phần 1: Khởi chạy Local Node (Môi trường Blockchain cục bộ)

Bước này sẽ thiết lập một blockchain giả lập trên máy tính của bạn để thử nghiệm.

1.  **Cài đặt các thư viện cần thiết cho Local Node:**
    * Mở terminal của bạn.
    * Di chuyển đến thư mục gốc của dự án.
    * Chạy lệnh sau để tải về và cài đặt các gói phụ thuộc được định nghĩa trong file `package.json`:
        ```bash
        npm install
        ```
        *Lưu ý:* Lệnh này thường được viết tắt là `npm i`.

2.  **Khởi động Local Node với Hardhat:**
    * Vẫn trong terminal tại thư mục gốc của dự án, chạy lệnh:
        ```bash
        npx hardhat node
        ```
    * Lệnh này sẽ khởi chạy một phiên bản Hardhat Network cục bộ, mô phỏng một mạng Ethereum trên máy của bạn. Bạn sẽ thấy danh sách các tài khoản thử nghiệm và private key của chúng (tuyệt đối không sử dụng các private key này cho tài sản thật).

3.  **Triển khai Smart Contract lên Local Node:**
    * Mở một **terminal mới** (giữ nguyên terminal đang chạy `npx hardhat node`).
    * Di chuyển đến thư mục gốc của dự án trong terminal mới này.
    * Chạy lệnh sau để triển khai smart contract có tên `Whisky.js` (nằm trong thư mục `ignition/modules/`) lên mạng cục bộ (`localhost`) mà bạn vừa khởi chạy:
        ```bash
        npx hardhat ignition deploy ./ignition/modules/Whisky.js --network localhost
        ```

### Phần 2: Khởi chạy Giao diện Người dùng (Frontend)

Bước này sẽ khởi động ứng dụng web để bạn có thể tương tác với smart contract đã triển khai.

1.  **Cài đặt các thư viện cần thiết cho Frontend:**
    * Mở terminal (có thể sử dụng lại terminal thứ hai hoặc mở một terminal mới).
    * Di chuyển vào thư mục `frontend` của dự án:
        ```bash
        cd frontend
        ```
    * Chạy lệnh sau để tải về và cài đặt các gói phụ thuộc cho phần giao diện:
        ```bash
        npm install
        ```
        *Lưu ý:* Lệnh này thường được viết tắt là `npm i`.

2.  **Khởi chạy ứng dụng Frontend:**
    * Vẫn trong terminal tại thư mục `frontend`, chạy lệnh:
        ```bash
        npm run dev
        ```
    * Lệnh này sẽ khởi động một máy chủ phát triển cục bộ (development server) cho ứng dụng frontend. Sau khi quá trình biên dịch hoàn tất, bạn sẽ thấy một địa chỉ URL (thường là `http://localhost:xxxx` với `xxxx` là một số cổng, ví dụ `http://localhost:3000` hoặc `http://localhost:5173`) trong terminal.
    * Mở trình duyệt web của bạn và truy cập vào địa chỉ URL đó để xem và tương tác với ứng dụng.
---
