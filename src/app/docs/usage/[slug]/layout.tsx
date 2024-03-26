import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="prose prose-invert">
      <h1>Usage</h1>
      {children}
    </section>
  );
}
