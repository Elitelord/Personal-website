/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'community.wolfram.com',
        port: '',
        pathname: '//c/portal/getImageAttachment?filename=communityimage.png&userId=2963607',
      },
    ],
  },
}

module.exports = nextConfig
