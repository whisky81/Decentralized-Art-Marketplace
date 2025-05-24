# Hướng dẫn Chạy Demo Dự án

## Yêu cầu Cài đặt

1. **Node.js (phiên bản LTS mới nhất)**: Môi trường chạy JavaScript. Tải tại [nodejs.org](https://nodejs.org/).  
   * Sau khi cài đặt, mở Terminal (hoặc Command Prompt/PowerShell) và kiểm tra:
     ```bash
     node -v
     npm -v
     ```
2. **MetaMask Extension**: Ví điện tử để tương tác với DApp. Cài đặt cho trình duyệt tại [metamask.io](https://metamask.io/).

## Chạy Demo

### 1. Khởi chạy Local Node (Blockchain cục bộ)

1. **Cài đặt thư viện dự án:**  
   * Mở Terminal, di chuyển đến thư mục gốc (src) của dự án.  
   * Chạy lệnh:
     ```bash
     npm install
     ```
2. **Biên dịch smart contract:**
   * Tại thư mục gốc của dự án src chạy:
     ```bash
     npx hardhat compile
     ```

2. **Khởi động Local Node:**  
   * Tại thư mục gốc dự án, chạy:
     ```bash
     npx hardhat node
     ```
   * Lệnh này sẽ khởi chạy một mạng Ethereum giả lập. Bạn sẽ thấy danh sách các tài khoản thử nghiệm (Account #0, Account #1,...) và **Private Key** tương ứng của chúng.  
   * **Quan trọng:** Giữ Terminal này mở trong suốt quá trình demo.

3. **Kết nối MetaMask với Local Node và Import Tài khoản Thử Nghiệm:**  
   * Mở MetaMask trên trình duyệt của bạn.  
   * **Thêm mạng Hardhat Localhost (nếu chưa có):**  
     - Nhấp vào danh sách mạng hiện tại (thường là "Ethereum Mainnet").  
     - Chọn "Add network" (Thêm mạng).  
     - Nếu có tùy chọn "Add a network manually" (Thêm mạng thủ công), hãy chọn nó.  
     - Điền thông tin sau:  
       - Network Name (Tên mạng): `Hardhat Localhost` (hoặc tên tùy ý)  
       - New RPC URL (URL RPC mới): `http://127.0.0.1:8545`  
       - Chain ID (ID chuỗi): `31337`  
       - Currency Symbol (Ký hiệu tiền tệ - tùy chọn): `ETH`  
     - Nhấp "Save" (Lưu). MetaMask sẽ tự động chuyển sang mạng này.  
   * **Import tài khoản thử nghiệm vào MetaMask:**  
     - Đảm bảo MetaMask đang ở mạng "Hardhat Localhost" vừa thêm.  
     - Nhấp vào biểu tượng tài khoản (hình tròn) ở góc trên bên phải, chọn "Import account" (Nhập tài khoản).  
     - Quay lại Terminal đang chạy `npx hardhat node`, **copy một trong các giá trị "PRIVATE KEY"** (ví dụ của Account #0).  
     - Dán Private Key đã copy vào ô "Private Key" trong MetaMask và nhấp "Import".  
     - Tài khoản này sẽ có sẵn ETH để thực hiện giao dịch trên mạng local.  
     - **Lưu ý:** Tuyệt đối không sử dụng các private key này cho tài sản thật.

4. **Triển khai Smart Contract:**  
   * Mở một **Terminal mới** (giữ nguyên Terminal đang chạy `npx hardhat node`).  
   * Di chuyển đến thư mục gốc dự án src trong Terminal mới này.  
   * Chạy lệnh:
     ```bash
     npx hardhat ignition deploy ./ignition/modules/Whisky.js --network localhost
     ```
### 2. Khởi chạy Express Pinata Server 
### 3. Khởi chạy Giao diện Người dùng (Frontend)

1. **Cài đặt thư viện Frontend:**  
   * Mở Terminal (có thể sử dụng lại Terminal thứ hai hoặc mở một Terminal mới).  
   * Di chuyển vào thư mục `frontend` của dự án:
     ```bash
     cd frontend
     ```
   * Chạy lệnh:
     ```bash
     npm install
     ```

2. **Khởi chạy ứng dụng Frontend:**  
   * Trong Terminal tại thư mục `frontend`, chạy:
     ```bash
     npm run dev
     ```
   * Mở trình duyệt web và truy cập địa chỉ URL hiển thị trong Terminal (thường là `http://localhost:xxxx`, ví dụ `http://localhost:3000` hoặc `http://localhost:5173`).  
   * Khi được yêu cầu trên trang web, hãy kết nối MetaMask và chọn tài khoản bạn vừa import để tương tác với ứng dụng.

---

**Lưu ý:**  
* Cần giữ Terminal chạy `npx hardhat node` trong suốt quá trình demo để blockchain cục bộ hoạt động.  
* Các private key từ `npx hardhat node` chỉ dành cho mục đích thử nghiệm trên mạng cục bộ, **không sử dụng cho tài sản thật**.

---
