# 🚀 Smappli Web Builder Expo

Enhanced web builder for Smappli mobile app with real-time WebSocket synchronization.

## ✨ Features

- **Real-time Mobile Preview**: Dark theme interface matching the actual Smappli mobile app
- **WebSocket Integration**: Live synchronization between web builder and mobile app
- **Enhanced Connection Management**: Auto-reconnection with exponential backoff
- **Visual Status Indicators**: Real-time connection status and sync information
- **Improved Block Rendering**: Dark theme components matching mobile app design

## 🏗️ Architecture

```
Web Builder (Expo) ←→ WebSocket Server ←→ Smappli Mobile App
                              ↕
                         HTTP API Server
```

## 🚀 Quick Start

### 1. Start WebSocket Server

First, ensure the WebSocket server is running:

```bash
cd ../smappliapp-server
npm start
# or
node server-example.js
```

The server should be available at `ws://localhost:8081/ws`

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Web Builder

```bash
npm start
# or
npx expo start --web
```

### 4. Start Mobile App (Optional)

In a separate terminal:

```bash
cd ../
npm start
```

## 🔧 Usage

### Connection Management

1. **Auto-Connect**: The web builder automatically attempts to connect to the WebSocket server on startup
2. **Manual Control**: Use the Connect/Disconnect button in the Connection Status panel
3. **Status Monitoring**: Real-time connection status with visual indicators

### Real-time Synchronization

- **Automatic Sync**: Changes are automatically sent to the mobile app when connected
- **Manual Sync**: Use "Sync Now" button for immediate synchronization
- **Bi-directional**: Supports receiving updates from the mobile app

### Mobile Preview

- **Dark Theme**: Matches the actual Smappli mobile app design
- **Interactive**: Click blocks to select them
- **Real-time Updates**: Preview updates instantly as you make changes

## 🎨 Components

### Enhanced Components

- **MobilePreview**: Dark theme iPhone simulator with bottom navigation
- **BlockPreview**: Dark theme block rendering matching mobile app
- **ConnectionStatus**: WebSocket connection management and status display
- **BuilderContext**: Enhanced state management with real-time sync

### WebSocket Features

- **Auto-reconnection**: Exponential backoff strategy for reliable connections
- **Heartbeat**: Keep-alive mechanism to maintain stable connections
- **Error Handling**: Comprehensive error handling and status reporting
- **Message Types**: Support for various message types (BUILD_REQUEST, PING/PONG, etc.)

## 📱 Mobile App Integration

The web builder is designed to work seamlessly with the Smappli mobile app:

1. **Shared Block Types**: Same block structure as mobile app
2. **Real-time Updates**: Changes appear instantly on mobile device
3. **Bidirectional Sync**: Mobile app can also send updates to web builder
4. **Visual Consistency**: Preview matches actual mobile app appearance

## 🔌 WebSocket API

### Message Types

- `BUILD_REQUEST`: Send blocks to mobile app
- `blocks_update`: Update block list
- `block_add`: Add single block
- `block_remove`: Remove block
- `block_update`: Update single block
- `PING/PONG`: Heartbeat messages
- `connection`: Initial connection message

### Connection Status

- `connecting`: Attempting to connect
- `connected`: Successfully connected with real-time sync
- `disconnected`: Not connected
- `error`: Connection failed

## 🛠️ Development

### Project Structure

```
smappli-web-builder-expo/
├── components/
│   ├── MobilePreview.tsx      # Enhanced mobile preview
│   ├── BlockPreview.tsx       # Dark theme block rendering
│   ├── ConnectionStatus.tsx   # WebSocket status display
│   └── ...
├── contexts/
│   └── BuilderContext.tsx     # Enhanced state management
├── services/
│   └── WebSocketService.ts    # Enhanced WebSocket service
├── types/
│   └── blocks.ts             # Type definitions
└── App.tsx                   # Main application
```

### Key Enhancements

1. **Dark Theme**: All components updated to match mobile app design
2. **WebSocket Reliability**: Auto-reconnection, heartbeat, error handling
3. **Real-time Sync**: Bidirectional synchronization with mobile app
4. **Visual Feedback**: Connection status, sync indicators, loading states
5. **Better UX**: Improved layout, scrollable panels, status information

## 🐛 Troubleshooting

### Connection Issues

1. **Server Not Running**: Ensure WebSocket server is running on port 8081
2. **Port Conflicts**: Check if port 8081 is available
3. **Firewall**: Ensure firewall allows connections to localhost:8081

### Sync Issues

1. **Check Connection**: Verify WebSocket connection status
2. **Manual Sync**: Use "Sync Now" button to force synchronization
3. **Restart**: Try disconnecting and reconnecting

### Mobile App Issues

1. **Same Network**: Ensure mobile device is on same network
2. **Server Address**: Update mobile app to use correct server address
3. **WebSocket Support**: Verify mobile app has WebSocket implementation

## 📝 Notes

- The web builder requires a running WebSocket server to function properly
- Mobile preview is a simulation - actual mobile app may have slight differences
- Real-time sync requires both web builder and mobile app to be connected
- Connection status is automatically updated and displayed in the UI

## 🔄 Updates

This enhanced version includes:

- ✅ Dark theme matching mobile app
- ✅ Improved WebSocket connectivity
- ✅ Real-time synchronization
- ✅ Enhanced error handling
- ✅ Visual status indicators
- ✅ Better user experience 