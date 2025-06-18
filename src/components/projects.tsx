"use client";

import { useFetchProjects } from "@/features/projects/api/use-fetch-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-projects-modal";
import { useWorkspacesId } from "@/features/workspaces/hooks/use-workspaces-id";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

export const Projects = () => {
  const pathname = usePathname();
  const workspaceId = useWorkspacesId();
  const projectId = "";
  const { open } = useCreateProjectModal();
  const { data } = useFetchProjects({ workspaceId });
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500 ">Projects</p>
        <RiAddCircleFill
          className="cursor-pointer size-5 text-neutral-500 hover:opacity-75 transition"
          onClick={open}
        />
      </div>
      {data?.documents.map((project) => {
        const href = `/workspaces/${workspaceId}/projects/${projectId}`;
        const isActive = pathname === href;
        return (
          <Link href={href} key={project.$id}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <ProjectAvatar name={project?.name} image={project?.imageUrl} />
              <span className="truncate">{project?.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
