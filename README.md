# Form Builder Application

A full-stack form builder with 

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/        # Database config
│   │   ├── middleware/    # Auth middleware
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── types/         # TypeScript types
│   │   └── index.js       # Server entry
│   └── package.json
```


## Features

- **Admin Panel**: Create, edit, and delete forms with dynamic fields
- **Field Types**: Text, textarea, number, email, date, checkbox, radio, select, file, switch
- **Validation**: server-side (Zod) validation
- **Database**: sqlite3 for local setup



### Local Development

1. **Backend Setup**
```bash
cd backend
npm install
npm run dev
```


## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Forms (Admin)
- `POST /api/v1/forms` - Create form
- `GET /api/v1/forms` - List all forms


### Submissions
- `POST /api/v1/submissions` - Submit form response
- `GET /api/v1/submissions/` - Get submissions (admin)

