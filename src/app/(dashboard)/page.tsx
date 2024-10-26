import { getCurrent } from "@/features/auth/actions";
import { UserButton } from "@/features/auth/components/user-button";
import { redirect } from "next/navigation";
async function Home() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return <div className="">This is pag</div>;
}

export default Home;
