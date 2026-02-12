export interface RoutineCategory {
  id: string;
  name: string;
  description: string;
  color: string;
}

export const ROUTINE_CATEGORIES: RoutineCategory[] = [
  {
    id: 'calm-down',
    name: 'Calm Down',
    description: 'When you need to feel peaceful',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  },
  {
    id: 'try-again',
    name: 'Try Again',
    description: 'When something is hard',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  },
  {
    id: 'good-job',
    name: 'Good Job',
    description: 'When you did something great',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  },
  {
    id: 'transitions',
    name: 'Transitions',
    description: 'When things are changing',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  },
];
