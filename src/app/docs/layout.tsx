import { DocsTopNav } from "@/components/docs/docs-nav-menu";
import SideNav from "@/components/docs/side-nav";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DocsTopNav />
      <div className="container flex flex-1 flex-col md:flex-row">
        <div className="sticky top-0">
          <SideNav />
        </div>
        <section className="p-12">{children}</section>
      </div>
    </>
  );
}
