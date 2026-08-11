# Academic Management System — Frontend

A React-based frontend for the **Academic Management System (AMS)**.

The application provides role-based interfaces for **Administrators, Faculty, and Students**, with authentication and communication with the AMS backend API.

## Features

### Authentication

* User login
* Role-based authentication
* Protected routes
* Automatic handling of unauthorized API responses
* HTTP-only cookie-based authentication through the backend

### Admin Module

Administrators can access:

* Admin dashboard
* Faculty management
* Student management
* Course management
* Faculty-course assignment
* Registration/menu window management

### Faculty Module

Faculty users can access:

* Faculty dashboard
* Assigned courses
* Students enrolled in courses
* Faculty teaching information
* Grade roster
* Grade submission

### Student Module

Students can access:

* Student dashboard
* Student details
* Academic records
* Available courses
* Course registration
* Registration history

The current application routing separates Admin, Faculty, and Student dashboards and protects each section according to the user's role.

## Tech Stack

| Technology         | Purpose                           |
| ------------------ | --------------------------------- |
| React 19           | Frontend UI                       |
| Vite 8             | Development server and build tool |
| React Router DOM 7 | Client-side routing               |
| Bootstrap 5        | UI styling                        |
| JavaScript / JSX   | Application development           |
| ESLint             | Code quality and linting          |
| Fetch API          | Backend communication             |

The current `package.json` specifies React `19.2.8`, React Router DOM `7.18.2`, Bootstrap `5.3.8`, and Vite `8.2.0`.

## Project Structure

```text
AMS-frontend/
│
├── public/
│
├── src/
│   ├── api/
│   │   ├── apiClient.js
│   │   ├── assignment.js
│   │   ├── auth.js
│   │   ├── course.js
│   │   ├── faculty.js
│   │   ├── grading.js
│   │   ├── registrationWindow.js
│   │   └── student.js
│   │
│   ├── components/
│   │
│   ├── layouts/
│   │
│   ├── pages/
│   │   ├── admin/
│   │   ├── faculty/
│   │   ├── student/
│   │   ├── AdminDashboard.jsx
│   │   ├── FacultyDashboard.jsx
│   │   ├── StudentDashboard.jsx
│   │   └── Login.jsx
│   │
│   ├── utils/
│   │
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

The repository currently organizes API calls under `src/api`, UI pages under `src/pages`, and application layouts/components under their respective directories.

## Prerequisites

Install:

* Node.js
* npm
* Git

Verify the installations:

```bash
node --version
npm --version
git --version
```


## Clone the Repository

```bash
git clone https://github.com/Srinivasan3009/AMS-frontend.git
cd AMS-frontend
```

## Install Dependencies

Run:

```bash
npm install
```

This installs the dependencies defined in `package.json` and uses the committed `package-lock.json` to maintain consistent dependency versions.

## Environment Variables

The current frontend does **not require a `.env` file** to run.

The API client currently defines:

```javascript
const API_URL = "";
```

and sends requests using relative paths.

Therefore, when running the frontend locally, the backend API is expected to be available through the same origin or through the project's configured development/deployment setup.

### Current Configuration

```text
API_URL = ""
```


## Backend Requirement

This frontend depends on the **AMS Backend** API.

Backend repository:

[AMS Backend — GitHub](https://github.com/Srinivasan3009/AMS-backend)

The backend should be running before using authenticated application features.

For local development, the expected backend is:

```text
http://localhost:8080
```

The frontend API layer uses the browser `fetch` API and sends:

```javascript
credentials: "include"
```

so that the authentication cookie issued by the backend can be included with requests.

## Run the Application

Start the Vite development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal, normally:

```text
http://localhost:5173
```

Open the displayed URL in your browser.

## Available Scripts

### Development

```bash
npm run dev
```

Starts the Vite development server with hot module replacement.

### Production Build

```bash
npm run build
```

Creates an optimized production build.

### Preview Production Build

```bash
npm run preview
```

Runs the generated production build locally for preview.

### Lint

```bash
npm run lint
```

Runs ESLint against the project.

These scripts are defined in the current `package.json`.


## Role-Based Access

The frontend uses protected routes for the three user roles:

```text
                Login
                  │
                  ▼
          Authentication
                  │
        ┌─────────┼─────────┐
        │         │         │
        ▼         ▼         ▼
      Admin     Faculty   Student
        │         │         │
        ▼         ▼         ▼
   Admin UI   Faculty UI  Student UI
```


## API Integration

API functions are separated by feature:

| File                    | Purpose                    |
| ----------------------- | -------------------------- |
| `apiClient.js`          | Shared API request wrapper |
| `auth.js`               | Authentication APIs        |
| `assignment.js`         | Faculty/course assignments |
| `course.js`             | Course-related APIs        |
| `faculty.js`            | Faculty APIs               |
| `grading.js`            | Grade-related APIs         |
| `registrationWindow.js` | Registration window APIs   |
| `student.js`            | Student APIs               |

These files are located under `src/api`.

### Shared API Client

The shared API client:

* Uses `fetch`
* Sends credentials with requests
* Automatically sets JSON content type when required
* Handles `401 Unauthorized`
* Parses JSON responses
* Converts backend errors into JavaScript errors

For example:

```javascript
fetch("/api/me", {
    credentials: "include"
});
```

The current implementation is designed around the backend's HTTP-only authentication cookie.

## Authentication Flow

The authentication flow is:

```text
User
 │
 ▼
Login Page
 │
 ▼
POST /api/login
 │
 ▼
AMS Backend
 │
 ├── Validate credentials
 ├── Validate password
 ├── Determine user role
 └── Set authentication cookie
 │
 ▼
Frontend
 │
 ▼
Role-based Dashboard
```

The frontend does not store the JWT directly in local storage. Instead, authenticated API requests include the HTTP-only cookie through `credentials: "include"`.

## Error Handling

The API client handles HTTP errors centrally.

For a `401` response:

```text
unauthorized
```

is thrown so that individual pages/components can redirect the user to the login page.

For other API errors, the backend's `error` response is returned when available.

## Build for Production

Create the production build:

```bash
npm run build
```

The generated files will be placed in:

```text
dist/
```

The `dist` directory can then be deployed to a static hosting provider.

## Deployment Assumptions

The frontend is a client-side React application and can be deployed to a static hosting service.

When deploying:

1. Build the application with `npm run build`.
2. Deploy the generated `dist/` directory.
3. Ensure the deployed frontend can communicate with the AMS backend.
4. Configure backend CORS to allow the deployed frontend origin.
5. Ensure cookies are configured correctly for the production domain.
6. Use HTTPS in production.

## Important Assumptions

1. The AMS backend is running and accessible before using application features that require API communication.
2. Authentication is handled by the backend using an HTTP-only cookie.
3. The backend provides the `/api/*` endpoints expected by the frontend.
4. The user must authenticate before accessing role-protected dashboards.
5. Users have one of the supported roles:

   * `admin`
   * `faculty`
   * `student`
6. The backend is responsible for validating permissions; frontend route protection is an additional UI-level access control mechanism.

## Development Workflow

Recommended local setup:

```text
                 ┌──────────────────────┐
                 │   React + Vite        │
                 │   AMS Frontend        │
                 │   localhost:5173      │
                 └──────────┬───────────┘
                            │
                         HTTP API
                            │
                            ▼
                 ┌──────────────────────┐
                 │   Go + Fiber         │
                 │   AMS Backend        │
                 │   localhost:8080     │
                 └──────────┬───────────┘
                            │
                         PostgreSQL
                            │
                            ▼
                 ┌──────────────────────┐
                 │      AMS Database    │
                 └──────────────────────┘
```


### API requests return `401`

Check:

* Backend is running.
* Login was successful.
* Browser cookies are enabled.
* Requests are being sent with credentials.
* Backend CORS allows the frontend origin.

The API client already uses:

```javascript
credentials: "include"
```

for authenticated requests.

### Dashboard does not open

Check that the logged-in user's role matches the route:

```text
admin   → /admin/dashboard
faculty → /faculty/dashboard
student → /student/dashboard
```

Protected routing is implemented in `App.jsx`.

## Related Repository

### AMS Backend

[Srinivasan3009/AMS-backend](https://github.com/Srinivasan3009/AMS-backend)

The backend handles:

* Authentication
* Authorization
* Database operations
* Faculty management
* Student management
* Course management
* Course assignments
* Registration
* Academic records
* Grading

## Author

**Srinivasan S**

## License

No license is currently specified for this repository.
