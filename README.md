# FOSSEE Workshop Booking Portal

This repository contains a UI/UX refresh of the FOSSEE workshop booking system. The project keeps the existing Django workflows and business rules, while adding a React frontend and a small JSON API layer so the core coordinator and instructor flows feel more modern, responsive, and easier to navigate.

## Overview

The work in this repo focuses on improving clarity, usability, and visual hierarchy without replacing the underlying workshop management logic.

Key goals:

- modernize the user experience
- preserve the existing Django backend
- support mobile-friendly layouts and cleaner page structure
- expose the main workflows through React pages backed by Django APIs

## What Was Improved

- Public landing page with workshop catalog and public stats
- Username-based login flow connected to Django sessions
- Coordinator registration flow connected to backend validation
- Unified dashboard for coordinator and instructor workflows
- Workshop proposal page
- Workshop detail page with comments and status actions
- Editable profile page
- JSON API endpoints added on top of the existing Django app

## UX And Design Notes

- Clear visual hierarchy for summaries, actions, and status information
- Cleaner spacing, cards, and sectioning to reduce cognitive load
- Responsive layouts that work from mobile-first up to desktop
- Lightweight UI choices without heavy component or chart libraries
- Consistent patterns across login, registration, dashboard, and profile flows

## Main App Areas

The React rebuild focuses on the core product flows from the original Django app:

- `login`
- `register`
- `workshop status` for coordinator and instructor roles
- `propose workshop`
- `workshop details`
- `view own profile`
- `workshop type list`
- `public workshop statistics`

Legacy CMS pages and admin-only management screens still remain in Django, but they were not the main target of this UI refresh.

## Tech Stack

- Frontend: React 19, React Router, Axios
- Backend: Django
- Backend config: `python-decouple`
- Styling: custom CSS with responsive component-based pages

## Project Structure

```text
FOSSEE/
|-- frontend/              # React app
|-- workshop_booking/      # Django project
|   |-- workshop_app/      # Main workshop app + API views
|   |-- workshop_portal/   # Django settings and project config
|-- README.md
```

## API Surface Added For React

The React app talks to Django through endpoints in `workshop_app/api_views.py`, including:

- `api/session/`
- `api/auth/login/`
- `api/auth/logout/`
- `api/register/`
- `api/workshop-types/`
- `api/workshops/`
- `api/workshops/<id>/`
- `api/workshops/<id>/comments/`
- `api/workshops/<id>/accept/`
- `api/workshops/<id>/change-date/`
- `api/propose/`
- `api/profile/`
- `api/profile/update/`
- `api/public-stats/`

## Local Setup

### Backend

1. Create and activate a virtual environment.
2. Install backend dependencies:

```bash
pip install -r workshop_booking/requirements.txt
```

3. Create `workshop_booking/local_settings.py` with the email settings imported by `workshop_portal/settings.py`:

```python
EMAIL_HOST = "localhost"
EMAIL_PORT = 25
EMAIL_HOST_USER = ""
EMAIL_HOST_PASSWORD = ""
EMAIL_USE_TLS = False
SENDER_EMAIL = "noreply@example.com"
```

4. Run migrations:

```bash
cd workshop_booking
python manage.py migrate
```

5. Start the Django server:

```bash
python manage.py runserver
```

The backend runs on `http://127.0.0.1:8000`.

### Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm start
```

The frontend dev server proxies API requests to `http://127.0.0.1:8000`.

## Notes

- The original backend workflows and validation are still the source of truth.
- Email activation is still part of the registration flow.
- Existing Django admin and CMS pages remain available separately.
- The frontend currently targets the core workshop booking journeys rather than every legacy screen.

## Verification

Recommended checks after setup:

- `python manage.py check`
- `npm run build`
- Manual validation of login, registration, dashboard, proposal, workshop detail, and profile flows

## Screenshots

Add screenshots here before submission if needed:

- `before-login.png`
- `after-login.png`
- `before-dashboard.png`
- `after-dashboard.png`
