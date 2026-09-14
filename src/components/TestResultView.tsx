import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TestAttempt, Question, MockTest } from '../types';
import jsPDF from 'jspdf';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  HelpCircle,
  Share2,
  Download,
  Play,
  FileText
} from 'lucide-react';

interface TestResultViewProps {
  attempt: TestAttempt;
  questions: Question[];
  test?: MockTest;
  onRetest: () => void;
  onGoToMistakes: () => void;
  onBackToDashboard: () => void;
}

export const TestResultView: React.FC<TestResultViewProps> = ({
  attempt,
  questions,
  test,
  onRetest,
  onGoToMistakes,
  onBackToDashboard
}) => {
  const { language } = useLanguage();
  const [filterType, setFilterType] = useState<'all' | 'wrong' | 'correct' | 'unattempted'>('all');
  const [showVideoModal, setShowVideoModal] = useState(false);

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('watch?v=')) {
      videoId = url.split('watch?v=')[1]?.split('&')[0] || '';
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0] || '';
    } else {
      videoId = url.trim();
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : url;
  };

  const questionMap = new Map<string, Question>();
  questions.forEach(q => questionMap.set(q.id, q));

  const answersWithQuestions = attempt.answers.map(ans => ({
    ...ans,
    question: questionMap.get(ans.question_id)
  })).filter(a => !!a.question);

  const filteredAnswers = answersWithQuestions.filter(a => {
    if (filterType === 'wrong') return !a.is_correct && a.selected_option !== null;
    if (filterType === 'correct') return a.is_correct;
    if (filterType === 'unattempted') return a.selected_option === null;
    return true;
  });

  const percentage = Math.round((attempt.score / attempt.total_marks) * 100);
  const isQualified = percentage >= 50; // standard qualifying bench

  const generatePDFReport = () => {
    try {
      const doc = new jsPDF();

      // Header Banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 35, 'F');

      doc.setTextColor(20, 184, 166); // teal-500
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('NURSING OFFICER ONLINE TEST SERIES', 15, 15);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('OFFICIAL EXAMINATION PERFORMANCE REPORT & SCORECARD', 15, 24);

      // Report Info Box
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(15, 42, 180, 32, 3, 3, 'FD');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`Exam Paper: ${attempt.test_title}`, 20, 50);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Attempt ID: ${attempt.id.slice(0, 12)}`, 20, 57);
      doc.text(`Completed Date: ${new Date(attempt.completed_at).toLocaleString()}`, 20, 64);

      doc.text(`Total Duration: ${Math.round(attempt.time_spent_seconds / 60)} Mins`, 120, 57);
      doc.text(`Result Status: ${isQualified ? 'PASSED / QUALIFIED' : 'NEEDS REMEDIATION'}`, 120, 64);

      // Big Score Summary Box
      if (isQualified) {
        doc.setFillColor(236, 253, 245); // emerald-50
        doc.setDrawColor(16, 185, 129);
      } else {
        doc.setFillColor(254, 243, 199); // amber-50
        doc.setDrawColor(245, 158, 11);
      }
      doc.roundedRect(15, 80, 180, 35, 3, 3, 'FD');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`TOTAL MARKS SCORED: ${attempt.score.toFixed(2)} / ${attempt.total_marks}`, 25, 93);

      doc.setFontSize(16);
      doc.setTextColor(isQualified ? 16 : 217, isQualified ? 185 : 119, isQualified ? 129 : 6);
      doc.text(`PERCENTAGE: ${percentage}%`, 25, 105);

      // Detailed Performance Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(15, 122, 180, 10, 'F');
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('METRIC', 20, 128);
      doc.text('COUNT / VALUE', 130, 128);

      let y = 138;
      const metrics = [
        ['Total Questions In Test', `${attempt.total_questions} Questions`],
        ['Correct Answers (+1.0 mark)', `${attempt.correct_count} Correct`],
        ['Incorrect Answers (-Negative)', `${attempt.wrong_count} Incorrect`],
        ['Unattempted Questions', `${attempt.unattempted_count} Unattempted`],
        ['Accuracy Rate', `${Math.round((attempt.correct_count / (attempt.correct_count + attempt.wrong_count || 1)) * 100)}%`],
        ['Time Spent', `${Math.floor(attempt.time_spent_seconds / 60)}m ${attempt.time_spent_seconds % 60}s`]
      ];

      metrics.forEach(([label, val], idx) => {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 41, 59);
        doc.text(label, 20, y);
        doc.setFont('helvetica', 'bold');
        doc.text(val, 130, y);
        doc.setDrawColor(241, 245, 249);
        doc.line(15, y + 2, 195, y + 2);
        y += 8;
      });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.setFont('helvetica', 'italic');
      doc.text('Generated by Nursing Officer Online Test Series Platform • Verified Report', 15, 280);

      doc.save(`Nursing_Officer_Result_${attempt.test_title.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      window.print();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* YouTube Video Explanation Banner (Visible ONLY if enable_youtube_video is ON) */}
      {test?.enable_youtube_video && test?.youtube_url && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-red-500/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 shadow-inner">
              <Play className="w-6 h-6 fill-current text-white ml-0.5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/20 text-[11px] font-bold text-rose-100 mb-1">
                <span>🔴 LIVE Explanation</span>
              </div>
              <h3 className="font-black text-base sm:text-lg text-white">
                {language === 'mr' ? '▶️ या चाचणीचे संपूर्ण युट्युब व्हिडिओ विश्लेषण पहा' : '▶️ Watch Full YouTube Explanation Video'}
              </h3>
              <p className="text-xs text-rose-100 mt-0.5">
                {language === 'mr'
                  ? 'शिक्षकांनी या टेस्ट मधील सर्व १०० प्रश्नांचे सविस्तर स्पष्टीकरण व्हिडिओ मध्ये दिले आहे.'
                  : 'Detailed step-by-step video analysis for all questions explained by faculty.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowVideoModal(true)}
            className="px-5 py-3 bg-white hover:bg-rose-50 text-rose-700 font-black text-xs sm:text-sm rounded-xl transition cursor-pointer shadow-md shrink-0 flex items-center justify-center gap-2"
          >
            <span>{language === 'mr' ? 'व्हिडिओ प्ले करा' : 'Watch Video'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Embedded YouTube Player Modal */}
      {showVideoModal && test?.youtube_url && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl space-y-4 p-4 text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5 font-bold text-sm text-rose-400">
                <Play className="w-4 h-4 fill-current" />
                <span className="truncate max-w-lg">{test.title_mr || test.title_en} — युट्युब स्पष्टीकरण व्हिडिओ</span>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer text-xs font-bold"
              >
                ✕ बंद करा
              </button>
            </div>

            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
              <iframe
                src={getEmbedUrl(test.youtube_url)}
                title="YouTube Explanation Video"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400">माहिती: हा व्हिडिओ ऍडमिनने या टेस्टसाठी उपलब्ध करून दिला आहे.</span>
              <a
                href={test.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-rose-400 hover:text-rose-300 underline flex items-center gap-1"
              >
                <span>YouTube App मध्ये उघडा</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Result Card Hero */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isQualified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isQualified ? 'NORCET Qualified Range' : 'Remediation Recommended'}
              </span>
              <span className="text-xs text-slate-400">ID: {attempt.id.slice(0, 8)}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{attempt.test_title}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Completed on {new Date(attempt.completed_at).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={generatePDFReport}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>{language === 'mr' ? 'पीडीएफ गुणपत्रिका डाउनलोड' : 'Download Scorecard PDF'}</span>
            </button>

            <button
              onClick={onRetest}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Test</span>
            </button>

            {attempt.wrong_count > 0 && (
              <button
                onClick={onGoToMistakes}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Open Mistake Notebook ({attempt.wrong_count})</span>
              </button>
            )}
          </div>
        </div>

        {/* Score Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 font-semibold mb-1">Final Score</div>
            <div className="text-2xl font-extrabold text-teal-700">
              {attempt.score} <span className="text-xs font-normal text-slate-400">/ {attempt.total_marks}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Includes -0.33 negative mark</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 font-semibold mb-1">Accuracy</div>
            <div className="text-2xl font-extrabold text-slate-900">{attempt.accuracy_percentage}%</div>
            <div className="text-[11px] text-slate-500 mt-1">
              {attempt.correct_count} of {attempt.correct_count + attempt.wrong_count} attempted
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 font-semibold mb-1">Time Invested</div>
            <div className="text-2xl font-extrabold text-slate-900">
              {Math.floor(attempt.time_spent_seconds / 60)}m {attempt.time_spent_seconds % 60}s
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              ~{Math.round(attempt.time_spent_seconds / (attempt.answers.length || 1))}s per question
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500 font-semibold mb-1">Score Breakdown</div>
            <div className="flex items-center gap-2 text-xs font-bold mt-2">
              <span className="text-emerald-600">✓ {attempt.correct_count}</span>
              <span className="text-rose-600">✗ {attempt.wrong_count}</span>
              <span className="text-slate-400">○ {attempt.unattempted_count}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Question by Question Review Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900">
            Question-by-Question Clinical Review
          </h2>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              All ({answersWithQuestions.length})
            </button>
            <button
              onClick={() => setFilterType('wrong')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterType === 'wrong' ? 'bg-rose-500 text-white shadow-xs' : 'text-rose-700'
              }`}
            >
              Incorrect ({attempt.wrong_count})
            </button>
            <button
              onClick={() => setFilterType('correct')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterType === 'correct' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700'
              }`}
            >
              Correct ({attempt.correct_count})
            </button>
            <button
              onClick={() => setFilterType('unattempted')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                filterType === 'unattempted' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Skipped ({attempt.unattempted_count})
            </button>
          </div>
        </div>

        {/* Questions Detailed Review List */}
        <div className="space-y-4">
          {filteredAnswers.map((item, idx) => {
            const q = item.question!;
            const isAnswered = item.selected_option !== null;
            const isCorrect = item.is_correct;

            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl border p-6 shadow-xs space-y-4 ${
                  !isAnswered
                    ? 'border-slate-200'
                    : isCorrect
                    ? 'border-emerald-200 bg-emerald-50/10'
                    : 'border-rose-200 bg-rose-50/10'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">Item #{idx + 1}</span>
                  <div className="flex items-center gap-2">
                    {!isAnswered ? (
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                        Unattempted
                      </span>
                    ) : isCorrect ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+1.00)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect (-0.33)
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-sm font-bold text-slate-900 leading-relaxed">
                  {q.question_en}
                </div>
                {q.question_mr && q.question_mr.trim().toLowerCase() !== q.question_en.trim().toLowerCase() && (
                  <div className="text-xs font-medium text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                    {q.question_mr}
                  </div>
                )}

                {/* Options Review */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(['A', 'B', 'C', 'D'] as const).map(optKey => {
                    const optEn = q[`option_${optKey.toLowerCase()}_en` as keyof Question] as string;
                    const isUserChoice = item.selected_option === optKey;
                    const isCorrectChoice = q.correct_option === optKey;

                    let optStyle = 'border-slate-200 bg-white text-slate-700';
                    if (isCorrectChoice) {
                      optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                    } else if (isUserChoice && !isCorrectChoice) {
                      optStyle = 'border-rose-500 bg-rose-50 text-rose-950 font-semibold';
                    }

                    return (
                      <div
                        key={optKey}
                        className={`p-3 rounded-xl border flex items-center justify-between ${optStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md border flex items-center justify-center font-bold text-[11px]">
                            {optKey}
                          </span>
                          <span>{optEn}</span>
                        </div>
                        {isCorrectChoice && <span className="text-emerald-700 text-[11px] font-bold">Correct</span>}
                        {isUserChoice && !isCorrectChoice && <span className="text-rose-700 text-[11px] font-bold">Your Choice</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Rationale */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                    <span>Clinical Rationale / स्पष्टीकरण:</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{q.explanation_en}</p>
                  {q.explanation_mr && (
                    <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                      {q.explanation_mr}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200 flex justify-center">
        <button
          onClick={onBackToDashboard}
          className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};
