import type { ScenarioResult } from "./ComparisonTable"
import { formatCurrencyPrecise } from "../utils/format"

type PaymentScheduleProps = {
  scenarios: ScenarioResult[]
  selectedScenarioId: string
  onScenarioChange: (id: string) => void
  loanAmount: number
}

const MAX_ROWS = 12

export const PaymentSchedule = ({
  scenarios,
  selectedScenarioId,
  onScenarioChange,
  loanAmount,
}: PaymentScheduleProps) => {
  const selectedScenario =
    scenarios.find((s) => s.id === selectedScenarioId) ?? scenarios[0]
  const schedule = selectedScenario?.result.schedule ?? []
  const rows = [
    { month: 0, paidInterest: 0, balance: loanAmount, paidPrincipal: 0 },
    ...schedule.slice(0, MAX_ROWS).map((point) => ({
      month: point.month,
      paidInterest: point.interest,
      balance: point.balance,
      paidPrincipal: point.principal,
    })),
  ]

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
            Payment Schedule
          </h3>
          <p className="text-sm text-slate-500">
            Month-by-month: paid interest, balance, paid principal (first{" "}
            {MAX_ROWS} months).
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

      <div className="scroll-touch mt-6 -mx-4 overflow-x-auto overscroll-x-contain px-4 sm:mx-0 sm:px-0">
        <table className="min-w-[400px] w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <th className="min-w-[72px] px-3 py-2">Month</th>
              <th className="min-w-[100px] px-3 py-2">Paid interest</th>
              <th className="min-w-[100px] px-3 py-2">Balance</th>
              <th className="min-w-[100px] px-3 py-2">Paid principal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.month}
                className="border-b border-slate-100 last:border-b-0"
              >
                <td className="min-w-[72px] px-3 py-2 font-medium tabular-nums text-slate-800">
                  {row.month}
                </td>
                <td className="min-w-[100px] px-3 py-2 tabular-nums text-slate-600">
                  {formatCurrencyPrecise(row.paidInterest)}
                </td>
                <td className="min-w-[100px] px-3 py-2 tabular-nums text-slate-600">
                  {formatCurrencyPrecise(row.balance)}
                </td>
                <td className="min-w-[100px] px-3 py-2 tabular-nums text-slate-600">
                  {formatCurrencyPrecise(row.paidPrincipal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
