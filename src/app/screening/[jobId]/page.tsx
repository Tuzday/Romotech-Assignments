'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { CheckCircle, Mic, ChevronRight, Zap } from 'lucide-react';
import { jobs } from '@/data/jobs';
import { getScreeningByJob, saveSubmission } from '@/lib/storage';
import { Answer, Question, Screening } from '@/types';
import { Button } from '@/components/ui/Button';

type Stage = 'welcome' | 'questions' | 'done';

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((current / total) * 100);
  return (
    <div className="mb-6">
      <div className="flex justify-between text-xs text-white/50 mb-1.5">
        <span>Question {current} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-orange-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function WelcomeStep({ jobTitle, onStart }: { jobTitle: string; onStart: (name: string, email: string) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = 'Name is required.';
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address.';
    return e;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onStart(name.trim(), email.trim());
  };

  const inputClass = (err?: string) =>
    `w-full rounded-xl border px-3 py-2.5 text-sm bg-white/10 text-white placeholder-white/30 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 ${err ? 'border-red-400' : 'border-white/20'}`;

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          <Zap size={12} className="fill-orange-400" /> Aihrly Phone Screening
        </div>
        <h1 className="text-2xl font-bold text-white">{jobTitle}</h1>
        <p className="mt-2 text-sm text-white/60">
          Welcome! Please enter your details below. You&apos;ll answer a short set of questions one at a time. Take your time — there&apos;s no timer.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1.5">Full Name <span className="text-red-400">*</span></label>
          <input type="text" value={name} onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }} placeholder="e.g. Kofi Mensah" className={inputClass(errors.name)} />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1.5">Email Address <span className="text-red-400">*</span></label>
          <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }} placeholder="e.g. kofi@email.com" className={inputClass(errors.email)} />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
        </div>
      </div>
      <Button onClick={handleSubmit} size="lg" className="w-full">
        Begin Screening <ChevronRight size={16} />
      </Button>
    </div>
  );
}

function QuestionStep({ question, index, total, onNext }: { question: Question; index: number; total: number; onNext: (value: string) => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const isLast = index + 1 === total;

  const handleNext = () => {
    if (!value.trim()) { setError('Please provide an answer before continuing.'); return; }
    onNext(value.trim());
    setValue('');
    setError('');
  };

  return (
    <div className="space-y-5">
      <ProgressBar current={index + 1} total={total} />
      <div>
        <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-2">Question {index + 1}</p>
        <h2 className="text-lg font-semibold text-white leading-snug">{question.text}</h2>
      </div>
      {question.responseType === 'audio' && (
        <div className="bg-purple-500/10 border border-purple-400/20 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-purple-400">
            <Mic size={15} />
            <p className="text-sm font-medium">Audio response requested</p>
          </div>
          <p className="text-xs text-purple-300/60">For this demo, please use the text box below.</p>
          <button disabled className="flex items-center gap-2 bg-purple-500/20 text-purple-400/50 text-xs px-4 py-2 rounded-full cursor-not-allowed">
            <span className="w-3 h-3 rounded-full bg-purple-400/50 inline-block" /> Record Audio (disabled)
          </button>
        </div>
      )}
      <div>
        <textarea
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(''); }}
          rows={5}
          placeholder="Type your answer here…"
          className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-white/10 text-white placeholder-white/30 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none ${error ? 'border-red-400' : 'border-white/20'}`}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
      <Button onClick={handleNext} size="lg" className="w-full">
        {isLast ? 'Submit Screening' : 'Next Question'} <ChevronRight size={16} />
      </Button>
    </div>
  );
}

function DoneStep({ name }: { name: string }) {
  return (
    <div className="text-center space-y-5 py-8">
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
          <CheckCircle size={40} className="text-emerald-400" />
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white">Thank you, {name}!</h2>
        <p className="mt-2 text-sm text-white/60 max-w-sm mx-auto">
          Your responses have been recorded. The recruiting team at Remotown GmbH will review your answers and be in touch soon.
        </p>
      </div>
      <p className="text-xs text-white/30">You may close this window.</p>
    </div>
  );
}

export default function ScreeningPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const job = jobs.find((j) => j.id === jobId);
  const [screening, setScreening] = useState<Screening | null>(null);
  const [stage, setStage] = useState<Stage>('welcome');
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const sc = getScreeningByJob(jobId);
    if (!sc || !job) setNotFound(true);
    else setScreening(sc);
  }, [jobId, job]);

  const handleStart = useCallback((name: string, email: string) => {
    setCandidateName(name); setCandidateEmail(email); setStage('questions');
  }, []);

  const handleAnswer = useCallback((value: string) => {
    if (!screening) return;
    const q = screening.questions[questionIndex];
    const newAnswers = [...answers, { questionId: q.id, responseType: q.responseType, value }];
    setAnswers(newAnswers);
    if (questionIndex + 1 < screening.questions.length) {
      setQuestionIndex((i) => i + 1);
    } else {
      saveSubmission({ id: uuidv4(), jobId, candidateName, candidateEmail, answers: newAnswers, submittedAt: new Date().toISOString() });
      setStage('done');
    }
  }, [answers, candidateEmail, candidateName, jobId, questionIndex, screening]);

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap size={28} className="text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Screening not found</h2>
          <p className="text-sm text-white/50">This link may be invalid or the screening hasn&apos;t been created yet. Please contact the recruiter.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-2 text-orange-400 font-bold text-base mb-6">
          <Zap size={18} className="fill-orange-400" /> Aihrly
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8">
          {stage === 'welcome' && job && <WelcomeStep jobTitle={job.title} onStart={handleStart} />}
          {stage === 'questions' && screening && (
            <QuestionStep question={screening.questions[questionIndex]} index={questionIndex} total={screening.questions.length} onNext={handleAnswer} />
          )}
          {stage === 'done' && <DoneStep name={candidateName} />}
        </div>
      </div>
    </div>
  );
}
