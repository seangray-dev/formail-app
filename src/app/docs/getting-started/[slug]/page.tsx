import dynamic from "next/dynamic";

export default function Page({ params }: { params: { slug: string } }) {
  // Dynamically import the documentation component based on the slug
  const Doc = dynamic(() => import(`@/docs/getting-started/${params.slug}`));

  return <Doc />;
}

// Runs at build time to generate the static paths for each doc
export function generateStaticParams() {
  return [
    { slug: "installation" },
    { slug: "spam-protection" },
    { slug: "file-uploads" },
  ];
}
