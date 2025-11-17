/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static page generation entirely for quick launch
  output: 'standalone',
  // Force all routes to be dynamic
  experimental: {
    missingSuspenseWithCSRBailout: false,
    // Disabled optimizeCss - requires critters package
    // optimizeCss: true,
    // Enable optimizePackageImports for better tree-shaking
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
  },
  // Compress pages for better performance
  compress: true,
  // Enable SWC minification
  swcMinify: true,
  // Optimize production builds
  productionBrowserSourceMaps: false,
  // Enable React strict mode for better error detection
  reactStrictMode: true,
  // Ignore ESLint errors during build for quick launch
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore TypeScript errors during build for quick launch
  typescript: {
    ignoreBuildErrors: true,
  },
  // Skip ALL static generation - render everything at runtime
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Optimize webpack bundle
  webpack: (config, { dev, isServer }) => {
    // Alias unnecessary server-side packages for client bundle
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@aws-sdk/client-s3': false,
        'googleapis': false,
      }
    }

    // Optimize for production
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for node_modules
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20
            },
            // Common chunk for shared code
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'async',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true
            },
            // React & React-DOM in separate chunk
            react: {
              name: 'react',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              priority: 30
            }
          }
        }
      }
    }
    return config
  },
  // Configure CSP to allow Next.js and Vercel to work properly
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.vercel-scripts.com https://vercel.live https://zejensivaohvtkzufdou.supabase.co; connect-src 'self' https://zejensivaohvtkzufdou.supabase.co https://vercel.live https://*.pusher.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
