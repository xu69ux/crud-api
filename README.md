# Simple CRUD API

This project implements a simple CRUD (Create, Read, Update, Delete) API using an in-memory database.

## Technical Requirements

- The project is implemented in TypeScript.
- The project uses Node.js 20 LTS version.
- The project uses asynchronous API whenever possible.

## API Endpoints

The API has the following endpoints:

- `GET /api/users`: Returns all users.
- `GET /api/users/{userId}`: Returns a user with the specified `userId`.
- `POST /api/users`: Creates a new user.
- `PUT /api/users/{userId}`: Updates an existing user with the specified `userId`.
- `DELETE /api/users/{userId}`: Deletes an existing user with the specified `userId`.

## User Model

Users are stored as objects with the following properties:

- `id`: A unique identifier (string, uuid) generated on the server side.
- `username`: The user's name (string, required).
- `age`: The user's age (number, required).
- `hobbies`: The user's hobbies (array of strings or empty array, required).

## Running the Application

The application can be run in two modes:

- Development mode: Use the `npm run start:dev` command.
- Production mode: Use the `npm run start:prod` command.

## Testing

The project includes tests for the API. You can run the tests using the `npm test` command.

## Horizontal Scaling

The application supports horizontal scaling. Use the `npm run start:multi` command to start multiple instances of the application using the Node.js Cluster API.

## Environment Variables

The application uses the following environment variables:

- `PORT`: The port on which the application runs.

## Error Handling

The application handles errors and responds with a status code of 500 and a human-friendly message.

## Non-Existing Endpoints

Requests to non-existing endpoints are handled and the server responds with a status code of 404 and a human-friendly message.

## Getting Started

To get started with this project, clone the repository and install the dependencies:

```sh
git clone https://https://github.com/xu69ux/crud-api
cd crud-api
git checkout develop
npm install
```

Then, you can start the server in development mode with:

```sh
npm run start:dev
```

Or in production mode with:

```sh
npm run start:prod
```

You can also run the tests with:

```sh
npm test
```

And start multiple instances of the application with:

```sh
npm run start:multi
```
