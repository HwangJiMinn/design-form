import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'Design Form' },
    {
      property: 'og:title',
      content: 'Design Form',
    },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};
