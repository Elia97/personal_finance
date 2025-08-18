export type PagesConfig = {
  [key: string]: {
    title: string;
    description: string;
  };
};

export const pagesConfig: PagesConfig = {
  app: {
    title: "Dashboard",
    description: "Overview of your financial health",
  },
};
