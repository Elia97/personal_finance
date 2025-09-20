import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Trophy,
  Minus,
} from "lucide-react";
import { monthsData, currentMonthIndex } from "@/lib/dashboard";
import { Badge } from "../ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export default function Timeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Months Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Timeline visualization */}
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
            <div className="space-y-4">
              {monthsData.map((month, index) => (
                <div
                  key={month.month}
                  className="relative flex items-center space-x-4"
                >
                  {/* Timeline dot */}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                      index <= currentMonthIndex
                        ? month.level === "gold"
                          ? "bg-yellow-100 border-yellow-400 text-yellow-800"
                          : month.level === "silver"
                          ? "bg-gray-100 border-gray-400 text-gray-800"
                          : month.level === "bronze"
                          ? "bg-amber-100 border-amber-600 text-amber-800"
                          : "bg-red-100 border-red-400 text-red-600"
                        : "bg-muted border-muted-foreground/30 text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Month details */}
                  <div
                    className={`flex-1 p-4 rounded-lg border transition-all ${
                      index <= currentMonthIndex
                        ? "bg-card border-border"
                        : "bg-muted/30 border-muted-foreground/20"
                    }`}
                  >
                    <div className="flex justify-between gap-2 items-start">
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          {month.month.slice(0, 3)}
                          {index <= currentMonthIndex &&
                            month.level !== "pending" && (
                              <Badge
                                variant="outline"
                                className={
                                  month.level === "gold"
                                    ? "border-yellow-400 text-yellow-700"
                                    : month.level === "silver"
                                    ? "border-gray-400 text-gray-700"
                                    : month.level === "bronze"
                                    ? "border-amber-600 text-amber-700"
                                    : "border-red-600 text-red-700"
                                }
                              >
                                {month.level}
                              </Badge>
                            )}
                          {index > currentMonthIndex && (
                            <Badge
                              variant="outline"
                              className="border-muted-foreground/30 text-muted-foreground"
                            >
                              Coming soon
                            </Badge>
                          )}
                        </h3>
                        {index <= currentMonthIndex &&
                          month.status !== "pending" && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">
                                  Income:
                                </span>
                                <div className="font-semibold text-green-600">
                                  €{month.income.toLocaleString("en-US")}
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Expenses:
                                </span>
                                <div className="font-semibold text-red-600">
                                  €{month.expenses.toLocaleString("en-US")}
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Savings:
                                </span>
                                <div className="font-semibold text-primary">
                                  €{month.savings.toLocaleString("en-US")}
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Rate:
                                </span>
                                <div className="font-semibold text-primary">
                                  {month.rate.toLocaleString("en-US", {
                                    style: "percent",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                      {index <= currentMonthIndex &&
                        month.status !== "pending" && (
                          <div className="flex flex-wrap justify-end items-center">
                            {month.status === "positive" && (
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            )}
                            {month.status === "negative" && (
                              <TrendingDown className="h-5 w-5 text-red-600" />
                            )}
                            {month.status === "neutral" && (
                              <Minus className="h-5 w-5 text-amber-600" />
                            )}
                            {month.level === "gold" && (
                              <Trophy className="h-5 w-5 text-yellow-600 ml-1" />
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
