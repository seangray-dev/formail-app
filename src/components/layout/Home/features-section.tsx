import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileJsonIcon, LayoutListIcon, SendIcon } from 'lucide-react';
import React, { ReactNode } from 'react';

type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <Card className='flex flex-col-reverse'>
    <CardHeader className='text-center flex flex-col gap-2 pt-0'>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className='flex-1 py-10'>
      <div className='flex justify-center relative'>
        <div className='border-4 p-4 rounded-full bg-muted border-muted-foreground/20 relative overflow-hidden'>
          <span className='block absolute w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent to-white opacity-30 rotate-45'></span>
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function FeaturesSection() {
  return (
    <section className='flex flex-col gap-12 border-t pt-12'>
      <div className='text-center flex flex-col gap-2'>
        <h2 className='text-2xl font-bold'>Why Choose Formail?</h2>
        <p className='text-muted-foreground 2xl:max-w-5xl md:max-w-3xl mx-auto'>
          Formail simplifies your form management needs with efficiency and
          ease. Enjoy seamless submissions, organized data, and enhanced
          productivity. Our tailored solutions fit your unique requirements,
          making form handling smooth and effective.
        </p>
      </div>
      <div className='grid md:grid-cols-3 gap-5 2xl:gap-8'>
        <FeatureCard
          icon={<SendIcon size={28} className='text-white relative' />}
          title='Email Notifications'
          description='Get real-time alerts with every form submission, keeping you promptly informed.'
        />

        <FeatureCard
          icon={<LayoutListIcon size={28} className='text-white relative' />}
          title='Form Flexibility'
          description='Submit anything. Our platform dynamically adapts, organizing and storing your data effortlessly.'
        />

        <FeatureCard
          icon={<FileJsonIcon size={28} className='text-white relative' />}
          title='Data Management'
          description='Easily manage and analyze submissions. Download data in JSON or CSV formats for convenient access.'
        />
      </div>
    </section>
  );
}
