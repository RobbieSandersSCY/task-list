import express from "express";
const router = express.Router();
export default router;

import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";
import { createUser, getUserByUsername } from "#db/queries/users";
import bcrypt from "bcrypt";

router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const user = await createUser({ username, password });

    const token = await createToken({ id: user.id });
    res.status(201).send(token);
  },
);

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    if (!user)
      return res.status(401).send("Invalid username or password");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid)
      return res.status(401).send("Invalid username or password");

    const token = await createToken({ id: user.id });
    res.send(token);
  },
);
