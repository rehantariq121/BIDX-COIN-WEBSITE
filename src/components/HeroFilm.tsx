import { ArrowDownRight, FileText } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";

export function HeroFilm() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="film-hero" aria-label="BIDX coin reveal">
      <div className="film-hero-media" aria-hidden="true">
        <img
          className="film-hero-poster"
          src="/posters/chapter-01.png"
          alt=""
          fetchPriority="high"
        />
        {!reduceMotion && (
          <video
            className="film-hero-video"
            src="/videos/chapter-01-reveal.mp4"
            poster="/posters/chapter-01.png"
            preload="auto"
            autoPlay
            muted
            playsInline
            tabIndex={-1}
          />
        )}
      </div>

      <div className="film-hero-vignette" aria-hidden="true" />

      <motion.article
        className="film-hero-copy glass-panel"
        initial={reduceMotion ? false : { opacity: 0, y: 24, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="world-kicker">BNB Smart Chain</p>
        <h1 className="world-title world-title-hero">A coin with roots.</h1>
        <p className="world-body">
          BIDX connects digital participation with evidence-led tree planting.
        </p>
        <div className="world-actions">
          <a className="button button-primary" href="#impact-world">
            See how it grows
            <ArrowDownRight aria-hidden="true" weight="bold" />
          </a>
          <a
            className="button button-ghost"
            href="/BIDX_COIN_BUSINESS_PLAN.md"
            target="_blank"
            rel="noreferrer"
          >
            <FileText aria-hidden="true" weight="bold" />
            Read the plan
          </a>
        </div>
      </motion.article>
    </section>
  );
}
