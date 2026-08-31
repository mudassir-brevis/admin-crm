/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@crm/types', '@crm/config', '@crm/validation'],
};

module.exports = nextConfig;
