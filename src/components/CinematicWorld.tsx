import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { ArrowDownRight, ArrowUpRight, FileText } from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type WorldChapter = {
  id: string;
  label: string;
  kicker?: string;
  title: string;
  body: string;
  video: string;
  poster: string;
  /** Fraction of this chapter's band spent dissolving into the next (0.05–0.6). Raise it to hide a mismatched seam. */
  fadeLead?: number;
  primary?: {
    label: string;
    href: string;
  };
  secondary?: {
    label: string;
    href: string;
  };
};

type CinematicWorldProps = {
  chapters: WorldChapter[];
  id?: string;
  headingLevel?: "h1" | "h2";
  ariaLabel?: string;
};

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export function CinematicWorld({
  chapters,
  id,
  headingLevel = "h1",
  ariaLabel = "BIDX impact story",
}: CinematicWorldProps) {
  const worldRef = useRef<HTMLElement>(null);
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const targetTimes = useRef<number[]>(chapters.map(() => 0));
  const smoothTimes = useRef<number[]>(chapters.map(() => 0));
  const durations = useRef<number[]>(chapters.map(() => 1));
  const requested = useRef(new Set<number>());
  const createdUrls = useRef<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [blobUrls, setBlobUrls] = useState<(string | null)[]>(() =>
    chapters.map(() => null),
  );
  const activeIndexRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: worldRef,
    offset: ["start start", "end end"],
  });

  const scrollHeight = useMemo(
    () => `${chapters.length * 135 + 100}dvh`,
    [chapters.length],
  );

  const updateMedia = useCallback(
    (progress: number) => {
      const total = chapters.length;
      const position = clamp(progress) * total;
      const current = Math.min(total - 1, Math.floor(position));
      const local = current === total - 1 ? clamp(position - current) : position - current;
      // How much of the outgoing chapter's band is spent dissolving into the next.
      // A wider lead + easing hides seams where the two clips don't line up exactly.
      const lead = clamp(chapters[current]?.fadeLead ?? 0.24, 0.05, 0.6);
      const fadeStart = 1 - lead;
      const raw = local > fadeStart ? (local - fadeStart) / (1 - fadeStart) : 0;
      const blend = raw * raw * (3 - 2 * raw); // smoothstep

      chapters.forEach((_, index) => {
        targetTimes.current[index] = clamp(position - index);
        let opacity = 0;

        if (index === current) {
          opacity = current < total - 1 ? 1 - blend : 1;
        } else if (index === current + 1) {
          opacity = blend;
        }

        const media = mediaRefs.current[index];
        if (media) {
          media.style.opacity = String(clamp(opacity));
          media.style.visibility = opacity > 0.002 ? "visible" : "hidden";
        }
      });

      if (activeIndexRef.current !== current) {
        activeIndexRef.current = current;
        setActiveIndex(current);
      }

      worldRef.current?.style.setProperty("--world-progress", String(clamp(progress)));
    },
    [chapters],
  );

  useMotionValueEvent(scrollYProgress, "change", updateMedia);

  useEffect(() => {
    updateMedia(scrollYProgress.get());
  }, [scrollYProgress, updateMedia]);

  useEffect(() => {
    if (reduceMotion) return;

    let frame = 0;
    const tick = () => {
      videoRefs.current.forEach((video, index) => {
        const media = mediaRefs.current[index];
        if (!video || !media || media.style.visibility === "hidden" || video.seeking) return;

        const desired = targetTimes.current[index] * durations.current[index];
        smoothTimes.current[index] += (desired - smoothTimes.current[index]) * 0.16;

        if (Math.abs(video.currentTime - smoothTimes.current[index]) > 0.025) {
          try {
            video.currentTime = Math.min(
              Math.max(0, smoothTimes.current[index]),
              Math.max(0, durations.current[index] - 0.04),
            );
          } catch {
            // A poster remains visible until the browser allows seeking.
          }
        }
      });
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduceMotion]);

  // Serving a blob keeps scrubbing smooth, but fetching every clip on mount costs
  // the whole reel before the first scroll. Fetch the active chapter plus the next
  // one, widening as the visitor advances.
  useEffect(() => {
    if (reduceMotion) return;

    let cancelled = false;

    const load = async (index: number) => {
      if (index >= chapters.length || requested.current.has(index)) return;
      requested.current.add(index);
      try {
        const response = await fetch(chapters[index].video);
        const blob = await response.blob();
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        createdUrls.current.push(url);
        setBlobUrls((prev) => {
          const next = [...prev];
          next[index] = url;
          return next;
        });
      } catch {
        // Leave the poster in place and allow a later pass to retry; the raw src
        // is used as a fallback below.
        requested.current.delete(index);
      }
    };

    void load(activeIndex);
    void load(activeIndex + 1);

    return () => {
      cancelled = true;
    };
  }, [activeIndex, chapters, reduceMotion]);

  // Revoking happens only on unmount — the effect above reruns on every chapter
  // change, and those URLs are still in use.
  useEffect(
    () => () => {
      createdUrls.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  const primeVideos = () => {
    videoRefs.current.forEach((video) => {
      if (!video) return;
      const promise = video.play();
      if (promise) {
        promise
          .then(() => video.pause())
          .catch(() => {
            // Muted poster fallback remains visible when playback permission is unavailable.
          });
      }
    });
  };

  const jumpTo = (index: number) => {
    const root = worldRef.current;
    if (!root) return;
    const available = root.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: root.offsetTop + available * ((index + 0.08) / chapters.length),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const chapter = chapters[activeIndex];
  const Heading = headingLevel;

  return (
    <section
      id={id}
      ref={worldRef}
      className="cinematic-world"
      style={{ height: scrollHeight }}
      onPointerDown={primeVideos}
      aria-label={ariaLabel}
    >
      <div className="world-sticky">
        <div className="world-progress" aria-hidden="true">
          <span />
        </div>

        <div className="world-media-stack" aria-hidden="true">
          {chapters.map((item, index) => (
            <div
              className="world-media"
              key={item.id}
              ref={(node) => {
                mediaRefs.current[index] = node;
              }}
            >
              <img
                src={item.poster}
                alt=""
                className="world-poster"
                loading={index === 0 ? "eager" : "lazy"}
              />
              {!reduceMotion && (
                <video
                  ref={(node) => {
                    videoRefs.current[index] = node;
                  }}
                  className="world-video"
                  src={blobUrls[index] ?? item.video}
                  poster={item.poster}
                  // Metadata only: the blob fetched above is what actually gets
                  // scrubbed, so preloading the raw src would download it twice.
                  preload="metadata"
                  muted
                  playsInline
                  tabIndex={-1}
                  onLoadedMetadata={(event) => {
                    const video = event.currentTarget;
                    durations.current[index] = video.duration || 1;
                    smoothTimes.current[index] = targetTimes.current[index] * durations.current[index];
                  }}
                  onLoadedData={(event) => {
                    event.currentTarget.dataset.ready = "true";
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="world-vignette" aria-hidden="true" />

        <AnimatePresence mode="wait">
          <motion.article
            className="world-copy glass-panel"
            key={chapter.id}
            initial={reduceMotion ? false : { opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -16, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {chapter.kicker && <p className="world-kicker">{chapter.kicker}</p>}
            <Heading className="world-title">
              {chapter.title}
            </Heading>
            <p className="world-body">{chapter.body}</p>
            {(chapter.primary || chapter.secondary) && (
              <div className="world-actions">
                {chapter.primary && (
                  <a className="button button-primary" href={chapter.primary.href}>
                    {chapter.primary.label}
                    <ArrowDownRight aria-hidden="true" weight="bold" />
                  </a>
                )}
                {chapter.secondary && (
                  <a
                    className="button button-ghost"
                    href={chapter.secondary.href}
                    target={chapter.secondary.href.endsWith(".md") ? "_blank" : undefined}
                    rel={chapter.secondary.href.endsWith(".md") ? "noreferrer" : undefined}
                  >
                    {chapter.secondary.href.endsWith(".md") ? (
                      <FileText aria-hidden="true" weight="bold" />
                    ) : null}
                    {chapter.secondary.label}
                    {!chapter.secondary.href.endsWith(".md") ? (
                      <ArrowUpRight aria-hidden="true" weight="bold" />
                    ) : null}
                  </a>
                )}
              </div>
            )}
          </motion.article>
        </AnimatePresence>

        <nav className="world-route glass-panel" aria-label="Cinematic chapters">
          {chapters.map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={index === activeIndex ? "is-active" : ""}
              onClick={() => jumpTo(index)}
              aria-current={index === activeIndex ? "step" : undefined}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
