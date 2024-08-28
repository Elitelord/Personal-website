/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    reactRemoveProperties: true, // <-- Add this line
  },
  experimental: {
    // ...
    swcPlugins: [
      [
        'next/swc-plugin-experimental-jsx-runtime-options',
        {
          react: {
            runtime: 'automatic',
            throwIfNamespace: false, // <-- Add this line
          }
        }
      ]
    ]
  }
}

module.exports = nextConfig
