# SET Game Trainer

A web application to train your SET game skills with two interactive modes and three difficulty levels.

## About SET

SET is a card game where each card has four properties:
- **Color**: Red, Green, or Purple
- **Shape**: Diamond, Oval, or Squiggle
- **Fill**: Solid, Striped, or Empty
- **Count**: 1, 2, or 3

A valid SET consists of three cards where each property is either **all the same** or **all different** across the three cards.

## Game Modes

### Find the Completing Card
You are given two cards and must select which of the three options will complete the SET.

**How to Play:**
1. Click "Start Round" to begin
2. Two cards will be displayed along with three options
3. Select the correct completing card before time runs out
4. Your score and statistics are tracked automatically

### Validate the SET
You are shown three cards and must determine whether they form a valid SET or not.

**How to Play:**
1. Click "Start Round" to begin
2. Three cards will be displayed
3. Click "Yes, it's a SET" or "No, it's not a SET" before time runs out
4. Your score and statistics are tracked automatically

## Difficulty Levels

Choose from three difficulty levels, each with different time limits:

- **Easy**: 15 seconds per puzzle
- **Medium**: 10 seconds per puzzle (default)
- **Hard**: 5 seconds per puzzle

**⏱️ Time Penalty**: If you fail to answer within the time limit, **1 point will be deducted** from your score!

The timer displays with color coding:
- 🟢 Green: More than 50% time remaining
- 🟡 Yellow: Between 25% and 50% time remaining
- 🔴 Red: Less than 25% time remaining

## Statistics Tracking

The game automatically tracks your performance and provides detailed statistics:

**Overall Stats:**
- Total rounds played
- Correct answers
- Wrong answers
- Timeouts
- Overall accuracy percentage
- Average response time

**By Game Mode:**
- Performance breakdown for each game mode
- Mode-specific accuracy and timing

**By Difficulty:**
- Performance on each difficulty level
- Difficulty-specific statistics

**View Statistics:**
Click the "📊 Statistics" button in the header to view your complete performance data. You can also clear all statistics if you want to start fresh.

## Local Development

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation and Running

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## Deploying to Cloudflare Pages

### Method 1: Using Cloudflare Dashboard (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)

3. Go to **Pages** and click **Create a project**

4. Connect your Git repository

5. Configure the build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version**: 16 or higher (set in environment variables: `NODE_VERSION=18`)

6. Click **Save and Deploy**

Your site will be deployed and you'll get a `.pages.dev` URL.

### Method 2: Using Wrangler CLI

1. Install Wrangler:
```bash
npm install -g wrangler
```

2. Authenticate with Cloudflare:
```bash
wrangler login
```

3. Build your project:
```bash
npm run build
```

4. Deploy to Cloudflare Pages:
```bash
wrangler pages deploy dist --project-name=set-trainer
```

### Method 3: Direct Upload

1. Build your project:
```bash
npm run build
```

2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Pages**

3. Click **Create a project** → **Upload assets**

4. Upload the contents of the `dist/` folder

5. Give your project a name and deploy

## Project Structure

```
set-trainer/
├── src/
│   ├── main.ts              # Main application entry point
│   ├── types.ts             # TypeScript type definitions
│   ├── setLogic.ts          # SET game logic and validation
│   ├── cardRenderer.ts      # Card rendering with SVG
│   ├── findCardMode.ts      # Mode 1: Find completing card
│   ├── validateSetMode.ts   # Mode 2: Validate SET
│   └── style.css            # Application styles
├── index.html               # HTML entry point
├── package.json             # Project dependencies
└── tsconfig.json            # TypeScript configuration
```

## Technologies Used

- **TypeScript**: Type-safe game logic
- **Vite**: Fast build tool and dev server
- **SVG**: Dynamic card rendering
- **Vanilla JS/CSS**: No framework dependencies for optimal performance

## Features

- ✅ Two training modes to improve SET recognition skills
- ✅ Three difficulty levels (Easy: 15s, Medium: 10s, Hard: 5s)
- ✅ Start button for each round - control when the timer begins
- ✅ Visual countdown timer with color-coded warnings
- ✅ Time penalty system (-1 point for timeouts)
- ✅ Real-time score tracking with percentage display
- ✅ Comprehensive statistics tracking (stored in browser)
- ✅ Detailed performance analytics by mode and difficulty
- ✅ Responsive design (mobile-friendly)
- ✅ Fast and lightweight (no framework dependencies)
- ✅ Deployed as static site (perfect for Cloudflare Pages)

## License

MIT
