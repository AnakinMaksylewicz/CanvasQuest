#CanvasQuest dev setup steps

This guide helps you get the project running locally on Windows. we run a local PostgreSQL database using Docker, so you do NOT need to install Postgres manually.

#Prereqs
- Git
- Docker desktop
    -Make sure Docker Desktop is running before you do anything else


In the repo root,

1. 'npm install' //Installs all dependencies
2. 'Copy-Item .env.example .env' //Creates a local .env file
3. 'docker compose up -d' //Sets up the docker container for our pSQL db
4. 'npm run db:init' //Initializes the database so routes can access it
5. 'npm run seed' //Seeds the db with current mock-assignments.json info
6. 'npm run dev' //Actually launches the app on localhost

Helpful tips:
Once you do docker compose up -d, that container is running until you do:
'docker compose down'
Do this whenever you're done for the day. This doesn't delete the database, just ends the container.

'docker compose down -v' deletes all database data

So, to rebuild from a clean local setup, do:
'docker compose down -v'
'docker compose up -d'
npm run db:init
npm run seed
npm run dev