"use client";

import { useFetchWorkspaces } from "@/features/workspaces/api/use-fetch-workspaces";
import { RiAddCircleFill } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";

export const WorkspacesSwitcher = () => {
  const { data: workspaces } = useFetchWorkspaces();
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500 ">Workspaces</p>
        <RiAddCircleFill className="cursor-pointer size-5 text-neutral-500 hover:opacity-75 transition" />
      </div>
      <Select>
        <SelectTrigger className="bg-neutral-200 w-full font-medium p-1">
          <SelectValue placeholder={"No Workspace Selected"} />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.documents?.map((workspace) => (
            <SelectItem key={workspace.$id} value={workspace.$id}>
              <div className="flex items-center justify-start gap-3 font-medium">
                <WorkspaceAvatar
                  name={workspace.name}
                  image={workspace.imageUrl}
                />
                <span className="truncate">{workspace.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
