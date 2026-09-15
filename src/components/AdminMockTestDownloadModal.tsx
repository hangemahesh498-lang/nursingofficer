import React, { useState } from 'react';
import { MockTest, Question } from '../types';
import {
  Printer,
  Download,
  Copy,
  Check,
  FileText,
  X,
  Languages,
  BookOpen,
  HelpCircle,
  Award,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';

interface AdminMockTestDownloadModalProps {
  test: MockTest;
  questions: Question[];
  isOpen: boolean;
  onClose: () => void;
}

export const AdminMockTestDownloadModal: React.FC<AdminMockTestDownloadModalProps> = ({
  test,
  questions,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  // Configuration state
  const [languageMode, setLanguageMode] = useState<'bilingual' | 'mr' | 'en'>('bilingual');
  const [contentMode, setContentMode] = useState<'full' | 'paper_only' | 'explanations_only'>('full');
  const [includeSubjectTags, setIncludeSubjectTags] = useState(true);
  const [includeAnswerGrid, setIncludeAnswerGrid] = useState(true);
  const [instituteName, setInstituteName] = useState('Nursing Officer Exam Preparation Academy (MH Sir)');
  const [copied, setCopied] = useState(false);

  // Filter test questions based on test.question_ids or all provided
  const testQuestions = React.useMemo(() => {
    if (test.question_ids && test.question_ids.length > 0) {
      const map = new Map<string, Question>();
      questions.forEach(q => map.set(q.id, q));
      const list: Question[] = [];
      test.question_ids.forEach(qid => {
        const found = map.get(qid);
        if (found) list.push(found);
      });
      if (list.length > 0) return list;
    }
    return questions;
  }, [test, questions]);

  // Generate printable HTML document
  const generateDocumentHtml = () => {
    const qCount = testQuestions.length;
    const duration = test.duration_minutes || 90;
    const totalMarks = test.total_marks || qCount;
    const negRate = test.negative_marking_rate ? `-${test.negative_marking_rate} Marks` : '1/3rd (0.33)';

    let bodyContent = '';

    // Questions List
    testQuestions.forEach((q, idx) => {
      const qNum = idx + 1;

      // Question text according to language
      let questionHtml = '';
      if (languageMode === 'bilingual') {
        questionHtml = `
          <div style="font-weight: 700; color: #0f172a; margin-bottom: 4px; font-size: 14px;">
            <span style="display: inline-block; width: 26px; color: #0284c7; font-weight: 800;">Q.${qNum}</span>
            ${q.question_en || ''}
          </div>
          ${q.question_mr ? `<div style="font-weight: 600; color: #1e293b; margin-bottom: 8px; margin-left: 26px; font-size: 13.5px; line-height: 1.4;">${q.question_mr}</div>` : ''}
        `;
      } else if (languageMode === 'mr') {
        questionHtml = `
          <div style="font-weight: 700; color: #0f172a; margin-bottom: 6px; font-size: 14px; line-height: 1.4;">
            <span style="display: inline-block; width: 26px; color: #0284c7; font-weight: 800;">Q.${qNum}</span>
            ${q.question_mr || q.question_en || ''}
          </div>
        `;
      } else {
        questionHtml = `
          <div style="font-weight: 700; color: #0f172a; margin-bottom: 6px; font-size: 14px; line-height: 1.4;">
            <span style="display: inline-block; width: 26px; color: #0284c7; font-weight: 800;">Q.${qNum}</span>
            ${q.question_en || q.question_mr || ''}
          </div>
        `;
      }

      // Options
      const options = [
        { key: 'A', en: q.options?.A?.en || (q as any).option_a_en || '', mr: q.options?.A?.mr || (q as any).option_a_mr || '' },
        { key: 'B', en: q.options?.B?.en || (q as any).option_b_en || '', mr: q.options?.B?.mr || (q as any).option_b_mr || '' },
        { key: 'C', en: q.options?.C?.en || (q as any).option_c_en || '', mr: q.options?.C?.mr || (q as any).option_c_mr || '' },
        { key: 'D', en: q.options?.D?.en || (q as any).option_d_en || '', mr: q.options?.D?.mr || (q as any).option_d_mr || '' },
      ];

      const optionsHtml = options.map(opt => {
        const isCorrect = contentMode !== 'paper_only' && q.correct_option === opt.key;
        let optText = '';
        if (languageMode === 'bilingual') {
          optText = `${opt.en}${opt.mr && opt.mr !== opt.en ? ` / <span style="color: #334155;">${opt.mr}</span>` : ''}`;
        } else if (languageMode === 'mr') {
          optText = opt.mr || opt.en;
        } else {
          optText = opt.en || opt.mr;
        }

        return `
          <div style="padding: 5px 8px; margin: 3px 0; border-radius: 6px; font-size: 13px; background: ${isCorrect ? '#ecfdf5' : '#f8fafc'}; border: 1px solid ${isCorrect ? '#10b981' : '#e2e8f0'}; display: flex; align-items: flex-start; gap: 8px;">
            <span style="font-weight: 800; color: ${isCorrect ? '#047857' : '#475569'}; min-width: 22px;">(${opt.key})</span>
            <span style="color: ${isCorrect ? '#065f46' : '#1e293b'}; font-weight: ${isCorrect ? '700' : '500'};">${optText}</span>
            ${isCorrect ? '<span style="margin-left: auto; color: #047857; font-weight: 800; font-size: 11px;">✓ बरोबर उत्तर (Correct)</span>' : ''}
          </div>
        `;
      }).join('');

      // Explanations / Rationale
      let explanationHtml = '';
      if (contentMode !== 'paper_only') {
        let expText = '';
        if (languageMode === 'bilingual') {
          expText = `
            ${q.explanation_mr ? `<div style="margin-bottom: 4px;"><strong style="color: #b45309;">मराठी स्पष्टीकरण:</strong> ${q.explanation_mr}</div>` : ''}
            ${q.explanation_en ? `<div><strong style="color: #0369a1;">English Rationale:</strong> ${q.explanation_en}</div>` : ''}
          `;
        } else if (languageMode === 'mr') {
          expText = `<div><strong style="color: #b45309;">स्पष्टीकरण:</strong> ${q.explanation_mr || q.explanation_en || 'उपलब्ध नाही.'}</div>`;
        } else {
          expText = `<div><strong style="color: #0369a1;">Rationale:</strong> ${q.explanation_en || q.explanation_mr || 'Not available.'}</div>`;
        }

        explanationHtml = `
          <div style="margin-top: 8px; padding: 10px 12px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; font-size: 12.5px; line-height: 1.5; color: #1e293b;">
            <div style="font-weight: 800; color: #92400e; margin-bottom: 4px; font-size: 12px; text-transform: uppercase;">
              💡 अचूक उत्तर: Option (${q.correct_option}) व सविस्तर स्पष्टीकरण
            </div>
            ${expText}
          </div>
        `;
      }

      bodyContent += `
        <div style="margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px dashed #cbd5e1; page-break-inside: avoid;">
          ${includeSubjectTags ? `
            <div style="margin-bottom: 6px; display: flex; gap: 6px; font-size: 10.5px; font-weight: 700;">
              <span style="background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px;">${q.exam_name || 'DMER / DHS / NORCET'}</span>
              <span style="background: #f1f5f9; color: #475569; padding: 2px 8px; border-radius: 4px;">काठिण्य: ${q.difficulty}</span>
              ${q.is_pyq ? '<span style="background: #fef3c7; color: #b45309; padding: 2px 8px; border-radius: 4px;">🏆 PYQ</span>' : ''}
            </div>
          ` : ''}
          ${questionHtml}
          <div style="margin-left: 26px; margin-top: 6px;">
            ${optionsHtml}
            ${explanationHtml}
          </div>
        </div>
      `;
    });

    // Summary Answer Grid at the end
    let answerGridHtml = '';
    if (includeAnswerGrid && contentMode !== 'paper_only') {
      const gridItems = testQuestions.map((q, idx) => `
        <div style="padding: 4px 6px; border: 1px solid #cbd5e1; text-align: center; border-radius: 4px; font-size: 11.5px; background: #f8fafc;">
          <span style="color: #64748b; font-size: 10px;">Q.${idx + 1}</span>
          <div style="font-weight: 800; color: #0f172a; font-size: 13px;">${q.correct_option}</div>
        </div>
      `).join('');

      answerGridHtml = `
        <div style="margin-top: 30px; page-break-before: always; border: 2px solid #0f172a; border-radius: 10px; padding: 16px;">
          <h3 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 900; color: #0f172a; text-transform: uppercase; text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
            🏁 उत्तरतालिका तक्ता (Quick Answer Key Grid)
          </h3>
          <div style="display: grid; grid-template-columns: repeat(10, 1fr); gap: 6px;">
            ${gridItems}
          </div>
        </div>
      `;
    }

    return `
      <!DOCTYPE html>
      <html lang="mr">
      <head>
        <meta charset="UTF-8">
        <title>${test.title_mr || test.title_en} — प्रश्नपत्रिका व स्पष्टीकरण शीट</title>
        <style>
          @page {
            size: A4;
            margin: 15mm 15mm 15mm 15mm;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #0f172a;
            line-height: 1.45;
            background: #ffffff;
            margin: 0;
            padding: 20px;
          }
          .header-box {
            text-align: center;
            border: 2px solid #0f172a;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 24px;
            background: #f8fafc;
          }
          .inst-name {
            font-size: 18px;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: -0.5px;
          }
          .exam-title {
            font-size: 16px;
            font-weight: 800;
            color: #0284c7;
            margin: 4px 0 8px 0;
          }
          .meta-row {
            display: flex;
            justify-content: space-around;
            border-top: 1px solid #cbd5e1;
            padding-top: 8px;
            margin-top: 8px;
            font-size: 12px;
            font-weight: 700;
            color: #334155;
          }
          @media print {
            body {
              padding: 0;
            }
            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="header-box">
          <div class="inst-name">${instituteName}</div>
          <div class="exam-title">${test.title_mr || test.title_en} ${languageMode === 'bilingual' ? `(${test.title_en})` : ''}</div>
          <div style="font-size: 12px; color: #475569; margin-bottom: 4px;">
            नर्सिंग अधिकारी भरती परीक्षा विशेष टेस्ट सिरीज | Official Test Series Question Paper & Solution Sheet
          </div>
          <div class="meta-row">
            <div>एकूण प्रश्न: <strong>${qCount} MCQs</strong></div>
            <div>कालावधी: <strong>${duration} मिनिटे</strong></div>
            <div>एकूण गुण: <strong>${totalMarks} Marks</strong></div>
            <div>नकारात्मक गुण: <strong>${negRate}</strong></div>
          </div>
        </div>

        ${bodyContent}
        ${answerGridHtml}

        <div style="text-align: center; margin-top: 30px; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 12px;">
          Generated by Nursing Officer Prep Academy • Confidential Test Series Document
        </div>
      </body>
      </html>
    `;
  };

  const handlePrint = () => {
    const html = generateDocumentHtml();
    try {
      // Hidden iframe print is resilient to iframe sandbox / popup blocker
      const printIframe = document.createElement('iframe');
      printIframe.style.position = 'fixed';
      printIframe.style.right = '0';
      printIframe.style.bottom = '0';
      printIframe.style.width = '0';
      printIframe.style.height = '0';
      printIframe.style.border = '0';
      document.body.appendChild(printIframe);
      const printDoc = printIframe.contentWindow?.document || printIframe.contentDocument;
      if (printDoc) {
        printDoc.open();
        printDoc.write(html);
        printDoc.close();
        setTimeout(() => {
          printIframe.contentWindow?.focus();
          printIframe.contentWindow?.print();
          setTimeout(() => {
            if (document.body.contains(printIframe)) {
              document.body.removeChild(printIframe);
            }
          }, 3000);
        }, 400);
        return;
      }
    } catch (e) {
      console.warn('Iframe print failed, falling back to window.open', e);
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const handleDownloadHtml = () => {
    const html = generateDocumentHtml();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTitle = (test.title_mr || test.title_en).replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '_');
    link.href = url;
    link.download = `${safeTitle}_QuestionPaper_${languageMode}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyText = () => {
    let plainText = `${instituteName}\n${test.title_mr || test.title_en}\nएकूण प्रश्न: ${testQuestions.length} | कालावधी: ${test.duration_minutes || 90} Min\n\n`;
    testQuestions.forEach((q, idx) => {
      plainText += `Q.${idx + 1} ${languageMode === 'mr' ? (q.question_mr || q.question_en) : (q.question_en || q.question_mr)}\n`;
      if (languageMode === 'bilingual' && q.question_mr && q.question_en) {
        plainText += `मराठी: ${q.question_mr}\n`;
      }
      plainText += `(A) ${q.options?.A?.en || (q as any).option_a_en || ''} ${(q.options?.A?.mr || (q as any).option_a_mr) ? `/ ${q.options?.A?.mr || (q as any).option_a_mr}` : ''}\n`;
      plainText += `(B) ${q.options?.B?.en || (q as any).option_b_en || ''} ${(q.options?.B?.mr || (q as any).option_b_mr) ? `/ ${q.options?.B?.mr || (q as any).option_b_mr}` : ''}\n`;
      plainText += `(C) ${q.options?.C?.en || (q as any).option_c_en || ''} ${(q.options?.C?.mr || (q as any).option_c_mr) ? `/ ${q.options?.C?.mr || (q as any).option_c_mr}` : ''}\n`;
      plainText += `(D) ${q.options?.D?.en || (q as any).option_d_en || ''} ${(q.options?.D?.mr || (q as any).option_d_mr) ? `/ ${q.options?.D?.mr || (q as any).option_d_mr}` : ''}\n`;
      if (contentMode !== 'paper_only') {
        plainText += `✓ बरोबर उत्तर: Option (${q.correct_option})\n`;
        if (q.explanation_mr) plainText += `स्पष्टीकरण (मराठी): ${q.explanation_mr}\n`;
        if (q.explanation_en) plainText += `Rationale (English): ${q.explanation_en}\n`;
      }
      plainText += `\n------------------------------------\n\n`;
    });

    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-6 my-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-900/20">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-teal-100 text-teal-800">
                  ADMIN ONLY EXPORT ENGINE
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  {testQuestions.length} प्रश्न उपलब्ध
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                📥 प्रश्नपत्रिका व सविस्तर स्पष्टीकरण शीट डाउनलोड करा
              </h2>
              <p className="text-xs text-slate-500">
                {test.title_mr || test.title_en}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Options */}
        <div className="space-y-4 text-xs">
          {/* 1. Language Mode */}
          <div>
            <label className="block font-black text-slate-800 mb-2 flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-teal-600" />
              <span>१. भाषा निवडा (Language Selection) *</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setLanguageMode('bilingual')}
                className={`p-3 rounded-xl border text-left font-bold transition cursor-pointer flex flex-col justify-between ${
                  languageMode === 'bilingual'
                    ? 'border-teal-600 bg-teal-50/70 text-teal-900 ring-2 ring-teal-500/20'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm">मराठी + English</span>
                  {languageMode === 'bilingual' && <Check className="w-4 h-4 text-teal-600" />}
                </div>
                <span className="text-[11px] text-slate-500 font-medium mt-1">
                  दोन्ही भाषांमध्ये प्रश्न व स्पष्टीकरण (Bilingual Full Sheet)
                </span>
              </button>

              <button
                type="button"
                onClick={() => setLanguageMode('mr')}
                className={`p-3 rounded-xl border text-left font-bold transition cursor-pointer flex flex-col justify-between ${
                  languageMode === 'mr'
                    ? 'border-teal-600 bg-teal-50/70 text-teal-900 ring-2 ring-teal-500/20'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm">केवळ मराठी (Marathi)</span>
                  {languageMode === 'mr' && <Check className="w-4 h-4 text-teal-600" />}
                </div>
                <span className="text-[11px] text-slate-500 font-medium mt-1">
                  मराठी प्रश्न, पर्याय आणि संपूर्ण मराठी स्पष्टीकरण
                </span>
              </button>

              <button
                type="button"
                onClick={() => setLanguageMode('en')}
                className={`p-3 rounded-xl border text-left font-bold transition cursor-pointer flex flex-col justify-between ${
                  languageMode === 'en'
                    ? 'border-teal-600 bg-teal-50/70 text-teal-900 ring-2 ring-teal-500/20'
                    : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm">English Only</span>
                  {languageMode === 'en' && <Check className="w-4 h-4 text-teal-600" />}
                </div>
                <span className="text-[11px] text-slate-500 font-medium mt-1">
                  Standard English paper & complete clinical rationales
                </span>
              </button>
            </div>
          </div>

          {/* 2. Content Mode */}
          <div>
            <label className="block font-black text-slate-800 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>२. दस्तऐवज प्रकार (Document Content Type) *</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setContentMode('full')}
                className={`p-3 rounded-xl border text-left font-bold transition cursor-pointer ${
                  contentMode === 'full'
                    ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs">पूर्ण प्रश्न + उत्तर + स्पष्टीकरण</div>
                <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                  सर्व MCQs आणि प्रत्येक प्रश्नाचे परिपूर्ण विश्लेषण
                </div>
              </button>

              <button
                type="button"
                onClick={() => setContentMode('paper_only')}
                className={`p-3 rounded-xl border text-left font-bold transition cursor-pointer ${
                  contentMode === 'paper_only'
                    ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs">केवळ प्रश्नपत्रिका (Question Paper)</div>
                <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                  ऑफलाईन परीक्षेसाठी (उत्तरे व स्पष्टीकरण न दाखवता)
                </div>
              </button>

              <button
                type="button"
                onClick={() => setContentMode('explanations_only')}
                className={`p-3 rounded-xl border text-left font-bold transition cursor-pointer ${
                  contentMode === 'explanations_only'
                    ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs">उत्तरतालिका व स्पष्टीकरण शीट</div>
                <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                  केवळ अचूक पर्याय व सविस्तर अभ्यास नोट्स
                </div>
              </button>
            </div>
          </div>

          {/* 3. Toggles & Header Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                संस्था / अकॅडमी नाव (Header Title)
              </label>
              <input
                type="text"
                value={instituteName}
                onChange={e => setInstituteName(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
              />
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSubjectTags}
                  onChange={e => setIncludeSubjectTags(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600"
                />
                <span>विषय व काठिण्य पातळी बॅज समाविष्ट करा</span>
              </label>

              <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAnswerGrid}
                  onChange={e => setIncludeAnswerGrid(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600"
                />
                <span>शेवटी संक्षिप्त उत्तरतालिका तक्ता (Answer Grid) समाविष्ट करा</span>
              </label>
            </div>
          </div>
        </div>

        {/* Live Preview Information */}
        <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              निवडलेली भाषा: <strong>{languageMode === 'bilingual' ? 'मराठी + इंग्रजी दोन्ही' : languageMode === 'mr' ? 'मराठी' : 'English'}</strong> | एकूण प्रश्न: <strong>{testQuestions.length} MCQs</strong>
            </span>
          </div>
          <span className="font-mono text-[11px] text-teal-700 font-bold">
            A4 Print-Ready PDF
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={handleCopyText}
            className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'मजकूर कॉपी झाला!' : 'मजकूर कॉपी करा (Copy Text)'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadHtml}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>HTML फाईल डाउनलोड (Offline)</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs flex items-center gap-2 transition cursor-pointer shadow-md shadow-teal-900/20"
            >
              <Printer className="w-4 h-4" />
              <span>प्रिंट करा / PDF सेव्ह करा (Print PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BilingualMockTestDownloadModal = AdminMockTestDownloadModal;
