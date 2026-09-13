import React, { useState } from 'react';
import { MockTest, Question } from '../types';
import { api } from '../lib/api';
import { FileCheck2, Zap, Trash2, Plus, Sparkles, CheckCircle2, AlertTriangle, Layers, BookOpen } from 'lucide-react';

interface AdminMockTestsTabProps {
  mockTests: MockTest[];
  questions: Question[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminMockTestsTab: React.FC<AdminMockTestsTabProps> = ({
  mockTests,
  questions,
  onRefresh,
  showToast
}) => {
  const [selectedPattern, setSelectedPattern] = useState<'maharashtra' | 'aiims'>('maharashtra');
  const [testCount, setTestCount] = useState<number>(5);
  const [questionsPerTest, setQuestionsPerTest] = useState<number>(50);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [filterPattern, setFilterPattern] = useState<'all' | 'maharashtra' | 'aiims'>('all');

  const handleBulkGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (questions.length === 0) {
      showToast('No questions in question bank! Please import questions first.', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await api.bulkGenerateMockTests({
        pattern: selectedPattern,
        count: Number(testCount),
        questionsPerTest: Number(questionsPerTest)
      });
      if (res.success) {
        showToast(`Successfully bulk generated ${res.createdCount} mock tests!`, 'success');
        onRefresh();
      } else {
        showToast('Failed to bulk generate mock tests', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Bulk generation error', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mock test?')) return;
    try {
      await api.deleteMockTest(id);
      showToast('Mock test deleted successfully', 'success');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Deletion failed', 'error');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('WARNING: This will delete ALL mock tests. Are you sure?')) return;
    try {
      await api.clearAllMockTests();
      showToast('All mock tests cleared', 'success');
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Clear failed', 'error');
    }
  };

  const filteredTests = mockTests.filter(t => {
    if (filterPattern === 'maharashtra') return t.exam_name.includes('Maharashtra');
    if (filterPattern === 'aiims') return t.exam_name.includes('AIIMS');
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Mock Test Simulator & Bulk Generator</h2>
          <p className="text-xs text-slate-500 mt-1">
            Generate and manage timed exams for Maharashtra Govt (DMER/DHS/ZP) and AIIMS NORCET patterns instantly.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-teal-50 text-teal-800 px-4 py-2 rounded-xl text-xs font-bold border border-teal-200">
            Total Tests: {mockTests.length}
          </div>
          {mockTests.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All Tests</span>
            </button>
          )}
        </div>
      </div>

      {/* Bulk Generator Card */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 border border-teal-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">⚡ Bulk Auto-Generate Mock Tests (Test 1, Test 2, ...)</h3>
              <p className="text-xs text-slate-300">
                Instantly pick random questions from your question bank and create multiple exams per exam pattern.
              </p>
            </div>
          </div>

          <form onSubmit={handleBulkGenerate} className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Select Exam Pattern</label>
              <select
                value={selectedPattern}
                onChange={(e) => setSelectedPattern(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-400"
              >
                <option value="maharashtra">🇮🇳 महाराष्ट्र शासन (DMER / DHS / ZP / NHM) Pattern</option>
                <option value="aiims">🏥 AIIMS (NORCET) National CBT Pattern</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                {selectedPattern === 'maharashtra' ? '90 mins • 0.25 negative marking • Bilingual' : '180 mins • 0.33 negative marking • Advanced Clinical'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Number of Tests to Generate</label>
              <select
                value={testCount}
                onChange={(e) => setTestCount(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-400"
              >
                <option value={1}>1 Test (Test 1)</option>
                <option value={3}>3 Tests (Test 1 to 3)</option>
                <option value={5}>5 Tests (Test 1 to 5)</option>
                <option value={10}>10 Tests (Test 1 to 10)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">Batch generated instantly in parallel.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Questions Per Test</label>
              <select
                value={questionsPerTest}
                onChange={(e) => setQuestionsPerTest(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-400"
              >
                <option value={25}>25 MCQs (Rapid Test)</option>
                <option value={50}>50 MCQs (Standard Test)</option>
                <option value={100}>100 MCQs (Full Mock)</option>
                <option value={200}>200 MCQs (NORCET Mega Test)</option>
              </select>
              <p className="text-[11px] text-slate-400 mt-1">Available in bank: {questions.length} questions.</p>
            </div>

            <div className="sm:col-span-3 flex justify-end pt-2">
              <button
                type="submit"
                disabled={isGenerating || questions.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-700 text-slate-950 font-bold rounded-xl transition cursor-pointer shadow-md"
              >
                <Sparkles className="w-5 h-5" />
                <span>{isGenerating ? 'Generating Tests...' : `⚡ Bulk Generate ${testCount} Mock Tests Now`}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Tests List & Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Existing Mock Tests ({filteredTests.length})</h3>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterPattern('all')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${filterPattern === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
            >
              All Patterns
            </button>
            <button
              onClick={() => setFilterPattern('maharashtra')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${filterPattern === 'maharashtra' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600'}`}
            >
              Maharashtra Govt
            </button>
            <button
              onClick={() => setFilterPattern('aiims')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${filterPattern === 'aiims' ? 'bg-indigo-700 text-white shadow-xs' : 'text-slate-600'}`}
            >
              AIIMS NORCET
            </button>
          </div>
        </div>

        {filteredTests.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <FileCheck2 className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-semibold text-slate-600">No mock tests found.</p>
            <p className="text-xs text-slate-400 mt-1">Use the bulk generator above to create tests instantly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTests.map((test) => {
              const isMah = test.exam_name.includes('Maharashtra');
              return (
                <div key={test.id} className="border border-slate-200 rounded-xl p-5 hover:border-teal-500 transition space-y-3 bg-slate-50/50">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-1.5 ${
                        isMah ? 'bg-teal-100 text-teal-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {test.exam_name}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{test.title_en}</h4>
                      <p className="text-xs text-teal-700 font-medium mt-0.5">{test.title_mr}</p>
                    </div>

                    <button
                      onClick={() => handleDelete(test.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Delete test"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{test.description}</p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-xs text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Questions</span>
                      <span className="font-bold text-slate-900">{test.question_ids.length} MCQs</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Duration</span>
                      <span className="font-bold text-slate-900">{test.duration_minutes} Mins</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Negative Mark</span>
                      <span className="font-bold text-rose-600">-{test.negative_marking_rate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
