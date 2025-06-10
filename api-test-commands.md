# API Test Commands

## Base URL
```
http://localhost:8081
```

## 1. Health Check
```bash
curl -X GET http://localhost:8081/api/health \
  -H "Content-Type: application/json"
```

## 2. Get Configuration
```bash
curl -X GET http://localhost:8081/api/blocks/config \
  -H "Content-Type: application/json"
```

## 3. Update Configuration (Simple)
```bash
curl -X POST http://localhost:8081/api/blocks/config \
  -H "Content-Type: application/json" \
  -d '{
    "blocks": [
      {
        "type": "title",
        "text": "Test Title",
        "size": "large",
        "color": "#fff"
      },
      {
        "type": "text",
        "content": "Test content from API",
        "fontSize": 16,
        "color": "#ccc"
      }
    ],
    "version": "1.0.0",
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }'
```

## 4. Upload Single Image (Base64)
```bash
curl -X POST http://localhost:8081/api/images/upload \
  -H "Content-Type: application/json" \
  -d '{
    "image": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    "filename": "test-image.png",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }'
```

## 5. Get Image by ID
```bash
curl -X GET http://localhost:8081/api/images/{imageId} \
  -H "Content-Type: application/json"
```

## 6. Upload Configuration with Images
```bash
curl -X POST http://localhost:8081/api/blocks/config-with-images \
  -H "Content-Type: application/json" \
  -d '{
    "blocks": [
      {
        "type": "title",
        "text": "App with Images",
        "size": "large",
        "color": "#fff"
      },
      {
        "type": "image",
        "source": "img_123456789",
        "borderRadius": 18
      },
      {
        "type": "gallery",
        "title": "Image Gallery",
        "images": [
          {
            "source": "img_123456789",
            "size": "small",
            "shape": "circle"
          },
          {
            "source": "img_987654321",
            "size": "small",
            "shape": "square"
          }
        ]
      }
    ],
    "images": {
      "img_123456789": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      "img_987654321": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    },
    "version": "1.0.0",
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }'
```

## 7. Upload Configuration File (Form Data)
```bash
curl -X POST http://localhost:8081/api/blocks/upload \
  -F "config=@config.json"
```

## Expected Server Responses

### Health Check Response
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "message": "Server is healthy"
}
```

### Image Upload Response
```json
{
  "success": true,
  "data": {
    "imageId": "img_1704067200000_abc123def",
    "url": "http://localhost:8081/images/img_1704067200000_abc123def.png",
    "base64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
  },
  "message": "Image uploaded successfully"
}
```

### Configuration Response
```json
{
  "success": true,
  "data": {
    "blocks": [...],
    "images": {...},
    "version": "1.0.0",
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  },
  "message": "Configuration retrieved successfully"
}
```

## Notes

1. **Base64 Image**: The example uses a 1x1 transparent PNG. Replace with actual base64 image data.

2. **Image IDs**: When referencing images in blocks, use the imageId returned from the upload endpoint.

3. **Error Responses**: All endpoints should return error responses in this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

4. **CORS**: Make sure your server has CORS enabled for web client access.

5. **File Size**: Consider implementing file size limits for base64 images to prevent large payloads.

## Server Implementation Requirements

Your server should implement these endpoints:

- `GET /api/health` - Health check
- `GET /api/blocks/config` - Get current configuration
- `POST /api/blocks/config` - Update configuration
- `POST /api/images/upload` - Upload single image
- `GET /api/images/:id` - Get image by ID
- `POST /api/blocks/config-with-images` - Upload config with embedded images
- `POST /api/blocks/upload` - Upload configuration file

The server should store images and serve them back with proper URLs for web access. 