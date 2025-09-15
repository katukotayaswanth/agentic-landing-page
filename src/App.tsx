import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaXTwitter, FaLinkedinIn, FaFacebook } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";
import "./index.css";
const TOTAL_PAGES = 12;
const SPACER_PX = 24;

export default function App() {
  return (
    <div className="w-full h-full bg-black text-white">
      <Landing />
    </div>
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
    mq.addEventListener ? mq.addEventListener("change", onChange) : mq.addListener(onChange);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", onChange) : mq.removeListener(onChange);
    };
  }, []);
  return reduced;
}

/* ------------------------------------ */
function Landing() {
  const [currentPage, setCurrentPage] = useState(1);
  const reduced = useReducedMotion();
  const onInView = (page: number, inView: boolean) => {
    if (inView) setCurrentPage(page);
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden bg-black text-white no-scrollbar"
      style={{ scrollBehavior: "smooth" }}
    >
      <AgenticGrid reduced={reduced} />
      <LogoHUD page={currentPage} reduced={reduced} />

      {/* Sections - Reordered for reduced-motion */}
      <Section pageNum={1} onInView={onInView}><Page1 reduced={reduced} /></Section>
      <PageSpacer />
      <Section pageNum={2} onInView={onInView}><Page2 reduced={reduced} /></Section>
      <PageSpacer />
      <Section pageNum={3} onInView={onInView}><Page3 reduced={reduced} /></Section>
      <PageSpacer />
      <Section pageNum={4} onInView={onInView}><Page4 reduced={reduced} /></Section>
      <PageSpacer />
      <Section pageNum={5} onInView={onInView}><Page5 reduced={reduced} /></Section>
      <PageSpacer />
      <Section pageNum={6} onInView={onInView}><Page6 reduced={reduced} /></Section>
      <PageSpacer />
      <Section pageNum={7} onInView={onInView}><Page7 reduced={reduced} /></Section>
      <PageSpacer />
      <Section pageNum={8} onInView={onInView}><Page8 reduced={reduced} /></Section>
      <PageSpacer />

      <Section pageNum={10} onInView={onInView}><Page10 reduced={reduced} /></Section>
      <PageSpacer />
      <Section pageNum={12} onInView={onInView}><Page12 reduced={reduced} /></Section>

      {(import.meta as any)?.env?.DEV ? <DevTests /> : null}
    </div>
  );
}

/* ------------------------------------ */
function Section({
  pageNum,
  onInView,
  children,
}: {
  pageNum: number;
  onInView: (p: number, v: boolean) => void;
  children: React.ReactNode;
}) {
  const { ref, inView } = useInView({ threshold: 0.6 });
  useEffect(() => onInView(pageNum, inView), [inView, onInView, pageNum]);
  return (
 <section ref={ref} className="relative w-full min-h-screen bg-black overflow-hidden snap-start">
  {children}
</section>
  );
}

function PageSpacer() {
  return <div style={{ height: SPACER_PX }} aria-hidden />;
}

/* ------------------------------------
 * Global chrome
 * ------------------------------------ */
function AgenticGrid({ reduced }: { reduced: boolean }) {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -120]);
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.14, 0.08]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        x, y, opacity,
        backgroundImage: `
          radial-gradient(800px 800px at 50% 55%, rgba(35,176,136,0.10), transparent 60%),
          repeating-linear-gradient(0deg, rgba(35,176,136,0.06) 0 1px, transparent 1px 64px),
          repeating-linear-gradient(90deg, rgba(35,176,136,0.05) 0 1px, transparent 1px 64px)
        `,
        mixBlendMode: "soft-light",
      }}
    />
  );
}

/* ------------------------------------
 * HUD choreography
 * - Page 1 & 2: minimal, logo top-left
 * - Brand morphs into top-center via layoutId="brand"
 * ------------------------------------ */
function LogoHUD({ page, reduced }: { page: number; reduced: boolean }) {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1, 0.98]);

  const variant = useMemo(() => {
    if (page === 1) return "p1";
    if (page === 2) return "p2";
    if (page === 3) return "p3";
    return "rest";
  }, [page]);

  const showChrome = variant === "p3" || variant === "rest";

  return (
    <div className="pointer-events-none fixed inset-0 z-50 select-none" data-testid="logo-hud">
      {showChrome && (
        <>
          <div className="absolute left-4 top-4">
            <img src="/assets/logo.png" alt="Lif3away" className="w-5 h-5" />
          </div>
          <div className="absolute right-6 top-6">
            <a href="#" className="pointer-events-auto text-white/80 hover:text-white text-sm tracking-wide">
              Log in
            </a>
          </div>
        </>
      )}

      <AnimatePresence initial={false}>
        {variant === "p3" && (
          <div className="absolute left-1/2 top-4 -translate-x-1/2">
            <motion.div
              key="hud-p3"
              style={{ scale }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: reduced ? 80 : 160, damping: reduced ? 20 : 18 }}
            >
              <motion.div layoutId="brand" className="pointer-events-none flex items-center gap-3 md:gap-4">
                <img src="/assets/logo.png" alt="Lif3away logo" className="w-[52px] h-[52px] md:w-[64px] md:h-[64px]" />
                <span className="text-[28px] md:text-[36px] font-light tracking-tight">Lif3away</span>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------
 * Shared
 * ------------------------------------ */
function CTA({ children, href = "#" }: { children: React.ReactNode; href?: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-lg border border-[#23B088] px-5 py-3 text-white hover:bg-white/5 transition-colors"
    >
      {children}
    </a>
  );
}

function TitleParallax({ children, reduced }: { children: React.ReactNode; reduced: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 20%"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [24, -12]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div ref={ref} style={{ y, opacity }}>
      {children}
    </motion.div>
  );
}

// Stable, cross-browser reveal (no clipPath). Keeps layout intact.
function RevealIn({ children, reduced }: { children: React.ReactNode; reduced: boolean }) {
  return (
    <motion.div
      initial={{ y: reduced ? 0 : 24, opacity: 0, filter: reduced ? "none" : "blur(6px)" }}
      whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: reduced ? 0.25 : 0.6, ease: [0.22, 0.8, 0.2, 1] }}
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
    <div ref={ref} className="absolute inset-0 flex items-center justify-center">
      <div className="relative flex flex-col items-center gap-6">
        <DrawnLogo key={drawKey} className="w-[260px] h-[260px]" duration={reduced ? 0 : 1.8} />
      </div>
    </div>
  );
}

function DrawnLogo({ className, duration = 2.0 }: { className?: string; duration?: number }) {
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/assets/drawline.svg", { cache: "no-store" });
        const txt = await r.text();
        if (r.ok && txt.includes("<svg")) setSvgMarkup(txt);
        else setSvgMarkup(null);
      } catch {
        setSvgMarkup(null);
      }
    })();
  }, []);

  useEffect(() => {
    if (!svgMarkup || !containerRef.current) return;

    const raf = requestAnimationFrame(() => {
      const svg = containerRef.current!.querySelector("svg");
      if (!svg) return;

      // Normalize stroke so we always get an outline animation
      svg.querySelectorAll<SVGGraphicsElement>("*").forEach((n) => {
        n.setAttribute("fill", "none");
        n.setAttribute("stroke", "#23B088");
        n.setAttribute("stroke-width", "6");
        n.setAttribute("stroke-linecap", "round");
        n.setAttribute("stroke-linejoin", "round");
        n.setAttribute("vector-effect", "non-scaling-stroke");
      });

      const targets = svg.querySelectorAll<SVGGeometryElement>("path,polyline,polygon,line,circle,rect");
      targets.forEach((p) => {
        try {
          const len =
            typeof (p as any).getTotalLength === "function" ? (p as any).getTotalLength() : 1200;
          const el = p as unknown as SVGElement;

          // Starting state
          el.style.strokeDasharray = String(len);
          el.style.strokeDashoffset = String(len);

          // Force reflow so transition reliably triggers (StrictMode double-mount safe)
          void el.getBoundingClientRect();

          // Animate to drawn state
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
        <img src="/assets/logo.png" alt="Lif3away logo" className="w-full h-full object-contain" />
      )}
    </div>
  );
}

/* ------------------------------------
 * Page 2 — Updated spacing between logo and text
 * ------------------------------------ */
function Page2({ reduced }: { reduced: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        layoutId="brand"
        initial={{ opacity: 0, y: reduced ? 0 : 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 0.8, 0.2, 1] }}
        className="flex items-center leading-none gap-4 md:gap-6"
      >
        <img src="/assets/logo.png" alt="Lif3away logo" className="w-40 h-40 md:w-72 md:h-72" />
        <h1
          className="text-[14vw] md:text-[8vw] font-light tracking-tight"
          style={{ fontFamily: "system-ui, -apple-system, Helvetica, Arial" }}
        >
          Lif3away
        </h1>
      </motion.div>
    </div>
  );
}

/* ------------------------------------
 * Page 3 — Hero text + CTA
 * ------------------------------------ */
function Page3({ reduced }: { reduced: boolean }) {
  return (
    <div className="absolute inset-0 px-6 z-10">
      <div className="relative h-full">
        <div className="sticky top-24 flex items-start justify-center">
          <div className="w-full max-w-6xl text-center mx-auto">
            <TitleParallax reduced={reduced}>
              <h2 className="sm:text-2xl text-3xl md:text-5xl font-extrabold leading-tight mb-6">
               Founding team the most powerful AI ever built to transform how humans live, rent, and move.
              </h2>
            </TitleParallax>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.45 }}
              className="text-base md:text-lg text-white/90 mb-4 max-w-4xl mx-auto"
            >
              We're building the world's most advanced AI agent for medium-to-long-term rentals, empowering
              people to move anywhere, live better, and rent with trust, speed, and clarity.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: 0.06, duration: 0.45 }}
              className="text-base md:text-lg text-white/90 mb-4 max-w-4xl mx-auto"
            >
              Why now? While platforms have made travel and short-term stays easier, the mid-to-long-term
              rental market remains broken: scams, delays, and outdated listings are still the norm. Human
              movement has evolved — but housing hasn't kept up.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: 0.12, duration: 0.45 }}
              className="text-base md:text-lg text-white/90 mb-8 max-w-4xl mx-auto"
            >
              At the same time, AI is reaching a new frontier. But no one is applying its true potential to
              real-world relocation. That's where Lif3away comes in. We're designing AI systems that do more
              than match listings.
            </motion.p>
            <CTA>Join the waiting list</CTA>
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
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });

  const headingY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [40, -40]);

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center px-6 md:px-12 py-24 z-10">
      <div className="w-full max-w-6xl space-y-8">
        <motion.h3
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="sm:text-2xl text-3xl md:text-5xl font-semibold text-white"
        >
          Our Founder's Journey
        </motion.h3>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          transition={{ staggerChildren: 0.15 }}
          className="sm:text-xl text-2xl   space-y-6"
        >
          {[
            "Narrated by Isabella Milani, Interim Chief Brand Officer",
            "Not theoretical chaos — real chaos. Open suitcases. Languages you can't speak. Homes you can't find. Money disappearing before you ever feel settled.",
            "I watched Alessandro go through this. Over and over again. In Milan. London. Spain. The U.S. Always the same paradox: the more you move, the harder it gets.",
            "But one day, something changed."
          ].map((text, i) => (
            <motion.p
              key={i}
              variants={{
                hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)" }
              }}
              transition={{ duration: 0.8, ease: [0.22, 0.8, 0.2, 1] }}
              className={`text-white/90 max-w-4xl ${i === 0 ? "italic mb-6" : "leading-relaxed"}`}
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
 * Page 5 - Our Founder's Journey (London story)
 * ------------------------------------ */
function Page5({ reduced }: { reduced: boolean }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const headingY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [40, -40]);

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center px-6 md:px-12 py-24 z-10">
      <div className="w-full max-w-6xl space-y-8">
        <motion.h3
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="sm:text-2xl text-3xl md:text-5xl font-semibold text-white"
        >
          Our Founder's Journey
        </motion.h3>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          transition={{ staggerChildren: 0.15 }}
          className="sm:text-xl text-2xl   space-y-6"
        >
          {[
            "While he was working in London. A young Italian man walked in with two suitcases and a lost look. Just landed. No place to go. No shared language. He asked for help. No one understood — except Alessandro.",
            "He helped. But that moment sparked a deeper question: \"What if there were a system that made moving not just possible — but intelligent?\""
          ].map((text, i) => (
            <motion.p
              key={i}
              variants={{
                hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)" }
              }}
              transition={{ duration: 0.8, ease: [0.22, 0.8, 0.2, 1] }}
              className="text-white/90 max-w-4xl leading-relaxed"
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
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const headingY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [40, -40]);

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center px-6 md:px-12 py-24 z-10">
      <div className="w-full max-w-6xl space-y-8">
        <motion.h3
          style={{ y: headingY }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="sm:text-2xl text-3xl md:text-5xl font-semibold text-white"
        >
          Our Founder's Journey
        </motion.h3>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.4 }}
          transition={{ staggerChildren: 0.15 }}
          className="sm:text-xl text-2xl   space-y-6"
        >
          {[
            "That's where Lif3away began.",
            "Not as a platform, but as an AI infrastructure built to connect people, properties, and cultures in real time. For movers. For hosts. For those building a future.",
            "For those, like us, who have lived it firsthand."
          ].map((text, i) => (
            <motion.p
              key={i}
              variants={{
                hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)" }
              }}
              transition={{ duration: 0.8, ease: [0.22, 0.8, 0.2, 1] }}
              className="text-white/90 max-w-4xl leading-relaxed"
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
 * Video helper — autoplay when visible, fast while on screen
 * ------------------------------------ */
function AutoplayVideo({ src, reduced }: { src: string; reduced: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { ref, inView } = useInView({ threshold: 0.2, rootMargin: "0px 0px -10% 0px", triggerOnce: false });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) {
      v.playbackRate = reduced ? 1 : 2.5;
      try { if (v.currentTime < 0.05) v.currentTime = 0.05; } catch {}
      v.play().catch(() => {});
    } else {
      v.pause();
      v.playbackRate = 1;
    }
  }, [inView, reduced]);

  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center">
      <motion.video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-contain"
        initial={{ opacity: reduced ? 1 : 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: reduced ? 0 : 0.5 }}
      />
    </div>
  );
}

/* ------------------------------------
 * Page 7 - Video/Image (bed)
 * ------------------------------------ */
function Page7({ reduced }: { reduced: boolean }) { 
  return <AutoplayVideo src="/assets/page 7.mp4" reduced={reduced} />; 
}

/* ------------------------------------
 * Page 8 - Core Team (people)
 * ------------------------------------ */
function Page8({ reduced }: { reduced: boolean }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });

  const contentY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -30]);
  const membersY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -20]);
  const bgY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 100]);

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
      name: "Qingchen Wang",
      role: "Strategic AI/ML Advisor, AI founder with a Ph.D. and successful exit at Ophelos (acquired by Intrum); ex-Opendoor scientist, now advising Lif3away on AI and strategy",
      delay: 0.6,
    },
    {
      name: "Giles Lindsay",
      role: "Former CTO/CIO in fintech, travel, and SaaS, scaled tech teams to 400+, drove 300%+ delivery improvements, and named World 100 CIO/CTO 2024",
      delay: 0.7,
    },
    {
      name: "Mor Lakritz",
      role: "CFO with 19+ years in SaaS and cybersecurity, led $100M+ financings at SafeBreach, Exabeam, and Talkdesk, driving ARR growth and IPO readiness",
      delay: 0.8,
    },
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      <div className="h-full flex items-center px-6 md:px-16 lg:px-24 py-12">
        <div className="w-full max-w-7xl mx-auto">
          {/* Title */}
          <h4 className="sm:text-2xl text-3xl lg:text-4xl font-bold tracking-tight mb-12 text-white">
            Core team
          </h4>

          {/* Intro text */}
          <motion.div style={{ y: contentY }} className="mb-16 space-y-6">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="sm:text-base text-lg md:text-xl text-white/80 max-w-4xl leading-relaxed"
            >
              We are a global team of engineers, designers, real estate innovators, and AI thinkers,
              united by a shared belief: that finding a home should be intelligent, intuitive, and effortless.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="sm:text-base text-lg md:text-xl text-white/80 max-w-4xl leading-relaxed"
            >
              From United States to Europe, our backgrounds span startups, big tech, and real estate
              operations — but what brings us together is a relentless drive to solve one of the biggest
              challenges of modern life: moving and renting with trust, speed, and clarity.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="sm:text-base text-lg md:text-xl text-white/80 max-w-4xl leading-relaxed"
            >
              At Lif3away, we don’t just build technology, we build the system that will redefine
              how humans live, rent, and move across the world.
            </motion.p>
          </motion.div>

          {/* Members */}
          <motion.div style={{ y: membersY }} className="space-y-10">
            {members.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.8, delay: member.delay }}
                className="group"
              >
                <h4 className="sm:text-lg text-xl md:text-2xl font-semibold mb-2 transition-transform duration-300 group-hover:translate-x-2">
                  {member.name}
                </h4>
                <p className="sm:text-base text-lg md:text-xl text-white/70 leading-relaxed max-w-3xl md:pl-4 break-words transition-colors duration-300 group-hover:text-white/90">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Background parallax */}
        <motion.div
          className="absolute inset-0 -z-10"
          style={{
            background: "radial-gradient(ellipse at center, rgba(35,176,136,0.08) 0%, transparent 60%)",
            y: bgY,
          }}
        />
      </div>
    </div>
  );
}


/* ------------------------------------
 * Page 10 - Join Us
 * ------------------------------------ */
function Page10({ reduced }: { reduced: boolean }) {
  return (
    <div className="absolute inset-0 px-6 md:px-12 py-16 flex items-center z-10">
      <div className="w-full max-w-6xl">
        <RevealIn reduced={reduced}><h3 className="text-3xl md:text-4xl font-semibold mb-6">Join Us</h3></RevealIn>
        <RevealIn reduced={reduced}>
          <p className="text-white/90 max-w-4xl mb-8">We are a team of designers, engineers, AI builders, and global citizens working to make relocation frictionless — not just in one city, but everywhere. Our mission is bold. Our ambition is global. And our work is just beginning.</p>
          <p className="text-white/90 max-w-4xl mb-8">Lif3away is hiring. If you're passionate about AI, design, infrastructure, or global housing equity — reach out.</p>
          <CTA>View open positions</CTA>
        </RevealIn>
      </div>
    </div>
  );
}


/* ------------------------------------
 * Page 12 - Partner With Us
 * ------------------------------------ */
function Page12({ reduced }: { reduced: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="text-center px-6">
        <RevealIn reduced={reduced}>
          <h3 className="text-3xl md:text-4xl font-semibold mb-4">Partner With Us</h3>
          <p className="text-white/90 max-w-2xl">We're open to unexpected conversations — the kind that move the needle. partnership@lif3away.com</p>
        </RevealIn>
      </div>
      <div className="absolute left-6 bottom-6 flex items-center gap-5">
        <a href="https://x.com/Lif3away" aria-label="Twitter" target="_blank" className="opacity-90 hover:opacity-100"><FaXTwitter size={20} /></a>
        <a href="https://www.linkedin.com/company/lif3away-com" target="_blank" aria-label="LinkedIn" className="opacity-90 hover:opacity-100"><FaLinkedinIn size={20} /></a>
        <a href="mailto:partnership@lif3away.com" aria-label="Email" className="opacity-90 hover:opacity-100"><HiOutlineMail size={22} /></a>
        <a href="https://www.facebook.com/Lif3away/" target="_blank" aria-label="Facebook" className="opacity-90 hover:opacity-100"><FaFacebook size={20} /></a>
      </div>
    </div>
  );
}

/* ------------------------------------
 * DEV TESTS
 * ------------------------------------ */
function DevTests() {
  useEffect(() => {
    console.assert(TOTAL_PAGES === 12, `Expected TOTAL_PAGES to be 12, got ${TOTAL_PAGES}`);
    const secs = document.querySelectorAll("section");
    console.assert(secs.length === 12, `Expected 12 sections, found ${secs.length}`);
    fetch("/assets/drawline.svg", { method: "HEAD" })
      .then(r => console.log("[Dev] drawline.svg HEAD:", r.status, r.ok))
      .catch(() => console.warn("[Dev] drawline.svg HEAD failed"));
    const hud = document.querySelector('[data-testid="logo-hud"]') || document.body;
    console.assert(!!hud, "HUD not found");
  }, []);
  return null;
}