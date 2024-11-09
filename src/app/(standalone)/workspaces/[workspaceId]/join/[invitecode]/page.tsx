import { getCurrent } from "@/features/auth/queries";
import { JoinWorkSpaceForm } from "@/features/workspaces/components/join-workspace-form";
import { getWorkspaceDetails } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

interface WorkspaceJoinPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspaceJoinPage = async ({ params }: WorkspaceJoinPageProps) => {
  const user = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }

  const workspace = await getWorkspaceDetails({
    workspaceId: params.workspaceId,
  });
  if (!workspace) {
    redirect("/");
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkSpaceForm initialValue={workspace} />
    </div>
  );
};

export default WorkspaceJoinPage;
