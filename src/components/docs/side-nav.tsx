import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import DocsMenuLinks from "./docs-menu-links";

export default function SideNav() {
  return (
    <nav className="sticky top-0 hidden w-64 py-4 pr-4 md:block">
      <ScrollArea className="rounded-md text-sm">
        <DocsMenuLinks />
      </ScrollArea>
    </nav>
  );
}
