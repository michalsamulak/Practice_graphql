# GraphQL Practice

## Overview

This project is a practical implementation based on the "Advanced GraphQL" course by Scott Moss. It covers various aspects of building production-ready GraphQL APIs in Node.js using Apollo Server.

## Features

-   **Authentication:** Implementing authentication strategies for secure API access.
-   **Real-time Subscriptions:** Adding real-time functionality through GraphQL subscriptions.
-   **Error Handling:** Understanding and handling errors within GraphQL.
-   **Testing:** Setting up and executing tests for resolvers, schema, and the server.
-   **Custom Directives:** Exploring and implementing custom directives for enhanced control.

## Usage

### Online Testing:

You can test the project via `https://practicegraphql.onrender.com/`

### Local Installation:

1. Install dependencies:

    ```bash
    npm install
    ```

2. Run the app:

    ```bash
    npm start
    ```

3. Open GraphQL Playground at:
    ```
    http://localhost:4000/
    ```

### Signing Up

Use the following GraphQL mutation to sign up a new user:

```graphql
mutation {
    signup(
        input: {
            email: "example@email.com"
            password: "yourpassword"
            role: MEMBER
        }
    ) {
        token
        user {
            id
            email
            role
        }
    }
}
```

### Query Current User

```graphql
query {
    me {
        id
        email
    }
}
```

### Create a New Post

```graphql
mutation {
    createPost(input: { message: "Hello, GraphQL!" }) {
        id
        message
        author {
            id
            email
        }
    }
}
```

### Subscribe to New Posts

```graphql
subscription {
    newPost {
        id
        message
        author {
            id
            email
        }
    }
}
```
