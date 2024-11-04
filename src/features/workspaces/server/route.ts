import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { DATABASE_ID, MEMBER_ID, STORAGE_ID, WORKSPACE_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { equal } from "assert";
import { MemberRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";
import { getMembers } from "@/features/members/utils";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const members = await databases.listDocuments(DATABASE_ID, MEMBER_ID, [
      Query.equal("userId", user.$id),
    ]);
    if (members.total === 0) {
      return c.json({ documents: [], total: 0 });
    }

    const allWorkspaces = members.documents.map((m) => m.workspaceId);

    const workspaceList = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACE_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", allWorkspaces)]
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
          inviteCode: generateInviteCode(10),
        }
      );

      await database.createDocument(DATABASE_ID, MEMBER_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.ADMIN,
      });
      return c.json({ data: workspace });
    }
  )
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkspaceSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const storage = c.get("storage");
      const { workspaceId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const member = await getMembers({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let uploadedImage: string | undefined;
      if (image instanceof File) {
        const file = await storage.createFile(STORAGE_ID, ID.unique(), image);

        const fileBuffer = await storage.getFilePreview(STORAGE_ID, file.$id);

        uploadedImage = `data:image/png;base64,${Buffer.from(
          fileBuffer
        ).toString("base64")}`;
      } else {
        uploadedImage = image;
      }

      const updatedWorkspaces = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACE_ID,
        workspaceId,
        {
          name,
          imageUrl: uploadedImage,
        }
      );
      return c.json({ data: updatedWorkspaces });
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const { workspaceId } = c.req.param();
    const databases = c.get("databases");
    const user = c.get("user");

    const member = await getMembers({
      databases,
      workspaceId,
      userId: user.$id,
    });
    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    //TODO: delete member projects and tasks

    await databases.deleteDocument(DATABASE_ID, WORKSPACE_ID, workspaceId);
    return c.json({ data: { $id: workspaceId } });
  });

export default app;
