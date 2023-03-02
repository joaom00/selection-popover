import { defineConfig } from 'tsup'

export default defineConfig({
  minify: true,
  target: 'es2018',
  external: ['react', 'react-dom'],
  sourcemap: false,
  dts: true,
  format: ['esm', 'cjs'],
  loader: {
    '.js': 'jsx',
  },
})
