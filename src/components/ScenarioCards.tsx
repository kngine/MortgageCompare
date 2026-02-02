import { useState } from "react"
import { Trash2 } from "lucide-react"
import type { ScenarioInput } from "../utils/storage"

export type MortgageMode = "purchase" | "refinance"

type ScenarioCardsProps = {
  mode: MortgageMode
  scenarios: ScenarioInput[]
  onUpdate: (index: number, updates: Partial<ScenarioInput>) => void
  onAdd: () => void
  onRemove: (index: number) => void
  maxScenarios: number
}

const Input = ({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = "1",
  min,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  prefix?: string
  suffix?: string
  step?: string
  min?: number
}) => {
  const [localStr, setLocalStr] = useState<string | undefined>(undefined)
  const displayValue =
    localStr !== undefined ? localStr : (Number.isFinite(value) ? String(value) : "")
  return (
    <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-600">
      {label}
      <div className="flex min-h-[44px] touch-manipulation items-center rounded-lg border border-slate-200 bg-white px-3 py-2 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
        {prefix && <span className="text-slate-400">{prefix}</span>}
        <input
          type="number"
          value={displayValue}
          onChange={(e) => setLocalStr(e.target.value)}
          onFocus={() => setLocalStr(Number.isFinite(value) ? String(value) : "")}
          onBlur={() => {
            const raw = localStr ?? ""
            const num = raw === "" || raw === "-" ? 0 : parseFloat(raw)
            onChange(Number.isFinite(num) ? num : 0)
            setLocalStr(undefined)
          }}
          className="w-full flex-1 bg-transparent text-sm text-slate-900 outline-none"
          step={step}
          {...(min !== undefined ? { min } : {})}
        />
        {suffix && <span className="text-slate-400">{suffix}</span>}
      </div>
    </label>
  )
}

export const ScenarioCards = ({
  mode: _mode,
  scenarios,
  onUpdate,
  onAdd,
  onRemove,
  maxScenarios,
}: ScenarioCardsProps) => {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
            Scenarios
          </h2>
          <p className="text-sm text-slate-500">
            Each scenario has its own rate, term, and closing cost (negative = credit).
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          disabled={scenarios.length >= maxScenarios}
          className="min-h-[44px] touch-manipulation shrink-0 rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow transition active:bg-teal-700 hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:bg-slate-300"
        >
          Add Scenario
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((scenario, index) => (
          <div
            key={scenario.id}
            className="flex flex-col gap-4 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800">
                {scenario.label}
              </span>
              {scenarios.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="touch-manipulation rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                  aria-label={`Remove ${scenario.label}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid gap-3">
              <Input
                label="Rate (%)"
                value={scenario.rate}
                onChange={(v) => onUpdate(index, { rate: v })}
                suffix="%"
                step="0.01"
                min={0}
              />
              <Input
                label="Loan Term (Years)"
                value={scenario.termYears}
                onChange={(v) => onUpdate(index, { termYears: Math.max(1, Math.round(v)) })}
                step="1"
              />
              <Input
                label="Estimated Closing Costs"
                value={scenario.closingCosts}
                onChange={(v) => onUpdate(index, { closingCosts: v })}
                prefix="$"
                step="500"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
