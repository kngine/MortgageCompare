import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

const OBMMI_URL = "https://www2.optimalblue.com/obmmi"

export function Market() {
  return (
    <div className="flex min-h-screen min-h-[100dvh] flex-col bg-slate-100">
      <header className="flex shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Compare
        </Link>
        <span className="text-sm text-slate-500">
          Mortgage Market Indices (OBMMI) · Optimal Blue
        </span>
      </header>
      <main className="min-h-0 flex-1">
        <iframe
          title="Optimal Blue Mortgage Market Indices (OBMMI)"
          src={OBMMI_URL}
          className="h-full min-h-[calc(100dvh-52px)] w-full border-0"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </main>
    </div>
  )
}
