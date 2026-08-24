import { lazy, Suspense, type PointerEvent, useEffect, useRef } from 'react'
import { animate, createScope, createTimeline, splitText, stagger } from 'animejs'
import {
  ArrowDown, ArrowRight, ArrowUpRight, BookOpen, BrainCircuit, Code2, Cpu, Database,
  Download, ExternalLink, Github, GraduationCap, Layers3, Linkedin, Mail,
  Phone, ShieldCheck, Sparkles, Trophy, Zap,
} from 'lucide-react'

const HeroScene = lazy(() => import('./HeroScene'))

type Project = {
  index: string
  label: string
  title: string
  summary: string
  result: string
  detail: string
  tags: string[]
  href: string
  accent: 'blue' | 'lime' | 'violet' | 'amber'
}

const focusWords = ['PRODUCTION ML', 'COMPUTER VISION', 'EDGE AI', 'GENAI SYSTEMS']

const metrics = [
  { value: '0.92%', label: 'MAPE', detail: '5-minute demand forecast' },
  { value: '13.9×', label: 'FASTER', detail: 'FPGA vs. CPU inference' },
  { value: '98.8%', label: 'ACCURACY', detail: 'brain tumor MRI ensemble' },
  { value: '02', label: 'PAPERS', detail: 'published + accepted' },
]

const projects: Project[] = [
  {
    index: '01',
    label: 'PRODUCTION ML · NTPC',
    title: 'India-wide power demand forecasting',
    summary: 'A multi-horizon XGBoost pipeline built to support power-trading decisions across every Indian state and union territory.',
    result: '0.92% MAPE',
    detail: '340K+ telemetry records · 4 forecast horizons · 288-block forecast in <2.5s',
    tags: ['XGBoost', 'Django', 'Time Series', 'SQL'],
    href: 'https://github.com/TanmayRawal/India_Power_Demand_forcaster',
    accent: 'lime',
  },
  {
    index: '02',
    label: 'INTERPRETABLE AI · LUSIP',
    title: 'Explainable brain tumor classification at the edge',
    summary: 'A weighted CNN ensemble with three complementary explainability methods, quantized and deployed on a PYNQ-ZU FPGA.',
    result: '98.8% accuracy',
    detail: '7,421 MRI scans · 2–4% over individual baselines · within 0.3% of FP32 after INT8',
    tags: ['Grad-CAM', 'SHAP', 'LIME', 'Vitis AI'],
    href: 'https://github.com/TanmayRawal/Brain-Tumor-MRI-Classification-Using-Ensemble-CNN-XAI-and-Hardware-Accelerated-Edge-Deployment',
    accent: 'blue',
  },
  {
    index: '03',
    label: 'EDGE AI · FPGA',
    title: 'Real-time Alzheimer’s staging on PYNQ-ZU',
    summary: 'An INT8 ResNet50 deployment that turns clinical image inference into a deterministic, accelerator-native pipeline.',
    result: '98.4 FPS',
    detail: '10.15 ms latency · 13.9× CPU speedup · 423 DPU operations · zero CPU fallback',
    tags: ['ResNet50', 'INT8', 'DPUCZDX8G', 'OASIS'],
    href: 'https://github.com/TanmayRawal/Alzheimer-Classification-Using-Hardware-Accelerated-CNN-on-PYNQ-ZU-FPGA-with-Arm-Processor',
    accent: 'violet',
  },
  {
    index: '04',
    label: 'AGENTIC AI · RAG',
    title: 'ResolveAI multi-agent support intelligence',
    summary: 'A four-agent workflow that retrieves policy evidence, designs a resolution, and validates citations and compliance before responding.',
    result: '100% compliant',
    detail: '23-ticket benchmark · 100% citation coverage · MCP server + interactive interface',
    tags: ['CrewAI', 'FAISS', 'Gemini', 'FastMCP'],
    href: 'https://github.com/TanmayRawal/ResolveAI',
    accent: 'amber',
  },
  {
    index: '05',
    label: 'DIGITAL DESIGN · CRYPTOGRAPHY',
    title: 'AES-128 hardware accelerator',
    summary: 'A FIPS-197-compliant CTR-mode encryption IP integrated with a MicroBlaze SoC and verified byte-for-byte against a software reference.',
    result: '12 cycles / block',
    detail: 'AXI4-Lite IP · 7.9555-bit entropy · 0.236 W on-chip power · all timing constraints met',
    tags: ['Verilog', 'Vivado', 'MicroBlaze', 'AXI4-Lite'],
    href: 'https://github.com/TanmayRawal/AES128-hardware-accelerator',
    accent: 'blue',
  },
]

const skillGroups = [
  {
    icon: Code2,
    number: '01',
    title: 'Languages & compute',
    description: 'Core implementation and accelerator-facing programming.',
    skills: ['Python', 'C++', 'SQL', 'CUDA', 'VHDL'],
  },
  {
    icon: BrainCircuit,
    number: '02',
    title: 'Machine learning & AI',
    description: 'Modeling, evaluation, interpretation, and predictive systems.',
    skills: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'XGBoost', 'Deep Learning', 'Computer Vision', 'Time-Series Forecasting', 'XAI', 'Feature Engineering'],
  },
  {
    icon: Layers3,
    number: '03',
    title: 'GenAI & LLM systems',
    description: 'Retrieval, orchestration, evaluation, and agentic workflows.',
    skills: ['RAG', 'LangChain', 'CrewAI', 'FAISS', 'Hugging Face', 'Sentence Transformers', 'Multi-Agent Systems', 'MCP'],
  },
  {
    icon: Cpu,
    number: '04',
    title: 'Edge & deployment',
    description: 'Turning trained models into efficient, reproducible systems.',
    skills: ['Docker', 'Linux', 'Git', 'ONNX', 'TensorRT', 'Vitis AI', 'PYNQ-ZU', 'FPGA Acceleration', 'INT8 Quantization'],
  },
  {
    icon: Database,
    number: '05',
    title: 'Data & applications',
    description: 'The practical tools around research prototypes and products.',
    skills: ['NumPy', 'Pandas', 'OpenCV', 'Streamlit', 'Django', 'FastMCP', 'APScheduler', 'Gemini', 'Open-Meteo'],
  },
]

const skillCount = skillGroups.reduce((total, group) => total + group.skills.length, 0)

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return (
    <div className="section-heading" data-motion="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2 data-split>{title}</h2>
      {copy && <p className="section-copy">{copy}</p>}
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const handlePointer = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  return (
    <article className={`project-card project-card--${project.accent}`} data-motion="project" onPointerMove={handlePointer}>
      <div className="project-glow" aria-hidden="true" />
      <div className="project-topline">
        <span className="project-index">{project.index}</span>
        <span>{project.label}</span>
        <a href={project.href} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} on GitHub`}>
          <Github size={17} />
          <ArrowUpRight size={15} />
        </a>
      </div>
      <div className="project-body">
        <div>
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
        </div>
        <div className="project-result">
          <strong>{project.result}</strong>
          <span>{project.detail}</span>
        </div>
      </div>
      <div className="project-tags" aria-label="Technologies used">
        {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
    </article>
  )
}

export default function App() {
  const heroRef = useRef<HTMLElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    document.documentElement.classList.add('motion-ready')

    const splitInstances = Array.from(document.querySelectorAll<HTMLElement>('[data-split]')).map((element) => (
      splitText(element, { words: { wrap: 'clip', class: 'split-word' } })
    ))

    const scope = createScope({
      root: document.body,
      defaults: { ease: 'outExpo' },
    }).add(() => {
      createTimeline({ defaults: { ease: 'outExpo' } })
        .add('.site-header', { opacity: [0, 1], translateY: [-22, 0], duration: 700 }, 0)
        .add('.hero-scene', { opacity: [0, 1], scale: [.82, 1], rotate: [-4, 0], duration: 1500 }, 50)
        .add('.hero-kicker', { opacity: [0, 1], translateY: [18, 0], duration: 650 }, 120)
        .add('.hero-title .split-word', {
          opacity: [0, 1],
          translateY: ['115%', '0%'],
          rotateX: [75, 0],
          duration: 1150,
          delay: stagger(58),
        }, 160)
        .add('.hero-intro', { opacity: [0, 1], translateY: [28, 0], duration: 820 }, 520)
        .add('.hero-focus', { opacity: [0, 1], duration: 400 }, 570)
        .add('.hero-focus span', {
          opacity: [0, 1],
          translateX: [-18, 0],
          duration: 650,
          delay: stagger(70),
        }, 620)
        .add('.hero-actions', { opacity: [0, 1], duration: 300 }, 780)
        .add('.hero-actions .button', {
          opacity: [0, 1],
          translateY: [18, 0],
          scale: [.96, 1],
          duration: 650,
          delay: stagger(90),
        }, 800)

    })

    const animateCounter = (element: HTMLElement) => {
      const original = element.dataset.value ?? element.textContent ?? ''
      const match = original.match(/[\d.]+/)
      if (!match) return
      const target = Number.parseFloat(match[0])
      const decimals = match[0].includes('.') ? match[0].split('.')[1].length : 0
      const prefix = original.slice(0, match.index)
      const suffix = original.slice((match.index ?? 0) + match[0].length)
      const padded = match[0].startsWith('0') && decimals === 0
      const counter = { value: 0 }

      animate(counter, {
        value: target,
        duration: 1400,
        ease: 'outExpo',
        onUpdate: () => {
          const value = decimals ? counter.value.toFixed(decimals) : Math.round(counter.value).toString()
          element.textContent = `${prefix}${padded ? value.padStart(2, '0') : value}${suffix}`
        },
      })
    }

    const reveal = (element: HTMLElement) => {
      const motion = element.dataset.motion

      if (motion === 'section-heading') {
        const eyebrow = element.querySelector('.eyebrow')
        const words = element.querySelectorAll('.split-word')
        const copy = element.querySelector('.section-copy')
        createTimeline({ defaults: { ease: 'outExpo' } })
          .add(eyebrow ?? [], { opacity: [0, 1], translateX: [-22, 0], duration: 600 }, 0)
          .add(words, {
            opacity: [0, 1],
            translateY: ['90%', '0%'],
            duration: 760,
            delay: stagger(42),
          }, 90)
          .add(copy ?? [], { opacity: [0, 1], translateY: [22, 0], duration: 680 }, 330)
        return
      }

      if (motion === 'metric') {
        const index = Array.from(element.parentElement?.children ?? []).indexOf(element)
        animate(element, {
          opacity: [0, 1],
          translateY: [55, 0],
          delay: Math.max(0, index) * 90,
          duration: 850,
          ease: 'outExpo',
        })
        const value = element.querySelector<HTMLElement>('[data-value]')
        if (value) window.setTimeout(() => animateCounter(value), 140 + Math.max(0, index) * 90)
        return
      }

      if (motion === 'project') {
        createTimeline({ defaults: { ease: 'outExpo' } })
          .add(element, { opacity: [0, 1], translateY: [48, 0], duration: 760 }, 0)
          .add(element.querySelectorAll('.project-topline > *'), {
            opacity: [0, 1], translateX: [-18, 0], duration: 560, delay: stagger(55),
          }, 110)
          .add(element.querySelector('h3') ?? [], { opacity: [0, 1], translateY: [38, 0], duration: 760 }, 150)
          .add(element.querySelector('.project-body > div:first-child > p') ?? [], { opacity: [0, 1], translateY: [22, 0], duration: 650 }, 260)
          .add(element.querySelector('.project-result') ?? [], { opacity: [0, 1], translateX: [30, 0], duration: 680 }, 290)
          .add(element.querySelectorAll('.project-tags span'), {
            opacity: [0, 1], translateY: [14, 0], scale: [.9, 1], duration: 500, delay: stagger(55),
          }, 400)
        return
      }

      if (motion === 'publication') {
        createTimeline({ defaults: { ease: 'outExpo' } })
          .add(element, { opacity: [0, 1], translateY: [52, 0], duration: 780 }, 0)
          .add(element.children, { opacity: [0, 1], translateY: [20, 0], duration: 650, delay: stagger(70) }, 180)
        return
      }

      if (motion === 'timeline') {
        createTimeline({ defaults: { ease: 'outExpo' } })
          .add(element, { opacity: [0, 1], duration: 350 }, 0)
          .add(element.querySelector('.timeline-line-fill') ?? [], { scaleY: [0, 1], duration: 900, ease: 'inOutExpo' }, 0)
          .add(element.querySelector('.timeline-marker svg') ?? [], { opacity: [0, 1], scale: [0, 1], rotate: [-35, 0], duration: 720 }, 180)
          .add(element.querySelector('.timeline-date') ?? [], { opacity: [0, 1], translateX: [-24, 0], duration: 650 }, 220)
          .add(element.querySelectorAll('.timeline-content > *'), { opacity: [0, 1], translateY: [25, 0], duration: 650, delay: stagger(65) }, 280)
        return
      }

      if (motion === 'skill') {
        createTimeline({ defaults: { ease: 'outExpo' } })
          .add(element, { opacity: [0, 1], translateY: [42, 0], duration: 680 }, 0)
          .add(element.querySelectorAll('.skill-card-top > *'), { opacity: [0, 1], translateX: [-18, 0], duration: 580, delay: stagger(70) }, 100)
          .add(element.querySelector('h3') ?? [], { opacity: [0, 1], translateY: [26, 0], duration: 700 }, 150)
          .add(element.querySelector('.skill-description') ?? [], { opacity: [0, 1], translateY: [16, 0], duration: 560 }, 230)
          .add(element.querySelector('.skill-cloud') ?? [], { opacity: [0, 1], translateY: [13, 0], duration: 480 }, 300)
        return
      }

      if (motion === 'skill-map') {
        createTimeline({ defaults: { ease: 'outExpo' } })
          .add(element, { opacity: [0, 1], scale: [.92, 1], duration: 900 }, 0)
          .add(element.querySelector('.skill-map-grid') ?? [], { opacity: [0, .8], scale: [.7, 1], rotate: [-16, 0], duration: 1100 }, 80)
          .add(element.querySelectorAll('.skill-map-ring'), { opacity: [0, 1], scale: [.45, 1], rotate: [-120, 0], duration: 1000, delay: stagger(90) }, 120)
          .add(element.querySelector('.skill-map-count') ?? [], { opacity: [0, 1], scale: [.65, 1], duration: 850 }, 290)
          .add(element.querySelectorAll('.skill-map-axis span'), { opacity: [0, 1], translateY: [12, 0], duration: 520, delay: stagger(70) }, 420)
        return
      }

      if (motion === 'achievement') {
        createTimeline({ defaults: { ease: 'outExpo' } })
          .add(element, { opacity: [0, 1], duration: 400 }, 0)
          .add(element.querySelector('.achievement-icon') ?? [], { opacity: [0, 1], scale: [.4, 1], rotate: [-90, 0], duration: 780 }, 30)
          .add(element.querySelector('.achievement-rank') ?? [], { opacity: [0, 1], translateY: [35, 0], scale: [.9, 1], duration: 800 }, 130)
          .add(element.querySelectorAll('h3, h3 + p'), { opacity: [0, 1], translateY: [20, 0], duration: 650, delay: stagger(80) }, 250)
        return
      }

      if (motion === 'contact') {
        createTimeline({ defaults: { ease: 'outExpo' } })
          .add(element.querySelector('.eyebrow') ?? [], { opacity: [0, 1], translateX: [-24, 0], duration: 620 }, 0)
          .add(element.querySelectorAll('.split-word'), { opacity: [0, 1], translateY: ['90%', '0%'], duration: 820, delay: stagger(45) }, 80)
          .add(element.querySelectorAll(':scope > p:not(.eyebrow), .contact-main'), { opacity: [0, 1], translateY: [24, 0], duration: 700, delay: stagger(100) }, 380)
        return
      }

      const children = element.matches('.research-principles') ? element.children : element.querySelectorAll(':scope > *')
      createTimeline({ defaults: { ease: 'outExpo' } })
        .add(element, { opacity: [0, 1], duration: 400 }, 0)
        .add(children, { opacity: [0, 1], translateY: [18, 0], duration: 620, delay: stagger(70) }, 80)
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || entry.target.getAttribute('data-animated') === 'true') return
        entry.target.setAttribute('data-animated', 'true')
        reveal(entry.target as HTMLElement)
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.07, rootMargin: '0px 0px -2% 0px' })

    document.querySelectorAll('[data-motion], [data-reveal]').forEach((element) => observer.observe(element))

    let ticking = false
    const header = document.querySelector('.site-header')
    const handleScroll = () => {
      if (!ticking) {
        ticking = true
        window.requestAnimationFrame(() => {
          const scrollable = document.documentElement.scrollHeight - window.innerHeight
          const progress = scrollable > 0 ? window.scrollY / scrollable : 0
          if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`
          header?.classList.toggle('is-scrolled', window.scrollY > 40)
          ticking = false
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      observer.disconnect()
      scope.revert()
      splitInstances.forEach((split) => split.revert())
      window.removeEventListener('scroll', handleScroll)
      document.documentElement.classList.remove('motion-ready')
    }
  }, [])

  return (
    <>
      <div className="scroll-progress" ref={progressRef} aria-hidden="true" />

      <header className="site-header">
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#research">Research</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="header-cta" href="mailto:23DEC511@lnmiit.ac.in">Let’s talk <ArrowUpRight size={15} /></a>
      </header>

      <main id="main">
        <section className="hero" id="top" ref={heroRef}>
          <div className="hero-grid" aria-hidden="true" />
          <Suspense fallback={<div className="hero-scene hero-scene--loading" aria-hidden="true" />}>
            <HeroScene />
          </Suspense>
          <p className="hero-kicker" data-enter>ML / AI RESEARCH ENGINEER</p>
          <h1 className="hero-title">
            <span className="hero-title-line" data-split>Building intelligence</span>
            <em className="hero-title-line" data-split>for the real world.</em>
          </h1>
          <div className="hero-bottom">
            <p className="hero-intro" data-enter>
              I’m <strong>Tanmay Rawal</strong> — an engineer working where machine learning meets constrained hardware, human trust, and production reality.
            </p>
            <div className="hero-focus" data-enter>
              {focusWords.map((word, index) => <span key={word}><i>0{index + 1}</i>{word}</span>)}
            </div>
          </div>
          <div className="hero-actions" data-enter>
            <a className="button button--primary" href="#work">View selected work <ArrowDown size={16} /></a>
            <a className="button button--ghost" href="/Tanmay-Rawal-Resume.pdf" target="_blank">Resume <Download size={16} /></a>
          </div>
        </section>

        <section className="metrics" aria-label="Selected impact metrics">
          {metrics.map((metric, index) => (
            <article key={metric.label} data-motion="metric">
              <span>0{index + 1}</span>
              <strong data-value={metric.value}>{metric.value}</strong>
              <p>{metric.label}</p>
              <small>{metric.detail}</small>
            </article>
          ))}
        </section>

        <section className="work-section section" id="work">
          <SectionHeading eyebrow="01 / SELECTED WORK" title="Systems that survive contact with reality." copy="From national-scale forecasting to medical AI on programmable hardware—each project is framed around evidence, constraints, and measurable outcomes." />
          <div className="project-list">{projects.map((project) => <ProjectCard key={project.title} project={project} />)}</div>
        </section>

        <section className="research-section section" id="research">
          <SectionHeading eyebrow="02 / PUBLICATIONS" title="Research, made accountable." copy="Work centered on trustworthy medical imaging and efficient neural inference—spanning explanation, quantization, and deployment." />
          <div className="publication-grid">
            <article className="publication-card publication-card--featured" data-motion="publication">
              <div className="publication-meta"><BookOpen size={17} /><span>PUBLISHED · IHCI 2025</span></div>
              <p className="publication-number">P.01</p>
              <h3>INSIGHT-BRAIN: Interpretable Neural Systems Using Grad-CAM, SHAP, and LIME in Human-Centered Brain Tumor Imaging</h3>
              <p>An explainability-centered framework for making ensemble MRI decisions more transparent to human stakeholders.</p>
              <a href="https://books.google.co.in/books?id=QFPlEQAAQBAJ&pg=PA301" target="_blank" rel="noreferrer">Read publication <ExternalLink size={15} /></a>
            </article>
            <article className="publication-card" data-motion="publication">
              <div className="publication-meta"><ShieldCheck size={17} /><span>ACCEPTED · IEEE TENCON 2026</span></div>
              <p className="publication-number">P.02</p>
              <h3>DPU-Accelerated Alzheimer’s Disease Staging from Brain MRI Using Quantized ResNet50 on PYNQ-ZU</h3>
              <p>Bridging clinical computer vision and deployable edge inference through INT8 quantization and DPU acceleration.</p>
              <span className="status-pill">Accepted for presentation</span>
            </article>
          </div>
          <div className="research-principles" data-motion="principles">
            <span>MY RESEARCH LENS</span>
            <p><i>01</i> Can it be measured?</p>
            <p><i>02</i> Can it be explained?</p>
            <p><i>03</i> Can it run where it matters?</p>
          </div>
        </section>

        <section className="experience-section section" id="experience">
          <SectionHeading eyebrow="03 / EXPERIENCE" title="Theory, translated into systems." />
          <div className="timeline">
            <article className="timeline-item" data-motion="timeline">
              <div className="timeline-date"><span>2026</span><small>JUN — PRESENT</small></div>
              <div className="timeline-marker"><span className="timeline-line-fill" /><Zap size={16} /></div>
              <div className="timeline-content">
                <p className="timeline-kind">MACHINE LEARNING INTERNSHIP · ONSITE</p>
                <h3>NTPC Ltd. <span>IT Department</span></h3>
                <p>Built and operationalized a four-horizon electricity-demand forecasting pipeline for power-trading decisions, combining grid telemetry, live weather, autoregressive lags, and calendar effects.</p>
                <ul><li>21 engineered predictive features</li><li>12× optimized SQL + NumPy pipeline</li><li>All Indian states and union territories</li></ul>
              </div>
            </article>
            <article className="timeline-item" data-motion="timeline">
              <div className="timeline-date"><span>2025</span><small>MAY — AUG</small></div>
              <div className="timeline-marker"><span className="timeline-line-fill" /><BrainCircuit size={16} /></div>
              <div className="timeline-content">
                <p className="timeline-kind">RESEARCH INTERNSHIP</p>
                <h3>LUSIP, LNMIIT <span>Jaipur</span></h3>
                <p>Developed an interpretable MRI ensemble and took it beyond the notebook: INT8 quantization, DPU compilation, and real-time inference on PYNQ-ZU without GPU or cloud dependency.</p>
                <ul><li>EfficientNetB0 + InceptionV3 + Xception</li><li>Grad-CAM, LIME, and SHAP</li><li>Accuracy retained within 0.3% of FP32</li></ul>
              </div>
            </article>
            <article className="timeline-item timeline-item--education" data-motion="timeline">
              <div className="timeline-date"><span>2023—28</span><small>INTEGRATED DEGREE</small></div>
              <div className="timeline-marker"><span className="timeline-line-fill" /><GraduationCap size={16} /></div>
              <div className="timeline-content">
                <p className="timeline-kind">EDUCATION</p>
                <h3>The LNM Institute of Information Technology <span>Jaipur</span></h3>
                <p>B.Tech–M.Tech Integrated Dual Degree in Electronics and Communication Engineering.</p>
                <ul><li>CGPA: 7.65</li></ul>
              </div>
            </article>
          </div>
        </section>

        <section className="skills-section section" id="skills">
          <SectionHeading eyebrow="04 / TECHNICAL STACK" title="The complete research toolkit." copy="Every capability is named explicitly for fast recruiter scanning—from model development and agentic systems to FPGA deployment and application engineering." />
          <div className="skills-shell">
            <aside className="skill-map" data-motion="skill-map" aria-label={`${skillCount} explicitly listed technical capabilities`}>
              <div className="skill-map-visual" aria-hidden="true">
                <div className="skill-map-grid" />
                <i className="skill-map-ring skill-map-ring--outer" />
                <i className="skill-map-ring skill-map-ring--middle" />
                <i className="skill-map-ring skill-map-ring--inner" />
                <i className="skill-map-node skill-map-node--one" />
                <i className="skill-map-node skill-map-node--two" />
                <i className="skill-map-node skill-map-node--three" />
                <div className="skill-map-count"><strong>{skillCount}</strong><span>NAMED<br />CAPABILITIES</span></div>
                <div className="skill-map-axis"><span>MODEL</span><span>SYSTEM</span><span>HARDWARE</span></div>
              </div>
              <div className="skill-map-meta">
                <span>STACK INDEX / 2026</span>
                <p>Built around research that has to explain itself, run efficiently, and ship.</p>
              </div>
            </aside>
            <div className="skill-ledger">
            {skillGroups.map(({ icon: Icon, number, title, description, skills }) => (
              <article key={title} className="skill-card" data-motion="skill">
                <div className="skill-card-top"><span><Icon size={18} /> CATEGORY {number}</span><small>{skills.length.toString().padStart(2, '0')} SKILLS</small></div>
                <h3>{title}</h3>
                <p className="skill-description">{description}</p>
                <div className="skill-cloud">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
              </article>
            ))}
            </div>
          </div>
        </section>

        <section className="achievements-section section">
          <SectionHeading eyebrow="05 / DISTINCTIONS" title="Signals of sustained effort." />
          <div className="achievement-grid">
            <article data-motion="achievement">
              <div className="achievement-icon"><Trophy size={24} /></div>
              <p className="achievement-rank">#01</p>
              <h3>Rank 1 in the Integrated Dual Degree Program</h3>
              <p>The LNM Institute of Information Technology, Jaipur.</p>
            </article>
            <article data-motion="achievement">
              <div className="achievement-icon"><Sparkles size={24} /></div>
              <p className="achievement-rank">TOP 4.5%</p>
              <h3>54th among 1,200+ global teams</h3>
              <p>Nokia FPGA Hackathon · Top 100 Finalist.</p>
            </article>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-grid" aria-hidden="true" />
          <div className="contact-marquee" aria-hidden="true">
            <div className="contact-marquee-track">
              <span>RESEARCH × ENGINEERING × EDGE AI × TRUSTWORTHY SYSTEMS ×</span>
              <span>RESEARCH × ENGINEERING × EDGE AI × TRUSTWORTHY SYSTEMS ×</span>
            </div>
          </div>
          <div className="contact-content" data-motion="contact">
            <p className="eyebrow">06 / LET’S BUILD WHAT’S NEXT</p>
            <h2><span data-split>Research needs</span><em data-split>real-world traction.</em></h2>
            <p>I’m interested in research engineering and applied AI roles across MNC research teams, AI labs, and ambitious startups.</p>
            <a className="contact-main" href="mailto:23DEC511@lnmiit.ac.in">Start a conversation <ArrowRight size={24} /></a>
          </div>
          <div className="contact-links" data-motion="links">
            <a href="mailto:23DEC511@lnmiit.ac.in"><Mail size={16} /> 23DEC511@lnmiit.ac.in <ArrowUpRight size={14} /></a>
            <a href="tel:+918287523527"><Phone size={16} /> +91 82875 23527 <ArrowUpRight size={14} /></a>
            <a href="https://github.com/TanmayRawal" target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={14} /></a>
            <a href="https://www.linkedin.com/in/tanmay-rawal-10b0a7278/" target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn <ArrowUpRight size={14} /></a>
          </div>
        </section>
      </main>

    </>
  )
}
