import { useParams } from "next/navigation";

export const useWorkspacesId = () => {
  const params = useParams();
  return params.workspaceId as string;
};
