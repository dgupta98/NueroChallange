export interface CardProgress {
  current_step: number;
  help_count: number;
  completed_at: string | null;
}

/**
 * Pilot metric from the roadmap: how many steps students complete without asking for help.
 * Each help request counts against one completed step.
 */
export function independence(cards: CardProgress[]) {
  const stepsCompleted = cards.reduce((sum, c) => sum + Math.max(0, c.current_step), 0);
  const helpRequests = cards.reduce((sum, c) => sum + Math.max(0, c.help_count), 0);
  const independentSteps = Math.max(0, stepsCompleted - helpRequests);
  const independentPct = stepsCompleted === 0 ? null : Math.round((independentSteps / stepsCompleted) * 100);
  const routinesFinished = cards.filter((c) => c.completed_at).length;
  return { stepsCompleted, helpRequests, independentSteps, independentPct, routinesFinished };
}
