import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseFetchProjectsProps {
  workspaceId: string;
}

export const useFetchProjects = ({ workspaceId }: UseFetchProjectsProps) => {
  const query = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await client.api.project.$get({
        query: { workspaceId },
      });
      if (!response.ok) {
        return null;
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
