import { pageTree } from "@/app/source";
import { DocsLayout } from "fumadocs-ui/layout";
import { BookIcon } from "lucide-react";
import type { ReactNode } from "react";

export default function RootDocsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={pageTree}
      nav={{
        title: "Docs",
        githubUrl: "https://github.com/seangray-dev/formail-app",
      }}
      links={[
        {
          icon: "",
          text: "Roadmap",
          url: "https://github.com/users/seangray-dev/projects/5",
        },
      ]}
    >
      {children}
    </DocsLayout>
  );
}
