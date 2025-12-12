# Grass Founders Circle Dashboard

A secure, high-performance dashboard for Grass Founders, built with React, Tailwind CSS, and Framer Motion.

## Features

-   **Secure Authentication**: Mocked for demo, ready for Vercel Serverless integration.
-   **Real-time Metrics**: Simulated live data feeds for Price, Volume, and Market Cap.
-   **Smooth Animations**: Powered by Framer Motion for a premium feel.
-   **Responsive Design**: Fully responsive layout that works on all devices.
-   **Glassmorphism UI**: Modern aesthetic with glass panels and glowing effects.

## Deployment to Vercel

1.  **Push to GitHub**:
    -   Initialize a git repository: `git init`
    -   Add files: `git add .`
    -   Commit: `git commit -m "Initial commit"`
    -   Create a repo on GitHub and push:
        ```bash
        git remote add origin https://github.com/YOUR_USERNAME/grass-dashboard.git
        git branch -M main
        git push -u origin main
        ```

2.  **Import to Vercel**:
    -   Go to [Vercel](https://vercel.com) and click "Add New Project".
    -   Import your GitHub repository.
    -   Framework Preset: **Vite** (should be auto-detected).
    -   **Environment Variables**:
        -   Add `ADMIN_USERNAME` and `ADMIN_PASSWORD` in the Vercel dashboard settings to secure the API route.

3.  **API Function**:
    -   The `api/login.js` file will be automatically deployed as a Serverless Function.
    -   To use the real API instead of the mock frontend auth, update `client/src/pages/login.tsx` to fetch `/api/login` instead of the simulated delay.

## Project Structure

-   `client/`: Frontend React application.
-   `api/`: Vercel Serverless Functions.
-   `shared/`: Shared types and schemas.

## Development

To run locally:

```bash
npm install
npm run dev
```
