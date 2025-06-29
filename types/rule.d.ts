export type Rule =
  | { type: 'coRun'; tasks: string[] }
  | { type: 'slotRestriction'; group: string; minCommonSlots: number }
  | { type: 'loadLimit'; group: string; maxSlotsPerPhase: number }
  | { type: 'phaseWindow'; task: string; allowedPhases: number[] }
  | { type: 'precedence'; before: string; after: string };



