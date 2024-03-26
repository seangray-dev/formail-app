"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useAction, useQuery } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Button } from "../../ui/button";
import FormSheet from "./forms-sheet";

export default function Header() {
  const pay = useAction(api.stripe.pay);
  const router = useRouter();
  const user = useQuery(api.users.getMe);
  const isSubbed = user && (user.endsOn ?? 0) > Date.now();

  const handleUpgradeClick = async () => {
    const url = await pay();
    router.push(url);
  };

  return (
    <nav className="container border-b py-3 text-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={"/"}>Formail</Link>
          <FormSheet />
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden gap-4 md:flex">
            <SignedIn>
              <Link
                className="text-muted-foreground hover:text-white hover:underline"
                href={"/dashboard"}
              >
                Dashboard
              </Link>
            </SignedIn>
            <Link
              className="text-muted-foreground hover:text-white hover:underline"
              href={"/pricing"}
            >
              Pricing
            </Link>
            <Link
              className="text-muted-foreground hover:text-white hover:underline"
              href={"/contact"}
            >
              Contact
            </Link>
            <Link
              className="text-muted-foreground hover:text-white hover:underline"
              href={"/docs"}
            >
              Docs
            </Link>
          </div>
          <SignedOut>
            <Link
              className="text-muted-foreground hover:text-white hover:underline"
              href={"/sign-in"}
            >
              Sign In
            </Link>
            <Button asChild variant={"secondary"}>
              <Link href={"/sign-up"}>Try It Free</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-3">
              {/* {!isSubbed && (
                <Button variant={'secondary'} onClick={handleUpgradeClick}>
                  Upgrade
                </Button>
              )} */}
              <UserButton />
            </div>
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
