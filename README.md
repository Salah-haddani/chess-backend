# Friends Social App

A custom social app for 4 friends with chat and chess game functionality.

## Features

- **Key-based Authentication**: Each friend gets a unique key to access the app
- **Real-time Chat**: Send and receive messages with timestamps
- **Chess Game**: Two players can play while others watch
- **Modern UI**: Clean, responsive design using TailwindCSS

## Setup Instructions

1. Open `index.html` in a web browser
2. Each friend needs to enter their unique access key
3. The app works entirely in the browser - no data is saved after closing

## Access Keys

Here are the 4 access keys - distribute one to each friend:

- **Friend 1**: `FRIEND1_KEY`
- **Friend 2**: `FRIEND2_KEY` 
- **Friend 3**: `FRIEND3_KEY`
- **Friend 4**: `FRIEND4_KEY`

**Important**: Share these keys securely with your friends!

## How to Use

### Authentication
- Enter your assigned key on the login screen
- Click "Enter App" to access the main interface

### Chat
- Type messages in the input field and press Enter or click Send
- Messages show with sender name and timestamp
- The system simulates friend responses for demo purposes

### Chess Game
- Click "New Game" to start
- First person to click the board becomes White player
- Second person becomes Black player
- Others automatically become spectators
- Click pieces to select, then click valid squares to move
- Game moves are announced in the chat

## Technical Details

- **Frontend Only**: No backend required - everything runs in the browser
- **No Data Persistence**: All data is lost when the browser tab is closed
- **Chess Rules**: Basic chess movement rules implemented
- **Responsive Design**: Works on desktop and mobile devices

## File Structure

```
├── index.html          # Main HTML file
├── app.js             # JavaScript application logic
└── README.md          # This file
```

## Customization

To change the access keys, edit the `USER_KEYS` object in `app.js`:

```javascript
const USER_KEYS = {
    'YOUR_CUSTOM_KEY_1': { name: 'Friend Name 1', id: 'friend1' },
    'YOUR_CUSTOM_KEY_2': { name: 'Friend Name 2', id: 'friend2' },
    'YOUR_CUSTOM_KEY_3': { name: 'Friend Name 3', id: 'friend3' },
    'YOUR_CUSTOM_KEY_4': { name: 'Friend Name 4', id: 'friend4' }
};
```

## Future Enhancements

- Add backend for persistent data storage
- Implement WebSocket for real-time communication
- Add more chess features (castling, en passant, check/checkmate detection)
- Add voice/video chat
- User profiles and avatars

## Enjoy!

Have fun chatting and playing chess with your friends! 🎮♟️💬
