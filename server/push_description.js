// Run from server/ directory:
// node push-descriptions.js

require("dotenv").config();
const mongoose = require("mongoose");
const Project  = require("./models/Project");

mongoose.connect(process.env.MONGO_URI);

const HFT = `## Overview

A low-latency simulation of a financial exchange's matching engine, designed to execute buy/sell orders based on Price-Time Priority. Demonstrates core High-Frequency Trading concepts including memory safety, order book management, and simulated market data feeds.

**Status:** Active Development (Alpha Phase)

## Architecture

The system has three primary components:

**Order Entry Gateway** — validates incoming FIX-style messages before they reach the engine.

**Matching Engine** — the core logic. Maintains two sorted order books: bids (buyers, highest price first) and asks (sellers, lowest price first). When a new order arrives, the engine checks if it crosses the spread and executes immediately, or rests in the book waiting for a counterparty. All matching follows strict Price-Time Priority — the same rule used by every major exchange in the world.

**Market Data Publisher** — exports simulated trade data to CSV for downstream Python analysis and visualisation.

## Data Structures

- \`std::map\` (Red-Black Tree) for the limit order books — O(log n) insertion, naturally sorted by price level
- \`std::unordered_map\` (Hash Map) for O(1) order lookup by ID — critical for cancel and modify operations

## Memory Safety

Uses RAII and smart pointers (\`std::unique_ptr\`) throughout. The engine never leaks memory and never allocates on the critical path — a core requirement for any production HFT system where a single unexpected allocation can cost a trade.

## Tech Stack

C++17 — chosen for direct control over memory layout, inlining, and compiler optimisation hints unavailable in Python or Java. Every serious HFT system in production is written in C++.

## Build & Run

\`\`\`bash
# Compile with optimisation flags
g++ -O2 -o matching_engine main.cpp

# Run
./matching_engine
\`\`\`

## What I Learned

The gap between academic computer science and production trading systems is enormous. Big-O complexity is almost irrelevant when your bottleneck is a CPU cache miss. Memory layout, branch prediction, and data locality matter more than algorithmic cleverness at microsecond timescales. This was my first real encounter with systems programming done seriously.`;

const MONTE_CARLO = `## Overview

A high-performance Monte Carlo simulation engine designed to price Path-Dependent Exotic Options — specifically Down-and-Out Barrier Call Options.

Unlike standard Black-Scholes implementations that assume a static time-step T, this engine uses Geometric Brownian Motion (GBM) to discretise the simulation into 252 daily trading steps (dt = 1/252), allowing for rigorous barrier monitoring at every point along the price path.

## Why Barrier Options Are Hard

Black-Scholes gives a closed-form solution for vanilla options. Barrier options break this — because the payoff depends on the entire price path (not just the final value), there is no simple formula. If the asset touches the barrier at any point before expiry, the option is knocked out and pays zero. Monte Carlo simulation is the standard industry approach for pricing these instruments.

## Mathematical Model

Asset price trajectories are modelled using the discrete form of Geometric Brownian Motion:

S(t+dt) = S(t) × exp((r - σ²/2)dt + σ√dt × Z)

Where:
- S(t) — stock price at time t
- r — risk-free interest rate
- σ — volatility
- Z — standard normal random variable ~ N(0,1)

## Key Engineering Decisions

**Stochastic accuracy** — uses \`std::mt19937\` (Mersenne Twister) for high-fidelity normal distribution generation, avoiding the statistical biases of \`rand()\`.

**Early Exit optimisation** — paths that breach the barrier are terminated immediately, reducing CPU cycles by ~30% in high-volatility scenarios where many paths knock out early.

**Drift/Diffusion pre-calculation** — mathematical constants computed outside the hot simulation loops to minimise redundant floating-point operations.

**Data serialisation** — exports simulation paths to \`.csv\` for downstream analysis in Python (Pandas/Matplotlib).

## Performance Metrics

- Simulations: 100,000 paths
- Steps per path: 252 (total ~25.2 million steps)
- Execution time: ~1.74 seconds on standard hardware
- Throughput: ~57,000 simulations/second

## Build & Run

\`\`\`bash
# Compile using g++ with optimisation flags
g++ -O3 -o option_pricer main.cpp

# Run the executable
./engine
\`\`\`

Example output:
\`\`\`
Starting Simulation for AAPL...
--------------------------------
Theoretical Option Price: 10.425
Time Taken: 1.74484 seconds
Simulations per Second: 57312
Data saved to 'simulation_data.csv'
\`\`\`

**Dependencies:** Standard C++ Library (STL) only. No external dependencies required.

## What I Learned

Stochastic calculus is not abstract theory — it is the actual engine underneath every derivatives desk at every investment bank. Building this pricer from the mathematics up gave me intuition for why variance reduction techniques like antithetic variates and control variates exist: naive Monte Carlo converges slowly (you need 4x the simulations to halve the error), and these techniques are how practitioners get accurate prices without waiting for hours.`;

const PORTFOLIO = `## Overview

A quantitative finance tool that constructs an optimal portfolio of stocks using Modern Portfolio Theory (MPT) and Monte Carlo Simulation. Analyses historical data to identify the best risk-adjusted returns (Sharpe Ratio) and the safest possible portfolio allocation (Minimum Volatility).

## Key Features

**Automated data pipeline** — fetches real-time adjusted stock data for 20+ tickers using \`yfinance\`, handling splits and dividends automatically.

**Financial mathematics** — calculates annualised returns, volatility (standard deviation), and correlation matrices.

**Monte Carlo simulation** — simulates 5,000+ unique portfolios to visualise the risk-return landscape and map the Efficient Frontier.

**Two optimal portfolios identified:**
- Max Sharpe Ratio — highest risk-adjusted return (the "Red Star" on the frontier)
- Min Volatility — lowest possible risk regardless of return (the "Blue Dot")

**Value at Risk (VaR)** — calculates maximum expected loss at 95% confidence interval.

**Visualisations** — Efficient Frontier scatter plot showing all 5,000 simulated portfolios, plus a Correlation Heatmap proving diversification benefits mathematically.

## Quantitative Concepts Applied

**Log vs simple returns** — log returns normalise price differences across stocks at very different price levels (comparing Apple at $200 vs Google at $150 on simple returns is misleading).

**Sharpe Ratio** — calculated as (Rp - Rf) / σp to measure reward per unit of risk. The fundamental metric for comparing any two strategies.

**Covariance matrix** — the mathematical foundation of diversification. Two assets with negative covariance reduce each other's risk when combined. The full matrix captures all pairwise relationships simultaneously.

**Value at Risk** — a statistical measure of the level of financial risk within a portfolio over a specific time frame.

## Tech Stack

Python · Pandas · NumPy · yfinance · Matplotlib · Seaborn

## How to Run

\`\`\`bash
# Install dependencies
pip install pandas numpy yfinance matplotlib seaborn

# Run
python main.py
\`\`\`

## What I Learned

The theory is elegant. The practice is messier. The sample covariance matrix estimated from historical data is notoriously unstable — small changes in the estimation period produce wildly different optimal weights. This is why practitioners use shrinkage estimators like Ledoit-Wolf. Backtesting also exposed the danger of overfitting: the "optimal" portfolio from the past is rarely optimal going forward.

## Planned Improvements

- Backtesting engine to validate historical performance
- K-Means clustering to group stocks by behaviour rather than sector labels
- Streamlit web app deployment`;

mongoose.connection.once("open", async () => {
  console.log("Connected to MongoDB\n");

  var updates = [
    { title: "High-Frequency Order Book",      longDescription: HFT          },
    { title: "Monte Carlo Options Pricer",      longDescription: MONTE_CARLO  },
    { title: "Algorithmic Portfolio Manager",   longDescription: PORTFOLIO     },
  ];

  try {
    for (var u of updates) {
      var result = await Project.findOneAndUpdate(
        { title: u.title },
        { longDescription: u.longDescription },
        { new: true }
      );
      if (result) {
        console.log("✓", result.title);
      } else {
        console.log("✗ Not found:", u.title);
      }
    }
    console.log("\nAll descriptions pushed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
});