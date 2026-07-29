import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  CheckCircle,
  Coins,
  FileText,
  Leaf,
  LinkSimple,
  MapPin,
  Plant,
  ShieldCheck,
  TreeEvergreen,
  Wallet,
} from "@phosphor-icons/react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useState, type ReactNode } from "react";
import { CinematicWorld, type WorldChapter } from "./components/CinematicWorld";
import { EcoLedger } from "./components/EcoLedger";
import { HeroFilm } from "./components/HeroFilm";

const impactChapters: WorldChapter[] = [
  {
    id: "signal",
    label: "Signal",
    title: "The signal finds the soil.",
    body: "Token activity moves toward a restricted path for approved planting campaigns.",
    video: "/videos/journey-02-03.mp4",
    poster: "/posters/journey-02-03.webp",
  },
  {
    id: "roots",
    label: "Roots",
    title: "A contribution takes root.",
    body: "The first visible outcome begins with one connected planting record.",
    video: "/videos/journey-03-04.mp4",
    poster: "/posters/journey-03-04.webp",
  },
  {
    id: "planting",
    label: "Planting",
    title: "One plant becomes a system.",
    body: "Verified campaigns can expand one eligible contribution into connected field activity.",
    video: "/videos/journey-04-05.mp4",
    poster: "/posters/journey-04-05.webp",
    // Planting's last frame and Scaling's first frame don't line up (coin shifts).
    // A big foreground coin ghosts if crossfaded slowly, so keep this seam a short,
    // eased dissolve — the two coins overlap only briefly instead of a long double-image.
    fadeLead: 0.12,
  },
  {
    id: "scale",
    label: "Scale",
    title: "A connected landscape grows.",
    body: "Planting activity scales outward while each campaign keeps its own evidence trail.",
    video: "/videos/journey-05-06.mp4",
    poster: "/posters/journey-05-06.webp",
  },
  {
    id: "evidence",
    label: "Evidence",
    title: "The network stays visible.",
    body: "Locations, field records and survival checks are designed to remain connected.",
    video: "/videos/journey-06-07.mp4",
    poster: "/posters/journey-06-07.webp",
  },
  {
    id: "proof",
    label: "Proof",
    kicker: "The eco-ledger",
    title: "Proof, not promises.",
    body: "A public trail can connect each eligible transaction to a measured environmental outcome.",
    video: "/videos/journey-07-08.mp4",
    poster: "/posters/journey-07-08.webp",
    primary: {
      label: "See the framework",
      href: "#proof-framework",
    },
  },
];

const traceSteps = [
  {
    icon: Wallet,
    title: "Contribution recorded",
    body: "An eligible transaction begins the traceable impact chain.",
  },
  {
    icon: ShieldCheck,
    title: "Allocation restricted",
    body: "Planting funds are separated from operations and liquidity.",
  },
  {
    icon: Plant,
    title: "Campaign approved",
    body: "Vetted partners plant against a documented campaign plan.",
  },
  {
    icon: Camera,
    title: "Evidence published",
    body: "Receipts, images and coordinates connect spending to the field.",
  },
  {
    icon: CheckCircle,
    title: "Survival rechecked",
    body: "Trees are reviewed at 3, 6, 12 and 24 months.",
  },
];

const commitments = [
  {
    title: "Market-priced",
    body: "The USD 1 figure is an initial reference, never a guaranteed market price.",
  },
  {
    title: "Funded rewards",
    body: "Staking should activate only after liabilities and reserve coverage are approved.",
  },
  {
    title: "Profit-only referrals",
    body: "Affiliate rewards must come from defined realized profit, not user deposits.",
  },
  {
    title: "Evidence before claims",
    body: "Plantation and carbon statements require linked proof and verification status.",
  },
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Header() {
  const [hidden, setHidden] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? current;

    if (current < 80) {
      setHidden(false);
      return;
    }

    if (Math.abs(current - previous) > 2) {
      setHidden(current > previous);
    }
  });

  return (
    <motion.header
      className="site-header"
      animate={{
        y: hidden ? -96 : 0,
        opacity: hidden ? 0 : 1,
      }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.34, ease: [0.16, 1, 0.3, 1] }
      }
      style={{ pointerEvents: hidden ? "none" : "auto" }}
    >
      <a className="brand" href="#top" aria-label="BIDX home">
        <span className="brand-mark">
          <img src="/logo/bidx_coin_logo.webp" alt="BIDX Coin Logo" className="brand-mark-img" />
        </span>
        <span>BIDX</span>
      </a>
      <nav className="main-nav" aria-label="Primary navigation">
        <a href="#model">Model</a>
        <a href="#impact-trace">Impact</a>
        <a href="#token">Token</a>
        <a href="#roadmap">Roadmap</a>
      </nav>
      <a
        className="header-cta"
        href="/BIDX_COIN_BUSINESS_PLAN.md"
        target="_blank"
        rel="noreferrer"
      >
        Read the plan
        <ArrowUpRight aria-hidden="true" weight="bold" />
      </a>
    </motion.header>
  );
}

export function App() {
  return (
    <div id="top" className="site-shell">
      <Header />
      <main>
        <HeroFilm />

        <section className="signal-strip" aria-label="BIDX foundations">
          <div className="section-shell signal-grid glass-panel">
            <div>
              <span>Network</span>
              <strong>BNB Smart Chain</strong>
            </div>
            <div>
              <span>Standard</span>
              <strong>BEP-20</strong>
            </div>
            <div>
              <span>Hard cap</span>
              <strong>100M BIDX</strong>
            </div>
            <div>
              <span>Mission</span>
              <strong>30M verified trees</strong>
            </div>
          </div>
        </section>

        <section id="model" className="content-section model-section">
          <div className="section-shell">
            <Reveal className="section-heading">
              <p className="eyebrow">The BIDX model</p>
              <h2>Digital participation with a visible destination.</h2>
              <p>
                The platform is designed to connect token activity, restricted environmental
                funding and public campaign evidence in one experience.
              </p>
            </Reveal>

            <div className="model-layout">
              <Reveal className="model-visual glass-panel">
                <img
                  src="/posters/chapter-02.webp"
                  alt="BIDX coin sending green energy into a network of roots below the soil"
                  loading="lazy"
                />
                <div className="model-visual-copy">
                  <Leaf aria-hidden="true" weight="fill" />
                  <p>One eligible contribution can begin one traceable planting record.</p>
                </div>
              </Reveal>

              <div className="model-points">
                <Reveal className="model-point" delay={0.05}>
                  <LinkSimple aria-hidden="true" />
                  <div>
                    <h3>On-chain origin</h3>
                    <p>A qualifying transaction creates the financial starting point.</p>
                  </div>
                </Reveal>
                <Reveal className="model-point" delay={0.1}>
                  <TreeEvergreen aria-hidden="true" />
                  <div>
                    <h3>Restricted planting fund</h3>
                    <p>Environmental allocations stay separate from operating money.</p>
                  </div>
                </Reveal>
                <Reveal className="model-point" delay={0.15}>
                  <MapPin aria-hidden="true" />
                  <div>
                    <h3>Field-level evidence</h3>
                    <p>Campaign records can include location, spending and survival proof.</p>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <CinematicWorld
          id="impact-world"
          chapters={impactChapters}
          headingLevel="h2"
          ariaLabel="BIDX planting and proof journey"
        />

        <section id="impact-trace" className="content-section trace-section">
          <div className="section-shell trace-layout">
            <Reveal className="trace-intro">
              <h2>Follow the fund. Find the tree.</h2>
              <p>
                The eco-ledger is designed as a complete trail from transaction to survival
                result.
              </p>
              <a className="text-link" href="#proof-framework">
                View the proof framework
                <ArrowRight aria-hidden="true" weight="bold" />
              </a>
            </Reveal>

            <div className="trace-steps glass-panel">
              {traceSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Reveal className="trace-step" delay={index * 0.04} key={step.title}>
                    <span className="trace-icon">
                      <Icon aria-hidden="true" weight="duotone" />
                    </span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.body}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <EcoLedger id="eco-ledger" />

        <section className="content-section allocation-section">
          <div className="section-shell">
            <Reveal className="section-heading compact-heading">
              <h2>Every eligible launch dollar has a role.</h2>
              <p>
                The proposed 30/20/50 allocation applies to the initial public tranche and
                remains subject to final governance approval.
              </p>
            </Reveal>

            <div className="allocation-grid">
              <Reveal className="allocation-cell allocation-cell-impact glass-panel">
                <div className="allocation-number">30%</div>
                <div>
                  <Plant aria-hidden="true" weight="fill" />
                  <h3>Tree Plantation Fund</h3>
                  <p>Restricted funding for approved campaigns and evidence.</p>
                </div>
              </Reveal>
              <Reveal className="allocation-cell allocation-cell-liquidity glass-panel" delay={0.06}>
                <div className="allocation-number">50%</div>
                <div>
                  <Coins aria-hidden="true" weight="duotone" />
                  <h3>Swap liquidity</h3>
                  <p>Capital assigned to planned BIDX/USDT market access.</p>
                </div>
              </Reveal>
              <Reveal className="allocation-cell allocation-cell-growth glass-panel" delay={0.12}>
                <div className="allocation-number">20%</div>
                <div>
                  <Leaf aria-hidden="true" weight="duotone" />
                  <h3>Education and growth</h3>
                  <p>Controlled awareness, onboarding and community education.</p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="token" className="content-section token-section">
          <div className="section-shell token-layout">
            <Reveal className="token-title">
              <p className="eyebrow">Token foundation</p>
              <h2>A hard cap. A planned reserve. Public rules.</h2>
              <p>
                BIDX is proposed as a BEP-20 utility token with reserve controls designed for
                auditability.
              </p>
            </Reveal>

            <Reveal className="token-profile glass-panel">
              <div className="token-primary">
                <span>Maximum supply</span>
                <strong>100,000,000</strong>
                <small>BIDX hard cap</small>
              </div>
              <div className="token-specs">
                <div>
                  <span>Initial public allocation</span>
                  <strong>500,000 BIDX</strong>
                </div>
                <div>
                  <span>Planned locked reserve</span>
                  <strong>99,500,000 BIDX</strong>
                </div>
                <div>
                  <span>Staking design</span>
                  <strong>24 months</strong>
                  <small>Reward terms remain subject to approval.</small>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="proof-framework" className="content-section proof-section">
          <div className="section-shell">
            <Reveal className="proof-heading">
              <h2>Trust is part of the product.</h2>
              <p>
                The plan puts solvency, verification and responsible conduct before public
                promotion.
              </p>
            </Reveal>

            <div className="commitment-grid">
              {commitments.map((commitment, index) => (
                <Reveal className="commitment" delay={index * 0.05} key={commitment.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{commitment.title}</h3>
                  <p>{commitment.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="roadmap" className="content-section roadmap-section">
          <div className="section-shell roadmap-layout">
            <Reveal className="roadmap-copy">
              <h2>Permission first. Proof before scale.</h2>
              <p>
                The path to launch moves from legal feasibility to a controlled pilot, audited
                production and measured expansion.
              </p>
            </Reveal>
            <div className="roadmap-track">
              {[
                ["Permission", "Economic and legal decisions are resolved."],
                ["Prototype", "Testnet contracts and reserve models are hardened."],
                ["Pilot", "A small planting campaign is independently reviewed."],
                ["Audit", "Security, treasury and evidence systems are tested."],
                ["Scale", "Pakistan access expands only after launch controls hold."],
              ].map(([title, body], index) => (
                <Reveal className="roadmap-stop glass-panel" delay={index * 0.04} key={title}>
                  <span>{title}</span>
                  <p>{body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="content-section faq-section">
          <div className="section-shell faq-layout">
            <Reveal>
              <h2>Questions worth asking.</h2>
            </Reveal>
            <div className="faq-list">
              {[
                [
                  "Is USD 1 a guaranteed BIDX price?",
                  "No. The business plan treats USD 1 only as an initial reference price. Open-market trading can move the price immediately.",
                ],
                [
                  "Is staking live?",
                  "No production staking is presented here. The 24-month design requires legal, economic and reserve-coverage approval before launch.",
                ],
                [
                  "Does one planted seedling equal verified carbon?",
                  "No. A seedling, a surviving tree, an estimated carbon impact and a certified carbon credit are different outcomes.",
                ],
                [
                  "How should plantation claims be verified?",
                  "Through linked spending records, campaign approvals, field images, coordinates, survival checks and independent assurance.",
                ],
                [
                  "What is this website today?",
                  "A frontend presentation of the proposed BIDX model. It is not an offer to sell tokens or a live financial product.",
                ],
              ].map(([question, answer]) => (
                <details className="faq-item glass-panel" key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="finale-section">
          <img src="/posters/chapter-04.webp" alt="" aria-hidden="true" loading="lazy" />
          <div className="finale-overlay" />
          <Reveal className="finale-card glass-panel">
            <span className="brand-mark finale-mark">
              <img src="/logo/bidx_coin_logo.webp" alt="BIDX Coin Logo" className="brand-mark-img" />
            </span>
            <h2>Build the proof before the promise.</h2>
            <p>Explore the complete commercial, environmental and governance plan for BIDX.</p>
            <a
              className="button button-primary"
              href="/BIDX_COIN_BUSINESS_PLAN.md"
              target="_blank"
              rel="noreferrer"
            >
              <FileText aria-hidden="true" weight="bold" />
              Read the plan
            </a>
          </Reveal>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-shell footer-layout">
          <div className="brand footer-brand">
            <span className="brand-mark">
              <img src="/logo/bidx_coin_logo.webp" alt="BIDX Coin Logo" className="brand-mark-img" />
            </span>
            <span>BIDX</span>
          </div>
          <p>
            Planning concept only. Not an offer to sell tokens or financial products. All
            launch claims remain subject to legal, economic, security and environmental
            verification.
          </p>
          <a href="#top">
            Back to top
            <ArrowUpRight aria-hidden="true" weight="bold" />
          </a>
        </div>
      </footer>
    </div>
  );
}
