# Library Management System

## Overview

Library Management System is an API that allows users to create, delete, update, read books. It also provides CRUD operations for Borrowers.
Users can borrow a book and keep track of all valid copies of books, get all borrowings and dueDates. 

[![technologies](https://skillicons.dev/icons?i=nodejs,js,express,prisma,postgresql,git,github,postman)](#backend)

## Table of Contents

- [Library Management System API](#library-management-system)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Schema Diagram for DB](#schema-diagram-for-db)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Endpoints](#endpoints)
  - [Technology Stack](#technology-stack)
      - [Backend](#backend)
      - [Documentation](#documentation)
      - [Deployment](#deployment)
      - [Version Control](#version-control)
  - [How to Contribute](#how-to-contribute)


## Schema Diagram for DB
![schema](docs/DB_schema.png)
## Getting Started

### Prerequisites

Before getting started, Ensure you have installed the following:

- Node.js and npm
- PostgreSql

### Installation

1. Clone the repository: `$ git clone git@github.com:MohamedAEmara/Library-Management-System-API.git`
2. Install dependencies: `$ npm install`
3. Configure environment variables: Create a `.env` file in the root directory.
   - Copy [.env.example](.env.example) content to `.env` file
   - Add values for environment variables
     > you can set `DATABASE_URL` by the same like this format:
     > `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
4. Migrate prisma schema to the db by running these commands:
   ```bash
       $ npx prisma generate
       $ npx prisma migrate dev --name init
   ```

## Endpoints

You can check endpoints & documentation on Postman from [here](https://documenter.getpostman.com/view/29997574/2s9Yyy7yKH)

## Technology Stack

The **Library Management System API** uses the following technologies and tools:

#### Backend

- **Node.js:** The server-side runtime environment for executing JavaScript code.
- **Express.js:** A minimal and flexible Node.js web application framework for building robust APIs.
- **PostgreSQL:** A powerful open-source relational database used for storing books and borrowers.
- **Prisma:** A modern database toolkit and ORM for Node.js and TypeScript.


#### Documentation

- **Postman:** Used to provide a collection for API requests.

#### Deployment

- **Render:** A cloud platform for hosting and deploying web applications.
- You can try API endpoints on this link: [Library Management System](https://library-management-system-api-b8y4.onrender.com/)

#### Version Control

- **Git:** A distributed version control system.
- **GitHub:** A web-based platform for version control and collaboration.

## How to Contribute

If you'd like to contribute to the project or have suggestions for improvement, please do not hesitate to make pull request.