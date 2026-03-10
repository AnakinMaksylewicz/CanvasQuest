#CanvasQuest dev setup steps

This guide helps you get the project running locally on Windows. we run a local PostgreSQL database using Docker, so you do NOT need to install Postgres manually.

#Prereqs
- Git
- Docker desktop
    -Make sure Docker Desktop is running before you do anything else

Create a local environment file by running this in the repo root:
    copy .env.example .env
Now you have a .env file in the repo root. NEVER commit this to GitHub, cus private keys etc... 
Replace the TOKEN_ENCRYPTION_KEY with whatever we decide it's going to be. It should be the same across all three of our .env files, and preferably it should be a random 32-byte value stored as a string

One time setup:
1. Open a terminal in the repo root.
2. To start the Postgres database, run:
    docker compose up -d
3. To confirm the container is running, run:
    docker ps
You should see canvasquest_db
4. To confirm you can connect to the database, do this:
    docker exec -it canvasquest_db psql -U canvasquest -d canvasquest
If it works, you'll see something like canvasquest=#
Now run:
    \dt
    \q
\dt lists tables
\q quits PostgreSQL
5. To stop the Postgres container, run:
    docker compose down
Since our database data is stored in a Docker container, the data persists and will be available next time we run the container again.