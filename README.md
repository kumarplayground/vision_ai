# Vision AI Platform

A Next.js application for AI education, career guidance, and job opportunities - helping make India smarter through AI.

## Features

- 🤖 **AI Chat Assistant**: Powered by ModelsLab's gpt-oss-120b model for intelligent conversations
- 💼 **Job Listings**: Browse and explore AI-related job opportunities
- 📚 **Course Catalog**: Discover AI and technology courses
- 🎯 **Career Guidance**: Get personalized AI career advice
- 🌙 **Dark Mode**: Built-in theme support

## Tech Stack

- **Framework**: Next.js 15.3.3 (App Router)
- **AI Model**: ModelsLab gpt-oss-120b
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Image Management**: Cloudinary

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB instance
- ModelsLab API key

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
MODELSLAB_API_KEY=your_modelslab_api_key_here
MONGODB_URI=your_mongodb_uri_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset_here
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
├── ai/               # AI integration (ModelsLab)
├── lib/              # Utilities and database
└── models/           # MongoDB models
```

## AI Chat Integration

The platform uses ModelsLab's gpt-oss-120b model for the AI chat assistant. The integration is located in `src/ai/flows/chat.ts`.

### API Configuration

```typescript
const endpointUrl = 'https://modelslab.com/api/v7/llm/chat/completions';
const requestBody = {
  key: process.env.MODELSLAB_API_KEY,
  model_id: 'gpt-oss-120b',
  messages: [...]
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
