/**
 * projects.ts
 * Single source of truth for all project data.
 * Shared by: ProjectsLedger (homepage summary) + /projects/[slug] (deep dive).
 */

export type Project = {
  slug: string;
  title: string;
  lang: string;
  metrics: string;
  tagline: string;
  desc: string;       // short — used in ledger
  objective: string;  // 1-sentence mission statement
  github: string;
  tags: string[];
  architecture: string;       // markdown
  techStack: { label: string; value: string }[];
  performance: { label: string; value: string }[];
  challenges: string;         // markdown
};

export const PROJECTS: Project[] = [
  /* ─────────────────────────────────────────────────────────────────────────
   * 1. HIGH-FREQUENCY ORDER BOOK
   * ───────────────────────────────────────────────────────────────────────── */
  {
    slug: "hft-order-book",
    title: "High-Frequency Order Book",
    lang: "C++",
    metrics: "zero dynamic allocation",
    tagline: "A lock-free, cache-coherent matching engine built for sub-microsecond order processing.",
    desc: "Low-latency matching engine, Price-Time Priority, Order Entry Gateway.",
    objective:
      "Build an ultra-low latency matching engine capable of handling high-throughput order flow with deterministic execution times.",
    github: "https://github.com/adarshagarwala/hft-order-book",
    tags: ["C++17", "HFT", "Lock-Free", "RAII", "Market Microstructure"],
    architecture: `A robust C++ matching engine implementing **Price-Time Priority**. Designed to simulate the core infrastructure of a proprietary trading firm, focusing on absolute performance and memory safety.

The system is composed of three decoupled components communicating via **lock-free SPSC ring buffers**:

1. **Order Entry Gateway** — validates and sequence-stamps inbound orders. Enforces strict message schemas, rejects malformed orders before they reach the engine.
2. **Matching Engine** — maintains a price-level linked-list order book. Executes trades using Price-Time Priority, tracking active orders in an \`unordered_map\` keyed by Order ID for O(1) cancel/modify.
3. **Market Data Publisher** — broadcasts execution reports and incremental book-depth snapshots via UDP multicast to downstream consumers.

All allocations are made at startup from a **pre-allocated memory pool** (slab allocator). Zero dynamic heap allocation occurs on the critical code path during live trading.`,
    techStack: [
      { label: "Core Language", value: "C++17, strict no-exception policy" },
      { label: "Memory Strategy", value: "RAII + custom slab allocator; zero heap allocation in hot path" },
      { label: "Data Structures", value: "Price-level doubly-linked list + unordered_map for O(1) lookup" },
      { label: "Concurrency", value: "Lock-free SPSC ring buffers (inspired by LMAX Disruptor)" },
      { label: "Market Data", value: "UDP multicast for incremental book depth + execution reports" },
      { label: "STL Usage", value: "std::array, std::optional, std::variant (no std::map in hot path)" },
    ],
    performance: [
      { label: "Order Processing Latency", value: "< 1 μs (P99)" },
      { label: "Sustained Throughput", value: "> 2M orders / sec" },
      { label: "Heap Allocations (hot path)", value: "0" },
      { label: "Cancel / Modify", value: "O(1) via hash lookup" },
      { label: "Architecture", value: "3-stage pipeline (Gateway → Engine → Publisher)" },
    ],
    challenges: `**False sharing between shared data structures** was the primary performance killer on multi-core runs. Cache lines are 64 bytes on x86-64; struct fields written by different cores on the same line cause the hardware cache coherency protocol to invalidate remote cores on every write. Solved via explicit \`alignas(64)\` padding on all cross-thread shared objects, profiled using \`perf stat -e cache-misses\`.

**Deterministic sequencing** across pipeline stages required careful design. Each message published to the ring buffer carries a monotonically increasing sequence number assigned by the Gateway. Downstream consumers detect and compensate for gaps using a sequence-gap detector before forwarding out-of-order data.

**Order book memory reclamation** without garbage collection was solved using a **freelist pool**: cancelled/filled order nodes are returned to the pool rather than freed, making allocation O(1) and entirely GC-free.`,
  },

  /* ─────────────────────────────────────────────────────────────────────────
   * 2. MONTE CARLO OPTIONS PRICER
   * ───────────────────────────────────────────────────────────────────────── */
  {
    slug: "monte-carlo-options-pricer",
    title: "Monte Carlo Exotic Options Pricer",
    lang: "C++",
    metrics: "57,000 sims / sec",
    tagline: "A vectorized Monte Carlo engine pricing path-dependent exotic options using Geometric Brownian Motion.",
    desc: "Down-and-Out Barrier Call Option, GBM, 100,000 paths, 252 steps, Early Exit optimization.",
    objective:
      "Price complex exotic options using stochastic calculus and computational finance techniques at maximum throughput.",
    github: "https://github.com/adarshagarwala/monte-carlo-pricer",
    tags: ["C++", "Quantitative Finance", "Monte Carlo", "GBM", "Options Pricing"],
    architecture: `A high-performance pricer for **Down-and-Out Barrier Call Options**. It leverages **Geometric Brownian Motion (GBM)** to simulate asset price paths under the risk-neutral measure and calculates expected payoffs discounted to present value.

**Simulation Loop:**
Each of the 100,000 paths advances the asset price through 252 daily time steps (one trading year) using the Euler-Maruyama discretization of the GBM SDE:
\`\`\`
S(t+dt) = S(t) * exp((r - 0.5σ²)dt + σ√dt * Z)
\`\`\`
where Z ~ N(0,1) is drawn from the **Mersenne Twister PRNG** via a **Box-Muller transform**.

**Early Exit Optimization:**  
Down-and-Out options become worthless the instant the underlying price breaches the barrier. The inner loop checks the barrier condition at each step and aborts the path immediately upon breach — this **reduces average path computation by ~35%** on typical barrier configurations.

**Throughput:** The combination of PRNG efficiency and early exit delivers **57,000 paths/sec** on a single core, scaling linearly with thread count via OpenMP.`,
    techStack: [
      { label: "Language", value: "C++17 with OpenMP for outer-loop parallelism" },
      { label: "PRNG", value: "Mersenne Twister MT19937 — industry standard, period 2^19937-1" },
      { label: "Normal Sampling", value: "Box-Muller transform (polar form) for N(0,1) variates" },
      { label: "Option Type", value: "Down-and-Out Barrier Call (path-dependent, vanilla extendable)" },
      { label: "GBM Discretization", value: "Euler-Maruyama scheme, 252 daily steps (1 trading year)" },
      { label: "Validation", value: "Cross-checked against Black-Scholes closed-form where applicable" },
    ],
    performance: [
      { label: "Throughput (single-core)", value: "57,000 paths / sec" },
      { label: "Total Paths", value: "100,000" },
      { label: "Steps per Path", value: "252 (daily, 1yr)" },
      { label: "Early Exit Speedup", value: "~35% avg path length reduction" },
      { label: "Pricing Error (vs. BSM)", value: "< 0.1% (European, 100k paths)" },
    ],
    challenges: `**PRNG thread-safety and correlation artifacts** were the main correctness challenge. Naive sharing of a single RNG instance across OpenMP threads introduces data races and, worse, produces correlated samples that destroy simulation validity. Each thread is seeded with a unique, deterministically derived seed from a master seed, giving independent, reproducible streams per thread.

**Variance reduction** is critical because raw Monte Carlo converges at O(1/√N) — halving the error requires 4× the paths. Implemented **antithetic variates**: for each random number Z drawn, an additional path uses −Z. This exploits negative correlation between path pairs to nearly halve variance at zero additional PRNG cost, effectively doubling precision for free.

**Barrier discretization bias** is a subtle quantitative finance issue: continuous-time barriers are breached continuously, but discrete daily checks miss intraday breaches. This causes systematic overpricing. Addressed with the **Broadie-Glasserman-Kou correction**, which applies an analytical adjustment factor to the simulated price, correcting the discrete monitoring bias.`,
  },

  /* ─────────────────────────────────────────────────────────────────────────
   * 3. ALGORITHMIC PORTFOLIO MANAGER
   * ───────────────────────────────────────────────────────────────────────── */
  {
    slug: "algorithmic-portfolio-manager",
    title: "Algorithmic Portfolio Manager",
    lang: "Python",
    metrics: "5,000+ portfolio sims",
    tagline: "A quantitative portfolio engine implementing Modern Portfolio Theory with Efficient Frontier optimization.",
    desc: "Modern Portfolio Theory, Efficient Frontier, Max Sharpe, Min-Vol, Value at Risk (VaR).",
    objective:
      "Automate portfolio construction and risk assessment using Modern Portfolio Theory to find the optimal risk-to-reward allocation.",
    github: "https://github.com/adarshagarwala/algo-portfolio-manager",
    tags: ["Python", "Quantitative Finance", "MPT", "Optimization", "Risk Analysis", "SciPy"],
    architecture: `A quantitative tool that evaluates **thousands of potential asset weightings** to find the optimal risk-to-reward ratio for a given basket of equities.

**Pipeline:**
\`\`\`
Data Ingestion → Statistical Analysis → Portfolio Optimization → Risk Attribution → Visualization
\`\`\`

**Monte Carlo Frontier Estimation:**  
5,000+ portfolios with randomly sampled weight vectors are simulated. Each is evaluated on expected return, volatility (standard deviation), and Sharpe Ratio. The resulting cloud of points traces out the **Efficient Frontier** empirically, making the theoretical boundary tangible and explorable.

**Deterministic Optimization:**  
On top of Monte Carlo, \`scipy.optimize.minimize\` (SLSQP solver) finds the exact **Maximum Sharpe Ratio** (tangency) portfolio and **Minimum Volatility** portfolio analytically, subject to:
- Weights sum to 1.0
- All weights ≥ 0 (no short selling)
- Optional target-return constraint

**Risk Metrics:**  
Both **historical VaR** (empirical 5th percentile of returns distribution) and **parametric VaR** (Gaussian, μ − 1.645σ) are computed and compared to highlight the impact of fat tails.`,
    techStack: [
      { label: "Language", value: "Python 3.11 — NumPy, Pandas, SciPy, Matplotlib, Plotly" },
      { label: "Data Source", value: "yfinance API — 10 years of daily OHLCV for each equity" },
      { label: "Covariance Estimation", value: "Ledoit-Wolf shrinkage (sklearn) — ensures positive-definiteness" },
      { label: "Optimization Solver", value: "scipy.optimize.minimize (SLSQP) — constrained nonlinear" },
      { label: "Monte Carlo", value: "5,000 random portfolios for empirical Efficient Frontier" },
      { label: "Risk Metrics", value: "Sharpe Ratio, Max Drawdown, 95% & 99% VaR, CVaR (Expected Shortfall)" },
    ],
    performance: [
      { label: "Monte Carlo Portfolios", value: "5,000+" },
      { label: "Supported Universe", value: "Up to 50 assets" },
      { label: "Optimization Time", value: "< 0.8s (10-asset, SLSQP)" },
      { label: "Historical Data", value: "10 years daily OHLCV" },
      { label: "VaR Confidence Levels", value: "95% and 99%" },
    ],
    challenges: `**Covariance matrix singularity** is the fundamental blocker in Markowitz optimization. A naive sample covariance matrix becomes singular (rank-deficient) when the number of assets approaches or exceeds the number of observations — making matrix inversion undefined. Solved with **Ledoit-Wolf shrinkage**: a weighted blend of the sample covariance and a structured target (identity-scaled) that guarantees positive-definiteness and numerical stability.

**Fat tails vs. Gaussian VaR** was a critical modelling accuracy issue. The portfolio's historical return distribution exhibits **negative skew and excess kurtosis** — real market behaviour. Parametric VaR under a Gaussian assumption understates tail risk by 15–40% in backtests. The tool explicitly presents both estimates with a comparison, educating users on model risk.

**Choosing the right risk-free rate** for Sharpe Ratio computation matters significantly when optimizing. Used a dynamic fetch of the current 3-month US T-bill yield via API rather than hardcoding 0% or an outdated figure, producing more accurate tangency portfolio weights.`,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
