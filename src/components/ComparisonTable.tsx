import { CheckCircle2 } from "lucide-react"
import type { MortgageResult } from "../hooks/useMortgageCalculator"
import { formatCurrencyPrecise, formatRate } from "../utils/format"
export type ScenarioResult = {
  id: string
  label: string
  rate: number
  termYears: number
  closingCosts: number
  result: MortgageResult
  totalCost: number // result.totalPaid + closingCosts
}

type ComparisonTableProps = {
  scenarios: ScenarioResult[]
}

export const ComparisonTable = ({ scenarios }: ComparisonTableProps) => {
  const payments = scenarios.map((s) => s.result.monthlyPayment)
  const totalInterests = scenarios.map((s) => s.result.totalInterest)
  const totalCosts = scenarios.map((s) => s.totalCost)
  const lowestPayment = Math.min(...payments, Infinity)
  const lowestTotalInterest = Math.min(...totalInterests, Infinity)
  const lowestTotalCost = Math.min(...totalCosts, Infinity)

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
          Comparison
        </h2>
        <p className="text-sm text-slate-500">
          Monthly payment, interest, closing cost, and total cost.
        </p>
      </div>

      <div className="scroll-touch mt-6 -mx-4 overflow-x-auto overscroll-x-contain px-4 sm:mx-0 sm:px-0">
        <table className="min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <th className="min-w-[88px] px-3 py-3 sm:py-2">Scenario</th>
              <th className="min-w-[56px] px-3 py-3 sm:py-2">Rate</th>
              <th className="min-w-[56px] px-3 py-3 sm:py-2">Term</th>
              <th className="min-w-[100px] px-3 py-3 sm:py-2">Monthly</th>
              <th className="min-w-[100px] px-3 py-3 sm:py-2">Total Interest</th>
              <th className="min-w-[90px] px-3 py-3 sm:py-2">Closing</th>
              <th className="min-w-[100px] px-3 py-3 sm:py-2">Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((scenario) => {
              const isLowestPayment =
                scenario.result.monthlyPayment === lowestPayment
              const isLowestTotalInterest =
                scenario.result.totalInterest === lowestTotalInterest
              const isLowestTotalCost =
                scenario.totalCost === lowestTotalCost

              return (
                <tr
                  key={scenario.id}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <td className="min-w-[88px] px-3 py-3 font-medium text-slate-800">
                    {scenario.label}
                  </td>
                  <td className="min-w-[56px] px-3 py-3 tabular-nums text-slate-600">
                    {formatRate(scenario.rate)}%
                  </td>
                  <td className="min-w-[56px] px-3 py-3 tabular-nums text-slate-600">
                    {scenario.termYears} yr
                  </td>
                  <td className="min-w-[100px] px-3 py-3 text-slate-800">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="tabular-nums">
                        {formatCurrencyPrecise(scenario.result.monthlyPayment)}
                      </span>
                      {isLowestPayment && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                          Lowest
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="min-w-[100px] px-3 py-3 text-slate-800">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="tabular-nums text-slate-600">
                        {formatCurrencyPrecise(scenario.result.totalInterest)}
                      </span>
                      {isLowestTotalInterest && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                          Lowest
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="min-w-[90px] px-3 py-3 tabular-nums text-slate-600">
                    {formatCurrencyPrecise(scenario.closingCosts)}
                  </td>
                  <td className="min-w-[100px] px-3 py-3 font-medium text-slate-800">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="tabular-nums">
                        {formatCurrencyPrecise(scenario.totalCost)}
                      </span>
                      {isLowestTotalCost && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700">
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                          Lowest
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
