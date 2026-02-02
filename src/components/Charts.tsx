import {
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
  const selectedScenario =
    scenarios.find((s) => s.id === selectedScenarioId) ?? scenarios[0]
  const scenario1 = scenarios[0]
  const isNotScenario1 = scenario1 && selectedScenario && selectedScenario.id !== scenario1.id

  const scheduleData =
    selectedScenario?.result.schedule.map((point) => ({
      month: point.month,
      principal: Math.round(point.principal),
      interest: Math.round(point.interest),
    })) ?? []

  const loanAmount = selectedScenario?.result.schedule[0]
    ? selectedScenario.result.schedule[0].balance +
      selectedScenario.result.schedule[0].principal
    : 0
  const scenario1MonthlyPay = scenario1?.result.monthlyPayment ?? 0
  const scenario1Schedule = scenario1?.result.schedule ?? []
  const scenario1ClosingCosts = scenario1?.closingCosts ?? 0
  const breakEvenThreshold = (selectedScenario?.closingCosts ?? 0) - scenario1ClosingCosts

  const paymentScheduleRows = selectedScenario
    ? (() => {
        const base = [
          { month: 0, paidInterest: 0, balance: loanAmount, paidPrincipal: 0 },
          ...selectedScenario.result.schedule.map((point) => ({
            month: point.month,
            paidInterest: point.interest,
            balance: point.balance,
            paidPrincipal: point.principal,
          })),
        ]
        if (!isNotScenario1) return base
        const monthlyPay = selectedScenario.result.monthlyPayment
        const rowsWithSaving = base.map((row) => {
          const scenario1Balance =
            row.month === 0
              ? loanAmount
              : scenario1Schedule[row.month - 1]?.balance ?? 0
          const saving =
            (scenario1Balance - row.balance) +
            (scenario1MonthlyPay - monthlyPay) * row.month
          return { ...row, saving }
        })
        const breakEvenIndex =
          breakEvenThreshold > 0
            ? rowsWithSaving.findIndex((row) => (row as { saving: number }).saving >= breakEvenThreshold)
            : -1
        return rowsWithSaving.map((row, index) => ({
          ...row,
          isBreakEven: index === breakEvenIndex,
        }))
      })()
    : []

  return (
    <section className="flex flex-col gap-6">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
              Payment Schedule
            </h3>
            <p className="text-sm text-slate-500">
              Month-by-month: paid interest, balance, paid principal.
            </p>
          </div>
          <select
            value={selectedScenario?.id}
            onChange={(e) => onScenarioChange(e.target.value)}
            className="min-h-[44px] min-w-0 touch-manipulation flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-700 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 sm:max-w-[180px]"
          >
            {scenarios.map((scenario) => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.label}
              </option>
            ))}
          </select>
        </div>
        <div className="scroll-touch mt-6 max-h-[400px] overflow-y-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="min-w-full text-left text-sm">
            <thead className="sticky top-0 z-10 border-b border-slate-200 bg-white">
              <tr className="text-xs uppercase tracking-wide text-slate-500">
                <th className="min-w-[72px] py-3 pr-3">Month</th>
                <th className="min-w-[100px] py-3 pr-3">Paid interest</th>
                <th className="min-w-[100px] py-3 pr-3">Balance</th>
                <th className="min-w-[100px] py-3 pr-3">Paid principal</th>
                {isNotScenario1 && (
                  <th className="min-w-[100px] py-3 pr-3">Saving</th>
                )}
              </tr>
            </thead>
            <tbody>
              {paymentScheduleRows.map((row) => (
                <tr
                  key={row.month}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <td className="min-w-[72px] py-2 pr-3 tabular-nums font-medium text-slate-800">
                    {row.month}
                  </td>
                  <td className="min-w-[100px] py-2 pr-3 tabular-nums text-slate-600">
                    {formatCurrencyPrecise(row.paidInterest)}
                  </td>
                  <td className="min-w-[100px] py-2 pr-3 tabular-nums text-slate-600">
                    {formatCurrencyPrecise(row.balance)}
                  </td>
                  <td className="min-w-[100px] py-2 pr-3 tabular-nums text-slate-600">
                    {formatCurrencyPrecise(row.paidPrincipal)}
                  </td>
                  {isNotScenario1 && "saving" in row && typeof (row as { saving?: number }).saving === "number" && (
                    <td className="min-w-[100px] py-2 pr-3 text-slate-600">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="tabular-nums">
                          {formatCurrencyPrecise((row as { saving: number }).saving)}
                        </span>
                        {(row as { isBreakEven?: boolean }).isBreakEven && (
                          <span className="inline-flex rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700">
                            Break Even
                          </span>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isNotScenario1 && (
          <p className="mt-3 text-xs text-slate-500">
            Saving = how much less you owe vs Scenario 1 plus how much less you’ve paid so far vs Scenario 1. Positive = you’re ahead vs Scenario 1.
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
              Amortization Schedule
            </h3>
            <p className="text-sm text-slate-500">
              Principal vs. interest over time.
            </p>
          </div>
          <select
            value={selectedScenario?.id}
            onChange={(e) => onScenarioChange(e.target.value)}
            className="min-h-[44px] min-w-0 touch-manipulation flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-700 shadow-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 sm:max-w-[180px]"
          >
            {scenarios.map((scenario) => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-6 h-56 min-h-[220px] sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={scheduleData}
              margin={{ top: 16, right: 8, left: -8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                formatter={(value: number | undefined) =>
                  value != null ? formatCurrencyPrecise(value) : ""
                }
                cursor={{ stroke: "#99f6e4" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="principal"
                name="Principal"
                stroke="#0d9488"
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
