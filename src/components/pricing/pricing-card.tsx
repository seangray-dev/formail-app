import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

type Feature = {
  text: string;
  included: boolean;
};

type PricingCardProps = {
  title: string;
  description: string;
  price: string;
  features: Feature[];
  buttonText: string;
  buttonLink?: string;
  buttonVariant: 'default' | 'secondary';
  onClick?: () => void;
};

export default function PricingCard({
  title,
  description,
  price,
  features,
  buttonText,
  buttonLink,
  buttonVariant,
  onClick,
}: PricingCardProps) {
  return (
    <Card className='w-72 mx-auto shadow-[0_2px_20px_0_rgba(250,_250,_249,_0.1)]'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className='mb-4 text-2xl font-bold'>{price}</p>
        <ul aria-label={`Features included in the ${title}`}>
          {features.map((feature, index) => (
            <li key={index} className='flex items-center text-sm'>
              {feature.included ? (
                <CheckIcon
                  size={18}
                  className='text-muted-foreground mr-2'
                  aria-hidden='true'
                />
              ) : (
                <XIcon
                  size={18}
                  className='text-muted-foreground mr-2'
                  aria-hidden='true'
                />
              )}
              {feature.text}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        {buttonLink && !onClick ? (
          <Button asChild variant={buttonVariant}>
            <Link href={buttonLink}>{buttonText}</Link>
          </Button>
        ) : (
          <Button variant={buttonVariant} onClick={onClick}>
            {buttonText}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
