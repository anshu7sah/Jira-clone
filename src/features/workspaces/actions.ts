import { cookies } from "next/headers";
import { Account, Client, Databases, Query } from "node-appwrite";
import { AUTH_COOKIE } from "../auth/constants";
import { DATABASE_ID, MEMBER_ID, WORKSPACE_ID } from "@/config";
import { getMembers } from "../members/utils";
import { Workspace } from "./types";

export const getWorkspaces = async () => {
  try {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = await cookies().get(AUTH_COOKIE);
    if (!session) {
      return { documents: [], total: 0 };
    }
    client.setSession(session.value);
    const account = new Account(client);
    const databases = new Databases(client);
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
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    const session = await cookies().get(AUTH_COOKIE);
    if (!session) {
      return null;
    }
    client.setSession(session.value);
    const account = new Account(client);
    const databases = new Databases(client);
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
