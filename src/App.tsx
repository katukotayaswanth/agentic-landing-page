
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

      {/* Sections */}
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
      <Section pageNum={9} onInView={onInView}><Page9 reduced={reduced} /></Section>
      <PageSpacer />
      <Section pageNum={10} onInView={onInView}><Page10 reduced={reduced} /></Section>
      <PageSpacer />
      <Section pageNum={11} onInView={onInView}><Page11 reduced={reduced} /></Section>
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
    <section ref={ref} className="relative w-full h-screen bg-black overflow-hidden snap-start">
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
 * - Start small chrome from Page 3 onward
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
 * Page 2 — keep your layout (you can keep your tighter gap version here)
 * ------------------------------------ */
function Page2({ reduced }: { reduced: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        layoutId="brand"
        initial={{ opacity: 0, y: reduced ? 0 : 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 0.8, 0.2, 1] }}
        className="flex items-center leading-none gap-1"
      >
        <img src="/assets/logo.png" alt="Lif3away logo" className="w-[280px] h-[280px] md:w-[280px]  md:h-[280px]" />
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
 * Page 3 — Hero
 * ------------------------------------ */
function Page3({ reduced }: { reduced: boolean }) {
  return (
    <div className="absolute inset-0 px-6 z-10">
      <div className="relative h-full">
        <div className="sticky top-24 flex items-start justify-center">
          <div className="w-full max-w-6xl text-center mx-auto">
            <TitleParallax reduced={reduced}>
              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
                The most powerful AI ever built to transform how humans live, rent, and move.
              </h2>
            </TitleParallax>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.45 }}
              className="text-base md:text-lg text-white/90 mb-4 max-w-4xl mx-auto"
            >
              We’re building the world’s most advanced AI agent for medium-to-long-term rentals, empowering
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
              movement has evolved, but housing hasn’t kept up.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: 0.12, duration: 0.45 }}
              className="text-base md:text-lg text-white/90 mb-8 max-w-4xl mx-auto"
            >
              At the same time, AI is reaching a new frontier. But no one is applying its true potential to
              real-world relocation. That’s where Lif3away comes in. We’re designing AI systems that do more
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
 * Page 4 - Funding team
 * ------------------------------------ */
function Page4({ reduced }: { reduced: boolean }) {
  return (
    <div className="absolute inset-0 px-6 md:px-12 py-16 flex items-center z-10">
      <div className="w-full max-w-6xl">
        <RevealIn reduced={reduced}><h3 className="text-3xl md:text-4xl font-semibold mb-6">Funding team</h3></RevealIn>
        <RevealIn reduced={reduced}>
          <p className="text-white/90 max-w-4xl mb-8">We are a global team of engineers, designers, real estate innovators, and AI thinkers, united by a shared belief: that finding a home should be intelligent, intuitive, and effortless.</p>
          <p className="text-white/90 max-w-4xl mb-8">From Silicon Valley to Europe, our backgrounds span startups, big tech, and real estate operations, but what brings us together is a relentless drive to solve one of the biggest challenges of modern life: moving and renting with trust, speed, and clarity.</p>
          <p className="text-white/90 max-w-4xl mb-8">At Lif3away, we don’t just build technology, we build the system that will redefine how humans live, rent, and move across the world.</p>
        </RevealIn>
        <RevealIn reduced={reduced}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-white">
            <ul className="space-y-3 text-white/95">
              <li><strong>Alessandro Agratini</strong></li>
              <li>Chief Technology Officer</li>
              <li>Mor Lakritz</li>
              <li>Isabella Milani</li>
              <li>Giles Lindsay</li>
              <li>VP of Marketing &amp; Brand</li>
              <li>General Counsel</li>
            </ul>
            <ul className="space-y-3 text-white/95">
              <li>Cynthia Corsi</li>
              <li>Jacopo Primo</li>
              <li>Yaswanth Katukota</li>
              <li>Jayanth Srihaas</li>
              <li>AI Engineer</li>
              <li>Front-end Engineer</li>
              <li>Visual Designer</li>
            </ul>
          </div>
        </RevealIn>
      </div>
    </div>
  );
}

/* ------------------------------------
 * Page 5 - Join Us
 * ------------------------------------ */
function Page5({ reduced }: { reduced: boolean }) {
  return (
    <div className="absolute inset-0 px-6 md:px-12 py-16 flex items-center z-10">
      <div className="w-full max-w-6xl">
        <RevealIn reduced={reduced}><h3 className="text-3xl md:text-4xl font-semibold mb-6">Join Us</h3></RevealIn>
        <RevealIn reduced={reduced}>
          <p className="text-white/90 max-w-4xl mb-8">We are a team of designers, engineers, AI builders, and global citizens working to make relocation frictionless—not just in one city, but everywhere. Our mission is bold. Our ambition is global. And our work is just beginning.</p>
          <p className="text-white/90 max-w-4xl mb-8">Lif3away is hiring. If you’re passionate about AI, design, infrastructure, or global housing equity, reach out.</p>
          <CTA>View open positions</CTA>
        </RevealIn>
      </div>
    </div>
  );
}

/* ------------------------------------
 * Page 6 - Our Founder’s Journey (intro)
 * ------------------------------------ */
function Page6({ reduced }: { reduced: boolean }) {
  return (
    <div className="absolute inset-0 px-6 md:px-12 py-16 flex items-center z-10">
      <div className="w-full max-w-6xl">
        <RevealIn reduced={reduced}><h3 className="text-3xl md:text-4xl font-semibold mb-6">Our Founder’s Journey</h3></RevealIn>
        <RevealIn reduced={reduced}>
          <p className="italic text-white/90 mb-6">Narrated by Isabella Milani, Interim Chief Brand Officer</p>
          <p className="text-white/90 max-w-4xl mb-4">Not theoretical chaos, real chaos. Open suitcases. Languages you can’t speak. Homes you can’t find. Money disappearing before you ever feel settled.</p>
          <p className="text-white/90 max-w-4xl mb-4">I watched Alessandro go through this. Over and over again. In Milan. London. Spain. The U.S. Always the same paradox: the more you move, the harder it gets.</p>
          <p className="text-white/90 max-w-4xl">But one day, something changed.</p>
        </RevealIn>
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

/* ------------------------------------ */
function Page7({ reduced }: { reduced: boolean }) { return <AutoplayVideo src="/assets/page 7.mp4" reduced={reduced} />; }

/* ------------------------------------ */
function Page8({ reduced }: { reduced: boolean }) {
  return (
    <div className="absolute inset-0 px-6 md:px-12 py-16 flex items-center z-10">
      <div className="w-full max-w-6xl">
        <RevealIn reduced={reduced}><h3 className="text-3xl md:text-4xl font-semibold mb-6">Our Founder’s Journey</h3></RevealIn>
        <RevealIn reduced={reduced}>
          <p className="text-white/90 max-w-4xl mb-4">While he was working in London. A young Italian man walked in with two suitcases and a lost look. Just landed. No place to go. No shared language. He asked for help. No one understood, except Alessandro.</p>
          <p className="text-white/90 max-w-4xl mb-4">He helped. But that moment sparked a deeper question: <strong>“What if there were a system that made moving not just possible, but intelligent?”</strong></p>
        </RevealIn>
      </div>
    </div>
  );
}

/* ------------------------------------ */
function Page9({ reduced }: { reduced: boolean }) {
  return (
    <div className="absolute inset-0"><AutoplayVideo src="/assets/page 9.mp4" reduced={reduced} /></div>
  );
}

/* ------------------------------------ */
function Page10({ reduced }: { reduced: boolean }) {
  return (
    <div className="absolute inset-0 px-6 md:px-12 py-16 flex items-center z-10">
      <div className="w-full max-w-6xl">
        <RevealIn reduced={reduced}><h3 className="text-3xl md:text-4xl font-semibold mb-6">Our Founder’s Journey</h3></RevealIn>
        <RevealIn reduced={reduced}>
          <p className="text-white/90 max-w-4xl mb-4">That’s where Lif3away began. Not as a platform, but as an AI infrastructure built to connect people, properties, and cultures in real time. For movers. For hosts. For those building a future.</p>
          <p className="text-white/90 max-w-4xl">For those, like us, who have lived it firsthand.</p>
        </RevealIn>
      </div>
    </div>
  );
}

/* ------------------------------------ */
function Page11({ reduced }: { reduced: boolean }) { return <AutoplayVideo src="/assets/page 11.mp4" reduced={reduced} />; }

/* ------------------------------------ */
function Page12({ reduced }: { reduced: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="text-center px-6">
        <RevealIn reduced={reduced}>
          <h3 className="text-3xl md:text-4xl font-semibold mb-4">Partner With Us</h3>
          <p className="text-white/90 max-w-2xl"> We're open to unexpected conversations,the kind that move the needle. partnership@lif3away.com</p>
        </RevealIn>
      </div>
      <div className="absolute left-6 bottom-6 flex items-center gap-5">
        <a href="https://x.com/Lif3away" aria-label="Twitter" target="_blank" className="opacity-90 hover:opacity-100"><FaXTwitter size={20} /></a>
        <a href="https://www.linkedin.com/company/lif3away-com" target="_blank" aria-label="LinkedIn" className="opacity-90 hover:opacity-100"><FaLinkedinIn size={20} /></a>
        <a href="#" aria-label="Email" target="_blank" className="opacity-90 hover:opacity-100"><HiOutlineMail size={22} /></a>
        <a href="https://www.facebook.com/Lif3away/" target="_blank" aria-label="facebook" className="opacity-90 hover:opacity-100"><FaFacebook size={20} /></a>
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
