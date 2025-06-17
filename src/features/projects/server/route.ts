import { DATABASE_ID, PROJECTS_ID, STORAGE_ID } from "@/config";
import { getMembers } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { CreateProjectSchema } from "../schema";

const app = new Hono()
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", CreateProjectSchema),
    async (c) => {
      const { name, image, workspaceId } = c.req.valid("form");
      const databases = c.get("databases");
      const user = c.get("user");
      const storage = c.get("storage");

      const member = await getMembers({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let uploadedImage: string | undefined;
      if (image instanceof File) {
        const file = await storage.createFile(STORAGE_ID, ID.unique(), image);

        const fileBuffer = await storage.getFilePreview(STORAGE_ID, file.$id);

        uploadedImage = `data:image/png;base64,${Buffer.from(
          fileBuffer
        ).toString("base64")}`;
      }

      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        {
          name,
          workspaceId,
          imageUrl: uploadedImage,
        }
      );

      return c.json({ data: project });
    }
  )
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { workspaceId } = c.req.valid("query");

      if (!workspaceId) {
        return c.json({ error: "Missing workspace Id" }, 400);
      }

      const member = await getMembers({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ]);
      return c.json({ data: projects }, 200);
    }
  );

export default app;
