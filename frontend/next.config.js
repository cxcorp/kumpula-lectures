/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  i18n: {
    locales: ["en", "fi", "sv"],

    defaultLocale: "en",
  },

  async rewrites() {
    return [
      {
        source: "/api/events-by-organization",
        destination: "http://127.0.0.1:3001/api/events-by-organisation",
      },
    ];
  },
};

module.exports = nextConfig;
