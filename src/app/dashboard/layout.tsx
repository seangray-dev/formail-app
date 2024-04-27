"use client";

import DashboardHeader from "@/components/layout/dashboard-header/dash-board-header";
import useAuthStatus from "@/hooks/useAuthStatus";
import { useOrgUserDetails } from "@/hooks/useOrgUserDetails";
import { formDetailsAtom } from "@/jotai/state";
import { useQuery } from "convex/react";
import { useAtom } from "jotai";
import { Loader2Icon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthLoading, isUserAuthenticated } = useAuthStatus();
  const [, setFormDetails] = useAtom(formDetailsAtom);
  const { orgId } = useOrgUserDetails();
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const isFormPage = pathSegments[2] === "form";
  const formId = isFormPage ? pathSegments[3] : null;
  const formQueryArg =
    isUserAuthenticated && formId ? { formId: formId as Id<"forms"> } : "skip";
  const form = useQuery(api.forms.getFormById, formQueryArg);
  const orgUsers = useQuery(
    api.users.getUsersByOrgIdWithRoles,
    orgId ? { orgId } : "skip",
  );

  useEffect(() => {
    if (formId && form) {
      setFormDetails({
        orgUsers,
        formId,
        formName: form?.name ?? "Unknown",
        formDescription: form.description,
        pathname,
      });
    }
  }, [formId, form, orgUsers, setFormDetails, pathname]);

  if (isAuthLoading || !isUserAuthenticated) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-10">
        <Loader2Icon className="h-10 w-10 animate-spin" />
        <div className="text-xl">Loading forms...</div>
      </div>
    );
  }

  return (
    <section className="flex flex-1 flex-col pb-10">
      <div className="container my-6">
        <DashboardHeader />
      </div>
      {children}
    </section>
  );
}
