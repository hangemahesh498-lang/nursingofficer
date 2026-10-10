const crypto = require("crypto");

function computeDuplicateHash(text) {
  const normalized = (text || "").toLowerCase().replace(/[^\w\u0900-\u097F]/g, "");
  return crypto.createHash("sha256").update(normalized).digest("hex").substring(0, 16);
}

function buildQuestion(item, subjectId) {
  const hash = computeDuplicateHash(item.question_en);
  return {
    id: `qb-${subjectId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    subject_id: subjectId,
    question_en: item.question_en,
    question_mr: item.question_mr,
    option_a_en: item.option_a_en || item.correct_en,
    option_a_mr: item.option_a_mr || item.correct_mr,
    option_b_en: item.option_b_en || item.distractor1_en,
    option_b_mr: item.option_b_mr || item.distractor1_mr,
    option_c_en: item.option_c_en || item.distractor2_en,
    option_c_mr: item.option_c_mr || item.distractor2_mr,
    option_d_en: item.option_d_en || item.distractor3_en,
    option_d_mr: item.option_d_mr || item.distractor3_mr,
    correct_option: item.correct_option || "A",
    explanation_en: item.explanation_en,
    explanation_mr: item.explanation_mr,
    difficulty: item.difficulty || "medium",
    question_type: "single_best",
    exam_tags: item.exam_tags || ["DMER", "DHS", "ZP", "NORCET", "ESIC"],
    exam_name: item.exam_name || "Maharashtra Health Dept & Nursing Officer Exams",
    status: "published",
    is_verified_pyq: true,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    duplicate_hash: hash
  };
}

module.exports = {
  computeDuplicateHash,
  buildQuestion
};
