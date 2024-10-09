const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL_SOURCE;

const nextConfig = {
  reactStrictMode: true, // From the second config
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: SUPABASE_URL,
        port: "",
        pathname: "/storage/v1/object/sign/**", // From the second config
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/**", // From the first config
      },
    ],
  },
};

export default nextConfig;
