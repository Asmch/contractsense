import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'ngrok-skip-browser-warning',
            value: 'true',
          },
          {
            key: 'Bypass-Tunnel-Reminder',
            value: 'true',
          }
        ],
      },
    ];
  },
};

export default nextConfig;
