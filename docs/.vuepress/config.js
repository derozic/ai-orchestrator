import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
  lang: 'en-US',
  title: 'AI Orchestrator Documentation',
  description: 'Intelligent AI model orchestration with DSPy and Ollama',
  
  base: '/docs/',
  
  theme: defaultTheme({
    logo: '/logo.svg',
    navbar: [
      {
        text: 'Home',
        link: '/',
      },
      {
        text: 'Guide',
        link: '/guide/',
      },
      {
        text: 'API Reference',
        link: '/api/',
      },
      {
        text: 'Workflows',
        link: '/workflows/',
      },
      {
        text: 'Prompts',
        link: '/prompts/',
      },
      {
        text: 'Insights',
        link: '/insights/',
      }
    ],
    
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          children: [
            '/guide/README.md',
            '/guide/installation.md',
            '/guide/configuration.md',
          ],
        },
        {
          text: 'Features',
          children: [
            '/guide/model-routing.md',
            '/guide/connectors.md',
            '/guide/workflows.md',
            '/guide/logging.md',
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          children: [
            '/api/README.md',
            '/api/endpoints.md',
            '/api/models.md',
            '/api/connectors.md',
            '/api/workflows.md',
          ],
        },
      ],
    },
    
    // GitHub repo info
    repo: 'scottderozic/ai-orchestrator',
    repoLabel: 'GitHub',
    
    // Page meta
    editLink: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: true,
    lastUpdatedText: 'Last Updated',
    contributors: true,
    contributorsText: 'Contributors',
    
    // 404 page
    notFound: [
      'This page could not be found.',
    ],
    backToHome: 'Back to home',
  }),
  
  bundler: viteBundler({
    viteOptions: {},
    vuePluginOptions: {},
  }),
})