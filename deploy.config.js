// This file contains deployment configuration for the Personal Finance Course application

module.exports = {
  // Application details
  name: "Personal Finance Course",
  version: "1.0.0",
  description: "Interactive personal finance education with character-guided learning",
  
  // Build configuration
  build: {
    // Output directory for production build
    outDir: "dist",
    
    // Enable minification for production
    minify: true,
    
    // Generate source maps for debugging
    sourcemap: false,
    
    // Optimize assets for production
    optimizeAssets: true,
    
    // Bundle analysis for size optimization
    analyzeBundle: false,
  },
  
  // Deployment targets
  targets: {
    // Web deployment configuration
    web: {
      // Static site deployment
      static: {
        // Cloudflare Pages configuration
        cloudflare: {
          // Enable Cloudflare Pages deployment
          enabled: true,
          
          // Project name on Cloudflare Pages
          projectName: "finance-course",
          
          // Production branch
          productionBranch: "main",
          
          // Custom domain (if available)
          customDomain: "financecourse.example.com",
        },
        
        // Vercel configuration (alternative)
        vercel: {
          // Enable Vercel deployment
          enabled: false,
        },
      },
    },
    
    // Mobile deployment configuration
    mobile: {
      // Capacitor configuration for iOS/Android
      capacitor: {
        // Enable Capacitor integration
        enabled: true,
        
        // App ID for mobile deployment
        appId: "com.example.financecourse",
        
        // App name for mobile deployment
        appName: "Finance Course",
        
        // Supported platforms
        platforms: ["ios", "android"],
        
        // iOS specific configuration
        ios: {
          // Minimum iOS version
          minVersion: "13.0",
        },
        
        // Android specific configuration
        android: {
          // Minimum Android SDK version
          minSdkVersion: 21,
        },
      },
    },
  },
  
  // Performance optimization
  performance: {
    // Enable code splitting
    codeSplitting: true,
    
    // Enable tree shaking
    treeShaking: true,
    
    // Enable lazy loading for routes
    lazyLoading: true,
    
    // Cache strategy
    cache: {
      // Enable service worker for offline support
      serviceWorker: true,
      
      // Cache static assets
      staticAssets: true,
      
      // Cache API responses
      apiResponses: false,
    },
  },
  
  // Environment variables
  env: {
    // Production environment variables
    production: {
      // API endpoint (if needed in the future)
      API_URL: "https://api.example.com",
      
      // Analytics configuration
      ENABLE_ANALYTICS: true,
    },
    
    // Development environment variables
    development: {
      // API endpoint for development
      API_URL: "http://localhost:3000/api",
      
      // Disable analytics in development
      ENABLE_ANALYTICS: false,
    },
  },
};
