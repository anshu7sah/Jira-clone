import { cookies } from "next/headers";
import { Account, Client, Databases, Query } from "node-appwrite";
import { AUTH_COOKIE } from "../auth/constants";
import { DATABASE_ID, MEMBER_ID, WORKSPACE_ID } from "@/config";

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
