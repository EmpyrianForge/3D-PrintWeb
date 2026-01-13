import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Three.js und seine Addons in separaten Chunk
          'three-core': ['three'],
          'three-addons': [
            'three/addons/loaders/DRACOLoader.js',
            'three/addons/loaders/GLTFLoader.js'
          ],
          // GSAP Animation Library
          'gsap': ['gsap'],
          // Orbit Controls als separater Chunk
          'controls': ['./src/utils/OrbitControls.js']
        },
        chunkFileNames: (chunkInfo) => {
          // Benenne die Chunks für bessere Caching
          if (chunkInfo.name === 'three-core') return 'assets/three.[hash].js'
          if (chunkInfo.name === 'three-addons') return 'assets/three-addons.[hash].js'
          if (chunkInfo.name === 'gsap') return 'assets/gsap.[hash].js'
          if (chunkInfo.name === 'controls') return 'assets/controls.[hash].js'
          return 'assets/[name].[hash].js'
        }
      }
    },
    chunkSizeWarningLimit: 1000 // Erhöhe das Limit für bessere Analyse
  }
})