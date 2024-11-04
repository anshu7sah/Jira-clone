import { getCurrent } from "@/features/auth/actions";
import { redirect } from "next/navigation";

interface WorkspaceSettingsProps {
  params: {
    workspaceId: string;
  };
}

const WorkspaceSettings = async ({ params }: WorkspaceSettingsProps) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return (
    <div>
      Anshu is very handsome
      {params.workspaceId}
    </div>
  );
};

export default WorkspaceSettings;
