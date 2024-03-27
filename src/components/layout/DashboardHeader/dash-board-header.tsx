"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useOrgUserDetails } from "@/hooks/useOrgUserDetails";
import { formDetailsAtom } from "@/jotai/state";
import { OrganizationSwitcher, useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useAtom } from "jotai";
import { ClipboardCheckIcon, ClipboardIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../../../../convex/_generated/api";

export default function DashboardHeader() {
  const pathname = usePathname();
  const { orgId, orgName } = useOrgUserDetails();
  const [isCopied, setIsCopied] = useState(false);
  const [isFormPage, setIsFormPage] = useState(false);

  const [formDetails] = useAtom(formDetailsAtom);
  const isActive = (href: string) => pathname === href;
  const { formName, formId, formDescription } = formDetails;

  const userActive = useQuery(api.users.getMe);
  const isSubActive = useQuery(
    api.utils.checkUserSubscription,
    userActive ? { userId: userActive._id } : "skip",
  );

  useEffect(() => {
    // Check if the current pathname includes '/form/'
    const isForm = pathname.includes("/form/");
    setIsFormPage(isForm);
  }, [pathname]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("failed to copy", error);
    }
  };

  return (
    <>
      <div className="mb-4">
        {isSubActive && (
          <OrganizationSwitcher
            afterSelectOrganizationUrl="/dashboard"
            afterLeaveOrganizationUrl="/dashboard"
          />
        )}
      </div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hover:cursor-not-allowed">
            {orgName}
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {!formId && <BreadcrumbPage>Dashboard</BreadcrumbPage>}
            {isFormPage && (
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {isFormPage && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="hover:cursor-not-allowed">
                Forms
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{formName}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      {isFormPage && (
        <>
          <div className="mt-6 text-muted-foreground">
            <p>
              Organization: <span className="text-white">{orgName}</span>
            </p>
            <p>
              Form Name: <span className="text-white">{formName}</span>
            </p>
            <p>
              Description: <span className="text-white">{formDescription}</span>
            </p>
            <p className="flex items-center gap-2 whitespace-nowrap">
              Form ID:{" "}
              <span className="overflow-x-clip text-ellipsis text-white">
                {formId}
              </span>
              <Button
                title="Copy to clipboard"
                size={"icon"}
                variant={"ghost"}
                className="relative m-0 mb-1 h-fit w-fit p-0 hover:bg-transparent"
                onClick={() => {
                  if (formId) {
                    copyToClipboard(formId);
                  }
                }}
              >
                {isCopied ? (
                  <ClipboardCheckIcon size={20} />
                ) : (
                  <ClipboardIcon size={20} />
                )}
                {isCopied && (
                  <div className="absolute bottom-6 text-xs">Copied!</div>
                )}
              </Button>
            </p>
          </div>
          <nav className="mt-6 flex gap-4 overflow-x-scroll whitespace-nowrap border-b pb-2 text-muted-foreground">
            <Link
              href={`/dashboard/${orgId}/form/${formId}/submissions`}
              className={
                isActive(`/dashboard/${orgId}/form/${formId}/submissions`)
                  ? "text-white"
                  : "transition-all duration-150 hover:text-white"
              }
            >
              Submissions
            </Link>
            <Link
              href={`/dashboard/${orgId}/form/${formId}/files`}
              className={
                isActive(`/dashboard/${orgId}/form/${formId}/files`)
                  ? "text-white"
                  : "transition-all duration-150 hover:text-white"
              }
            >
              Files
            </Link>
            <Link
              href={`/dashboard/${orgId}/form/${formId}/analytics`}
              className={
                isActive(`/dashboard/${orgId}/form/${formId}/analytics`)
                  ? "text-white"
                  : "transition-all duration-150 hover:text-white"
              }
            >
              Analytics
            </Link>
            <Link
              href={`/dashboard/${orgId}/form/${formId}/export`}
              className={
                isActive(`/dashboard/${orgId}/form/${formId}/export`)
                  ? "text-white"
                  : "transition-all duration-150 hover:text-white"
              }
            >
              Export
            </Link>
            <Link
              href={`/dashboard/${orgId}/form/${formId}/settings`}
              className={
                isActive(`/dashboard/${orgId}/form/${formId}/settings`)
                  ? "text-white"
                  : "transition-all duration-150 hover:text-white"
              }
            >
              Settings
            </Link>
            <Link
              href={`/dashboard/${orgId}/form/${formId}/how-to`}
              className={
                isActive(`/dashboard/${orgId}/form/${formId}/how-to`)
                  ? "text-white"
                  : "transition-all duration-150 hover:text-white"
              }
            >
              How-to
            </Link>
          </nav>
        </>
      )}
    </>
  );
}
