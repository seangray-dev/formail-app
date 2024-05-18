import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { ReactNode } from "react";

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <Card className="flex flex-col-reverse">
      <CardHeader className="flex flex-1 flex-col gap-2 pt-0 text-center">
        <CardTitle className="text-lg 2xl:text-xl">{title}</CardTitle>
        <CardDescription className="mx-auto w-2/3">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-10">
        <div className="relative flex justify-center">
          <div className="relative overflow-hidden rounded-full border-4 border-muted-foreground/20 bg-muted p-4">
            <span className="absolute left-1/2 top-1/2 block h-full w-full -translate-x-1/2 -translate-y-1/2 rotate-45 transform bg-gradient-to-r from-transparent to-white opacity-30"></span>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
