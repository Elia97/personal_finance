// Icon mapping per la navigazione
export const iconMap = {
  home: "home",
  wallet: "wallet",
  "arrow-left-right": "arrow-left-right",
  "bar-chart-3": "bar-chart-3",
} as const;

export type IconName = keyof typeof iconMap;

export interface NavigationItem {
  title: string;
  href: string;
  icon: IconName;
}
