"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SignedIn, SignedOut, useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { ChevronRightIcon, MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import CreateFormDialog from "./create-new-form-dialog";

export default function FormSheet() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined = undefined;
  let orgName: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  if (organization.isLoaded && user.isLoaded) {
    orgName = organization.organization?.name ?? "Personal account";
  }
  const forms = useQuery(api.forms.getForms, orgId ? { orgId } : "skip");

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger>
        <MenuIcon size={18} />
      </SheetTrigger>
      <SheetContent
        side={"left"}
        className="flex max-h-screen flex-col justify-between"
      >
        <SheetHeader>
          <SheetTitle>
            <Link
              href={"/"}
              className="max-w-28"
              onClick={() => {
                setIsSheetOpen(false);
              }}
            >
              <Image
                src={"/logo.png"}
                width={2000}
                height={303}
                alt="logo"
                className="max-w-28 pb-10"
              />
            </Link>
            <SignedIn>
              <div className="mb-10">{orgName}</div>
            </SignedIn>
          </SheetTitle>
        </SheetHeader>
        <SignedOut>
          <div className="flex flex-col items-center justify-center gap-4">
            <Image
              src={"./no_forms.svg"}
              alt="must be signed in"
              height={150}
              width={150}
            />
            <p>Sign in to view your forms</p>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="flex-1">
            <div className="mb-4 flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-xl font-bold">Forms</p>
              <CreateFormDialog />
            </div>

            <ul className="flex w-full flex-col">
              {forms?.map((form) => {
                return (
                  <li
                    key={form._id}
                    className="group flex w-full items-center justify-between transition-all duration-150 hover:bg-secondary"
                  >
                    <Button
                      onClick={() => {
                        setIsSheetOpen(false);
                      }}
                      asChild
                      variant={"link"}
                      className="w-full justify-start"
                    >
                      <Link
                        className="w-full"
                        href={`/dashboard/${orgId}/form/${form._id}/submissions`}
                      >
                        {form.name}
                      </Link>
                    </Button>
                    <ChevronRightIcon
                      size={20}
                      className="mr-4 hidden group-hover:block"
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </SignedIn>
        <SheetFooter className="w-full self-start border-t pt-6">
          <div className="flex w-full flex-col gap-4 self-start text-sm">
            <SignedIn>
              <Link
                onClick={() => {
                  setIsSheetOpen(false);
                }}
                className="text-muted-foreground hover:text-white hover:underline"
                href={"/dashboard"}
              >
                Dashboard
              </Link>
            </SignedIn>
            <Link
              onClick={() => {
                setIsSheetOpen(false);
              }}
              className="text-muted-foreground hover:text-white hover:underline"
              href={"/pricing"}
            >
              Pricing
            </Link>
            <Link
              onClick={() => {
                setIsSheetOpen(false);
              }}
              className="text-muted-foreground hover:text-white hover:underline"
              href={"/contact"}
            >
              Contact
            </Link>
            <Link
              onClick={() => {
                setIsSheetOpen(false);
              }}
              className="text-muted-foreground hover:text-white hover:underline"
              href="https://docs.formail.dev"
              target="_blank"
            >
              Docs
            </Link>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
