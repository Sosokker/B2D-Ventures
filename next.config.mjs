/** @type {import('next').NextConfig} */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL_SOURCE;

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: SUPABASE_URL,
        port: "",
        pathname: "/storage/v1/object/sign/**",
      },
    ],
  },
};

export default nextConfig;
