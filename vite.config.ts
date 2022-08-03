import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Layouts from 'vite-plugin-vue-layouts';
import VueI18n from '@intlify/vite-plugin-vue-i18n';

import VueRouter from 'unplugin-vue-router/vite';
import { VueRouterExports } from 'unplugin-vue-router';
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		VueRouter({
			dts: true,
			routesFolder: 'src/pages',
		}),
		Components({
			dts: true,
			resolvers: [
				IconsResolver({
					prefix: 'icon',
				}),
			],
		}),
		Icons({
			compiler: 'vue3',
		}),
		AutoImport({
			dts: true,
			// targets to transform
			include: [
				/\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
				/\.vue\??/, // .vue
			],

			// global imports to register
			imports: [
				// presets
				'vue',
				{ '@vue-router': VueRouterExports },
				'vue-i18n',
				'@vueuse/core',
				'@vueuse/head',
				// custom
			],

			// custom resolvers
			// see https://github.com/antfu/unplugin-auto-import/pull/23/
			resolvers: [],
		}),
		Layouts(),
		VueI18n({
			runtimeOnly: true,
			compositionOnly: true,
			include: [resolve(__dirname, 'locales/**')],
		}),
	],
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
			'vue': 'vue/dist/vue.esm-bundler.js'
		},
	},
	server: {
		fs: {
			strict: true,
		},
	},
	optimizeDeps: {
		include: ['vue', 'vue-router', '@vueuse/core', '@vueuse/head'],
		exclude: ['@antv/x6-vue-shape'],
	},
	// https://github.com/vitest-dev/vitest
	test: {
		include: ['src/__test__/**/*.test.ts','src/__test__/**/*.spec.ts'],
		environment: 'jsdom',
		deps: {
			inline: ['@vue', '@vueuse', 'vue-demi'],
		},
	},
	ssr: {
		// TODO: workaround until they support native ESM
		noExternal: ['workbox-window', /vue-i18n/],
	},
});
