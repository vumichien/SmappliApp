# 🔗 SmappliApp WebSocket Real-time Communication Setup

## Tổng quan

Hệ thống này cho phép bạn tạo một web app để thiết kế components và gửi real-time tới mobile app để build lại giao diện tự động.

## Kiến trúc

```
Web App (Builder) ←→ WebSocket Server ←→ Mobile App
                           ↕
                      HTTP API Server
```

## Cài đặt và Chạy

### 1. Chạy WebSocket Server (QUAN TRỌNG - Làm trước tiên)

#### Cách 1: Sử dụng Script (Khuyến nghị)

**Windows:**
```bash
# Mở Command Prompt hoặc PowerShell
cd C:\Project\Detomo\2025\SmappliApp\smappliapp-server

# Double-click file start-server.bat hoặc chạy:
start-server.bat
```

**Linux/Mac:**
```bash
cd /path/to/SmappliApp/smappliapp-server

# Cấp quyền thực thi (chỉ cần làm 1 lần)
chmod +x start-server.sh

# Chạy server
./start-server.sh
```

#### Cách 2: Sử dụng NPM

```bash
# Chuyển vào thư mục server
cd smappliapp-server

# Cài đặt dependencies (chỉ cần làm 1 lần)
npm install

# Chạy server
npm start
```

#### Cách 3: Chạy trực tiếp

```bash
cd smappliapp-server
node server-example.js
```

**Khi server chạy thành công, bạn sẽ thấy:**
```
🚀 SmappliApp Development Server running on port 8081
📡 WebSocket server available at ws://localhost:8081/ws
🌐 HTTP API available at http://localhost:8081/api
```

### 2. Mở Web Builder

Mở file `web-app-example.html` trong browser để sử dụng web builder.

### 3. Chạy Mobile App (Terminal mới)

```bash
# Mở terminal/command prompt MỚI
cd SmappliApp
npm start
```

**LƯU Ý:** Đừng chạy `npm start` trong thư mục `smappliapp-server` vì nó sẽ chạy React Native app thay vì WebSocket server!

## Cách sử dụng

### Từ Web App:

1. **Mở Web Builder**: Mở `web-app-example.html` trong browser
2. **Connect to Server**: Click "Connect to Server"
3. **Chọn Template**: Click một trong các template có sẵn
4. **Chỉnh sửa JSON**: Modify configuration trong textarea
5. **Send to Mobile**: Click "Send to Mobile App"

### Mobile App sẽ:

1. **Auto-connect**: Tự động kết nối WebSocket khi mở Build tab
2. **Receive Updates**: Nhận real-time updates từ web app
3. **Auto-rebuild**: Tự động rebuild giao diện với configuration mới
4. **Show Notification**: Hiển thị notification khi nhận được update

## Cấu trúc Thư mục

```
SmappliApp/
├── smappliapp-server/          # WebSocket Server (riêng biệt)
│   ├── server-example.js       # Main server file
│   ├── package.json           # Server dependencies
│   ├── start-server.bat       # Windows script
│   ├── start-server.sh        # Linux/Mac script
│   └── README.md             # Server documentation
├── app/                       # React Native app
├── services/                  # App services
├── web-app-example.html       # Web builder
└── WEBSOCKET_SETUP.md        # Hướng dẫn này
```

## API Endpoints

### HTTP API

```bash
# Health check
GET http://localhost:8081/api/health

# Get configuration
GET http://localhost:8081/api/blocks/config

# Update configuration
POST http://localhost:8081/api/blocks/config
Content-Type: application/json
{
  "blocks": [...],
  "version": "1.0.0"
}

# Trigger build from web app
POST http://localhost:8081/api/build/trigger
Content-Type: application/json
{
  "blocks": [...],
  "images": {...}
}

# Upload image
POST http://localhost:8081/api/images/upload
Content-Type: application/json
{
  "image": "data:image/png;base64,...",
  "filename": "image.png"
}

# Get image
GET http://localhost:8081/api/images/:imageId
```

### WebSocket Messages

#### From Mobile App:
```json
{
  "type": "PING",
  "source": "mobile-app"
}
```

#### From Web App:
```json
{
  "type": "BUILD_REQUEST",
  "data": {
    "blocks": [...],
    "images": {...},
    "version": "1.0.0",
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "source": "web-app"
}
```

#### Server Responses:
```json
{
  "type": "PONG",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Template Examples

### Simple Layout
```json
{
  "blocks": [
    {
      "id": "title-1",
      "type": "title",
      "content": "Hello from Web App!",
      "style": { "fontSize": 28, "color": "#007AFF", "textAlign": "center" }
    },
    {
      "id": "text-1",
      "type": "text",
      "content": "This configuration was sent from the web builder.",
      "style": { "fontSize": 16, "color": "#666", "textAlign": "center", "marginTop": 10 }
    }
  ]
}
```

### Image Gallery
```json
{
  "blocks": [
    {
      "id": "gallery-title",
      "type": "title",
      "content": "Image Gallery",
      "style": { "fontSize": 24, "color": "#333" }
    },
    {
      "id": "gallery-1",
      "type": "gallery",
      "images": [
        "https://picsum.photos/300/200?random=1",
        "https://picsum.photos/300/200?random=2",
        "https://picsum.photos/300/200?random=3"
      ],
      "style": { "marginTop": 15 }
    }
  ]
}
```

### Button Grid
```json
{
  "blocks": [
    {
      "id": "button-title",
      "type": "title",
      "content": "Action Buttons",
      "style": { "fontSize": 24, "color": "#333" }
    },
    {
      "id": "button-1",
      "type": "button",
      "content": "Primary Action",
      "style": { "backgroundColor": "#007AFF", "color": "white", "marginTop": 10 }
    },
    {
      "id": "button-2",
      "type": "button",
      "content": "Secondary Action",
      "style": { "backgroundColor": "#FF9500", "color": "white", "marginTop": 10 }
    }
  ]
}
```

## Troubleshooting

### Server không chạy được
```bash
# Kiểm tra port 8081 có bị chiếm không
netstat -an | grep 8081

# Windows:
netstat -ano | findstr :8081

# Kill process nếu cần (Windows)
taskkill /PID <PID> /F
```

### Lỗi "npm start chạy React Native thay vì server"
**Nguyên nhân:** Bạn đang chạy `npm start` trong thư mục sai.

**Giải pháp:**
1. **Để chạy WebSocket server:** `cd smappliapp-server && npm start`
2. **Để chạy React Native app:** `cd SmappliApp && npm start` (terminal khác)

### WebSocket không kết nối được
1. Kiểm tra server đã chạy chưa (xem console output)
2. Kiểm tra firewall/antivirus
3. Thử với port khác
4. Kiểm tra console log trong browser

### Mobile app không nhận được updates
1. Kiểm tra WebSocket status trong Build tab
2. Click "Connect WebSocket" nếu chưa kết nối
3. Kiểm tra server logs
4. Restart mobile app

### CORS errors
Server đã được config CORS, nhưng nếu vẫn gặp lỗi:
```javascript
// Trong server-example.js
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Workflow Hoàn chỉnh

1. **Start WebSocket Server**: 
   ```bash
   cd smappliapp-server
   npm start
   ```

2. **Open Web Builder**: Mở `web-app-example.html` trong browser

3. **Start Mobile App** (terminal mới):
   ```bash
   cd SmappliApp
   npm start
   ```

4. **Connect Both**: Web builder và mobile app connect tới server

5. **Design**: Tạo/chỉnh sửa configuration trong web builder

6. **Send**: Click "Send to Mobile App"

7. **See Results**: Mobile app tự động update giao diện

## Mở rộng

### Thêm Component Types mới
1. Tạo component trong `components/blocks/`
2. Update `BlockRenderer.tsx`
3. Thêm vào templates trong web builder

### Custom Styling
Modify templates trong `web-app-example.html` để thêm styles phức tạp hơn.

### Image Support
Server đã support upload/download images qua base64. Có thể mở rộng để support file upload.

### Authentication
Thêm authentication cho WebSocket connections nếu cần bảo mật.

## Performance Tips

1. **Limit Message Size**: Giới hạn kích thước JSON configuration
2. **Debounce Updates**: Không gửi quá nhiều updates liên tục
3. **Image Optimization**: Compress images trước khi gửi
4. **Connection Pooling**: Limit số lượng connections đồng thời

## Quick Start Commands

```bash
# Terminal 1: Start WebSocket Server
cd smappliapp-server
npm start

# Terminal 2: Start Mobile App
cd SmappliApp
npm start

# Browser: Open web-app-example.html
```

Hệ thống này cho phép bạn tạo một workflow hoàn chỉnh từ design trên web tới deployment trên mobile một cách real-time và tự động! 