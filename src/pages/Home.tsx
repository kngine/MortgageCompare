import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { MortgageForm } from "../components/MortgageForm"
import { ScenarioCards } from "../components/ScenarioCards"
import { useMortgageCalculator } from "../hooks/useMortgageCalculator"
import { ComparisonTable } from "../components/ComparisonTable"
import { Charts } from "../components/Charts"
import { formatCurrencyPrecise } from "../utils/format"
import {
  loadMortgageState,
  saveMortgageState,
  type SavedMortgageState,
  type ScenarioInput,
} from "../utils/storage"
import type { ScenarioResult } from "../components/ComparisonTable"
import { TrendingUp } from "lucide-react"

const toNumber = (value: number) => (Number.isFinite(value) ? value : 0)

export function Home() {
  const { calculate } = useMortgageCalculator()
  const [state, setState] = useState<SavedMortgageState>(() => loadMortgageState())

  const {
    mode,
    homePrice,
    downPaymentType,
    downPaymentValue,
    currentBalance,
    scenarios: scenarioInputs,
    selectedScenarioId,
  } = state

  useEffect(() => {
    saveMortgageState(state)
  }, [state])

  const downPaymentAmount =
    downPaymentType === "percent"
      ? (toNumber(homePrice) * toNumber(downPaymentValue)) / 100
      : toNumber(downPaymentValue)

  const loanAmount =
    mode === "purchase"
      ? Math.max(0, toNumber(homePrice) - downPaymentAmount)
      : Math.max(0, toNumber(currentBalance))

  const scenarios: ScenarioResult[] = useMemo(
    () =>
      scenarioInputs.map((s) => {
        const result = calculate({
          principal: loanAmount,
          annualRate: s.rate,
          termYears: s.termYears,
        })
        return {
          id: s.id,
          label: s.label,
          rate: s.rate,
          termYears: s.termYears,
          closingCosts: s.closingCosts,
          result,
          totalCost: result.totalPaid + s.closingCosts,
        }
      }),
    [calculate, loanAmount, scenarioInputs]
  )

  useEffect(() => {
    if (!scenarios.find((s) => s.id === selectedScenarioId)) {
      setState((prev) => ({
        ...prev,
        selectedScenarioId: scenarios[0]?.id ?? "scenario-1",
      }))
    }
  }, [scenarios, selectedScenarioId])

  const updateScenario = (index: number, updates: Partial<ScenarioInput>) => {
    setState((prev) => ({
      ...prev,
      scenarios: prev.scenarios.map((s, i) =>
        i === index ? { ...s, ...updates } : s
      ),
    }))
  }

  const addScenario = () => {
    setState((prev) => {
      const last = prev.scenarios[prev.scenarios.length - 1]
      const nextRate = last ? last.rate + 0.5 : 6.35
      const nextId = `scenario-${prev.scenarios.length + 1}`
      const nextLabel = `Scenario ${prev.scenarios.length + 1}`
      return {
        ...prev,
        scenarios: [
          ...prev.scenarios,
          {
            id: nextId,
            label: nextLabel,
            rate: Number(nextRate.toFixed(2)),
            termYears: 30,
            closingCosts: 0,
          },
        ],
      }
    })
  }

  const removeScenario = (index: number) => {
    setState((prev) => {
      if (prev.scenarios.length <= 1) return prev
      const next = prev.scenarios.filter((_, i) => i !== index)
      const nextSelected =
        prev.selectedScenarioId === prev.scenarios[index]?.id
          ? next[0]?.id ?? "scenario-1"
          : prev.selectedScenarioId
      return {
        ...prev,
        scenarios: next,
        selectedScenarioId: nextSelected,
      }
    })
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-b from-slate-50 to-slate-100/80">
      <div
        className="mx-auto max-w-6xl px-4 py-6 sm:py-8 md:py-10"
        style={{ paddingTop: "max(1.5rem, env(safe-area-inset-top))" }}
      >
        <header className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-widest text-teal-600">
              Mortgage Compare
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Compare scenarios side-by-side
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Set your loan (purchase or refinance), then compare scenarios with
              different rates, terms, and closing costs.
            </p>
          </div>
        </header>

        <div className="mt-8 space-y-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <MortgageForm
              mode={mode}
              onModeChange={(v) => setState((prev) => ({ ...prev, mode: v }))}
              homePrice={homePrice}
              downPaymentType={downPaymentType}
              downPaymentValue={downPaymentValue}
              currentBalance={currentBalance}
              loanAmount={loanAmount}
              onHomePriceChange={(v) =>
                setState((prev) => ({ ...prev, homePrice: v }))
              }
              onDownPaymentTypeChange={(v) =>
                setState((prev) => ({ ...prev, downPaymentType: v }))
              }
              onDownPaymentValueChange={(v) =>
                setState((prev) => ({ ...prev, downPaymentValue: v }))
              }
              onCurrentBalanceChange={(v) =>
                setState((prev) => ({ ...prev, currentBalance: v }))
              }
            />

            <div className="flex flex-col gap-4">
              <Link
                to="/market"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800 shadow-sm transition hover:border-teal-300 hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                <TrendingUp className="h-4 w-4" aria-hidden />
                Market
              </Link>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                  Loan summary
                </h2>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Loan amount</span>
                    <span className="font-semibold tabular-nums text-slate-900">
                      {formatCurrencyPrecise(loanAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Scenarios</span>
                    <span className="font-semibold text-slate-900">
                      {scenarioInputs.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ScenarioCards
            mode={mode}
            scenarios={scenarioInputs}
            onUpdate={updateScenario}
            onAdd={addScenario}
            onRemove={removeScenario}
            maxScenarios={999}
          />

          <ComparisonTable scenarios={scenarios} />

          <Charts
            scenarios={scenarios}
            selectedScenarioId={selectedScenarioId}
            onScenarioChange={(id) =>
              setState((prev) => ({ ...prev, selectedScenarioId: id }))
            }
          />
        </div>
      </div>
    </div>
  )
}
