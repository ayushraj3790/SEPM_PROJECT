# Private Circles

The **private group** feature from Famly, extracted into a standalone app.
Create invite-code groups, share text / image / video / audio stories, manage members.

**Stack:** Express 5 + MongoDB (Mongoose) + JWT auth + Cloudinary · React 19 + Vite + Tailwind 4

## Run it
```bash
# backend
cd backend && cp .env.example .env   # fill in secrets + Cloudinary keys
npm install && npm run dev           # http://localhost:5000

# frontend
cd frontend && cp .env.example .env
npm install && npm run dev           # http://localhost:5173
```

## API (`/api/v1`)
| Method | Path | Notes |
|---|---|---|
| POST | /user/register, /user/login, /user/refresh-token, /user/logout | auth |
| GET | /user/me, /user/:userId/profile | |
| POST | /private-group/create, /join, /search | |
| GET | /private-group/my, /:groupId | |
| PATCH/DELETE | /private-group/:groupId | owner only |
| DELETE | /private-group/:groupId/members, /members/me | remove member (owner) / leave |
| POST/GET | /private-group/:groupId/stories | multipart `file` for media |
| DELETE | /private-group/:groupId/stories/:storyId | story author or group owner |

## What changed vs Famly
- PostgreSQL removed: users now live in MongoDB; `user_id` is the Mongo ObjectId (still exposed as `user_id` to the UI).
- Dropped: families, OTP signup, Google login, notifications, sockets, video calls.
- Fixes: story subdocs now have `createdAt` (sorting was a no-op), group-search regex is escaped,
  uploads go to an unserved `uploads/` temp dir (they were served from `public/`), Cloudinary cleanup no longer throws,
  token refresh now returns the user, group details/stories require membership.
