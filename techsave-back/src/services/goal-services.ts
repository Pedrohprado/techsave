import type { Term } from '@prisma/client';
import { prisma } from '../config/prisma.js';

interface GoalsProps {
  goal: string;
  primary: boolean;
  value?: number | undefined;
  term: Term;
}

function checkDaysTerms(term: string) {
  const year = 365;

  switch (term) {
    case 'SHORT_TERM':
      return {
        days_term: 2 * year,
      };

    case 'MEDIUM_TERM':
      return {
        days_term: 9 * year,
      };

    case 'LONG_TERM':
      return {
        days_term: 10 * year,
      };

    default:
      return {
        days_term: 2 * year,
      };
  }
}

export async function createGoals(goals: GoalsProps[], userId: string) {
  for (const goal of goals) {
    const { days_term } = checkDaysTerms(goal.term);

    await prisma.goal.create({
      data: {
        userId,
        goal: goal.goal,
        primary: goal.primary,
        value: goal.value ?? null,
        term: goal.term,
        days_term,
      },
    });
  }
}
