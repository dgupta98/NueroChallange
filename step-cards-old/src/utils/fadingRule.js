export function getVisibleCardCount(totalCards, completionCount) {
  if (completionCount <= 2) return totalCards
  if (completionCount === 3) return Math.ceil(totalCards * 0.75)
  if (completionCount === 4) return Math.ceil(totalCards * 0.5)
  return 1
}

export function getFadedSteps(steps, completionCount) {
  const count = getVisibleCardCount(steps.length, completionCount)
  if (count >= steps.length) return steps
  if (count === 1) return [{
    n: 1,
    text: `${steps[0].text.replace(/\.$/, '')} (${steps.length} steps — tap when done)`,
    icon_keyword: steps[0].icon_keyword,
    pictogramUrl: steps[0].pictogramUrl,
    pictogramUrls: steps[0].pictogramUrls,
    isSummaryCard: true,
  }]
  return steps.slice(0, count)
}

export function getRoutineKey(instructionSummary) {
  return (instructionSummary || '')
    .toLowerCase().trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50)
}
