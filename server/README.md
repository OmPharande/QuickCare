# QuickCare Server Backend

This is the Express + TypeScript + MongoDB backend for the QuickCare doctor appointment system.

## Setup

1. Copy `.env.example` to `.env` and fill in your MongoDB Atlas URI and desired port.
2. Run `npm install` in this folder.
3. Start the server in development mode:
   ```sh
   npm run dev
   ```

## Folder Structure
- `src/` - Server entrypoint and route setup
- `models/` - Mongoose data models
- `routes/` - Express route handlers

## Endpoints
- `GET /api/health` - Health check
- (More endpoints coming soon)
