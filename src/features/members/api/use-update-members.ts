import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.member)[":memberId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.member)[":memberId"]["$patch"]
>;

export const useUpdateMembers = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.member[":memberId"]["$patch"]({
        param,
        json,
      });
      if (!response.ok) {
        throw new Error("Failed to update members.");
      }
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Members updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["members", data.$id] });
    },
    onError: () => {
      toast.error("Failed to update members");
    },
  });
  return mutation;
};
