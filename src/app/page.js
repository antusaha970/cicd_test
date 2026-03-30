import { headers } from "next/headers";
import { connection } from "next/server";
import os from "os";

// CI/CD Pipeline Stage Component
function PipelineStage({ name, status, icon, isLast = false }) {
  const statusColors = {
    success: "bg-green-500 border-green-600",
    pending: "bg-yellow-500 border-yellow-600",
    running: "bg-blue-500 border-blue-600 animate-pulse",
    failed: "bg-red-500 border-red-600",
  };

  const statusIcons = {
    success: "✓",
    pending: "○",
    running: "◐",
    failed: "✕",
  };

  return (
    <div className="flex items-center">
      <div
        className={`flex flex-col items-center p-4 rounded-lg border-2 ${statusColors[status]} text-white min-w-[120px]`}
      >
        <span className="text-2xl mb-1">{icon}</span>
        <span className="text-xs font-semibold uppercase tracking-wider">
          {name}
        </span>
        <span className="text-lg font-bold mt-1">{statusIcons[status]}</span>
      </div>
      {!isLast && (
        <div className="w-8 h-1 bg-gray-400 mx-2 dark:bg-gray-600"></div>
      )}
    </div>
  );
}

// Server Info Card Component
function InfoCard({ title, items }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-zinc-700">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 border-b pb-2">
        {title}
      </h3>
      <dl className="space-y-2">
        {items.map(([label, value], idx) => (
          <div key={idx} className="flex justify-between">
            <dt className="text-sm text-gray-500 dark:text-gray-400">
              {label}:
            </dt>
            <dd className="text-sm font-mono text-gray-800 dark:text-gray-200 text-right break-all max-w-[60%]">
              {value || "N/A"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default async function Home() {
  // Ensure dynamic rendering for server info
  await connection();

  // Get headers for client info
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  const host = headersList.get("host") || "";
  const acceptLang = headersList.get("accept-language") || "";
  const referer = headersList.get("referer") || "";

  // Determine client IP
  const clientIp = forwardedFor?.split(",")[0]?.trim() || realIp || "Unknown";

  // Server-side system info
  const serverInfo = {
    hostname: os.hostname(),
    platform: os.platform(),
    osType: os.type(),
    osRelease: os.release(),
    architecture: os.arch(),
    cpus: os.cpus().length,
    totalMemory: `${Math.round(os.totalmem() / 1024 / 1024 / 1024)} GB`,
    freeMemory: `${Math.round(os.freemem() / 1024 / 1024 / 1024)} GB`,
    uptime: `${Math.floor(os.uptime() / 3600)}h ${Math.floor((os.uptime() % 3600) / 60)}m`,
    nodeVersion: process.version,
    nextVersion: "16.2.1",
  };

  // CI/CD Pipeline stages
  const pipelineStages = [
    { name: "Source", status: "success", icon: "📥" },
    { name: "Build", status: "success", icon: "🔨" },
    { name: "Test", status: "running", icon: "🧪" },
    { name: "Deploy", status: "pending", icon: "🚀" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 font-sans">
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            CI/CD Pipeline Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Learn Continuous Integration & Continuous Deployment with Next.js
          </p>
        </div>

        {/* CI/CD Pipeline Visualization */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <span>🔄</span> Pipeline Flow
          </h2>
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-zinc-700 overflow-x-auto">
            <div className="flex items-center justify-center min-w-max">
              {pipelineStages.map((stage, index) => (
                <PipelineStage
                  key={stage.name}
                  name={stage.name}
                  status={stage.status}
                  icon={stage.icon}
                  isLast={index === pipelineStages.length - 1}
                />
              ))}
            </div>
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>
                Pipeline Status:{" "}
                <span className="text-blue-500 font-semibold">Running</span> |
                Branch: <span className="font-mono">main</span> | Commit:{" "}
                <span className="font-mono">a1b2c3d</span>
              </p>
            </div>
          </div>
        </section>

        {/* Server Information Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <span>🖥️</span> Server Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard
              title="System"
              items={[
                ["Hostname", serverInfo.hostname],
                ["Platform", serverInfo.platform],
                ["OS Type", serverInfo.osType],
                ["OS Release", serverInfo.osRelease],
                ["Architecture", serverInfo.architecture],
              ]}
            />
            <InfoCard
              title="Resources"
              items={[
                ["CPU Cores", serverInfo.cpus.toString()],
                ["Total Memory", serverInfo.totalMemory],
                ["Free Memory", serverInfo.freeMemory],
                ["Uptime", serverInfo.uptime],
              ]}
            />
            <InfoCard
              title="Runtime"
              items={[
                ["Node.js", serverInfo.nodeVersion],
                ["Next.js", serverInfo.nextVersion],
                ["Server Host", host],
              ]}
            />
          </div>
        </section>

        {/* Client Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <span>👤</span> Your Connection
          </h2>
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-zinc-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  IP Address
                </h4>
                <p className="font-mono text-sm bg-gray-100 dark:bg-zinc-800 p-2 rounded">
                  {clientIp}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  User Agent
                </h4>
                <p className="font-mono text-sm bg-gray-100 dark:bg-zinc-800 p-2 rounded break-all">
                  {userAgent}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Accept Language
                </h4>
                <p className="font-mono text-sm bg-gray-100 dark:bg-zinc-800 p-2 rounded">
                  {acceptLang}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Referer
                </h4>
                <p className="font-mono text-sm bg-gray-100 dark:bg-zinc-800 p-2 rounded break-all">
                  {referer || "Direct"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CI/CD Concepts */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <span>📚</span> CI/CD Concepts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-3">
                Continuous Integration (CI)
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Practice of automatically building and testing code changes
                whenever a developer pushes code to the repository. This ensures
                early detection of integration issues.
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
              <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-3">
                Continuous Deployment (CD)
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Automatically deploying code that passes all tests to production
                or staging environments. This enables rapid delivery of features
                and fixes to users.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Running on Next.js {serverInfo.nextVersion} | Rendered at:{" "}
            {new Date().toISOString()}
            <br></br>
            made by antu
          </p>
        </footer>
      </main>
    </div>
  );
}
