import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export const SignInCard = () => {
  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Welcome back!</CardTitle>
      </CardHeader>
      <div className="p-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <form className="space-y-4">
          <Input
            required
            type="email"
            value={""}
            placeholder="Enter email address"
            onChange={() => {}}
            disabled={false}
          />
          <Input
            required
            type="password"
            placeholder="Enter your password"
            onChange={() => {}}
            min={8}
            max={256}
            disabled={false}
          />
          <Button className="w-full" disabled={false} size={"lg"}>
            Login
          </Button>
        </form>
      </CardContent>
      <div className="p-7">
        <DottedSeparator />
      </div>
      <CardContent className="flex flex-col gap-y-4 p-7">
        <Button size={"lg"} variant="secondary" disabled={false}>
          <FcGoogle className="mr-2" size={5} />
          Login with Google
        </Button>
        <Button size={"lg"} variant="secondary" disabled={false}>
          <FaGithub className="mr-2 size-5" />
          Login with Github
        </Button>
      </CardContent>
    </Card>
  );
};
