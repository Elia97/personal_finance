"use client";
import { useLocale } from "next-intl";

export default function CurrentMonthLabel() {
  const locale = useLocale();
  const currentMonthLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date());
  return <span>{currentMonthLabel}</span>;
}
