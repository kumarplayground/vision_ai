# Vision AI Platform

A Next.js application for AI education, career guidance, and job opportunities - helping make India smarter through AI.

## Features

- 🤖 **AI Chat Assistant**: Powered by Google Gemini API for intelligent conversations
- 💼 **Job Listings**: Browse and explore AI-related job opportunities
- 📚 **Course Catalog**: Discover AI and technology courses
- 🎯 **Career Guidance**: Get personalized AI career advice
- 🌙 **Dark Mode**: Built-in theme support

## Tech Stack

- **Framework**: Next.js 15.3.3 (App Router)
- **AI Model**: Google Gemini Flash
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Image Management**: Cloudinary

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB instance
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vision_ai
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=your_mongodb_uri_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset_here
FREEPIK_API_KEY=your_freepik_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── chat/         # AI Chat interface
│   ├── jobs/         # Job listings
│   ├── courses/      # Course catalog
│   └── admin/        # Admin panel
├── components/       # React components
├── ai/               # AI integration (Gemini)
├── lib/              # Utilities and database
└── models/           # MongoDB models
```

## AI Chat Integration

The platform uses Google Gemini API for the AI chat assistant. The integration is located in `src/ai/flows/chat.ts`.

### API Configuration

```typescript
const endpointUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';
const requestBody = {
  contents: [{ parts: [{ text: "..." }] }]
};
```

## Available Scripts

- `npm run dev` - Start development server on port 9002
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler check

## License

This project is private and proprietary.
