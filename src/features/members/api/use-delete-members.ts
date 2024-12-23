import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.member)[":memberId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.member)[":memberId"]["$delete"]
>;

export const useDeleteMembers = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.member[":memberId"]["$delete"]({
        param,
      });
      if (!response.ok) {
        throw new Error("Failed to delete members");
      }
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Members deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: () => {
      toast.error("Failed to delete members");
    },
  });
  return mutation;
};
