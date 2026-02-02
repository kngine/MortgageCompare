import { CheckCircle2 } from "lucide-react"
import type { MortgageResult } from "../hooks/useMortgageCalculator"
import { formatCurrencyPrecise, formatNumber } from "../utils/format"
import type { MortgageMode } from "./MortgageForm"

export type ScenarioResult = {
  id: string
  label: string
  rate: number
  result: MortgageResult
}

type ComparisonTableProps = {
  mode: MortgageMode
  scenarios: ScenarioResult[]
  closingCosts: number
}

export const ComparisonTable = ({
  mode,
  scenarios,
  closingCosts,
}: ComparisonTableProps) => {
  const payments = scenarios.map((scenario) => scenario.result.monthlyPayment)
  const lowestPayment = Math.min(...payments)
  const baselinePayment = scenarios[0]?.result.monthlyPayment ?? 0

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Scenario Comparison</h2>
        <p className="text-sm text-slate-500">
          Compare payments, interest totals, and refinance break-even timing.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Scenario</th>
              <th className="px-3 py-2">Rate</th>
              <th className="px-3 py-2">Monthly Payment</th>
              <th className="px-3 py-2">Total Interest</th>
              {mode === "refinance" && <th className="px-3 py-2">Break-Even</th>}
            </tr>
          </thead>
          <tbody>
            {scenarios.map((scenario) => {
              const savings = baselinePayment - scenario.result.monthlyPayment
              const breakEvenMonths =
                mode === "refinance" && savings > 0 && closingCosts > 0
                  ? Math.ceil(closingCosts / savings)
                  : null
              const isLowestPayment = scenario.result.monthlyPayment === lowestPayment

              return (
                <tr
                  key={scenario.id}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <td className="px-3 py-3 font-medium text-slate-800">
                    {scenario.label}
                  </td>
                  <td className="px-3 py-3 text-slate-600">
                    {formatNumber(scenario.rate)}%
                  </td>
                  <td className="px-3 py-3 text-slate-800">
                    <div className="flex items-center gap-2">
                      {formatCurrencyPrecise(scenario.result.monthlyPayment)}
                      {isLowestPayment && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Lowest
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-slate-600">
                    {formatCurrencyPrecise(scenario.result.totalInterest)}
                  </td>
                  {mode === "refinance" && (
                    <td className="px-3 py-3 text-slate-600">
                      {scenario === scenarios[0]
                        ? "Baseline"
                        : breakEvenMonths
                          ? `${breakEvenMonths} mo`
                          : "—"}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {mode === "refinance" && (
        <p className="mt-4 text-xs text-slate-500">
          Break-even compares each scenario against Scenario 1 using closing
          costs and monthly savings.
        </p>
      )}
    </section>
  )
}
