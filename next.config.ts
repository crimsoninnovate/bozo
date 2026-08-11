import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: false },
  poweredByHeader: false,
  // Çoklu root layout kullanıldığı için gerekli; Task 14'te global-not-found.tsx ile eşleşir
  experimental: { globalNotFound: true },
}

export default nextConfig
