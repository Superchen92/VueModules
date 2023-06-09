import { defineConfig } from 'vite';
import { resolve } from 'path';
import viteCompression from 'vite-plugin-compression';
import removeConsole from 'vite-plugin-remove-console';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      packages: resolve(__dirname, './packages'),
    },
  },
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, '../packages/index.js'),
      name: 'charts',
      fileName: (format) => `charts.${format}.js`,
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [vue({ include: [/\.vue$/, /\.md$/] }), viteCompression, removeConsole()],
});
