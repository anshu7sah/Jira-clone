import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<(typeof client.api.workspace)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.workspace)["$post"]>;

export const useCreateWorkspaces = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.workspace["$post"]({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Workspaces created.");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: () => {
      toast.error("Failed to create workspace");
    },
  });
  return mutation;
};
