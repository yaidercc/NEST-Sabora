<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://res.cloudinary.com/dhy3lbvua/image/upload/v1753823369/ChatGPT_Image_29_jul_2025_04_09_16_p.m._qdvywf.png" width="100%" height="700" alt="Nest Logo" style="border-radius:10px;"/></a>
</p>

# 🍲 Sabora

**Sabora** is a modern and scalable restaurant management system designed to optimize ordering, reservations, and kitchen operations in food establishments.

## 📌 About

Sabora was built to provide a seamless and efficient experience for both restaurant staff and customers. It handles everything from order tracking and table reservations to employee roles and billing—all in a clean and structured system.

## ✨ Features

- 🧑‍🍳 Role-based user management (Admins, Waiters, Chefs, etc.)
- 🍽️ Table reservation system
- 📦 Order and dish tracking
- 📜 Digital menus
- 💳 Billing and payment records

## 🛠️ Tech Stack

| Layer         | Technology                         |
|---------------|-------------------------------------|
| Backend       | Node.js, TypeScript, NestJS         |
| Database      | PostgreSQL                          |
| Testing       | Jest, Supertest                     |
| Auth          | JWT, Passport.js                    |
| Architecture  | Domain-Driven Design (DDD), TDD     |
| Deployment    | Docker    |

## 🚀 Installation

1. **Clone the repo**

2. **Install dependencies**

```
yarn install
```

3. Clone the file ```.env.template``` and rename to ```.env```

4. Change the enviroment variables

5. **Build database:**
``` 
docker-compose up -d 
``` 

6. **Execute app** 
```yarn start:dev```
