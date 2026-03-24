# NextFlow - Internship Task

## Project Overview

Develop an application called **NextFlow** — a pixel-perfect UI/UX clone of [Krea.ai](https://krea.ai) workflow builder, focused exclusively on **LLM (Large Language Model) workflows**. The application must use **React Flow** for the visual workflow canvas, integrate with **Google's Gemini API** for LLM execution via **Trigger.dev**, and demonstrate engineering excellence with type-safe APIs, proper state management, authentication, and seamless user experience.

### Important Prerequisite
Before starting, **sign up for a free account at Krea.ai** and explore the interface thoroughly to understand the exact UI/UX patterns, interactions, and design language you need to replicate.

---

## Functional Requirements

### 1. Core Workflow Interface (UI/UX)

#### Pixel-Perfect UI
- Match Krea's UI exactly — background, layout, spacing, fonts, node designs, animations, and scrolling behavior
- Responsive design with proper overflow handling

#### Left Sidebar
- Collapsible sidebar with search and quick access section for node types
- Contains exactly **6 buttons** for node creation:
  1. Text Node
  2. Upload Image Node
  3. Upload Video Node
  4. Run Any LLM Node
  5. Crop Image Node
  6. Extract Frame from Video Node

#### Right Sidebar
- **Workflow History Panel** displaying:
  - List of all workflow runs with timestamps
  - Execution status (success/failed/partial)
  - Duration of each run
  - Scope of execution (full/partial/single)

#### Workflow Canvas
- **React Flow** with dot grid background
- Smooth panning/zooming with minimap in bottom-right corner
- Responsive design with proper overflow handling

---

### 2. Node Types (Left Sidebar Buttons)

#### 1. Text Node
- Simple text input with textarea
- Single output handle for text data
- Accepts manual text entry

#### 2. Upload Image Node
- File upload via **Transloadit**
- Supported formats: jpg, jpeg, png, webp, gif
- Image preview after upload
- Output handle for image URL

#### 3. Upload Video Node
- File upload via **Transloadit**
- Supported formats: mp4, mov, webm, m4v
- Video player preview after upload
- Output handle for video URL

#### 4. Run Any LLM Node
- **Model selector dropdown** with available Gemini models
- **Input handles (3):**
  - `system_prompt` (optional) — Accepts connection from Text Node
  - `user_message` (required) — Accepts connection from Text Node
  - `images` (optional) — Accepts connections from Image Node(s), supports multiple
- **Output handle (1):**
  - `output` — Text response from Gemini API
- **Execution:** Via Trigger.dev task
- **Result Display:** Results displayed directly on the node itself (expandable), NOT a separate output node
- **Vision Support:** Accept images for multimodal prompts
- **System Prompts:** Support optional system instructions per request
- **Input Chaining:** Aggregate text/image inputs from connected nodes
- **Error Handling:** Graceful error display with user-friendly messages
- **Loading States:** Visual feedback during API calls (spinner, disabled button)

#### 5. Crop Image Node
- **Input handles (5):**
  - `image_url` (required) — Accepts image types (jpg, jpeg, png, webp, gif)
  - `x_percent` (optional) — Text/number (0-100), default: 0
  - `y_percent` (optional) — Text/number (0-100), default: 0
  - `width_percent` (optional) — Text/number (0-100), default: 100
  - `height_percent` (optional) — Text/number (0-100), default: 100
- **Output handle (1):**
  - `output` — Cropped image URL (uploaded via Transloadit)
- **Execution:** Via FFmpeg on Trigger.dev task
- **Configurable parameters** with manual entry OR node connections

#### 6. Extract Frame from Video Node
- **Input handles (2):**
  - `video_url` (required) — Accepts video types (mp4, mov, webm, m4v)
  - `timestamp` (optional) — Accepts text/number (seconds or "50%" for percentage), default: 0
- **Output handle (1):**
  - `output` — Extracted frame image URL (jpg/png), uploaded via Transloadit
- **Execution:** Via FFmpeg on Trigger.dev task

---

### 3. Authentication (Clerk)

- Auth provider using **Clerk**
- Sign In/Sign Up with Clerk-hosted UI or embedded components
- All workflow routes require authentication
- Workflows and history scoped to authenticated user
- Protected routes enforcement

---

### 4. Workflow History (Right Sidebar)

#### History Panel Display
- Right sidebar showing list of all workflow runs
- Each entry displays: timestamp, status (success/failed/partial), duration, scope (full/partial/single)

#### Execution Scope
- **Full Workflow Runs** — Execute all connected nodes
- **Single Node Runs** — Execute one specific node (useful for testing)
- **Selected Node Group Runs** — Execute multiple selected nodes

#### Click to Expand
- Clicking a run shows **node-level execution details**

#### Node-Level History
- For each node: status, inputs used, outputs generated, execution time
- Hierarchical tree view showing node execution order
- Partial runs tracking — show which nodes succeeded even if workflow failed

#### Visual Indicators
- Color-coded status badges:
  - 🟢 Green = Success
  - 🔴 Red = Failed
  - 🟡 Yellow = Running

#### Persistence
- All history must persist to **PostgreSQL database**

**Node-Level History View Example:**
```
Run #123 - Jan 14, 2026 3:45 PM (Full Workflow)
├─ Text Node (node-1) ✓ 0.1s
│  └─ Output: "Generate a product description..."
├─ Image Node (node-2) ✓ 2.3s
│  └─ Output: https://cdn.transloadit.com/...
├─ Crop Image (node-3) ✓ 1.8s
│  └─ Output: https://cdn.transloadit.com/...
├─ LLM Node (node-4) ✓ 4.2s
│  └─ Output: "Introducing our premium..."
└─ Extract Frame (node-5) ✗ Failed
   └─ Error: "Invalid timestamp parameter"
```

---

### 5. Workflow Features

#### Drag & Drop Nodes
- Add nodes from sidebar to canvas via click or drag

#### Node Connections
- Connect output handles to input handles with animated edges (purple/colored)
- Real-time connection state updates

#### Configurable Inputs
- All node parameters must be configurable via:
  - **Input handles** — connect from other nodes
  - **Manual entry** — direct text/number input
- Example: Crop Image's x/y/width/height can be connected or entered directly

#### Connected Input State
- When an input handle has a connection, disable the corresponding manual input field
- Greyed out appearance to indicate value comes from connected node
- Re-enable if connection is removed

#### Type-Safe Connections
- Enforce type validation:
  - ❌ Image nodes cannot connect to prompt/system prompt inputs
  - ❌ Text outputs cannot connect to file inputs
  - ❌ Invalid connections visually disallowed (ghost cursor, grayed out)
- Only valid connection types allowed

#### DAG Validation
- Workflows must be **DAG (Directed Acyclic Graph)**
- Circular loops/cycles not allowed
- Prevent invalid connections that would create cycles

#### Node Deletion
- Delete nodes via menu button or keyboard (Delete/Backspace key)

#### Canvas Navigation
- **Pan**: Drag background to move canvas
- **Zoom**: Scroll wheel to zoom in/out
- **Fit View**: Button or keyboard shortcut to fit entire workflow
- **MiniMap**: Bottom-right corner navigation minimap

#### Undo/Redo
- Implement undo/redo for node operations (add, delete, move, connect)
- Standard keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)

#### Selective Execution
- **Full Workflow**: Run all connected nodes
- **Single Node**: Click "Run" on a specific node to execute just that node
- **Selected Nodes**: Select multiple nodes (Ctrl+Click) and run selected group
- Each execution type creates a separate history entry

#### Parallel Execution
- Independent branches execute concurrently
- Nodes only wait for their direct dependencies, not unrelated nodes
- **Example:** If Node A and Node B have no connection:
  - Trigger both Trigger.dev tasks simultaneously
  - Do NOT wait for A to complete before starting B

#### Workflow Persistence
- Save workflows to PostgreSQL database
- Load previously saved workflows
- Auto-save functionality (optional but recommended)

#### Running Node Effect
- Nodes currently executing must have a **pulsating glow effect** to indicate active processing

---

## LLM Integration (Google Gemini API via Trigger.dev)

### API Provider
- **Google Generative AI (Gemini)** — Free tier available via [Google AI Studio](https://ai.google.dev/gemini-api)

### Execution Model
- **All LLM calls MUST run as Trigger.dev tasks** (non-negotiable)

### Supported Models
- Reference [Google Gemini API docs](https://ai.google.dev/gemini-api/docs/models)
- Support latest available models

### Features
- **Vision Support**: Accept images for multimodal prompts
- **System Prompts**: Support optional system instructions per request
- **Input Chaining**: Aggregate text/image inputs from connected nodes into the prompt
- **Error Handling**: Graceful error display with user-friendly messages
- **Loading States**: Visual feedback during API calls (spinner, disabled button)

---

## Technical Specifications

### Project Stack (Required)

| Technology | Purpose |
|-----------|---------|
| **Next.js** | React framework with App Router |
| **TypeScript** | Type safety throughout (strict mode) |
| **PostgreSQL** | Database (use Neon) |
| **Prisma** | ORM for database access |
| **Clerk** | Authentication provider |

### Integration Libraries

| Library | Purpose |
|---------|---------|
| **React Flow** | Visual workflow/node graph library |
| **Trigger.dev** | ALL node execution MUST use Trigger.dev |
| **Transloadit** | File uploads and media processing |
| **FFmpeg** | Image/video processing (via Trigger.dev) |
| **Tailwind CSS** | Styling (match Krea's theme exactly) |
| **Zustand** | State management |
| **Zod** | Schema validation |
| **@google/generative-ai** | Google Gemini SDK |
| **Lucide React** | Icon library |

### Trigger.dev Requirements

**Every node execution MUST be a Trigger.dev task.** This is non-negotiable.

| Node Type | Trigger.dev Task |
|-----------|------------------|
| **LLM Node** | Task that calls Gemini API |
| **Crop Image** | Task that runs FFmpeg crop operation |
| **Extract Frame** | Task that runs FFmpeg frame extraction |

### Parallel Task Execution
- Independent nodes (no dependencies between them) must be triggered **concurrently**
- Tasks should only await completion of their **direct upstream dependencies**
- Example:
  ```
  Node A → Node C
  Node B → Node C
  
  Trigger Task A and Task B simultaneously
  Only after both complete, trigger Task C
  ```

---

## Deliverables Checklist

### Required Deliverables

- [ ] Pixel-perfect Krea clone UI (exact spacing/colors)
- [ ] Clerk authentication with protected routes
- [ ] Left sidebar with 6 buttons (Text, Upload Image, Upload Video, LLM, Crop Image, Extract Frame)
- [ ] Right sidebar with workflow history panel
- [ ] Node-level execution history when clicking a run
- [ ] React Flow canvas with dot grid background
- [ ] Functional Text Node with textarea and output handle
- [ ] Functional Upload Image Node with Transloadit upload and image preview
- [ ] Functional Upload Video Node with Transloadit upload and video player preview
- [ ] Functional LLM Node with model selector, prompts, and run capability
- [ ] Functional Crop Image Node (FFmpeg via Trigger.dev)
- [ ] Functional Extract Frame from Video Node (FFmpeg via Trigger.dev)
- [ ] All node executions via Trigger.dev tasks
- [ ] Pulsating glow effect on nodes during execution
- [ ] Pre-built sample workflow (demonstrates all features)
- [ ] Node connections with animated colored edges
- [ ] API routes with Zod validation
- [ ] Google Gemini integration with vision support
- [ ] TypeScript throughout with strict mode
- [ ] PostgreSQL database with Prisma ORM
- [ ] Workflow save/load to database
- [ ] Workflow history persistence to database
- [ ] Workflow export/import as JSON
- [ ] Deployed on Vercel with environment variables
- [ ] Drag & drop node interface
- [ ] Canvas navigation (pan, zoom, fit view)
- [ ] DAG validation (no circular loops)
- [ ] Type-safe node connections
- [ ] Undo/redo functionality
- [ ] Selective execution (full, single, selected nodes)
- [ ] Parallel task execution for independent branches
- [ ] MiniMap navigation
- [ ] Error handling and loading states

---

## Getting API Keys

Before starting development, sign up for these services and obtain API keys:

1. **Google AI**: Go to [Google AI Studio](https://ai.google.dev/gemini-api)
2. **Clerk**: Sign up at [clerk.com](https://clerk.com)
3. **Trigger.dev**: Sign up at [trigger.dev](https://trigger.dev)
4. **Transloadit**: Sign up at [transloadit.com](https://transloadit.com)
5. **PostgreSQL**: Use [Neon](https://neon.tech) for free PostgreSQL hosting

---

## Submission Requirements

### 1. GitHub Repository
- Create a **private GitHub repository**
- Grant access to: **bluerocketinfo@gmail.com**
- Include comprehensive README with:
  - Project overview
  - Setup instructions
  - Architecture documentation
  - API route documentation
  - How to run locally
  - Environment variables required

### 2. Vercel Deployment
- Deploy the application on **Vercel**
- Provide live demo URL
- Ensure all environment variables are properly configured
- App must be fully functional on the live URL

### 3. Demo Video
- Record a **3-5 minute walkthrough** video covering:
  - ✓ User authentication flow (sign up/sign in)
  - ✓ Creating a workflow with all 6 node types
  - ✓ Uploading files (image, video) via Transloadit
  - ✓ Running the full workflow and viewing real-time status (pulsating glow on running nodes)
  - ✓ Running a single node and running selected nodes
  - ✓ Viewing workflow history in right sidebar (showing all run types)
  - ✓ Clicking a run to see node-level execution details
  - ✓ Export/import workflow as JSON
  - ✓ Example LLM response with multimodal inputs
  - ✓ UI responsiveness and smooth animations

---

## Evaluation Criteria

### Functionality (40%)
- All 6 node types fully functional
- Trigger.dev integration working correctly
- LLM responses accurate and timely
- File uploads reliable
- Workflow execution (full, single, selected) working
- History tracking accurate
- Database persistence working

### UI/UX Quality (30%)
- Pixel-perfect match to Krea.ai design
- Smooth animations and transitions
- Responsive design
- Intuitive node connections
- Clear visual feedback during execution
- Professional error messages

### Code Quality (20%)
- TypeScript strict mode throughout
- Clean, modular architecture
- Proper error handling
- Comprehensive type definitions
- Efficient state management
- Well-organized file structure

### Architecture & Engineering (10%)
- Proper separation of concerns
- Type-safe API design with Zod
- Optimal parallel execution
- Database schema design
- Environment variable management
- Deployment reliability

---

## Getting Help

- Reference [React Flow documentation](https://reactflow.dev/)
- Reference [Next.js documentation](https://nextjs.org/docs)
- Reference [Trigger.dev documentation](https://docs.trigger.dev/)
- Reference [Google Gemini API](https://ai.google.dev/gemini-api)
- Reference [Krea.ai](https://krea.ai) for design inspiration

---

## Timeline Estimate

**Recommended Timeline:** 4-6 weeks

- **Week 1-2**: Project setup, Clerk auth, React Flow canvas basics
- **Week 2-3**: Node implementations (Text, Upload Image, Upload Video)
- **Week 3-4**: LLM integration, Crop Image, Extract Frame nodes
- **Week 4-5**: History panel, workflow persistence, testing
- **Week 5-6**: Styling refinement, demo video, deployment

---

## Notes

- **Type Safety First**: Use TypeScript strict mode. Avoid `any` types.
- **Database Design**: Plan your Prisma schema carefully for workflows, runs, and history.
- **Parallel Execution**: Implement proper dependency resolution for concurrent task execution.
- **UI Polish**: Spend time matching Krea's design exactly — spacing, colors, micro-interactions matter.
- **Testing**: Test all node types extensively before submission.
- **Environment Variables**: Use `.env.local` for sensitive data; never commit keys.

---

## Good Luck! 🚀

This is an ambitious project that requires strong full-stack skills. You'll learn advanced concepts in:
- Visual programming interfaces
- Task orchestration and parallel execution
- Type-safe API design
- Database design and ORM usage
- Authentication and authorization
- Real-time status updates

Bring your A-game and build something amazing!
