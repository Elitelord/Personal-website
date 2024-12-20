/** @type {import('next').NextConfig} */
const remarkAttr = require('remark-attr');

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
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/photo-1620641788421-7a1c342ea42e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
            },
        ],
    },
    experimental: { mdxRs: true },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.mdx?$/,
            use: [
                {
                    loader: '@mdx-js/loader',
                    options: {
                        remarkPlugins: [remarkAttr],
                    },
                },
            ],
        });
        return config;
    },
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
};

module.exports = nextConfig;
