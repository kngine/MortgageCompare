import { DollarSign, Percent } from "lucide-react"

export type MortgageMode = "purchase" | "refinance"

type MortgageFormProps = {
  mode: MortgageMode
  onModeChange: (mode: MortgageMode) => void
  homePrice: number
  downPaymentType: "percent" | "amount"
  downPaymentValue: number
  currentBalance: number
  closingCosts: number
  baseRate: number
  termYears: number
  loanAmount: number
  onHomePriceChange: (value: number) => void
  onDownPaymentTypeChange: (value: "percent" | "amount") => void
  onDownPaymentValueChange: (value: number) => void
  onCurrentBalanceChange: (value: number) => void
  onClosingCostsChange: (value: number) => void
  onBaseRateChange: (value: number) => void
  onTermYearsChange: (value: number) => void
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
}) => (
  <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
    {label}
    <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-slate-400">
      {prefix && <span className="text-slate-400">{prefix}</span>}
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full bg-transparent text-base text-slate-900 outline-none"
        step={step}
        min={0}
      />
      {suffix && <span className="text-slate-400">{suffix}</span>}
    </div>
  </label>
)

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
    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
      active
        ? "bg-slate-900 text-white shadow"
        : "bg-white text-slate-600 hover:bg-slate-100"
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
  closingCosts,
  baseRate,
  termYears,
  loanAmount,
  onHomePriceChange,
  onDownPaymentTypeChange,
  onDownPaymentValueChange,
  onCurrentBalanceChange,
  onClosingCostsChange,
  onBaseRateChange,
  onTermYearsChange,
}: MortgageFormProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Mortgage Inputs</h2>
          <p className="text-sm text-slate-500">
            Switch between purchase and refinance to compare scenarios.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1">
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

      <div className="mt-6 grid gap-5 md:grid-cols-2">
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
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onDownPaymentTypeChange("percent")}
                  className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                    downPaymentType === "percent"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Percent className="mr-2 inline h-4 w-4" />
                  Percent
                </button>
                <button
                  type="button"
                  onClick={() => onDownPaymentTypeChange("amount")}
                  className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                    downPaymentType === "amount"
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <DollarSign className="mr-2 inline h-4 w-4" />
                  Amount
                </button>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <input
                  type="number"
                  value={Number.isFinite(downPaymentValue) ? downPaymentValue : 0}
                  onChange={(event) => onDownPaymentValueChange(Number(event.target.value))}
                  className="w-full bg-transparent text-base text-slate-900 outline-none"
                  step={downPaymentType === "percent" ? "0.1" : "1000"}
                  min={0}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <InputField
              label="Current Balance"
              value={currentBalance}
              onChange={onCurrentBalanceChange}
              prefix="$"
              step="1000"
            />
            <InputField
              label="Estimated Closing Costs"
              value={closingCosts}
              onChange={onClosingCostsChange}
              prefix="$"
              step="500"
            />
          </>
        )}

        <InputField
          label={mode === "purchase" ? "Interest Rate" : "New Rate"}
          value={baseRate}
          onChange={onBaseRateChange}
          suffix="%"
          step="0.01"
        />
        <InputField
          label="Loan Term (Years)"
          value={termYears}
          onChange={onTermYearsChange}
          step="1"
        />
      </div>

      <div className="mt-6 rounded-xl bg-slate-50 px-4 py-3">
        <p className="text-sm text-slate-500">Estimated Loan Amount</p>
        <p className="text-2xl font-semibold text-slate-900">
          ${Math.max(0, Math.round(loanAmount)).toLocaleString("en-US")}
        </p>
      </div>
    </section>
  )
}
