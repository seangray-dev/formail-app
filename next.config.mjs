/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // route for form submissions
        source: '/submit/:formId',
        headers: [
          // Allow requests from any origin
          { key: 'Access-Control-Allow-Origin', value: '*' },
          // Specify the allowed HTTP methods
          { key: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
          // Specify the allowed headers
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
