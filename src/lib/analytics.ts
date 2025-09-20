const monthlyData = [
  { month: "Gen", entrate: 3200, uscite: 2800, bilancio: 400 },
  { month: "Feb", entrate: 3200, uscite: 2950, bilancio: 250 },
  { month: "Mar", entrate: 3400, uscite: 3100, bilancio: 300 },
  { month: "Apr", entrate: 3200, uscite: 2700, bilancio: 500 },
  { month: "Mag", entrate: 3600, uscite: 3200, bilancio: 400 },
  { month: "Giu", entrate: 3200, uscite: 2900, bilancio: 300 },
  { month: "Lug", entrate: 3800, uscite: 3400, bilancio: 400 },
  { month: "Ago", entrate: 3200, uscite: 2600, bilancio: 600 },
  { month: "Set", entrate: 3400, uscite: 3000, bilancio: 400 },
  { month: "Ott", entrate: 3200, uscite: 2850, bilancio: 350 },
  { month: "Nov", entrate: 4000, uscite: 3200, bilancio: 800 },
];

const categoryData = [
  { name: "Casa", value: 1200, color: "#8884d8" },
  { name: "Alimentari", value: 450, color: "#82ca9d" },
  { name: "Trasporti", value: 320, color: "#ffc658" },
  { name: "Svago", value: 280, color: "#ff7300" },
  { name: "Utenze", value: 180, color: "#00ff88" },
  { name: "Shopping", value: 220, color: "#ff0088" },
  { name: "Altro", value: 150, color: "#8800ff" },
];

const savingsGoals = [
  { name: "Vacanze Estate", target: 3000, current: 1850, progress: 62 },
  { name: "Fondo Emergenza", target: 10000, current: 6500, progress: 65 },
  { name: "Nuovo Laptop", target: 1500, current: 1200, progress: 80 },
  { name: "Auto Nuova", target: 15000, current: 4200, progress: 28 },
];

const totalEntrate = monthlyData.reduce((sum, month) => sum + month.entrate, 0);
const totalUscite = monthlyData.reduce((sum, month) => sum + month.uscite, 0);
const totalBilancio = totalEntrate - totalUscite;
const mediaEntrate = totalEntrate / monthlyData.length;
const mediaUscite = totalUscite / monthlyData.length;

export {
  monthlyData,
  categoryData,
  savingsGoals,
  totalEntrate,
  totalUscite,
  totalBilancio,
  mediaEntrate,
  mediaUscite,
};
