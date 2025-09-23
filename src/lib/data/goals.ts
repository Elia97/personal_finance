import { Goal, CreateGoalData, UpdateGoalData } from "@/lib/types/settings";

// Dati hardcodati degli obiettivi
// In futuro questi verranno caricati dal database
const initialGoalsData: Goal[] = [
  {
    id: 1,
    name: "Vacanze Estate",
    target: 3000,
    current: 1850,
    deadline: "2024-07-01",
  },
  {
    id: 2,
    name: "Fondo Emergenza",
    target: 10000,
    current: 6500,
    deadline: "2024-12-31",
  },
  {
    id: 3,
    name: "Nuovo Laptop",
    target: 1500,
    current: 1200,
    deadline: "2024-06-15",
  },
  {
    id: 4,
    name: "Auto Nuova",
    target: 15000,
    current: 4200,
    deadline: "2025-03-01",
  },
];

// Array in memoria per simulare persistenza (in attesa del DB)
let goalsInMemory = [...initialGoalsData];

// Funzioni simulate per il database
export const getGoalsFromDB = async (): Promise<Goal[]> => {
  // Simula una chiamata al database con un delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // In futuro sarà sostituito con una vera query al DB
  // es: return await prisma.goal.findMany();
  return [...goalsInMemory];
};

export const createGoalInDB = async (
  goalData: CreateGoalData,
): Promise<Goal[]> => {
  // Simula una chiamata al database
  await new Promise((resolve) => setTimeout(resolve, 50));

  // In futuro sarà sostituito con:
  // const newGoal = await prisma.goal.create({ data: goalData });
  // return await getGoalsFromDB();

  const newGoal: Goal = {
    id: Date.now(), // In futuro sarà generato dal DB
    name: goalData.name,
    target: goalData.target,
    current: 0,
    deadline: goalData.deadline,
  };

  goalsInMemory = [...goalsInMemory, newGoal];
  return [...goalsInMemory];
};

export const updateGoalInDB = async (
  goalData: UpdateGoalData,
): Promise<Goal[]> => {
  // Simula una chiamata al database
  await new Promise((resolve) => setTimeout(resolve, 50));

  // In futuro sarà sostituito con:
  // await prisma.goal.update({ where: { id: goalData.id }, data: goalData });
  // return await getGoalsFromDB();

  goalsInMemory = goalsInMemory.map((goal) => {
    if (goal.id === goalData.id) {
      return { ...goal, ...goalData };
    }
    return goal;
  });

  return [...goalsInMemory];
};

export const deleteGoalFromDB = async (goalId: number): Promise<Goal[]> => {
  // Simula una chiamata al database
  await new Promise((resolve) => setTimeout(resolve, 50));

  // In futuro sarà sostituito con:
  // await prisma.goal.delete({ where: { id: goalId } });
  // return await getGoalsFromDB();

  goalsInMemory = goalsInMemory.filter((goal) => goal.id !== goalId);
  return [...goalsInMemory];
};
