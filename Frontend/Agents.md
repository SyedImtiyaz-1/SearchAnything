Build a React + Tailwind CSS frontend for an AI-powered document search agent called SearchAnything. Use a dark theme with a monochrome black/white/gray palette — think terminal aesthetic meets modern SaaS. No colors except shades of gray, white, and black, with subtle green or white glow accents for "active/thinking" states.

App Layout:
A single-page app with three panels:

Left Sidebar — Folder browser & indexing controls
Center Main Area — Query input + live exploration trace feed
Right Panel — Final answer display with citations


Left Sidebar:

A folder path input field (text input, monospace font) with a "Browse" or "Set Folder" button
Below it, show a tree-style directory listing (just folder names with chevron toggles)
An "Index Folder" button that hits POST /api/index and shows a progress/status indicator
Index status badge: INDEXED (white outline pill) or NOT INDEXED (gray dashed pill)
Styling: dark gray background (gray-900), white text, thin gray-700 borders


Center Main Area:

At the top: a large search input bar (full-width, monospace or clean sans-serif, bg-gray-800, white text, border-gray-600) with a Submit button
Below it: a live exploration trace feed — this is the core UI element

Each trace event is a row that appears in real-time via WebSocket
Event types and their styling:

tool_call → show tool name in white monospace + reason in gray italic (e.g., ⚙ scan_folder("./data") — "Getting overview of all documents")
go_deeper → indented row with a ▶ Navigating into /subfolder label
ask_human → show a yellow-tinted (or just bright white) card with the AI's question + a text input for the user to reply
complete → green dot (or white checkmark) + "Exploration complete"


Show a subtle pulsing dot or spinner while the agent is thinking between steps
The trace feed should auto-scroll to the bottom as events arrive
Each row fades in with a subtle animation




Right Panel — Answer Display:

Only visible after a complete event
Show the final answer in a clean card (bg-gray-800, rounded, padding)
Citations rendered as small pill badges: [Source: filename.pdf, Section 2.1] in bg-gray-700 white text
Below the answer: a stats row showing — 📄 X docs read · 🔢 X tokens · 💰 $0.00X
A "File Trace" collapsible section listing every file the agent accessed


WebSocket Integration:

Connect to ws://localhost:8000/ws/explore on submit
Send: { "task": "<user query>", "folder": "<selected folder>" }
Handle incoming event types: tool_call, go_deeper, ask_human, human_answer, complete
For ask_human events: render an inline reply input and send back { "type": "human_answer", "answer": "..." } over the same socket


Design Details:

Font: font-mono for traces and file paths, clean sans for body text
Background: bg-gray-950 or bg-black for the root
Borders: border-gray-700 or border-gray-800 throughout, very subtle
Hover states: hover:bg-gray-800
Active/thinking glow: a very subtle shadow-white/10 or a single pixel white border pulse on the trace container
No colors — pure grayscale. The only "color" allowed is a white or off-white glow for the active state
Scrollbars: styled dark (use Tailwind's scrollbar utilities or custom CSS)
Responsive: sidebar collapses on small screens; main + right panels stack vertically


Component Structure to build:

App.jsx — layout shell
Sidebar.jsx — folder browser + index controls
SearchBar.jsx — query input
Tracefeed.jsx — live WebSocket event stream
TraceEvent.jsx — individual event row renderer
AnswerPanel.jsx — final answer + citations + stats
useWebSocket.js — custom hook managing WS connection and event queue