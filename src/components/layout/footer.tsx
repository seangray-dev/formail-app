import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="container items-center border-t py-5">
      <div className="flex flex-col items-center justify-between gap-2 text-center text-xs text-muted-foreground md:flex-row md:text-left">
        <div>@{new Date().getFullYear()} Formail. All Rights Reserved.</div>
        <div className="flex flex-col gap-2 md:flex-row">
          <Link
            className="hover:text-white hover:underline"
            href={"/legal/privacy-policy"}
          >
            Privacy Policy
          </Link>
          <Link
            className="hover:text-white hover:underline"
            href={"/legal/terms-of-service"}
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
