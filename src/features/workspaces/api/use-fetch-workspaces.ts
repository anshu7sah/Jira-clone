import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useFetchWorkspaces = () => {
  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await client.api.workspace.$get();
      if (!response.ok) {
        return null;
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
