# Travel Genie

Travel Genie is a web application built with [Next.js](https://nextjs.org), designed to help users discover and explore travel destinations. The project leverages modern React features, server-side rendering, and API routes for a seamless and performant user experience.

## Features

- 🌍 Discover new places and travel destinations
- ⚡ Fast, optimized performance with Next.js 15
- 🔄 Hot reloading for rapid development
- 🎨 Styled with Tailwind CSS
- 📦 Data fetching with [@tanstack/react-query](https://tanstack.com/query/latest)
- 🔗 API integration using [axios](https://axios-http.com/)
- 📝 Markdown rendering with [marked](https://marked.js.org/)

## Getting Started

To run the project locally:

```bash
npm install
npm run dev
# or
yarn install && yarn dev
# or
pnpm install && pnpm dev
# or
bun install && bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure

src/app/ - Main application pages and components
public/ - Static assets (SVGs, images)
types/ - TypeScript type definitions
.next/ - Build output (auto-generated)
.qodo/ - Project-specific configuration (if any)

## Scripts

dev - Start the development server
build - Build the application for production
start - Start the production server
lint - Run ESLint

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
