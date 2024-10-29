import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema } from "../schemas";
import { DATABASE_ID, WORKSPACE_ID } from "@/config";
import { ID } from "node-appwrite";

const app = new Hono().post(
  "/",
  sessionMiddleware,
  zValidator("json", createWorkspaceSchema),
  async (c) => {
    const { name } = c.req.valid("json");
    const database = c.get("databases");
    const user = c.get("user");

    const workspace = await database.createDocument(
      DATABASE_ID,
      WORKSPACE_ID,
      ID.unique(),
      {
        name,
        userId: user.$id,
      }
    );
    return c.json({ data: workspace });
  }
);

export default app;
