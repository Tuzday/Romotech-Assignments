'use client';

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { Sparkles, Plus, Trash2, GripVertical, Mic, Type } from 'lucide-react';
import { jobs } from '@/data/jobs';
import { questionsByJob, genericQuestions } from '@/data/questions';
import { saveScreening } from '@/lib/storage';
import { Question, ResponseType, Screening } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

type Step = 'select-job' | 'questions';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  preselectedJobId?: string;
}

export function CreateScreeningModal({ open, onClose, onCreated, preselectedJobId }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(preselectedJobId ? 'select-job' : 'select-job');
  const [selectedJobId, setSelectedJobId] = useState(preselectedJobId ?? '');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleGenerate = useCallback(async () => {
    if (!selectedJobId) return;
    setGenerating(true);
    // Fake 700ms "AI" delay
    await new Promise((r) => setTimeout(r, 700));
    const pool = questionsByJob[selectedJobId] ?? genericQuestions();
    setQuestions(pool.map((q) => ({ ...q, id: uuidv4() })));
    setStep('questions');
    setGenerating(false);
  }, [selectedJobId]);

  const removeQuestion = (id: string) =>
    setQuestions((prev) => prev.filter((q) => q.id !== id));

  const toggleType = (id: string) =>
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, responseType: q.responseType === 'text' ? 'audio' : 'text' }
          : q
      )
    );

  const addCustom = () => {
    const id = uuidv4();
    setQuestions((prev) => [
      ...prev,
      { id, text: 'New question', responseType: 'text', isCustom: true },
    ]);
    setEditingId(id);
    setEditText('New question');
  };

  const startEdit = (q: Question) => {
    setEditingId(q.id);
    setEditText(q.text);
  };

  const commitEdit = () => {
    if (!editingId) return;
    setQuestions((prev) =>
      prev.map((q) => (q.id === editingId ? { ...q, text: editText.trim() || q.text } : q))
    );
    setEditingId(null);
    setEditText('');
  };

  const handleSave = async () => {
    if (!selectedJobId || questions.length === 0) return;
    setSaving(true);
    const screening: Screening = {
      id: uuidv4(),
      jobId: selectedJobId,
      createdAt: new Date().toISOString(),
      questions,
    };
    saveScreening(screening);
    await new Promise((r) => setTimeout(r, 300));
    setSaving(false);
    onCreated();
    router.push(`/jobs/${selectedJobId}`);
    // Reset
    setStep('select-job');
    setSelectedJobId(preselectedJobId ?? '');
    setQuestions([]);
  };

  const handleClose = () => {
    onClose();
    setStep('select-job');
    setSelectedJobId(preselectedJobId ?? '');
    setQuestions([]);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={step === 'select-job' ? 'Create Phone Screening' : 'Edit Questions'}
      size="lg"
    >
      {step === 'select-job' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select a job *
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">— Choose a job —</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-indigo-50 rounded-xl p-4 text-sm text-indigo-800">
            <strong>Tip:</strong> Once you select a job and click Generate, we&apos;ll suggest
            tailored screening questions you can edit, remove, or supplement with your own.
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!selectedJobId}
              loading={generating}
            >
              <Sparkles size={15} />
              {generating ? 'Generating…' : 'Generate Questions'}
            </Button>
          </div>
        </div>
      )}

      {step === 'questions' && (
        <div className="space-y-5">
          <p className="text-sm text-gray-500">
            {questions.length} question{questions.length !== 1 ? 's' : ''} generated. Edit, remove, or add your own.
          </p>

          <ul className="space-y-3">
            {questions.map((q, idx) => (
              <li
                key={q.id}
                className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100"
              >
                <GripVertical size={16} className="text-gray-300 mt-0.5 flex-shrink-0" />
                <span className="text-xs font-mono text-gray-400 pt-0.5 w-5 flex-shrink-0">
                  {idx + 1}.
                </span>

                <div className="flex-1 min-w-0">
                  {editingId === q.id ? (
                    <textarea
                      autoFocus
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={commitEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          commitEdit();
                        }
                      }}
                      rows={2}
                      className="w-full text-sm rounded-lg border border-indigo-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  ) : (
                    <p
                      className="text-sm text-gray-800 cursor-pointer hover:text-indigo-700 transition-colors"
                      onClick={() => startEdit(q)}
                      title="Click to edit"
                    >
                      {q.text}
                    </p>
                  )}

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => toggleType(q.id)}
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                        q.responseType === 'audio'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {q.responseType === 'audio' ? (
                        <>
                          <Mic size={11} /> Audio
                        </>
                      ) : (
                        <>
                          <Type size={11} /> Text
                        </>
                      )}
                    </button>
                    {q.isCustom && (
                      <span className="text-xs text-gray-400 italic">custom</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => startEdit(q)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    aria-label="Edit question"
                    title="Edit"
                  >
                    <Type size={14} />
                  </button>
                  <button
                    onClick={() => removeQuestion(q.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    aria-label="Remove question"
                    title="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <Button variant="ghost" size="sm" onClick={addCustom} className="w-full border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-300">
            <Plus size={15} />
            Add Custom Question
          </Button>

          <div className="flex justify-between pt-2 border-t border-gray-100">
            <Button
              variant="ghost"
              onClick={() => { setStep('select-job'); setQuestions([]); }}
            >
              ← Back
            </Button>
            <Button onClick={handleSave} disabled={questions.length === 0} loading={saving}>
              Save Screening
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
