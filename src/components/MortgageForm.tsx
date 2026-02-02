import { useState } from "react"
import { DollarSign, Percent } from "lucide-react"

export type MortgageMode = "purchase" | "refinance"

type MortgageFormProps = {
  mode: MortgageMode
  onModeChange: (mode: MortgageMode) => void
  homePrice: number
  downPaymentType: "percent" | "amount"
  downPaymentValue: number
  currentBalance: number
  loanAmount: number
  onHomePriceChange: (value: number) => void
  onDownPaymentTypeChange: (value: "percent" | "amount") => void
  onDownPaymentValueChange: (value: number) => void
  onCurrentBalanceChange: (value: number) => void
}

const InputField = ({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = "0.01",
}: {
  label: string
  value: number
  onChange: (value: number) => void
  prefix?: string
  suffix?: string
  step?: string
}) => {
  const [localStr, setLocalStr] = useState<string | undefined>(undefined)
  const displayValue =
    localStr !== undefined ? localStr : (Number.isFinite(value) ? String(value) : "")
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
      {label}
      <div className="flex min-h-[48px] touch-manipulation items-center rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
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
          className="min-h-[44px] w-full flex-1 bg-transparent text-base text-slate-900 outline-none"
          step={step}
        />
        {suffix && <span className="text-slate-400">{suffix}</span>}
      </div>
    </label>
  )
}

const DownPaymentInput = ({
  value,
  onChange,
  step,
}: {
  value: number
  onChange: (v: number) => void
  step: string
}) => {
  const [localStr, setLocalStr] = useState<string | undefined>(undefined)
  const displayValue =
    localStr !== undefined ? localStr : (Number.isFinite(value) ? String(value) : "")
  return (
    <div className="flex min-h-[48px] items-center rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500">
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
        className="min-h-[44px] w-full touch-manipulation bg-transparent text-base text-slate-900 outline-none"
        step={step}
      />
    </div>
  )
}

const TogglePill = ({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`min-h-[44px] min-w-[44px] touch-manipulation rounded-full px-5 py-2.5 text-sm font-semibold transition active:opacity-90 ${
      active
        ? "bg-teal-600 text-white shadow"
        : "bg-white text-slate-600 hover:bg-slate-100 active:bg-slate-100"
    }`}
  >
    {label}
  </button>
)

export const MortgageForm = ({
  mode,
  onModeChange,
  homePrice,
  downPaymentType,
  downPaymentValue,
  currentBalance,
  loanAmount,
  onHomePriceChange,
  onDownPaymentTypeChange,
  onDownPaymentValueChange,
  onCurrentBalanceChange,
}: MortgageFormProps) => {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
            Mortgage Inputs
          </h2>
          <p className="text-sm text-slate-500">
            {mode === "purchase"
              ? "Home price and down payment set your loan amount."
              : "Current balance is your loan amount (closing costs are separate)."}
          </p>
        </div>
        <div className="w-fit shrink-0 self-start rounded-full bg-slate-100 p-1">
          <div className="flex items-center gap-2">
            <TogglePill
              active={mode === "purchase"}
              label="Purchase"
              onClick={() => onModeChange("purchase")}
            />
            <TogglePill
              active={mode === "refinance"}
              label="Refinance"
              onClick={() => onModeChange("refinance")}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {mode === "purchase" ? (
          <>
            <InputField
              label="Home Price"
              value={homePrice}
              onChange={onHomePriceChange}
              prefix="$"
              step="1000"
            />
            <div className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Down Payment
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onDownPaymentTypeChange("percent")}
                  className={`min-h-[48px] touch-manipulation rounded-xl border px-3 py-3 text-sm font-semibold transition active:opacity-90 ${
                    downPaymentType === "percent"
                      ? "border-teal-600 bg-teal-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 active:bg-slate-100 hover:bg-slate-100"
                  }`}
                >
                  <Percent className="mr-2 inline h-4 w-4" />
                  Percent
                </button>
                <button
                  type="button"
                  onClick={() => onDownPaymentTypeChange("amount")}
                  className={`min-h-[48px] touch-manipulation rounded-xl border px-3 py-3 text-sm font-semibold transition active:opacity-90 ${
                    downPaymentType === "amount"
                      ? "border-teal-600 bg-teal-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 active:bg-slate-100 hover:bg-slate-100"
                  }`}
                >
                  <DollarSign className="mr-2 inline h-4 w-4" />
                  Amount
                </button>
              </div>
              <DownPaymentInput
                value={downPaymentValue}
                onChange={onDownPaymentValueChange}
                step={downPaymentType === "percent" ? "0.1" : "1000"}
              />
            </div>
          </>
        ) : (
          <InputField
            label="Current Balance"
            value={currentBalance}
            onChange={onCurrentBalanceChange}
            prefix="$"
            step="1000"
          />
        )}
      </div>

      <div className="mt-6 rounded-xl bg-teal-50 px-4 py-3">
        <p className="text-sm text-teal-800/80">Loan Amount</p>
        <p className="text-xl font-semibold tabular-nums text-teal-900 sm:text-2xl">
          ${Math.max(0, Math.round(loanAmount)).toLocaleString("en-US")}
        </p>
      </div>
    </section>
  )
}
