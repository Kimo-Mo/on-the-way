# 📡 OnTheWay API — Front-End Developer Documentation

> **Base URL**: `https://<your-domain>`
> **API Version**: v1
> **Authentication**: JWT Bearer Token (unless noted otherwise)
> **Last Updated**: July 7, 2026

---

## Table of Contents

- [Global Response Wrapper](#-global-response-wrapper)
- [Authentication](#-1-authentication-endpoints)
- [Incidents](#-2-incident-endpoints)
- [Assistance](#-3-assistance-endpoints)
- [Feed](#-4-feed-endpoints)
- [History](#-5-history-endpoints)
- [Admin — Settings](#-6-admin-settings-endpoints)
- [Admin — Help Requests](#-7-admin-help-requests-endpoints)
- [Admin — Reports](#-8-admin-reports-endpoints)
- [Admin — Users](#-9-admin-users-endpoints)
- [Admin — Dashboard](#-10-admin-dashboard-endpoints)
- [Admin — Notifications/Announcements](#-11-admin-notifications--announcements-endpoints)
- [Real-Time (SignalR Hubs)](#-12-real-time-signalr-hubs)
- [Enums Reference](#-enums-reference)
- [TypeScript Types](#-typescript-types)

---

## 🌐 Global Response Wrapper

Every API response is wrapped in a standard envelope:

```json
{
  "data": { ... },
  "isSuccess": true,
  "error": { "message": "" }
}
```

On failure:

```json
{
  "data": null,
  "isSuccess": false,
  "error": "Error description string"
}
```

### TypeScript Type

```typescript
interface ApiResponse<T> {
  data: T | null;
  isSuccess: boolean;
  error: { message: string } | string | null;
}
```

---

## 🔑 1. Authentication Endpoints

> **Base Path**: `/api/auth`
> **Auth Required**: ❌ No

---

### 1.1 Register User

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/auth/register` |
| **Auth** | ❌ Not required |
| **Content-Type** | `application/json` |
| **Description** | Create a new user account with email and password. An OTP will be sent to the email for verification. |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fullName` | `string` | ✅ | User's full name |
| `email` | `string` | ✅ | User's email address |
| `password` | `string` | ✅ | Password (min 6 chars, must contain a digit and lowercase letter) |
| `confirmPassword` | `string` | ✅ | Must match `password` |

**Request Example:**

```json
{
  "fullName": "Ali Ahmed",
  "email": "ali@example.com",
  "password": "myPass123",
  "confirmPassword": "myPass123"
}
```

**Success Response** (`200 OK`):

```json
{
  "data": {
    "isSuccess": true,
    "message": "Registration successful. OTP sent to email.",
    "otp": null,
    "errors": null
  },
  "isSuccess": true,
  "error": { "message": "" }
}
```

**Error Response** (`400 Bad Request`):

```json
{
  "data": null,
  "isSuccess": false,
  "error": "Passwords do not match."
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | Registration successful |
| `400` | Validation error (e.g., email taken, passwords mismatch) |
| `500` | Internal server error |

---

### 1.2 Verify Email (OTP)

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/auth/verify-email` |
| **Auth** | ❌ Not required |
| **Content-Type** | `application/json` |
| **Description** | Verify user email address using OTP sent during registration. |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | `string` | ✅ | The registered email address |
| `otp` | `string` | ✅ | One-time password received via email |

**Request Example:**

```json
{
  "email": "ali@example.com",
  "otp": "123456"
}
```

**Success Response** (`200 OK`):

```json
{
  "data": {
    "isSuccess": true,
    "message": "Email verified successfully."
  },
  "isSuccess": true,
  "error": { "message": "" }
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | Email verified successfully |
| `400` | Invalid or expired OTP |
| `500` | Internal server error |

---

### 1.3 Login

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/auth/login` |
| **Auth** | ❌ Not required |
| **Content-Type** | `application/json` |
| **Description** | Authenticate user and obtain a JWT token. |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | `string` | ✅ | Registered email address |
| `password` | `string` | ✅ | Account password |

**Request Example:**

```json
{
  "email": "ali@example.com",
  "password": "myPass123"
}
```

**Success Response** (`200 OK`):

```json
{
  "data": {
    "isSuccess": true,
    "message": "Login successful.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "isSuccess": true,
  "error": { "message": "" }
}
```

> ⚠️ **Important**: Store the `token` securely (e.g., `localStorage` or secure cookie). Include it in subsequent requests via the `Authorization: Bearer <token>` header.

| Status Code | Description |
|-------------|-------------|
| `200` | Login successful with JWT token |
| `400` | Invalid credentials or unverified email |
| `500` | Internal server error |

---

### 1.4 Forget Password

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/auth/forget-password` |
| **Auth** | ❌ Not required |
| **Content-Type** | `application/json` |
| **Description** | Request password reset by sending OTP to registered email. |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | `string` | ✅ | Registered email address |

**Request Example:**

```json
{
  "email": "ali@example.com"
}
```

**Success Response** (`200 OK`):

```json
{
  "data": {
    "isSuccess": true,
    "message": "OTP sent to your email."
  },
  "isSuccess": true,
  "error": { "message": "" }
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | OTP sent successfully |
| `400` | Email not found |
| `500` | Internal server error |

---

### 1.5 Reset Password

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/auth/reset-password` |
| **Auth** | ❌ Not required |
| **Content-Type** | `application/json` |
| **Description** | Reset user password using OTP and new password. |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | `string` | ✅ | Registered email address |
| `otp` | `string` | ✅ | OTP received via email |
| `newPassword` | `string` | ✅ | New password (min 6 chars) |
| `confirmNewPassword` | `string` | ✅ | Must match `newPassword` |

**Request Example:**

```json
{
  "email": "ali@example.com",
  "otp": "123456",
  "newPassword": "newSecure123",
  "confirmNewPassword": "newSecure123"
}
```

**Success Response** (`200 OK`):

```json
{
  "data": {
    "isSuccess": true,
    "message": "Password reset successfully.",
    "errors": null
  },
  "isSuccess": true,
  "error": { "message": "" }
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | Password reset successfully |
| `400` | Invalid OTP or passwords mismatch |
| `500` | Internal server error |

---

### 1.6 Google Login

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/auth/google-login` |
| **Auth** | ❌ Not required |
| **Content-Type** | `application/json` |
| **Description** | Authenticate user using Google OAuth ID token. |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `idToken` | `string` | ✅ | Google OAuth ID token obtained from Google Sign-In |

**Request Example:**

```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij..."
}
```

**Success Response** (`200 OK`):

```json
{
  "data": {
    "isSuccess": true,
    "message": "Google login successful.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "isSuccess": true,
  "error": { "message": "" }
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | Login successful with JWT token |
| `400` | Invalid Google token |
| `500` | Internal server error |

---

## 🚨 2. Incident Endpoints

> **Base Path**: `/api/incidents`
> **Auth Required**: ✅ Yes (JWT Bearer Token)

---

### 2.1 Report Incident

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/incidents/report` |
| **Auth** | ✅ Required |
| **Content-Type** | `multipart/form-data` |
| **Description** | Report a new incident with location and details, optionally with media attachments. |

**Request Body (Form Data):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `IncidentType` (int) | ✅ | Type of incident. See [IncidentType Enum](#incidenttype) |
| `latitude` | `number` | ✅ | GPS latitude of the incident location |
| `longitude` | `number` | ✅ | GPS longitude of the incident location |
| `locationName` | `string` | ✅ | Human-readable location name/address |
| `description` | `string` | ❌ | Optional description of the incident |
| `phoneNumber` | `string` | ✅ | Contact phone number |
| `image` | `File` | ❌ | Optional image attachment |

**Request Example (FormData):**

```javascript
const formData = new FormData();
formData.append('type', '0');           // Collision
formData.append('latitude', '30.0444');
formData.append('longitude', '31.2357');
formData.append('locationName', 'Cairo, Egypt');
formData.append('description', 'Two-car collision blocking the right lane');
formData.append('phoneNumber', '+201234567890');
formData.append('image', selectedFile); // optional File object
```

**Success Response** (`200 OK`):

```json
{
  "data": {
    "isSuccess": true,
    "message": "Incident reported successfully.",
    "incidentId": "abc123-def456-..."
  },
  "isSuccess": true,
  "error": { "message": "" }
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | Incident reported successfully |
| `400` | Validation error |
| `401` | Unauthorized — missing/invalid token |
| `500` | Internal server error |

---

### 2.2 Get Incident Details

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/incidents/{id}` |
| **Auth** | ✅ Required |
| **Description** | Retrieve details of a specific incident by ID. |

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | The unique incident ID |

**Success Response** (`200 OK`):

```json
{
  "data": {
    "id": "abc123-def456-...",
    "incidentType": "Collision",
    "status": "Open",
    "createdAt": "2026-07-07T10:30:00Z",
    "locationName": "Cairo, Egypt",
    "description": "Two-car collision blocking the right lane",
    "phoneNumber": "+201234567890",
    "imageUrl": "https://example.com/uploads/incident-image.jpg"
  },
  "isSuccess": true,
  "error": { "message": "" }
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | Incident details retrieved |
| `401` | Unauthorized |
| `404` | Incident not found |
| `500` | Internal server error |

---

### 2.3 Vote on Incident

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/incidents/vote` |
| **Auth** | ✅ Required |
| **Content-Type** | `application/json` |
| **Description** | Vote to confirm or reject an incident report. |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `incidentId` | `string` | ✅ | The incident ID to vote on |
| `isUpvote` | `boolean` | ✅ | `true` for upvote (confirm), `false` for downvote (reject) |

**Request Example:**

```json
{
  "incidentId": "abc123-def456-...",
  "isUpvote": true
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | Vote recorded successfully |
| `400` | Invalid request (e.g., already voted) |
| `401` | Unauthorized |
| `404` | Incident not found |
| `500` | Internal server error |

---

## 🆘 3. Assistance Endpoints

> **Base Path**: `/api/assistance`
> **Auth Required**: ✅ Yes (JWT Bearer Token)

---

### 3.1 Create Assistance Request

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/assistance/request` |
| **Auth** | ✅ Required |
| **Content-Type** | `multipart/form-data` |
| **Description** | Create a new assistance request with optional attachments. |

**Request Body (Form Data):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `AssistanceType` (int) | ✅ | Type of assistance needed. See [AssistanceType Enum](#assistancetype) |
| `description` | `string` | ❌ | Optional description of the situation |
| `address` | `string` | ✅ | Human-readable address |
| `latitude` | `number` | ✅ | GPS latitude |
| `longitude` | `number` | ✅ | GPS longitude |
| `contactNumber` | `string` | ✅ | Contact phone number |
| `image` | `File` | ❌ | Optional image attachment |

**Request Example (FormData):**

```javascript
const formData = new FormData();
formData.append('type', '1');              // FlatTire
formData.append('description', 'Front-left tire blown out on highway');
formData.append('address', 'Highway 90, km 45');
formData.append('latitude', '30.0444');
formData.append('longitude', '31.2357');
formData.append('contactNumber', '+201234567890');
formData.append('image', selectedFile);    // optional
```

**Success Response** (`200 OK`):

```json
{
  "data": {
    "isSuccess": true,
    "message": "Assistance request created successfully.",
    "requestId": "req-abc123-..."
  },
  "isSuccess": true,
  "error": { "message": "" }
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | Assistance request created |
| `400` | Validation error |
| `401` | Unauthorized |
| `500` | Internal server error |

---

### 3.2 Get Assistance Request Details

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/assistance/{id}` |
| **Auth** | ✅ Required |
| **Description** | Retrieve details of a specific assistance request by ID. |

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | The unique assistance request ID |

**Success Response** (`200 OK`):

```json
{
  "data": {
    "id": "req-abc123-...",
    "helpType": "FlatTire",
    "status": "Pending",
    "createdAt": "2026-07-07T10:30:00Z",
    "description": "Front-left tire blown out on highway",
    "address": "Highway 90, km 45",
    "contactNumber": "+201234567890",
    "imageUrl": "https://example.com/uploads/assistance-image.jpg"
  },
  "isSuccess": true,
  "error": { "message": "" }
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | Details retrieved |
| `401` | Unauthorized |
| `404` | Request not found |
| `500` | Internal server error |

---

## 📰 4. Feed Endpoints

> **Base Path**: `/api/feed`
> **Auth Required**: ✅ Yes (JWT Bearer Token)

---

### 4.1 Get Nearby Incidents

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/feed/incidents` |
| **Auth** | ✅ Required |
| **Description** | Retrieve incidents near the user's location with optional filters. |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lat` | `number` | ✅ | User's current latitude |
| `lon` | `number` | ✅ | User's current longitude |
| `type` | `string` | ❌ | Filter by incident type (e.g., `"Collision"`) |
| `time` | `string` | ❌ | Filter by time range |
| `loc` | `string` | ❌ | Filter by location keyword |

**Request Example:**

```
GET /api/feed/incidents?lat=30.0444&lon=31.2357&type=Collision
```

**Success Response** (`200 OK`):

```json
{
  "data": [
    {
      "id": "abc123-...",
      "locationName": "Cairo, Egypt",
      "type": "Collision",
      "distanceKm": 1.2,
      "createdAt": "2026-07-07T10:30:00Z",
      "status": "Open"
    },
    {
      "id": "def456-...",
      "locationName": "Giza, Egypt",
      "type": "RoadClosure",
      "distanceKm": 3.5,
      "createdAt": "2026-07-07T09:15:00Z",
      "status": "Open"
    }
  ],
  "isSuccess": true,
  "error": { "message": "" }
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | List of nearby incidents |
| `401` | Unauthorized |
| `500` | Internal server error |

---

### 4.2 Get Nearby Assistance Requests

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/feed/assistance` |
| **Auth** | ✅ Required |
| **Description** | Retrieve assistance requests near the user's location with optional filters. |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lat` | `number` | ✅ | User's current latitude |
| `lon` | `number` | ✅ | User's current longitude |
| `type` | `string` | ❌ | Filter by assistance type |
| `time` | `string` | ❌ | Filter by time range |
| `loc` | `string` | ❌ | Filter by location keyword |

**Request Example:**

```
GET /api/feed/assistance?lat=30.0444&lon=31.2357&type=FlatTire
```

**Success Response** (`200 OK`):

```json
{
  "data": [
    {
      "id": "req-abc123-...",
      "locationName": "Highway 90, km 45",
      "type": "FlatTire",
      "distanceKm": 0.8,
      "createdAt": "2026-07-07T10:30:00Z",
      "status": "Pending"
    }
  ],
  "isSuccess": true,
  "error": { "message": "" }
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | List of nearby assistance requests |
| `401` | Unauthorized |
| `500` | Internal server error |

---

### 4.3 Offer Help

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/feed/assistance/{id}/offer-help` |
| **Auth** | ✅ Required |
| **Content-Type** | `application/json` |
| **Description** | Offer help for an assistance request by providing a message. |

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | The assistance request ID |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `message` | `string` | ✅ | Message to the person requesting help |

**Request Example:**

```json
{
  "message": "I'm nearby and have a spare tire. On my way!"
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | Help offer submitted |
| `400` | Invalid request |
| `401` | Unauthorized |
| `404` | Assistance request not found |
| `500` | Internal server error |

---

### 4.4 Respond to Help Offer

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/feed/offers/{offerId}/respond` |
| **Auth** | ✅ Required |
| **Content-Type** | `application/json` |
| **Description** | Accept or reject a help offer. Only the original assistance request creator can respond. |

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `offerId` | `string` | The help offer ID |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `isAccepted` | `boolean` | ✅ | `true` to accept, `false` to reject |

**Request Example:**

```json
{
  "isAccepted": true
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | Response recorded |
| `400` | Invalid request |
| `401` | Unauthorized |
| `404` | Offer not found |
| `500` | Internal server error |

---

### 4.5 Complete Assistance Request

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/feed/assistance/{id}/complete` |
| **Auth** | ✅ Required |
| **Description** | Mark an assistance request as completed. No request body needed. |

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | The assistance request ID |

| Status Code | Description |
|-------------|-------------|
| `200` | Marked as completed |
| `400` | Invalid request |
| `401` | Unauthorized |
| `404` | Assistance request not found |
| `500` | Internal server error |

---

## 📜 5. History Endpoints

> **Base Path**: `/api/history`
> **Auth Required**: ✅ Yes (JWT Bearer Token)

---

### 5.1 Get User History

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/history` |
| **Auth** | ✅ Required |
| **Description** | Retrieve the current user's history of incidents reported and assistance requests made. |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | `string` | ❌ | Search by title or description |
| `status` | `string` | ❌ | Filter by status: `"active"`, `"completed"`, `"cancelled"` |
| `sortBy` | `string` | ❌ | Sort by: `"date"`, `"status"`, `"category"` |

**Request Example:**

```
GET /api/history?status=active&sortBy=date
```

**Success Response** (`200 OK`):

```json
{
  "data": [
    {
      "id": "abc123-...",
      "category": "Incident",
      "type": "Collision",
      "status": "Open",
      "date": "2026-07-07T10:30:00Z",
      "location": "Cairo, Egypt"
    },
    {
      "id": "req-def456-...",
      "category": "Assistance",
      "type": "FlatTire",
      "status": "Completed",
      "date": "2026-07-06T14:20:00Z",
      "location": "Highway 90, km 45"
    }
  ],
  "isSuccess": true,
  "error": { "message": "" }
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | History items retrieved |
| `401` | Unauthorized |
| `500` | Internal server error |

---

## ⚙️ 6. Admin Settings Endpoints

> **Base Path**: `/api/admin/settings`
> **Auth Required**: ✅ Yes (JWT Bearer Token — Admin role)

---

### 6.1 Get Admin Profile Settings

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/admin/settings/profile` |
| **Auth** | ✅ Required (Admin) |
| **Description** | Retrieve the current admin user's profile settings. |

**Success Response** (`200 OK`):

```json
{
  "data": {
    "fullName": "Admin User",
    "email": "admin@example.com",
    "phoneNumber": "+201234567890",
    "role": "Admin"
  },
  "isSuccess": true,
  "error": { "message": "" }
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | Profile settings retrieved |
| `401` | Unauthorized |
| `500` | Internal server error |

---

### 6.2 Update Admin Profile Settings

| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `/api/admin/settings/profile` |
| **Auth** | ✅ Required (Admin) |
| **Content-Type** | `application/json` |
| **Description** | Update the current admin user's profile settings. |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `fullName` | `string` | ✅ | Updated full name |
| `email` | `string` | ✅ | Updated email |
| `phoneNumber` | `string` | ❌ | Updated phone number (nullable) |

**Request Example:**

```json
{
  "fullName": "Admin Updated",
  "email": "admin-new@example.com",
  "phoneNumber": "+201111111111"
}
```

**Success Response** (`200 OK`):

```json
{
  "data": {
    "isSuccess": true,
    "message": "Profile updated successfully."
  },
  "isSuccess": true,
  "error": { "message": "" }
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | Profile updated |
| `400` | Validation error |
| `401` | Unauthorized |
| `500` | Internal server error |

---

### 6.3 Admin Logout

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/admin/settings/logout` |
| **Auth** | ✅ Required (Admin) |
| **Description** | Log out the current admin user. The client must remove the token from local storage. |

**Success Response** (`200 OK`):

```json
{
  "data": {
    "message": "Logged out successfully. Client must remove the token from local storage."
  },
  "isSuccess": true,
  "error": { "message": "" }
}
```

> ⚠️ **Note**: This is a stateless logout. The server does not invalidate the JWT. The client **must** delete the token from `localStorage`/cookies upon receiving this response.

| Status Code | Description |
|-------------|-------------|
| `200` | Logout acknowledged |
| `401` | Unauthorized |
| `500` | Internal server error |

---

## 📋 7. Admin Help Requests Endpoints

> **Base Path**: `/api/admin/help-requests`
> **Auth Required**: ✅ Yes (JWT Bearer Token — Admin role)

---

### 7.1 Get All Help Requests

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/admin/help-requests/` |
| **Auth** | ✅ Required (Admin) |
| **Description** | Retrieve a list of all help requests with optional filtering and sorting. |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | `string` | ❌ | Search by keyword |
| `type` | `string` | ❌ | Filter by assistance type |
| `sortOrder` | `string` | ❌ | Sort order |

**Request Example:**

```
GET /api/admin/help-requests/?search=tire&type=FlatTire&sortOrder=desc
```

**Success Response** (`200 OK`):

```json
{
  "data": [
    {
      "id": "req-abc123-...",
      "type": "FlatTire",
      "status": "Pending",
      "address": "Highway 90, km 45",
      "userName": "Ali Ahmed",
      "createdAt": "2026-07-07T10:30:00Z"
    }
  ],
  "isSuccess": true,
  "error": { "message": "" }
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | List of help requests |
| `401` | Unauthorized |
| `500` | Internal server error |

---

### 7.2 Get Help Request Details

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/admin/help-requests/{id}` |
| **Auth** | ✅ Required (Admin) |
| **Description** | Retrieve details of a specific help request by ID, including the user who submitted it. |

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | The help request ID |

**Success Response** (`200 OK`):

```json
{
  "data": {
    "id": "req-abc123-...",
    "type": "FlatTire",
    "status": "Pending",
    "createdAt": "2026-07-07T10:30:00Z",
    "description": "Front-left tire blown out",
    "address": "Highway 90, km 45",
    "latitude": 30.0444,
    "longitude": 31.2357,
    "user": {
      "name": "Ali Ahmed",
      "phone": "+201234567890",
      "email": "ali@example.com"
    }
  },
  "isSuccess": true,
  "error": { "message": "" }
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | Help request details |
| `401` | Unauthorized |
| `404` | Help request not found |
| `500` | Internal server error |

---

## 📊 8. Admin Reports Endpoints

> **Base Path**: `/api/admin/reports`
> **Auth Required**: ✅ Yes (JWT Bearer Token — Admin role)

---

### 8.1 Get All Reports

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/admin/reports/` |
| **Auth** | ✅ Required (Admin) |
| **Description** | Retrieve a list of all user reports (incidents) with optional filtering and sorting. |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | `string` | ❌ | Search by keyword |
| `type` | `string` | ❌ | Filter by incident type |
| `sortOrder` | `string` | ❌ | Sort order |

**Success Response** (`200 OK`):

```json
{
  "data": [
    {
      "id": "inc-abc123-...",
      "title": "Collision on Highway",
      "type": "Collision",
      "status": "Open",
      "address": "Cairo, Egypt",
      "createdAt": "2026-07-07T10:30:00Z",
      "upvotes": 5,
      "downvotes": 1
    }
  ],
  "isSuccess": true,
  "error": { "message": "" }
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | List of reports |
| `401` | Unauthorized |
| `500` | Internal server error |

---

### 8.2 Get Report Details

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/admin/reports/{id}` |
| **Auth** | ✅ Required (Admin) |
| **Description** | Retrieve details of a specific report by ID. |

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | The report/incident ID |

**Success Response** (`200 OK`):

```json
{
  "data": {
    "id": "inc-abc123-...",
    "description": "Two-car collision blocking right lane",
    "type": "Collision",
    "createdAt": "2026-07-07T10:30:00Z",
    "address": "Cairo, Egypt",
    "latitude": 30.0444,
    "longitude": 31.2357,
    "submittedBy": "Ali Ahmed",
    "imageUrl": "https://example.com/uploads/report-image.jpg",
    "upvotes": 5,
    "downvotes": 1
  },
  "isSuccess": true,
  "error": { "message": "" }
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | Report details |
| `401` | Unauthorized |
| `404` | Report not found |
| `500` | Internal server error |

---

## 👥 9. Admin Users Endpoints

> **Base Path**: `/api/admin/users`
> **Auth Required**: ✅ Yes (JWT Bearer Token — Admin role)

---

### 9.1 Get All Users

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/admin/users/` |
| **Auth** | ✅ Required (Admin) |
| **Description** | Retrieve a list of all users with optional filtering. |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | `string` | ❌ | Search by name or email |
| `role` | `string` | ❌ | Filter by role (e.g., `"User"`, `"Admin"`) |
| `status` | `string` | ❌ | Filter by status (e.g., `"Active"`, `"Suspended"`, `"Banned"`) |

**Success Response** (`200 OK`):

```json
{
  "data": [
    {
      "id": "user-abc123-...",
      "name": "Ali Ahmed",
      "email": "ali@example.com",
      "role": "User",
      "status": "Active",
      "trustScore": 85
    }
  ],
  "isSuccess": true,
  "error": { "message": "" }
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | List of users |
| `401` | Unauthorized |
| `500` | Internal server error |

---

### 9.2 Get User Details

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/admin/users/{id}` |
| **Auth** | ✅ Required (Admin) |
| **Description** | Retrieve detailed information about a specific user by ID, including activity history. |

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | The user ID |

**Success Response** (`200 OK`):

```json
{
  "data": {
    "id": "user-abc123-...",
    "name": "Ali Ahmed",
    "email": "ali@example.com",
    "phone": "+201234567890",
    "role": "User",
    "status": "Active",
    "trustScore": 85,
    "joinedDate": "2026-01-15T00:00:00Z",
    "activityHistory": [
      {
        "description": "Reported a collision incident",
        "type": "Incident",
        "date": "2026-07-07T10:30:00Z"
      },
      {
        "description": "Requested flat tire assistance",
        "type": "Assistance",
        "date": "2026-07-06T14:20:00Z"
      }
    ]
  },
  "isSuccess": true,
  "error": { "message": "" }
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | User details |
| `401` | Unauthorized |
| `404` | User not found |
| `500` | Internal server error |

---

### 9.3 Update User Status

| | |
|---|---|
| **Method** | `PUT` |
| **URL** | `/api/admin/users/{id}/status` |
| **Auth** | ✅ Required (Admin) |
| **Content-Type** | `application/json` |
| **Description** | Update the status of a specific user (activate, suspend, ban). |

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | The user ID |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `newStatus` | `UserStatus` (int) | ✅ | New status. See [UserStatus Enum](#userstatus) |

**Request Example:**

```json
{
  "newStatus": 2
}
```

> Values: `1` = Active, `2` = Suspended, `3` = Banned

| Status Code | Description |
|-------------|-------------|
| `200` | Status updated |
| `400` | Invalid status value |
| `401` | Unauthorized |
| `404` | User not found |
| `500` | Internal server error |

---

## 📈 10. Admin Dashboard Endpoints

> **Base Path**: `/api/admin/dashboard`
> **Auth Required**: ✅ Yes (JWT Bearer Token — Admin role)

---

### 10.1 Get Dashboard Statistics

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/admin/dashboard/` |
| **Auth** | ✅ Required (Admin) |
| **Description** | Retrieve dashboard statistics and analytics for a specified number of days. |

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `days` | `number` | ❌ | `30` | Number of days to include in the analytics |

**Request Example:**

```
GET /api/admin/dashboard/?days=7
```

**Success Response** (`200 OK`):

```json
{
  "data": {
    "totalUsers": {
      "value": 1520,
      "growthPercentage": 12.5
    },
    "totalReports": {
      "value": 342,
      "growthPercentage": 8.3
    },
    "activeHelpRequests": {
      "value": 28,
      "growthPercentage": -3.2
    },
    "reportsToday": {
      "value": 15,
      "growthPercentage": 25.0
    },
    "resolutionRate": {
      "value": 87,
      "growthPercentage": 5.1
    },
    "reportsOverTime": [
      { "label": "Mon", "value": 12 },
      { "label": "Tue", "value": 18 },
      { "label": "Wed", "value": 9 }
    ],
    "helpRequestsByCategory": [
      { "label": "CarBreakdown", "value": 45 },
      { "label": "FlatTire", "value": 32 },
      { "label": "MedicalHelp", "value": 15 },
      { "label": "Weather", "value": 8 }
    ],
    "userGrowth": [
      { "label": "Jan", "value": 120 },
      { "label": "Feb", "value": 145 }
    ],
    "recentActivities": [
      {
        "title": "New incident reported",
        "user": "Ali Ahmed",
        "date": "2026-07-07T10:30:00Z",
        "type": "Incident"
      }
    ]
  },
  "isSuccess": true,
  "error": { "message": "" }
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | Dashboard data retrieved |
| `401` | Unauthorized |
| `500` | Internal server error |

---

## 📢 11. Admin Notifications / Announcements Endpoints

> **Base Path**: `/api/admin/notifications`
> **Auth Required**: ✅ Yes (JWT Bearer Token — Admin role)

---

### 11.1 Create Announcement

| | |
|---|---|
| **Method** | `POST` |
| **URL** | `/api/admin/notifications/` |
| **Auth** | ✅ Required (Admin) |
| **Content-Type** | `application/json` |
| **Description** | Create a new announcement notification to be sent to users. |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | ✅ | Announcement title |
| `category` | `string` | ✅ | Category (e.g., `"Safety"`, `"Update"`, `"Alert"`) |
| `targetAudience` | `string` | ✅ | Target audience (e.g., `"All Users"`, `"Drivers"`) |
| `content` | `string` | ✅ | Announcement body content |
| `publishDate` | `string (ISO 8601)` | ❌ | Scheduled publish date (nullable for immediate) |
| `isPublished` | `boolean` | ✅ | Whether to publish immediately |

**Request Example:**

```json
{
  "title": "Road Safety Update",
  "category": "Safety",
  "targetAudience": "All Users",
  "content": "Please be aware of construction zones on Highway 90...",
  "publishDate": "2026-07-08T09:00:00Z",
  "isPublished": false
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | Announcement created |
| `400` | Validation error |
| `401` | Unauthorized |
| `500` | Internal server error |

---

### 11.2 Get All Announcements

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/admin/notifications/` |
| **Auth** | ✅ Required (Admin) |
| **Description** | Retrieve a list of all announcements with optional search and category filtering. |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | `string` | ❌ | Search by title or content |
| `category` | `string` | ❌ | Filter by category |

**Success Response** (`200 OK`):

```json
{
  "data": [
    {
      "id": "ann-abc123-...",
      "title": "Road Safety Update",
      "category": "Safety",
      "publishDate": "2026-07-08T09:00:00Z"
    }
  ],
  "isSuccess": true,
  "error": { "message": "" }
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | List of announcements |
| `401` | Unauthorized |
| `500` | Internal server error |

---

### 11.3 Get Announcement Details

| | |
|---|---|
| **Method** | `GET` |
| **URL** | `/api/admin/notifications/{id}` |
| **Auth** | ✅ Required (Admin) |
| **Description** | Retrieve details of a specific announcement by ID. |

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `string` | The announcement ID |

**Success Response** (`200 OK`):

```json
{
  "data": {
    "id": "ann-abc123-...",
    "title": "Road Safety Update",
    "category": "Safety",
    "targetAudience": "All Users",
    "content": "Please be aware of construction zones on Highway 90...",
    "publishDate": "2026-07-08T09:00:00Z",
    "isPublished": false,
    "adminName": "Admin User",
    "createdAt": "2026-07-07T10:00:00Z"
  },
  "isSuccess": true,
  "error": { "message": "" }
}
```

| Status Code | Description |
|-------------|-------------|
| `200` | Announcement details |
| `401` | Unauthorized |
| `404` | Announcement not found |
| `500` | Internal server error |

---

## 🔌 12. Real-Time (SignalR Hubs)

The API provides two SignalR hubs for real-time communication. Both require JWT Bearer Token authentication.

### Connection Setup

```typescript
import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://<your-domain>/hubs/notifications", {
    accessTokenFactory: () => localStorage.getItem("token") ?? ""
  })
  .withAutomaticReconnect()
  .build();

await connection.start();
```

---

### 12.1 Notification Hub

| | |
|---|---|
| **URL** | `/hubs/notifications` |
| **Auth** | ✅ Required |
| **Description** | Receives real-time notifications. Users are automatically grouped by their role and user ID on connection. |

**Behavior on Connect:**
- User is added to a group named after their **role** (from JWT claims)
- User is added to a group named after their **user ID** (for targeted notifications)

**Client-Side Listeners:**

Listen for notifications pushed by the server:

```typescript
// The server can send to role groups or individual user groups
connection.on("ReceiveNotification", (data: any) => {
  console.log("Notification received:", data);
});
```

---

### 12.2 Tracking Hub

| | |
|---|---|
| **URL** | `/hubs/tracking` |
| **Auth** | ✅ Required |
| **Description** | Real-time location tracking for assistance requests. Both the requester and helper join a shared room. |

**Server Methods (Client → Server):**

| Method | Parameters | Description |
|--------|-----------|-------------|
| `JoinTrackingRoom` | `requestId: string` | Join a tracking room for a specific assistance request |
| `SendLocationUpdate` | `requestId: string, lat: number, lon: number` | Send current location to the tracking room (helper sends this) |
| `LeaveTrackingRoom` | `requestId: string` | Leave the tracking room |

**Client Events (Server → Client):**

| Event | Payload | Description |
|-------|---------|-------------|
| `ReceiveLocationUpdate` | `{ latitude: number, longitude: number }` | Receives real-time location updates from the helper |

**Usage Example:**

```typescript
// --- Tracking Hub ---
const trackingConnection = new signalR.HubConnectionBuilder()
  .withUrl("https://<your-domain>/hubs/tracking", {
    accessTokenFactory: () => localStorage.getItem("token") ?? ""
  })
  .withAutomaticReconnect()
  .build();

await trackingConnection.start();

// Join a room (both requester and helper call this)
await trackingConnection.invoke("JoinTrackingRoom", "request-id-123");

// Helper sends location updates continuously
await trackingConnection.invoke("SendLocationUpdate", "request-id-123", 30.0444, 31.2357);

// Requester listens for location updates
trackingConnection.on("ReceiveLocationUpdate", (location) => {
  console.log(`Helper is at: ${location.latitude}, ${location.longitude}`);
  // Update the map marker
});

// Leave when done
await trackingConnection.invoke("LeaveTrackingRoom", "request-id-123");
```

---

## 📋 Enums Reference

### IncidentType

| Value (int) | Name | Description |
|-------------|------|-------------|
| `0` | `Collision` | Vehicle collision/accident |
| `1` | `RoadClosure` | Road closure or blocked road |
| `2` | `Obstacle` | Obstacle on the road |
| `3` | `SevereWeather` | Severe weather condition |
| `4` | `VehicleBreakdown` | Broken down vehicle |

### IncidentStatus

| Value (int) | Name | Description |
|-------------|------|-------------|
| `0` | `Open` | Incident is currently active |
| `1` | `Resolved` | Incident has been resolved |
| `2` | `Cancelled` | Incident report was cancelled |

### AssistanceType

| Value (int) | Name | Description |
|-------------|------|-------------|
| `0` | `CarBreakdown` | Car has broken down |
| `1` | `FlatTire` | Flat tire assistance needed |
| `2` | `MedicalHelp` | Medical assistance needed |
| `3` | `Weather` | Weather-related assistance |

### AssistanceStatus

| Value (int) | Name | Description |
|-------------|------|-------------|
| `0` | `Pending` | Request is awaiting help |
| `1` | `Accepted` | Help offer has been accepted |
| `2` | `Completed` | Assistance has been completed |
| `3` | `Cancelled` | Request was cancelled |

### OfferStatus

| Value (int) | Name | Description |
|-------------|------|-------------|
| `0` | `Pending` | Offer is awaiting response |
| `1` | `Accepted` | Offer was accepted |
| `2` | `Rejected` | Offer was rejected |

### UserStatus

| Value (int) | Name | Description |
|-------------|------|-------------|
| `1` | `Active` | User account is active |
| `2` | `Suspended` | User account is temporarily suspended |
| `3` | `Banned` | User account is permanently banned |

---

## 🏷️ TypeScript Types

Copy this file into your project to get full type safety for all API interactions.

```typescript
// ============================================================
//  OnTheWay API — TypeScript Type Definitions
// ============================================================

// ──────────────────────────────────────────────
//  Global
// ──────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  isSuccess: boolean;
  error: { message: string } | string | null;
}

// ──────────────────────────────────────────────
//  Enums
// ──────────────────────────────────────────────

export enum IncidentType {
  Collision = 0,
  RoadClosure = 1,
  Obstacle = 2,
  SevereWeather = 3,
  VehicleBreakdown = 4,
}

export enum IncidentStatus {
  Open = 0,
  Resolved = 1,
  Cancelled = 2,
}

export enum AssistanceType {
  CarBreakdown = 0,
  FlatTire = 1,
  MedicalHelp = 2,
  Weather = 3,
}

export enum AssistanceStatus {
  Pending = 0,
  Accepted = 1,
  Completed = 2,
  Cancelled = 3,
}

export enum OfferStatus {
  Pending = 0,
  Accepted = 1,
  Rejected = 2,
}

export enum UserStatus {
  Active = 1,
  Suspended = 2,
  Banned = 3,
}

// ──────────────────────────────────────────────
//  Auth — Requests
// ──────────────────────────────────────────────

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ForgetPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}

// ──────────────────────────────────────────────
//  Auth — Responses
// ──────────────────────────────────────────────

export interface RegisterResponse {
  isSuccess: boolean;
  message: string;
  otp: string | null;
  errors: unknown | null;
}

export interface LoginResponse {
  isSuccess: boolean;
  message: string;
  token: string | null;
}

export interface VerifyOtpResponse {
  isSuccess: boolean;
  message: string;
}

export interface ForgetPasswordResponse {
  isSuccess: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  isSuccess: boolean;
  message: string;
  errors: unknown | null;
}

export interface GoogleLoginResponse {
  isSuccess: boolean;
  message: string;
  token: string | null;
}

// ──────────────────────────────────────────────
//  Incident — Requests
// ──────────────────────────────────────────────

/** Sent as multipart/form-data */
export interface CreateIncidentRequest {
  type: IncidentType;
  latitude: number;
  longitude: number;
  locationName: string;
  description?: string;
  phoneNumber: string;
  image?: File;
}

export interface VoteIncidentRequest {
  incidentId: string;
  isUpvote: boolean;
}

// ──────────────────────────────────────────────
//  Incident — Responses
// ──────────────────────────────────────────────

export interface CreateIncidentResponse {
  isSuccess: boolean;
  message: string;
  incidentId: string | null;
}

export interface IncidentDetailsResponse {
  id: string;
  incidentType: string;
  status: string;
  createdAt: string; // ISO 8601 date string
  locationName: string;
  description: string | null;
  phoneNumber: string;
  imageUrl: string | null;
}

// ──────────────────────────────────────────────
//  Assistance — Requests
// ──────────────────────────────────────────────

/** Sent as multipart/form-data */
export interface CreateAssistanceRequest {
  type: AssistanceType;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  contactNumber: string;
  image?: File;
}

// ──────────────────────────────────────────────
//  Assistance — Responses
// ──────────────────────────────────────────────

export interface CreateAssistanceResponse {
  isSuccess: boolean;
  message: string;
  requestId: string | null;
}

export interface AssistanceDetailsResponse {
  id: string;
  helpType: string;
  status: string;
  createdAt: string; // ISO 8601 date string
  description: string | null;
  address: string;
  contactNumber: string;
  imageUrl: string | null;
}

// ──────────────────────────────────────────────
//  Feed
// ──────────────────────────────────────────────

export interface NearbyItemResponse {
  id: string;
  locationName: string;
  type: string;
  distanceKm: number;
  createdAt: string; // ISO 8601 date string
  status: string;
}

export interface OfferHelpRequest {
  message: string;
}

export interface RespondToOfferRequest {
  isAccepted: boolean;
}

// ──────────────────────────────────────────────
//  History
// ──────────────────────────────────────────────

export interface HistoryItemResponse {
  id: string;
  category: string; // "Incident" | "Assistance"
  type: string;
  status: string;
  date: string; // ISO 8601 date string
  location: string;
}

// ──────────────────────────────────────────────
//  Admin — Profile Settings
// ──────────────────────────────────────────────

export interface ProfileSettingsResponse {
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  email: string;
  phoneNumber?: string | null;
}

export interface UpdateProfileResponse {
  isSuccess: boolean;
  message: string;
}

// ──────────────────────────────────────────────
//  Admin — Users
// ──────────────────────────────────────────────

export interface AdminUserListItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  trustScore: number;
}

export interface AdminUserDetailsResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  trustScore: number;
  joinedDate: string; // ISO 8601 date string
  activityHistory: ActivityItem[];
}

export interface ActivityItem {
  description: string;
  type: string;
  date: string; // ISO 8601 date string
}

export interface UpdateUserStatusRequest {
  newStatus: UserStatus;
}

// ──────────────────────────────────────────────
//  Admin — Help Requests
// ──────────────────────────────────────────────

export interface AdminHelpRequestListItem {
  id: string;
  type: string;
  status: string;
  address: string;
  userName: string;
  createdAt: string; // ISO 8601 date string
}

export interface AdminHelpRequestDetails {
  id: string;
  type: string;
  status: string;
  createdAt: string; // ISO 8601 date string
  description: string | null;
  address: string;
  latitude: number;
  longitude: number;
  user: AdminUserDetails;
}

export interface AdminUserDetails {
  name: string;
  phone: string;
  email: string;
}

// ──────────────────────────────────────────────
//  Admin — Reports
// ──────────────────────────────────────────────

export interface AdminReportListItem {
  id: string;
  title: string;
  type: string;
  status: string;
  address: string;
  createdAt: string; // ISO 8601 date string
  upvotes: number;
  downvotes: number;
}

export interface AdminReportDetails {
  id: string;
  description: string;
  type: string;
  createdAt: string; // ISO 8601 date string
  address: string;
  latitude: number;
  longitude: number;
  submittedBy: string;
  imageUrl: string | null;
  upvotes: number;
  downvotes: number;
}

// ──────────────────────────────────────────────
//  Admin — Dashboard
// ──────────────────────────────────────────────

export interface MetricWithGrowth {
  value: number;
  growthPercentage: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface RecentActivityDto {
  title: string;
  user: string;
  date: string; // ISO 8601 date string
  type: string;
}

export interface DashboardAnalyticsResponse {
  totalUsers: MetricWithGrowth;
  totalReports: MetricWithGrowth;
  activeHelpRequests: MetricWithGrowth;
  reportsToday: MetricWithGrowth;
  resolutionRate: MetricWithGrowth;
  reportsOverTime: ChartPoint[];
  helpRequestsByCategory: ChartPoint[];
  userGrowth: ChartPoint[];
  recentActivities: RecentActivityDto[];
}

// ──────────────────────────────────────────────
//  Admin — Announcements
// ──────────────────────────────────────────────

export interface CreateAnnouncementRequest {
  title: string;
  category: string;
  targetAudience: string;
  content: string;
  publishDate?: string | null; // ISO 8601 date string
  isPublished: boolean;
}

export interface AnnouncementListItem {
  id: string;
  title: string;
  category: string;
  publishDate: string | null; // ISO 8601 date string
}

export interface AnnouncementDetailsResponse {
  id: string;
  title: string;
  category: string;
  targetAudience: string;
  content: string;
  publishDate: string | null; // ISO 8601 date string
  isPublished: boolean;
  adminName: string;
  createdAt: string; // ISO 8601 date string
}

// ──────────────────────────────────────────────
//  SignalR — Tracking Hub
// ──────────────────────────────────────────────

export interface LocationUpdate {
  latitude: number;
  longitude: number;
}
```

---

## 🔐 Authentication Notes

### How to Include the Token

All authenticated endpoints require a JWT Bearer token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Axios Example

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: "https://<your-domain>/api",
});

// Add auth header automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

### Fetch Example

```typescript
const response = await fetch("https://<your-domain>/api/feed/incidents?lat=30&lon=31", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

const result: ApiResponse<NearbyItemResponse[]> = await response.json();
```

---

## 📌 Quick Reference — All Endpoints

| # | Method | Endpoint | Auth | Description |
|---|--------|----------|------|-------------|
| 1 | `POST` | `/api/auth/register` | ❌ | Register new user |
| 2 | `POST` | `/api/auth/verify-email` | ❌ | Verify email with OTP |
| 3 | `POST` | `/api/auth/login` | ❌ | Login and get JWT |
| 4 | `POST` | `/api/auth/forget-password` | ❌ | Request password reset OTP |
| 5 | `POST` | `/api/auth/reset-password` | ❌ | Reset password with OTP |
| 6 | `POST` | `/api/auth/google-login` | ❌ | Google OAuth login |
| 7 | `POST` | `/api/incidents/report` | ✅ | Report an incident (form-data) |
| 8 | `GET` | `/api/incidents/{id}` | ✅ | Get incident details |
| 9 | `POST` | `/api/incidents/vote` | ✅ | Vote on an incident |
| 10 | `POST` | `/api/assistance/request` | ✅ | Create assistance request (form-data) |
| 11 | `GET` | `/api/assistance/{id}` | ✅ | Get assistance request details |
| 12 | `GET` | `/api/feed/incidents` | ✅ | Get nearby incidents |
| 13 | `GET` | `/api/feed/assistance` | ✅ | Get nearby assistance requests |
| 14 | `POST` | `/api/feed/assistance/{id}/offer-help` | ✅ | Offer help |
| 15 | `POST` | `/api/feed/offers/{offerId}/respond` | ✅ | Respond to help offer |
| 16 | `POST` | `/api/feed/assistance/{id}/complete` | ✅ | Complete assistance request |
| 17 | `GET` | `/api/history` | ✅ | Get user history |
| 18 | `GET` | `/api/admin/settings/profile` | ✅ | Get admin profile |
| 19 | `PUT` | `/api/admin/settings/profile` | ✅ | Update admin profile |
| 20 | `POST` | `/api/admin/settings/logout` | ✅ | Admin logout |
| 21 | `GET` | `/api/admin/help-requests/` | ✅ | List help requests (admin) |
| 22 | `GET` | `/api/admin/help-requests/{id}` | ✅ | Help request details (admin) |
| 23 | `GET` | `/api/admin/reports/` | ✅ | List reports (admin) |
| 24 | `GET` | `/api/admin/reports/{id}` | ✅ | Report details (admin) |
| 25 | `GET` | `/api/admin/users/` | ✅ | List users (admin) |
| 26 | `GET` | `/api/admin/users/{id}` | ✅ | User details (admin) |
| 27 | `PUT` | `/api/admin/users/{id}/status` | ✅ | Update user status (admin) |
| 28 | `GET` | `/api/admin/dashboard/` | ✅ | Dashboard analytics (admin) |
| 29 | `POST` | `/api/admin/notifications/` | ✅ | Create announcement (admin) |
| 30 | `GET` | `/api/admin/notifications/` | ✅ | List announcements (admin) |
| 31 | `GET` | `/api/admin/notifications/{id}` | ✅ | Announcement details (admin) |

### SignalR Hubs

| Hub | URL | Description |
|-----|-----|-------------|
| Notification | `/hubs/notifications` | Real-time notifications (role & user groups) |
| Tracking | `/hubs/tracking` | Real-time location tracking for assistance |
