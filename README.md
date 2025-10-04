# Secure Vault - Password Manager

A secure password manager built with Next.js, featuring client-side encryption and MongoDB storage.

## Features

- 🔐 **Client-side encryption** - Your passwords are encrypted before being sent to the server
- 🎲 **Password generator** - Create strong passwords with customizable options
- 🔍 **Search & filter** - Quickly find your saved passwords
- 📋 **Copy to clipboard** - One-click copying with auto-clear
- 🛡️ **Secure authentication** - JWT-based authentication with bcrypt password hashing
- 📱 **Responsive design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT tokens with HTTP-only cookies
- **Encryption**: CryptoJS for client-side encryption
- **Password Hashing**: bcryptjs

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/vault
MONGODB_DB=vault

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Next.js Environment
NODE_ENV=development
```

### 3. Database Setup

Make sure MongoDB is running on your system. You can use:
- Local MongoDB installation
- MongoDB Atlas (cloud)
- Docker: `docker run -d -p 27017:27017 --name mongodb mongo:latest`

### 4. Run the Application

```bash
# Development mode
pnpm dev

# Production build
pnpm build
pnpm start
```

The application will be available at `http://localhost:3000`.

## Security Features

### Client-Side Encryption
- All sensitive data (passwords, usernames, notes) is encrypted using AES-256 before being sent to the server
- The server never stores plaintext passwords
- Encryption keys are generated per session

### Authentication
- Passwords are hashed using bcrypt with 12 rounds
- JWT tokens are stored in HTTP-only cookies
- Automatic token expiration (7 days)

### Data Protection
- No sensitive data in server logs
- HTTPS recommended for production
- Secure cookie settings

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Vault Operations
- `GET /api/vault` - Get all vault items for authenticated user
- `POST /api/vault` - Create new vault item
- `PUT /api/vault/[id]` - Update vault item
- `DELETE /api/vault/[id]` - Delete vault item

## Development Notes

### Encryption Implementation
The application uses CryptoJS for client-side encryption:
- AES-256 encryption for sensitive data
- Random key generation per session
- PBKDF2 key derivation for production use

### Database Schema
- **Users**: email, hashed password, timestamps
- **Vault Items**: encrypted title, username, password, URL, notes, user reference

## Deployment

### Environment Variables for Production
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vault
JWT_SECRET=your-production-secret-key
NODE_ENV=production
```

### Recommended Hosting
- Vercel (recommended for Next.js)
- Netlify
- Railway
- DigitalOcean App Platform

## Security Considerations

1. **Change JWT Secret**: Use a strong, random secret in production
2. **HTTPS Only**: Always use HTTPS in production
3. **Database Security**: Use MongoDB Atlas with proper access controls
4. **Environment Variables**: Never commit `.env.local` to version control
5. **Regular Updates**: Keep dependencies updated for security patches

## License

This project is for educational purposes. Please ensure you understand the security implications before using in production.