"use client";

import Link from "next/link";
import React from "react";
import { legalLinks, navLinks } from "./nav-links";

export default function SiteFooter() {
  return (
    <footer className="container items-center border-t py-5">
      <div className="flex flex-col-reverse items-center justify-between gap-4 text-center text-xs text-muted-foreground md:flex-row md:text-left">
        <div>
          <div>@{new Date().getFullYear()} Formail. All Rights Reserved.</div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                className="text-muted-foreground hover:text-white hover:underline"
                href={link.href}
              >
                {link.title}
              </Link>
            ))}
            <Link
              className="hover:text-white hover:underline"
              target="_blank"
              href={"https://status.formail.dev"}
            >
              Status
            </Link>
          </div>
          <div className="flex justify-center gap-2 md:justify-end">
            {legalLinks.map((link, idx) => (
              <Link
                key={idx}
                className="hover:text-white hover:underline"
                href={link.href}
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
