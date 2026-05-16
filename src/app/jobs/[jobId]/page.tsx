'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Briefcase, Link2, Users, Plus, Copy, Check, ExternalLink,
} from 'lucide-react';
import { jobs } from '@/data/jobs';
import { getScreeningByJob, getSubmissionsByJob } from '@/lib/storage';
import { Screening, Submission } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { CreateScreeningModal } from '@/components/recruiter/CreateScreeningModal';

const card = 'bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 mb-6';

export default function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const router = useRouter();

  const job = jobs.find((j) => j.id === jobId);
  const [screening, setScreening] = useState<Screening | undefined>();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setScreening(getScreeningByJob(jobId));
    setSubmissions(getSubmissionsByJob(jobId));
  }, [jobId, modalOpen]);

  if (!job) {
    return (
      <div className="py-24 text-center">
        <p className="text-white/60 mb-4">Job not found.</p>
        <Button variant="secondary" onClick={() => router.push('/jobs')}>← Back to Jobs</Button>
      </div>
    );
  }

  const screeningUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/screening/${jobId}`
      : `/screening/${jobId}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(screeningUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const employmentColors: Record<string, 'default' | 'success' | 'warning' | 'info' | 'purple'> =
    { 'Full-time': 'success', 'Part-time': 'info', Internship: 'warning', NSS: 'purple' };

  return (
    <>
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
      >
        <ArrowLeft size={15} /> Back to Jobs
      </Link>

      {/* Job header */}
      <div className={card}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant={employmentColors[job.employmentType] ?? 'default'}>{job.employmentType}</Badge>
            </div>
            <h1 className="text-xl font-bold text-white">{job.title}</h1>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-white/50">
              <span className="flex items-center gap-1.5"><MapPin size={14} />{job.location}</span>
              <span className="flex items-center gap-1.5"><Briefcase size={14} />{job.employmentType}</span>
            </div>
            <p className="mt-3 text-sm text-white/70 max-w-2xl">{job.description}</p>
          </div>
          {!screening && (
            <Button onClick={() => setModalOpen(true)} className="flex-shrink-0">
              <Plus size={15} /> Create Screening
            </Button>
          )}
        </div>
      </div>

      {/* Screening link */}
      <div className={card}>
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Link2 size={16} /> Candidate Screening Link
        </h2>
        {screening ? (
          <>
            <p className="text-sm text-white/60 mb-3">
              Share this link with candidates. The screening has{' '}
              <strong className="text-white">{screening.questions.length} questions</strong> and was created on{' '}
              {new Date(screening.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-xs text-white/80 truncate">
                {screeningUrl}
              </code>
              <Button variant="secondary" size="sm" onClick={copyLink}>
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <a
                href={screeningUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-orange-400 hover:underline px-2 py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
              >
                Preview <ExternalLink size={12} />
              </a>
            </div>
          </>
        ) : (
          <div className="text-sm text-white/50 flex items-center gap-3">
            <span>No screening created yet.</span>
            <Button size="sm" onClick={() => setModalOpen(true)}><Plus size={13} /> Create Screening</Button>
          </div>
        )}
      </div>

      {/* Applicants */}
      <div className={card}>
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Users size={16} /> Applicants ({submissions.length})
        </h2>
        {submissions.length === 0 ? (
          <EmptyState
            icon={<Users size={24} />}
            title="No responses yet"
            description="Share the screening link with candidates. Responses will appear here once submitted."
          />
        ) : (
          <div className="divide-y divide-white/10">
            {submissions.map((s) => (
              <div key={s.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-white">{s.candidateName}</p>
                  <p className="text-xs text-white/50">{s.candidateEmail}</p>
                  <p className="text-xs text-white/40 mt-0.5">
                    Submitted {new Date(s.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => router.push(`/jobs/${jobId}/applicants/${s.id}`)}>
                  View Responses
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateScreeningModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => { setModalOpen(false); setScreening(getScreeningByJob(jobId)); }}
        preselectedJobId={jobId}
      />
    </>
  );
}
