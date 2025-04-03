# NodeJS Express MongoDB API

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-7%2B-brightgreen)

A secure REST API for user management built with Node.js, Express, and MongoDB featuring authentication, validation, and pagination.

## Table of Contents
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Validation Rules](#validation-rules)
- [Security](#security)
- [License](#license)

## Features

- **User Management**
  - Create user accounts with name, age, email, password, and phone number
  - Password hashing using bcrypt
  - Paginated user listing
- **Authentication**
  - Secure login with email/password
  - Password comparison with hashed values
- **Data Validation**
  - Joi validation for all inputs
  - Schema enforcement for MongoDB
- **Security**
  - Environment variables for sensitive data
  - Proper error handling

## API Endpoints

### User Routes
|     Endpoint    | Method | Description | Parameters |
|-----------------|--------|-------------|------------|
| `/user/signup`  | POST   | Create new user | `{ name, age, email, password, phoneNumber }` |
| `/user/allUsers`| GET    | Get paginated users | `page`, `limit` |
| `user/login`    | POST   | Authenticate user | `email`, `password` |

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/anonYmousFPP/Nodejs
   cd Code Optimization 2