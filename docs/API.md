# API Documentation

This document describes the API routes and data structures used in the application.

## 📋 Overview

Currently, the application is primarily client-side rendered with minimal API routes. Future versions will include more comprehensive API endpoints.

## 🔧 Current API Routes

### Health Check

**Endpoint**: `GET /api/health`

**Description**: Check if the API is running.

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-01-27T10:00:00Z"
}
```

## 🌐 External APIs

### Future Integration Plans

The following external APIs are planned for integration:

1. **Content Management**:
   - Headless CMS (Contentful/Strapi)
   - Blog posts and articles
   - Dynamic content

2. **Analytics**:
   - Google Analytics API
   - Custom analytics endpoints

3. **User Management**:
   - Authentication API
   - User profiles
   - Preferences

## 📊 Data Structures

### Translations

```typescript
interface Translations {
  nav: {
    home: string
    about: string
    services: string
    contact: string
  }
  hero: {
    title: string
    subtitle: string
    cta: string
  }
  footer: {
    copyright: string
    rights: string
  }
  theme: {
    light: string
    dark: string
    system: string
  }
}
```

### Locale

```typescript
type Locale = 'en' | 'zh'

interface LocaleContext {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}
```

### Theme

```typescript
type Theme = 'light' | 'dark' | 'system'

interface ThemeContext {
  theme: Theme
  setTheme: (theme: Theme) => void
}
```

## 🔐 API Security (Future)

### Authentication

Future API routes will implement:

1. **JWT Tokens**:
   - Access tokens (short-lived)
   - Refresh tokens (long-lived)

2. **API Keys**:
   - For external integrations
   - Rate limiting

### Authorization

Role-based access control (RBAC):
- Admin
- User
- Guest

## 📝 API Response Format

### Success Response

```typescript
interface SuccessResponse<T> {
  success: true
  data: T
  message?: string
  timestamp: string
}
```

**Example**:
```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "Example"
  },
  "timestamp": "2025-01-27T10:00:00Z"
}
```

### Error Response

```typescript
interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
  timestamp: string
}
```

**Example**:
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  },
  "timestamp": "2025-01-27T10:00:00Z"
}
```

## 🔄 Future API Endpoints

### Content API

#### Get Posts

**Endpoint**: `GET /api/posts`

**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 10)
- `locale`: 'en' | 'zh'

**Response**:
```typescript
{
  success: true,
  data: {
    posts: Post[],
    pagination: {
      page: number,
      limit: number,
      total: number,
      totalPages: number
    }
  }
}
```

#### Get Post by ID

**Endpoint**: `GET /api/posts/:id`

**Path Parameters**:
- `id`: string

**Response**:
```typescript
{
  success: true,
  data: {
    id: string,
    title: string,
    content: string,
    author: string,
    createdAt: string,
    updatedAt: string
  }
}
```

### User API (Future)

#### Get User Profile

**Endpoint**: `GET /api/user/profile`

**Headers**:
- `Authorization`: Bearer token

**Response**:
```typescript
{
  success: true,
  data: {
    id: string,
    name: string,
    email: string,
    avatar?: string,
    preferences: {
      locale: Locale,
      theme: Theme
    }
  }
}
```

#### Update User Profile

**Endpoint**: `PUT /api/user/profile`

**Headers**:
- `Authorization`: Bearer token

**Body**:
```typescript
{
  name?: string,
  email?: string,
  preferences?: {
    locale?: Locale,
    theme?: Theme
  }
}
```

**Response**:
```typescript
{
  success: true,
  data: User,
  message: "Profile updated successfully"
}
```

## 🚨 Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `BAD_REQUEST` | 400 | Invalid request parameters |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `INTERNAL_ERROR` | 500 | Internal server error |

## 📊 Rate Limiting (Future)

### Limits

- **Anonymous**: 100 requests/hour
- **Authenticated**: 1000 requests/hour
- **Premium**: 10000 requests/hour

### Headers

Response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1706356800
```

## 🧪 API Testing

### Testing Tools

- **Development**: Postman/Insomnia
- **Automated**: Jest + Supertest
- **Load Testing**: k6/Artillery

### Example Test

```typescript
// __tests__/api/health.test.ts
import { GET } from '@/app/api/health/route'

describe('Health API', () => {
  it('should return ok status', async () => {
    const response = await GET()
    const data = await response.json()
    
    expect(data.status).toBe('ok')
    expect(data.timestamp).toBeDefined()
  })
})
```

## 📚 API Versioning (Future)

### Version Strategy

- URL versioning: `/api/v1/`, `/api/v2/`
- Header versioning: `Accept: application/vnd.api+json; version=1`

### Deprecation Policy

- Minimum 6 months notice
- Migration guides provided
- Backward compatibility when possible

## 🔗 Webhooks (Future)

### Event Types

- `post.created`
- `post.updated`
- `post.deleted`
- `user.registered`
- `user.updated`

### Payload Format

```json
{
  "event": "post.created",
  "timestamp": "2025-01-27T10:00:00Z",
  "data": {
    "id": "123",
    "title": "New Post"
  }
}
```

## 📖 SDK Libraries (Future)

### JavaScript/TypeScript

```typescript
import { ApiClient } from '@0xcafe/sdk'

const client = new ApiClient({
  apiKey: 'your-api-key',
  locale: 'en'
})

const posts = await client.posts.list()
```

### Python

```python
from oxsnickers import ApiClient

client = ApiClient(api_key='your-api-key')
posts = client.posts.list()
```

## 🌐 GraphQL API (Future)

### Example Query

```graphql
query GetPosts($locale: Locale!) {
  posts(locale: $locale) {
    id
    title
    excerpt
    author {
      name
      avatar
    }
    createdAt
  }
}
```

### Example Mutation

```graphql
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    title
    content
  }
}
```

## 📝 API Documentation Tools

### Future Plans

- **OpenAPI/Swagger**: Interactive API documentation
- **GraphQL Playground**: GraphQL API explorer
- **Postman Collection**: Pre-configured requests

## 🔄 API Changelog

### Version 1.0.0 (Current)

- Initial release
- Health check endpoint
- Client-side i18n support
- Theme switching

### Roadmap

- v1.1.0: Content API
- v1.2.0: User authentication
- v1.3.0: User profiles and preferences
- v2.0.0: GraphQL API

---

Last updated: 2025-01-27  
API Version: 1.0.0

