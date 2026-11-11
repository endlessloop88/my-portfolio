import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, Link2, Mail } from 'lucide-react';
import JsonLd from '../components/JsonLd';
import Logo from '../components/Logo';

const SITE = 'https://www.yunusilgun.com';
const GITHUB = 'https://github.com/endlessloop88';
const LINKEDIN = 'https://www.linkedin.com/in/yunus-ilg%C3%BCn-299652212/';
const EMAIL = 'ilguny929@gmail.com';

export const metadata: Metadata = {
  title: 'Yunus İlgün | Backend Developer (Python & Java)',
  description:
    'Backend developer based in İzmir, Türkiye. Python, FastAPI, Java, Spring Boot and PostgreSQL. Selected projects, CV and contact.',
  alternates: { canonical: `${SITE}/en` },
};

interface Project {
  title: string;
  summary: string;
  stack: string;
  links: { label: string; href: string }[];
}

const PROJECTS: Project[] = [
  {
    title: 'Annotation Quality API',
    summary:
      'REST API that tracks data-labelling tasks, submissions and reviews and reports quality metrics such as approval and correction rates. The submission flow is a state machine (accepted, needs correction, rejected), metrics are computed in SQL, and the project ships with pytest tests, Docker and GitHub Actions CI.',
    stack: 'Python, FastAPI, SQLAlchemy, PostgreSQL, Docker, pytest',
    links: [{ label: 'GitHub', href: `${GITHUB}/annotation-quality-api` }],
  },
  {
    title: 'Rhythm Coach',
    summary:
      'Browser tool for drummers: it plays a click and measures, in milliseconds, how far each hit lands from the beat. Works with a keyboard, touch or a USB MIDI pad, installs on a phone as an app and collects no personal data. Written with AI-assisted tooling; I defined the behaviour and tested it on real hardware.',
    stack: 'TypeScript, Web Audio API, Web MIDI, PWA',
    links: [
      { label: 'Try it', href: `${SITE}/coach` },
      { label: 'GitHub', href: `${GITHUB}/my-portfolio` },
    ],
  },
  {
    title: 'avatar-builder',
    summary:
      'Small Python project that builds a personalised SVG avatar from a JSON config: validation with clear errors, fallback names across library versions, and 14 unit tests that run without extra packages. Written with AI-assisted tooling; structure and testing by me.',
    stack: 'Python, JSON, unittest',
    links: [{ label: 'GitHub', href: `${GITHUB}/avatar-builder` }],
  },
  {
    title: 'Annotation Review Agent',
    summary:
      'Small LLM agent that reviews data-labelling submissions against written guidelines. It calls tools (guideline search and annotator statistics) and its answer is validated in code: schema, mandatory citations that must come from retrieved sections, PII masking and bounded retries. Includes an offline rule-based demo and 42 unit tests. Experimental: lexical retrieval only, no MCP server or real-model evaluation yet. Written with AI-assisted tooling; structure and guardrails by me.',
    stack: 'Python, LLM tool use, BM25, unittest',
    links: [{ label: 'GitHub', href: `${GITHUB}/annotation-review-agent` }],
  },
  {
    title: 'Payments Kafka Demo',
    summary:
      'Small Spring Boot and Kafka demo built to learn event-driven basics: payment events keyed by account (3 partitions), a consumer group, an idempotent consumer (a duplicate event is applied once) and a dead-letter topic for failing events. 15 tests, including an end-to-end test on an embedded broker. Limits: in-memory state, no outbox or transactions, no schema registry. Written with AI-assisted tooling; scope and design by me.',
    stack: 'Java, Spring Boot, Kafka, JUnit',
    links: [{ label: 'GitHub', href: `${GITHUB}/payments-kafka-demo` }],
  },
  {
    title: 'Patent Agent',
    summary: 'Patent management and search system with a RESTful API and an H2 database.',
    stack: 'Java, Spring Boot, H2',
    links: [{ label: 'GitHub', href: `${GITHUB}/patent-agent-backend` }],
  },
];

const SKILLS: { group: string; items: string }[] = [
  { group: 'Languages', items: 'Python, Java, SQL' },
  { group: 'Backend', items: 'FastAPI, Spring Boot, SQLAlchemy, REST APIs' },
  { group: 'Data and delivery', items: 'PostgreSQL, Docker, GitHub Actions (CI)' },
  { group: 'Testing', items: 'pytest, unittest' },
];

const EXPERIENCE: { period: string; title: string; text: string }[] = [
  {
    period: '2026 - present',
    title: 'Alignerr (freelance)',
    text: 'AI data evaluation and labelling projects.',
  },
  {
    period: '2017 - 2018',
    title: 'GoodBarber',
    text: 'Java mobile app development for about a year.',
  },
  {
    period: '2010 - 2022',
    title: 'E-commerce',
    text: 'Marketplace operations (Trendyol, Hepsiburada, Amazon) and integration work.',
  },
];

export default function EnglishPage() {
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Yunus İlgün',
    url: `${SITE}/en`,
    jobTitle: 'Backend Developer',
    address: { '@type': 'PostalAddress', addressLocality: 'İzmir', addressCountry: 'TR' },
    sameAs: [GITHUB, LINKEDIN],
    knowsAbout: ['Python', 'Java', 'FastAPI', 'Spring Boot', 'PostgreSQL', 'REST APIs'],
  };

  return (
    <main lang="en" className="min-h-screen bg-slate-950 text-slate-100">
      <JsonLd data={personJsonLd} />
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-12">
        <nav className="flex items-center justify-between text-sm">
          <span className="font-mono font-bold text-teal-400 flex items-center gap-2">
            <Logo size={28} className="rounded-lg ring-1 ring-slate-800" /> YUNUS İLGÜN
          </span>
          <Link href="/" className="text-slate-400 hover:text-teal-400 transition">
            Türkçe site
          </Link>
        </nav>

        <header className="space-y-4">
          <p className="text-xs text-teal-400 font-medium">Backend developer · İzmir, Türkiye</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100">Python and Java backend developer</h1>
          <p className="text-slate-300 leading-relaxed">
            I have worked in e-commerce operations since 2010 and in software since 2017, mostly on Java and Python
            backends and marketplace integrations. I also work on AI data evaluation projects and I am a professional
            drummer. I am open to backend engineering roles, including remote ones.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/Yunus-Ilgun-CV.pdf"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-sm font-semibold transition"
            >
              <Download size={16} /> Download CV
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-teal-500/40 text-teal-300 hover:bg-teal-500/10 text-sm font-semibold transition"
            >
              <Mail size={16} /> Email
            </a>
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-teal-300 text-sm font-semibold transition"
            >
              <Link2 size={16} /> GitHub
            </a>
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-teal-300 text-sm font-semibold transition"
            >
              <Link2 size={16} /> LinkedIn
            </a>
          </div>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-100">Selected projects</h2>
          <div className="space-y-4">
            {PROJECTS.map((project) => (
              <article key={project.title} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="text-base font-bold text-teal-300">{project.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{project.summary}</p>
                <p className="text-xs text-slate-500">{project.stack}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-400 hover:underline"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-100">Skills</h2>
          <dl className="grid sm:grid-cols-2 gap-4">
            {SKILLS.map((skill) => (
              <div key={skill.group} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                <dt className="text-xs uppercase tracking-wide text-slate-500">{skill.group}</dt>
                <dd className="text-sm text-slate-300 mt-1">{skill.items}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-100">Experience</h2>
          <ul className="space-y-3">
            {EXPERIENCE.map((job) => (
              <li key={job.title} className="text-sm text-slate-300">
                <span className="text-teal-400 text-xs mr-2">{job.period}</span>
                <strong className="text-slate-100">{job.title}</strong>
                <span className="text-slate-400"> · {job.text}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-slate-400">Full details are in the CV.</p>
        </section>

        <footer className="pt-6 border-t border-slate-800 text-xs text-slate-500">
          Yunus İlgün ·{' '}
          <Link href="/" className="text-teal-400 hover:underline">
            yunusilgun.com
          </Link>{' '}
          ·{' '}
          <Link href="/gizlilik" className="text-teal-400 hover:underline">
            Privacy
          </Link>
        </footer>
      </div>
    </main>
  );
}
