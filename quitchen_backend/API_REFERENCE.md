# Quitchen Backend - API Reference Guide

## Base URL
```
http://localhost:4500/api
```

## ✅ Complete Module List

### 1. AUTHENTICATION
**Prefix:** `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | Public | Create account |
| POST | `/login` | Public | Login |
| GET | `/me` | Required | Get current user |
| POST | `/logout` | Required | Logout |
| GET | `/health` | Public | Check auth service status |

---

### 2. RESTAURANTS
**Prefix:** `/api/restaurants`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/` | Required | owner | Create restaurant |
| GET | `/` | Public | - | List approved restaurants |
| GET | `/:id` | Public | - | Get restaurant details |
| GET | `/my/restaurant` | Required | owner | Get my restaurant |
| PUT | `/:id` | Required | owner | Update restaurant |
| GET | `/:id/tables` | Public | - | Get restaurant tables |
| POST | `/:id/tables` | Required | owner | Create table |
| DELETE | `/tables/:tableId` | Required | owner | Delete table |

---

### 3. MENU
**Prefix:** `/api/menu`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/restaurant/:restaurantId` | Public | - | Get menu items |
| GET | `/:id` | Public | - | Get menu item detail |
| POST | `/restaurant/:restaurantId` | Required | owner | Create menu item |
| PUT | `/:id` | Required | owner | Update menu item |
| DELETE | `/:id` | Required | owner | Delete menu item |
| PATCH | `/:id/toggle-availability` | Required | owner | Toggle availability |

---

### 4. ORDERS
**Prefix:** `/api/orders`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/restaurant/:restaurantId` | Public | Create order |
| GET | `/restaurant/:restaurantId` | Required* | Get restaurant orders |
| GET | `/:id` | Public | Get order details |
| PATCH | `/:id/status` | Required* | Update order status |
| GET | `/stats/restaurant/:restaurantId` | Required* | Get order statistics |

*Owner or Admin only

---

### 5. RESERVATIONS
**Prefix:** `/api/reservations`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/restaurant/:restaurantId` | Public | Create reservation |
| GET | `/restaurant/:restaurantId` | Required* | Get restaurant reservations |
| GET | `/:id` | Public | Get reservation details |
| PATCH | `/:id` | Required* | Update reservation |
| PATCH | `/:id/cancel` | Required* | Cancel reservation |

*Owner or Admin only

---

### 6. COMPLAINTS
**Prefix:** `/api/complaints`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/restaurant/:restaurantId` | Public | Create complaint |
| GET | `/restaurant/:restaurantId` | Required* | Get restaurant complaints |
| GET | `/:id` | Public | Get complaint details |
| PATCH | `/:id` | Required* | Update complaint |
| GET | `/stats/restaurant/:restaurantId` | Required* | Get complaint statistics |

*Owner or Admin only

---

### 7. ADMIN
**Prefix:** `/api/admin`
**Auth:** Admin Role Required

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/restaurants` | Get all restaurants |
| GET | `/restaurants/pending` | Get pending restaurants |
| POST | `/restaurants/:restaurantId/approve` | Approve restaurant |
| POST | `/restaurants/:restaurantId/reject` | Reject restaurant |
| POST | `/restaurants/:restaurantId/deactivate` | Deactivate restaurant |
| GET | `/stats` | Get platform statistics |

---

### 8. CUSTOMER
**Prefix:** `/api/customer`
**Auth:** Public (All endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/restaurants/search?q=name` | Search restaurants |
| GET | `/restaurants/city/:city` | Get restaurants by city |
| GET | `/restaurants/featured?limit=10` | Get featured restaurants |
| GET | `/restaurants/:id` | Get restaurant details |
| GET | `/restaurants/:id/reviews` | Get restaurant reviews |
| GET | `/my-orders/:phone` | Get orders by phone |
| GET | `/my-reservations/:phone` | Get reservations by phone |
| GET | `/orders/:orderId/track` | Track order status |

---

## User Roles

### 1. **Restaurant Owner** (`restaurant_owner`)
- Can create and manage one restaurant
- Can manage menus, tables, and orders for their restaurant
- Can view and respond to complaints and reservations

### 2. **Platform Admin** (`platform_admin`)
- Can view all users and restaurants
- Can approve/reject new restaurants
- Can deactivate restaurants
- Can view platform statistics
- Can manage all orders, reservations, and complaints

### 3. **Customer** (No Auth)
- Can browse restaurants
- Can search restaurants by name, cuisine, or city
- Can place orders without registration
- Can make reservations
- Can file complaints
- Can track orders by phone number

---

## Authentication Flow

```
1. User signs up/logs in → Better Auth handles it
2. Session cookie/token is set automatically
3. Protected endpoints check session via AuthGuard
4. User data injected via @CurrentUser() decorator
5. RoleGuard checks user role for admin endpoints
```

---

## Example Requests

### Create Restaurant (Owner)
```bash
POST /api/restaurants
Authorization: Bearer <session>
Content-Type: application/json

{
  "name": "Pizza Palace",
  "description": "Best pizza in Kigali",
  "cuisine": "Italian",
  "phone": "+250794889741",
  "address": "123 Main St",
  "city": "Kigali",
  "latitude": -1.9536,
  "longitude": 29.8739,
  "coverImage": "https://example.com/pizza.jpg"
}
```

### Create Order (Customer)
```bash
POST /api/orders/restaurant/:restaurantId
Content-Type: application/json

{
  "customerName": "John Doe",
  "customerPhone": "+250784123456",
  "customerEmail": "john@example.com",
  "type": "dine_in",
  "tableId": "table-1",
  "items": [
    {
      "menuItemId": "item-1",
      "quantity": 2
    }
  ],
  "specialRequests": "No onions"
}
```

### Search Restaurants (Customer)
```bash
GET /api/customer/restaurants/search?q=pizza
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Project Structure

```
src/
├── auth/              # Authentication module
├── restaurant/        # Restaurant management
├── menu/              # Menu items
├── order/             # Order management
├── reservation/       # Reservations
├── complaint/         # Complaints
├── admin/             # Admin panel
├── customer/          # Customer endpoints
├── common/            # Shared utilities
│   ├── decorators/    # @CurrentUser, @Public, @Roles
│   └── guards/        # AuthGuard, RoleGuard
├── db/                # Database & Drizzle ORM
└── app.module.ts      # Root module
```

---

## Next Steps / Future Enhancements

- [ ] Add WebSocket for real-time order updates
- [ ] Implement email notifications
- [ ] Add SMS notifications via Twilio
- [ ] Implement reviews and ratings system
- [ ] Add payment gateway integration
- [ ] Implement analytics dashboard
- [ ] Add image upload functionality
- [ ] Implement caching with Redis
- [ ] Add rate limiting
- [ ] Deploy to production (Render, Railway, etc.)
