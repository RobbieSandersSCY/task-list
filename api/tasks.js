import express from "express";
const router = express.Router();
export default router;

import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import {
  createTask,
  getTasksById,
  getTasksByUserId,
  updateTask,
  deleteTask,
} from "#db/queries/tasks";

router.use(requireUser);

router.get("/", async (req, res) => {
  const tasks = await getTasksByUserId(req.user.id);
  res.send(tasks);
});

router.post("/", requireBody(["title", "done"]), async (req, res) => {
  const { title, done } = req.body;
  const tasks = await createTask({
    title,
    done,
    user_id: req.user.id,
  });
  res.status(201).send(tasks);
});

router.param("id", async (req, res, next, id) => {
  const task = await getTasksById(id);
  if (!task) return res.status(404).send("Task not found");

  if (task.user_id !== req.user.id)
    return res
      .status(403)
      .send("You do not have access to this task");

  req.task = task;
  next();
});

router.get("/:id", (req, res) => {
  res.send(req.task);
});

router.put(
  "/:id",
  requireBody(["title", "done"]),
  async (req, res) => {
    const { title, done } = req.body;
    const task = await updateTask({
      id: req.task.id,
      title,
      done,
    });
    res.status(200).send(task);
  },
);

router.delete("/:id", async (req, res) => {
  await deleteTask(req.task.id);
  res.sendStatus(204);
});
