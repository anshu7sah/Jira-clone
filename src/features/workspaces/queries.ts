import { Query } from "node-appwrite";
import { DATABASE_ID, MEMBER_ID, WORKSPACE_ID } from "@/config";
import { getMembers } from "../members/utils";
import { Workspace } from "./types";
import { createSessionClient } from "@/lib/appwrite";

export const getWorkspaces = async () => {
  try {
    const { account, databases } = await createSessionClient();
    const user = await account.get();

    const members = await databases.listDocuments(DATABASE_ID, MEMBER_ID, [
      Query.equal("userId", user.$id),
    ]);
    if (members.total === 0) {
      return { documents: [], total: 0 };
    }

    const allWorkspaces = members.documents.map((m) => m.workspaceId);

    const workspaceList = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACE_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", allWorkspaces)]
    );

    return workspaceList;
  } catch (error) {
    return { documents: [], total: 0 };
  }
};

interface WorkspaceId {
  workspaceId: string;
}

export const getWorkspace = async ({ workspaceId }: WorkspaceId) => {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const members = await getMembers({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (!members) {
      return null;
    }
    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACE_ID,
      workspaceId
    );

    return workspace;
  } catch (error) {
    return null;
  }
};

export const getWorkspaceDetails = async ({ workspaceId }: WorkspaceId) => {
  try {
    const { databases } = await createSessionClient();
    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACE_ID,
      workspaceId
    );

    return { name: workspace.name };
  } catch (error) {
    return null;
  }
};
