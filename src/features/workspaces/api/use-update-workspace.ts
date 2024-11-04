import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.workspace)[":workspaceId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspace)[":workspaceId"]["$patch"]
>;

export const useUpdateWorkspaces = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.workspace[":workspaceId"]["$patch"]({
        form,
        param,
      });
      if (!response.ok) {
        throw new Error("failed to update workspace");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Workspaces updated.");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces", data.$id] });
    },
    onError: () => {
      toast.error("Failed to update workspace");
    },
  });
  return mutation;
};
