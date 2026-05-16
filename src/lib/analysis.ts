import { AnalysisResult, Submission } from '@/types';

const summaries = [
  'The candidate demonstrated strong communication skills and a genuine enthusiasm for the role. Their answers were structured and thoughtful, with concrete examples drawn from past experience.',
  'The candidate provided clear, concise responses that highlighted relevant experience. There is good alignment between their background and the requirements of the position.',
  'Overall a promising candidate. Responses showed depth in technical areas with some gaps in process and collaboration experience worth exploring further in a technical interview.',
];

const strengthPool = [
  'Articulate communicator with structured, example-driven answers.',
  'Demonstrated clear understanding of the role\'s core responsibilities.',
  'Shows initiative — mentioned proactive learning and self-improvement.',
  'Strong alignment with remote-first working culture.',
  'Concise answers indicate good prioritisation of information.',
  'Expressed genuine enthusiasm and curiosity about the product.',
];

const concernPool = [
  'Limited detail on collaborative or cross-team experience.',
  'Some answers were brief — worth probing deeper in the technical round.',
  'Unclear on preferred tooling for certain workflows.',
  'No mention of testing practices or quality assurance approach.',
  'Timeline expectations may need clarification.',
];

const recommendations: AnalysisResult['recommendation'][] = ['advance', 'advance', 'hold', 'reject'];

function pick<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

export function generateMockAnalysis(submission: Submission): AnalysisResult {
  // Deterministic-ish based on submission id so it doesn't flicker on re-render
  const seed = submission.id.charCodeAt(0) % summaries.length;
  return {
    summary: summaries[seed],
    strengths: pick(strengthPool, 3),
    concerns: pick(concernPool, 2),
    recommendation: recommendations[seed % recommendations.length],
  };
}
