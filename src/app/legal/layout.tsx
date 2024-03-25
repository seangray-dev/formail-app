import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto flex flex-1 flex-col items-center py-10">
      {children}
    </div>
  );
}
