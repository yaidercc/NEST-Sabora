<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://res.cloudinary.com/dhy3lbvua/image/upload/v1753823369/ChatGPT_Image_29_jul_2025_04_09_16_p.m._qdvywf.png" width="100%" height="700" alt="Nest Logo" style="border-radius:10px;"/></a>
</p>

🍲 Sabora

Sabora is a comprehensive system for managing the core operations of a restaurant.

📌 About

Sabora provides the essential features to simplify day-to-day restaurant management, including:

Reservation management: Organize tables and customer schedules.

Staff administration: Create and manage users with different roles such as administrators, managers, waiters, and chefs.

Orders & payments: Streamline order processing with integrated payments through Stripe.

Menu control: Manage dishes and menu options with ease.

## 🚀 Demo
The API is deployed at:  
👉 [https://sabora-api.yaidercc.me/api](https://sabora-api.yaidercc.me/api)

## 🔑 Demo Admin User
To test the main features of the API, you can use the following demo admin account:

- **Username:** jhonDoe  
- **Password:** Jhondoe123*


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
| Architecture  | TDD     |
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
yarn docker:dev
``` 

6. **Execute app** 
```yarn start:dev```


### 🧪 Tests

1. Clone the file ```.env.test.template``` and rename to ```.env.test```

2. **Build database:**
``` 
yarn docker:test
``` 

3. **Execute all tests** 
``` 
yarn 
```

4. **Execute unit tests** 

``` 
yarn test:unit
```

3. **Execute integration tests** 

``` 
yarn test:int
```

3. **Execute integration tests** 

``` 
yarn test:e2e
```
