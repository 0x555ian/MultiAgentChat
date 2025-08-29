# ElizaOS Integration Project

This project integrates ElizaOS agents into a Next.js web application, allowing users to interact with various ElizaOS models through a modern web interface.

## Features

- ElizaOS agent integration
- Real-time chat interface
- Multiple model support
- Configurable backend settings

## Setup and Installation

1. Install dependencies:
```bash
npm install
```

2. Install Python dependencies:
```bash
pip install python3 elizaos
```

## Running the Application

1. Start the ElizaOS backend:
- Use the "ElizaOS Backend" workflow in Replit
- This will start the ElizaOS server on port 5000

2. Start the frontend:
- Click the Run button to start the Next.js frontend
- The application will be available in the webview

## Project Structure

- `app/client/elizaAgentBridge.ts`: ElizaOS integration bridge
- `app/api/eliza/`: Backend API routes
- `app/components/`: Frontend React components

## Configuration

The ElizaOS backend runs on `0.0.0.0:5000` with the following models enabled:
- eliza-researcher
- eliza-coder
- eliza-designer

## Troubleshooting

If you encounter the error "you are not allowed to use eliza-researcher model", ensure:
1. The ElizaOS backend is running
2. The correct model permissions are configured
3. The frontend is properly connected to the backend

## Contributing

Feel free to submit issues and enhancement requests!