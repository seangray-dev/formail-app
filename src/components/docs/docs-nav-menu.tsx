"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronsDownIcon } from "lucide-react";
import { useState } from "react";
import DocsMenuLinks from "./docs-menu-links";

export function DocsTopNav() {
  const [isOpen, setIsOpen] = useState(false);

  const closeSheet = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="sticky top-0 w-full md:hidden">
        <Button variant="outline" size={"lg"}>
          <ChevronsDownIcon size={18} />
        </Button>
      </SheetTrigger>
      <SheetContent side={"top"}>
        <DocsMenuLinks closeSheet={closeSheet} />
      </SheetContent>
    </Sheet>
  );
}
