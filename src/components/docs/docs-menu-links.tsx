"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface DocsMenuLinksProps {
  closeSheet?: () => void;
}

const links = [
  { title: "Introduction", href: "/docs" },
  {
    title: "Getting Started",
    href: "/docs/getting-started",
    children: [
      { title: "Installation", href: "/docs/getting-started/installation" },
      {
        title: "Spam protection",
        href: "/docs/getting-started/spam-protection",
      },
      { title: "File Uploads", href: "/docs/getting-started/file-uploads" },
    ],
  },
  {
    title: "Usage",
    href: "/docs/usage",
    children: [
      { title: "Next.js (app/)", href: "/docs/usage/nextjs-app" },
      { title: "Next.js (pages/)", href: "/docs/usage/nextjs-pages" },
      { title: "JavaScript", href: "/docs/usage/javascript" },
    ],
  },
];

export default function DocsMenuLinks({ closeSheet }: DocsMenuLinksProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2">
      <p className="mb-2 pl-2 text-lg font-bold">Formail Docs</p>
      {links.map((link, index) =>
        link.children ? (
          <Accordion key={index} type="single" collapsible>
            <AccordionItem value="item-1" className="w-full border-none">
              <AccordionTrigger className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-primary hover:no-underline">
                {link.title}
              </AccordionTrigger>
              <AccordionContent className="flex flex-col p-0 indent-2">
                {link.children.map((child) => (
                  <Link
                    onClick={closeSheet}
                    key={child.href}
                    href={child.href}
                    className={`rounded-md border-l p-2 text-muted-foreground hover:border-l-white hover:bg-muted hover:text-primary ${
                      pathname === child.href ? "bg-muted text-white" : ""
                    }`}
                  >
                    {child.title}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <Link
            onClick={closeSheet}
            key={link.href}
            href={link.href}
            className={`rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-primary ${
              pathname === link.href ? "bg-muted text-white" : ""
            }`}
          >
            {link.title}
          </Link>
        ),
      )}
    </div>
  );
}
