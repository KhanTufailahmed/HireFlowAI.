import { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import MagneticButton from "../components/MagneticButton";
import ProximityCard from "../components/ProximityCard";
import {
  FileText,
  Cpu,
  CheckCircle2,
  Users,
  Calendar,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  BrainCircuit,
  Sliders,
  Award,
} from "lucide-react";

const Landing = () => {
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);
  const pipelineRef = useRef(null);
  const cursorGlowRef = useRef(null);

  useEffect(() => {
    const isPointerFine = window.matchMedia("(pointer: fine)").matches;
    if (!isPointerFine) return;

    const targetMouse = { x: 0, y: 0 };
    const currentMouse = { x: 0, y: 0 };

    const targetPointer = { x: -100, y: -100 };
    const currentPointer = { x: -100, y: -100 };

    let isVisible = false;
    let rafId = null;

    const handleMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;

      targetMouse.x = nx;
      targetMouse.y = ny;

      targetPointer.x = e.clientX;
      targetPointer.y = e.clientY;

      if (!isVisible && cursorGlowRef.current) {
        isVisible = true;
        cursorGlowRef.current.style.opacity = "1";
      }
    };

    const handleMouseLeave = () => {
      targetMouse.x = 0;
      targetMouse.y = 0;

      if (cursorGlowRef.current) {
        isVisible = false;
        cursorGlowRef.current.style.opacity = "0";
      }
    };

    const tick = () => {
      currentMouse.x += (targetMouse.x - currentMouse.x) * 0.08;
      currentMouse.y += (targetMouse.y - currentMouse.y) * 0.08;

      currentPointer.x += (targetPointer.x - currentPointer.x) * 0.16;
      currentPointer.y += (targetPointer.y - currentPointer.y) * 0.16;

      if (orb1Ref.current) {
        const x = (currentMouse.x * 10).toFixed(2);
        const y = (currentMouse.y * 10).toFixed(2);
        orb1Ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      if (orb2Ref.current) {
        const x = (-currentMouse.x * 18).toFixed(2);
        const y = (-currentMouse.y * 18).toFixed(2);
        orb2Ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      if (orb3Ref.current) {
        const x = (currentMouse.x * 24).toFixed(2);
        const y = (currentMouse.y * 24).toFixed(2);
        orb3Ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      if (pipelineRef.current) {
        const cx = (currentMouse.x * 12).toFixed(2);
        const cy = (currentMouse.y * 9).toFixed(2);
        pipelineRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;

        const cardX = (currentMouse.x * 5).toFixed(2);
        const cardY = (currentMouse.y * 4).toFixed(2);
        const arrowX = (currentMouse.x * 8).toFixed(2);
        const arrowY = (currentMouse.y * 6).toFixed(2);

        pipelineRef.current.style.setProperty("--pipeline-card-x", `${cardX}px`);
        pipelineRef.current.style.setProperty("--pipeline-card-y", `${cardY}px`);
        pipelineRef.current.style.setProperty("--pipeline-arrow-x", `${arrowX}px`);
        pipelineRef.current.style.setProperty("--pipeline-arrow-y", `${arrowY}px`);
      }

      if (cursorGlowRef.current) {
        const gx = (currentPointer.x - 14).toFixed(1);
        const gy = (currentPointer.y - 14).toFixed(1);
        cursorGlowRef.current.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const elements = document.querySelectorAll(".reveal-section");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      <div
        ref={cursorGlowRef}
        className="fixed top-0 left-0 w-7 h-7 rounded-full bg-indigo-500/15 blur-sm pointer-events-none z-50 opacity-0 transition-opacity duration-300 hidden md:block"
        style={{ willChange: "transform, opacity" }}
        aria-hidden="true"
      />

      <Navbar />

      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200/80 bg-gradient-to-b from-white to-slate-50">
        <div
          ref={orb1Ref}
          className="absolute -top-20 -left-20 pointer-events-none -z-0 will-change-transform"
          aria-hidden="true"
        >
          <div className="w-96 h-96 rounded-full bg-indigo-400/12 blur-3xl animate-ambient-1" />
        </div>

        <div
          ref={orb2Ref}
          className="absolute top-1/4 -right-24 pointer-events-none -z-0 will-change-transform"
          aria-hidden="true"
        >
          <div className="w-96 h-96 rounded-full bg-purple-400/12 blur-3xl animate-ambient-2" />
        </div>

        <div
          ref={orb3Ref}
          className="absolute -bottom-16 left-1/3 pointer-events-none -z-0 will-change-transform"
          aria-hidden="true"
        >
          <div className="w-80 h-80 rounded-full bg-indigo-300/10 blur-3xl animate-ambient-1" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6 animate-hero-badge">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Next-Gen Hiring Architecture
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight animate-hero-title">
            Smarter Hiring. <span className="text-indigo-600">Better Candidates.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-hero-desc">
            HireFlow AI combines automated resume screening and dynamic technical assessments
            to deliver verified candidate signals—while keeping final hiring decisions firmly in recruiter hands.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-hero-cta">
            <MagneticButton
              to="/register"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold text-base hover:bg-indigo-700 shadow-md shadow-indigo-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 btn-aura-primary"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
            <MagneticButton
              to="/login"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white border border-slate-200/80 text-slate-700 font-semibold text-base hover:bg-slate-50 hover:border-slate-300 shadow-xs transition-colors btn-aura-secondary"
            >
              Sign In to Portal
            </MagneticButton>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 text-xs text-slate-400 font-medium animate-hero-trust">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Zero Hallucinations
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-500" /> Real-Time Scoring
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-500" /> Recruiter Governed
            </span>
          </div>
        </div>

        <div id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 reveal-section">
          <div
            ref={pipelineRef}
            className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm will-change-transform"
          >
            <h3 className="text-xs font-bold text-center uppercase tracking-widest text-slate-400 mb-8">
              End-to-End Autonomous Pipeline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative items-center">
              <div
                className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 text-center flex flex-col items-center stagger-item card-aura-lift"
                style={{ transitionDelay: "0ms" }}
              >
                <div
                  className="w-full flex flex-col items-center will-change-transform"
                  style={{
                    transform:
                      "translate3d(var(--pipeline-card-x, 0px), var(--pipeline-card-y, 0px), 0)",
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">Resume</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Secure PDF ingestion</p>
                </div>
              </div>

              <div
                className="hidden sm:flex justify-center text-indigo-400 font-bold pipeline-arrow"
                style={{ transitionDelay: "180ms" }}
              >
                <span
                  className="inline-block will-change-transform"
                  style={{
                    transform:
                      "translate3d(var(--pipeline-arrow-x, 0px), var(--pipeline-arrow-y, 0px), 0)",
                  }}
                >
                  →
                </span>
              </div>

              <div
                className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 text-center flex flex-col items-center stagger-item card-aura-lift"
                style={{ transitionDelay: "100ms" }}
              >
                <div
                  className="w-full flex flex-col items-center will-change-transform"
                  style={{
                    transform:
                      "translate3d(var(--pipeline-card-x, 0px), var(--pipeline-card-y, 0px), 0)",
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">AI Screening</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Skills vector match</p>
                </div>
              </div>

              <div
                className="hidden sm:flex justify-center text-indigo-400 font-bold pipeline-arrow"
                style={{ transitionDelay: "280ms" }}
              >
                <span
                  className="inline-block will-change-transform"
                  style={{
                    transform:
                      "translate3d(var(--pipeline-arrow-x, 0px), var(--pipeline-arrow-y, 0px), 0)",
                  }}
                >
                  →
                </span>
              </div>

              <div
                className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 text-center flex flex-col items-center stagger-item card-aura-lift"
                style={{ transitionDelay: "200ms" }}
              >
                <div
                  className="w-full flex flex-col items-center will-change-transform"
                  style={{
                    transform:
                      "translate3d(var(--pipeline-card-x, 0px), var(--pipeline-card-y, 0px), 0)",
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">Assessment</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">5 tailored queries</p>
                </div>
              </div>

              <div
                className="hidden sm:flex justify-center text-indigo-400 font-bold pipeline-arrow"
                style={{ transitionDelay: "380ms" }}
              >
                <span
                  className="inline-block will-change-transform"
                  style={{
                    transform:
                      "translate3d(var(--pipeline-arrow-x, 0px), var(--pipeline-arrow-y, 0px), 0)",
                  }}
                >
                  →
                </span>
              </div>

              <div
                className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 text-center flex flex-col items-center stagger-item card-aura-lift"
                style={{ transitionDelay: "300ms" }}
              >
                <div
                  className="w-full flex flex-col items-center will-change-transform"
                  style={{
                    transform:
                      "translate3d(var(--pipeline-card-x, 0px), var(--pipeline-card-y, 0px), 0)",
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">Recruiter Review</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Human decision cockpit</p>
                </div>
              </div>

              <div
                className="hidden sm:flex justify-center text-indigo-400 font-bold pipeline-arrow"
                style={{ transitionDelay: "480ms" }}
              >
                <span
                  className="inline-block will-change-transform"
                  style={{
                    transform:
                      "translate3d(var(--pipeline-arrow-x, 0px), var(--pipeline-arrow-y, 0px), 0)",
                  }}
                >
                  →
                </span>
              </div>

              <div
                className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 text-center flex flex-col items-center stagger-item card-aura-lift"
                style={{ transitionDelay: "400ms" }}
              >
                <div
                  className="w-full flex flex-col items-center will-change-transform"
                  style={{
                    transform:
                      "translate3d(var(--pipeline-card-x, 0px), var(--pipeline-card-y, 0px), 0)",
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">Interview</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Auto-scheduled</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white reveal-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Intelligent Capability
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Precision AI that respects engineering nuance
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base">
              Say goodbye to blunt keyword-matching. HireFlow AI extracts deep technical evidence,
              tailors scenario assessments, and delivers quantifiable proof of ability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProximityCard
              className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-8 hover:border-indigo-200 transition-colors stagger-item card-aura-lift group cursor-default"
              style={{ transitionDelay: "0ms" }}
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-xs icon-aura-hover proximity-icon">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                AI Resume Screening
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Gemini parses text layers, projects, education, and years of experience against your configured job requirements, scoring candidate qualifications from 0 to 100 with zero hallucination.
              </p>
            </ProximityCard>

            <ProximityCard
              className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-8 hover:border-indigo-200 transition-colors stagger-item card-aura-lift group cursor-default"
              style={{ transitionDelay: "100ms" }}
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-xs icon-aura-hover proximity-icon">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                AI Assessment Generation
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Immediately upon application, the system generates exactly 5 personalized scenario questions tailored to the candidate's actual projects and job responsibilities.
              </p>
            </ProximityCard>

            <ProximityCard
              className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-8 hover:border-indigo-200 transition-colors stagger-item card-aura-lift group cursor-default"
              style={{ transitionDelay: "200ms" }}
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-xs icon-aura-hover proximity-icon">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Recruiter-Controlled Thresholds
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Configure custom screening thresholds and assessment passing scores per role. Only candidates who clear both benchmarks advance into your human review cockpit.
              </p>
            </ProximityCard>
          </div>
        </div>
      </section>

      <section id="workflow" className="py-20 bg-slate-50 border-t border-slate-200/80 reveal-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Designed for both candidates and hiring teams
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              A streamlined, transparent, and respectful hiring experience on both ends of the table.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProximityCard className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs reveal-card-left card-aura-lift cursor-default">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-6">
                FOR CANDIDATES
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Fast, bias-free opportunity matching
              </h3>
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 proximity-icon" />
                  <span>
                    <strong>Instant screening:</strong> Upload your PDF resume once and watch real-time skill extraction without filling endless redundant forms.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 proximity-icon" />
                  <span>
                    <strong>Personalized technical test:</strong> Tackle 5 targeted scenario questions crafted directly around your actual experience.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 proximity-icon" />
                  <span>
                    <strong>Immediate feedback:</strong> View your overall score transparently as your submission enters direct recruiter review.
                  </span>
                </li>
              </ul>
            </ProximityCard>

            <ProximityCard className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs reveal-card-right card-aura-lift cursor-default">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-6">
                FOR HIRING ADMINS
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Decide with verified candidate signals
              </h3>
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5 proximity-icon" />
                  <span>
                    <strong>Configurable qualification bars:</strong> Set distinct screening and assessment cutoffs so you only review qualified engineers.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5 proximity-icon" />
                  <span>
                    <strong>Complete AI transparency:</strong> Inspect matched skills, missing skills, candidate answers, and AI feedback question-by-question.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5 proximity-icon" />
                  <span>
                    <strong>One-click scheduling:</strong> Selecting a candidate automatically schedules the interview and delivers the confirmation email.
                  </span>
                </li>
              </ul>
            </ProximityCard>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-t border-slate-200/80 reveal-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-5 border border-indigo-100">
            <Users className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Human Decisions. AI Acceleration.
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            HireFlow AI does not make autonomous hiring decisions or auto-reject without oversight.
            AI acts as an untiring analytical partner, preparing data, evaluating technical answers,
            and providing verified signals so that hiring managers can make confident, informed selections.
          </p>
        </div>
      </section>

      <section className="py-20 bg-indigo-600 text-white text-center reveal-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to experience smarter engineering hiring?
          </h2>
          <p className="mt-4 text-indigo-100 text-base max-w-xl mx-auto">
            Join software teams and top engineers accelerating the journey from resume to interview.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-indigo-600 font-bold hover:bg-indigo-50 shadow-md transition-all btn-aura-primary"
            >
              Create Free Account
            </MagneticButton>
            <MagneticButton
              to="/jobs"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-indigo-400 text-white font-semibold hover:bg-indigo-700/60 transition-all btn-aura-secondary"
            >
              Browse Open Roles
            </MagneticButton>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Zap className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg text-white">
              HireFlow <span className="text-indigo-400">AI</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <MagneticButton to="/login" className="hover:text-white transition-colors">
              Candidate Sign In
            </MagneticButton>
            <MagneticButton to="/login" className="hover:text-white transition-colors">
              Admin Portal
            </MagneticButton>
            <MagneticButton to="/jobs" className="hover:text-white transition-colors">
              Open Opportunities
            </MagneticButton>
          </div>

          <p className="text-xs text-slate-500">
            © 2026 HireFlow AI Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
