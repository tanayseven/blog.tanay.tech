// @ts-check
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import starlightBlog from 'starlight-blog'
import remarkDirective from "remark-directive";
import remarkCallout from "./src/plugins/remark-callout.ts";


export default defineConfig({
	site: 'https://blog.tanay.tech',
	markdown: {
		remarkPlugins: [remarkDirective, remarkCallout],
	},
	integrations: [
		starlight({
			title: "Tanay Rambles",
			favicon: '/favicon.ico',
			plugins: [starlightBlog({
				metrics: {
					readingTime: true,
					words: 'total',
				},
				prefix: "posts",
				authors: {
					tanay: {
						name: 'Tanay PrabhuDesai',
						title: '[Software|Data] Engineer 👨‍💻 and loves Science 🧪, Space and universe 🪐, Philosophy 🧘‍♂️',
						url: "https://blog.tanay.tech/authors/tanay/index.html",
						picture: "https://blog.tanay.tech/tanay-dp.png",
					},
				}
			})],
			components: {
				Footer: './src/components/CustomFooter.astro',
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/tanayseven' },
				{ icon: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@tanaystechcast' },
				{ icon: 'twitter', label: 'Twitter', href: 'https://twitter.com/tanayseven' },
				{ icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/tanay-prabhudesai/' },
			],

			sidebar: [ // TODO Currently does not work, gets overriden, need to get this working
				{
					label: 'Guides',
					items: [
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
