'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Briefcase } from 'lucide-react';
import { jobs } from '@/data/jobs';
import { getScreenings, getSubmissions } from '@/lib/storage';
import { Screening, Submission } from '@/types';
import { JobCard } from '@/components/recruiter/JobCard';
import { CreateScreeningModal } from '@/components/recruiter/CreateScreeningModal';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export default function JobsPage() {
  const [search, setSearch] = useState('');
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setScreenings(getScreenings());
    setSubmissions(getSubmissions());
  }, []);

  const filtered = useMemo(
    () => jobs.filter((j) => j.title.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const handleScreeningCreated = () => {
    setScreenings(getScreenings());
    setModalOpen(false);
  };

  return (
    <>
      {/* Page header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white drop-shadow">Jobs</h1>
          <p className="mt-1 text-sm text-white/60">
            {jobs.length} open position{jobs.length !== 1 ? 's' : ''} at Remotown GmbH
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} size="md">
          <Plus size={16} />
          Create Phone Screening
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search jobs…"
          className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 backdrop-blur focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20">
          <EmptyState
            icon={<Briefcase size={28} />}
            title="No jobs found"
            description={
              search
                ? `No jobs match "${search}". Try a different search.`
                : 'No jobs have been seeded yet.'
            }
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              screeningCount={screenings.filter((s) => s.jobId === job.id).length}
              applicantCount={submissions.filter((s) => s.jobId === job.id).length}
            />
          ))}
        </div>
      )}

      <CreateScreeningModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleScreeningCreated}
      />
    </>
  );
}
