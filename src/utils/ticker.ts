import { tasksScheduler } from './TasksScheduler/TasksScheduler';

export type ITicker = typeof tasksScheduler;
export const ticker = tasksScheduler;
