# NextFlow - LLM Workflow Builder

A pixel-perfect UI/UX clone of Krea.ai, focused exclusively on LLM (Large Language Model) workflows. Built with Next.js, React Flow, Google Gemini API via Trigger.dev, and PostgreSQL.

## Features

- ✨ Pixel-perfect Krea.ai-inspired UI
- 🔐 Authentication with Clerk
- 🎨 6 Node Types for workflow building:
  - Text Node
  - Upload Image (via Transloadit)
  - Upload Video (via Transloadit)
  - LLM Node (Google Gemini API)
  - Crop Image (FFmpeg via Trigger.dev)
  - Extract Frame from Video (FFmpeg via Trigger.dev)
- 📊 React Flow canvas with drag & drop
- ⚡ Parallel execution of independent tasks
- 📈 Workflow history with node-level execution details
- 💾 PostgreSQL database with Prisma ORM
- 🚀 Type-safe API routes with Zod validation
- 🎯 Full TypeScript support

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database**: PostgreSQL (Neon), Prisma ORM
- **Authentication**: Clerk
- **Workflow Visualization**: React Flow
- **API**: Next.js API Routes, Zod validation
- **External Services**:
  - Google Generative AI (Gemini)
  - Trigger.dev (task orchestration)
  - Transloadit (file uploads)
  - FFmpeg (media processing)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Neon account)
- Clerk account for authentication
- Google Gemini API key
- Trigger.dev account
- Transloadit account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nextflow
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in all required environment variables in `.env.local`.

4. Set up the database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
nextflow/
├── app/
│   ├── api/
│   │   └── workflows/          # API routes for workflows
│   ├── dashboard/              # Dashboard page
│   ├── editor/                 # Workflow editor
│   ├── sign-in/                # Clerk sign-in
│   ├── sign-up/                # Clerk sign-up
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── lib/
│   ├── prisma.ts               # Prisma client
│   └── schemas.ts              # Zod validation schemas
├── stores/
│   └── workflow.ts             # Zustand workflow store
├── prisma/
│   └── schema.prisma           # Database schema
├── .env.example                # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## Development

### Create a Workflow

1. Sign in/up with Clerk
2. Go to Dashboard
3. Click "New Workflow"
4. Drag nodes from left sidebar to canvas
5. Connect nodes together
6. Configure node inputs
7. Run workflow

### API Endpoints

**Workflows:**
- `POST /api/workflows` - Create workflow
- `GET /api/workflows` - Get all workflows
- `GET /api/workflows/[id]` - Get workflow
- `PUT /api/workflows/[id]` - Update workflow
- `DELETE /api/workflows/[id]` - Delete workflow

All endpoints require authentication via Clerk.

## Database Schema

See [prisma/schema.prisma](./prisma/schema.prisma) for the complete schema.

Key tables:
- `User` - Clerk user data
- `Workflow` - User workflows with nodes/edges
- `WorkflowRun` - Execution history
- `NodeRun` - Node-level execution details

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

```bash
npm run build
npm start
```

## Configuration

### Environment Variables

Required variables (see `.env.example`):
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `NEXT_PUBLIC_GOOGLE_API_KEY` - Google Gemini API key
- `TRIGGER_API_KEY` - Trigger.dev API key
- `NEXT_PUBLIC_TRANSLOADIT_KEY` - Transloadit key
- `TRANSLOADIT_SECRET` - Transloadit secret

## Performance

- Parallel execution of independent tasks via Trigger.dev
- Optimized React Flow rendering
- Database query optimization with Prisma
- CSS-in-JS optimization with Tailwind

## Debugging

Monitor logs:
```bash
npm run dev
# or
NEXT_PUBLIC_DEBUG=true npm run dev
```

View database:
```bash
npm run prisma:studio
```

## Contributing

[Contributing guidelines]

## License

[License information]

## Support

For issues and questions:
- GitHub Issues: [link]
- Email: bluerocketinfo@gmail.com

## Acknowledgments

- Inspired by [Krea.ai](https://krea.ai)
- Built with [Next.js](https://nextjs.org/)
- Database via [Neon](https://neon.tech)
- Task orchestration via [Trigger.dev](https://trigger.dev)
