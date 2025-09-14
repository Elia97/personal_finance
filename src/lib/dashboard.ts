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
  { month: "January", income: 2215, expenses: 1971.56 },
  { month: "February", income: 1659, expenses: 1905.08 },
  { month: "March", income: 2042, expenses: 2323.48 },
  { month: "April", income: 1532, expenses: 1712.55 },
  { month: "May", income: 1764, expenses: 1810.67 },
  { month: "June", income: 1606, expenses: 2279.71 },
  { month: "July", income: 1923, expenses: 1765.14 },
  { month: "August", income: 1774, expenses: 2042.01 },
  { month: "September", income: 2031, expenses: 1000.02 },
  { month: "October", income: 0, expenses: 0 },
  { month: "November", income: 0, expenses: 0 },
  { month: "December", income: 0, expenses: 0 },
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
