import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { ScenarioResult } from "./ComparisonTable"
import { formatCurrency, formatCurrencyPrecise } from "../utils/format"

type ChartsProps = {
  scenarios: ScenarioResult[]
  selectedScenarioId: string
  onScenarioChange: (id: string) => void
}

export const Charts = ({
  scenarios,
  selectedScenarioId,
  onScenarioChange,
}: ChartsProps) => {
  const barData = scenarios.map((scenario) => ({
    name: scenario.label,
    totalPaid: Math.round(scenario.result.totalPaid),
    totalInterest: Math.round(scenario.result.totalInterest),
  }))

  const selectedScenario =
    scenarios.find((scenario) => scenario.id === selectedScenarioId) ??
    scenarios[0]

  const scheduleData =
    selectedScenario?.result.schedule.map((point) => ({
      month: point.month,
      principal: Math.round(point.principal),
      interest: Math.round(point.interest),
    })) ?? []

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Total Cost Comparison
            </h3>
            <p className="text-sm text-slate-500">
              Life-of-loan costs across scenarios.
            </p>
          </div>
        </div>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                formatter={(value: number) => formatCurrencyPrecise(value)}
                cursor={{ fill: "rgba(148, 163, 184, 0.15)" }}
              />
              <Legend />
              <Bar dataKey="totalPaid" name="Total Paid" fill="#0f172a" radius={[6, 6, 0, 0]} />
              <Bar
                dataKey="totalInterest"
                name="Total Interest"
                fill="#38bdf8"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Amortization Schedule
            </h3>
            <p className="text-sm text-slate-500">
              Principal vs. interest over time.
            </p>
          </div>
          <select
            value={selectedScenario?.id}
            onChange={(event) => onScenarioChange(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
          >
            {scenarios.map((scenario) => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scheduleData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                formatter={(value: number) => formatCurrencyPrecise(value)}
                cursor={{ stroke: "#cbd5f5" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="principal"
                name="Principal"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="interest"
                name="Interest"
                stroke="#f97316"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
