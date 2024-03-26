import SideNav from "@/components/docs/side-nav";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container flex flex-1">
      <div className="sticky top-0">
        <SideNav />
      </div>
      <section className="p-12">{children}</section>
    </div>
  );
}
