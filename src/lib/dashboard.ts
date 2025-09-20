interface MonthData {
  month: string;
  savings: number;
  income: number;
  expenses: number;
  rate: number;
  status: "positive" | "negative" | "neutral" | "pending";
  level: "gold" | "silver" | "bronze" | "danger" | "pending";
}

const rawMonthsData: Omit<
  MonthData,
  "savings" | "rate" | "status" | "level"
>[] = [
  { month: "January", income: 2200, expenses: 2050 }, // ~7% savings (0–20%)
  { month: "February", income: 1850, expenses: 1350 }, // ~27% savings (20–50%)
  { month: "March", income: 2100, expenses: 950 }, // ~55% savings (>50%)
  { month: "April", income: 1700, expenses: 1620 }, // ~5% savings (0–20%)
  { month: "May", income: 1950, expenses: 1200 }, // ~38% savings (20–50%)
  { month: "June", income: 2000, expenses: 850 }, // ~57% savings (>50%)
  { month: "July", income: 2100, expenses: 1900 }, // ~10% savings (0–20%)
  { month: "August", income: 1900, expenses: 1000 }, // ~47% savings (20–50%)
  { month: "September", income: 2050, expenses: 950 }, // ~54% savings (>50%)
  { month: "October", income: 1800, expenses: 1700 }, // ~6% savings (0–20%)
  { month: "November", income: 2000, expenses: 1400 }, // ~30% savings (20–50%)
  { month: "December", income: 2100, expenses: 950 }, // ~55% savings (>50%)
];

// Function to determine status and level based on savings
function getCompletedData(
  expenses: number,
  income: number,
): {
  savings: number;
  rate: number;
  level: MonthData["level"];
  status: MonthData["status"];
} {
  const savings = income - expenses;
  const rate = income === 0 ? 0 : savings / income;
  if (income === 0 && expenses === 0) {
    return {
      savings,
      rate,
      level: "pending",
      status: "pending",
    };
  }
  if (rate >= 0.5) {
    return {
      savings: Math.round(savings * 100) / 100,
      rate,
      level: "gold",
      status: "positive",
    };
  }
  if (rate >= 0.2) {
    return {
      savings: Math.round(savings * 100) / 100,
      rate,
      level: "silver",
      status: "positive",
    };
  }
  if (rate >= 0) {
    return {
      savings: Math.round(savings * 100) / 100,
      rate,
      level: "bronze",
      status: "neutral",
    };
  }
  return {
    savings: Math.round(savings * 100) / 100,
    rate,
    level: "danger",
    status: "negative",
  };
}

export const monthsData: MonthData[] = rawMonthsData.map((data) => ({
  ...data,
  ...getCompletedData(data.expenses, data.income),
}));

export const currentMonthIndex = new Date().getMonth();

export const currentMonth = monthsData[currentMonthIndex].month;
export const completedMonths = monthsData.slice(0, currentMonthIndex + 1);

export const totalIncome = completedMonths.reduce(
  (sum, month) => sum + month.income,
  0,
);

export const totalExpenses = completedMonths.reduce(
  (sum, month) => sum + month.expenses,
  0,
);

export const financialProgress = Math.min(
  (totalExpenses / totalIncome) * 100,
  100,
);

export const totalBalance = totalIncome - totalExpenses;
export const savingRate = (totalBalance / totalIncome) * 100;

export const monthlyIncome = monthsData[currentMonthIndex].income;
export const monthlyExpenses = monthsData[currentMonthIndex].expenses;
export const monthlyBalance = monthlyIncome - monthlyExpenses;

export const averageMonthlySavings = totalBalance / completedMonths.length;
export const currentStreak = completedMonths.reduce((streak, month) => {
  if (month.status === "positive" || month.status === "neutral") {
    return streak + 1;
  }
  return streak;
}, 0);

export const currentLevel = monthsData[currentMonthIndex].level;

export const getHealthStatus = () => {
  if (savingRate >= 50)
    return {
      status: "excellent",
      emoji: "😎",
      message: "Excellent annual financial management!",
    };
  if (savingRate >= 20)
    return {
      status: "good",
      emoji: "😊",
      message: "Great financial progress this year!",
    };
  if (savingRate >= 0)
    return {
      status: "ok",
      emoji: "🙂",
      message: "Good annual balance, keep it up!",
    };
  return {
    status: "needs-attention",
    emoji: "😐",
    message: "Pay attention to your annual balance!",
  };
};
