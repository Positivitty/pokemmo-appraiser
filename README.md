# PokeMMO Appraiser

A web app that evaluates your PokeMMO Pokemon and tells you how good they are for competitive play.

## What It Does

- **Search all 649 Gen 1-5 Pokemon** - Every obtainable Pokemon in PokeMMO, loaded from PokeAPI
- **See recommended competitive builds** - 209 builds across OU, UU, and NU tiers with ideal IVs, EVs, nature, ability, item, and moves
- **Evaluate your Pokemon** - Enter your Pokemon's IVs, EVs, nature, and ability to get a grade (S/A/B/C)
- **Compare stats** - See your Pokemon's calculated stats vs perfect stats side-by-side with visual stat bars
- **Auto-fill builds** - One click to fill in the recommended IVs/EVs/nature for any competitive build
- **EV training planner** - Get a step-by-step plan for where to train, how many vitamins to buy, and how many battles to fight

## How Grading Works

Your Pokemon gets scored on 4 things:

| Factor | Weight | What It Measures |
|--------|--------|------------------|
| IVs | 35% | How close your IVs are to ideal (31s, or 0 ATK for special attackers) |
| Nature | 30% | Whether your nature matches the recommended build |
| Ability | 20% | Whether you have the right ability for competitive |
| EVs | 15% | How well your EV spread matches the build |

That competitive score (70%) is combined with a market value estimate (30%) for the final grade:

- **S** = 85+ (Top tier, ready for competitive)
- **A** = 70-84 (Very good, minor flaws)
- **B** = 50-69 (Decent, needs some work)
- **C** = Below 50 (Not great for competitive)

## Quick Start

### Prerequisites

You need **Node.js** installed on your computer. If you don't have it:

1. Go to https://nodejs.org/
2. Download the **LTS** version (green button)
3. Run the installer and follow the prompts
4. Restart your terminal/command prompt after installing

To verify Node.js is installed, open a terminal and run:
```bash
node --version
```
You should see a version number like `v20.x.x`.

### Running the App

1. **Download or clone this repository**
   - Click the green "Code" button on GitHub, then "Download ZIP"
   - Extract the ZIP to a folder on your computer
   - OR if you have git: `git clone https://github.com/Positivitty/pokemmo-appraiser.git`

2. **Open a terminal in the project folder**
   - Windows: Open the folder, hold Shift + right-click, select "Open PowerShell window here"
   - Mac: Open Terminal, type `cd ` then drag the folder into the terminal window

3. **Install dependencies** (only needed once)
   ```bash
   npm install
   ```

4. **Start the app**
   ```bash
   npm run dev
   ```

5. **Open your browser** and go to: **http://localhost:5173**

To stop the app, press `Ctrl + C` in the terminal.

### Build for Production

```bash
npm run build
```

The app fetches all 649 Pokemon from PokeAPI on first load (takes ~30 seconds with a progress bar). After that it's cached in memory.

## How to Use

1. **Search** - Type a Pokemon name, ID number, or type (like "fire") in the search bar
2. **Select** - Click a Pokemon card to open the evaluation form
3. **Check the build** - The "Recommended Build" panel shows ideal IVs, EVs, nature, ability, and moves
4. **Auto-fill or manual** - Click "Auto-fill this build" or enter your Pokemon's actual stats manually
5. **Evaluate** - Hit the Evaluate button to get your grade and breakdown
6. **EV Plan** - Check the EV Planner tab for training locations and vitamin recommendations

## Tips

- Toggle "Perfect Stats" in the search to see what each Pokemon's stats look like at Lv. 50 or 100 with 31 IVs
- Special attackers show 0 ATK IV as ideal (reduces confusion and Foul Play damage)
- Pokemon with multiple viable builds have a dropdown to switch between them
- The EV planner accounts for Pokerus (2x) and Power Items (+8 per battle)

## Tech Stack

- React 19 + TypeScript
- Vite
- CSS Modules (dark theme)
- PokeAPI for Pokemon data
- No backend needed - runs entirely in the browser

## Project Structure

```
src/
  components/     # React components (search, evaluation, results, EV planner)
  data/           # Pokemon data, competitive builds, natures, market prices
  engine/         # Scoring engine (IV, nature, ability, EV scorers)
  planner/        # EV training plan generator
  utils/          # Stat calculator, sprite helpers
  types/          # TypeScript type definitions
```
