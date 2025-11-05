
# AI Financial Analyst
Reads financial PDFs from public companies and automatically computes SG&A margins (and future KPI expansion).
Built end-to-end: Java backend PDF extractor + modern web UI.
# Live Demo
https://finanalyst.malva.company
# Why this is valuable
Financial analysts waste hours manually pulling simple margin metrics from 10Ks / investor decks. This tool extracts it instantly from source PDFs.
Architecture
# Folder	Purpose
/java-backend	PDF extraction + calculation engine (Java + PDFBox)
/ui	Vite + React UI built with Lovable
# How it works
1.Upload a financial report PDF

2.Select a year (2022A / 2023A / 2024E…)

3.System parses revenue + SG&A

4.Outputs SG&A margin within seconds
##
Run locally
###
bash

Backend (Java)
```bash
cd java-backend

java -jar target/app.jar
UI (Vite React)
```bash
cd ui
npm install
npm run dev

### Tech Stack
Java / PDFBox (financial extraction logic)
React / Vite / Tailwind UI
Supabase (edge fn for analysis pipeline)

## Roadmap
Gross Margin extraction
Multi-company comparison
RAG model to explain why margin changed quarter → quarter
