import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import dts from "vite-plugin-dts";
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"), // 路径别名
    },
    extensions: [".js", ".json", ".ts", "tsx"], // 使用路径别名时想要省略的后缀名，可以自己 增减
  },
  plugins: [
    vueJsx(),
    vue(),
    AutoImport({
      imports: ["vue", "vue-router"],
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    dts({ insertTypesEntry: true }),
  ],
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/index.ts"),
      name: "editor",
      // the proper extensions will be added
      fileName: "editor",
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [
        "lodash",
        "vue",
        "element-plus",
        "@icon-park/vue-next",
        "pinia",
        "vue-router",
        "@lljj/vue3-form-element",
      ],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          // vue: "Vue",
          // lodash: "Lodash",
        },
      },
    },
  },
});
