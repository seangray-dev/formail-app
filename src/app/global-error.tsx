"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import * as Sentry from "@sentry/nextjs";
import { ConvexError } from "convex/values";
import { AlertCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (error instanceof ConvexError) {
    error.message = error.data;
  }

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 antialiased">
        <div className="flex max-w-xl flex-col items-center gap-6">
          <h2 className="text-center text-2xl font-semibold">
            Oops, something went wrong!
          </h2>
          <Image
            alt="access-denied"
            width={200}
            height={200}
            src="/access_denied.svg"
          />
          <div className="text-center">
            <p>
              If you believe this is a bug or need further assistance,{" "}
              <Link
                href="/contact"
                target="_blank"
                className="font-medium underline"
              >
                contact support
              </Link>
            </p>
            <p>
              or try visiting the{" "}
              <a
                rel="noopener noreferrer"
                className="underline"
                target="_blank"
                href="https://docs.formail.dev"
              >
                docs
              </a>
            </p>
          </div>
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error?.message ? error.message : "Unexpected error"}
            </AlertDescription>
          </Alert>
          <Button className="w-full" onClick={reset}>
            Try again
          </Button>

          <Link className="font-medium underline" href="/">
            Visit Home Page
          </Link>
        </div>
      </body>
    </html>
  );
}
