import Link from 'next/link';
import { MapPin, Briefcase, Users, ChevronRight } from 'lucide-react';
import { Job } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

const employmentColors: Record<string, 'default' | 'success' | 'warning' | 'info' | 'purple'> = {
  'Full-time': 'success',
  'Part-time': 'info',
  Internship: 'warning',
  NSS: 'purple',
};

interface JobCardProps {
  job: Job;
  screeningCount: number;
  applicantCount: number;
}

export function JobCard({ job, screeningCount, applicantCount }: JobCardProps) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className={cn(
        'group block rounded-2xl border border-white/20 p-6',
        'bg-white/10 backdrop-blur-md',
        'hover:bg-white/20 hover:border-orange-400/50 hover:shadow-lg hover:shadow-orange-900/20 transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant={employmentColors[job.employmentType] ?? 'default'}>
              {job.employmentType}
            </Badge>
            {screeningCount > 0 && (
              <Badge variant="success">Screening active</Badge>
            )}
          </div>
          <h2 className="text-base font-semibold text-white group-hover:text-orange-300 transition-colors line-clamp-2">
            {job.title}
          </h2>
          <p className="mt-2 text-sm text-white/60 line-clamp-2">{job.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/50">
            <span className="flex items-center gap-1">
              <MapPin size={13} />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase size={13} />
              {screeningCount} screening{screeningCount !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1">
              <Users size={13} />
              {applicantCount} applicant{applicantCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <ChevronRight
          size={18}
          className="text-white/30 group-hover:text-orange-400 transition-colors flex-shrink-0 mt-1"
        />
      </div>
    </Link>
  );
}
