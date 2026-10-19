# VibeKode Studio

VibeKode Studio is an AI-powered application builder that helps users turn ideas into functional web applications using a conversational interface.

Describe what you want to build, generate an app idea with AI, use voice input, choose project visibility, and explore projects created by the VibeKode community.

## Live Website

[https://vibekode.studio](https://vibekode.studio)

## Features

- Generate web applications from natural-language prompts
- AI-powered idea generation with the **Magic** button
- Voice input using browser speech recognition
- Public and private project visibility
- Firebase authentication and project storage
- Usage limits and subscription-based credit management
- Real-time project creation and navigation
- Community project showcase
- Live previews for featured projects
- Copy project prompts directly from the community showcase
- Smooth scrolling and animated UI interactions
- Responsive design for desktop, tablet, and mobile
- SEO metadata, Open Graph tags, Twitter cards, and structured data

## Tech Stack

- [Next.js](https://nextjs.org/) 15
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [Google GenAI](https://ai.google.dev/)
- [OpenAI](https://platform.openai.com/)
- [Motion](https://motion.dev/)
- [Lucide React](https://lucide.dev/)
- [Radix UI](https://www.radix-ui.com/)
- [Sonner](https://sonner.emilkowal.ski/)
- [Lenis](https://lenis.darkroom.engineering/)
- [Playwright](https://playwright.dev/)

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js 20 or newer
- npm, pnpm, yarn, or Bun
- Firebase project credentials
- Required AI and payment service credentials

### Installation

Clone the repository:

```bash
git clone https://github.com/ShahbazCoder1/Vibekode-Studio-Beta.git
cd Vibekode-Studio-Beta
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root and add the environment variables required by your Firebase, AI, backend, and payment integrations.

Example:

```env
# Firebase configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# AI provider credentials
OPENAI_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=

# Firebase Admin credentials
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Payment provider credentials
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

Use the exact variable names expected by the files in `src/lib`, `src/backend`, and the API routes. Never commit secrets or private keys to the repository.

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You can also use:

```bash
yarn dev
pnpm dev
bun dev
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run build` | Creates a production build |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs the project linting configuration |

## Project Structure

```text
.
├── public/              # Static assets and community project images
├── src/
│   ├── app/             # Next.js routes, layouts, and pages
│   ├── backend/         # Backend and AI-related functionality
│   ├── components/      # Reusable UI components
│   └── lib/             # Firebase, utility, and shared application logic
├── next.config.ts       # Next.js configuration
├── postcss.config.mjs   # PostCSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## Main Application Flow

1. A user enters an application idea in the prompt box.
2. The user can optionally generate an idea using the AI-powered Magic button.
3. The user can provide additional input using voice recognition.
4. The user selects whether the project should be public or private.
5. VibeKode validates the user's usage limits and subscription permissions.
6. The project is created and the user is redirected to the project workspace.
7. Public projects can be displayed in the community showcase.

## Project Visibility and Plans

VibeKode supports public and private projects.

- **Free plan**
  - Public projects
  - Daily chat limit
  - Private projects are unavailable

- **Go plan**
  - Monthly credits
  - Up to five private projects

- **Pro plan**
  - Increased monthly credits
  - Unlimited private projects
  - Commercial project rights

Plan limits and pricing should be verified against the current application configuration before production deployment.

## Deployment

The application can be deployed to platforms that support Next.js, such as Vercel.

Create a production build locally:

```bash
npm run build
npm run start
```

When deploying, configure all required environment variables in the hosting provider's project settings.

For Vercel deployment:

1. Import the repository into Vercel.
2. Configure the required environment variables.
3. Select the appropriate Node.js version.
4. Deploy the project.
5. Verify Firebase authentication, AI generation, project creation, and payment functionality.

## Development Notes

- The main landing page is located at `src/app/page.tsx`.
- Global metadata and structured SEO data are configured in `src/app/layout.tsx`.
- The main prompt interface is implemented in `src/components/Prompt-Box.tsx`.
- Community projects are rendered by `src/components/Community-Project.tsx`.
- Firebase and shared application utilities are located in `src/lib`.
- AI and backend functionality is located in `src/backend`.
- Voice input requires a browser that supports the Web Speech API.
- Private project creation depends on the user's subscription and project limits.
- Payment and authentication functionality require correctly configured provider credentials.

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes.
4. Run the available checks:

   ```bash
   npm run lint
   npm run build
   ```

5. Commit your changes:

   ```bash
   git commit -m "Add your feature"
   ```

6. Push the branch and open a pull request.

## Security

Do not commit the following files or values:

- `.env.local`
- Firebase Admin private keys
- API keys
- Payment provider secrets
- Authentication credentials
- Production service tokens

If a secret is exposed, rotate it immediately through the relevant service provider.

## License

This project is private and proprietary unless a separate license is provided by the VibeKode team.

## Contact

For questions or support, visit [vibekode.studio](https://vibekode.studio).
