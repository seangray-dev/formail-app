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

type SnippetKeys = 'install' | 'usage' | 'directSubmission';
type CopiedStatus = Record<SnippetKeys, boolean>;

export default function HowToPage() {
  const [formDetails] = useAtom(formDetailsAtom);
  const { formId } = formDetails;
  const [copiedSnippets, setCopiedSnippets] = useState<CopiedStatus>({
    install: false,
    usage: false,
    directSubmission: false,
  });

  const snippets: Record<SnippetKeys, string> = {
    install: 'npm install formail-hooks',
    usage: `import React, { useState } from 'react';
import { formailSubmit } from 'formail-hooks';

function MyForm() {
  const [formData, setFormData] = useState({});
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formId = '${formId}';
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    try {
      await formailSubmit({ formId, formData: data });
      console.log('Form submitted successfully');
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };
  return <form onSubmit={handleSubmit}><button type="submit">Submit</button></form>;
}`,
    directSubmission: `const handleSubmit = async (event) => {
  event.preventDefault();
  const formId = '${formId}';
  const data = new FormData(event.target);

  try {
    const response = await fetch(\`https://www.formail.dev/submit/\${formId}\`, { method: 'POST', body: data });
    if (!response.ok) throw new Error('Form submission failed');
    console.log('Form submitted successfully');
  } catch (error) {
    console.error(error);
  }
};`,
  };

  const copyToClipboard = async (snippetKey: SnippetKeys) => {
    try {
      await navigator.clipboard.writeText(snippets[snippetKey]);
      setCopiedSnippets({ ...copiedSnippets, [snippetKey]: true });
      setTimeout(
        () => setCopiedSnippets({ ...copiedSnippets, [snippetKey]: false }),
        2000
      );
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
                    <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>
                      formail-hooks
                    </code>{' '}
                    library
                  </div>
                  <div className='bg-secondary p-2 relative'>
                    <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>
                      {snippets.install}
                    </code>
                    {!copiedSnippets.install ? (
                      <ClipboardIcon
                        onClick={() => copyToClipboard('install')}
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
                    {!copiedSnippets.usage ? (
                      <ClipboardIcon
                        onClick={() => copyToClipboard('usage')}
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
                      <code className='relative rounded bg-muted py-[0.2rem] font-mono text-sm font-semibold text-white'>
                        {snippets.usage}
                      </code>
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
              {!copiedSnippets.directSubmission ? (
                <ClipboardIcon
                  onClick={() => copyToClipboard('directSubmission')}
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
                <code className='relative rounded bg-muted py-[0.2rem] font-mono text-sm font-semibold text-white'>
                  {snippets.directSubmission}
                </code>
              </pre>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className='mt-6 mb-10 text-muted-foreground'>
        <div className='font-semibold text-white'>Note:</div>
        Make sure all form elements have a{' '}
        <code className='relative rounded bg-muted py-[0.2rem] font-mono text-sm font-semibold text-white'>
          name
        </code>{' '}
        attribute.
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
