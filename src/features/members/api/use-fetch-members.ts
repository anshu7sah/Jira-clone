import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetMembersProps {
  workspaceId: string;
}

export const useFetchMembers = ({ workspaceId }: UseGetMembersProps) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await client.api.member.$get({ query: { workspaceId } });
      if (!response.ok) {
        return null;
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
