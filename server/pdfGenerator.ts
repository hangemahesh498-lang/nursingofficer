import { Question, Subject } from '../src/types/index.ts';

export interface PdfExportOptions {
  subjectId?: string;
  examTarget?: string;
  includeAnswers?: boolean;
  includeExplanations?: boolean;
  paperTitle?: string;
}

export function generateQuestionsPrintableHtml(
  questions: Question[],
  subjects: Subject[],
  options: PdfExportOptions = {}
): string {
  const includeAnswers = options.includeAnswers !== false;
  const includeExplanations = options.includeExplanations !== false;
  
  let targetSubject: Subject | undefined;
  if (options.subjectId && options.subjectId !== 'all') {
    targetSubject = subjects.find(s => s.id === options.subjectId);
  }

  const titleEn = targetSubject 
    ? `${targetSubject.name_en} - Certified Question Bank` 
    : (options.paperTitle || 'All Subjects Grand Master Question Bank');
  
  const titleMr = targetSubject 
    ? `${targetSubject.name_mr || targetSubject.name_en} - संपूर्ण प्रश्नसंच` 
    : 'सर्व विषयांचा संपूर्ण ग्रँड प्रश्नसंच (AIIMS NORCET / DMER / CHO / RRB)';

  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Group questions by subject if exporting all
  const subjectMap = new Map<string, Subject>();
  subjects.forEach(s => subjectMap.set(s.id, s));

  // Build Question Cards
  const questionsHtml = questions.map((q, idx) => {
    const sub = subjectMap.get(q.subject_id);
    const subLabel = sub ? `${sub.name_en} (${sub.name_mr || ''})` : (q.subject_id || 'General Nursing');
    const diffLabel = q.difficulty ? q.difficulty.toUpperCase() : 'MEDIUM';
    const examLabel = q.exam_name || 'AIIMS NORCET / DMER / CHO';

    const optAEn = q.option_a_en || '';
    const optAMr = q.option_a_mr || '';
    const optBEn = q.option_b_en || '';
    const optBMr = q.option_b_mr || '';
    const optCEn = q.option_c_en || '';
    const optCMr = q.option_c_mr || '';
    const optDEn = q.option_d_en || '';
    const optDMr = q.option_d_mr || '';

    const expEn = q.explanation_en || '';
    const expMr = q.explanation_mr || '';

    return `
      <div class="question-card">
        <div class="q-header">
          <div class="q-num">प्र. ${idx + 1} / Q.${idx + 1}</div>
          <div class="q-tags">
            <span class="tag subject-tag">${subLabel}</span>
            <span class="tag diff-tag">${diffLabel}</span>
            <span class="tag exam-tag">${examLabel}</span>
          </div>
        </div>

        <div class="q-stems">
          <div class="q-stem-mr"><strong>(मराठी):</strong> ${q.question_mr || q.question_en}</div>
          <div class="q-stem-en"><strong>(English):</strong> ${q.question_en}</div>
        </div>

        ${q.image_url ? `
          <div class="q-image-container">
            <img src="${q.image_url}" alt="Clinical Reference Diagram" class="q-img" onerror="this.style.display='none'"/>
          </div>
        ` : ''}

        <div class="options-grid">
          <div class="option-item ${includeAnswers && q.correct_option === 'A' ? 'correct-opt' : ''}">
            <span class="opt-key">A</span>
            <div class="opt-content">
              <span class="opt-mr">${optAMr || optAEn}</span>
              <span class="opt-en">${optAEn}</span>
            </div>
          </div>

          <div class="option-item ${includeAnswers && q.correct_option === 'B' ? 'correct-opt' : ''}">
            <span class="opt-key">B</span>
            <div class="opt-content">
              <span class="opt-mr">${optBMr || optBEn}</span>
              <span class="opt-en">${optBEn}</span>
            </div>
          </div>

          <div class="option-item ${includeAnswers && q.correct_option === 'C' ? 'correct-opt' : ''}">
            <span class="opt-key">C</span>
            <div class="opt-content">
              <span class="opt-mr">${optCMr || optCEn}</span>
              <span class="opt-en">${optCEn}</span>
            </div>
          </div>

          <div class="option-item ${includeAnswers && q.correct_option === 'D' ? 'correct-opt' : ''}">
            <span class="opt-key">D</span>
            <div class="opt-content">
              <span class="opt-mr">${optDMr || optDEn}</span>
              <span class="opt-en">${optDEn}</span>
            </div>
          </div>
        </div>

        ${includeAnswers ? `
          <div class="answer-box">
            <div class="ans-badge">
              <span class="badge-icon">✅</span>
              <span><strong>अचूक उत्तर (Correct Answer): पर्याय (${q.correct_option})</strong></span>
            </div>

            ${includeExplanations && (expMr || expEn) ? `
              <div class="explanation-box">
                <div class="exp-title">💡 क्लिनिकल स्पष्टीकरण व संदर्भ (Clinical Rationale):</div>
                ${expMr ? `<div class="exp-mr"><strong>मराठी:</strong> ${expMr}</div>` : ''}
                ${expEn ? `<div class="exp-en"><strong>English:</strong> ${expEn}</div>` : ''}
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  // Answer Key Table for Question Paper Mode
  const answerKeyTableHtml = !includeAnswers ? `
    <div class="answer-key-section">
      <h3 class="ack-title">📝 ANSWER KEY / उत्तरतालिका</h3>
      <div class="ack-grid">
        ${questions.map((q, idx) => `
          <div class="ack-item">
            <span class="ack-q">Q.${idx + 1}</span>
            <span class="ack-ans">(${q.correct_option || '-'})</span>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  return `<!DOCTYPE html>
<html lang="mr">
<head>
  <meta charset="UTF-8">
  <title>${titleEn} - Official PDF</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700;800&family=Inter:wght@400;600;700;800&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', 'Noto Sans Devanagari', sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      line-height: 1.5;
      padding: 24px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }

    /* Top Action Bar (hidden in print) */
    .top-action-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #1e1b4b;
      color: #ffffff;
      padding: 16px 24px;
      border-radius: 12px;
      margin-bottom: 24px;
      gap: 16px;
    }

    .btn-print {
      background: #10b981;
      color: #ffffff;
      font-weight: 700;
      font-size: 14px;
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }
    .btn-print:hover {
      background: #059669;
      transform: translateY(-1px);
    }

    /* Document Header */
    .doc-header {
      text-align: center;
      border-bottom: 3px double #cbd5e1;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }

    .academy-badge {
      display: inline-block;
      background: #e0e7ff;
      color: #3730a3;
      font-weight: 800;
      font-size: 12px;
      padding: 4px 14px;
      border-radius: 999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .doc-title-en {
      font-size: 22px;
      font-weight: 800;
      color: #1e1b4b;
      margin-bottom: 4px;
    }

    .doc-title-mr {
      font-size: 18px;
      font-weight: 700;
      color: #312e81;
      margin-bottom: 12px;
    }

    .doc-meta-row {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 16px;
      font-size: 12px;
      color: #64748b;
      font-weight: 600;
    }

    .meta-pill {
      background: #f1f5f9;
      padding: 4px 12px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }

    /* Question Card */
    .question-card {
      border: 1px solid #e2e8f0;
      background: #ffffff;
      border-radius: 12px;
      padding: 18px 20px;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }

    .q-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 8px;
    }

    .q-num {
      font-weight: 800;
      font-size: 15px;
      color: #1e1b4b;
    }

    .q-tags {
      display: flex;
      gap: 6px;
    }

    .tag {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .subject-tag { background: #e0e7ff; color: #3730a3; }
    .diff-tag { background: #fef3c7; color: #92400e; }
    .exam-tag { background: #dcfce7; color: #166534; }

    .q-stems {
      margin-bottom: 12px;
      font-size: 14px;
      color: #0f172a;
    }

    .q-stem-mr {
      font-weight: 600;
      margin-bottom: 4px;
      color: #1e293b;
    }

    .q-stem-en {
      font-size: 13px;
      color: #334155;
    }

    .q-image-container {
      margin: 10px 0;
      text-align: center;
    }
    .q-img {
      max-width: 280px;
      max-height: 180px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
    }

    /* Options Grid */
    .options-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-bottom: 12px;
    }

    .option-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 8px 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 12.5px;
    }

    .correct-opt {
      background: #f0fdf4;
      border-color: #86efac;
      font-weight: 600;
    }

    .opt-key {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      background: #e2e8f0;
      color: #1e293b;
      font-weight: 800;
      font-size: 11px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .correct-opt .opt-key {
      background: #22c55e;
      color: #ffffff;
    }

    .opt-content {
      display: flex;
      flex-direction: column;
    }
    .opt-mr { font-weight: 600; color: #1e293b; }
    .opt-en { font-size: 11.5px; color: #64748b; }

    /* Answer & Explanation Box */
    .answer-box {
      background: #f0fdf4;
      border-top: 1px dashed #bbf7d0;
      padding-top: 10px;
      margin-top: 8px;
      font-size: 12px;
    }

    .ans-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #15803d;
      font-size: 13px;
      margin-bottom: 6px;
    }

    .explanation-box {
      background: #ffffff;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid #dcfce7;
      color: #334155;
      font-size: 12px;
    }

    .exp-title {
      font-weight: 700;
      color: #166534;
      margin-bottom: 4px;
    }

    .exp-mr { margin-bottom: 3px; font-weight: 500; }
    .exp-en { color: #64748b; font-size: 11px; }

    /* Answer Key Section */
    .answer-key-section {
      margin-top: 30px;
      padding: 20px;
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      page-break-before: always;
    }
    .ack-title {
      font-size: 16px;
      font-weight: 800;
      text-align: center;
      color: #1e1b4b;
      margin-bottom: 16px;
    }
    .ack-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
    }
    .ack-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #ffffff;
      padding: 6px 12px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-weight: 700;
      font-size: 12px;
    }
    .ack-ans { color: #16a34a; }

    /* Footer */
    .doc-footer {
      text-align: center;
      border-top: 1px solid #e2e8f0;
      padding-top: 16px;
      margin-top: 30px;
      font-size: 11px;
      color: #94a3b8;
    }

    /* Print Styles */
    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .container {
        box-shadow: none;
        padding: 0;
        max-width: 100%;
      }
      .top-action-bar {
        display: none !important;
      }
      .question-card {
        border-color: #cbd5e1;
      }
      @page {
        size: A4 portrait;
        margin: 12mm 10mm 15mm 10mm;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Action Bar -->
    <div class="top-action-bar">
      <div>
        <div style="font-weight: 800; font-size: 16px;">📄 Nursing Officer MCQ Book (Print / Save as PDF)</div>
        <div style="font-size: 12px; color: #cbd5e1;">A4 प्रिंट किंवा PDF डाऊनलोड करण्यासाठी खालील बटण दाबा.</div>
      </div>
      <button onclick="window.print()" class="btn-print">
        <span>🖨️</span>
        <span>प्रिंट किंवा PDF सेव्ह करा (Print / PDF)</span>
      </button>
    </div>

    <!-- Document Header -->
    <div class="doc-header">
      <div class="academy-badge">Certified Nursing Officer Study Material</div>
      <h1 class="doc-title-en">${titleEn}</h1>
      <h2 class="doc-title-mr">${titleMr}</h2>
      <div class="doc-meta-row">
        <span class="meta-pill">📊 एकूण प्रश्न: ${questions.length} MCQs</span>
        <span class="meta-pill">📅 तारीख: ${dateStr}</span>
        <span class="meta-pill">🎯 परीक्षा: AIIMS NORCET / DMER / DHS / CHO / RRB</span>
        <span class="meta-pill">🌐 भाषा: English + Marathi (Bilingual)</span>
      </div>
    </div>

    <!-- Questions Container -->
    <div class="questions-container">
      ${questionsHtml}
    </div>

    ${answerKeyTableHtml}

    <!-- Footer -->
    <div class="doc-footer">
      <p>© ${new Date().getFullYear()} Nursing Officer Exam Preparation Academy • All Rights Reserved</p>
      <p>Official Mobile & Web Platform for Maharashtra Health & All-India Nursing Aspirants</p>
    </div>
  </div>

  <script>
    // Auto-trigger print dialog if query param print=true is set
    if (new URLSearchParams(window.location.search).get('autoprint') === 'true') {
      window.addEventListener('load', function() {
        setTimeout(function() { window.print(); }, 500);
      });
    }
  </script>
</body>
</html>`;
}
