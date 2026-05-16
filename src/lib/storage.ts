import { Screening, Submission } from '@/types';

const SCREENINGS_KEY = 'aihrly_screenings';
const SUBMISSIONS_KEY = 'aihrly_submissions';

// ─── Screenings ────────────────────────────────────────────────

export function getScreenings(): Screening[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(SCREENINGS_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function getScreeningByJob(jobId: string): Screening | undefined {
  return getScreenings().find((s) => s.jobId === jobId);
}

export function saveScreening(screening: Screening): void {
  const all = getScreenings().filter((s) => s.jobId !== screening.jobId);
  localStorage.setItem(SCREENINGS_KEY, JSON.stringify([...all, screening]));
}

// ─── Submissions ───────────────────────────────────────────────

export function getSubmissions(): Submission[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function getSubmissionsByJob(jobId: string): Submission[] {
  return getSubmissions().filter((s) => s.jobId === jobId);
}

export function getSubmissionById(id: string): Submission | undefined {
  return getSubmissions().find((s) => s.id === id);
}

export function saveSubmission(submission: Submission): void {
  const all = getSubmissions();
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify([...all, submission]));
}
