import { getCurrent } from "@/features/auth/actions";
import { getWorkspace } from "@/features/workspaces/actions";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { redirect } from "next/navigation";

interface WorkspaceSettingsProps {
  params: {
    workspaceId: string;
  };
}

const WorkspaceSettings = async ({ params }: WorkspaceSettingsProps) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const initialValues = await getWorkspace({ workspaceId: params.workspaceId });
  if (!initialValues) {
    redirect(`/workspaces/${params.workspaceId}`);
  }
  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={initialValues} />
    </div>
  );
};

export default WorkspaceSettings;
