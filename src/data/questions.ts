import { Question } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const makeQ = (text: string, isCustom = false): Question => ({
  id: uuidv4(),
  text,
  responseType: 'text',
  isCustom,
});

export const questionsByJob: Record<string, Question[]> = {
  'job-001': [
    makeQ('Can you walk us through a Next.js project you built and the key architectural decisions you made?'),
    makeQ('How do you approach performance optimization in a React application?'),
    makeQ('Describe your experience with TypeScript. What are the biggest benefits you\'ve seen in a real project?'),
    makeQ('How do you handle state management in a complex frontend — and when do you reach for a library versus React Context?'),
    makeQ('Tell us about a time a UI bug made it to production. How did you diagnose and fix it?'),
    makeQ('What does "accessible UI" mean to you, and how do you test for it?'),
  ],
  'job-002': [
    makeQ('Walk us through how you would design a REST API for a multi-tenant SaaS product.'),
    makeQ('How do you approach database schema migrations without downtime?'),
    makeQ('Describe a situation where you had to optimize a slow SQL query. What was your process?'),
    makeQ('What strategies do you use to keep microservices loosely coupled?'),
    makeQ('How do you handle authentication and authorization across services?'),
    makeQ('What does observability mean to you, and how have you implemented it in past projects?'),
  ],
  'job-003': [
    makeQ('Describe your end-to-end design process from discovery to handoff.'),
    makeQ('How do you incorporate user research into your design decisions?'),
    makeQ('Tell us about a time you pushed back on a product requirement for UX reasons. What happened?'),
    makeQ('How do you ensure your designs remain accessible to users with disabilities?'),
    makeQ('What tools do you use for prototyping, and why?'),
    makeQ('How do you measure whether a design change was successful after shipping?'),
  ],
  'job-004': [
    makeQ('Walk us through a data analysis project you led from raw data to a presented insight.'),
    makeQ('How do you decide which visualization to use for a given dataset?'),
    makeQ('Describe a time you found an unexpected pattern in data. How did you validate it?'),
    makeQ('How comfortable are you writing complex SQL queries with multiple joins and window functions?'),
    makeQ('What is your approach to data cleaning and handling missing values?'),
    makeQ('How do you communicate technical findings to a non-technical audience?'),
  ],
};

export const genericQuestions = (): Question[] => [
  makeQ('Tell us a bit about yourself and what draws you to this role.'),
  makeQ('What does your ideal working environment look like?'),
  makeQ('Describe a challenging project and how you overcame obstacles.'),
  makeQ('Where do you see yourself professionally in two years?'),
  makeQ('What questions do you have for us about the team or role?'),
];
