# CanvasQuest
CanvasQuest is a web app that displays assignments due between Monday and Sunday and visualizes completion through a weekly progress bar.

#Local setup
1. Install dependencies
    - 'npm install'

2. Copy environment file
    -In powershell and in the repo root, do `Copy-Item .env.example .env`

3. Start Postgres
    -If you haven't done so, install docker and run it.
    - 'docker compose up -d'

4. Initialize database schema
    - 'npm run db:init'

5. Seed demo data
    - 'npm run seed'

6. Start app
    - 'npm run dev'