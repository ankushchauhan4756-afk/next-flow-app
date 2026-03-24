# NextFlow - Complete Project Setup Guide

## 🎉 Project Complete!

Your complete NextFlow project has been created with all the components and functionality from the requirements. Here's what's included:

## 📁 Project Structure

```
nextflow/
├── app/
│   ├── api/
│   │   ├── workflows/          # Workflow CRUD operations
│   │   ├── workflows/[id]/runs/ # Execution and history
│   │   ├── nodes/              # Node execution endpoints (LLM, Crop, ExtractFrame)
│   │   └── uploads/            # File upload initialization
│   ├── components/
│   │   ├── nodes/              # Node components (6 types)
│   │   ├── LeftSidebar.tsx      # Node selection sidebar
│   │   └── RightSidebar.tsx     # Workflow history panel
│   ├── dashboard/              # Dashboard page
│   ├── editor/[id]/            # Workflow editor
│   ├── sign-in/                # Clerk auth
│   ├── sign-up/                # Clerk auth
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   ├── prisma.ts               # Database client
│   ├── schemas.ts              # Zod validations
│   ├── execution.ts            # DAG & execution engine
│   ├── trigger.ts              # Trigger.dev integration
│   ├── gemini.ts               # Google Gemini integration
│   └── transloadit.ts          # File upload integration
├── stores/
│   └── workflow.ts             # Zustand store
├── prisma/
│   └── schema.prisma           # Database schema
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── .env.example
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd "c:\Users\Ankush Singh\OneDrive\Desktop\next flow"
npm install
```

### 2. Set Up Environment Variables
```bash
# Copy the example file
cp .env.example .env.local

# Then fill in all the values:
```

**Required Environment Variables:**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nextflow"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Google Gemini API
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key

# Trigger.dev
TRIGGER_API_KEY=your_trigger_api_key
TRIGGER_API_URL=https://api.trigger.dev/v1

# Transloadit
NEXT_PUBLIC_TRANSLOADIT_KEY=your_transloadit_key
TRANSLOADIT_SECRET=your_transloadit_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Database

**Using Neon (Recommended):**
1. Go to [neon.tech](https://neon.tech)
2. Create a free database
3. Copy the connection string to `DATABASE_URL`

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Getting API Keys

### Google Gemini API
1. Go to [Google AI Studio](https://ai.google.dev/gemini-api)
2. Create a free account
3. Generate API key
4. Add to `NEXT_PUBLIC_GOOGLE_API_KEY`

### Clerk
1. Go to [clerk.com](https://clerk.com)
2. Create account and project
3. Copy Publishable Key and Secret Key
4. Add to environment variables

### Trigger.dev
1. Go to [trigger.dev](https://trigger.dev)
2. Create account and project
3. Get API key from dashboard
4. Add to `TRIGGER_API_KEY`

### Transloadit
1. Go to [transloadit.com](https://transloadit.com)
2. Create account
3. Get Auth Key from dashboard
4. Add to `NEXT_PUBLIC_TRANSLOADIT_KEY` and `TRANSLOADIT_SECRET`

### PostgreSQL (Neon)
1. Go to [neon.tech](https://neon.tech)
2. Create free PostgreSQL database
3. Copy connection string to `DATABASE_URL`

## 📱 Features Implemented

### Core Components
- ✅ **6 Node Types**: Text, Image, Video, LLM, Crop, ExtractFrame
- ✅ **React Flow Canvas**: Drag & drop, pan, zoom, minimap
- ✅ **Left Sidebar**: Node selection with search
- ✅ **Right Sidebar**: Workflow history panel
- ✅ **Workflow Editor**: Full CRUD with autosave

### Functionality
- ✅ **Clerk Authentication**: Sign up/sign in with protected routes
- ✅ **Node Execution**: Individual nodes, full workflow, selected nodes
- ✅ **DAG Validation**: Prevents circular dependencies
- ✅ **Parallel Execution**: Independent branches run concurrently
- ✅ **Execution History**: Track all workflow runs with node-level details
- ✅ **File Uploads**: Transloadit integration for images/videos
- ✅ **LLM Integration**: Google Gemini with multimodal support
- ✅ **Media Processing**: FFmpeg for crop and frame extraction
- ✅ **Database**: PostgreSQL with Prisma ORM
- ✅ **State Management**: Zustand for workflow state
- ✅ **Type Safety**: Full TypeScript with Zod validation

### API Routes
- `POST /api/workflows` - Create workflow
- `GET /api/workflows` - List workflows
- `GET /api/workflows/[id]` - Get workflow
- `PUT /api/workflows/[id]` - Update workflow
- `DELETE /api/workflows/[id]` - Delete workflow
- `POST /api/workflows/[id]/runs` - Execute workflow
- `GET /api/workflows/[id]/runs` - Get execution history
- `POST /api/nodes/llm/execute` - Execute LLM node
- `POST /api/nodes/crop/execute` - Execute crop node
- `POST /api/nodes/extract-frame/execute` - Execute extract frame node
- `POST /api/uploads/init` - Initialize file upload

## 🎨 Styling

The project includes:
- **Tailwind CSS** with custom Krea.ai theme
- **Custom animations** (pulsating glow for executing nodes)
- **Dark mode** theme
- **Responsive design**
- **Smooth transitions**

## 🔧 Development

### View Database
```bash
npm run prisma:studio
```
Opens Prisma Studio at http://localhost:5555

### Build for Production
```bash
npm run build
npm start
```

### Lint Code
```bash
npm run lint
```

## 🚢 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel Dashboard
3. Add environment variables
4. Deploy

```bash
# Or deploy from CLI
npm i -g vercel
vercel
```

## 📋 Workflow Usage

1. **Sign In**: Create account with Clerk
2. **Create Workflow**: Click "New Workflow" on dashboard
3. **Add Nodes**: Drag nodes from left sidebar to canvas
4. **Connect Nodes**: Click output handle and drag to input handle
5. **Configure Nodes**: Set parameters for each node
6. **Execute**: Click "Execute" button
7. **Monitor**: View execution status in right sidebar

## 🔴 Common Issues

**Database Connection Failed**
- Ensure DATABASE_URL is correct
- Check PostgreSQL is running
- Run migrations: `npm run prisma:migrate`

**Clerk AuthErrors**
- Verify CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY
- Check redirect URLs match in Clerk dashboard

**Google Gemini Errors**
- Verify API key is valid
- Check quota isn't exceeded
- Ensure model is supported

**File Upload Fails**
- Verify Transloadit keys are correct
- Check file type is supported
- Ensure file size is under limits

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Flow Docs](https://reactflow.dev)
- [Prisma Docs](https://www.prisma.io/docs)
- [Clerk Docs](https://clerk.com/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Google Gemini API](https://ai.google.dev/gemini-api)
- [Trigger.dev Docs](https://docs.trigger.dev)
- [Transloadit Docs](https://transloadit.com/docs)

## 🤝 Support

For issues:
1. Check console for error messages
2. Review environment variables
3. Check database logs: `npm run prisma:studio`
4. Review API response in browser DevTools

## 📝 Next Steps

1. ✅ Run `npm install`
2. ✅ Set up `.env.local` with API keys
3. ✅ Initialize database with `npm run prisma:migrate`
4. ✅ Start dev server with `npm run dev`
5. ✅ Create test workflow to verify everything works
6. ✅ Deploy to Vercel when ready

---

**Happy building! 🚀**

For the complete internship task requirements, see: [INTERNSHIP_TASK.md](./INTERNSHIP_TASK.md)
