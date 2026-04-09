export type Project = {
  slug: string;
  title: string;
  display_id: string;
  short_description: string;
  detailed_description: string;
  what_it_proves: string;
  stack: string[];
  key_highlights: string[];
  github_url?: string;
  status: "ACTIVE" | "ARCHIVED" | "STEALTH";
  priority: number;
};

export type BlogEntry = {
  id: string;
  day: number;
  title: string;
  topics: string[];
};

export type SkillPanel = {
  title: string;
  description: string;
  tags: { icon: string; label: string }[];
};

export type NavItem = {
  name: string;
  href: string;
};

export const projects: Project[] = [
  {
    slug: "mean-reverting-pairs-trading",
    title: "Mean Reverting Pairs Trading Strategy",
    display_id: "QUANT_V1",
    short_description:
      "Full pairs trading pipeline on 3 years of live GOOGL/MSFT data. ADF cointegration testing and Z-score signals.",
    detailed_description:
      "A complete quantitative pairs trading system built on 3 years of live GOOGL/MSFT market data. Implements the full pipeline: data ingestion via yfinance, stationarity checks using the Augmented Dickey-Fuller (ADF) test, cointegration verification, and real-time Z-score signal generation for entry/exit points. The strategy exploits the statistical co-movement of correlated assets, entering positions when the spread diverges beyond a threshold and exiting when it mean-reverts.",
    what_it_proves:
      "Demonstrates applied knowledge of time-series analysis, statistical arbitrage, and rigorous backtesting methodologies used in quantitative hedge funds.",
    stack: ["Python", "Pandas", "NumPy", "scikit-learn", "yfinance", "Statsmodels"],
    key_highlights: [
      "ADF cointegration testing on 3 years of live GOOGL/MSFT data",
      "Z-score based entry/exit signal generation",
      "Sharpe ratio and max drawdown reporting",
      "Full vectorized backtesting pipeline with no look-ahead bias",
      "Parameterized for any two correlated equity symbols",
    ],
    github_url: "https://github.com/agarwaladarshcoding-maker/Project-Section/tree/main/Quant-Finance-Project/Mean%20Reverting%20Pairs",
    status: "ACTIVE",
    priority: 1,
  },
  {
    slug: "hf-order-matching-engine",
    title: "High-Frequency Order Matching Engine",
    display_id: "HFT_CORE",
    short_description:
      "Limit Order Book built from scratch. Price-Time Priority matching with O(1) lookup and cache-line optimized memory.",
    detailed_description:
      "A fully functional Limit Order Book (LOB) engine implemented in modern C++17/20 from scratch, without any external libraries. Uses a price-level structure built on `std::map` for sorted price tiers and `std::unordered_map` for O(1) order lookups by ID. Enforces strict Price-Time Priority (FIFO at each level). Memory layout is deliberately designed to minimize cache misses during hot-path execution, leveraging contiguous data structures and smart pointer management to prevent heap fragmentation.",
    what_it_proves:
      "Demonstrates mastery of systems programming, data structure design for high-throughput workloads, and the low-level thinking required for HFT infrastructure engineering.",
    stack: ["C++17/20", "STL", "Smart Pointers", "Custom Allocators"],
    key_highlights: [
      "Price-Time Priority (FIFO) matching algorithm",
      "O(1) average-case order lookup via hash maps",
      "Cache-line optimized memory layout for hot-path operations",
      "Supports Limit, Market, and Cancel order types",
      "Benchmarked against LMAX Disruptor-style access patterns",
    ],
    github_url: "https://github.com/agarwaladarshcoding/hf-order-matching-engine",
    status: "ACTIVE",
    priority: 2,
  },
  {
    slug: "monte-carlo-option-pricer",
    title: "Monte Carlo Exotic Option Pricer",
    display_id: "MC_PRICER",
    short_description:
      "Prices Down-and-Out Barrier Options via 100,000 GBM paths in sub-2 seconds with early-exit optimization.",
    detailed_description:
      "A high-performance Monte Carlo simulation engine for pricing exotic derivative instruments, specifically Down-and-Out Barrier options. Simulates 100,000 Geometric Brownian Motion (GBM) paths using the standard risk-neutral pricing framework. Implements an early-exit optimization that terminates path simulation the moment the underlying asset touches the barrier, dramatically reducing average simulation time. The Python interface (via Pybind11) integrates seamlessly with quantitative research workflows while the C++ core handles the computation.",
    what_it_proves:
      "Demonstrates deep understanding of stochastic calculus, options pricing theory, and the practical ability to build numerical methods that are fast enough for production use.",
    stack: ["C++17/20", "Python", "Pybind11", "NumPy"],
    key_highlights: [
      "100,000 GBM path simulation in sub-2 seconds",
      "Early-exit barrier knockout optimization reduces runtime by ~40%",
      "Greeks estimation via finite difference method",
      "Risk-neutral valuation under Black-Scholes assumptions",
      "Python binding for seamless research workflow integration",
    ],
    github_url: "https://github.com/agarwaladarshcoding-maker/Project-Section/tree/main/Quant-Finance-Project/Monte-Carlo",
    status: "ACTIVE",
    priority: 3,
  },
  {
    slug: "pca-factor-model",
    title: "PCA Factor Model from Scratch",
    display_id: "PCA_FACTOR",
    short_description:
      "Implemented PCA via SVD in NumPy (no ML libraries) to preserve 95%+ variance in multi-asset data.",
    detailed_description:
      "A from-scratch implementation of Principal Component Analysis (PCA) for financial factor modeling, built using only NumPy's Singular Value Decomposition (SVD) — without scikit-learn or any other ML library. Applied to a multi-asset equity universe to extract latent risk factors (analogous to Barra-style factor models). Automatically selects the minimum number of principal components required to preserve a user-specified variance threshold (default: 95%). The resulting factor loadings are interpretable and used for portfolio risk decomposition.",
    what_it_proves:
      "Demonstrates genuine mathematical understanding of linear algebra and dimensionality reduction, going beyond API-level ML usage to build from first principles.",
    stack: ["Python", "NumPy", "Matplotlib", "Pandas"],
    key_highlights: [
      "PCA implemented via SVD — no scikit-learn or ML libraries",
      "Preserves 95%+ variance with automatic component selection",
      "Applied to multi-asset equity return covariance matrices",
      "Factor loading visualization and scree plot generation",
      "Used for portfolio risk decomposition and factor attribution",
    ],
    github_url: "https://github.com/agarwaladarshcoding-maker/Project-Section/tree/main/Quant-Finance-Project/portfolio-manger-v2",
    status: "ACTIVE",
    priority: 4,
  },
  {
    slug: "algorithmic-portfolio-analyser",
    title: "Algorithmic Portfolio Analyser",
    display_id: "PORT_ANAL",
    short_description:
      "Live market data ingestion, historical volatility modeling, and Monte Carlo return simulations.",
    detailed_description:
      "A comprehensive portfolio analytics tool that ingests live market data via yfinance and performs a full suite of quantitative analysis. Computes historical volatility, rolling Sharpe ratios, and maximum drawdown. Uses Monte Carlo simulation to project future return distributions under user-defined time horizons. Implements the Markowitz Efficient Frontier to identify optimal portfolio weightings for a given risk/return target. Outputs an interactive report with all key risk metrics.",
    what_it_proves:
      "Demonstrates end-to-end quantitative finance capabilities: data engineering, statistical analysis, portfolio theory, and professional-grade reporting.",
    stack: ["Python", "Pandas", "yfinance", "NumPy", "Matplotlib", "SciPy"],
    key_highlights: [
      "Live equity data ingestion from Yahoo Finance API",
      "Historical volatility and rolling Sharpe ratio computation",
      "Monte Carlo return projection over configurable time horizons",
      "Markowitz Efficient Frontier optimization",
      "Full portfolio risk report with drawdown and VaR metrics",
    ],
    github_url: "https://github.com/agarwaladarshcoding-maker/Project-Section/tree/main/Quant-Finance-Project/Algo_Portfolio_Manager",
    status: "ACTIVE",
    priority: 5,
  },
  {
    slug: "portfolio-website",
    title: "Personal Portfolio Website",
    display_id: "THIS_SYSTEM",
    short_description:
      "The very system you are currently navigating. Dynamic routing and snap-scroll architecture.",
    detailed_description:
      "The very system you are currently navigating. Built with Next.js App Router and a strict snap-scroll architecture using Tailwind CSS. Features a full custom design system (Neo-Tokyo Terminal aesthetic) with a Deep Midnight / Cyber Gold palette. Implements a dynamic projects ledger with client-side routing, a floating macOS-dock-style navigation bar with glass-morphism, and animated background layers. Data fetching from GitHub API for live repository stats.",
    what_it_proves:
      "Demonstrates full-stack web development capability: design systems, performance-oriented architecture, and the ability to build a high-fidelity product with meticulous attention to detail.",
    stack: ["Next.js 16", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "GitHub API"],
    key_highlights: [
      "Snap-scroll architecture with mandatory viewport alignment",
      "Dynamic [slug] routing for project deep-dive pages",
      "Custom Neo-Tokyo design system with #FACC15 / #0B0C10 palette",
      "Floating macOS Dock navbar with glass-morphism backdrop-blur",
      "Animated isometric grid background on the Projects section",
    ],
    github_url: "https://know-about-adarsh.vercel.app/",
    status: "ACTIVE",
    priority: 6,
  },
];

export const blogEntries: BlogEntry[] = [
  {
    id: "entry-01",
    day: 1,
    title: "Memory Arenas & Cache Locality",
    topics: ["Systems Design", "Performance"],
  },
];

export const skills: SkillPanel[] = [
  {
    title: "SYSTEMS & C++",
    description: "Low-level memory management, lock-free data structures, and optimized hardware utilization.",
    tags: [
      { icon: "⚙️", label: "C++17/20" },
      { icon: "🧠", label: "Memory Arenas" },
      { icon: "⚡", label: "Multi-threading" },
      { icon: "🌐", label: "TCP/IP" },
      { icon: "📖", label: "Limit Order Books" },
    ],
  },
  {
    title: "QUANTITATIVE FINANCE",
    description: "Statistical modeling, stochastic processes, and high-performance financial systems.",
    tags: [
      { icon: "📈", label: "Monte Carlo" },
      { icon: "📊", label: "Black-Scholes" },
      { icon: "📈", label: "Pairs Trading" },
      { icon: "📊", label: "Statistical Arbitrage" },
      { icon: "📊", label: "Backtesting" },
    ],
  },
  {
    title: "PYTHON & DATA SCIENCE",
    description: "Vectorized computation, data pipelines, and machine learning models.",
    tags: [
      { icon: "🐼", label: "Pandas" },
      { icon: "🔢", label: "NumPy" },
      { icon: "⚙️", label: "Scikit-learn" },
      { icon: "🔥", label: "PyTorch" },
      { icon: "⚡", label: "FastAPI" },
    ],
  },
  {
    title: "MATHEMATICS",
    description: "Core analytical foundation for quantitative strategies and systems.",
    tags: [
      { icon: "📐", label: "Linear Algebra" },
      { icon: "🎲", label: "Probability Theory" },
      { icon: "📈", label: "Stochastic Calculus" },
      { icon: "🎯", label: "Optimization" },
    ],
  },
  {
    title: "FULL-STACK WEB",
    description: "Building resilient, high-fidelity interfaces and distributed backend services.",
    tags: [
      { icon: "▲", label: "Next.js" },
      { icon: "⚛️", label: "React" },
      { icon: "◇", label: "TypeScript" },
      { icon: "🎨", label: "Tailwind CSS" },
      { icon: "🍃", label: "MongoDB" },
      { icon: "🟢", label: "Node.js" },
    ],
  },
];

export const navItems: NavItem[] = [
  { name: "Index", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Logs", href: "#blog" },
  { name: "Contact", href: "#contact" },
];

export const coordinates = [
  { label: "GITHUB", value: "github.com/agarwaladarshcoding-maker", href: "https://github.com/agarwaladarshcoding-maker" },
  { label: "LINKEDIN", value: "linkedin.com/in/adarsh-agarwala", href: "https://linkedin.com/in/adarsh-agarwala" },
  { label: "EMAIL", value: "agarwalaadarsh.work@gmail.com", href: "mailto:agarwalaadarsh.work@gmail.com" },
  { label: "LOCATION", value: "IIIT_PUNE, INDIA", href: "#" },
  { label: "EDUCATION", value: "IIIT PUNE (2025-2029)", href: "#" },
  { label: "GPA", value: "9.16", href: "#" },
  { label: "JEE_MAIN", value: "99th Percentile", href: "#" },
];

export const aboutStatus = {
  intro: "Quant researcher & systems engineer. Architecting low-latency trading infrastructure and ML models.",
  corePhilosophy: "First principles only. Deconstruct every system to its mathematical or physical substrate. Trust the architecture, verify the execution.",
  operations: [
    { label: "VENTURE", value: "Core engine architect at a highly technical stealth startup." },
    { label: "BROADCAST", value: "Sharing daily engineering logs and system design insights on LinkedIn." },
    { label: "ALGORITHMS", value: "Active competitive programming grind and continuous Codeforces streak." },
  ]
};

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
