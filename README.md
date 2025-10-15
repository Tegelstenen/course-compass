# Course Compass

Course Compass is a full-stack application designed to help KTH students search for and explore courses. It features a Next.js frontend and a NestJS backend, powered by ElasticSearch for searching and PostgreSQL for data storage.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js)
-   [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/Tegelstenen/course-compass.git
cd course-compass
```

### 2. Install Dependencies

Install all the necessary dependencies for both the frontend and backend from the root directory.

```bash
npm i
```

### 3. Set Up Environment Variables

You'll need to create two `.env` files, one for the backend and one for the frontend.

**Backend (`backend-nest/.env`)**

Create a file at `backend-nest/.env` and add the following variables.

```env
# PostgreSQL database connection string
DATABASE_URL=postgresql://user:password@host:port/database

# ElasticSearch credentials
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD= # The password you get after starting ElasticSearch

# SuperTokens Authentication
ST_CONNECTION_URI=https://try.supertokens.com
ST_API_KEY=

# Application URLs and Port
PORT=8080
WEBSITE_DOMAIN=http://localhost:3000
```

**Frontend (`frontend/.env`)**

Create a file at `frontend/.env` and add the following variables.

```env
NEXT_PUBLIC_BACKEND_DOMAIN=http://localhost:8080
NEXT_PUBLIC_WEBSITE_DOMAIN=http://localhost:3000
```

### 4. Set Up the Database

This project uses PostgreSQL and `drizzle-orm`. Make sure you have a running PostgreSQL instance and that the `DATABASE_URL` in `backend-nest/.env` is configured correctly.

Once configured, run the database migrations to set up the schema:

```bash
cd backend-nest
npm run db:generate -C backend-nest
npm run db:push -C backend-nest
```

### 5. Start ElasticSearch

You can run a local instance of ElasticSearch using Docker. The following command will download and start it.

```bash
curl -fsSL https://elastic.co/start-local | sh
```

When it starts, it will print a password for the `elastic` user. **Make sure to copy this password and add it to the `ELASTICSEARCH_PASSWORD` variable in your `backend-nest/.env` file.**

### 6. Start the Development Servers

You can now start the backend and frontend servers.

**Start the Backend**

```bash
npm run dev:be
```

**Start the Frontend**

```bash
npm run dev:fe
```

The frontend will be available at [http://localhost:3000](http://localhost:3000).

### 7. Ingest Data

After the backend has started, you can ingest course data into ElasticSearch by running the following command:

```bash
curl -X POST "http://localhost:8080/ingest/courses"
```

This process may take some time. You can monitor the logs from the backend server for progress.

### 8. Build Docker Image (should this be here or internally?)
To build the Docker image, run

```bash
docker build -t username/frontend-image -f Dockerfile.frontend .
docker build -t username/backend-image -f Dockerfile.backend .
```

## Available Scripts

The following scripts are available to be run from the root directory:

| Script         | Description                                        |
| -------------- | -------------------------------------------------- |
| `npm run dev:fe`   | Starts the frontend development server.            |
| `npm run dev:be`   | Starts the backend development server.             |
| `npm run add:fe`   | Adds a dependency to the frontend workspace.     |
| `npm run add:be`   | Adds a dependency to the backend workspace.      |
| `npm run rm:fe`    | Removes a dependency from the frontend workspace.  |
| `npm run rm:be`    | Removes a dependency from the backend workspace.   |

Other scripts can be found in the `package.json` files within the `frontend` and `backend-nest` directories.
