# SHIT WEBSITE I TRIED TO MAKE < HAVE IT I DONT WANT IT

A modern dashboard for the stmp Discord bot, built with Next.js, NextAuth.js, and Tailwind CSS.

## Features

- Discord OAuth authentication
- Server management
- Bot configuration
- User-friendly interface
- Protected dashboard routes

## Setup Instructions

### Prerequisites

- Node.js 16.8.0 or newer
- npm or yarn
- A Discord application with a bot

### Discord Developer Portal Setup

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application or select your existing bot application
3. Navigate to the "OAuth2" tab
4. Add a redirect URL: `http://localhost:3000/api/auth/callback/discord` (for development)
5. Save changes
6. Note your Client ID and Client Secret for the next step

### Environment Variables

1. Copy the `.env.local` file and update the values:

```
# NextAuth.js configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here # Generate a random string

# Discord OAuth
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret

# API URL for your Discord bot backend (if applicable)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Start the development server:

```bash
npm run dev
# or
yarn dev
```

3. Visit `http://localhost:3000` in your browser

### Production Deployment

When deploying to production:

1. Update the `NEXTAUTH_URL` to your production URL
2. Update the redirect URL in the Discord Developer Portal to include your production callback URL
3. Generate a strong random string for `NEXTAUTH_SECRET`

## Integration with Your Discord Bot

To connect this dashboard with your Discord bot:

1. Create a backend API for your bot
2. Implement endpoints for:
   - Server management
   - Bot configuration
   - Analytics
3. Update the API calls in the dashboard to use your bot's API

## File Structure

- `/app/api/auth/[...nextauth]` - NextAuth.js configuration
- `/app/(routes)/dashboard` - Dashboard pages
- `/components/dashboard` - Dashboard components
- `/providers` - React providers
- `/middleware.ts` - Route protection
- `/types` - TypeScript type definitions


## License

[MIT](LICENSE)


