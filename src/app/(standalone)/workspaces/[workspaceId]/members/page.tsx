import { getCurrent } from "@/features/auth/queries";
import { MembersList } from "@/features/members/components/member-list";
import { redirect } from "next/navigation";

const WorkspaceIdMemberPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return (
    <div className="w-full lg:max-w-xl">
      <MembersList />
    </div>
  );
};

export default WorkspaceIdMemberPage;
