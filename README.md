# Todo Demo

Run with Docker:

```bash
docker compose up --build
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:8000`

API:

- `GET /api/tasks`
- `POST /api/tasks`
- `POST /api/tasks/{id}/toggle`
- `POST /api/tasks/{id}/pin`

Known limits:

- Tasks are stored in memory, so restarting the backend resets the list.
- The example stays intentionally small and does not include a database or authentication.
