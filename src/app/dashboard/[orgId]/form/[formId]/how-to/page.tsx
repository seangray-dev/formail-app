'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formDetailsAtom } from '@/jotai/state';
import { useAtom } from 'jotai';
import {
  CircleHelpIcon,
  ClipboardCheckIcon,
  ClipboardIcon,
} from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

export default function HowToPage() {
  const [formDetails] = useAtom(formDetailsAtom);
  const { formId } = formDetails;
  const [copySuccess, setCopySuccess] = useState('');

  const installFormailSnippet = 'npm install formail-hooks';

  const formailHookUsageSnippet = `import React, { useState } from 'react';
import { formailSubmit } from 'formail-hooks';

function MyForm() {
  const [formData, setFormData] = useState({});
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formId = '${formId}'; // Your Formail form ID
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await formailSubmit({ formId, formData: data });
      console.log('Form submitted successfully:', response);
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields go here */}
      <button type="submit">Submit</button>
    </form>
  );
}`;

  const directSubmissionSnippet = `const handleSubmit = async (event) => {
  event.preventDefault();
  const formId = '${formId}'; // Your Formail form ID
  const data = new FormData(event.target);

  try {
    const response = await fetch(\`https://www.formail.dev/submit/\${formId}\`, {
      method: 'POST',
      body: data,
    });

    if (!response.ok) throw new Error('Form submission failed');
    console.log('Form submitted successfully');
  } catch (error) {
    console.error(error);
  }
};`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  return (
    <div className='container'>
      <Accordion type='single' collapsible className='w-full'>
        <AccordionItem value='item-1'>
          <AccordionTrigger>Using formail-hooks</AccordionTrigger>
          <AccordionContent>
            <div>
              <ul className='flex flex-col gap-4'>
                <li className='flex flex-col gap-2'>
                  <div className='font-semibold'>
                    1. Install our{' '}
                    <code className='bg-muted font-normal text-muted-foreground px-1'>
                      formail-hooks
                    </code>{' '}
                    library
                  </div>
                  <div className='bg-secondary p-2 relative'>
                    <code className='text-muted-foreground'>
                      {installFormailSnippet}
                    </code>
                    {!copySuccess ? (
                      <ClipboardIcon
                        onClick={() => copyToClipboard(installFormailSnippet)}
                        className='absolute text-muted-foreground top-2 right-3 hover:cursor-pointer hover:text-white transition-all duration-150'
                        size={18}
                      />
                    ) : (
                      <ClipboardCheckIcon
                        className='absolute top-2 right-3 hover:cursor-pointer hover:text-white transition-all duration-150'
                        size={18}
                      />
                    )}
                  </div>
                </li>
                <li className='flex flex-col gap-2'>
                  <div className='font-semibold'>2. Usage</div>
                  <div className='bg-muted text-muted-foreground p-2 relative'>
                    {!copySuccess ? (
                      <ClipboardIcon
                        onClick={() => copyToClipboard(formailHookUsageSnippet)}
                        className='absolute top-3 right-3 hover:cursor-pointer hover:text-white transition-all duration-150'
                        size={18}
                      />
                    ) : (
                      <ClipboardCheckIcon
                        className='absolute top-3 right-3 hover:cursor-pointer hover:text-white transition-all duration-150'
                        size={18}
                      />
                    )}
                    <pre>
                      <code>{formailHookUsageSnippet}</code>
                    </pre>
                  </div>
                </li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-2'>
          <AccordionTrigger>Without using formail-hooks</AccordionTrigger>
          <AccordionContent>
            <div className='bg-muted text-muted-foreground p-2 relative'>
              {!copySuccess ? (
                <ClipboardIcon
                  onClick={() => copyToClipboard(directSubmissionSnippet)}
                  className='absolute top-3 right-3 hover:cursor-pointer hover:text-white transition-all duration-150'
                  size={18}
                />
              ) : (
                <ClipboardCheckIcon
                  className='absolute top-3 right-3 hover:cursor-pointer hover:text-white transition-all duration-150'
                  size={18}
                />
              )}
              <pre>
                <code>{directSubmissionSnippet}</code>
              </pre>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className='mt-6 mb-10 text-muted-foreground'>
        <div className='font-semibold text-white'>Note:</div>
        Make sure all form elements have a{' '}
        <code className='bg-muted p-1 text-white'>name</code> attribute.
      </div>
      <Alert className='bg-secondary'>
        <CircleHelpIcon size={18} />
        <AlertTitle>Need help?</AlertTitle>
        <AlertDescription className='text-muted-foreground'>
          Check out the{' '}
          <Link
            target='_blank'
            href={'/documenation'}
            className='hover:text-white underline'>
            docs
          </Link>{' '}
          for more information.
        </AlertDescription>
      </Alert>
    </div>
  );
}
