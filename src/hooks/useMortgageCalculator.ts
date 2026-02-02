import { useCallback } from "react"

export type MortgageInputs = {
  principal: number
  annualRate: number
  termYears: number
}

export type AmortizationPoint = {
  month: number
  principal: number
  interest: number
  balance: number
  cumulativeInterest: number
}

export type MortgageResult = {
  monthlyPayment: number
  totalInterest: number
  totalPaid: number
  schedule: AmortizationPoint[]
}

const clampNumber = (value: number) => (Number.isFinite(value) ? value : 0)

export const calculateMortgage = ({
  principal,
  annualRate,
  termYears,
}: MortgageInputs): MortgageResult => {
  const safePrincipal = Math.max(0, clampNumber(principal))
  const safeRate = Math.max(0, clampNumber(annualRate))
  const safeTermYears = Math.max(1, Math.floor(clampNumber(termYears)))

  const monthlyRate = safeRate / 100 / 12
  const totalMonths = safeTermYears * 12

  let monthlyPayment = 0
  if (monthlyRate === 0) {
    monthlyPayment = safePrincipal / totalMonths
  } else {
    const factor = Math.pow(1 + monthlyRate, totalMonths)
    monthlyPayment = safePrincipal * ((monthlyRate * factor) / (factor - 1))
  }

  const schedule: AmortizationPoint[] = []
  let balance = safePrincipal
  let cumulativeInterest = 0

  for (let month = 1; month <= totalMonths; month += 1) {
    const interest = balance * monthlyRate
    const principalPaid = Math.max(0, monthlyPayment - interest)
    balance = Math.max(0, balance - principalPaid)
    cumulativeInterest += interest

    schedule.push({
      month,
      principal: principalPaid,
      interest,
      balance,
      cumulativeInterest,
    })
  }

  const totalPaid = monthlyPayment * totalMonths
  const totalInterest = totalPaid - safePrincipal

  return {
    monthlyPayment,
    totalInterest,
    totalPaid,
    schedule,
  }
}

export const useMortgageCalculator = () => {
  const calculate = useCallback(calculateMortgage, [])
  return { calculate }
}
