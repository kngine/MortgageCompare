const STORAGE_KEY = "mortgage-compare-state"

export type ScenarioInput = {
  id: string
  label: string
  rate: number
  termYears: number
  closingCosts: number
}

export type SavedMortgageState = {
  mode: "purchase" | "refinance"
  homePrice: number
  downPaymentType: "percent" | "amount"
  downPaymentValue: number
  currentBalance: number
  scenarios: ScenarioInput[]
  selectedScenarioId: string
}

const defaultScenarios: ScenarioInput[] = [
  { id: "scenario-1", label: "Scenario 1", rate: 6.35, termYears: 30, closingCosts: 0 },
]

function getDefaultState(): SavedMortgageState {
  return {
    mode: "purchase",
    homePrice: 550000,
    downPaymentType: "percent",
    downPaymentValue: 20,
    currentBalance: 320000,
    scenarios: defaultScenarios.map((s) => ({ ...s })),
    selectedScenarioId: "scenario-1",
  }
}

function isMortgageMode(value: unknown): value is "purchase" | "refinance" {
  return value === "purchase" || value === "refinance"
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value)
}

function isScenarioInput(value: unknown): value is ScenarioInput {
  if (!value || typeof value !== "object") return false
  const o = value as Record<string, unknown>
  return (
    typeof o.id === "string" &&
    typeof o.label === "string" &&
    isNumber(o.rate) &&
    isNumber(o.termYears) &&
    isNumber(o.closingCosts)
  )
}

function parseScenarios(value: unknown): ScenarioInput[] {
  if (!Array.isArray(value) || value.length === 0) return [...defaultScenarios]
  const out: ScenarioInput[] = []
  for (let i = 0; i < value.length; i++) {
    const item = value[i]
    if (isScenarioInput(item)) {
      out.push({
        id: item.id || `scenario-${i + 1}`,
        label: item.label || `Scenario ${i + 1}`,
        rate: item.rate,
        termYears: Math.max(1, Math.round(item.termYears)),
        closingCosts: item.closingCosts,
      })
    } else {
      out.push({
        id: `scenario-${i + 1}`,
        label: `Scenario ${i + 1}`,
        rate: defaultScenarios[0]?.rate ?? 6.35,
        termYears: 30,
        closingCosts: 0,
      })
    }
  }
  return out.length > 0 ? out : [...defaultScenarios]
}

/** Migrate from old storage shape (baseRate, extraRates, termYears, closingCosts) to new scenarios array */
function migrateFromOldFormat(parsed: Record<string, unknown>): SavedMortgageState | null {
  const hasOld =
    isNumber(parsed.baseRate) ||
    (Array.isArray(parsed.extraRates) && parsed.extraRates.length > 0) ||
    isNumber(parsed.termYears)
  if (!hasOld) return null

  const baseRate = isNumber(parsed.baseRate) ? parsed.baseRate : 6.35
  const termYears = isNumber(parsed.termYears) ? Math.max(1, Math.round(parsed.termYears)) : 30
  const closingCosts = isNumber(parsed.closingCosts) ? parsed.closingCosts : 0
  const extraRates = Array.isArray(parsed.extraRates) ? parsed.extraRates.filter(isNumber) : []

  const scenarios: ScenarioInput[] = [
    { id: "scenario-1", label: "Scenario 1", rate: baseRate, termYears, closingCosts },
  ]
  extraRates.forEach((rate, i) => {
    scenarios.push({
      id: `scenario-${i + 2}`,
      label: `Scenario ${i + 2}`,
      rate,
      termYears,
      closingCosts: 0,
    })
  })

  const def = getDefaultState()
  return {
    mode: isMortgageMode(parsed.mode) ? parsed.mode : def.mode,
    homePrice: isNumber(parsed.homePrice) ? parsed.homePrice : def.homePrice,
    downPaymentType:
      parsed.downPaymentType === "percent" || parsed.downPaymentType === "amount"
        ? parsed.downPaymentType
        : def.downPaymentType,
    downPaymentValue: isNumber(parsed.downPaymentValue)
      ? parsed.downPaymentValue
      : def.downPaymentValue,
    currentBalance: isNumber(parsed.currentBalance)
      ? parsed.currentBalance
      : def.currentBalance,
    scenarios,
    selectedScenarioId:
      typeof parsed.selectedScenarioId === "string"
        ? parsed.selectedScenarioId
        : def.selectedScenarioId,
  }
}

export function loadMortgageState(): SavedMortgageState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultState()

    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== "object") return getDefaultState()

    const asRecord = parsed as Record<string, unknown>
    const def = getDefaultState()

    const migrated = migrateFromOldFormat(asRecord)
    if (migrated) return migrated

    const scenarios = parseScenarios(asRecord.scenarios)
    return {
      mode: isMortgageMode(asRecord.mode) ? asRecord.mode : def.mode,
      homePrice: isNumber(asRecord.homePrice) ? asRecord.homePrice : def.homePrice,
      downPaymentType:
        asRecord.downPaymentType === "percent" || asRecord.downPaymentType === "amount"
          ? asRecord.downPaymentType
          : def.downPaymentType,
      downPaymentValue: isNumber(asRecord.downPaymentValue)
        ? asRecord.downPaymentValue
        : def.downPaymentValue,
      currentBalance: isNumber(asRecord.currentBalance)
        ? asRecord.currentBalance
        : def.currentBalance,
      scenarios,
      selectedScenarioId:
        typeof asRecord.selectedScenarioId === "string"
          ? asRecord.selectedScenarioId
          : def.selectedScenarioId,
    }
  } catch {
    return getDefaultState()
  }
}

export function saveMortgageState(state: SavedMortgageState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

