import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import Link from "next/link";
import React from "react";

export default function SideNav() {
  return (
    <nav className="sticky top-0 hidden w-64 border-r py-4 pr-4 md:block">
      <ScrollArea className="rounded-md text-sm">
        <div className="flex flex-col gap-2">
          <p className="mb-2 pl-2 text-lg font-bold">Formail Docs</p>
          <Link
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-primary"
            href={"/docs"}
          >
            Introduction
          </Link>
          <Accordion type="single" collapsible>
            <AccordionItem className="w-full border-none" value="item-1">
              <AccordionTrigger className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-primary hover:no-underline">
                Getting Started
              </AccordionTrigger>
              <AccordionContent className="flex flex-col p-0 indent-2">
                <Link
                  className="rounded-md border-l p-2 text-muted-foreground hover:border-l-white hover:bg-muted hover:text-primary"
                  href={"/docs/getting-started/installation"}
                >
                  Installation
                </Link>
                <Link
                  className="rounded-md border-l p-2 text-muted-foreground hover:border-l-white hover:bg-muted hover:text-primary"
                  href={"/docs/getting-started/spam-protection"}
                >
                  Spam protection
                </Link>
                <Link
                  className="rounded-md border-l p-2 text-muted-foreground hover:border-l-white hover:bg-muted hover:text-primary"
                  href={"/docs/getting-started/file-uploads"}
                >
                  File Uploads
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
    </nav>
  );
}
