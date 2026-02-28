# Tanay's personal blog

A personal blog and portfolio website built with Astro and Starlight, featuring technical articles, project showcases, and personal musings about software engineering, data science, and technology.

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/small.svg)](https://starlight.astro.build)
[![Astro](https://img.shields.io/badge/Astro-5.6.1-FF5D01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Amazon S3](https://img.shields.io/badge/Amazon%20S3-FF9900?style=for-the-badge&logo=amazons3&logoColor=white)](https://aws.amazon.com/s3/)
[![Markdown](https://img.shields.io/badge/markdown-%23000000.svg?style=for-the-badge&logo=markdown&logoColor=white)](https://www.markdownguide.org/)
[![GitHub License](https://img.shields.io/github/license/tanayseven/my-projects?style=for-the-badge&)](https://github.com/tanayseven/my-projects/blob/main/LICENSE)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/tanayseven/blog.tanay.tech/node.js.yml?branch=main&style=for-the-badge&label=CI)](https://github.com/tanayseven/blog.tanay.tech/actions)
[![Website](https://img.shields.io/website?style=for-the-badge&url=https%3A%2F%2Ftanay.tech&up_message=online&down_message=offline)](https://tanay.tech)

## Project Structure

```
.
├── public/                      # Static assets (images, favicons, etc.)
│   ├── favicon.ico
│   ├── favicon.png
│   ├── tanay-dp.png
│   └── post/                    # Blog post images and media
├── src/
│   ├── assets/                  # Optimized assets
│   ├── components/              # Astro components
│   │   └── CustomFooter.astro
│   ├── content/
│   │   ├── docs/
│   │   │   ├── index.mdx        # Homepage
│   │   │   ├── authors/         # Author profiles
│   │   │   ├── guides/          # Guide articles
│   │   │   ├── posts/           # Blog posts
│   │   │   └── reference/       # Reference documentation
│   │   └── content.config.ts    # Content collections config
│   └── plugins/
│       └── remark-callout.ts    # Custom remark plugin for callouts
├── astro.config.mjs             # Astro configuration
├── package.json                 # Project dependencies
└── tsconfig.json                # TypeScript configuration
```

## Technologies and Tools Used

- **[Astro](https://astro.build)** (v5.6.1) - Static site generator and web framework
- **[Starlight](https://starlight.astro.build)** (v0.37.0) - Documentation theme for Astro
- **[starlight-blog](https://github.com/HiDeoo/starlight-blog)** (v0.25.0) - Blog plugin for Starlight
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Expressive Code](https://expressive-code.com/)** (v0.41.3) - Syntax highlighting with line numbers
- **[Remark](https://remark.js.org/)** - Markdown processing
  - `remark-directive` - Custom directive support
  - `remark-gfm` - GitHub Flavored Markdown
- **[Sharp](https://sharp.pixelplumbing.com/)** (v0.34.2) - Image optimization

## Setup and Running Instructions

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- npm or your preferred package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd blog.tanay.tech
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the local development server:
```bash
npm run dev
```

The site will be available at `http://localhost:4321`

### Build

Build the production site:
```bash
npm run build
```

The built site will be output to `./dist/`

### Preview

Preview the production build locally:
```bash
npm run preview
```

### Other Commands

- `npm run astro ...` - Run Astro CLI commands (e.g., `npm run astro add`, `npm run astro check`)
- `npm run astro -- --help` - Get help with Astro CLI

## License

This project is the personal website of Tanay PrabhuDesai. All rights reserved unless otherwise specified.
