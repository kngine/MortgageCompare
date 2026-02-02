import { useEffect, useMemo, useState } from "react"
import { MortgageForm, type MortgageMode } from "./components/MortgageForm"
import { useMortgageCalculator } from "./hooks/useMortgageCalculator"
import { ComparisonTable } from "./components/ComparisonTable"
import { Charts } from "./components/Charts"
import { formatCurrencyPrecise } from "./utils/format"

const MAX_SCENARIOS = 3

const toNumber = (value: number) => (Number.isFinite(value) ? value : 0)

function App() {
  const { calculate } = useMortgageCalculator()

  const [mode, setMode] = useState<MortgageMode>("purchase")
  const [homePrice, setHomePrice] = useState(550000)
  const [downPaymentType, setDownPaymentType] = useState<"percent" | "amount">(
    "percent"
  )
  const [downPaymentValue, setDownPaymentValue] = useState(20)
  const [currentBalance, setCurrentBalance] = useState(320000)
  const [closingCosts, setClosingCosts] = useState(8000)
  const [baseRate, setBaseRate] = useState(6.35)
  const [termYears, setTermYears] = useState(30)
  const [extraRates, setExtraRates] = useState<number[]>([])
  const [selectedScenarioId, setSelectedScenarioId] = useState("scenario-1")

  const downPaymentAmount =
    downPaymentType === "percent"
      ? (toNumber(homePrice) * toNumber(downPaymentValue)) / 100
      : toNumber(downPaymentValue)

  const loanAmount =
    mode === "purchase"
      ? Math.max(0, toNumber(homePrice) - downPaymentAmount)
      : Math.max(0, toNumber(currentBalance) + toNumber(closingCosts))

  const scenarioRates = [baseRate, ...extraRates].slice(0, MAX_SCENARIOS)

  const scenarios = useMemo(
    () =>
      scenarioRates.map((rate, index) => ({
        id: `scenario-${index + 1}`,
        label: `Scenario ${index + 1}`,
        rate,
        result: calculate({
          principal: loanAmount,
          annualRate: rate,
          termYears,
        }),
      })),
    [calculate, loanAmount, scenarioRates, termYears]
  )

  useEffect(() => {
    if (!scenarios.find((scenario) => scenario.id === selectedScenarioId)) {
      setSelectedScenarioId(scenarios[0]?.id ?? "scenario-1")
    }
  }, [scenarios, selectedScenarioId])

  const addScenario = () => {
    setExtraRates((prev) => {
      if (prev.length + 1 >= MAX_SCENARIOS) return prev
      const nextRate = Math.max(0, baseRate + (prev.length + 1) * 0.5)
      return [...prev, Number(nextRate.toFixed(2))]
    })
  }

  const updateExtraRate = (index: number, value: number) => {
    setExtraRates((prev) => prev.map((rate, i) => (i === index ? value : rate)))
  }

  const removeExtraRate = (index: number) => {
    setExtraRates((prev) => prev.filter((_, i) => i !== index))
  }

  const monthlyPayment =
    scenarios[0]?.result.monthlyPayment && loanAmount > 0
      ? scenarios[0].result.monthlyPayment
      : 0

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Mortgage Analyzer
              </p>
              <h1 className="text-3xl font-semibold text-slate-900">
                Compare Mortgage Scenarios Side-by-Side
              </h1>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
              <p className="text-xs text-slate-500">Scenario 1 Monthly Payment</p>
              <p className="text-2xl font-semibold text-slate-900">
                {formatCurrencyPrecise(monthlyPayment)}
              </p>
            </div>
          </div>
          <p className="max-w-3xl text-sm text-slate-600">
            Adjust loan inputs, add interest-rate scenarios, and review total costs,
            monthly payments, and amortization trends before making a decision.
          </p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <MortgageForm
            mode={mode}
            onModeChange={setMode}
            homePrice={homePrice}
            downPaymentType={downPaymentType}
            downPaymentValue={downPaymentValue}
            currentBalance={currentBalance}
            closingCosts={closingCosts}
            baseRate={baseRate}
            termYears={termYears}
            loanAmount={loanAmount}
            onHomePriceChange={setHomePrice}
            onDownPaymentTypeChange={setDownPaymentType}
            onDownPaymentValueChange={setDownPaymentValue}
            onCurrentBalanceChange={setCurrentBalance}
            onClosingCostsChange={setClosingCosts}
            onBaseRateChange={setBaseRate}
            onTermYearsChange={setTermYears}
          />

          <div className="flex flex-col gap-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Rate Scenarios
                  </h2>
                  <p className="text-sm text-slate-500">
                    Add up to {MAX_SCENARIOS} rates to compare.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addScenario}
                  disabled={scenarioRates.length >= MAX_SCENARIOS}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Add Scenario
                </button>
              </div>

              <div className="mt-5 grid gap-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Scenario 1
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    Base rate from the form.
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {baseRate.toFixed(2)}%
                  </p>
                </div>

                {extraRates.map((rate, index) => (
                  <div
                    key={`extra-${index}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
                  >
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Scenario {index + 2}
                      </p>
                      <input
                        type="number"
                        value={rate}
                        onChange={(event) =>
                          updateExtraRate(index, Number(event.target.value))
                        }
                        className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400"
                        step="0.01"
                        min={0}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExtraRate(index)}
                      className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Loan Summary
              </h2>
              <div className="mt-4 grid gap-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Loan Amount</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrencyPrecise(loanAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Loan Term</span>
                  <span className="font-semibold text-slate-900">
                    {termYears} years
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Scenario Count</span>
                  <span className="font-semibold text-slate-900">
                    {scenarioRates.length}
                  </span>
                </div>
                {mode === "refinance" && (
                  <div className="flex items-center justify-between">
                    <span>Estimated Closing Costs</span>
                    <span className="font-semibold text-slate-900">
                      {formatCurrencyPrecise(closingCosts)}
                    </span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        <div className="mt-8">
          <ComparisonTable
            mode={mode}
            scenarios={scenarios}
            closingCosts={closingCosts}
          />
        </div>

        <div className="mt-8">
          <Charts
            scenarios={scenarios}
            selectedScenarioId={selectedScenarioId}
            onScenarioChange={setSelectedScenarioId}
          />
        </div>
      </div>
    </div>
  )
}

export default App
