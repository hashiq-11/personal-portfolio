# Next.js "Game OS" Portfolio

This is a high-end, highly optimized Next.js App Router portfolio incorporating **React Three Fiber (Three.js)** natively, **Tailwind CSS**, and **Framer Motion** to mimic a Video Game HUD or Architectural Configurator interface.

It fulfills the strict requirements of being simple to navigate, while looking technically advanced.

## Vercel Deployment Instructions

Since everything is pre-configured and uses zero static dependencies, this is 100% ready for an instantaneous Vercel deployment. No local Node.js compilation required.

1. Init a Git repository in this folder: 
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   ```
2. Create a GitHub repository and push your code:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
3. Go to [Vercel](https://vercel.com/new).
4. Import the GitHub repository.
5. Hit **Deploy**. Vercel will automatically detect the Next.js framework and compile it.

## Updating Projects

You do not need to dive into complex React code to update your projects! Just open `public/projects.json` and change the text strings, objectives, or tech tags. The `MissionLog.tsx` component will automatically iterate through your file and build new UI cards.

## Built-In Features
- **Configurator Mode:** Bottom right button swaps accent colors globally via `--accent-color` CSS properties and toggles the Wireframe mode of the 3D model through React Three Fiber.
- **Framer Motion HUD:** Staggered delays and HUD clip-paths for a real gaming UI feel.
