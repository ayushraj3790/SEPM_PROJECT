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
| POST | /private-group/:groupId/stories | multipart: `contentType`, `text`, optional `title`, `memoryDate` (YYYY-MM-DD, not in the future), `file` |
| GET | /private-group/:groupId/stories | query: `page`, `limit`, `q` (search title/text/person/month/year), `sort=memory\|created`, `order=asc\|desc`, `from`, `to` |
| DELETE | /private-group/:groupId/stories/:storyId | story author or group owner |
