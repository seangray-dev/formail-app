import dynamic from "next/dynamic";

export default function Page({ params }: { params: { slug: string } }) {
  // Dynamically import the documentation component based on the slug
  const Doc = dynamic(() => import(`@/docs/usage/${params.slug}`));

  return <Doc />;
}

// Runs at build time to generate the static paths for each doc
export function generateStaticParams() {
  return [
    { slug: "nextjs-app" },
    { slug: "nextjs-pages" },
    { slug: "javascript" },
  ];
}
