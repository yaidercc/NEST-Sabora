<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://res.cloudinary.com/dhy3lbvua/image/upload/v1753823369/ChatGPT_Image_29_jul_2025_04_09_16_p.m._qdvywf.png" width="100%" height="700" alt="Nest Logo" style="border-radius:10px;"/></a>
</p>

# 🍲 Sabora API

Sabora API is a comprehensive RESTful API for managing the core operations of a restaurant backend system.

## 📌 About

Sabora API provides the essential endpoints and business logic to simplify day-to-day restaurant management, including:

- **Reservation management**: Organize tables and customer schedules
- **Staff administration**: Create and manage users with different roles such as administrators, managers, waiters, and chefs
- **Orders & payments**: Streamline order processing with integrated payments through Stripe
- **Menu control**: Manage dishes and menu options with ease

## 🚀 Demo

The API is deployed at:  
👉 [https://sabora-api.yaidercc.me/api](https://sabora-api.yaidercc.me/api)

## 🔑 Demo Admin User

To test the main features of the API, you can use the following demo admin account:

- **Username:** `jhonDoe`
- **Password:** `Jhondoe123*`

## ✨ Features

- 🧑‍🍳 Role-based user management (Admins, Waiters, Chefs, etc.)
- 🍽️ Table reservation system
- 📦 Order and dish tracking
- 📜 Digital menu management
- 💳 Billing and payment records
- 🔐 JWT-based authentication
- 📚 Comprehensive API documentation

## 🛠️ Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Backend      | Node.js, TypeScript, NestJS         |
| Database     | PostgreSQL                          |
| Testing      | Jest, Supertest                     |
| Auth         | JWT, Passport.js                    |
| Payments     | Stripe                              |
| Architecture | TDD (Test-Driven Development)       |
| Deployment   | Docker                              |

## 🚀 Installation

1. **Clone the repository**

2. **Install dependencies**
```bash
   yarn install
```

3. **Configure environment variables**  
   Clone the file `.env.template` and rename it to `.env`

4. **Update the environment variables** in `.env` file

5. **Build database:**
```bash
   yarn docker:dev
```

6. **Start the API**
```bash
   yarn start:dev
```

The API will be available at `http://localhost:3000` (or the port specified in your `.env` file)

## 🧪 Tests

1. **Configure test environment**  
   Clone the file `.env.test.template` and rename it to `.env.test`

2. **Build test database:**
```bash
   yarn docker:test
```

3. **Run all tests**
```bash
   yarn test
```

4. **Run unit tests**
```bash
   yarn test:unit
```

5. **Run integration tests**
```bash
   yarn test:int
```

6. **Run end-to-end tests**
```bash
   yarn test:e2e
```

## 📖 API Documentation

Once the API is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost:3000/api`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
