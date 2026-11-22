// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://reqsery.github.io',
	integrations: [
		starlight({
			title: 'reqsery docs',
			description: 'Documentation for MC Mod Porter and Voice Parties — Minecraft modding tools by reqsery.',
			customCss: ['./src/styles/custom.css'],
			// Pagefind search is built in and enabled by default.
			pagefind: true,
			lastUpdated: false,
			// Use src/content/docs/404.md instead of the built-in 404 route.
			disable404Route: true,
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/reqsery' },
				{ icon: 'laptop', label: 'Portfolio', href: 'https://reqsery.vercel.app/' },
				{ icon: 'x.com', label: 'Twitter / X', href: 'https://twitter.com/reqsery' },
			],
			sidebar: [
				{
					label: 'MC Mod Porter',
					items: [
						{ label: 'Overview & Golden Rule', slug: 'mc-mod-porter' },
						{ label: 'Quickstart (GUI & CLI)', slug: 'mc-mod-porter/quickstart' },
						{ label: 'CLI & GUI Reference', slug: 'mc-mod-porter/cli-and-gui-reference' },
						{ label: 'Architecture & Pipeline', slug: 'mc-mod-porter/architecture-and-pipeline' },
						{ label: 'Supported Versions & JDK', slug: 'mc-mod-porter/supported-versions' },
						{ label: 'Migration Rules', slug: 'mc-mod-porter/migration-rules' },
						{ label: 'Knowledge Base', slug: 'mc-mod-porter/knowledge-base' },
						{ label: 'Troubleshooting', slug: 'mc-mod-porter/troubleshooting' },
						{ label: 'FAQ', slug: 'mc-mod-porter/faq' },
					],
				},
				{
					label: 'Voice Parties',
					badge: { text: 'WIP', variant: 'caution' },
					items: [
						{ label: 'Overview', slug: 'voice-parties' },
						{ label: 'Installation', slug: 'voice-parties/installation' },
						{ label: 'Commands & Keybinds', slug: 'voice-parties/commands-keybinds' },
						{ label: 'Configuration', slug: 'voice-parties/configuration' },
						{ label: 'Privacy', slug: 'voice-parties/privacy' },
						{ label: 'FAQ & Known Limits', slug: 'voice-parties/faq' },
					],
				},
				{
					label: 'Community',
					items: [
						// Grown by DevHub Bot: staff-approved answers from the Discord (/kb scan, /kb add).
						{ label: 'Community FAQ & Known Issues', slug: 'learned-faq' },
					],
				},
			],
		}),
	],
});
