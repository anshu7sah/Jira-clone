import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema } from "../schemas";
import { DATABASE_ID, STORAGE_ID, WORKSPACE_ID } from "@/config";
import { ID } from "node-appwrite";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const workspaceList = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACE_ID
    );

    return c.json({ data: workspaceList });
  })

  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createWorkspaceSchema),
    async (c) => {
      const { name, image } = c.req.valid("form");
      const database = c.get("databases");
      const user = c.get("user");
      const storage = c.get("storage");

      let uploadedImage: string | undefined;
      if (image instanceof File) {
        const file = await storage.createFile(STORAGE_ID, ID.unique(), image);

        const fileBuffer = await storage.getFilePreview(STORAGE_ID, file.$id);

        uploadedImage = `data:image/png;base64,${Buffer.from(
          fileBuffer
        ).toString("base64")}`;
      }

      const workspace = await database.createDocument(
        DATABASE_ID,
        WORKSPACE_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImage,
        }
      );
      return c.json({ data: workspace });
    }
  );

export default app;
