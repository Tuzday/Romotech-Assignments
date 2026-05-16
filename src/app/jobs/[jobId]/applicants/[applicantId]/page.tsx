'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Mic, Brain, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getSubmissionById, getScreeningByJob } from '@/lib/storage';
import { generateMockAnalysis } from '@/lib/analysis';
import { AnalysisResult, Screening, Submission } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const card = 'bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 mb-6';

type RecommendationStyle = { label: string; badge: 'success' | 'danger' | 'warning' };
const recommendationMap: Record<string, RecommendationStyle> = {
  advance: { label: 'Advance to next round', badge: 'success' },
  reject: { label: 'Do not advance', badge: 'danger' },
  hold: { label: 'Hold for review', badge: 'warning' },
};

export default function ApplicantDetailPage() {
  const { jobId, applicantId } = useParams<{ jobId: string; applicantId: string }>();
  const router = useRouter();

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [screening, setScreening] = useState<Screening | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const s = getSubmissionById(applicantId);
    if (!s) return;
    setSubmission(s);
    const sc = getScreeningByJob(jobId);
    if (sc) setScreening(sc);
  }, [applicantId, jobId]);

  const handleAnalyze = async () => {
    if (!submission) return;
    setAnalyzing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setAnalysis(generateMockAnalysis(submission));
    setAnalyzing(false);
  };

  if (!submission) {
    return (
      <div className="py-24 text-center">
        <p className="text-white/60 mb-4">Submission not found.</p>
        <Button variant="secondary" onClick={() => router.push(`/jobs/${jobId}`)}>← Back</Button>
      </div>
    );
  }

  const getQuestion = (questionId: string) =>
    screening?.questions.find((q) => q.id === questionId);

  return (
    <>
      <Link href={`/jobs/${jobId}`} className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded">
        <ArrowLeft size={15} /> Back to Job
      </Link>

      {/* Applicant header */}
      <div className={card}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400 flex-shrink-0">
            <User size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{submission.candidateName}</h1>
            <p className="text-sm text-white/60">{submission.candidateEmail}</p>
            <p className="text-xs text-white/40 mt-1">
              Submitted {new Date(submission.submittedAt).toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>

      {/* Q&A */}
      <div className={card}>
        <h2 className="text-base font-semibold text-white mb-5">Screening Responses</h2>
        <div className="space-y-6">
          {submission.answers.map((answer, idx) => {
            const question = getQuestion(answer.questionId);
            return (
              <div key={answer.questionId} className="border-b border-white/10 last:border-0 pb-6 last:pb-0">
                <div className="flex items-start gap-3 mb-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <p className="text-sm font-medium text-white/90">{question?.text ?? `Question ${idx + 1}`}</p>
                </div>
                {answer.responseType === 'audio' ? (
                  <div className="ml-9 flex items-center gap-3 bg-black/20 border border-white/10 rounded-xl p-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Mic size={15} className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white/70">Audio Response</p>
                      <p className="text-xs text-white/40">{answer.value || 'No audio recorded.'}</p>
                    </div>
                    <button disabled className="ml-auto text-xs bg-purple-500/20 text-purple-400/60 px-3 py-1 rounded-full cursor-not-allowed">▶ Play</button>
                  </div>
                ) : (
                  <div className="ml-9 bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-white/70 leading-relaxed">
                    {answer.value || <span className="italic text-white/30">No answer provided.</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!analysis && (
        <div className="flex justify-center mb-6">
          <Button onClick={handleAnalyze} loading={analyzing} size="lg">
            <Brain size={17} />
            {analyzing ? 'Analyzing responses…' : 'Analyze Response'}
          </Button>
        </div>
      )}

      {analysis && (
        <div className="bg-orange-950/30 backdrop-blur-md rounded-2xl border border-orange-400/30 p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <Brain size={18} className="text-orange-400" />
            <h2 className="text-base font-semibold text-white">AI Analysis</h2>
            <Badge variant={recommendationMap[analysis.recommendation].badge}>
              {recommendationMap[analysis.recommendation].label}
            </Badge>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">{analysis.summary}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3 text-emerald-400">
                <TrendingUp size={15} />
                <h3 className="text-sm font-semibold">Strengths</h3>
              </div>
              <ul className="space-y-2">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-emerald-300/80">
                    <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" />{s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-950/40 border border-amber-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3 text-amber-400">
                <AlertTriangle size={15} />
                <h3 className="text-sm font-semibold">Concerns</h3>
              </div>
              <ul className="space-y-2">
                {analysis.concerns.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-300/80">
                    <span className="mt-0.5 flex-shrink-0">•</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-xs text-white/30 italic">This is a mocked AI analysis for demonstration purposes only.</p>
        </div>
      )}
    </>
  );
}
