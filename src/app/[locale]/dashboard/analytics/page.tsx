import {
  CategoryBreakdown,
  CategoryDetails,
  MonthlyTrend,
  SavingsGoals,
  SummaryCards,
  TrendBalance,
} from "@/components/analytics";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <SummaryCards />
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <MonthlyTrend />

        {/* Category Breakdown */}
        <CategoryBreakdown />
      </div>

      {/* Savings Goals */}
      <SavingsGoals />

      {/* Bilancio Trend */}
      <TrendBalance />

      {/* Category Details */}
      <CategoryDetails />
    </div>
  );
}
