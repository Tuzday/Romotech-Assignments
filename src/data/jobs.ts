import { Job } from '@/types';

export const jobs: Job[] = [
  {
    id: 'job-001',
    title: 'Frontend-Focused Full Stack Developer (NSS)',
    location: 'Remote, Ghana',
    employmentType: 'NSS',
    description:
      'Build delightful interfaces in Next.js for Remotown\'s internal and client-facing tools. You\'ll work closely with our product and design team to ship fast, accessible, and well-tested features across the stack — with your primary focus on the frontend.',
  },
  {
    id: 'job-002',
    title: 'Backend Engineer',
    location: 'Remote, Europe',
    employmentType: 'Full-time',
    description:
      'Design and maintain robust REST and GraphQL APIs powering Remotown\'s core platform. You\'ll work with PostgreSQL, Redis, and Node.js microservices, ensuring high availability and performance at scale.',
  },
  {
    id: 'job-003',
    title: 'Product Designer',
    location: 'Remote, Global',
    employmentType: 'Part-time',
    description:
      'Shape the experience of our hiring platform from wireframe to polished UI. You\'ll run user research, produce high-fidelity Figma designs, and collaborate directly with engineers to ensure pixel-perfect implementation.',
  },
  {
    id: 'job-004',
    title: 'Data Analyst Intern',
    location: 'Accra, Ghana',
    employmentType: 'Internship',
    description:
      'Dive into our recruitment data to surface insights that drive product decisions. You\'ll build dashboards in Metabase, write complex SQL queries, and present findings to cross-functional stakeholders.',
  },
];
