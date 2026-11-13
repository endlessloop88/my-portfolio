import type { Metadata } from 'next';
import Link from 'next/link';
import Logo from '../../../components/Logo';

const SITE = 'https://www.yunusilgun.com';
const REPO = 'https://github.com/endlessloop88/payments-kafka-demo';

export const metadata: Metadata = {
  title: 'Payments Kafka Demo: case study | Yunus İlgün',
  description:
    'How a small Spring Boot and Kafka demo handles duplicate and failing events: keyed partitions, an idempotent consumer and a dead-letter topic.',
  alternates: { canonical: `${SITE}/en/projects/payments-kafka-demo` },
};

const DECISIONS: { title: string; text: string }[] = [
  {
    title: 'The account id is the record key',
    text: 'Kafka only guarantees order inside one partition. Using the account id as the key sends all events of one account to the same partition, so a credit and a later debit are processed in the order they were published.',
  },
  {
    title: 'The consumer is idempotent',
    text: 'Kafka delivers at least once, so the same event can arrive twice after a retry or a rebalance. The consumer remembers the event ids it has applied, so a duplicate changes nothing. In a real system this would be a database with a unique constraint on the event id.',
  },
  {
    title: 'Failing events go to a dead-letter topic',
    text: 'An event that fails is retried twice, 300 ms apart, and then published to payments.created.DLT. One bad event does not block the partition.',
  },
  {
    title: 'The producer waits for acknowledgement',
    text: 'The producer uses acks=all and idempotence, and the REST endpoint answers 202 only after the broker has acknowledged the record. The balance itself is updated asynchronously by the consumer.',
  },
  {
    title: 'Three layers of tests',
    text: 'Plain unit tests for the balance logic and validation, a web layer test with the producer mocked, and an end-to-end test on an embedded Kafka broker, so no Docker is needed to run the build. 15 tests in total.',
  },
];

const LIMITS = [
  'Balances and processed event ids live in memory. A real service needs a database.',
  'No outbox or transactions, so writing to a database and publishing an event are not one atomic step.',
  'JSON only, no schema registry, and malformed JSON is not handled (it needs an error-handling deserializer).',
  'One broker, no security, no metrics.',
];

const NEXT = [
  'Store balances and event ids in PostgreSQL with a unique constraint, and add an outbox for publishing.',
  'Add an error-handling deserializer so malformed messages go to the dead-letter topic too.',
  'Add a schema registry and consumer lag metrics.',
];

const COMMANDS = `mvn test

docker compose up -d
mvn spring-boot:run

curl -X POST localhost:8080/payments -H 'Content-Type: application/json' \\
     -d '{"accountId":"acc-1","amountCents":500,"currency":"EUR"}'
curl localhost:8080/accounts/acc-1/balance`;

function Diagram() {
  const box = { fill: '#0f172a', stroke: '#2dd4bf', strokeWidth: 1.5, rx: 10 };
  const text = { fill: '#e2e8f0', textAnchor: 'middle' as const, fontSize: 13 };
  const small = { fill: '#94a3b8', textAnchor: 'middle' as const, fontSize: 11 };
  return (
    <div className="overflow-x-auto">
      <svg
        viewBox="0 0 780 290"
        className="w-full min-w-[640px] h-auto"
        role="img"
        aria-label="A REST request publishes an event to the payments.created topic. A consumer group reads it and updates balances. Events that keep failing go to the dead-letter topic."
      >
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#94a3b8" />
          </marker>
        </defs>

        <rect x="10" y="95" width="140" height="70" {...box} />
        <text x="80" y="124" {...text}>REST API</text>
        <text x="80" y="144" {...small}>POST /payments</text>

        <rect x="205" y="85" width="200" height="90" {...box} />
        <text x="305" y="115" {...text}>Kafka topic</text>
        <text x="305" y="135" {...text}>payments.created</text>
        <text x="305" y="156" {...small}>3 partitions, key = accountId</text>

        <rect x="460" y="95" width="150" height="70" {...box} />
        <text x="535" y="124" {...text}>Consumer group</text>
        <text x="535" y="144" {...small}>balance-service</text>

        <rect x="660" y="95" width="110" height="70" {...box} />
        <text x="715" y="124" {...text}>Balances</text>
        <text x="715" y="144" {...small}>in memory</text>

        <rect x="410" y="215" width="250" height="60" {...box} stroke="#f59e0b" />
        <text x="535" y="242" {...text}>payments.created.DLT</text>
        <text x="535" y="261" {...small}>dead-letter topic, after 2 retries</text>

        <line x1="150" y1="130" x2="203" y2="130" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <line x1="405" y1="130" x2="458" y2="130" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <line x1="610" y1="130" x2="658" y2="130" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <line x1="535" y1="165" x2="535" y2="213" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arrow)" />
      </svg>
    </div>
  );
}

export default function PaymentsKafkaCaseStudy() {
  return (
    <main lang="en" className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-12">
        <nav className="flex items-center justify-between text-sm">
          <span className="font-mono font-bold text-teal-400 flex items-center gap-2">
            <Logo size={28} className="rounded-lg ring-1 ring-slate-800" /> YUNUS İLGÜN
          </span>
          <Link href="/en" className="text-slate-400 hover:text-teal-400 transition">
            Back to the English page
          </Link>
        </nav>

        <header className="space-y-4">
          <p className="text-xs text-teal-400 font-medium">Case study · Java 17, Spring Boot, Apache Kafka</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100">Payments Kafka Demo</h1>
          <p className="text-slate-300 leading-relaxed">
            A small learning project: payment events go through Kafka and update account balances. I built it to
            understand event-driven basics by implementing them, not to run in production. It is written with AI-assisted
            tooling. I chose the scope and the design, then ran, reviewed and tested it myself.
          </p>
          <a
            href={REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-teal-500/40 text-teal-300 hover:bg-teal-500/10 text-sm font-semibold transition"
          >
            View the code on GitHub
          </a>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-100">How an event flows</h2>
          <Diagram />
          <p className="text-sm text-slate-400">
            The REST endpoint publishes a payment event and answers 202. The consumer group applies it to the balance.
            An event that keeps failing is moved to the dead-letter topic.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-100">Design decisions</h2>
          <div className="space-y-4">
            {DECISIONS.map((decision) => (
              <article key={decision.title} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
                <h3 className="text-base font-bold text-teal-300">{decision.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{decision.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-100">A bug the tests caught</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            My first end-to-end test of the dead-letter path failed. The test listened to payments.created.DLT, but the
            logs showed the library had created a different topic, payments.created-dlt, because its default name
            differs from the one I assumed. The failing event was published to a topic nobody was reading. The fix was
            to name the dead-letter destination explicitly in the configuration instead of relying on a default.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-100">Limits</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300">
            {LIMITS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-100">What I would do next</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300">
            {NEXT.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-100">Run it</h2>
          <p className="text-sm text-slate-400">
            Needs Java 17 or newer and Maven. The tests run without Docker. Docker is only needed to start a broker for
            trying the endpoints by hand.
          </p>
          <div className="overflow-x-auto">
            <pre className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-200">{COMMANDS}</pre>
          </div>
        </section>

        <footer className="pt-6 border-t border-slate-800 text-xs text-slate-500">
          Yunus İlgün ·{' '}
          <Link href="/en" className="text-teal-400 hover:underline">
            English page
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
