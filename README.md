# 🚀 Data Alchemist: AI-Powered Resource Allocation Configurator

**Data Alchemist** is an AI-enabled Next.js application that helps you clean, validate, and configure resource allocation data from messy spreadsheets.

---

## 📦 Features

- 📂 Upload CSV or XLSX files for:
  - Clients
  - Workers
  - Tasks

- 🧠 AI-Powered Parsing:
  - Smart header mapping
  - Automatic data structure normalization

- 🧪 Validations:
  - Real-time and on-upload validations
  - Missing columns, invalid formats, broken references, etc.
  - Visual error highlighting and summary panel

- ✍️ Inline Editing:
  - Edit data directly in a spreadsheet-style UI

- 🔍 Natural Language Query:
  - Filter data using plain English (e.g., "tasks with duration > 1")

- 📋 Rule Builder:
  - Build business rules using UI
  - Generate `rules.json` file automatically

- 🎛️ Prioritization Controls:
  - Sliders to assign weightage (e.g., priority, fairness, workload)

- 📤 Export:
  - Cleaned CSV files + generated `rules.json` ready for downstream tools

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + TailwindCSS
- **State Management:** Zustand
- **Data Grid:** AG Grid / TanStack Table
- **CSV/XLSX Parsing:** PapaParse + SheetJS
- **AI Integration:** OpenAI / Groq / Gemini (LLM-based AI helpers)
- **Export Tools:** json2csv, html2pdf.js, XLSX

---

## 📁 Folder Structure

    below 
    data-alchemist/
    │
    ├── app/
    │   ├── page.tsx                # Home page with uploader + intro
    │   ├── dashboard/              # Main screen after upload
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   └── [entity]/           # clients | tasks | workers tables
    │
    ├── components/
    │   ├── DataTable.tsx           # Table with inline editing + validation
    │   ├── FileUploader.tsx        # Drag-drop + file parser
    │   ├── ValidationPanel.tsx     # Errors summary sidebar
    │   ├── RuleBuilder.tsx         # UI to add rules manually
    │   ├── RuleSuggestions.tsx     # AI-suggested rules
    │   ├── PrioritySliders.tsx     # Sliders for setting weights
    │   ├── AIQueryBar.tsx          # Natural language search/mod
    │   └── ExportPanel.tsx         # Download cleaned data + rule.json
    │
    ├── lib/
    │   ├── validations.ts          # All validation functions
    │   ├── ai.ts                   # Calls to LLM (query > json, rule suggest)
    │   └── parseUtils.ts           # Header mapping, normalizing
    │
    ├── public/
    │
    ├── samples/
    │   ├── clients.csv
    │   ├── workers.csv
    │   └── tasks.csv
    │
    ├── types/
    │   ├── client.d.ts
    │   ├── worker.d.ts
    │   └── task.d.ts
    │
    ├── utils/
    │   └── exportUtils.ts
    │
    ├── README.md
    └── package.json
