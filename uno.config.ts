import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    // 颜色
    ['text-color', 'text-dark dark:text-white'],
    ['bg-color', 'bg-white dark:bg-dark'],
    // 布局
    ['flex-row-c-c', 'flex flex-justify-center flex-items-center'],
    ['flex-row-bt-c', 'flex flex-justify-between flex-items-center']
  ],
  theme: {
    // ...
    theme: {
      'theme': {
        'color':'var(--el-color-primary)',
        'color2':'var($theme-tip-color)',
        'color3':'var($theme-tip-color2)',
      }, // class="text-very-cool"
      'tip': {
        'main': 'var(--el-color-primary)', //class="--el-color-primary"
        'green': 'hsla(var(--hue, 217), 78%, 51%)', //class="bg-brand-primary"
      }
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetTypography(),
    presetWebFonts({
      // fonts: {
      //   sans: 'DM Sans',
      //   serif: 'DM Serif Display',
      //   mono: 'DM Mono',
      // },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
