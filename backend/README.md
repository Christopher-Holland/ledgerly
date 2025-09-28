# Ledgerly Backend API

A comprehensive financial tracking backend API built with Node.js, Express, MongoDB, and JWT authentication.

## 🚀 Features

- **User Authentication**: Username-based registration and login with JWT tokens
- **Transaction Management**: Full CRUD operations for income and expense tracking
- **Category Management**: Customizable categories with colors and icons
- **Financial Analytics**: Transaction statistics and balance calculations
- **Data Security**: Password hashing with bcryptjs and secure JWT tokens
- **MongoDB Integration**: Scalable database with Mongoose ODM

## 📁 Project Structure

```
backend/
├── controllers/
│   ├── authController.js      # Authentication logic
│   ├── userController.js      # User profile management
│   ├── transactionController.js # Transaction CRUD operations
│   └── categoryController.js   # Category management
├── models/
│   ├── User.js               # User schema with password hashing
│   ├── Transaction.js         # Transaction schema
│   └── Category.js           # Category schema
├── routes/
│   ├── authRoutes.js         # Authentication routes
│   ├── userRoutes.js         # User routes
│   ├── transactionRoutes.js   # Transaction routes
│   └── categoryRoutes.js     # Category routes
├── middleware/
│   └── authMiddleware.js     # JWT authentication middleware
├── utils/
│   └── db.js                 # MongoDB connection
├── server.js                 # Main application entry point
├── package.json              # Dependencies and scripts
└── .env                      # Environment variables
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ledgerly/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   # MongoDB Atlas Connection
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ledgerly?retryWrites=true&w=majority
   
   # JWT Secret (generate a strong secret)
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # Server Port
   PORT=4000
   
   # Node Environment
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user profile

### Transactions
- `GET /api/transactions` - Get all transactions (with pagination and filters)
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/stats` - Get transaction statistics

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category
- `POST /api/categories/default` - Create default categories for new user

### Health Check
- `GET /api/health` - API health status

## 🔐 Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📝 Request/Response Examples

### Register User
```json
POST /api/auth/register
{
  "name": "John Doe",
  "username": "johndoe",
  "password": "password123"
}

Response:
{
  "_id": "...",
  "name": "John Doe",
  "username": "johndoe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Create Transaction
```json
POST /api/transactions
Authorization: Bearer <token>
{
  "type": "expense",
  "amount": 25.50,
  "description": "Lunch at restaurant",
  "category": "category_id_here",
  "date": "2024-01-15",
  "tags": ["food", "dining"],
  "notes": "Business lunch"
}
```

### Create Category
```json
POST /api/categories
Authorization: Bearer <token>
{
  "name": "Food & Dining",
  "type": "expense",
  "color": "#EF4444",
  "icon": "🍽️",
  "budget": 500
}
```

## 🧪 Testing with Postman

1. **Import the API collection** (if available)
2. **Set up environment variables**:
   - `base_url`: `http://localhost:4000`
   - `token`: (will be set after login)

3. **Test flow**:
   1. Register a new user
   2. Login to get token
   3. Create default categories
   4. Create transactions
   5. View statistics

## 🔧 Development

- **Hot Reload**: Uses nodemon for automatic server restart
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Validation**: Input validation for all endpoints
- **Security**: Password hashing, JWT tokens, and CORS protection

## 🚀 Deployment

The API is ready for deployment on platforms like:
- Heroku
- Railway
- DigitalOcean
- AWS
- Google Cloud

Make sure to set the environment variables in your deployment platform.

## 📊 Database Schema

### User
- `name`: String (required)
- `username`: String (required, unique)
- `password`: String (required, hashed)
- `createdAt`: Date
- `updatedAt`: Date

### Transaction
- `user`: ObjectId (ref: User)
- `type`: String (enum: 'income', 'expense')
- `amount`: Number (required, min: 0)
- `description`: String (required)
- `category`: ObjectId (ref: Category)
- `date`: Date (required)
- `tags`: [String]
- `notes`: String

### Category
- `user`: ObjectId (ref: User)
- `name`: String (required, unique per user)
- `type`: String (enum: 'income', 'expense')
- `color`: String (hex color)
- `icon`: String (emoji)
- `budget`: Number (default: 0)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.
