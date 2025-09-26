import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaXTwitter, FaLinkedinIn, FaFacebook } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";
import "./index.css";

const TOTAL_PAGES = 10;
const SPACER_PX = 24;

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="text-white text-center p-4">
            Something went wrong. Please refresh the page.
          </div>
        )
      );
    }
    return this.props.children;
  }
}

// Font loader utility
const loadFonts = () => {
  const fontLink = document.createElement("link");
  fontLink.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap";
  fontLink.rel = "stylesheet";
  document.head.appendChild(fontLink);
};

export default function App() {
  useEffect(() => {
    loadFonts();
  }, []);

  return (
    <ErrorBoundary>
      <div className="w-full h-full bg-black text-white">
        <Landing />
      </div>
    </ErrorBoundary>
  );
}

/* ------------------------------------
 * Reduced-motion preference
 * ------------------------------------ */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();

    // Modern browsers
    if (mq.addEventListener) {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    // Legacy browsers
    else if (mq.addListener) {
      mq.addListener(onChange);
      return () => mq.removeListener(onChange);
    }
  }, []);
  return reduced;
}

/* ------------------------------------ */
function Landing() {
  const [currentPage, setCurrentPage] = useState(1);
  const reduced = useReducedMotion();
  const onInView = useCallback((page: number, inView: boolean) => {
    if (inView) setCurrentPage(page);
  }, []);

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden bg-black text-white scroll-smooth [&::-webkit-scrollbar]:hidden"
      style={
        {
          scrollBehavior: "smooth",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          ...(typeof window !== "undefined" && {
            WebkitOverflowScrolling: "touch",
          }),
        } as React.CSSProperties
      }
    >
      <AgenticGrid reduced={reduced} />
      <LogoHUD page={currentPage} reduced={reduced} />

      {/* Sections - Fixed numbering */}
      <Section pageNum={1} onInView={onInView}>
        <Page1 reduced={reduced} />
      </Section>
      <PageSpacer />
      <Section pageNum={2} onInView={onInView}>
        <Page2 reduced={reduced} />
      </Section>
      <PageSpacer />
      <Section pageNum={3} onInView={onInView}>
        <Page3 reduced={reduced} />
      </Section>
      <PageSpacer />
      <Section pageNum={4} onInView={onInView}>
        <Page4 reduced={reduced} />
      </Section>
      <PageSpacer />
      <Section pageNum={5} onInView={onInView}>
        <Page5 reduced={reduced} />
      </Section>
      <PageSpacer />
      <Section pageNum={6} onInView={onInView}>
        <Page6 reduced={reduced} />
      </Section>
      <PageSpacer />
      <Section pageNum={7} onInView={onInView}>
        <Page7 reduced={reduced} />
      </Section>
      <PageSpacer />
      <Section pageNum={8} onInView={onInView}>
        <Page8 reduced={reduced} />
      </Section>
      <PageSpacer />
      <Section pageNum={9} onInView={onInView}>
        <Page9 reduced={reduced} />
      </Section>
      <PageSpacer />
      <Section pageNum={10} onInView={onInView}>
        <Page10 reduced={reduced} />
      </Section>

      {import.meta.env?.DEV && <DevTests />}
    </div>
  );
}

/* ------------------------------------ */
const Section = React.memo(function Section({
  pageNum,
  onInView,
  children,
}: {
  pageNum: number;
  onInView: (p: number, v: boolean) => void;
  children: React.ReactNode;
}) {
  const { ref, inView } = useInView({
    threshold: 0.6,
    rootMargin: "0px 0px -10% 0px", // Added root margin for smoother transitions
  });
  useEffect(() => onInView(pageNum, inView), [inView, onInView, pageNum]);
  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen bg-black overflow-hidden snap-start"
    >
      {children}
    </section>
  );
});

function PageSpacer() {
  return <div style={{ height: SPACER_PX }} aria-hidden="true" />;
}

/* ------------------------------------
 * Global chrome
 * ------------------------------------ */
const AgenticGrid = React.memo(function AgenticGrid({
  reduced,
}: {
  reduced: boolean;
}) {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -120]);
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.14, 0.08]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        x,
        y,
        opacity,
        backgroundImage: `
          radial-gradient(800px 800px at 50% 55%, rgba(35,176,136,0.10), transparent 60%),
          repeating-linear-gradient(0deg, rgba(35,176,136,0.06) 0 1px, transparent 1px 64px),
          repeating-linear-gradient(90deg, rgba(35,176,136,0.05) 0 1px, transparent 1px 64px)
        `,
        mixBlendMode: "soft-light",
      }}
    />
  );
});

/* ------------------------------------
 * HUD choreography
 * ------------------------------------ */
function LogoHUD({ page, reduced }: { page: number; reduced: boolean }) {
  const [showText, setShowText] = useState(false);
  const [typewriterText, setTypewriterText] = useState("");
  const fullText = "Lif3away";

  const variant = useMemo(() => {
    if (page === 1) return "p1";
    if (page === 2) return "p2";
    if (page === 3) return "p3";
    return "rest";
  }, [page]);

  // Control text appearance timing for page 2
  useEffect(() => {
    if (variant === "p2") {
      setShowText(false);
      setTypewriterText("");

      const textTimer = setTimeout(() => {
        setShowText(true);
      }, 600);

      return () => {
        clearTimeout(textTimer);
      };
    } else {
      setShowText(false);
      setTypewriterText("");
    }
  }, [variant]);

  // Typewriter effect
  useEffect(() => {
    if (showText && variant === "p2") {
      setTypewriterText(""); // Reset first
      const chars = "Lif3away".split(""); // Use string directly
      let currentIndex = 0;

      const typeInterval = setInterval(() => {
        if (currentIndex < chars.length) {
          setTypewriterText((prev) => {
            // Build the string from scratch each time to avoid concatenation issues
            return chars.slice(0, currentIndex + 1).join("");
          });
          currentIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 60); // Typing speed

      return () => clearInterval(typeInterval);
    }
  }, [showText, variant]);

  if (variant === "p1" || variant === "rest") return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 select-none"
      data-testid="logo-hud"
    >
      {/* Logo for page 2 - centered */}
      {variant === "p2" && (
        <motion.div
          className="absolute flex items-center justify-center"
          initial={{
            left: "50%",
            top: "50%",
            x: "-50%",
            y: "-50%",
            opacity: 0,
          }}
          animate={{
            left: "50%",
            top: "50%",
            x: "-50%",
            y: "-50%",
            opacity: 1,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            opacity: { duration: 0.3 },
          }}
        >
          <img
            src="/assets/logo.png"
            alt="Lif3away logo"
            className="w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] md:w-[220px] md:h-[220px] lg:w-[280px] lg:h-[280px]"
          />
          {/*  spacing between logo and text */}
          <div className="w-2 sm:w-3 md:w-4" />

          <div className="relative">
            <motion.span
              className="text-[48px] sm:text-[64px] md:text-[80px] lg:text-[100px] xl:text-[120px] font-light tracking-tight inline-block whitespace-nowrap"
              style={{
                fontFamily:
                  "'Helvetica Neue', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica', 'Arial', sans-serif",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                paddingRight: "0.1em", // Add padding to prevent cutoff
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: showText ? 1 : 0 }}
              transition={{ duration: 0.3 }} // Reduced from 0.5s
            >
              {typewriterText}
            </motion.span>
          </div>
        </motion.div>
      )}

      {/* Logo for page 3 - top left corner */}
      {variant === "p3" && (
        <motion.div
          className="absolute"
          initial={{
            left: "50%",
            top: "50%",
            x: "-50%",
            y: "-50%",
            opacity: 1,
          }}
          animate={{
            left: "32px",
            top: "32px",
            x: 0,
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 1,
            ease: [0.43, 0.13, 0.23, 0.96],
          }}
        >
          <motion.img
            src="/assets/logo.png"
            alt="Lif3away logo"
            animate={{
              width: "48px",
              height: "48px",
            }}
            initial={{
              width: "220px",
              height: "220px",
            }}
            transition={{
              duration: 1,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
          />
        </motion.div>
      )}
    </div>
  );
}

/* ------------------------------------
 * Shared
 * ------------------------------------ */
function CTA({
  children,
  href = "#",
}: {
  children: React.ReactNode;
  href?: string;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-lg border border-[#23B088] px-5 py-3 text-white hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#23B088] focus:ring-offset-2 focus:ring-offset-black"
      aria-label={typeof children === "string" ? children : "Call to action"}
    >
      {children}
    </a>
  );
}

function TitleParallax({
  children,
  reduced,
}: {
  children: React.ReactNode;
  reduced: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 20%"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [24, -12]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div ref={ref} style={{ y, opacity }}>
      {children}
    </motion.div>
  );
}

// Stable, cross-browser reveal
function RevealIn({
  children,
  reduced,
}: {
  children: React.ReactNode;
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={{
        y: reduced ? 0 : 24,
        opacity: 0,
        filter: reduced ? "none" : "blur(6px)",
      }}
      whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{
        duration: reduced ? 0.15 : 0.35,
        ease: [0.22, 0.8, 0.2, 1],
      }} // Reduced from 0.25/0.6
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------
 * Page 1 — self-drawing SVG + glow
 * ------------------------------------ */
function Page1({ reduced }: { reduced: boolean }) {
  const { ref, inView } = useInView({ threshold: 0.75, triggerOnce: false });
  const [drawKey, setDrawKey] = useState(0);
  useEffect(() => {
    if (inView) setDrawKey((k) => k + 1);
  }, [inView]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="relative flex flex-col items-center gap-6">
        <ErrorBoundary
          fallback={
            <img
              src="/assets/logo.png"
              alt="Lif3away logo"
              className="w-[260px] h-[260px]"
            />
          }
        >
          <DrawnLogo
            key={drawKey}
            className="w-[260px] h-[260px]"
            duration={reduced ? 0 : 1.2}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
}

const DrawnLogo = React.memo(function DrawnLogo({
  className,
  duration = 2.0,
}: {
  className?: string;
  duration?: number;
}) {
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await fetch("/assets/drawline.svg", { cache: "no-store" });
        const txt = await r.text();
        if (mounted && r.ok && txt.includes("<svg")) setSvgMarkup(txt);
        else if (mounted) setSvgMarkup(null);
      } catch {
        if (mounted) setSvgMarkup(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!svgMarkup || !containerRef.current) return;

    const raf = requestAnimationFrame(() => {
      const svg = containerRef.current?.querySelector("svg");
      if (!svg) return;

      // Normalize stroke
      svg.querySelectorAll<SVGGraphicsElement>("*").forEach((n) => {
        n.setAttribute("fill", "none");
        n.setAttribute("stroke", "#23B088");
        n.setAttribute("stroke-width", "6");
        n.setAttribute("stroke-linecap", "round");
        n.setAttribute("stroke-linejoin", "round");
        n.setAttribute("vector-effect", "non-scaling-stroke");
      });

      const targets = svg.querySelectorAll<SVGGeometryElement>(
        "path,polyline,polygon,line,circle,rect"
      );
      targets.forEach((p) => {
        try {
          const len =
            "getTotalLength" in p && typeof p.getTotalLength === "function"
              ? p.getTotalLength()
              : 1200;
          const el = p as SVGElement;

          // Starting state
          el.style.strokeDasharray = String(len);
          el.style.strokeDashoffset = String(len);

          // Force reflow
          void el.getBoundingClientRect();

          // Animate
          el.style.transition = `stroke-dashoffset ${duration}s cubic-bezier(.22,.8,.2,1)`;
          requestAnimationFrame(() => {
            el.style.strokeDashoffset = "0";
          });
        } catch {}
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [svgMarkup, duration]);

  return (
    <div className={className} ref={containerRef}>
      {svgMarkup ? (
        <div
          className="w-full h-full [&_svg]:w-full [&_svg]:h-full"
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
      ) : (
        <img
          src="/assets/logo.png"
          alt="Lif3away logo"
          className="w-full h-full object-contain"
        />
      )}
    </div>
  );
});

/* ------------------------------------
 * Page 2 — Logo and brand name
 * ------------------------------------ */
function Page2({ reduced }: { reduced: boolean }) {
  // Page 2 is empty - the logo and text are rendered by LogoHUD
  return <div className="absolute inset-0" />;
}

/* ------------------------------------
 * Page 3 — Hero text + CTA
 * ------------------------------------ */
function Page3({ reduced }: { reduced: boolean }) {
  return (
    <div className="absolute inset-0 px-6 z-10">
      <div className="relative h-full flex items-center">
        <div className="w-full">
          {/* Centered content */}
          <div className="w-full max-w-6xl text-center mx-auto">
            <TitleParallax reduced={reduced}>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight mb-6">
                The founding team building the most powerful AI ever built to
                transform how humans live, rent, and move.
              </h2>
            </TitleParallax>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.3 }}
              className="text-base md:text-lg text-white/90 mb-4 max-w-4xl mx-auto"
            >
              We're building the world's most advanced AI agent for
              medium-to-long-term rentals, empowering people to move anywhere,
              live better, and rent with trust, speed, and clarity.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: 0.03, duration: 0.3 }}
              className="text-base md:text-lg text-white/90 mb-4 max-w-4xl mx-auto"
            >
              Why now? While platforms have made travel and short-term stays
              easier, the mid-to-long-term rental market remains broken: scams,
              delays, and outdated listings are still the norm. Human movement
              has evolved — but housing hasn't kept up.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: 0.06, duration: 0.3 }}
              className="text-base md:text-lg text-white/90 mb-8 max-w-4xl mx-auto"
            >
              At the same time, AI is reaching a new frontier. But no one is
              applying its true potential to real-world relocation. That's where
              Lif3away comes in. We're designing AI systems that do more than
              match listings.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.09, duration: 0.3 }}
              className="flex justify-center"
            >
              <CTA href="/waitlist">Join the waiting list</CTA>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------
 * Page 4 - Our Founder's Journey (intro)
 * ------------------------------------ */
function Page4({ reduced }: { reduced: boolean }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const headingY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [40, -40]
  );

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex items-center px-6 md:px-12 py-24 z-10"
    >
      <div className="w-full max-w-6xl mx-auto text-center space-y-8">
        <motion.h3
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} // Reduced from 0.8s
          className="text-2xl sm:text-3xl md:text-5xl font-semibold text-white"
        >
          Our Founder's Journey
        </motion.h3>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          transition={{ staggerChildren: 0.08 }} // Reduced from 0.15s
          className="text-xl sm:text-2xl space-y-6"
        >
          {[
            "Narrated by Isabella Milani, Interim Chief Brand Officer",
            "Not theoretical chaos — real chaos. Open suitcases. Languages you can't speak. Homes you can't find. Money disappearing before you ever feel settled.",
            "I watched Alessandro go through this. Over and over again. In Milan. London. Spain. The U.S. Always the same paradox: the more you move, the harder it gets.",
            "But one day, something changed.",
          ].map((text, i) => (
            <motion.p
              key={i}
              variants={{
                hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.5, ease: [0.22, 0.8, 0.2, 1] }} // Reduced from 0.8s
              className={`text-white/90 max-w-4xl mx-auto ${
                i === 0 ? "italic mb-6" : "leading-relaxed"
              }`}
            >
              {text}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------
 * Page 5 - Our Founder's Journey (London)
 * ------------------------------------ */
function Page5({ reduced }: { reduced: boolean }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const headingY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [40, -40]
  );

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex items-center px-6 md:px-12 py-24 z-10"
    >
      <div className="w-full max-w-6xl mx-auto text-center space-y-8">
        <motion.h3
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="text-2xl sm:text-3xl md:text-5xl font-semibold text-white"
        >
          Our Founder's Journey
        </motion.h3>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          transition={{ staggerChildren: 0.15 }}
          className="text-xl sm:text-2xl space-y-6"
        >
          {[
            "While he was working in London. A young Italian man walked in with two suitcases and a lost look. Just landed. No place to go. No shared language. He asked for help. No one understood — except Alessandro.",
            'He helped. But that moment sparked a deeper question: "What if there were a system that made moving not just possible — but intelligent?"',
          ].map((text, i) => (
            <motion.p
              key={i}
              variants={{
                hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.8, ease: [0.22, 0.8, 0.2, 1] }}
              className="text-white/90 max-w-4xl mx-auto leading-relaxed"
            >
              {text}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------
 * Page 6 - Our Founder's Journey (conclusion)
 * ------------------------------------ */
function Page6({ reduced }: { reduced: boolean }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const headingY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [40, -40]
  );

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex items-center px-6 md:px-12 py-24 z-10"
    >
      <div className="w-full max-w-6xl mx-auto text-center space-y-8">
        <motion.h3
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="text-2xl sm:text-3xl md:text-5xl font-semibold text-white"
        >
          Our Founder's Journey
        </motion.h3>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          transition={{ staggerChildren: 0.15 }}
          className="text-xl sm:text-2xl space-y-6"
        >
          {[
            "That's where Lif3away began.",
            "Not as a platform, but as an AI infrastructure built to connect people, properties, and cultures in real time. For movers. For hosts. For those building a future.",
            "For those, like us, who have lived it firsthand.",
          ].map((text, i) => (
            <motion.p
              key={i}
              variants={{
                hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.8, ease: [0.22, 0.8, 0.2, 1] }}
              className="text-white/90 max-w-4xl mx-auto leading-relaxed"
            >
              {text}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------
 * Video helper
 * ------------------------------------ */
function AutoplayVideo({ src, reduced }: { src: string; reduced: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref, inView } = useInView({
    threshold: 0.2,
    rootMargin: "0px 0px -10% 0px",
    triggerOnce: false,
  });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (inView) {
      v.playbackRate = reduced ? 1 : 2.5;
      try {
        if (v.currentTime < 0.05) v.currentTime = 0.05;
      } catch {}
      v.play().catch(() => {});
    } else {
      v.pause();
      v.playbackRate = 1;
    }

    // Cleanup on unmount
    return () => {
      if (v) {
        v.pause();
        v.playbackRate = 1;
      }
    };
  }, [inView, reduced]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 flex items-center justify-center"
    >
      <ErrorBoundary
        fallback={<div className="text-white">Video could not be loaded</div>}
      >
        <motion.video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="metadata"
          className="w-full h-full object-contain"
          initial={{ opacity: reduced ? 1 : 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: reduced ? 0 : 0.5 }}
          onError={() => console.error("Video failed to load:", src)}
        />
      </ErrorBoundary>
    </div>
  );
}

/* ------------------------------------
 * Page 7 - Video
 * ------------------------------------ */
function Page7({ reduced }: { reduced: boolean }) {
  return <AutoplayVideo src="/assets/page 7.mp4" reduced={reduced} />;
}

/* ------------------------------------
 * Page 8 - Core Team
 * ------------------------------------ */
function Page8({ reduced }: { reduced: boolean }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [0, -30]
  );
  const membersY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [0, -20]
  );
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [0, 100]
  );

  const members = [
    {
      name: "Alessandro Agratini",
      role: "Chief Executive Officer & Founder, entrepreneur bridging real estate and tech, building Lif3away as the AI first global rental platform",
      delay: 0.2,
    },
    {
      name: "Isabella Milani",
      role: "Interim Chief Brand Officer, from foundational partner to brand leader, Isabella translates Lif3away's mission into a story people can trust",
      delay: 0.3,
    },
    {
      name: "John Curtis",
      role: "Chief Financial Officer, CFO with 20+ years in SaaS, eCommerce and transportation; led $250M+ fundraising at Cargomatic and exits including Syniverse (IPO) and Stelera (sold to AT&T)",
      delay: 0.4,
    },
    {
      name: "Marty Marie Linne",
      role: "Fractional General Counsel, legal executive with leadership roles at Intel, StubHub, and Blueground, guiding multi-billion transactions and high-growth companies through scale and compliance",
      delay: 0.5,
    },
    {
      name: "Dianne Liu",
      role: "VP of Marketing with 20+ years in SaaS, eCommerce, and tech; drove $40M+ in marketing-sourced revenue at ZAGENO and 196% YoY pipeline growth at TechMD, scaling startups through full-funnel growth and GTM strategy",
      delay: 0.6,
    },
    {
      name: "Qingchen Wang",
      role: "Strategic AI/ML Advisor, AI founder with a Ph.D. and successful exit at Ophelos (acquired by Intrum); ex-Opendoor scientist, now advising Lif3away on AI and strategy",
      delay: 0.7,
    },
    {
      name: "Giles Lindsay",
      role: "Former CTO/CIO in fintech, travel, and SaaS, scaled tech teams to 400+, drove 300%+ delivery improvements, and named World 100 CIO/CTO 2024",
      delay: 0.8,
    },
    {
      name: "Mor Lakritz",
      role: "CFO with 19+ years in SaaS and cybersecurity, led $100M+ financings at SafeBreach, Exabeam, and Talkdesk, driving ARR growth and IPO readiness",
      delay: 0.9,
    },
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      <div className="h-full flex items-center px-6 md:px-16 lg:px-24 py-12">
        <div className="w-full max-w-7xl mx-auto text-center">
          <h4 className="text-3xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-12 text-white">
            Core team
          </h4>

          <motion.div style={{ y: contentY }} className="mb-16 space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="text-base sm:text-lg md:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed"
            >
              We are a global team of engineers, designers, real estate
              innovators, and AI thinkers, united by a shared belief: that
              finding a home should be intelligent, intuitive, and effortless.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-base sm:text-lg md:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed"
            >
              From United States to Europe, our backgrounds span startups, big
              tech, and real estate operations — but what brings us together is
              a relentless drive to solve one of the biggest challenges of
              modern life: moving and renting with trust, speed, and clarity.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-white/80 max-w-4xl mx-auto leading-relaxed"
            >
              At Lif3away, we don't just build technology, we build the system
              that will redefine how humans live, rent, and move across the
              world.
            </motion.p>
          </motion.div>

          <motion.div style={{ y: membersY }} className="space-y-10">
            {members.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.8, delay: member.delay }}
                className="group"
              >
                <h4 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
                  {member.name}
                </h4>
                <p className="text-base sm:text-lg md:text-xl text-white/70 leading-relaxed max-w-3xl mx-auto break-words">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(35,176,136,0.08) 0%, transparent 60%)",
            y: bgY,
          }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------
 * Page 9 - Join Us
 * ------------------------------------ */
function Page9({ reduced }: { reduced: boolean }) {
  return (
    <div className="absolute inset-0 px-6 md:px-12 py-16 flex items-center z-10">
      <div className="w-full max-w-6xl mx-auto text-center">
        <RevealIn reduced={reduced}>
          <h3 className="text-3xl md:text-4xl font-semibold mb-6">Join Us</h3>
        </RevealIn>
        <RevealIn reduced={reduced}>
          <p className="text-white/90 max-w-4xl mx-auto mb-8">
            We are a team of designers, engineers, AI builders, and global
            citizens working to make relocation frictionless not just in one
            city, but everywhere. Our mission is bold. Our ambition is global.
            And our work is just beginning.
          </p>
          <p className="text-white/90 max-w-4xl mx-auto mb-8">
            Lif3away is hiring. If you're passionate about AI, design,
            infrastructure, or global housing equity reach out.
          </p>
          <div className="flex justify-center">
            <CTA href="/careers">View open positions</CTA>
          </div>
        </RevealIn>
      </div>
    </div>
  );
}

/* ------------------------------------
 * Page 10 - Partner With Us
 * ------------------------------------ */
function Page10({ reduced }: { reduced: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="text-center px-6">
        <RevealIn reduced={reduced}>
          <h3 className="text-3xl md:text-4xl font-semibold mb-4">
            Partner With Us
          </h3>
          <p className="text-white/90 max-w-2xl">
            Lif3away is building a new standard in rentals, if you are
            interested in joining contact partnership@lif3away.com
          </p>
        </RevealIn>
      </div>
      <div className="absolute left-6 bottom-6 flex items-center gap-5">
        <a
          href="https://x.com/Lif3away"
          aria-label="Follow Lif3away on Twitter"
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-90 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#23B088] focus:ring-offset-2 focus:ring-offset-black rounded"
        >
          <FaXTwitter size={20} />
        </a>
        <a
          href="https://www.linkedin.com/company/lif3away-com"
          target="_blank"
          aria-label="Connect with Lif3away on LinkedIn"
          rel="noopener noreferrer"
          className="opacity-90 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#23B088] focus:ring-offset-2 focus:ring-offset-black rounded"
        >
          <FaLinkedinIn size={20} />
        </a>
        <a
          href="mailto:partnership@lif3away.com"
          aria-label="Email Lif3away at partnership@lif3away.com"
          className="opacity-90 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#23B088] focus:ring-offset-2 focus:ring-offset-black rounded"
        >
          <HiOutlineMail size={22} />
        </a>
        <a
          href="https://www.facebook.com/Lif3away/"
          target="_blank"
          aria-label="Like Lif3away on Facebook"
          rel="noopener noreferrer"
          className="opacity-90 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#23B088] focus:ring-offset-2 focus:ring-offset-black rounded"
        >
          <FaFacebook size={20} />
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------
 * DEV TESTS
 * ------------------------------------ */
function DevTests() {
  useEffect(() => {
    console.assert(
      TOTAL_PAGES === 10,
      `Expected TOTAL_PAGES to be 10, got ${TOTAL_PAGES}`
    );
    const secs = document.querySelectorAll("section");
    console.assert(
      secs.length === TOTAL_PAGES,
      `Expected ${TOTAL_PAGES} sections, found ${secs.length}`
    );
    fetch("/assets/drawline.svg", { method: "HEAD" })
      .then((r) => console.log("[Dev] drawline.svg HEAD:", r.status, r.ok))
      .catch(() => console.warn("[Dev] drawline.svg HEAD failed"));
    const hud = document.querySelector('[data-testid="logo-hud"]');
    console.assert(!!hud, "HUD not found");
  }, []);
  return null;
}
