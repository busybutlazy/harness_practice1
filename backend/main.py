from itertools import count

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Todo Demo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Task(BaseModel):
    id: int
    title: str
    completed: bool = False
    pinned: bool = False


class TaskCreate(BaseModel):
    title: str


task_ids = count(start=1)
tasks: list[Task] = [
    Task(id=next(task_ids), title="Try the todo demo", pinned=True),
    Task(id=next(task_ids), title="Add a new task"),
]


def get_task(task_id: int) -> Task:
    for task in tasks:
        if task.id == task_id:
            return task
    raise HTTPException(status_code=404, detail="Task not found")


def ordered_tasks() -> list[Task]:
    return sorted(tasks, key=lambda task: (not task.pinned, task.id))


@app.get("/api/tasks", response_model=list[Task])
def list_tasks() -> list[Task]:
    return ordered_tasks()


@app.post("/api/tasks", response_model=Task, status_code=201)
def create_task(payload: TaskCreate) -> Task:
    task = Task(id=next(task_ids), title=payload.title)
    tasks.append(task)
    return task


@app.post("/api/tasks/{task_id}/toggle", response_model=Task)
def toggle_task(task_id: int) -> Task:
    task = get_task(task_id)
    task.completed = not task.completed
    return task


@app.post("/api/tasks/{task_id}/pin", response_model=Task)
def pin_task(task_id: int) -> Task:
    task = get_task(task_id)
    task.pinned = not task.pinned
    return task
