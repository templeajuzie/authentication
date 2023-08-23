# authentication

A node js, express js, and mongo db authentication workflow.

## User Authentication and Management Node.js Project

This Node.js project prioritizes efficient user management and incorporates a range of features including input validation, password encryption, pagination, comprehensive error handling, and seamless integration with MongoDB Atlas. The application harnesses the power of the Express web framework for streamlined routing and HTTP request handling.

## Prerequisites

Before launching the application, it's essential to have the following dependencies installed:

1. Node.js
2. MongoDB Atlas account
3. Dotenv
4. Nodemon
5. JWT
6. Mongoose
7. Bcrypt
8. JOI

## Installation

To get started, follow these steps:

1. Clone the repository from the private GitHub repository at templeajuzie/authentication.
2. Navigate to the project directory.
3. Install the necessary npm packages by running the following command:
   ```shell
   npm install
   ```

## Configuration

For proper functioning, create a `.env` file in the root directory of the project. Populate it with the following configuration variables:

```env
MONGODB_URI=<your_mongodb_atlas_uri>
PORT=<port_number>
SECRETE_KEY=<your_secret_key>
```

Replace `<your_mongodb_atlas_uri>` with your MongoDB Atlas database connection string, select an available `<port_number>`, and set a secure `<your_secret_key>`.

## Usage

Initiate the application by executing the command:

```shell
npm run dev
```

You can then access the application via http://localhost:8000 or http://localhost:5000.

Employ an API testing tool like Postman or Thunder Client to seamlessly interact with the application's endpoints.

## Routes

The application provides access to the following routes:

- **Post /account**: create new user
- **GET /auth/login**: login user
- **GET /account**: Check current user
- **PATCH /account**: Update current user
- **DELETE /account**: Delete current user
- **DELETE /auth/logout**: Sign Out current user

## Input Validation

Data integrity is a priority; therefore, the application enforces meticulous input validation. The following rules are upheld:

- User firstName is not mandatory, but the rest must be mandatory
- User emai addresses must be unique.
- When updating passwords, a password confirmation is obligatory and must match.
- Passwords undergo hashing before storage in the database.

## Queries and Concerns

For inquiries or assistance regarding this project, feel free to contact us via email at "templeajuzie@gmail.com".
