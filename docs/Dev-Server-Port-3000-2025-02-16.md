# Dev server: Baja Land 3000, SDAH 3001 (2025-02-16)

## What was done

- **The Baja Land Company** — dev server on **port 3000 only** (`.cursor/rules/dev-server.mdc` in that project). Site: http://localhost:3000.
- **San Diego Amazing Homes** — dev server on **port 3001 only** (`.cursor/rules/dev-server.mdc` in this project). Site: http://localhost:3001. No conflict with Baja Land; both can run at once.
- **package.json (SDAH):** `dev` is `next dev -p 3001`, `start` is `next start -p 3001`.
- **SDAH rule:** `sandiegoamazinghomes/.cursor/rules/dev-server.mdc` — always use port 3001 for SDAH; on crash free port and restart on 3001; delegate to dev-server-specialist when needed.
- **Docs:** README and setup/AI-brief docs reference port 3001 for SDAH and 3000 for Baja Land.
- **Clean restart:** All Node processes were stopped, then Baja Land started on 3000 and SDAH on 3001.
