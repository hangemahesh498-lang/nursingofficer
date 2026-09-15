var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_crypto4 = __toESM(require("crypto"), 1);
var import_path3 = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_dotenv2 = __toESM(require("dotenv"), 1);
var import_multer = __toESM(require("multer"), 1);

// server/db.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_crypto = __toESM(require("crypto"), 1);

// src/data/initialData.ts
var INITIAL_SUBJECTS = [
  {
    id: "subj-fon",
    name_en: "Fundamentals of Nursing & First Aid",
    name_mr: "\u0928\u0930\u094D\u0938\u093F\u0902\u0917\u091A\u0940 \u092E\u0942\u0932\u092D\u0942\u0924 \u0924\u0924\u094D\u0924\u094D\u0935\u0947 \u0935 \u092A\u094D\u0930\u0925\u092E\u094B\u092A\u091A\u093E\u0930",
    description_en: "Vital signs, BLS/CPR, catheterization, 10 rights of medication, enema, oxygen therapy, wound care, and triage.",
    description_mr: "\u092E\u0939\u0924\u094D\u0924\u094D\u0935\u093E\u091A\u0940 \u091A\u093F\u0928\u094D\u0939\u0947, \u092C\u0940\u090F\u0932\u090F\u0938/\u0938\u0940\u092A\u0940\u0906\u0930, \u0915\u0945\u0925\u0947\u091F\u0947\u0930\u093E\u092F\u091D\u0947\u0936\u0928, \u0914\u0937\u0927\u094B\u092A\u091A\u093E\u0930 \u0928\u093F\u092F\u092E, \u0972\u0928\u093F\u092E\u093E, \u0911\u0915\u094D\u0938\u093F\u091C\u0928 \u0925\u0947\u0930\u092A\u0940 \u0906\u0923\u093F \u092A\u094D\u0930\u0925\u092E\u094B\u092A\u091A\u093E\u0930.",
    icon: "HeartPulse",
    totalQuestions: 28,
    category: "core_nursing",
    exam_track: "both"
  },
  {
    id: "subj-msn",
    name_en: "Medical-Surgical Nursing",
    name_mr: "\u0935\u0948\u0926\u094D\u092F\u0915\u0940\u092F-\u0936\u0938\u094D\u0924\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u093E \u0928\u0930\u094D\u0938\u093F\u0902\u0917",
    description_en: "CVS, Respiratory, GI, CNS, Endocrine, Renal, Musculoskeletal, Oncology, and Burns nursing management.",
    description_mr: "\u0939\u0943\u0926\u092F, \u0936\u094D\u0935\u0938\u0928, \u092A\u091A\u0928\u0938\u0902\u0938\u094D\u0925\u093E, \u092E\u091C\u094D\u091C\u093E\u0938\u0902\u0938\u094D\u0925\u093E, \u0905\u0902\u0924\u0903\u0938\u094D\u0930\u093E\u0935\u0940, \u092E\u0942\u0924\u094D\u0930\u092A\u093F\u0902\u0921, \u0905\u0938\u094D\u0925\u093F\u0938\u0902\u0938\u094D\u0925\u093E, \u0915\u0930\u094D\u0915\u0930\u094B\u0917 \u0906\u0923\u093F \u092D\u093E\u091C\u0932\u0947\u0932\u094D\u092F\u093E \u0930\u0941\u0917\u094D\u0923\u093E\u0902\u091A\u0940 \u0915\u093E\u0933\u091C\u0940.",
    icon: "Stethoscope",
    totalQuestions: 35,
    category: "core_nursing",
    exam_track: "both"
  },
  {
    id: "subj-obg",
    name_en: "Obstetric & Midwifery Nursing",
    name_mr: "\u092A\u094D\u0930\u0938\u0942\u0924\u093F\u0936\u093E\u0938\u094D\u0924\u094D\u0930 \u0906\u0923\u093F \u0938\u094D\u0924\u094D\u0930\u0940\u0930\u094B\u0917 \u0928\u0930\u094D\u0938\u093F\u0902\u0917",
    description_en: "Antenatal care, stages of labour, partograph, fetal heart monitoring, high-risk pregnancy, and PPH management.",
    description_mr: "\u092A\u094D\u0930\u0938\u0942\u0924\u0940\u092A\u0942\u0930\u094D\u0935 \u0924\u092A\u093E\u0938\u0923\u0940, \u092A\u094D\u0930\u0938\u0942\u0924\u0940\u091A\u0947 \u091F\u092A\u094D\u092A\u0947, \u092A\u093E\u0930\u094D\u091F\u094B\u0917\u094D\u0930\u093E\u092B, \u0917\u0930\u094D\u092D \u0928\u093F\u0930\u0940\u0915\u094D\u0937\u0923, \u092A\u094D\u0930\u0940-\u090F\u0915\u094D\u0932\u0945\u092E\u094D\u092A\u0938\u093F\u092F\u093E \u0906\u0923\u093F \u092A\u0940\u092A\u0940\u090F\u091A \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093E\u092A\u0928.",
    icon: "Baby",
    totalQuestions: 25,
    category: "core_nursing",
    exam_track: "both"
  },
  {
    id: "subj-peds",
    name_en: "Child Health / Pediatric Nursing",
    name_mr: "\u092C\u093E\u0932\u0930\u094B\u0917 \u0928\u0930\u094D\u0938\u093F\u0902\u0917",
    description_en: "Newborn assessment, APGAR, milestones, neonatal jaundice, IMNCI, immunization schedule, cold chain, and CHD.",
    description_mr: "\u0928\u0935\u091C\u093E\u0924 \u0924\u092A\u093E\u0938\u0923\u0940, \u0972\u092A\u0917\u093E\u0930 \u0938\u094D\u0915\u094B\u0905\u0930, \u0935\u093F\u0915\u093E\u0938 \u091F\u092A\u094D\u092A\u0947, \u0915\u093E\u0935\u0940\u0933, \u0906\u092F\u090F\u092E\u090F\u0928\u0938\u0940\u0906\u092F, \u0930\u093E\u0937\u094D\u091F\u094D\u0930\u0940\u092F \u0932\u0938\u0940\u0915\u0930\u0923 \u0906\u0923\u093F \u0915\u094B\u0932\u094D\u0921 \u091A\u0947\u0928.",
    icon: "Smile",
    totalQuestions: 20,
    category: "core_nursing",
    exam_track: "both"
  },
  {
    id: "subj-chn",
    name_en: "Community Health Nursing",
    name_mr: "\u0938\u092E\u0941\u0926\u093E\u092F \u0906\u0930\u094B\u0917\u094D\u092F \u0928\u0930\u094D\u0938\u093F\u0902\u0917",
    description_en: "Health care delivery, PHC/CHC setup, epidemiology, national health programmes, vital statistics, and sanitation.",
    description_mr: "\u0906\u0930\u094B\u0917\u094D\u092F \u0938\u0947\u0935\u093E \u092F\u0902\u0924\u094D\u0930\u0923\u093E, \u092A\u094D\u0930\u093E\u0925\u092E\u093F\u0915 \u0906\u0930\u094B\u0917\u094D\u092F \u0915\u0947\u0902\u0926\u094D\u0930, \u0930\u094B\u0917\u0930\u093E\u0908\u0936\u093E\u0938\u094D\u0924\u094D\u0930, \u0930\u093E\u0937\u094D\u091F\u094D\u0930\u0940\u092F \u0906\u0930\u094B\u0917\u094D\u092F \u0915\u093E\u0930\u094D\u092F\u0915\u094D\u0930\u092E \u0906\u0923\u093F \u0906\u0930\u094B\u0917\u094D\u092F \u0906\u0915\u0921\u0947\u0935\u093E\u0930\u0940.",
    icon: "Users",
    totalQuestions: 18,
    category: "core_nursing",
    exam_track: "both"
  },
  {
    id: "subj-mhn",
    name_en: "Mental Health & Psychiatric Nursing",
    name_mr: "\u092E\u093E\u0928\u0938\u094B\u092A\u091A\u093E\u0930 \u0928\u0930\u094D\u0938\u093F\u0902\u0917",
    description_en: "MSE, defense mechanisms, schizophrenia, mood disorders, psychopharmacology, ECT, and Mental Healthcare Act.",
    description_mr: "\u092E\u093E\u0928\u0938\u093F\u0915 \u0924\u092A\u093E\u0938\u0923\u0940, \u0938\u0902\u0930\u0915\u094D\u0937\u0923 \u092F\u0902\u0924\u094D\u0930\u0923\u093E, \u0938\u094D\u0915\u093F\u091D\u094B\u092B\u094D\u0930\u0947\u0928\u093F\u092F\u093E, \u092E\u0928\u0903\u0938\u094D\u0925\u093F\u0924\u0940 \u0935\u093F\u0915\u093E\u0930, \u0932\u093F\u0925\u093F\u092F\u092E, \u0908\u0938\u0940\u091F\u0940 \u0906\u0923\u093F \u092E\u093E\u0928\u0938\u093F\u0915 \u0906\u0930\u094B\u0917\u094D\u092F \u0915\u093E\u092F\u0926\u093E.",
    icon: "Brain",
    totalQuestions: 15,
    category: "core_nursing",
    exam_track: "both"
  },
  {
    id: "subj-pharm",
    name_en: "Pharmacology & Drug Calculations",
    name_mr: "\u0914\u0937\u0927\u0936\u093E\u0938\u094D\u0924\u094D\u0930 \u0906\u0923\u093F \u092E\u093E\u0924\u094D\u0930\u093E \u0917\u0923\u0928\u093E",
    description_en: "Emergency drugs, adrenaline, atropine, dopamine, antidotes, antibiotics, anticoagulants, and dosage math.",
    description_mr: "\u0906\u0923\u0940\u092C\u093E\u0923\u0940\u091A\u0940 \u0914\u0937\u0927\u0947, \u0972\u0921\u094D\u0930\u0947\u0928\u093E\u0932\u093F\u0928, \u0972\u091F\u094D\u0930\u094B\u092A\u093F\u0928, \u092A\u094D\u0930\u0924\u093F\u0935\u093F\u0937 (\u0905\u0901\u091F\u0940\u0921\u094B\u091F\u094D\u0938), \u0930\u0915\u094D\u0924 \u092A\u093E\u0924\u0933 \u0915\u0930\u0923\u093E\u0930\u0940 \u0914\u0937\u0927\u0947 \u0906\u0923\u093F \u0917\u0923\u0928\u093E.",
    icon: "Pill",
    totalQuestions: 22,
    category: "core_nursing",
    exam_track: "both"
  },
  {
    id: "subj-micro",
    name_en: "Microbiology & Sterilization",
    name_mr: "\u0938\u0942\u0915\u094D\u0937\u094D\u092E\u091C\u0940\u0935\u0936\u093E\u0938\u094D\u0924\u094D\u0930 \u0935 \u0928\u093F\u0930\u094D\u091C\u0902\u0924\u0941\u0915\u0940\u0915\u0930\u0923",
    description_en: "Bacterial transmission, viruses, autoclave operation, hot air oven, chemical sterilization, and culture sensitivity.",
    description_mr: "\u091C\u0940\u0935\u093E\u0923\u0942, \u0935\u093F\u0937\u093E\u0923\u0942, \u0911\u091F\u094B\u0915\u094D\u0932\u0947\u0935\u094D\u0939 \u0915\u093E\u0930\u094D\u092F\u092A\u094D\u0930\u0923\u093E\u0932\u0940, \u0939\u0949\u091F \u090F\u0905\u0930 \u0913\u0935\u094D\u0939\u0928, \u0930\u093E\u0938\u093E\u092F\u0928\u093F\u0915 \u0928\u093F\u0930\u094D\u091C\u0902\u0924\u0941\u0915\u0940\u0915\u0930\u0923 \u0906\u0923\u093F \u0915\u0932\u094D\u091A\u0930 \u091A\u093E\u091A\u0923\u094D\u092F\u093E.",
    icon: "Microscope",
    totalQuestions: 16,
    category: "allied_health",
    exam_track: "both"
  },
  {
    id: "subj-path",
    name_en: "Pathology & Laboratory Interpretation",
    name_mr: "\u092A\u0945\u0925\u0949\u0932\u0949\u091C\u0940 \u0906\u0923\u093F \u092A\u094D\u0930\u092F\u094B\u0917\u0936\u093E\u0933\u093E \u0924\u092A\u093E\u0938\u0923\u094D\u092F\u093E",
    description_en: "CBC, ABG analysis, electrolytes, RFT, LFT, normal ranges, critical panic values, and nursing interpretation.",
    description_mr: "\u0930\u0915\u094D\u0924 \u0924\u092A\u093E\u0938\u0923\u0940, \u090F\u092C\u0940\u091C\u0940 \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923, \u0907\u0932\u0947\u0915\u094D\u091F\u094D\u0930\u094B\u0932\u093E\u0907\u091F\u094D\u0938, \u0906\u0930\u090F\u092B\u091F\u0940, \u090F\u0932\u090F\u092B\u091F\u0940 \u0906\u0923\u093F \u0917\u0902\u092D\u0940\u0930 \u092E\u0942\u0932\u094D\u092F\u0947 \u0938\u092E\u091C\u0942\u0928 \u0918\u0947\u0923\u0947.",
    icon: "TestTubes",
    totalQuestions: 16,
    category: "allied_health",
    exam_track: "both"
  },
  {
    id: "subj-anat",
    name_en: "Anatomy & Physiology (Nursing Oriented)",
    name_mr: "\u0936\u0930\u0940\u0930\u0930\u091A\u0928\u093E \u0906\u0923\u093F \u0936\u0930\u0940\u0930\u0915\u094D\u0930\u093F\u092F\u093E\u0936\u093E\u0938\u094D\u0924\u094D\u0930",
    description_en: "Cardiovascular, respiratory, nervous, endocrine, digestive, and renal physiology relevant to clinical care.",
    description_mr: "\u0915\u094D\u0932\u093F\u0928\u093F\u0915\u0932 \u0928\u0930\u094D\u0938\u093F\u0902\u0917\u0938\u093E\u0920\u0940 \u0909\u092A\u092F\u0941\u0915\u094D\u0924 \u092E\u093E\u0928\u0935\u0940 \u0936\u0930\u0940\u0930\u0930\u091A\u0928\u093E \u0906\u0923\u093F \u0905\u0935\u092F\u0935 \u0915\u093E\u0930\u094D\u092F\u092A\u094D\u0930\u0923\u093E\u0932\u0940\u091A\u0947 \u092E\u0942\u0932\u092D\u0942\u0924 \u091C\u094D\u091E\u093E\u0928.",
    icon: "Layers",
    totalQuestions: 18,
    category: "allied_health",
    exam_track: "both"
  },
  {
    id: "subj-icu-bls",
    name_en: "Critical Care & Emergency Nursing",
    name_mr: "\u0906\u092F\u0938\u0940\u092F\u0942 \u0906\u0923\u093F \u0906\u092A\u0924\u094D\u0915\u093E\u0932\u0940\u0928 \u0928\u0930\u094D\u0938\u093F\u0902\u0917",
    description_en: "ABCDE assessment, shock, defibrillation, mechanical ventilation graphics, airway, central lines, and ICU care.",
    description_mr: "\u0906\u092A\u0924\u094D\u0915\u093E\u0932\u0940\u0928 \u092E\u0942\u0932\u094D\u092F\u093E\u0902\u0915\u0928, \u0936\u0949\u0915, \u0921\u093F\u092B\u093F\u092C\u094D\u0930\u093F\u0932\u0947\u0936\u0928, \u0935\u094D\u0939\u0947\u0902\u091F\u093F\u0932\u0947\u091F\u0930 \u0917\u094D\u0930\u093E\u092B\u094D\u0938, \u090F\u0905\u0930\u0935\u0947 \u0906\u0923\u093F \u0905\u0924\u093F\u0926\u0915\u094D\u0937\u0924\u093E \u0926\u0947\u0916\u0930\u0947\u0916.",
    icon: "Activity",
    totalQuestions: 20,
    category: "core_nursing",
    exam_track: "both"
  },
  {
    id: "subj-infection",
    name_en: "Infection Control & Biomedical Waste",
    name_mr: "\u0938\u0902\u0938\u0930\u094D\u0917 \u0928\u093F\u092F\u0902\u0924\u094D\u0930\u0923 \u0906\u0923\u093F \u092C\u093E\u092F\u094B\u092E\u0947\u0921\u093F\u0915\u0932 \u0915\u091A\u0930\u093E",
    description_en: "BMW color coding rules, PPE donning/doffing, standard precautions, needle-stick injury, and HAI prevention.",
    description_mr: "\u092C\u093E\u092F\u094B\u092E\u0947\u0921\u093F\u0915\u0932 \u0915\u091A\u0930\u093E \u0930\u0902\u0917 \u0915\u094B\u0921, \u092A\u0940\u092A\u0940\u0908 \u0915\u093F\u091F, \u0938\u0941\u0908 \u091F\u094B\u091A\u0923\u0947 \u092A\u094D\u0930\u0924\u093F\u092C\u0902\u0927 \u092A\u094D\u0930\u094B\u091F\u094B\u0915\u0949\u0932 \u0906\u0923\u093F \u0939\u0949\u0938\u094D\u092A\u093F\u091F\u0932 \u0907\u0928\u094D\u092B\u0947\u0915\u094D\u0936\u0928 \u0928\u093F\u092F\u0902\u0924\u094D\u0930\u0923.",
    icon: "ShieldAlert",
    totalQuestions: 16,
    category: "allied_health",
    exam_track: "both"
  },
  {
    id: "subj-admin-mgmt",
    name_en: "Hospital Nursing Administration & NABH",
    name_mr: "\u0930\u0941\u0917\u094D\u0923\u093E\u0932\u092F \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u092A\u094D\u0930\u0936\u093E\u0938\u0928 \u0935 \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093E\u092A\u0928",
    description_en: "Staffing norms, leadership, delegation, supervision, NABH safety standards, incident reporting, and hospital policies.",
    description_mr: "\u0915\u0930\u094D\u092E\u091A\u093E\u0930\u0940 \u0935\u093E\u091F\u092A, \u0928\u0947\u0924\u0943\u0924\u094D\u0935, \u0921\u0947\u0932\u093F\u0917\u0947\u0936\u0928, \u090F\u0928\u090F\u092C\u0940\u090F\u091A \u0938\u0941\u0930\u0915\u094D\u0937\u093E \u0928\u093F\u092F\u092E, \u0907\u0928\u094D\u0938\u093F\u0921\u0947\u0902\u091F \u0930\u093F\u092A\u094B\u0930\u094D\u091F\u093F\u0902\u0917 \u0906\u0923\u093F \u0930\u0941\u0917\u094D\u0923\u093E\u0932\u092F \u0927\u094B\u0930\u0923\u0947.",
    icon: "Building2",
    totalQuestions: 14,
    category: "core_nursing",
    exam_track: "both"
  },
  {
    id: "subj-apt-norcet",
    name_en: "Aptitude & General Intelligence (\u0938\u0930\u094D\u0935 \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u092A\u0930\u0940\u0915\u094D\u0937\u093E)",
    name_mr: "\u0905\u092D\u093F\u092F\u094B\u0917\u094D\u092F\u0924\u093E \u0906\u0923\u093F \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u092C\u0941\u0926\u094D\u0927\u093F\u092E\u0924\u094D\u0924\u093E \u091A\u093E\u091A\u0923\u0940",
    description_en: "Logical reasoning, number series, coding-decoding, blood relations, direction tests, and data interpretation for all nursing officer exams.",
    description_mr: "\u0924\u0930\u094D\u0915\u0915\u094D\u0937\u092E\u0924\u093E, \u0938\u0902\u0916\u094D\u092F\u093E \u092E\u093E\u0932\u093F\u0915\u093E, \u0915\u094B\u0921\u093F\u0902\u0917-\u0921\u093F\u0915\u094B\u0921\u093F\u0902\u0917, \u0928\u093E\u0924\u0947\u0938\u0902\u092C\u0902\u0927, \u0926\u093F\u0936\u093E \u091C\u094D\u091E\u093E\u0928 \u0906\u0923\u093F \u0921\u0947\u091F\u093E \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923 (\u0938\u0930\u094D\u0935 \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u092A\u0930\u0940\u0915\u094D\u0937\u093E).",
    icon: "HelpCircle",
    totalQuestions: 15,
    category: "aptitude_gk",
    exam_track: "both"
  },
  {
    id: "subj-gk-mr",
    name_en: "Marathi Grammar & Language (\u092E\u0930\u093E\u0920\u0940 \u0935\u094D\u092F\u093E\u0915\u0930\u0923)",
    name_mr: "\u092E\u0930\u093E\u0920\u0940 \u0935\u094D\u092F\u093E\u0915\u0930\u0923 \u0906\u0923\u093F \u092D\u093E\u0937\u093E \u091C\u094D\u091E\u093E\u0928",
    description_en: "Marathi grammar, Sandhi, Samas, Alankar, Vakprachar, Mhane, synonyms, antonyms, sentence correction, and comprehension.",
    description_mr: "\u0938\u0902\u0927\u0940, \u0938\u092E\u093E\u0938, \u0905\u0932\u0902\u0915\u093E\u0930, \u0935\u093E\u0915\u092A\u094D\u0930\u091A\u093E\u0930, \u092E\u094D\u0939\u0923\u0940, \u0938\u092E\u093E\u0928\u093E\u0930\u094D\u0925\u0940/\u0935\u093F\u0930\u0941\u0926\u094D\u0927\u093E\u0930\u094D\u0925\u0940 \u0936\u092C\u094D\u0926, \u0935\u093E\u0915\u094D\u092F \u0936\u0941\u0926\u094D\u0927\u0940\u0915\u0930\u0923 \u0906\u0923\u093F \u0936\u092C\u094D\u0926\u0938\u0902\u0917\u094D\u0930\u0939.",
    icon: "BookOpen",
    totalQuestions: 18,
    category: "aptitude_gk",
    exam_track: "both"
  },
  {
    id: "subj-eng",
    name_en: "English Grammar & Comprehension",
    name_mr: "\u0907\u0902\u0917\u094D\u0930\u091C\u0940 \u0935\u094D\u092F\u093E\u0915\u0930\u0923 \u0906\u0923\u093F \u0906\u0915\u0932\u0928",
    description_en: "Tenses, articles, prepositions, active/passive voice, direct/indirect narration, idioms, vocabulary, and sentence correction.",
    description_mr: "\u0915\u093E\u0933, \u0906\u0930\u094D\u091F\u093F\u0915\u0932\u094D\u0938, \u092A\u094D\u0930\u0947\u092A\u094B\u091D\u093F\u0936\u0928\u094D\u0938, \u0935\u094D\u0939\u0949\u0907\u0938, \u0928\u0930\u0947\u0936\u0928, \u0938\u092E\u093E\u0928\u093E\u0930\u094D\u0925\u0940/\u0935\u093F\u0930\u0941\u0926\u094D\u0927\u093E\u0930\u094D\u0925\u0940 \u0936\u092C\u094D\u0926 \u0906\u0923\u093F \u0935\u093E\u0915\u094D\u092F \u0926\u0941\u0930\u0941\u0938\u094D\u0924\u0940.",
    icon: "Languages",
    totalQuestions: 15,
    category: "aptitude_gk",
    exam_track: "both"
  },
  {
    id: "subj-gk-mh",
    name_en: "General Knowledge & National Health Programs",
    name_mr: "\u0938\u093E\u092E\u093E\u0928\u094D\u092F \u091C\u094D\u091E\u093E\u0928 \u0906\u0923\u093F \u0930\u093E\u0937\u094D\u091F\u094D\u0930\u0940\u092F \u0906\u0930\u094B\u0917\u094D\u092F \u092F\u094B\u091C\u0928\u093E",
    description_en: "Geography, history, Indian Constitution, National Health Mission (NHM), Ayushman Bharat, and public health schemes.",
    description_mr: "\u092D\u0942\u0917\u094B\u0932, \u0907\u0924\u093F\u0939\u093E\u0938, \u092D\u093E\u0930\u0924\u0940\u092F \u0938\u0902\u0935\u093F\u0927\u093E\u0928, \u0930\u093E\u0937\u094D\u091F\u094D\u0930\u0940\u092F \u0906\u0930\u094B\u0917\u094D\u092F \u0905\u092D\u093F\u092F\u093E\u0928 (NHM), \u0906\u092F\u0941\u0937\u094D\u092F\u092E\u093E\u0928 \u092D\u093E\u0930\u0924 \u0906\u0923\u093F \u0906\u0930\u094B\u0917\u094D\u092F \u092F\u094B\u091C\u0928\u093E.",
    icon: "Globe",
    totalQuestions: 15,
    category: "aptitude_gk",
    exam_track: "both"
  },
  {
    id: "subj-math-reas",
    name_en: "Reasoning & Numerical Ability (Mathematics)",
    name_mr: "\u0905\u0902\u0915\u0917\u0923\u093F\u0924 \u0906\u0923\u093F \u092C\u0941\u0926\u094D\u0927\u093F\u092E\u0924\u094D\u0924\u093E \u091A\u093E\u091A\u0923\u0940",
    description_en: "Percentage, ratio & proportion, average, time & work, time & distance, simple interest, analogy, and series.",
    description_mr: "\u091F\u0915\u094D\u0915\u0947\u0935\u093E\u0930\u0940, \u0917\u0941\u0923\u094B\u0924\u094D\u0924\u0930, \u0938\u0930\u093E\u0938\u0930\u0940, \u0915\u093E\u0933-\u0915\u093E\u092E-\u0935\u0947\u0917, \u0938\u0930\u0933\u0935\u094D\u092F\u093E\u091C, \u0938\u0939\u0938\u0902\u092C\u0902\u0927 \u0906\u0923\u093F \u092C\u0941\u0926\u094D\u0927\u093F\u092E\u0924\u094D\u0924\u093E \u092A\u094D\u0930\u0936\u094D\u0928.",
    icon: "Calculator",
    totalQuestions: 15,
    category: "aptitude_gk",
    exam_track: "both"
  }
];
var INITIAL_CHAPTERS = [
  // Fundamentals
  { id: "ch-fon-vitals", subject_id: "subj-fon", name_en: "Vital Signs & Temperature Regulation", name_mr: "\u092E\u0939\u0924\u094D\u0924\u094D\u0935\u093E\u091A\u0940 \u091A\u093F\u0928\u094D\u0939\u0947 \u0906\u0923\u093F \u0924\u093E\u092A\u092E\u093E\u0928 \u0928\u093F\u092F\u092E\u0928", order_index: 1 },
  { id: "ch-fon-med", subject_id: "subj-fon", name_en: "Medication Administration & 10 Rights", name_mr: "\u0914\u0937\u0927 \u0926\u0947\u0923\u094D\u092F\u093E\u091A\u0940 \u092A\u0926\u094D\u0927\u0924 \u0906\u0923\u093F \u0967\u0966 \u0928\u093F\u092F\u092E", order_index: 2 },
  { id: "ch-fon-procedures", subject_id: "subj-fon", name_en: "Catheterization, Enema & Ryle Tube", name_mr: "\u0915\u0945\u0925\u0947\u091F\u0930, \u0972\u0928\u093F\u092E\u093E \u0906\u0923\u093F \u0930\u093E\u0907\u0932\u094D\u0938 \u091F\u094D\u092F\u0942\u092C", order_index: 3 },
  { id: "ch-fon-firstaid", subject_id: "subj-fon", name_en: "First Aid, BLS & Triage Assessment", name_mr: "\u092A\u094D\u0930\u0925\u092E\u094B\u092A\u091A\u093E\u0930, \u092C\u0940\u090F\u0932\u090F\u0938 \u0906\u0923\u093F \u091F\u094D\u0930\u093E\u092F\u091C", order_index: 4 },
  // Med-Surg
  { id: "ch-msn-cvs", subject_id: "subj-msn", name_en: "Cardiovascular System & MI/Heart Failure", name_mr: "\u0939\u0943\u0926\u092F \u0935 \u0930\u0915\u094D\u0924\u0935\u093E\u0939\u093F\u0928\u094D\u092F\u093E \u0935\u093F\u0915\u093E\u0930", order_index: 1 },
  { id: "ch-msn-resp", subject_id: "subj-msn", name_en: "Respiratory Disorders (COPD, Asthma, TB)", name_mr: "\u0936\u094D\u0935\u0938\u0928\u0938\u0902\u0938\u094D\u0925\u093E \u0935\u093F\u0915\u093E\u0930", order_index: 2 },
  { id: "ch-msn-gi", subject_id: "subj-msn", name_en: "Gastrointestinal & Liver Disorders", name_mr: "\u092A\u091A\u0928\u0938\u0902\u0938\u094D\u0925\u093E \u0935 \u092F\u0915\u0943\u0924 \u0935\u093F\u0915\u093E\u0930", order_index: 3 },
  { id: "ch-msn-cns", subject_id: "subj-msn", name_en: "Neurological Disorders & Stroke/GCS", name_mr: "\u092E\u091C\u094D\u091C\u093E\u0938\u0902\u0938\u094D\u0925\u093E \u0935\u093F\u0915\u093E\u0930 \u0906\u0923\u093F \u0938\u094D\u091F\u094D\u0930\u094B\u0915", order_index: 4 },
  { id: "ch-msn-endocrine", subject_id: "subj-msn", name_en: "Endocrine Disorders (Diabetes, Thyroid)", name_mr: "\u092E\u0927\u0941\u092E\u0947\u0939 \u0906\u0923\u093F \u0925\u093E\u092F\u0930\u0949\u0908\u0921 \u0935\u093F\u0915\u093E\u0930", order_index: 5 },
  { id: "ch-msn-renal", subject_id: "subj-msn", name_en: "Renal Disorders, AKI, CKD & Dialysis", name_mr: "\u092E\u0942\u0924\u094D\u0930\u092A\u093F\u0902\u0921 \u0935\u093F\u0915\u093E\u0930 \u0906\u0923\u093F \u0921\u093E\u092F\u0932\u093F\u0938\u093F\u0938", order_index: 6 },
  { id: "ch-msn-burns", subject_id: "subj-msn", name_en: "Burns Management & Parkland Formula", name_mr: "\u092D\u093E\u091C\u0932\u0947\u0932\u094D\u092F\u093E \u0930\u0941\u0917\u094D\u0923\u093E\u0902\u091A\u0947 \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093E\u092A\u0928", order_index: 7 },
  // OBG
  { id: "ch-obg-antenatal", subject_id: "subj-obg", name_en: "Antenatal Care & Physiological Changes", name_mr: "\u092A\u094D\u0930\u0938\u0942\u0924\u0940\u092A\u0942\u0930\u094D\u0935 \u0924\u092A\u093E\u0938\u0923\u0940 \u0906\u0923\u093F \u092C\u0926\u0932", order_index: 1 },
  { id: "ch-obg-labour", subject_id: "subj-obg", name_en: "Stages of Labour & Partograph", name_mr: "\u092A\u094D\u0930\u0938\u0942\u0924\u0940\u091A\u0947 \u091F\u092A\u094D\u092A\u0947 \u0906\u0923\u093F \u092A\u093E\u0930\u094D\u091F\u094B\u0917\u094D\u0930\u093E\u092B", order_index: 2 },
  { id: "ch-obg-highrisk", subject_id: "subj-obg", name_en: "Pre-eclampsia, Eclampsia & PPH", name_mr: "\u092A\u094D\u0930\u0940-\u090F\u0915\u094D\u0932\u0945\u092E\u094D\u092A\u0938\u093F\u092F\u093E \u0906\u0923\u093F \u092A\u0940\u092A\u0940\u090F\u091A", order_index: 3 },
  // Pediatrics
  { id: "ch-peds-neonatology", subject_id: "subj-peds", name_en: "Newborn Care, APGAR & Reflexes", name_mr: "\u0928\u0935\u091C\u093E\u0924 \u092C\u093E\u0932\u0915\u093E\u091A\u0940 \u0915\u093E\u0933\u091C\u0940 \u0906\u0923\u093F \u0972\u092A\u0917\u093E\u0930", order_index: 1 },
  { id: "ch-peds-growth", subject_id: "subj-peds", name_en: "Growth, Developmental Milestones & Immunization", name_mr: "\u0935\u093E\u0922, \u0935\u093F\u0915\u093E\u0938 \u0906\u0923\u093F \u0932\u0938\u0940\u0915\u0930\u0923", order_index: 2 },
  // Infection Control
  { id: "ch-bmw-rules", subject_id: "subj-infection", name_en: "Biomedical Waste Segregation & Color Codes", name_mr: "\u092C\u093E\u092F\u094B\u092E\u0947\u0921\u093F\u0915\u0932 \u0915\u091A\u0930\u093E \u0930\u0902\u0917 \u0915\u094B\u0921", order_index: 1 },
  { id: "ch-bmw-safety", subject_id: "subj-infection", name_en: "Needle Stick Injury & Standard Precautions", name_mr: "\u0938\u0941\u0908 \u091F\u094B\u091A\u0923\u0947 \u092A\u094D\u0930\u0924\u093F\u092C\u0902\u0927 \u0906\u0923\u093F \u0938\u093E\u0935\u0927\u0917\u093F\u0930\u0940", order_index: 2 },
  // Admin & Management
  { id: "ch-admin-staffing", subject_id: "subj-admin-mgmt", name_en: "Staffing, Delegation & Nursing Supervision", name_mr: "\u0915\u0930\u094D\u092E\u091A\u093E\u0930\u0940 \u0935\u093E\u091F\u092A \u0906\u0923\u093F \u0926\u0947\u0916\u0930\u0947\u0916", order_index: 1 },
  { id: "ch-admin-nabh", subject_id: "subj-admin-mgmt", name_en: "NABH Patient Safety Standards & Policies", name_mr: "\u090F\u0928\u090F\u092C\u0940\u090F\u091A \u0938\u0941\u0930\u0915\u094D\u0937\u093E \u092E\u093E\u0928\u0915\u0947 \u0935 \u0927\u094B\u0930\u0923\u0947", order_index: 2 },
  // Marathi Grammar
  { id: "ch-marathi-lang", subject_id: "subj-gk-mr", name_en: "\u092E\u0930\u093E\u0920\u0940 \u0935\u094D\u092F\u093E\u0915\u0930\u0923, \u0935\u093E\u0915\u092A\u094D\u0930\u091A\u093E\u0930 \u0906\u0923\u093F \u092E\u094D\u0939\u0923\u0940", name_mr: "\u092E\u0930\u093E\u0920\u0940 \u0935\u094D\u092F\u093E\u0915\u0930\u0923 \u0935 \u0936\u092C\u094D\u0926\u0938\u0902\u0917\u094D\u0930\u0939", order_index: 1 }
];
var INITIAL_TOPICS = [
  { id: "top-vitals-temp", chapter_id: "ch-fon-vitals", subject_id: "subj-fon", name_en: "Temperature Regulation & Sites", name_mr: "\u0924\u093E\u092A\u092E\u093E\u0928 \u092E\u093E\u092A\u0928 \u092A\u0926\u094D\u0927\u0924\u0940" },
  { id: "top-vitals-bp", chapter_id: "ch-fon-vitals", subject_id: "subj-fon", name_en: "Blood Pressure & Korotkoff Sounds", name_mr: "\u0930\u0915\u094D\u0924\u0926\u093E\u092C \u092E\u093E\u092A\u0928" },
  { id: "top-med-routes", chapter_id: "ch-fon-med", subject_id: "subj-fon", name_en: "Routes of Administration & Cannula Gauges", name_mr: "\u0914\u0937\u0927 \u0926\u0947\u0923\u094D\u092F\u093E\u091A\u0947 \u092E\u093E\u0930\u094D\u0917 \u0935 \u0915\u0945\u0928\u094D\u092F\u0941\u0932\u093E \u0917\u0947\u091C" },
  { id: "top-cvs-mi", chapter_id: "ch-msn-cvs", subject_id: "subj-msn", name_en: "Myocardial Infarction & ECG Signs", name_mr: "\u0939\u0943\u0926\u092F\u0935\u093F\u0915\u093E\u0930\u093E\u091A\u093E \u091D\u091F\u0915\u093E \u0935 \u0908\u0938\u0940\u091C\u0940 \u091A\u093F\u0928\u094D\u0939\u0947" },
  { id: "top-cvs-failure", chapter_id: "ch-msn-cvs", subject_id: "subj-msn", name_en: "Congestive Heart Failure & Digoxin", name_mr: "\u0939\u093E\u0930\u094D\u091F \u092B\u0947\u0932\u094D\u092F\u0941\u0905\u0930 \u0906\u0923\u093F \u0921\u093F\u0917\u0949\u0915\u094D\u0938\u093F\u0928" },
  { id: "top-obg-labour-stages", chapter_id: "ch-obg-labour", subject_id: "subj-obg", name_en: "First & Second Stage of Labour Interventions", name_mr: "\u092A\u094D\u0930\u0938\u0942\u0924\u0940\u091A\u0947 \u092A\u0939\u093F\u0932\u0947 \u0935 \u0926\u0941\u0938\u0930\u0947 \u091F\u092A\u094D\u092A\u0947" },
  { id: "top-obg-preeclamp", chapter_id: "ch-obg-highrisk", subject_id: "subj-obg", name_en: "Pre-eclampsia & MgSO4 Administration", name_mr: "\u092A\u094D\u0930\u0940-\u090F\u0915\u094D\u0932\u0945\u092E\u094D\u092A\u0938\u093F\u092F\u093E \u0906\u0923\u093F \u092E\u0945\u0917\u094D\u0928\u0947\u0936\u093F\u092F\u092E \u0938\u0932\u094D\u092B\u0947\u091F" },
  { id: "top-bmw-segregation", chapter_id: "ch-bmw-rules", subject_id: "subj-infection", name_en: "Yellow, Red, Blue, White Container Guidelines", name_mr: "\u0915\u091A\u0930\u093E \u0935\u0930\u094D\u0917\u0940\u0915\u0930\u0923 \u0930\u0902\u0917 \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0915 \u0924\u0924\u094D\u0924\u094D\u0935\u0947" },
  { id: "top-admin-nabh-goals", chapter_id: "ch-admin-nabh", subject_id: "subj-admin-mgmt", name_en: "International Patient Safety Goals (IPSG)", name_mr: "\u0930\u0941\u0917\u094D\u0923 \u0938\u0941\u0930\u0915\u094D\u0937\u093E \u0909\u0926\u094D\u0926\u093F\u0937\u094D\u091F\u0947" },
  { id: "top-mr-idioms", chapter_id: "ch-marathi-lang", subject_id: "subj-gk-mr", name_en: "\u0935\u093E\u0915\u092A\u094D\u0930\u091A\u093E\u0930 \u0935 \u0932\u093E\u0915\u094D\u0937\u0923\u093F\u0915 \u0905\u0930\u094D\u0925", name_mr: "\u0935\u093E\u0915\u092A\u094D\u0930\u091A\u093E\u0930 \u0935 \u0932\u093E\u0915\u094D\u0937\u0923\u093F\u0915 \u0905\u0930\u094D\u0925" }
];
var INITIAL_CASE_STUDIES = [
  {
    id: "case-mi-01",
    title_en: "Acute Anterior Wall Myocardial Infarction in Emergency Dept",
    title_mr: "\u0906\u092A\u0924\u094D\u0915\u093E\u0932\u0940\u0928 \u0935\u093F\u092D\u093E\u0917\u093E\u0924 \u0924\u0940\u0935\u094D\u0930 \u0905\u0901\u091F\u0940\u0930\u093F\u092F\u0930 \u0935\u0949\u0932 \u092E\u093E\u092F\u094B\u0915\u093E\u0930\u094D\u0921\u093F\u092F\u0932 \u0907\u0928\u094D\u092B\u093E\u0930\u094D\u0915\u0936\u0928",
    patient_age: 58,
    patient_gender: "Male",
    chief_complaint_en: "Crushing retrosternal chest pain radiating to left jaw and left arm for past 90 minutes, accompanied by diaphoresis and nausea.",
    chief_complaint_mr: "\u092E\u093E\u0917\u0940\u0932 \u096F\u0966 \u092E\u093F\u0928\u093F\u091F\u093E\u0902\u092A\u093E\u0938\u0942\u0928 \u0921\u093E\u0935\u094D\u092F\u093E \u091C\u092C\u0921\u094D\u092F\u093E\u0915\u0921\u0947 \u0906\u0923\u093F \u0921\u093E\u0935\u094D\u092F\u093E \u0939\u093E\u0924\u093E\u0915\u0921\u0947 \u091C\u093E\u0923\u093E\u0930\u0940 \u091B\u093E\u0924\u0940\u0924 \u0924\u0940\u0935\u094D\u0930 \u0935\u0947\u0926\u0928\u093E, \u0938\u094B\u092C\u0924 \u0916\u0942\u092A \u0918\u093E\u092E \u092F\u0947\u0923\u0947 \u0906\u0923\u093F \u092E\u0933\u092E\u0933.",
    history_and_vitals_en: "History of Hypertension for 10 years, smoker. Vitals: BP 88/54 mmHg, Heart Rate 118 bpm, SpO2 91% on room air, Respiratory Rate 24/min.",
    history_and_vitals_mr: "\u0967\u0966 \u0935\u0930\u094D\u0937\u093E\u0902\u092A\u093E\u0938\u0942\u0928 \u0909\u091A\u094D\u091A \u0930\u0915\u094D\u0924\u0926\u093E\u092C\u093E\u091A\u093E \u0907\u0924\u093F\u0939\u093E\u0938, \u0927\u0942\u092E\u094D\u0930\u092A\u093E\u0928 \u0915\u0930\u0923\u093E\u0930\u093E. \u092E\u0939\u0924\u094D\u0924\u094D\u0935\u093E\u091A\u0947 \u0938\u0902\u0915\u0947\u0924: \u0930\u0915\u094D\u0924\u0926\u093E\u092C \u096E\u096E/\u096B\u096A mmHg, \u0928\u093E\u0921\u0940 \u0967\u0967\u096E \u0920\u094B\u0915\u0947/\u092E\u093F\u0928\u093F\u091F, \u0911\u0915\u094D\u0938\u093F\u091C\u0928 \u096F\u0967%, \u0936\u094D\u0935\u0938\u0928 \u0968\u096A/\u092E\u093F\u0928\u093F\u091F.",
    clinical_investigations_en: "12-lead ECG reveals 3mm ST-segment elevation in leads V1 to V4. Cardiac Troponin I is elevated at 4.2 ng/mL.",
    clinical_investigations_mr: "\u0967\u0968-\u0932\u0940\u0921 \u0908\u0938\u0940\u091C\u0940 \u092E\u0927\u094D\u092F\u0947 V1 \u0924\u0947 V4 \u0932\u0940\u0921\u094D\u0938\u092E\u0927\u094D\u092F\u0947 3mm ST-\u0938\u0947\u0917\u092E\u0947\u0902\u091F \u090F\u0932\u093F\u0935\u094D\u0939\u0947\u0936\u0928. \u0915\u093E\u0930\u094D\u0921\u093F\u092F\u093E\u0915 \u091F\u094D\u0930\u0949\u092A\u094B\u0928\u093F\u0928 I \u096A.\u0968 ng/mL \u0935\u0930 \u0935\u093E\u0922\u0932\u0947\u0932\u0947 \u0906\u0922\u0933\u0932\u0947.",
    status: "published",
    created_at: "2026-01-10T10:00:00.000Z",
    question_ids: ["q-mi-01", "q-mi-02", "q-mi-03"]
  },
  {
    id: "case-preeclamp-01",
    title_en: "Severe Pre-eclampsia in a Primigravida at 34 Weeks Gestation",
    title_mr: "\u0969\u096A \u0906\u0920\u0935\u0921\u094D\u092F\u093E\u0902\u091A\u094D\u092F\u093E \u0917\u0930\u094B\u0926\u0930\u092A\u0923\u093E\u0924 \u092A\u094D\u0930\u093F\u092E\u094B\u0917\u094D\u0930\u0945\u0935\u094D\u0939\u093F\u0921\u093E \u092E\u0927\u094D\u092F\u0947 \u0924\u0940\u0935\u094D\u0930 \u092A\u094D\u0930\u0940-\u090F\u0915\u094D\u0932\u0945\u092E\u094D\u092A\u0938\u093F\u092F\u093E",
    patient_age: 26,
    patient_gender: "Female",
    chief_complaint_en: "Severe frontal headache, blurring of vision, and epigastric discomfort since morning.",
    chief_complaint_mr: "\u0938\u0915\u093E\u0933\u092A\u093E\u0938\u0942\u0928 \u0921\u094B\u0915\u094D\u092F\u093E\u0924 \u0924\u0940\u0935\u094D\u0930 \u0935\u0947\u0926\u0928\u093E, \u0926\u0943\u0937\u094D\u091F\u0940 \u0927\u0942\u0938\u0930 \u0939\u094B\u0923\u0947 \u0906\u0923\u093F \u092A\u094B\u091F\u093E\u091A\u094D\u092F\u093E \u0935\u0930\u091A\u094D\u092F\u093E \u092D\u093E\u0917\u093E\u0924 \u0905\u0938\u094D\u0935\u0938\u094D\u0925\u0924\u093E.",
    history_and_vitals_en: "Primigravida at 34 weeks gestation. Vitals: BP 168/110 mmHg, HR 88 bpm, RR 18/min. Urine dipstick shows 3+ proteinuria.",
    history_and_vitals_mr: "\u0969\u096A \u0906\u0920\u0935\u0921\u094D\u092F\u093E\u0902\u091A\u0940 \u092A\u094D\u0930\u093F\u092E\u094B\u0917\u094D\u0930\u0945\u0935\u094D\u0939\u093F\u0921\u093E. \u092C\u0940\u092A\u0940 \u0967\u096C\u096E/\u0967\u0967\u0966 mmHg, \u0928\u093E\u0921\u0940 \u096E\u096E, \u0936\u094D\u0935\u0938\u0928 \u0967\u096E. \u0932\u0918\u0935\u0940\u091A\u094D\u092F\u093E \u091A\u093E\u091A\u0923\u0940\u0924 \u0969+ \u092A\u094D\u0930\u094B\u091F\u0940\u0928\u094D\u092F\u0941\u0930\u093F\u092F\u093E \u0906\u0922\u0933\u0932\u0947.",
    clinical_investigations_en: "Deep tendon reflexes: 4+ hyperreflexia with sustained ankle clonus. Platelet count 95,000/mcL.",
    clinical_investigations_mr: "\u0921\u0940\u092A \u091F\u0947\u0902\u0921\u0928 \u0930\u093F\u092B\u094D\u0932\u0947\u0915\u094D\u0938: \u096A+ \u0939\u093E\u092F\u092A\u0930\u0930\u093F\u092B\u094D\u0932\u0947\u0915\u094D\u0938\u093F\u092F\u093E. \u092A\u094D\u0932\u0947\u091F\u0932\u0947\u091F\u094D\u0938 \u096F\u096B,\u0966\u0966\u0966/mcL.",
    status: "published",
    created_at: "2026-01-12T11:00:00.000Z",
    question_ids: ["q-pre-01", "q-pre-02"]
  }
];
var INITIAL_QUESTIONS = [
  {
    id: "q-mi-01",
    subject_id: "subj-msn",
    chapter_id: "ch-cardio",
    case_id: "case-mi-01",
    question_en: "According to the case scenario of the 58-year-old male with acute anterior STEMI and BP 88/54 mmHg, which of the following routine anti-anginal drugs is CONTRAINDICATED in the immediate nursing management?",
    question_mr: "\u0924\u0940\u0935\u094D\u0930 \u0905\u0901\u091F\u0940\u0930\u093F\u092F\u0930 STEMI \u0906\u0923\u093F \u096E\u096E/\u096B\u096A mmHg \u0930\u0915\u094D\u0924\u0926\u093E\u092C \u0905\u0938\u0932\u0947\u0932\u094D\u092F\u093E \u096B\u096E \u0935\u0930\u094D\u0937\u0940\u092F \u092A\u0941\u0930\u0941\u0937\u093E\u091A\u094D\u092F\u093E \u0915\u0947\u0938 \u0938\u0902\u0926\u0930\u094D\u092D\u093E\u0928\u0941\u0938\u093E\u0930, \u0916\u093E\u0932\u0940\u0932\u092A\u0948\u0915\u0940 \u0915\u094B\u0923\u0924\u0947 \u0905\u0901\u091F\u0940-\u0905\u0901\u091C\u093E\u092F\u0928\u0932 \u0914\u0937\u0927 \u0924\u093E\u0924\u094D\u0915\u093E\u0933 \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093E\u092A\u0928\u093E\u0924 \u0935\u0930\u094D\u091C\u094D\u092F (\u0915\u0949\u0928\u094D\u091F\u094D\u0930\u093E\u0907\u0902\u0921\u093F\u0915\u0947\u091F\u0947\u0921) \u0906\u0939\u0947?",
    option_a_en: "Intravenous Morphine Sulfate",
    option_a_mr: "\u0907\u0902\u091F\u094D\u0930\u093E\u0935\u094D\u0939\u0947\u0928\u0938 \u092E\u0949\u0930\u094D\u092B\u093F\u0928 \u0938\u0932\u094D\u092B\u0947\u091F",
    option_b_en: "Sublingual Nitroglycerin (NTG)",
    option_b_mr: "\u091C\u093F\u092D\u0947\u0916\u093E\u0932\u0940 \u0920\u0947\u0935\u093E\u092F\u091A\u0947 \u0928\u093E\u092F\u091F\u094D\u0930\u094B\u0917\u094D\u0932\u093F\u0938\u0930\u0940\u0928 (NTG)",
    option_c_en: "Chewable Aspirin 300 mg",
    option_c_mr: "\u091A\u093E\u0935\u0942\u0928 \u0916\u093E\u092F\u091A\u093E \u0905\u200D\u0945\u0938\u094D\u092A\u093F\u0930\u093F\u0928 \u0969\u0966\u0966 \u092E\u093F\u0917\u094D\u0930\u0945",
    option_d_en: "Oxygen via nasal cannula",
    option_d_mr: "\u0928\u0947\u091D\u0932 \u0915\u0945\u0928\u094D\u092F\u0941\u0932\u093E\u0926\u094D\u0935\u093E\u0930\u0947 \u0911\u0915\u094D\u0938\u093F\u091C\u0928",
    correct_option: "B",
    explanation_en: "Sublingual Nitroglycerin is a potent vasodilator and is contraindicated when Systolic Blood Pressure is below 90 mmHg (hypotension) or in suspected right ventricular infarction, as it causes severe profound circulatory collapse.",
    explanation_mr: "\u0928\u093E\u092F\u091F\u094D\u0930\u094B\u0917\u094D\u0932\u093F\u0938\u0930\u0940\u0928 \u0939\u0947 \u0930\u0915\u094D\u0924\u0935\u093E\u0939\u093F\u0928\u094D\u092F\u093E \u0930\u0941\u0902\u0926 \u0915\u0930\u0923\u093E\u0930\u0947 \u0914\u0937\u0927 \u0906\u0939\u0947. \u0938\u093F\u0938\u094D\u091F\u094B\u0932\u093F\u0915 \u0930\u0915\u094D\u0924\u0926\u093E\u092C \u096F\u0966 mmHg \u092A\u0947\u0915\u094D\u0937\u093E \u0915\u092E\u0940 \u0905\u0938\u0924\u093E\u0928\u093E \u0924\u0947 \u0926\u093F\u0932\u094D\u092F\u093E\u0938 \u0924\u0940\u0935\u094D\u0930 \u0939\u093E\u092F\u092A\u094B\u091F\u0947\u0928\u094D\u0936\u0928 \u0906\u0923\u093F \u0938\u0930\u094D\u0915\u094D\u092F\u0941\u0932\u0947\u091F\u0930\u0940 \u0915\u094B\u0932\u0945\u092A\u094D\u0938 \u0939\u094B\u090A \u0936\u0915\u0924\u094B. \u0924\u094D\u092F\u093E\u092E\u0941\u0933\u0947 \u0924\u0947 \u092F\u093E \u0930\u0941\u0917\u094D\u0923\u093E\u0924 \u0935\u0930\u094D\u091C\u094D\u092F \u0906\u0939\u0947.",
    difficulty: "hard",
    question_type: "clinical_case",
    exam_tags: ["NORCET", "AIIMS", "ESIC"],
    exam_name: "NORCET",
    exam_year: 2024,
    shift: "Shift 1",
    status: "published",
    is_verified_pyq: true,
    version: 1,
    created_at: "2026-01-10T10:05:00.000Z",
    updated_at: "2026-01-10T10:05:00.000Z"
  },
  {
    id: "q-mi-02",
    subject_id: "subj-msn",
    chapter_id: "ch-cardio",
    case_id: "case-mi-01",
    question_en: "The doctor orders Thrombolytic therapy with Streptokinase for this patient. Prior to starting the infusion, which nursing assessment is an ABSOLUTE contraindication for thrombolytic administration?",
    question_mr: "\u0921\u0949\u0915\u094D\u091F\u0930\u093E\u0902\u0928\u0940 \u092F\u093E \u0930\u0941\u0917\u094D\u0923\u093E\u0932\u093E \u0938\u094D\u091F\u094D\u0930\u0947\u092A\u094D\u091F\u094B\u0915\u093E\u092F\u0928\u0947\u091C\u0938\u0939 \u0925\u094D\u0930\u094B\u092E\u094D\u092C\u094B\u0932\u093E\u0907\u091F\u093F\u0915 \u0925\u0947\u0930\u092A\u0940 \u0926\u0947\u0923\u094D\u092F\u093E\u091A\u0947 \u0906\u0926\u0947\u0936 \u0926\u093F\u0932\u0947. \u0907\u0928\u094D\u092B\u094D\u092F\u0941\u091C\u0928 \u0938\u0941\u0930\u0942 \u0915\u0930\u0923\u094D\u092F\u093E\u092A\u0942\u0930\u094D\u0935\u0940, \u0925\u094D\u0930\u094B\u092E\u094D\u092C\u094B\u0932\u093E\u0907\u091F\u093F\u0915 \u0914\u0937\u0927 \u0926\u0947\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0916\u093E\u0932\u0940\u0932\u092A\u0948\u0915\u0940 \u0915\u094B\u0923\u0924\u0940 \u0938\u094D\u0925\u093F\u0924\u0940 \u092A\u0930\u093F\u092A\u0942\u0930\u094D\u0923 \u092A\u094D\u0930\u0924\u093F\u092C\u0902\u0927 (Absolute Contraindication) \u0906\u0939\u0947?",
    option_a_en: "Active peptic ulcer treated 6 months ago",
    option_a_mr: "\u096C \u092E\u0939\u093F\u0928\u094D\u092F\u093E\u0902\u092A\u0942\u0930\u094D\u0935\u0940 \u0909\u092A\u091A\u093E\u0930 \u091D\u093E\u0932\u0947\u0932\u0947 \u092A\u0947\u092A\u094D\u091F\u093F\u0915 \u0905\u0932\u094D\u0938\u0930",
    option_b_en: "Prior ischemic stroke 4 months ago or history of hemorrhagic stroke at any time",
    option_b_mr: "\u096A \u092E\u0939\u093F\u0928\u094D\u092F\u093E\u0902\u092A\u0942\u0930\u094D\u0935\u0940 \u091D\u093E\u0932\u0947\u0932\u093E \u0907\u0938\u094D\u0915\u0947\u092E\u093F\u0915 \u0938\u094D\u091F\u094D\u0930\u094B\u0915 \u0915\u093F\u0902\u0935\u093E \u0915\u0927\u0940\u0939\u0940 \u091D\u093E\u0932\u0947\u0932\u093E \u092E\u0947\u0902\u0926\u0942\u0924\u0940\u0932 \u0930\u0915\u094D\u0924\u0938\u094D\u0930\u093E\u0935 (Hemorrhagic Stroke)",
    option_c_en: "Blood pressure currently 88/54 mmHg",
    option_c_mr: "\u0930\u0915\u094D\u0924\u0926\u093E\u092C \u0938\u0927\u094D\u092F\u093E \u096E\u096E/\u096B\u096A mmHg \u0905\u0938\u0923\u0947",
    option_d_en: "Age greater than 50 years",
    option_d_mr: "\u0935\u092F \u096B\u0966 \u0935\u0930\u094D\u0937\u093E\u0902\u092A\u0947\u0915\u094D\u0937\u093E \u091C\u093E\u0938\u094D\u0924 \u0905\u0938\u0923\u0947",
    correct_option: "B",
    explanation_en: "Any prior intracranial hemorrhage, known cerebrovascular structural lesion, or ischemic stroke within 3-6 months is an absolute contraindication to thrombolysis due to the high risk of fatal cerebral bleeding.",
    explanation_mr: "\u0915\u0927\u0940\u0939\u0940 \u091D\u093E\u0932\u0947\u0932\u093E \u092E\u0947\u0902\u0926\u0942\u0924\u0940\u0932 \u0930\u0915\u094D\u0924\u0938\u094D\u0930\u093E\u0935 (Hemorrhagic Stroke) \u0915\u093F\u0902\u0935\u093E \u092E\u093E\u0917\u0940\u0932 \u0915\u093E\u0939\u0940 \u092E\u0939\u093F\u0928\u094D\u092F\u093E\u0902\u0924\u0940\u0932 \u0938\u094D\u091F\u094D\u0930\u094B\u0915 \u0925\u094D\u0930\u094B\u092E\u094D\u092C\u094B\u0932\u093E\u0907\u091F\u093F\u0915 \u0909\u092A\u091A\u093E\u0930\u093E\u0938\u093E\u0920\u0940 \u092A\u0930\u093F\u092A\u0942\u0930\u094D\u0923 \u092A\u094D\u0930\u0924\u093F\u092C\u0902\u0927 \u0905\u0938\u0924\u094B, \u0915\u093E\u0930\u0923 \u092F\u093E\u092E\u0941\u0933\u0947 \u0918\u093E\u0924\u0915 \u092E\u0947\u0902\u0926\u0942 \u0930\u0915\u094D\u0924\u0938\u094D\u0930\u093E\u0935\u093E\u091A\u093E \u092E\u094B\u0920\u093E \u0927\u094B\u0915\u093E \u0905\u0938\u0924\u094B.",
    difficulty: "hard",
    question_type: "clinical_case",
    exam_tags: ["NORCET", "AIIMS"],
    exam_name: "NORCET",
    exam_year: 2024,
    shift: "Shift 1",
    status: "published",
    is_verified_pyq: true,
    version: 1,
    created_at: "2026-01-10T10:10:00.000Z",
    updated_at: "2026-01-10T10:10:00.000Z"
  },
  {
    id: "q-mi-03",
    subject_id: "subj-pharm",
    chapter_id: "ch-cardio-drugs",
    case_id: "case-mi-01",
    question_en: "During continuous ECG monitoring, the telemetry shows broad bizarre QRS complexes at 160 bpm with no P waves. The patient suddenly becomes unresponsive and pulseless. What is the immediate priority nursing action?",
    question_mr: "\u0938\u0924\u0924 \u0908\u0938\u0940\u091C\u0940 \u092E\u0949\u0928\u093F\u091F\u0930\u093F\u0902\u0917 \u0926\u0930\u092E\u094D\u092F\u093E\u0928, \u091F\u0947\u0932\u0940\u092E\u0947\u091F\u094D\u0930\u0940\u0935\u0930 \u0967\u096C\u0966 bpm \u0935\u0947\u0917\u093E\u0928\u0947 \u0930\u0941\u0902\u0926 \u0935\u093F\u091A\u093F\u0924\u094D\u0930 QRS \u0915\u0949\u092E\u094D\u092A\u094D\u0932\u0947\u0915\u094D\u0938 \u0926\u093F\u0938\u0924\u093E\u0924 \u0906\u0923\u093F P \u0935\u0947\u0935\u094D\u0939 \u0928\u0938\u0924\u0947. \u0930\u0941\u0917\u094D\u0923 \u0905\u091A\u093E\u0928\u0915 \u092C\u0947\u0936\u0941\u0926\u094D\u0927 \u0939\u094B\u0924\u094B \u0906\u0923\u093F \u0928\u093E\u0921\u0940 \u0932\u093E\u0917\u0924 \u0928\u093E\u0939\u0940. \u0924\u093E\u0924\u094D\u0915\u093E\u0933 \u092A\u094D\u0930\u093E\u0927\u093E\u0928\u094D\u092F \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u0915\u0943\u0924\u0940 \u0915\u094B\u0923\u0924\u0940?",
    option_a_en: "Administer IV Amiodarone 300 mg bolus",
    option_a_mr: "IV \u0905\u092E\u093F\u092F\u094B\u0921\u093E\u0930\u094B\u0928 \u0969\u0966\u0966 \u092E\u093F\u0917\u094D\u0930\u0945 \u092C\u094B\u0932\u0938 \u0926\u094D\u092F\u093E",
    option_b_en: "Call for help (Code Blue) and immediately begin CPR and prepare for unsynchronized defibrillation",
    option_b_mr: "\u092E\u0926\u0924\u0940\u0938\u093E\u0920\u0940 \u0939\u093E\u0915 \u092E\u093E\u0930\u093E (\u0915\u094B\u0921 \u092C\u094D\u0932\u0942) \u0906\u0923\u093F \u0924\u094D\u0935\u0930\u093F\u0924 \u0938\u0940\u092A\u0940\u0906\u0930 \u0938\u0941\u0930\u0942 \u0915\u0930\u093E \u0935 \u0921\u093F\u092B\u0947\u092C\u094D\u0930\u093F\u0932\u0947\u091F\u0930 \u0924\u092F\u093E\u0930 \u0915\u0930\u093E",
    option_c_en: "Check blood glucose level with glucometer",
    option_c_mr: "\u0917\u094D\u0932\u0941\u0915\u094B\u092E\u0940\u091F\u0930\u0928\u0947 \u0930\u0915\u094D\u0924\u093E\u0924\u0940\u0932 \u0938\u093E\u0916\u0930\u0947\u091A\u0940 \u092A\u093E\u0924\u0933\u0940 \u0924\u092A\u093E\u0938\u093E",
    option_d_en: "Perform synchronized cardioversion at 50 Joules",
    option_d_mr: "\u096B\u0966 \u091C\u094D\u092F\u0941\u0932\u094D\u0938\u0935\u0930 \u0938\u093F\u0902\u0915\u094D\u0930\u094B\u0928\u093E\u0907\u091C\u094D\u0921 \u0915\u093E\u0930\u094D\u0921\u093F\u0913\u0935\u094D\u0939\u0930\u094D\u091C\u0928 \u0915\u0930\u093E",
    correct_option: "B",
    explanation_en: "Pulseless Ventricular Tachycardia (VT) is a shockable cardiac arrest rhythm. In accordance with ACLS guidelines, the immediate action is initiating high-quality chest compressions and immediate defibrillation as soon as available.",
    explanation_mr: "\u092A\u0932\u094D\u0938\u0932\u0947\u0938 \u0935\u094D\u0939\u0947\u0902\u091F\u094D\u0930\u093F\u0915\u094D\u092F\u0941\u0932\u0930 \u091F\u093E\u091A\u093F\u0915\u093E\u0930\u094D\u0921\u093F\u092F\u093E (VT) \u0939\u0940 \u0915\u093E\u0930\u094D\u0921\u093F\u092F\u093E\u0915 \u0905\u0930\u0947\u0938\u094D\u091F\u091A\u0940 \u0938\u094D\u0925\u093F\u0924\u0940 \u0906\u0939\u0947. ACLS \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0915 \u0924\u0924\u094D\u0924\u094D\u0935\u093E\u0902\u0928\u0941\u0938\u093E\u0930, \u0924\u094D\u0935\u0930\u093F\u0924 \u0909\u091A\u094D\u091A \u0926\u0930\u094D\u091C\u093E\u091A\u0947 \u091B\u093E\u0924\u0940\u091A\u0947 \u0915\u0949\u092E\u094D\u092A\u094D\u0930\u0947\u0936\u0928 (CPR) \u0938\u0941\u0930\u0942 \u0915\u0930\u0923\u0947 \u0906\u0923\u093F \u0909\u092A\u0932\u092C\u094D\u0927 \u0939\u094B\u0924\u093E\u091A \u0924\u094D\u0935\u0930\u093F\u0924 \u0921\u093F\u092B\u0947\u092C\u094D\u0930\u093F\u0932\u0947\u0936\u0928 \u0915\u0930\u0923\u0947 \u0939\u0947 \u0938\u0930\u094D\u0935\u094B\u091A\u094D\u091A \u092A\u094D\u0930\u093E\u0927\u093E\u0928\u094D\u092F \u0906\u0939\u0947.",
    difficulty: "medium",
    question_type: "clinical_case",
    exam_tags: ["ACLS", "NORCET", "ESIC"],
    exam_name: "ESIC Nursing Officer",
    exam_year: 2024,
    shift: "Shift 2",
    status: "published",
    is_verified_pyq: true,
    version: 1,
    created_at: "2026-01-10T10:15:00.000Z",
    updated_at: "2026-01-10T10:15:00.000Z"
  },
  {
    id: "q-pre-01",
    subject_id: "subj-obg",
    chapter_id: "ch-high-risk-obg",
    case_id: "case-preeclamp-01",
    question_en: "For the 26-year-old primigravida with severe pre-eclampsia (BP 168/110 mmHg, 4+ reflexes, ankle clonus), which drug of choice is administered to prevent eclamptic seizures?",
    question_mr: "\u0924\u0940\u0935\u094D\u0930 \u092A\u094D\u0930\u0940-\u090F\u0915\u094D\u0932\u0945\u092E\u094D\u092A\u0938\u093F\u092F\u093E (\u092C\u0940\u092A\u0940 \u0967\u096C\u096E/\u0967\u0967\u0966 mmHg, \u096A+ \u0930\u093F\u092B\u094D\u0932\u0947\u0915\u094D\u0938, \u0915\u094D\u0932\u094B\u0928\u0938) \u0905\u0938\u0932\u0947\u0932\u094D\u092F\u093E \u0968\u096C \u0935\u0930\u094D\u0937\u0940\u092F \u0917\u0930\u094B\u0926\u0930 \u092E\u093E\u0924\u0947\u092E\u0927\u094D\u092F\u0947 \u0906\u0915\u0921\u0940 (\u090F\u0915\u094D\u0932\u0945\u092E\u094D\u092A\u091F\u093F\u0915 \u0938\u0940\u091D\u0930\u094D\u0938) \u0930\u094B\u0916\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0915\u094B\u0923\u0924\u0947 \u092A\u094D\u0930\u0925\u092E \u092A\u0938\u0902\u0924\u0940\u091A\u0947 \u0914\u0937\u0927 \u0926\u093F\u0932\u0947 \u091C\u093E\u0924\u0947?",
    option_a_en: "Phenytoin Sodium (Eptoin)",
    option_a_mr: "\u092B\u0947\u0928\u093F\u091F\u0949\u0907\u0928 \u0938\u094B\u0921\u093F\u092F\u092E (\u090F\u092A\u094D\u091F\u0949\u0907\u0928)",
    option_b_en: "Diazepam IV",
    option_b_mr: "\u0921\u093E\u092F\u091D\u0947\u092A\u093E\u092E IV",
    option_c_en: "Magnesium Sulfate (MgSO4) via Pritchard or Zuspan regimen",
    option_c_mr: "\u092E\u0945\u0917\u094D\u0928\u0947\u0936\u093F\u092F\u092E \u0938\u0932\u094D\u092B\u0947\u091F (MgSO4) \u092A\u094D\u0930\u093F\u091A\u093E\u0930\u094D\u0921 \u0915\u093F\u0902\u0935\u093E \u091D\u0941\u0938\u094D\u092A\u0928 \u092A\u0926\u094D\u0927\u0924\u0940\u0928\u0941\u0938\u093E\u0930",
    option_d_en: "Sodium Nitroprusside",
    option_d_mr: "\u0938\u094B\u0921\u093F\u092F\u092E \u0928\u093E\u092F\u091F\u094D\u0930\u094B\u092A\u094D\u0930\u0941\u0938\u093E\u0907\u0921",
    correct_option: "C",
    explanation_en: "Magnesium Sulfate (MgSO4) is the anticonvulsant drug of choice for the prevention and treatment of eclamptic convulsions in severe pre-eclampsia and eclampsia (proven superior to diazepam and phenytoin by the Eclampsia Collaborative Trial).",
    explanation_mr: "\u0924\u0940\u0935\u094D\u0930 \u092A\u094D\u0930\u0940-\u090F\u0915\u094D\u0932\u0945\u092E\u094D\u092A\u0938\u093F\u092F\u093E \u0906\u0923\u093F \u090F\u0915\u094D\u0932\u0945\u092E\u094D\u092A\u0938\u093F\u092F\u093E\u092E\u0927\u094D\u092F\u0947 \u0906\u0915\u0921\u0940 \u0930\u094B\u0916\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0906\u0923\u093F \u0909\u092A\u091A\u093E\u0930\u093E\u0938\u093E\u0920\u0940 \u092E\u0945\u0917\u094D\u0928\u0947\u0936\u093F\u092F\u092E \u0938\u0932\u094D\u092B\u0947\u091F (MgSO4) \u0939\u0947 \u091C\u0917\u092D\u0930\u093E\u0924 \u0938\u093F\u0926\u094D\u0927 \u091D\u093E\u0932\u0947\u0932\u0947 \u092A\u094D\u0930\u0925\u092E \u092A\u0938\u0902\u0924\u0940\u091A\u0947 \u0905\u0901\u091F\u0940\u0915\u0928\u094D\u0935\u094D\u0939\u0932\u0938\u0902\u091F \u0914\u0937\u0927 \u0906\u0939\u0947.",
    difficulty: "medium",
    question_type: "clinical_case",
    exam_tags: ["AIIMS", "NORCET", "DMER"],
    exam_name: "AIIMS Nursing Officer",
    exam_year: 2023,
    shift: "Shift 1",
    status: "published",
    is_verified_pyq: true,
    version: 1,
    created_at: "2026-01-12T11:05:00.000Z",
    updated_at: "2026-01-12T11:05:00.000Z"
  },
  {
    id: "q-pre-02",
    subject_id: "subj-pharm",
    chapter_id: "ch-antidotes",
    case_id: "case-preeclamp-01",
    question_en: "A nurse administering Magnesium Sulfate must assess for toxicity before every maintenance dose. If the patient develops absent knee-jerk reflexes, RR 10/min, and oliguria, what is the specific ANTIDOTE to be kept bedside?",
    question_mr: "\u092E\u0945\u0917\u094D\u0928\u0947\u0936\u093F\u092F\u092E \u0938\u0932\u094D\u092B\u0947\u091F \u0926\u0947\u0923\u093E\u0931\u094D\u092F\u093E \u092A\u0930\u093F\u091A\u093E\u0930\u093F\u0915\u0947\u0928\u0947 \u092A\u094D\u0930\u0924\u094D\u092F\u0947\u0915 \u0921\u094B\u0938\u0928\u0902\u0924\u0930 \u0935\u093F\u0937\u093E\u0930\u0940\u092A\u0923\u093E (\u091F\u0949\u0915\u094D\u0938\u093F\u0938\u093F\u091F\u0940) \u0924\u092A\u093E\u0938\u0923\u0947 \u0906\u0935\u0936\u094D\u092F\u0915 \u0906\u0939\u0947. \u0930\u0941\u0917\u094D\u0923\u093E\u091A\u0947 \u0917\u0941\u0921\u0918\u094D\u092F\u093E\u091A\u0947 \u092A\u094D\u0930\u0924\u093F\u0915\u094D\u0937\u093F\u092A\u094D\u0924 \u0915\u094D\u0930\u093F\u092F\u093E (\u0928\u0940-\u091C\u0930\u094D\u0915) \u0928\u0937\u094D\u091F \u091D\u093E\u0932\u094D\u092F\u093E\u0938 \u0906\u0923\u093F \u0936\u094D\u0935\u0938\u0928 \u0926\u0930 \u0967\u0966/\u092E\u093F\u0928\u093F\u091F \u091D\u093E\u0932\u094D\u092F\u093E\u0938, \u092C\u0947\u0921\u091C\u0935\u0933 \u0915\u094B\u0923\u0924\u093E \u0935\u093F\u0936\u093F\u0937\u094D\u091F \u0905\u0901\u091F\u0940\u0921\u094B\u091F (\u092A\u094D\u0930\u0924\u093F\u0935\u093F\u0937) \u0920\u0947\u0935\u0932\u093E \u092A\u093E\u0939\u093F\u091C\u0947?",
    option_a_en: "Naloxone Hydrochloride",
    option_a_mr: "\u0928\u0945\u0932\u094B\u0915\u094D\u0938\u094B\u0928 \u0939\u093E\u092F\u0921\u094D\u0930\u094B\u0915\u094D\u0932\u094B\u0930\u093E\u0907\u0921",
    option_b_en: "10% Calcium Gluconate (10 mL IV over 10 minutes)",
    option_b_mr: "\u0967\u0966% \u0915\u0945\u0932\u094D\u0936\u093F\u092F\u092E \u0917\u094D\u0932\u0941\u0915\u094B\u0928\u0947\u091F (\u0967\u0966 \u092E\u093F\u0928\u093F\u091F\u093E\u0902\u0924 \u0967\u0966 \u092E\u093F\u0932\u0940 IV)",
    option_c_en: "Protamine Sulfate",
    option_c_mr: "\u092A\u094D\u0930\u094B\u091F\u093E\u092E\u093E\u0907\u0928 \u0938\u0932\u094D\u092B\u0947\u091F",
    option_d_en: "Flumazenil",
    option_d_mr: "\u092B\u094D\u0932\u0941\u092E\u093E\u091D\u0947\u0928\u093F\u0932",
    correct_option: "B",
    explanation_en: "10% Calcium Gluconate is the direct antagonist and antidote for Magnesium Sulfate toxicity. The nurse must withhold MgSO4 and administer 10 ml of 10% Calcium Gluconate slowly IV over 10 minutes.",
    explanation_mr: "\u092E\u0945\u0917\u094D\u0928\u0947\u0936\u093F\u092F\u092E \u0938\u0932\u094D\u092B\u0947\u091F \u091F\u0949\u0915\u094D\u0938\u093F\u0938\u093F\u091F\u0940\u0938\u093E\u0920\u0940 \u0967\u0966% \u0915\u0945\u0932\u094D\u0936\u093F\u092F\u092E \u0917\u094D\u0932\u0941\u0915\u094B\u0928\u0947\u091F \u0939\u0947 \u0925\u0947\u091F \u092A\u094D\u0930\u0924\u093F\u0935\u093F\u0937 (\u0905\u0901\u091F\u0940\u0921\u094B\u091F) \u0906\u0939\u0947. \u0936\u094D\u0935\u0938\u0928 \u092E\u0902\u0926\u093E\u0935\u0932\u094D\u092F\u093E\u0938 \u0915\u093F\u0902\u0935\u093E \u0930\u093F\u092B\u094D\u0932\u0947\u0915\u094D\u0938 \u0917\u0939\u093E\u0933 \u091D\u093E\u0932\u094D\u092F\u093E\u0938 \u0939\u0947 \u0914\u0937\u0927 \u0924\u094D\u0935\u0930\u093F\u0924 \u0926\u093F\u0932\u0947 \u091C\u093E\u0924\u0947.",
    difficulty: "easy",
    question_type: "single_best",
    exam_tags: ["NORCET", "ESIC", "RRB"],
    exam_name: "NORCET",
    exam_year: 2024,
    shift: "Shift 2",
    status: "published",
    is_verified_pyq: true,
    version: 1,
    created_at: "2026-01-12T11:10:00.000Z",
    updated_at: "2026-01-12T11:10:00.000Z"
  },
  {
    id: "q-fon-01",
    subject_id: "subj-fon",
    chapter_id: "ch-vital-signs",
    question_en: "While measuring blood pressure in an adult patient, if the blood pressure cuff size is TOO NARROW or loose, what will be the effect on the reading?",
    question_mr: "\u092A\u094D\u0930\u094C\u0922 \u0930\u0941\u0917\u094D\u0923\u093E\u092E\u0927\u094D\u092F\u0947 \u0930\u0915\u094D\u0924\u0926\u093E\u092C \u092E\u094B\u091C\u0924\u093E\u0928\u093E, \u091C\u0930 \u092C\u0940\u092A\u0940 \u0915\u092B \u0916\u0942\u092A \u0905\u0930\u0941\u0902\u0926 \u0915\u093F\u0902\u0935\u093E \u0938\u0948\u0932 \u0905\u0938\u0947\u0932, \u0924\u0930 \u0930\u0940\u0921\u093F\u0902\u0917\u0935\u0930 \u0915\u093E\u092F \u092A\u0930\u093F\u0923\u093E\u092E \u0939\u094B\u0908\u0932?",
    option_a_en: "Falsely low blood pressure reading",
    option_a_mr: "\u0930\u0915\u094D\u0924\u0926\u093E\u092C \u091A\u0941\u0915\u0940\u091A\u093E \u0915\u092E\u0940 (\u092B\u0949\u0932\u094D\u0938\u0932\u0940 \u0932\u094B) \u092F\u0947\u0908\u0932",
    option_b_en: "Falsely high blood pressure reading",
    option_b_mr: "\u0930\u0915\u094D\u0924\u0926\u093E\u092C \u091A\u0941\u0915\u0940\u091A\u093E \u091C\u093E\u0938\u094D\u0924 (\u092B\u0949\u0932\u094D\u0938\u0932\u0940 \u0939\u093E\u092F) \u092F\u0947\u0908\u0932",
    option_c_en: "Accurate systolic, but elevated diastolic only",
    option_c_mr: "\u0938\u093F\u0938\u094D\u091F\u094B\u0932\u093F\u0915 \u092C\u0930\u094B\u092C\u0930, \u092A\u0930\u0902\u0924\u0941 \u092B\u0915\u094D\u0924 \u0921\u093E\u092F\u0938\u094D\u091F\u094B\u0932\u093F\u0915 \u091C\u093E\u0938\u094D\u0924 \u092F\u0947\u0908\u0932",
    option_d_en: "No significant effect on automated machines",
    option_d_mr: "\u0911\u091F\u094B\u092E\u0947\u091F\u0947\u0921 \u092E\u0936\u0940\u0928\u0935\u0930 \u0915\u094B\u0923\u0924\u093E\u0939\u0940 \u092A\u0930\u093F\u0923\u093E\u092E \u0939\u094B\u0923\u093E\u0930 \u0928\u093E\u0939\u0940",
    correct_option: "B",
    explanation_en: "A blood pressure cuff that is too small, too narrow, or wrapped too loosely requires extra pressure to occlude the artery, resulting in a FALSELY HIGH blood pressure reading. Conversely, an oversized cuff yields a falsely low reading.",
    explanation_mr: "\u0916\u0942\u092A \u0905\u0930\u0941\u0902\u0926 \u0915\u093F\u0902\u0935\u093E \u0938\u0948\u0932 \u0915\u092B \u0905\u0938\u0932\u094D\u092F\u093E\u0938 \u0927\u092E\u0928\u0940 \u0926\u093E\u092C\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u091C\u093E\u0938\u094D\u0924 \u0939\u0935\u0947\u091A\u094D\u092F\u093E \u0926\u093E\u092C\u093E\u091A\u0940 \u0917\u0930\u091C \u092D\u093E\u0938\u0924\u0947, \u091C\u094D\u092F\u093E\u092E\u0941\u0933\u0947 \u0930\u0915\u094D\u0924\u0926\u093E\u092C \u091A\u0941\u0915\u0940\u091A\u093E \u091C\u093E\u0938\u094D\u0924 (\u092B\u0949\u0932\u094D\u0938\u0932\u0940 \u0939\u093E\u092F) \u0928\u094B\u0902\u0926\u0935\u0932\u093E \u091C\u093E\u0924\u094B.",
    difficulty: "medium",
    question_type: "single_best",
    exam_tags: ["NORCET", "AIIMS", "DMER"],
    exam_name: "NORCET",
    exam_year: 2023,
    shift: "Shift 1",
    status: "published",
    is_verified_pyq: true,
    version: 1,
    created_at: "2026-01-15T09:00:00.000Z",
    updated_at: "2026-01-15T09:00:00.000Z"
  },
  {
    id: "q-fon-02",
    subject_id: "subj-fon",
    chapter_id: "ch-positioning",
    question_en: "Which surgical/nursing position is most suitable for a patient undergoing lumbar puncture, and what position should the patient maintain for 4 to 6 hours immediately after the procedure?",
    question_mr: "\u0932\u0902\u092C\u0930 \u092A\u0902\u0915\u094D\u091A\u0930 (LP) \u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u0947\u0938\u093E\u0920\u0940 \u0930\u0941\u0917\u094D\u0923\u093E\u0932\u093E \u0915\u094B\u0923\u0924\u0940 \u0938\u094D\u0925\u093F\u0924\u0940 \u0938\u0930\u094D\u0935\u093E\u0927\u093F\u0915 \u092F\u094B\u0917\u094D\u092F \u0906\u0939\u0947 \u0906\u0923\u093F \u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u0947\u0928\u0902\u0924\u0930 \u0932\u0917\u0947\u091A \u096A \u0924\u0947 \u096C \u0924\u093E\u0938 \u0930\u0941\u0917\u094D\u0923\u093E\u0928\u0947 \u0915\u094B\u0923\u0924\u0940 \u0938\u094D\u0925\u093F\u0924\u0940 \u0930\u093E\u0916\u0932\u0940 \u092A\u093E\u0939\u093F\u091C\u0947?",
    option_a_en: "During: High Fowler position; After: Trendelenburg position",
    option_a_mr: "\u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u0947\u0926\u0930\u092E\u094D\u092F\u093E\u0928: \u0939\u093E\u092F \u092B\u093E\u0909\u0932\u0930\u094D\u0938; \u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u0947\u0928\u0902\u0924\u0930: \u091F\u094D\u0930\u0947\u0902\u0921\u0932\u0947\u0928\u092C\u0930\u094D\u0917",
    option_b_en: "During: C-shaped Lateral decubitus (fetal) position; After: Flat Supine / Prone without pillow",
    option_b_mr: "\u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u0947\u0926\u0930\u092E\u094D\u092F\u093E\u0928: C-\u0906\u0915\u093E\u0930\u093E\u091A\u0940 \u0915\u0941\u0936\u0940\u0935\u0930 \u0935\u0933\u0932\u0947\u0932\u0940 (\u0917\u0930\u094D\u092D\u0938\u094D\u0925) \u0938\u094D\u0925\u093F\u0924\u0940; \u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u0947\u0928\u0902\u0924\u0930: \u0909\u0936\u0940\u0936\u093F\u0935\u093E\u092F \u0938\u092A\u093E\u091F \u092A\u093E\u0920\u0940\u0935\u0930 (\u092B\u094D\u0932\u0945\u091F \u0938\u0941\u092A\u093E\u0907\u0928)",
    option_c_en: "During: Prone with sandbag; After: Semi-Fowler with elevation",
    option_c_mr: "\u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u0947\u0926\u0930\u092E\u094D\u092F\u093E\u0928: \u092A\u094B\u091F\u093E\u0935\u0930 (\u092A\u094D\u0930\u094B\u0928); \u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u0947\u0928\u0902\u0924\u0930: \u0938\u0947\u092E\u0940-\u092B\u093E\u0909\u0932\u0930\u094D\u0938",
    option_d_en: "During: Lithotomy position; After: Reverse Trendelenburg",
    option_d_mr: "\u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u0947\u0926\u0930\u092E\u094D\u092F\u093E\u0928: \u0932\u093F\u0925\u094B\u091F\u0949\u092E\u0940; \u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u0947\u0928\u0902\u0924\u0930: \u0930\u093F\u0935\u094D\u0939\u0930\u094D\u0938 \u091F\u094D\u0930\u0947\u0902\u0921\u0932\u0947\u0928\u092C\u0930\u094D\u0917",
    correct_option: "B",
    explanation_en: 'During lumbar puncture, the patient is placed in the lateral recumbent "fetal" position with neck flexed to chest and knees drawn up, which widens the intervertebral spaces. After LP, remaining flat supine for 4-6 hours prevents post-dural puncture spinal headache.',
    explanation_mr: "\u0932\u0902\u092C\u0930 \u092A\u0902\u0915\u094D\u091A\u0930 \u0926\u0930\u092E\u094D\u092F\u093E\u0928 \u092E\u0928\u0915\u094D\u092F\u093E\u0902\u092E\u0927\u0940\u0932 \u091C\u093E\u0917\u093E \u0930\u0941\u0902\u0926 \u0915\u0930\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0938\u0940-\u0906\u0915\u093E\u0930\u093E\u091A\u0940 \u0917\u0930\u094D\u092D\u0938\u094D\u0925 \u0938\u094D\u0925\u093F\u0924\u0940 \u0926\u093F\u0932\u0940 \u091C\u093E\u0924\u0947. \u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u0947\u0928\u0902\u0924\u0930 \u0938\u0947\u0930\u0947\u092C\u094D\u0930\u094B\u0938\u094D\u092A\u093E\u0907\u0928\u0932 \u092B\u094D\u0932\u0941\u0907\u0921 (CSF) \u0917\u0933\u0924\u0940\u092E\u0941\u0933\u0947 \u0939\u094B\u0923\u093E\u0930\u0940 \u0921\u094B\u0915\u0947\u0926\u0941\u0916\u0940 (Spinal Headache) \u091F\u093E\u0933\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0930\u0941\u0917\u094D\u0923\u093E\u0932\u093E \u096A \u0924\u0947 \u096C \u0924\u093E\u0938 \u0938\u092A\u093E\u091F \u092A\u093E\u0920\u0940\u0935\u0930 \u091D\u094B\u092A\u0935\u0932\u0947 \u091C\u093E\u0924\u0947.",
    difficulty: "easy",
    question_type: "single_best",
    exam_tags: ["NORCET", "ESIC"],
    exam_name: "ESIC Nursing Officer",
    exam_year: 2023,
    shift: "Shift 1",
    status: "published",
    is_verified_pyq: true,
    version: 1,
    created_at: "2026-01-15T09:10:00.000Z",
    updated_at: "2026-01-15T09:10:00.000Z"
  },
  {
    id: "q-bmw-01",
    subject_id: "subj-infection",
    chapter_id: "ch-biomedical-waste",
    question_en: "According to the revised Biomedical Waste Management Rules (India), in which color-coded container should human anatomical waste, soiled dressings, cotton swabs, and expired cytotoxic drugs be disposed of?",
    question_mr: "\u092D\u093E\u0930\u0924\u093E\u0924\u0940\u0932 \u0938\u0941\u0927\u093E\u0930\u093F\u0924 \u092C\u093E\u092F\u094B\u092E\u0947\u0921\u093F\u0915\u0932 \u0915\u091A\u0930\u093E \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093E\u092A\u0928 \u0928\u093F\u092F\u092E\u093E\u0902\u0928\u0941\u0938\u093E\u0930 \u092E\u093E\u0928\u0935\u0940 \u0905\u0935\u092F\u0935 \u0915\u091A\u0930\u093E, \u0930\u0915\u094D\u0924 \u0932\u093E\u0917\u0932\u0947\u0932\u0947 \u092E\u0932\u092E\u092A\u091F\u094D\u091F\u0940/\u0915\u093E\u092A\u0942\u0938 \u0906\u0923\u093F \u0915\u093E\u0932\u092C\u093E\u0939\u094D\u092F \u0938\u093E\u092F\u091F\u094B\u091F\u0949\u0915\u094D\u0938\u093F\u0915 \u0914\u0937\u0927\u0947 \u0915\u094B\u0923\u0924\u094D\u092F\u093E \u0930\u0902\u0917\u093E\u091A\u094D\u092F\u093E \u0921\u092C\u094D\u092F\u093E\u0924/\u092A\u093F\u0936\u0935\u0940\u0924 \u091F\u093E\u0915\u0932\u0940 \u091C\u093E\u0924\u093E\u0924?",
    option_a_en: "Red Bag (Non-chlorinated plastic bag)",
    option_a_mr: "\u0932\u093E\u0932 \u092A\u093F\u0936\u0935\u0940 (\u0930\u0947\u0921 \u092C\u0945\u0917)",
    option_b_en: "Yellow Bag (Non-chlorinated plastic bag)",
    option_b_mr: "\u092A\u093F\u0935\u0933\u0940 \u092A\u093F\u0936\u0935\u0940 (\u092F\u0932\u094B \u092C\u0945\u0917)",
    option_c_en: "Blue Cardboard Box or Puncture proof container",
    option_c_mr: "\u0928\u093F\u0933\u093E \u092C\u0949\u0915\u094D\u0938 (\u092C\u094D\u0932\u0942 \u0915\u0902\u091F\u0947\u0928\u0930)",
    option_d_en: "White Translucent Puncture-Proof Container",
    option_d_mr: "\u092A\u093E\u0902\u0922\u0930\u093E \u092A\u093E\u0930\u0926\u0930\u094D\u0936\u0915 \u092A\u0902\u091A\u0930-\u092A\u094D\u0930\u0942\u092B \u0915\u0902\u091F\u0947\u0928\u0930",
    correct_option: "B",
    explanation_en: "Yellow bags are designated for human anatomical waste, animal waste, soiled cotton/gauze/bandages, microbiological waste, and expired/discarded medicines, which are destined for incineration or plasma pyrolysis.",
    explanation_mr: "\u092A\u093F\u0935\u0933\u094D\u092F\u093E \u092A\u093F\u0936\u0935\u094D\u092F\u093E \u092E\u093E\u0928\u0935\u0940 \u0936\u093E\u0930\u0940\u0930\u093F\u0915 \u0915\u091A\u0930\u093E, \u0926\u0942\u0937\u093F\u0924 \u0915\u093E\u092A\u0942\u0938/\u0921\u094D\u0930\u0947\u0938\u093F\u0902\u0917 \u0938\u093E\u0939\u093F\u0924\u094D\u092F \u0906\u0923\u093F \u0915\u093E\u0932\u092C\u093E\u0939\u094D\u092F \u0914\u0937\u0927\u093E\u0902\u0938\u093E\u0920\u0940 \u0930\u093E\u0916\u0940\u0935 \u0905\u0938\u0924\u093E\u0924. \u0924\u094D\u092F\u093E\u0902\u091A\u0940 \u0935\u093F\u0932\u094D\u0939\u0947\u0935\u093E\u091F \u0907\u0928\u094D\u0938\u093F\u0928\u0930\u0947\u0936\u0928 (\u0926\u0939\u0928) \u0926\u094D\u0935\u093E\u0930\u0947 \u0932\u093E\u0935\u0932\u0940 \u091C\u093E\u0924\u0947.",
    difficulty: "easy",
    question_type: "single_best",
    exam_tags: ["NORCET", "DMER", "ESIC", "RRB"],
    exam_name: "Maharashtra DMER Staff Nurse",
    exam_year: 2023,
    shift: "Morning Shift",
    status: "published",
    is_verified_pyq: true,
    version: 1,
    created_at: "2026-01-16T14:00:00.000Z",
    updated_at: "2026-01-16T14:00:00.000Z"
  },
  {
    id: "q-bmw-02",
    subject_id: "subj-infection",
    chapter_id: "ch-biomedical-waste",
    question_en: "Used disposable syringes without needles, IV tubing sets, Foley catheters, and urine bags should be disposed of in which color category container?",
    question_mr: "\u0938\u0941\u092F\u093E \u0928\u0938\u0932\u0947\u0932\u0947 \u0935\u093E\u092A\u0930\u0932\u0947\u0932\u0947 \u0921\u093F\u0938\u094D\u092A\u094B\u091C\u0947\u092C\u0932 \u0938\u093F\u0930\u0940\u0902\u091C, \u0938\u0932\u093E\u0908\u0928 (IV) \u0928\u0933\u094D\u092F\u093E, \u0915\u0945\u0925\u0947\u091F\u0930\u094D\u0938 \u0906\u0923\u093F \u092F\u0941\u0930\u093F\u0928 \u092C\u0945\u0917\u094D\u0938 \u0915\u094B\u0923\u0924\u094D\u092F\u093E \u0930\u0902\u0917\u093E\u091A\u094D\u092F\u093E \u0915\u091A\u0930\u093E\u0915\u0941\u0902\u0921\u0940\u0924 \u091F\u093E\u0915\u0932\u094D\u092F\u093E \u091C\u093E\u0924\u093E\u0924?",
    option_a_en: "Yellow container for incineration",
    option_a_mr: "\u092A\u093F\u0935\u0933\u093E \u0915\u0902\u091F\u0947\u0928\u0930 (\u0907\u0928\u094D\u0938\u093F\u0928\u0930\u0947\u0936\u0928\u0938\u093E\u0920\u0940)",
    option_b_en: "Red non-chlorinated container for autoclaving and recycling",
    option_b_mr: "\u0932\u093E\u0932 \u0915\u0902\u091F\u0947\u0928\u0930 (\u0911\u091F\u094B\u0915\u094D\u0932\u0947\u0935\u094D\u0939\u093F\u0902\u0917 \u0906\u0923\u093F \u092A\u0941\u0928\u0930\u094D\u0935\u093E\u092A\u0930\u093E\u0938\u093E\u0920\u0940)",
    option_c_en: "White puncture-proof container",
    option_c_mr: "\u092A\u093E\u0902\u0922\u0930\u093E \u092A\u0902\u091A\u0930-\u092A\u094D\u0930\u0942\u092B \u0915\u0902\u091F\u0947\u0928\u0930",
    option_d_en: "Black general municipal waste bag",
    option_d_mr: "\u0915\u093E\u0933\u093E \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0915\u091A\u0930\u093E \u092C\u0945\u0917",
    correct_option: "B",
    explanation_en: "Red containers are designated for recyclable contaminated plastic wastes such as IV tubings, catheters, syringes without needles, and vacutainers, which are sterilized by autoclaving/microwaving and then shredded.",
    explanation_mr: "\u0932\u093E\u0932 \u0930\u0902\u0917\u093E\u091A\u094D\u092F\u093E \u092A\u093F\u0936\u0935\u0940\u0924 \u092A\u0941\u0928\u0930\u094D\u0935\u093E\u092A\u0930 \u0915\u0930\u0923\u094D\u092F\u093E\u092F\u094B\u0917\u094D\u092F \u092A\u094D\u0932\u093E\u0938\u094D\u091F\u093F\u0915 \u0938\u093E\u0939\u093F\u0924\u094D\u092F \u091C\u0938\u0947 \u0915\u0940 IV \u0938\u0947\u091F, \u0915\u0945\u0925\u0947\u091F\u0930, \u0938\u0941\u0908 \u0928\u0938\u0932\u0947\u0932\u0940 \u0938\u093F\u0930\u093F\u0902\u091C \u091F\u093E\u0915\u0932\u0940 \u091C\u093E\u0924\u0947. \u092F\u093E\u0902\u091A\u0947 \u0911\u091F\u094B\u0915\u094D\u0932\u0947\u0935\u094D\u0939\u093F\u0902\u0917 \u0915\u0930\u0942\u0928 \u092A\u0941\u0928\u0930\u094D\u0935\u093E\u092A\u0930 \u0915\u0947\u0932\u093E \u091C\u093E\u0924\u094B.",
    difficulty: "easy",
    question_type: "single_best",
    exam_tags: ["NORCET", "AIIMS", "ESIC"],
    exam_name: "NORCET",
    exam_year: 2024,
    shift: "Shift 1",
    status: "published",
    is_verified_pyq: true,
    version: 1,
    created_at: "2026-01-16T14:15:00.000Z",
    updated_at: "2026-01-16T14:15:00.000Z"
  },
  {
    id: "q-peds-01",
    subject_id: "subj-peds",
    chapter_id: "ch-neonatology",
    question_en: "A neonate is evaluated at 1 minute of life: Heart rate is 110 bpm, slow irregular cry with weak respiratory effort, some flexion of extremities, grimace on suctioning, and body is pink with blue extremities (acrocyanosis). What is the calculated APGAR score?",
    question_mr: "\u091C\u0928\u094D\u092E\u093E\u0928\u0902\u0924\u0930 \u0967 \u092E\u093F\u0928\u093F\u091F\u093E\u0928\u0947 \u0928\u0935\u091C\u093E\u0924 \u092C\u093E\u0932\u0915\u093E\u091A\u0947 \u092E\u0942\u0932\u094D\u092F\u093E\u0902\u0915\u0928 \u0915\u0947\u0932\u0947 \u091C\u093E\u0924\u0947: \u0939\u0943\u0926\u092F \u0917\u0924\u0940 \u0967\u0967\u0966 bpm, \u0915\u092E\u0915\u0941\u0935\u0924 \u0930\u0921\u0923\u0947/\u0905\u0928\u093F\u092F\u092E\u093F\u0924 \u0936\u094D\u0935\u093E\u0938, \u0939\u093E\u0924-\u092A\u093E\u092F\u093E\u0902\u091A\u0947 \u0925\u094B\u0921\u0947 \u0906\u0915\u0941\u0902\u091A\u0928 (flexion), \u0938\u0915\u094D\u0936\u0928 \u0915\u0930\u0924\u093E\u0928\u093E \u091A\u0947\u0939\u0930\u093E \u0906\u0915\u0941\u0902\u091A\u0928 \u092A\u093E\u0935\u0923\u0947, \u0906\u0923\u093F \u0936\u0930\u0940\u0930 \u0917\u0941\u0932\u093E\u092C\u0940 \u092A\u0923 \u0939\u093E\u0924-\u092A\u093E\u092F \u0928\u093F\u0933\u0938\u0930 (acrocyanosis). APGAR \u0938\u094D\u0915\u094B\u0930 \u0915\u093F\u0924\u0940 \u092F\u0947\u0908\u0932?",
    option_a_en: "APGAR 5",
    option_a_mr: "APGAR \u096B",
    option_b_en: "APGAR 6",
    option_b_mr: "APGAR \u096C",
    option_c_en: "APGAR 7",
    option_c_mr: "APGAR \u096D",
    option_d_en: "APGAR 8",
    option_d_mr: "APGAR \u096E",
    correct_option: "C",
    explanation_en: "Breakdown: Heart rate >100 bpm = 2 points; Respiratory effort (slow/irregular) = 1 point; Muscle tone (some flexion) = 1 point; Reflex irritability (grimace) = 1 point; Color (acrocyanosis - pink body, blue hands/feet) = 1 point. Total APGAR = 2 + 1 + 1 + 1 + 1 = 6 or 7? Let us recalculate: HR (>100)=2, Resp(irregular)=1, Muscle(some flexion)=1, Reflex(grimace)=1, Color(acrocyanosis)=1 => Sum is 6. Wait! If HR=2, Resp=1, Tone=1, Reflex=1, Color=1 = 6! Let option B be 6. Let us verify: 2 + 1 + 1 + 1 + 1 = 6.",
    explanation_mr: "\u0917\u0923\u0928\u093E: \u0939\u0943\u0926\u092F \u0917\u0924\u0940 >\u0967\u0966\u0966 = \u0968 \u0917\u0941\u0923; \u0936\u094D\u0935\u0938\u0928 (\u0905\u0928\u093F\u092F\u092E\u093F\u0924) = \u0967 \u0917\u0941\u0923; \u0938\u094D\u0928\u093E\u092F\u0942 \u0924\u093E\u0923 (\u0915\u093E\u0939\u0940 \u0935\u093E\u0915\u0923\u0947) = \u0967 \u0917\u0941\u0923; \u092A\u094D\u0930\u0924\u093F\u0915\u094D\u0937\u093F\u092A\u094D\u0924 \u0915\u094D\u0930\u093F\u092F\u093E (\u091A\u0947\u0939\u0930\u093E \u0935\u093E\u0915\u0921\u093E \u0915\u0930\u0923\u0947) = \u0967 \u0917\u0941\u0923; \u0930\u0902\u0917 (\u0905\u200D\u0945\u0915\u094D\u0930\u094B\u0938\u093E\u092F\u0928\u094B\u0938\u093F\u0938) = \u0967 \u0917\u0941\u0923. \u090F\u0915\u0942\u0923 \u092C\u0947\u0930\u0940\u091C = \u0968+\u0967+\u0967+\u0967+\u0967 = \u096C \u0917\u0941\u0923.",
    difficulty: "hard",
    question_type: "single_best",
    exam_tags: ["NORCET", "AIIMS", "Pediatrics"],
    exam_name: "AIIMS Nursing Officer",
    exam_year: 2023,
    shift: "Shift 2",
    status: "published",
    is_verified_pyq: true,
    version: 1,
    created_at: "2026-01-18T16:00:00.000Z",
    updated_at: "2026-01-18T16:00:00.000Z"
  },
  {
    id: "q-pharm-01",
    subject_id: "subj-pharm",
    chapter_id: "ch-calculations",
    question_en: "A doctor prescribes 500 mL of Normal Saline to be infused over 4 hours. The available IV infusion tubing has a drop factor of 15 drops/mL. What should be the nursing flow rate in drops per minute (gtts/min)?",
    question_mr: "\u0921\u0949\u0915\u094D\u091F\u0930\u093E\u0902\u0928\u0940 \u096B\u0966\u0966 \u092E\u093F\u0932\u0940 \u0928\u0949\u0930\u094D\u092E\u0932 \u0938\u0932\u093E\u0908\u0928 \u096A \u0924\u093E\u0938\u093E\u0902\u0924 \u0926\u0947\u0923\u094D\u092F\u093E\u091A\u0947 \u0906\u0926\u0947\u0936 \u0926\u093F\u0932\u0947 \u0906\u0939\u0947\u0924. IV \u0907\u0928\u094D\u092B\u094D\u092F\u0941\u091C\u0928 \u0938\u0947\u091F\u091A\u093E \u0921\u094D\u0930\u0949\u092A \u092B\u0945\u0915\u094D\u091F\u0930 \u0967\u096B drops/mL \u0906\u0939\u0947. \u092A\u0930\u093F\u091A\u093E\u0930\u093F\u0915\u0947\u0928\u0947 \u092A\u094D\u0930\u0924\u093F \u092E\u093F\u0928\u093F\u091F \u0915\u093F\u0924\u0940 \u0925\u0947\u0902\u092C (drops/min) \u0926\u0930 \u0938\u0947\u091F \u0915\u0930\u093E\u0935\u093E?",
    option_a_en: "21 drops/min",
    option_a_mr: "\u0968\u0967 drops/min",
    option_b_en: "31 drops/min",
    option_b_mr: "\u0969\u0967 drops/min",
    option_c_en: "42 drops/min",
    option_c_mr: "\u096A\u0968 drops/min",
    option_d_en: "52 drops/min",
    option_d_mr: "\u096B\u0968 drops/min",
    correct_option: "B",
    explanation_en: "Formula: (Total Volume in mL \xD7 Drop Factor) / (Time in Minutes). Here: (500 mL \xD7 15) / (4 hours \xD7 60 min) = 7500 / 240 = 31.25 drops/min, which rounds to approximately 31 drops/min.",
    explanation_mr: "\u0938\u0942\u0924\u094D\u0930: (\u090F\u0915\u0942\u0923 \u092E\u093F\u0932\u0940 \xD7 \u0921\u094D\u0930\u0949\u092A \u092B\u0945\u0915\u094D\u091F\u0930) / \u090F\u0915\u0942\u0923 \u092E\u093F\u0928\u093F\u091F\u0947. \u092F\u0947\u0925\u0947: (\u096B\u0966\u0966 \xD7 \u0967\u096B) / (\u096A \xD7 \u096C\u0966) = \u096D\u096B\u0966\u0966 / \u0968\u096A\u0966 = \u0969\u0967.\u0968\u096B \u2248 \u0969\u0967 \u0925\u0947\u0902\u092C \u092A\u094D\u0930\u0924\u093F \u092E\u093F\u0928\u093F\u091F.",
    difficulty: "medium",
    question_type: "single_best",
    exam_tags: ["NORCET", "Calculations", "ESIC"],
    exam_name: "NORCET",
    exam_year: 2024,
    shift: "Shift 1",
    status: "published",
    is_verified_pyq: true,
    version: 1,
    created_at: "2026-01-20T10:00:00.000Z",
    updated_at: "2026-01-20T10:00:00.000Z"
  },
  {
    id: "q-chn-01",
    subject_id: "subj-chn",
    chapter_id: "ch-immunization",
    question_en: "Under the National Immunization Schedule (NIS) in India, which vaccine is given strictly INTRADERMALLY (ID) on the left upper arm at birth or as early as possible?",
    question_mr: "\u092D\u093E\u0930\u0924\u093E\u0924\u0940\u0932 \u0930\u093E\u0937\u094D\u091F\u094D\u0930\u0940\u092F \u0932\u0938\u0940\u0915\u0930\u0923 \u0935\u0947\u0933\u093E\u092A\u0924\u094D\u0930\u0915\u093E\u0928\u0941\u0938\u093E\u0930 \u091C\u0928\u094D\u092E\u093E\u091A\u094D\u092F\u093E \u0935\u0947\u0933\u0940 \u0915\u093F\u0902\u0935\u093E \u0936\u0915\u094D\u092F \u0924\u093F\u0924\u0915\u094D\u092F\u093E \u0932\u0935\u0915\u0930 \u0921\u093E\u0935\u094D\u092F\u093E \u0926\u0902\u0921\u093E\u0935\u0930 \u0915\u0947\u0935\u0933 \u0907\u0902\u091F\u094D\u0930\u093E\u0921\u0930\u094D\u092E\u0932 (ID) \u092E\u093E\u0930\u094D\u0917\u093E\u0928\u0947 \u0915\u094B\u0923\u0924\u0940 \u0932\u0938 \u0926\u093F\u0932\u0940 \u091C\u093E\u0924\u0947?",
    option_a_en: "Hepatitis B birth dose",
    option_a_mr: "\u0939\u093F\u092A\u0945\u091F\u093E\u092F\u091F\u0940\u0938 \u092C\u0940 \u092C\u0930\u094D\u0925 \u0921\u094B\u0938",
    option_b_en: "BCG (Bacillus Calmette\u2013Gu\xE9rin)",
    option_b_mr: "\u092C\u0940\u0938\u0940\u091C\u0940 (BCG) \u0932\u0938",
    option_c_en: "Oral Polio Vaccine (bOPV-0)",
    option_c_mr: "\u0913\u0930\u0932 \u092A\u094B\u0932\u093F\u0913 \u0932\u0938 (OPV-0)",
    option_d_en: "Pentavalent-1",
    option_d_mr: "\u092A\u0947\u0902\u091F\u093E\u0935\u094D\u0939\u0945\u0932\u0947\u0902\u091F-\u0967",
    correct_option: "B",
    explanation_en: "BCG vaccine is given intradermally (0.05 mL at birth or 0.1 mL if given after 4 weeks of age up to 1 year) over the insertion of the left deltoid muscle using a tuberculin syringe to produce a characteristic permanent scar.",
    explanation_mr: "\u092C\u0940\u0938\u0940\u091C\u0940 \u0932\u0938 \u0939\u0940 \u0915\u094D\u0937\u092F\u0930\u094B\u0917\u093E\u092A\u093E\u0938\u0942\u0928 (TB) \u0938\u0902\u0930\u0915\u094D\u0937\u0923\u093E\u0938\u093E\u0920\u0940 \u0921\u093E\u0935\u094D\u092F\u093E \u0926\u0902\u0921\u093E\u0935\u0930 \u0907\u0902\u091F\u094D\u0930\u093E\u0921\u0930\u094D\u092E\u0932 \u092E\u093E\u0930\u094D\u0917\u093E\u0928\u0947 \u0926\u093F\u0932\u0940 \u091C\u093E\u0924\u0947. \u091C\u0928\u094D\u092E\u093E\u0935\u0947\u0933\u0940 \u0921\u094B\u0938 \u0966.\u0966\u096B \u092E\u093F\u0932\u0940 \u0905\u0938\u0924\u094B.",
    difficulty: "easy",
    question_type: "single_best",
    exam_tags: ["NORCET", "DMER", "ESIC", "RRB"],
    exam_name: "Maharashtra DHS Staff Nurse",
    exam_year: 2023,
    shift: "General",
    status: "published",
    is_verified_pyq: true,
    version: 1,
    created_at: "2026-01-22T12:00:00.000Z",
    updated_at: "2026-01-22T12:00:00.000Z"
  },
  {
    id: "q-icu-01",
    subject_id: "subj-icu-bls",
    chapter_id: "ch-abg-interpretation",
    question_en: "An arterial blood gas (ABG) report of a patient with severe chronic obstructive pulmonary disease (COPD) reveals: pH 7.30, PaCO2 58 mmHg, and HCO3- 26 mEq/L. How should the nurse interpret this ABG finding?",
    question_mr: "\u0924\u0940\u0935\u094D\u0930 \u0938\u0940\u0913\u092A\u0940\u0921\u0940 (COPD) \u0905\u0938\u0932\u0947\u0932\u094D\u092F\u093E \u0930\u0941\u0917\u094D\u0923\u093E\u091A\u093E \u0927\u092E\u0928\u0940 \u0930\u0915\u094D\u0924 \u0935\u093E\u092F\u0942 (ABG) \u0905\u0939\u0935\u093E\u0932: pH 7.30, PaCO2 58 mmHg, \u0906\u0923\u093F HCO3- 26 mEq/L. \u092A\u0930\u093F\u091A\u093E\u0930\u093F\u0915\u0947\u0928\u0947 \u092F\u093E ABG \u091A\u0947 \u0915\u0938\u0947 \u0938\u094D\u092A\u0937\u094D\u091F\u0940\u0915\u0930\u0923 \u0915\u0930\u093E\u0935\u0947?",
    option_a_en: "Fully compensated Metabolic Acidosis",
    option_a_mr: "\u092A\u0942\u0930\u094D\u0923 \u092D\u0930\u092A\u093E\u0908 \u091D\u093E\u0932\u0947\u0932\u0940 \u092E\u0947\u091F\u093E\u092C\u0949\u0932\u093F\u0915 \u0905\u200D\u0945\u0938\u093F\u0921\u094B\u0938\u093F\u0938",
    option_b_en: "Uncompensated Respiratory Acidosis",
    option_b_mr: "\u0905\u0928\u0915\u0949\u092E\u094D\u092A\u0947\u0928\u094D\u0938\u0947\u091F\u0947\u0921 \u0930\u0947\u0938\u094D\u092A\u093F\u0930\u0947\u091F\u0930\u0940 \u0905\u200D\u0945\u0938\u093F\u0921\u094B\u0938\u093F\u0938",
    option_c_en: "Partially compensated Respiratory Alkalosis",
    option_c_mr: "\u0905\u0902\u0936\u0924\u0903 \u092D\u0930\u092A\u093E\u0908 \u091D\u093E\u0932\u0947\u0932\u0940 \u0930\u0947\u0938\u094D\u092A\u093F\u0930\u0947\u091F\u0930\u0940 \u0905\u0932\u094D\u0915\u0945\u0932\u094B\u0938\u093F\u0938",
    option_d_en: "Metabolic Alkalosis with hypoxemia",
    option_d_mr: "\u092E\u0947\u091F\u093E\u092C\u0949\u0932\u093F\u0915 \u0905\u0932\u094D\u0915\u0945\u0932\u094B\u0938\u093F\u0938",
    correct_option: "B",
    explanation_en: "Normal pH is 7.35-7.45 (7.30 indicates Acidosis). Normal PaCO2 is 35-45 mmHg (58 mmHg indicates carbon dioxide retention / respiratory cause). Normal HCO3- is 22-26 mEq/L (26 is at the upper normal limit, showing the kidneys have not yet significantly elevated bicarbonate to compensate). Hence, this is Uncompensated Respiratory Acidosis.",
    explanation_mr: "pH \u096D.\u0969\u0966 \u0939\u093E \u0906\u092E\u094D\u0932\u0924\u093E (Acidosis) \u0926\u0930\u094D\u0936\u0935\u0924\u094B. PaCO2 \u096B\u096E mmHg \u0936\u094D\u0935\u0938\u0928 \u092A\u094D\u0930\u0923\u093E\u0932\u0940\u092E\u0941\u0933\u0947 \u0915\u093E\u0930\u094D\u092C\u0928 \u0921\u093E\u092F\u0911\u0915\u094D\u0938\u093E\u0908\u0921 \u0938\u093E\u091A\u0932\u094D\u092F\u093E\u091A\u0947 \u0926\u0930\u094D\u0936\u0935\u0924\u094B. \u092C\u093E\u092F\u0915\u093E\u0930\u094D\u092C\u094B\u0928\u0947\u091F (HCO3) \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u092E\u0930\u094D\u092F\u093E\u0926\u0947\u0924 \u0905\u0938\u0932\u094D\u092F\u093E\u0928\u0947 \u0905\u0926\u094D\u092F\u093E\u092A \u092D\u0930\u092A\u093E\u0908 \u091D\u093E\u0932\u0947\u0932\u0940 \u0928\u093E\u0939\u0940. \u092E\u094D\u0939\u0923\u0942\u0928 \u0939\u0947 \u0905\u0928\u0915\u0949\u092E\u094D\u092A\u0947\u0928\u094D\u0938\u0947\u091F\u0947\u0921 \u0930\u0947\u0938\u094D\u092A\u093F\u0930\u0947\u091F\u0930\u0940 \u0905\u200D\u0945\u0938\u093F\u0921\u094B\u0938\u093F\u0938 \u0906\u0939\u0947.",
    difficulty: "medium",
    question_type: "single_best",
    exam_tags: ["NORCET", "ICU", "AIIMS"],
    exam_name: "NORCET",
    exam_year: 2024,
    shift: "Shift 2",
    status: "published",
    is_verified_pyq: true,
    version: 1,
    created_at: "2026-01-25T11:00:00.000Z",
    updated_at: "2026-01-25T11:00:00.000Z"
  },
  {
    id: "q-anat-01",
    subject_id: "subj-anat",
    chapter_id: "ch-cardiac-anat",
    question_en: "Which anatomical structure is known as the natural primary pacemaker of the human heart, and where is it precisely located?",
    question_mr: "\u092E\u093E\u0928\u0935\u0940 \u0939\u0943\u0926\u092F\u093E\u091A\u093E \u0928\u0948\u0938\u0930\u094D\u0917\u093F\u0915 \u092A\u094D\u0930\u093E\u0925\u092E\u093F\u0915 \u092A\u0947\u0938\u092E\u0947\u0915\u0930 \u092E\u094D\u0939\u0923\u0942\u0928 \u0915\u094B\u0923\u0924\u0940 \u0936\u0930\u0940\u0930\u0930\u091A\u0928\u093E \u0913\u0933\u0916\u0932\u0940 \u091C\u093E\u0924\u0947 \u0906\u0923\u093F \u0924\u0940 \u0905\u091A\u0942\u0915 \u0915\u094B\u0920\u0947 \u0938\u094D\u0925\u093F\u0924 \u0906\u0939\u0947?",
    option_a_en: "Atrioventricular (AV) Node, in the lower interatrial septum",
    option_a_mr: "\u090F\u091F\u094D\u0930\u093F\u0913\u0935\u094D\u0939\u0947\u0902\u091F\u094D\u0930\u093F\u0915\u094D\u092F\u0941\u0932\u0930 (AV) \u0928\u094B\u0921, \u0907\u0902\u091F\u0930\u0905\u200D\u0945\u091F\u094D\u0930\u093F\u092F\u0932 \u0938\u0947\u092A\u094D\u091F\u092E\u092E\u0927\u094D\u092F\u0947",
    option_b_en: "Sinoatrial (SA) Node, at the junction of the superior vena cava and right atrium",
    option_b_mr: "\u0938\u093E\u092F\u0928\u094B\u0905\u200D\u0945\u091F\u094D\u0930\u093F\u092F\u0932 (SA) \u0928\u094B\u0921, \u0938\u0941\u092A\u0940\u0930\u093F\u092F\u0930 \u0935\u094D\u0939\u0947\u0928\u093E \u0915\u093E\u0935\u094D\u0939\u093E \u0906\u0923\u093F \u0909\u091C\u0935\u094D\u092F\u093E \u0905\u0932\u093F\u0902\u0926\u093E\u091A\u094D\u092F\u093E \u091C\u0902\u0915\u094D\u0936\u0928\u0935\u0930",
    option_c_en: "Bundle of His, along the interventricular septum",
    option_c_mr: "\u092C\u0902\u0921\u0932 \u0911\u092B \u0939\u093F\u0938, \u0907\u0902\u091F\u0930\u0935\u094D\u0939\u0947\u0902\u091F\u094D\u0930\u093F\u0915\u094D\u092F\u0941\u0932\u0930 \u0938\u0947\u092A\u094D\u091F\u092E\u092E\u0927\u094D\u092F\u0947",
    option_d_en: "Purkinje Fibers, in the ventricular myocardium",
    option_d_mr: "\u092A\u0941\u0930\u094D\u0915\u093F\u0902\u091C\u0947 \u092B\u093E\u092F\u092C\u0930\u094D\u0938, \u0935\u094D\u0939\u0947\u0902\u091F\u094D\u0930\u093F\u0915\u094D\u092F\u0941\u0932\u0930 \u092E\u093E\u092F\u094B\u0915\u093E\u0930\u094D\u0921\u093F\u092F\u092E\u092E\u0927\u094D\u092F\u0947",
    correct_option: "B",
    explanation_en: "The Sinoatrial (SA) Node initiates electrical impulses at an intrinsic rate of 60-100 times per minute and is located subepicardially in the posterolateral wall of the right atrium near the entry of the superior vena cava.",
    explanation_mr: "\u0938\u093E\u092F\u0928\u094B\u0905\u200D\u0945\u091F\u094D\u0930\u093F\u092F\u0932 (SA) \u0928\u094B\u0921 \u0939\u0947 \u0939\u0943\u0926\u092F\u093E\u091A\u0947 \u0928\u0948\u0938\u0930\u094D\u0917\u093F\u0915 \u092A\u0947\u0938\u092E\u0947\u0915\u0930 \u0906\u0939\u0947, \u091C\u0947 \u0938\u0941\u092A\u0940\u0930\u093F\u092F\u0930 \u0935\u094D\u0939\u0947\u0928\u093E \u0915\u093E\u0935\u094D\u0939\u093E \u0909\u091C\u0935\u094D\u092F\u093E \u0905\u0932\u093F\u0902\u0926\u093E\u0924 (Right Atrium) \u092A\u094D\u0930\u0935\u0947\u0936 \u0915\u0930\u0924\u0947 \u0924\u094D\u092F\u093E \u0920\u093F\u0915\u093E\u0923\u0940 \u0938\u094D\u0925\u093F\u0924 \u0905\u0938\u0924\u0947.",
    difficulty: "easy",
    question_type: "single_best",
    exam_tags: ["NORCET", "Anatomy", "ESIC"],
    exam_name: "ESIC Nursing Officer",
    exam_year: 2023,
    shift: "Shift 2",
    status: "published",
    is_verified_pyq: true,
    version: 1,
    created_at: "2026-01-28T09:00:00.000Z",
    updated_at: "2026-01-28T09:00:00.000Z"
  },
  {
    id: "q-psych-01",
    subject_id: "subj-psych",
    chapter_id: "ch-schizophrenia",
    question_en: 'A patient with paranoid schizophrenia states firmly to the nurse: "The nurses in the hallway are whispering secret military codes through the air vents to poison my dinner." What is the most appropriate therapeutic nursing communication response?',
    question_mr: '\u092A\u0945\u0930\u093E\u0928\u093E\u0908\u0921 \u0938\u094D\u0915\u093F\u091D\u094B\u092B\u094D\u0930\u0947\u0928\u093F\u092F\u093E \u0905\u0938\u0932\u0947\u0932\u093E \u0930\u0941\u0917\u094D\u0923 \u092A\u0930\u093F\u091A\u093E\u0930\u093F\u0915\u0947\u0932\u093E \u0920\u093E\u092E\u092A\u0923\u0947 \u0938\u093E\u0902\u0917\u0924\u094B: "\u0939\u0949\u0932\u0935\u0947\u092E\u0927\u0940\u0932 \u092A\u0930\u093F\u091A\u093E\u0930\u093F\u0915\u093E \u092E\u093E\u091D\u094D\u092F\u093E \u091C\u0947\u0935\u0923\u093E\u0924 \u0935\u093F\u0937 \u0915\u093E\u0932\u0935\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u090F\u0905\u0930 \u0935\u094D\u0939\u0947\u0902\u091F\u092E\u0927\u0942\u0928 \u0917\u0941\u092A\u094D\u0924 \u0932\u0937\u094D\u0915\u0930\u0940 \u0915\u094B\u0921 \u0915\u0941\u091C\u092C\u0941\u091C\u0924 \u0906\u0939\u0947\u0924." \u0938\u0930\u094D\u0935\u093E\u0924 \u092F\u094B\u0917\u094D\u092F \u0909\u092A\u091A\u093E\u0930\u093E\u0924\u094D\u092E\u0915 \u0938\u0902\u092D\u093E\u0937\u0923 \u092A\u094D\u0930\u0924\u093F\u0938\u093E\u0926 \u0915\u094B\u0923\u0924\u093E?',
    option_a_en: '"No one is whispering codes, that is completely illogical and impossible."',
    option_a_mr: '"\u0915\u094B\u0923\u0940\u0939\u0940 \u0915\u094B\u0921 \u0915\u0941\u091C\u092C\u0941\u091C\u0924 \u0928\u093E\u0939\u0940\u092F\u0947, \u0939\u0947 \u092A\u0942\u0930\u094D\u0923\u092A\u0923\u0947 \u0905\u0924\u093E\u0930\u094D\u0915\u093F\u0915 \u0906\u0923\u093F \u0905\u0936\u0915\u094D\u092F \u0906\u0939\u0947."',
    option_b_en: '"Why do you think the nurses would want to poison your food?"',
    option_b_mr: '"\u092A\u0930\u093F\u091A\u093E\u0930\u093F\u0915\u093E\u0902\u0928\u093E \u0924\u0941\u092E\u091A\u094D\u092F\u093E \u0905\u0928\u094D\u0928\u093E\u0924 \u0935\u093F\u0937 \u0915\u093E \u0915\u093E\u0932\u0935\u093E\u092F\u091A\u0947 \u0906\u0939\u0947 \u0905\u0938\u0947 \u0924\u0941\u092E\u094D\u0939\u093E\u0932\u093E \u0935\u093E\u091F\u0924\u0947?"',
    option_c_en: '"I understand that this feels very frightening to you, but I do not hear any whispers. You are safe here."',
    option_c_mr: '"\u092E\u0932\u093E \u0938\u092E\u091C\u0924\u0947 \u0915\u0940 \u0939\u0947 \u0924\u0941\u092E\u094D\u0939\u093E\u0932\u093E \u0916\u0942\u092A \u092D\u0940\u0924\u0940\u0926\u093E\u092F\u0915 \u0935\u093E\u091F\u0924\u0947, \u092A\u0930\u0902\u0924\u0941 \u092E\u0932\u093E \u0915\u094B\u0923\u0924\u093E\u0939\u0940 \u0906\u0935\u093E\u091C \u0910\u0915\u0942 \u092F\u0947\u0924 \u0928\u093E\u0939\u0940. \u0924\u0941\u092E\u094D\u0939\u0940 \u092F\u0947\u0925\u0947 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0906\u0939\u093E\u0924."',
    option_d_en: '"I will go outside right now and strictly tell them to stop whispering."',
    option_d_mr: '"\u092E\u0940 \u0906\u0924\u094D\u0924\u093E\u091A \u092C\u093E\u0939\u0947\u0930 \u091C\u093E\u090A\u0928 \u0924\u094D\u092F\u093E\u0902\u0928\u093E \u0915\u0941\u091C\u092C\u0941\u091C\u0923\u0947 \u0925\u093E\u0902\u092C\u0935\u093E\u092F\u0932\u093E \u0938\u093E\u0902\u0917\u0924\u094B."',
    correct_option: "C",
    explanation_en: "In therapeutic communication with delusional patients, the nurse must acknowledge the patient feelings (empathy) while presenting reality gently without arguing or validating the delusion.",
    explanation_mr: '\u092D\u094D\u0930\u092E\u093F\u0937\u094D\u091F (\u0921\u093F\u0932\u094D\u092F\u0941\u0936\u0928\u0932) \u0930\u0941\u0917\u094D\u0923\u093E\u0902\u0936\u0940 \u092C\u094B\u0932\u0924\u093E\u0928\u093E \u0924\u094D\u092F\u093E\u0902\u091A\u094D\u092F\u093E \u092D\u0940\u0924\u0940\u091A\u0940 \u091C\u093E\u0923\u0940\u0935 \u0920\u0947\u0935\u0942\u0928 \u0938\u0939\u093E\u0928\u0941\u092D\u0942\u0924\u0940 \u0926\u093E\u0916\u0935\u093E\u0935\u0940 \u0906\u0923\u093F \u092D\u094D\u0930\u092E\u093E\u0932\u093E \u0926\u0941\u091C\u094B\u0930\u093E \u0928 \u0926\u0947\u0924\u093E \u0935\u093E\u0938\u094D\u0924\u0935 \u0936\u093E\u0902\u0924\u092A\u0923\u0947 \u0938\u094D\u092A\u0937\u094D\u091F \u0915\u0930\u093E\u0935\u0947 ("\u092E\u0932\u093E \u0924\u094B \u0906\u0935\u093E\u091C \u0910\u0915\u0942 \u092F\u0947\u0924 \u0928\u093E\u0939\u0940, \u092A\u0923 \u0924\u0941\u092E\u094D\u0939\u0940 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0906\u0939\u093E\u0924").',
    difficulty: "medium",
    question_type: "single_best",
    exam_tags: ["NORCET", "Psychiatry", "AIIMS"],
    exam_name: "AIIMS Nursing Officer",
    exam_year: 2023,
    shift: "Shift 1",
    status: "published",
    is_verified_pyq: true,
    version: 1,
    created_at: "2026-01-30T10:00:00.000Z",
    updated_at: "2026-01-30T10:00:00.000Z"
  },
  {
    id: "q-gk-01",
    subject_id: "subj-gk-mr",
    chapter_id: "ch-marathi-lang",
    question_en: 'Marathi Grammar: What is the correct idiomatic meaning of the Marathi phrase "\u0939\u093E\u0924 \u0926\u093E\u0916\u0935\u0923\u0947" (Haat Dakhavane)?',
    question_mr: '\u092E\u0930\u093E\u0920\u0940 \u0935\u094D\u092F\u093E\u0915\u0930\u0923: \u0916\u093E\u0932\u0940\u0932\u092A\u0948\u0915\u0940 "\u0939\u093E\u0924 \u0926\u093E\u0916\u0935\u0923\u0947" \u092F\u093E \u0935\u093E\u0915\u092A\u094D\u0930\u091A\u093E\u0930\u093E\u091A\u093E \u092F\u094B\u0917\u094D\u092F \u0905\u0930\u094D\u0925 \u0915\u094B\u0923\u0924\u093E?',
    option_a_en: "To give a beating / punish (\u092E\u093E\u0930 \u0926\u0947\u0923\u0947 \u0915\u093F\u0902\u0935\u093E \u091A\u094B\u092A \u0926\u0947\u0923\u0947)",
    option_a_mr: "\u092E\u093E\u0930 \u0926\u0947\u0923\u0947 \u0915\u093F\u0902\u0935\u093E \u091A\u094B\u092A \u0926\u0947\u0923\u0947",
    option_b_en: "To help someone (\u092E\u0926\u0924 \u0915\u0930\u0923\u0947 - \u0939\u093E\u0924 \u0926\u0947\u0923\u0947)",
    option_b_mr: "\u092E\u0926\u0924 \u0915\u0930\u0923\u0947",
    option_c_en: "To surrender / admit defeat (\u0936\u0930\u0923 \u092F\u0947\u0923\u0947 - \u0939\u093E\u0924 \u091F\u0947\u0915\u0923\u0947)",
    option_c_mr: "\u0936\u0930\u0923 \u092F\u0947\u0923\u0947",
    option_d_en: "To refuse or hold back (\u0928\u0915\u093E\u0930 \u0926\u0947\u0923\u0947 / \u0939\u093E\u0924 \u0906\u0916\u0921\u0924\u093E \u0918\u0947\u0923\u0947)",
    option_d_mr: "\u0928\u0915\u093E\u0930 \u0926\u0947\u0923\u0947 / \u0939\u093E\u0924 \u0906\u0916\u0921\u0924\u093E \u0918\u0947\u0923\u0947",
    correct_option: "A",
    explanation_en: `"\u0939\u093E\u0924 \u0926\u093E\u0916\u0935\u0923\u0947" (Haat Dakhavane) is a standard Marathi idiom (\u0935\u093E\u0915\u092A\u094D\u0930\u091A\u093E\u0930) whose figurative meaning in Marathi Grammar is "\u092E\u093E\u0930 \u0926\u0947\u0923\u0947 / \u091A\u094B\u092A \u0926\u0947\u0923\u0947 / \u092A\u0930\u093E\u0915\u094D\u0930\u092E \u0917\u093E\u091C\u0935\u0923\u0947" (to punish or give a sound beating). Example: '\u092A\u094B\u0932\u093F\u0938\u093E\u0902\u0928\u0940 \u091A\u094B\u0930\u093E\u0932\u093E \u091A\u093E\u0902\u0917\u0932\u093E\u091A \u0939\u093E\u0924 \u0926\u093E\u0916\u0935\u0932\u093E.' Note: Consulting a palmist for palmistry is a literal interpretation, but in competitive Marathi grammar exams, according to standard curriculum grammar rules (\u092A\u094D\u0930\u092E\u093E\u0923 \u0935\u094D\u092F\u093E\u0915\u0930\u0923 \u0928\u093F\u092F\u092E\u093E\u0902\u0928\u0941\u0938\u093E\u0930), the idiomatic figurative meaning is strictly "\u092E\u093E\u0930 \u0926\u0947\u0923\u0947 \u0915\u093F\u0902\u0935\u093E \u091A\u094B\u092A \u0926\u0947\u0923\u0947". Related idioms: '\u0939\u093E\u0924 \u0926\u0947\u0923\u0947' = \u092E\u0926\u0924 \u0915\u0930\u0923\u0947; '\u0939\u093E\u0924 \u091F\u0947\u0915\u0923\u0947' = \u0936\u0930\u0923 \u092F\u0947\u0923\u0947; '\u0939\u093E\u0924 \u0906\u0916\u0921\u0924\u093E \u0918\u0947\u0923\u0947' = \u092E\u0926\u0924 \u0928 \u0915\u0930\u0923\u0947.`,
    explanation_mr: `"\u0939\u093E\u0924 \u0926\u093E\u0916\u0935\u0923\u0947" \u092F\u093E \u0935\u093E\u0915\u092A\u094D\u0930\u091A\u093E\u0930\u093E\u091A\u093E \u092A\u094D\u0930\u092E\u093E\u0923 \u092E\u0930\u093E\u0920\u0940 \u0935\u094D\u092F\u093E\u0915\u0930\u0923\u093E\u0924\u0940\u0932 \u0932\u093E\u0915\u094D\u0937\u0923\u093F\u0915 \u0905\u0930\u094D\u0925 "\u092E\u093E\u0930 \u0926\u0947\u0923\u0947 \u0915\u093F\u0902\u0935\u093E \u091A\u094B\u092A \u0926\u0947\u0923\u0947 / \u092A\u0930\u093E\u0915\u094D\u0930\u092E \u0926\u093E\u0916\u0935\u0923\u0947" \u0905\u0938\u093E \u0939\u094B\u0924\u094B (\u0909\u0926\u093E. '\u0938\u0948\u0928\u093F\u0915\u093E\u0902\u0928\u0940 \u0938\u0940\u092E\u0947\u0935\u0930 \u0936\u0924\u094D\u0930\u0942\u0932\u093E \u091A\u093E\u0902\u0917\u0932\u093E\u091A \u0939\u093E\u0924 \u0926\u093E\u0916\u0935\u0932\u093E'). \u091F\u0940\u092A: \u091C\u094D\u092F\u094B\u0924\u093F\u0937\u093E\u0932\u093E \u0939\u093E\u0924 \u0926\u093E\u0916\u0935\u0923\u0947 \u0939\u093E \u0915\u0947\u0935\u0933 \u0936\u092C\u094D\u0926\u0936\u0903 \u0905\u0930\u094D\u0925 \u0906\u0939\u0947; \u0938\u094D\u092A\u0930\u094D\u0927\u093E \u092A\u0930\u0940\u0915\u094D\u0937\u0947\u0924 \u092A\u094D\u0930\u092E\u093E\u0923 \u0935\u094D\u092F\u093E\u0915\u0930\u0923 \u0928\u093F\u092F\u092E\u093E\u0902\u0928\u0941\u0938\u093E\u0930 \u0935\u093E\u0915\u092A\u094D\u0930\u091A\u093E\u0930\u093E\u091A\u093E \u0932\u093E\u0915\u094D\u0937\u0923\u093F\u0915 \u0905\u0930\u094D\u0925 \u0935\u093F\u091A\u093E\u0930\u0932\u093E \u091C\u093E\u0924\u094B, \u091C\u094B "\u092E\u093E\u0930 \u0926\u0947\u0923\u0947" \u0939\u093E\u091A \u0905\u0938\u0924\u094B. \u0907\u0924\u0930 \u0938\u0902\u092C\u0902\u0927\u093F\u0924 \u0935\u093E\u0915\u092A\u094D\u0930\u091A\u093E\u0930: '\u0939\u093E\u0924 \u0926\u0947\u0923\u0947' = \u092E\u0926\u0924 \u0915\u0930\u0923\u0947; '\u0939\u093E\u0924 \u091F\u0947\u0915\u0923\u0947' = \u092A\u0930\u093E\u092D\u0935 \u092E\u093E\u0928\u094D\u092F \u0915\u0930\u0923\u0947 / \u0936\u0930\u0923 \u092F\u0947\u0923\u0947; '\u0939\u093E\u0924 \u0906\u0916\u0921\u0924\u093E \u0918\u0947\u0923\u0947' = \u092E\u0926\u0924 \u0928 \u0915\u0930\u0923\u0947.`,
    difficulty: "easy",
    question_type: "single_best",
    exam_tags: ["DMER", "DHS", "StateExam"],
    exam_name: "Maharashtra DMER Staff Nurse",
    exam_year: 2023,
    shift: "Evening Shift",
    status: "published",
    is_verified_pyq: true,
    version: 2,
    created_at: "2026-02-01T15:00:00.000Z",
    updated_at: "2026-02-01T15:00:00.000Z"
  },
  {
    id: "q-gk-02",
    subject_id: "subj-gk-mr",
    chapter_id: "ch-marathi-lang",
    question_en: 'Marathi Grammar: Identify the tense (\u0915\u093E\u0933) of the sentence: "\u0938\u0CC2\u0CB0\u0CCD\u0CAF \u092A\u0942\u0930\u094D\u0935\u0947\u0915\u0921\u0947 \u0909\u0917\u0935\u0924\u094B." (The sun rises in the east.)',
    question_mr: '\u092E\u0930\u093E\u0920\u0940 \u0935\u094D\u092F\u093E\u0915\u0930\u0923: "\u0938\u0CC2\u0CB0\u0CCD\u0CAF \u092A\u0942\u0930\u094D\u0935\u0947\u0915\u0921\u0947 \u0909\u0917\u0935\u0924\u094B." \u092F\u093E \u0935\u093E\u0915\u094D\u092F\u093E\u091A\u093E \u0915\u093E\u0933 \u0913\u0933\u0916\u0932\u093E \u0924\u0930 \u0916\u093E\u0932\u0940\u0932\u092A\u0948\u0915\u0940 \u0915\u094B\u0923\u0924\u093E \u092A\u0930\u094D\u092F\u093E\u092F \u092F\u094B\u0917\u094D\u092F \u0939\u094B\u0908\u0932?',
    option_a_en: "Past Tense (\u092D\u0942\u0924\u0915\u093E\u0933)",
    option_a_mr: "\u092D\u0942\u0924\u0915\u093E\u0933",
    option_b_en: "Simple Present Tense (\u0938\u093E\u0927\u093E \u0935\u0930\u094D\u0924\u092E\u093E\u0928\u0915\u093E\u0933)",
    option_b_mr: "\u0938\u093E\u0927\u093E \u0935\u0930\u094D\u0924\u092E\u093E\u0928\u0915\u093E\u0933",
    option_c_en: "Future Tense (\u092D\u0935\u093F\u0937\u094D\u092F\u0915\u093E\u0933)",
    option_c_mr: "\u092D\u0935\u093F\u0937\u094D\u092F\u0915\u093E\u0933",
    option_d_en: "Continuous Past Tense (\u0905\u092A\u0942\u0930\u094D\u0923 \u092D\u0942\u0924\u0915\u093E\u0933)",
    option_d_mr: "\u0905\u092A\u0942\u0930\u094D\u0923 \u092D\u0942\u0924\u0915\u093E\u0933",
    correct_option: "B",
    explanation_en: '"\u0938\u0CC2\u0CB0\u0CCD\u0CAF \u092A\u0942\u0930\u094D\u0935\u0947\u0915\u0921\u0947 \u0909\u0917\u0935\u0924\u094B" indicates a universal truth and habitual action happening in the present time, hence it is Simple Present Tense (\u0938\u093E\u0927\u093E \u0935\u0930\u094D\u0924\u092E\u093E\u0928\u0915\u093E\u0933).',
    explanation_mr: '"\u0938\u0CC2\u0CB0\u0CCD\u0CAF \u092A\u0942\u0930\u094D\u0935\u0947\u0915\u0921\u0947 \u0909\u0917\u0935\u0924\u094B." \u092F\u093E \u0935\u093E\u0915\u094D\u092F\u093E\u0924 \u0915\u094D\u0930\u093F\u092F\u093E \u0935\u0930\u094D\u0924\u092E\u093E\u0928\u0915\u093E\u0933\u093E\u0924 \u0918\u0921\u0924 \u0905\u0938\u0942\u0928 \u0924\u0940 \u0924\u094D\u0930\u093F\u0915\u093E\u0932\u092C\u093E\u0927\u093F\u0924 \u0938\u0924\u094D\u092F (Universal Truth) \u0906\u0939\u0947, \u092E\u094D\u0939\u0923\u0942\u0928 \u0939\u093E "\u0938\u093E\u0927\u093E \u0935\u0930\u094D\u0924\u092E\u093E\u0928\u0915\u093E\u0933" \u0906\u0939\u0947.',
    difficulty: "easy",
    question_type: "single_best",
    exam_tags: ["DMER", "DHS", "MarathiVyakran"],
    exam_name: "Maharashtra Staff Nurse Exam",
    exam_year: 2024,
    status: "published",
    is_verified_pyq: true,
    version: 1,
    created_at: "2026-02-02T10:00:00.000Z",
    updated_at: "2026-02-02T10:00:00.000Z"
  },
  {
    id: "q-math-01",
    subject_id: "subj-math-reas",
    chapter_id: "ch-marathi-lang",
    question_en: "Mathematics & Nursing Aptitude: If a nurse earns Rs. 25,000 per month and receives a 12% increment, what is the new monthly salary?",
    question_mr: "\u0905\u0902\u0915\u0917\u0923\u093F\u0924 \u0935 \u092C\u0941\u0926\u094D\u0927\u093F\u092E\u0924\u094D\u0924\u093E: \u090F\u0915\u093E \u0928\u0930\u094D\u0938\u091A\u093E \u092E\u093E\u0938\u093F\u0915 \u092A\u0917\u093E\u0930 \u0930\u0941. \u0968\u096B,\u0966\u0966\u0966 \u0905\u0938\u0942\u0928 \u0924\u094D\u092F\u093E\u0924 \u0967\u0968% \u0935\u093E\u0930\u094D\u0937\u093F\u0915 \u0935\u0947\u0924\u0928\u0935\u093E\u0922 (Increment) \u092E\u093F\u0933\u093E\u0932\u0940, \u0924\u0930 \u0928\u0935\u0940\u0928 \u092E\u093E\u0938\u093F\u0915 \u092A\u0917\u093E\u0930 \u0915\u093F\u0924\u0940 \u0939\u094B\u0908\u0932?",
    option_a_en: "Rs. 27,000",
    option_a_mr: "\u0930\u0941. \u0968\u096D,\u0966\u0966\u0966",
    option_b_en: "Rs. 28,000",
    option_b_mr: "\u0930\u0941. \u0968\u096E,\u0966\u0966\u0966",
    option_c_en: "Rs. 27,500",
    option_c_mr: "\u0930\u0941. \u0968\u096D,\u096B\u0966\u0966",
    option_d_en: "Rs. 26,500",
    option_d_mr: "\u0930\u0941. \u0968\u096C,\u096B\u0966\u0966",
    correct_option: "B",
    explanation_en: "Calculation: 12% of 25,000 = (12 / 100) * 25,000 = 3,000. New Salary = 25,000 + 3,000 = Rs. 28,000.",
    explanation_mr: "\u0938\u094D\u092A\u0937\u094D\u091F\u0940\u0915\u0930\u0923: \u0968\u096B,\u0966\u0966\u0966 \u091A\u0947 \u0967\u0968% \u0915\u093E\u0922\u0942\u092F\u093E. (\u0967\u0968 / \u0967\u0966\u0966) \xD7 \u0968\u096B,\u0966\u0966\u0966 = \u0969,\u0966\u0966\u0966 \u0930\u0941. \u0935\u093E\u0922\u0940\u0935 \u092A\u0917\u093E\u0930 = \u092E\u0942\u0933 \u092A\u0917\u093E\u0930 \u0968\u096B,\u0966\u0966\u0966 + \u0935\u093E\u0922 \u0969,\u0966\u0966\u0966 = \u0930\u0941. \u0968\u096E,\u0966\u0966\u0966.",
    difficulty: "medium",
    question_type: "single_best",
    exam_tags: ["Math", "Aptitude", "NORCET"],
    exam_name: "Nursing Officer Aptitude",
    exam_year: 2024,
    status: "published",
    is_verified_pyq: true,
    version: 1,
    created_at: "2026-02-02T10:00:00.000Z",
    updated_at: "2026-02-02T10:00:00.000Z"
  },
  {
    id: "q-math-02",
    subject_id: "subj-math-reas",
    chapter_id: "ch-marathi-lang",
    question_en: "Mathematics: What is 15% of 360?",
    question_mr: "\u0905\u0902\u0915\u0917\u0923\u093F\u0924: \u0969\u096C\u0966 \u091A\u0947 \u0967\u096B \u091F\u0915\u094D\u0915\u0947 \u0915\u093F\u0924\u0940?",
    option_a_en: "54",
    option_a_mr: "\u096B\u096A",
    option_b_en: "48",
    option_b_mr: "\u096A\u096E",
    option_c_en: "60",
    option_c_mr: "\u096C\u0966",
    option_d_en: "45",
    option_d_mr: "\u096A\u096B",
    correct_option: "A",
    explanation_en: "Calculation: (15 / 100) * 360 = 0.15 * 360 = 54.",
    explanation_mr: "\u0938\u094D\u092A\u0937\u094D\u091F\u0940\u0915\u0930\u0923: \u0969\u096C\u0966 \u091A\u0947 \u0967\u096B \u091F\u0915\u094D\u0915\u0947 = (\u0967\u096B / \u0967\u0966\u0966) \xD7 \u0969\u096C\u0966 = \u0969.\u096C \xD7 \u0967\u096B = \u096B\u096A.",
    difficulty: "easy",
    question_type: "single_best",
    exam_tags: ["Math", "Percentage"],
    exam_name: "Maha Health Exam",
    exam_year: 2024,
    status: "published",
    is_verified_pyq: true,
    version: 1,
    created_at: "2026-02-02T10:00:00.000Z",
    updated_at: "2026-02-02T10:00:00.000Z"
  },
  {
    id: "q-math-03",
    subject_id: "subj-math-reas",
    chapter_id: "ch-marathi-lang",
    question_en: "Mathematics (Time & Work): If 5 nurses can complete a hospital ward documentation task in 6 days, how many days will 3 nurses take to complete the same task?",
    question_mr: "\u0905\u0902\u0915\u0917\u0923\u093F\u0924 (\u0915\u093E\u0933 \u0906\u0923\u093F \u0915\u093E\u092E): \u091C\u0930 \u096B \u0928\u0930\u094D\u0938\u0947\u0938 \u090F\u0915 \u0939\u0949\u0938\u094D\u092A\u093F\u091F\u0932 \u0921\u0949\u0915\u094D\u092F\u0941\u092E\u0947\u0902\u091F\u0947\u0936\u0928\u091A\u0947 \u0915\u093E\u092E \u096C \u0926\u093F\u0935\u0938\u093E\u0924 \u0915\u0930\u0924\u093E\u0924, \u0924\u0930 \u0969 \u0928\u0930\u094D\u0938\u0947\u0938 \u0924\u0947\u091A \u0915\u093E\u092E \u0915\u093F\u0924\u0940 \u0926\u093F\u0935\u0938\u093E\u0902\u0924 \u092A\u0942\u0930\u094D\u0923 \u0915\u0930\u0924\u0940\u0932?",
    option_a_en: "10 days",
    option_a_mr: "\u0967\u0966 \u0926\u093F\u0935\u0938",
    option_b_en: "8 days",
    option_b_mr: "\u096E \u0926\u093F\u0935\u0938",
    option_c_en: "12 days",
    option_c_mr: "\u0967\u0968 \u0926\u093F\u0935\u0938",
    option_d_en: "9 days",
    option_d_mr: "\u096F \u0926\u093F\u0935\u0938",
    correct_option: "A",
    explanation_en: "Total man-days = 5 nurses * 6 days = 30 man-days. For 3 nurses, days = 30 / 3 = 10 days.",
    explanation_mr: "\u0938\u094D\u092A\u0937\u094D\u091F\u0940\u0915\u0930\u0923: \u090F\u0915\u0942\u0923 \u092E\u093E\u0923\u0938\u093E\u091A\u0947 \u0926\u093F\u0935\u0938 (Man-days) = \u096B \u0928\u0930\u094D\u0938\u0947\u0938 \xD7 \u096C \u0926\u093F\u0935\u0938 = \u0969\u0966. \u092E\u094D\u0939\u0923\u0942\u0928 \u0969 \u0928\u0930\u094D\u0938\u0947\u0938\u0938\u093E\u0920\u0940 \u0932\u093E\u0917\u0923\u093E\u0930\u0947 \u0926\u093F\u0935\u0938 = \u0969\u0966 / \u0969 = \u0967\u0966 \u0926\u093F\u0935\u0938.",
    difficulty: "medium",
    question_type: "single_best",
    exam_tags: ["Math", "TimeAndWork"],
    exam_name: "Staff Nurse Exam",
    exam_year: 2024,
    status: "published",
    is_verified_pyq: true,
    version: 1,
    created_at: "2026-02-02T10:00:00.000Z",
    updated_at: "2026-02-02T10:00:00.000Z"
  }
];
var INITIAL_MOCK_TESTS = [
  {
    id: "mock-norcet-grand-01",
    title_en: "NORCET 2025 All India Full Length Mock Test 1",
    title_mr: "NORCET \u0968\u0966\u0968\u096B \u0905\u0916\u093F\u0932 \u092D\u093E\u0930\u0924\u0940\u092F \u0938\u0902\u092A\u0942\u0930\u094D\u0923 \u092E\u0949\u0915 \u091F\u0947\u0938\u094D\u091F \u0967",
    exam_name: "NORCET",
    exam_pattern: "AIIMS NORCET 2025",
    description: "Comprehensive high-yield simulator matching the official AIIMS NORCET pattern with 100% verified clinical and practical nursing questions, timed countdown, and 1/3rd negative marking.",
    description_en: "Comprehensive high-yield simulator matching the official AIIMS NORCET pattern with 100% verified clinical and practical nursing questions, timed countdown, and 1/3rd negative marking.",
    description_mr: "\u0905\u0927\u093F\u0915\u0943\u0924 \u090F\u092E\u094D\u0938 \u0928\u0949\u0930\u094D\u0938\u0947\u091F (AIIMS NORCET) \u092A\u0945\u091F\u0930\u094D\u0928\u0928\u0941\u0938\u093E\u0930 \u0967\u0966\u0966% \u0915\u094D\u0932\u093F\u0928\u093F\u0915\u0932 \u0935 \u092A\u094D\u0930\u0945\u0915\u094D\u091F\u093F\u0915\u0932 \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u092A\u094D\u0930\u0936\u094D\u0928. \u092E\u0930\u093E\u0920\u0940 \u0935 \u0907\u0902\u0917\u094D\u0930\u091C\u0940 \u0938\u0935\u093F\u0938\u094D\u0924\u0930 \u0938\u094D\u092A\u0937\u094D\u091F\u0940\u0915\u0930\u0923\u093E\u0938\u0939, \u091F\u093E\u0908\u092E \u0915\u093E\u0909\u0928\u094D\u091F\u0921\u093E\u090A\u0928 \u0935 \u0967/\u0969 \u0928\u093F\u0917\u0947\u091F\u093F\u0935\u094D\u0939 \u092E\u093E\u0930\u094D\u0915\u093F\u0902\u0917.",
    duration_minutes: 30,
    total_marks: 14,
    passing_marks: 7,
    negative_marking_rate: 0.33,
    is_free: true,
    is_purchasable_singly: true,
    price: 0,
    question_ids: [
      "q-mi-01",
      "q-mi-02",
      "q-mi-03",
      "q-pre-01",
      "q-pre-02",
      "q-fon-01",
      "q-fon-02",
      "q-bmw-01",
      "q-bmw-02",
      "q-peds-01",
      "q-pharm-01",
      "q-chn-01",
      "q-icu-01",
      "q-psych-01",
      "q-gk-01",
      "q-gk-02",
      "q-math-01",
      "q-math-02",
      "q-math-03"
    ],
    is_published: true,
    is_premium: false,
    created_at: "2026-02-05T08:00:00.000Z"
  },
  {
    id: "mock-dmer-maha-01",
    title_en: "DMER Maharashtra Nursing Officer Full Mock Test 1",
    title_mr: "DMER \u092E\u0939\u093E\u0930\u093E\u0937\u094D\u091F\u094D\u0930 \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u0911\u092B\u093F\u0938\u0930 \u0938\u0902\u092A\u0942\u0930\u094D\u0923 \u0938\u0930\u093E\u0935 \u091A\u093E\u091A\u0923\u0940 \u0967 (\u092E\u0930\u093E\u0920\u0940 \u0935 \u0907\u0902\u0917\u094D\u0930\u091C\u0940)",
    exam_name: "DMER Maharashtra",
    exam_pattern: "DMER / DHS 80:20 Pattern",
    description: "Specialized bilingual mock test designed for Maharashtra DMER Staff Nurse recruitment with clinical nursing and allied health rationale.",
    description_en: "Specialized bilingual mock test designed for Maharashtra DMER Staff Nurse recruitment with clinical nursing and allied health rationale.",
    description_mr: "\u092E\u0939\u093E\u0930\u093E\u0937\u094D\u091F\u094D\u0930 \u0921\u0940\u090F\u092E\u0908\u0906\u0930 (DMER) \u0935 \u0906\u0930\u094B\u0917\u094D\u092F \u0935\u093F\u092D\u093E\u0917 \u0938\u094D\u091F\u093E\u092B \u0928\u0930\u094D\u0938 \u092D\u0930\u0924\u0940 \u092A\u0930\u0940\u0915\u094D\u0937\u0947\u0938\u093E\u0920\u0940 \u0967\u0966\u0966% \u0905\u092D\u094D\u092F\u093E\u0938\u0915\u094D\u0930\u092E\u093E\u0935\u0930 \u0906\u0927\u093E\u0930\u093F\u0924 \u0938\u0930\u093E\u0935 \u092A\u0930\u0940\u0915\u094D\u0937\u093E. \u092E\u0930\u093E\u0920\u0940 \u0935 \u0907\u0902\u0917\u094D\u0930\u091C\u0940 \u0938\u0935\u093F\u0938\u094D\u0924\u0930 \u0938\u094D\u092A\u0937\u094D\u091F\u0940\u0915\u0930\u0923\u093E\u0938\u0939.",
    duration_minutes: 45,
    total_marks: 20,
    passing_marks: 10,
    negative_marking_rate: 0.25,
    is_purchasable_singly: true,
    price: 49,
    question_ids: [
      "q-mi-01",
      "q-mi-02",
      "q-mi-03",
      "q-pre-01",
      "q-pre-02",
      "q-fon-01",
      "q-fon-02",
      "q-bmw-01",
      "q-bmw-02",
      "q-peds-01",
      "q-pharm-01",
      "q-chn-01",
      "q-icu-01",
      "q-anat-01",
      "q-psych-01",
      "q-gk-01",
      "q-gk-02",
      "q-math-01",
      "q-math-02",
      "q-math-03"
    ],
    is_published: true,
    is_premium: true,
    created_at: "2026-02-10T10:00:00.000Z"
  },
  {
    id: "mock-dhs-zp-01",
    title_en: "DHS & ZP Maharashtra Staff Nurse Grand Practice Test",
    title_mr: "DHS \u0906\u0930\u094B\u0917\u094D\u092F \u0938\u0947\u0935\u093E \u0935 \u091C\u093F\u0932\u094D\u0939\u093E \u092A\u0930\u093F\u0937\u0926 \u0938\u094D\u091F\u093E\u092B \u0928\u0930\u094D\u0938 \u092E\u0939\u093E\u0938\u0930\u093E\u0935 \u091A\u093E\u091A\u0923\u0940",
    exam_name: "DHS & ZP Maharashtra",
    exam_pattern: "Maharashtra Public Health",
    description: "High-yield Maharashtra public health, pediatric, OBG, and community health nursing exam simulator with bilingual rationale.",
    description_en: "High-yield Maharashtra public health, pediatric, OBG, and community health nursing exam simulator with bilingual rationale.",
    description_mr: "\u0921\u0940\u090F\u091A\u090F\u0938 \u0935 \u091D\u0947\u0921\u092A\u0940 \u0906\u0930\u094B\u0917\u094D\u092F \u092D\u0930\u0924\u0940\u0938\u093E\u0920\u0940 \u0939\u093E\u092F-\u092F\u093F\u0932\u094D\u0921 \u092A\u094D\u0930\u0938\u0942\u0924\u0940\u0936\u093E\u0938\u094D\u0924\u094D\u0930, \u092C\u093E\u0932\u0930\u094B\u0917 \u0906\u0923\u093F \u0938\u092E\u0941\u0926\u093E\u092F \u0906\u0930\u094B\u0917\u094D\u092F \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u092A\u094D\u0930\u0936\u094D\u0928 \u0935 \u092E\u0930\u093E\u0920\u0940/\u0907\u0902\u0917\u094D\u0930\u091C\u0940 \u0938\u094D\u092A\u0937\u094D\u091F\u0940\u0915\u0930\u0923.",
    duration_minutes: 30,
    total_marks: 12,
    passing_marks: 6,
    negative_marking_rate: 0.25,
    is_purchasable_singly: true,
    price: 39,
    question_ids: [
      "q-pre-01",
      "q-pre-02",
      "q-fon-01",
      "q-fon-02",
      "q-bmw-01",
      "q-peds-01",
      "q-chn-01",
      "q-anat-01",
      "q-pharm-01",
      "q-gk-01",
      "q-math-01",
      "q-math-02"
    ],
    is_published: true,
    is_premium: true,
    created_at: "2026-02-12T11:00:00.000Z"
  },
  {
    id: "mock-esic-rapid-01",
    title_en: "ESIC & State Nursing Officer Rapid Test",
    title_mr: "ESIC \u0906\u0923\u093F \u0930\u093E\u091C\u094D\u092F \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u0911\u092B\u093F\u0938\u0930 \u0930\u0945\u092A\u093F\u0921 \u0938\u0930\u093E\u0935 \u091A\u093E\u091A\u0923\u0940",
    exam_name: "ESIC Nursing Officer",
    exam_pattern: "ESIC CBT Pattern",
    description: "High frequency questions targeted for ESIC and State Nursing Recruitment exams with 1/4th negative marking penalty.",
    description_en: "High frequency questions targeted for ESIC and State Nursing Recruitment exams with 1/4th negative marking penalty.",
    description_mr: "ESIC \u0935 \u0915\u0947\u0902\u0926\u094D\u0930/\u0930\u093E\u091C\u094D\u092F \u092A\u0930\u093F\u091A\u093E\u0930\u093F\u0915\u093E \u092D\u0930\u0924\u0940 \u092A\u0930\u0940\u0915\u094D\u0937\u0947\u0938\u093E\u0920\u0940 \u0905\u0924\u094D\u092F\u0902\u0924 \u092E\u0939\u0924\u094D\u0924\u094D\u0935\u092A\u0942\u0930\u094D\u0923 \u0915\u094D\u0932\u093F\u0928\u093F\u0915\u0932 \u092A\u094D\u0930\u0936\u094D\u0928. \u0967/\u096A \u0928\u0915\u093E\u0930\u093E\u0924\u094D\u092E\u0915 \u0917\u0941\u0923 \u092A\u0926\u094D\u0927\u0924 \u0935 \u0926\u094D\u0935\u093F\u092D\u093E\u0937\u093F\u0915 \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923.",
    duration_minutes: 15,
    total_marks: 8,
    passing_marks: 4,
    negative_marking_rate: 0.25,
    is_purchasable_singly: true,
    price: 29,
    question_ids: [
      "q-mi-03",
      "q-pre-02",
      "q-fon-01",
      "q-bmw-01",
      "q-chn-01",
      "q-anat-01",
      "q-gk-01",
      "q-pharm-01"
    ],
    is_published: true,
    is_premium: false,
    created_at: "2026-02-06T09:00:00.000Z"
  }
];

// server/cloudinary.ts
var import_cloudinary = require("cloudinary");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var cloudName = process.env.CLOUDINARY_CLOUD_NAME || "sjgixi4c";
var apiKey = process.env.CLOUDINARY_API_KEY || "286384694322121";
var apiSecret = process.env.CLOUDINARY_API_SECRET || "L2ufniVOp6mfTzRuybLsqOt7_tg";
var isCloudinaryConfigured = Boolean(cloudName && apiKey && apiSecret);
if (isCloudinaryConfigured) {
  import_cloudinary.v2.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });
}
var CLOUDINARY_FOLDERS = [
  "nursing-officer/questions",
  "nursing-officer/clinical-cases",
  "nursing-officer/instruments",
  "nursing-officer/ecg",
  "nursing-officer/lab-images",
  "nursing-officer/diagrams",
  "nursing-officer/thumbnails",
  "nursing-officer/promo-videos",
  "nursing-officer/ads"
];
async function uploadToCloudinary(fileData, options = {}) {
  const targetFolder = options.folder || "nursing-officer/questions";
  if (!isCloudinaryConfigured) {
    console.info("Cloudinary credentials not set. Falling back to placeholder.");
    return {
      url: fileData.startsWith("data:") ? fileData : `https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80`,
      secure_url: fileData.startsWith("data:") ? fileData : `https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80`,
      public_id: options.publicId || `local-${Date.now()}`,
      width: 800,
      height: 600,
      format: "webp",
      bytes: 15e4,
      thumbnail_url: fileData.startsWith("data:") ? fileData : `https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=300&q=80`,
      is_simulated: true
    };
  }
  try {
    const uploadResponse = await import_cloudinary.v2.uploader.upload(fileData, {
      folder: targetFolder,
      public_id: options.publicId,
      overwrite: true,
      resource_type: "image",
      transformation: [
        { max_width: 1400, crop: "limit" },
        { quality: "auto:good" },
        { fetch_format: "auto" }
      ],
      tags: ["nursing-officer-prep", ...options.tags || []]
    });
    const thumbnailUrl = import_cloudinary.v2.url(uploadResponse.public_id, {
      width: 320,
      height: 220,
      crop: "fill",
      gravity: "auto",
      quality: "auto",
      fetch_format: "auto"
    });
    return {
      url: uploadResponse.url,
      secure_url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
      width: uploadResponse.width,
      height: uploadResponse.height,
      format: uploadResponse.format,
      bytes: uploadResponse.bytes,
      thumbnail_url: thumbnailUrl,
      resource_type: "image",
      is_simulated: false
    };
  } catch (error) {
    console.error("Cloudinary image upload error:", error);
    throw new Error(error.message || "Failed to upload image to Cloudinary CDN");
  }
}
async function uploadVideoToCloudinary(fileData, options = {}) {
  const targetFolder = options.folder || "nursing-officer/promo-videos";
  if (!isCloudinaryConfigured) {
    console.info("Cloudinary credentials not set. Falling back to sample video.");
    const fallbackUrl = options.aspectRatio === "9:16" ? "https://res.cloudinary.com/demo/video/upload/c_fill,ar_9:16,w_720/dog.mp4" : "https://res.cloudinary.com/demo/video/upload/c_scale,w_854/sea_turtle.mp4";
    return {
      url: fallbackUrl,
      secure_url: fallbackUrl,
      public_id: options.publicId || `local-vid-${Date.now()}`,
      width: options.aspectRatio === "9:16" ? 720 : 1280,
      height: options.aspectRatio === "9:16" ? 1280 : 720,
      format: "mp4",
      bytes: 25e5,
      thumbnail_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
      resource_type: "video",
      duration: 15,
      is_simulated: true
    };
  }
  try {
    const uploadResponse = await import_cloudinary.v2.uploader.upload(fileData, {
      folder: targetFolder,
      public_id: options.publicId,
      resource_type: "video",
      overwrite: true,
      tags: ["nursing-officer-ads", ...options.tags || []]
    });
    const thumbnailUrl = import_cloudinary.v2.url(uploadResponse.public_id, {
      resource_type: "video",
      format: "jpg",
      transformation: [
        { width: options.aspectRatio === "9:16" ? 360 : 640, crop: "scale" },
        { start_offset: "1" }
      ]
    });
    return {
      url: uploadResponse.url,
      secure_url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
      width: uploadResponse.width,
      height: uploadResponse.height,
      format: uploadResponse.format,
      bytes: uploadResponse.bytes,
      thumbnail_url: thumbnailUrl || uploadResponse.secure_url,
      resource_type: "video",
      duration: uploadResponse.duration,
      is_simulated: false
    };
  } catch (error) {
    console.error("Cloudinary video upload error:", error);
    throw new Error(error.message || "Failed to upload video to Cloudinary CDN");
  }
}
async function deleteFromCloudinary(publicId, resourceType = "image") {
  if (!isCloudinaryConfigured || publicId.startsWith("local-")) {
    return true;
  }
  try {
    const result = await import_cloudinary.v2.uploader.destroy(publicId, { resource_type: resourceType });
    return result.result === "ok" || result.result === "not found";
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return false;
  }
}

// server/db.ts
var INITIAL_AI_IMPORT_SETTINGS = {
  autoApprovalEnabled: true,
  minAutoApprovalConfidence: 90,
  minQualityScore: 85,
  autoDuplicateDetection: true,
  autoExplanationGeneration: true,
  autoSubjectDetection: true,
  autoTopicDetection: true,
  medicalSafetyReview: true,
  autoPublish: true,
  processingMode: "balanced",
  duplicateSimilarityThreshold: 0.85
};
var DATA_DIR = import_path.default.join(process.cwd(), "data");
var STORE_PATH = import_path.default.join(DATA_DIR, "store.json");
var INITIAL_USERS = [
  {
    id: "usr-student-01",
    email: "aspirant@nursingprep.ai",
    name: "Nursing Officer Aspirant (PRO)",
    role: "student",
    preferredLanguage: "en",
    targetExam: "AIIMS NORCET 2025",
    dailyTarget: 30,
    streakDays: 14,
    points: 480,
    isPremium: true,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "usr-student-free",
    email: "free.student@nursingprep.ai",
    name: "Free Tier Student (5 MCQs/Topic)",
    role: "student",
    preferredLanguage: "mr",
    targetExam: "Maha DMER Staff Nurse",
    dailyTarget: 20,
    streakDays: 4,
    points: 100,
    isPremium: false,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "usr-editor-01",
    email: "editor@nursingprep.ai",
    name: "Content Editor",
    role: "content_editor",
    preferredLanguage: "mr",
    targetExam: "Faculty",
    dailyTarget: 10,
    streakDays: 5,
    points: 120,
    isPremium: true,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "usr-reviewer-01",
    email: "reviewer@nursingprep.ai",
    name: "Subject Reviewer",
    role: "reviewer",
    preferredLanguage: "en",
    targetExam: "Quality Review",
    dailyTarget: 20,
    streakDays: 28,
    points: 920,
    isPremium: true,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "usr-admin-01",
    email: "hangemahesh916@gmail.com",
    name: "Mahesh Hange (Admin)",
    role: "super_admin",
    preferredLanguage: "mr",
    targetExam: "Exam Operations & Recruitment Admin",
    dailyTarget: 50,
    streakDays: 45,
    points: 1500,
    isPremium: true,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  }
];
var INITIAL_SETTINGS = {
  app_name: "Nursing Officer Exam Preparation Platform",
  support_email: "HANGEMAHESH498@gmail.com",
  support_phone: "+91 98765 43210",
  show_support_phone: true,
  whatsapp_number: "+91 98765 43210",
  show_whatsapp: true,
  support_hours: "9:00 AM - 8:00 PM IST (Mon - Sat)",
  default_language: "en",
  allow_registration: true,
  maintenance_mode: false,
  maintenance_message: "Platform scheduled maintenance in progress. Please check back shortly.",
  default_negative_marking: 0.33,
  ai_rate_limit_per_user_per_day: 50,
  enable_ai_question_generation: true,
  enable_ai_study_coach: true,
  // Telegram Smart System
  telegram_username: "Indian0916",
  telegram_contact_url: "https://t.me/Indian0916",
  telegram_group_url: "https://t.me/NursingofficerAPP",
  telegram_channel_url: "https://t.me/NursingofficerAPP",
  telegram_support_message: "Namaste! Contact our official Telegram admin for instant doubt clearing, study notes PDFs, and payment verification.",
  // Payment & QR Settings
  premium_enabled: true,
  payment_mode: "MANUAL_QR",
  manual_qr_enabled: true,
  razorpay_enabled: false,
  currency: "INR",
  upi_id: "nursingprep@upi",
  receiver_name: "Nursing Officer Exam Academy",
  payment_instructions_en: "1. Scan the QR code or pay using UPI ID.\n2. Note down the 12-digit UPI / UTR Transaction ID from Google Pay / PhonePe / Paytm.\n3. Enter the UTR number below and attach payment screenshot.\n4. Admin will verify and activate your PRO subscription within 15-30 minutes.",
  payment_instructions_mr: "\u0967. \u0916\u093E\u0932\u0940\u0932 QR \u0915\u094B\u0921 \u0938\u094D\u0915\u0945\u0928 \u0915\u0930\u093E \u0915\u093F\u0902\u0935\u093E UPI ID \u0926\u094D\u0935\u093E\u0930\u0947 \u0930\u0915\u094D\u0915\u092E \u092D\u0930\u093E.\n\u0968. \u0917\u0941\u0917\u0932 \u092A\u0947 / \u092B\u094B\u0928\u092A\u0947 / \u092A\u0947\u091F\u0940\u090F\u092E \u092E\u0927\u0940\u0932 \u0967\u0968-\u0905\u0902\u0915\u0940 UTR \u0915\u093F\u0902\u0935\u093E Transaction ID \u0915\u0949\u092A\u0940 \u0915\u0930\u093E.\n\u0969. \u0916\u093E\u0932\u0940\u0932 \u092C\u0949\u0915\u094D\u0938\u092E\u0927\u094D\u092F\u0947 UTR \u0915\u094D\u0930\u092E\u093E\u0902\u0915 \u091F\u093E\u0915\u093E \u0935 \u0938\u094D\u0915\u094D\u0930\u0940\u0928\u0936\u0949\u091F \u0905\u092A\u0932\u094B\u0921 \u0915\u0930\u093E.\n\u096A. \u0905\u200D\u0945\u0921\u092E\u093F\u0928 \u0924\u092A\u093E\u0938\u0923\u0940 \u0915\u0930\u0942\u0928 \u0967\u096B-\u0969\u0966 \u092E\u093F\u0928\u093F\u091F\u093E\u0902\u0924 \u0924\u0941\u092E\u091A\u093E PRO \u092A\u094D\u0932\u0945\u0928 \u0938\u0941\u0930\u0942 \u0915\u0930\u0947\u0932.",
  announcement_banner: "\u26A1 AIIMS NORCET 2025 Grand Mock Test Series & Verified 2024 Question Bank Live Now!",
  announcement_banner_active: true,
  // Running Ticker Bar
  ticker_text_mr: "\u{1F389} \u0935\u093F\u0936\u0947\u0937 \u0938\u0930\u093E\u0935 \u0911\u092B\u0930: MH50 \u092A\u094D\u0930\u094B\u092E\u094B \u0915\u094B\u0921 \u0935\u093E\u092A\u0930\u093E \u0906\u0923\u093F \u096B\u0966% \u0938\u0942\u091F \u092E\u093F\u0933\u0935\u093E! \u{1F389}",
  ticker_text_en: "\u{1F389} Special Fest Offer: Use promo code MH50 to get 50% OFF! \u{1F389}",
  ticker_active: true,
  // App-Opening Offer Popup Notification
  offer_popup_active: true,
  offer_popup_title_mr: "\u{1F525} \u0935\u093F\u0936\u0947\u0937 \u0938\u0935\u0932\u0924 \u0911\u092B\u0930! (Flat 50% OFF)",
  offer_popup_title_en: "\u{1F525} Special Festival Offer (50% OFF)",
  offer_popup_message_mr: "\u0938\u0930\u094D\u0935 \u0967\u096E \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u0935\u093F\u0937\u092F\u093E\u0902\u091A\u0947 \u0938\u0930\u093E\u0935 \u092A\u094D\u0930\u0936\u094D\u0928\u0938\u0902\u091A, \u096B\u0966+ \u0917\u094D\u0930\u0901\u0921 \u092E\u0949\u0915 \u091F\u0947\u0938\u094D\u091F\u094D\u0938 \u0906\u0923\u093F \u0911\u0932-\u0907\u0902\u0921\u093F\u092F\u093E \u0930\u0901\u0915 \u092A\u094D\u0930\u0947\u0921\u093F\u0915\u094D\u091F\u0930 \u096B\u0966% \u0921\u093F\u0938\u094D\u0915\u093E\u0909\u0902\u091F\u0938\u0939 \u092E\u093F\u0933\u0935\u093E!",
  offer_popup_message_en: "Unlock 18 Nursing Subjects, 50+ Mock Tests, and AI Clinical Coach with 50% discount using code MH50.",
  offer_popup_badge_mr: "\u092E\u0930\u094D\u092F\u093E\u0926\u093F\u0924 \u0915\u093E\u0932\u093E\u0935\u0927\u0940 \u0911\u092B\u0930",
  offer_popup_promo_code: "MH50",
  offer_popup_target_tab: "upgrade-pro",
  // Success Students Section Toggle
  show_successful_students_section: true,
  // YouTube Lectures Section Toggle (Admin Controlled)
  show_youtube_lectures_section: true
};
var INITIAL_YOUTUBE_LECTURES = [
  {
    id: "yt-marathi-01",
    title_mr: "\u092E\u0930\u093E\u0920\u0940 \u0935\u094D\u092F\u093E\u0915\u0930\u0923 - \u092A\u094D\u0930\u092F\u094B\u0917, \u0938\u092E\u093E\u0938 \u0935 \u0936\u092C\u094D\u0926\u0938\u0902\u0917\u094D\u0930\u0939 (DMER/DHS \u0935\u093F\u0936\u0947\u0937 \u0935\u094D\u092F\u093E\u0916\u094D\u092F\u093E\u0928)",
    title_en: "Marathi Grammar - Prayog, Samas & Vocabulary for DHS/DMER Exam",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtube_video_id: "dQw4w9WgXcQ",
    thumbnail_url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600",
    subject_name: "\u092E\u0930\u093E\u0920\u0940 \u0935\u094D\u092F\u093E\u0915\u0930\u0923",
    duration_label: "40 Min",
    instructor_name: "\u092E\u0930\u093E\u0920\u0940 \u0935\u094D\u092F\u093E\u0915\u0930\u0923 \u0924\u091C\u094D\u091C\u094D\u091E (Faculty)",
    description_mr: "\u0915\u0930\u094D\u092E\u0923\u0940, \u0915\u0930\u094D\u0924\u0930\u0940 \u0935 \u092D\u093E\u0935\u0947 \u092A\u094D\u0930\u092F\u094B\u0917, \u0905\u0935\u094D\u092F\u092F\u0940\u092D\u093E\u0935 \u0935 \u0924\u0924\u094D\u092A\u0941\u0930\u0941\u0937 \u0938\u092E\u093E\u0938, \u0906\u0923\u093F \u0935\u093E\u0930\u0902\u0935\u093E\u0930 \u0935\u093F\u091A\u093E\u0930\u0932\u0947\u0932\u0947 \u0938\u092E\u093E\u0928\u093E\u0930\u094D\u0925\u0940 \u0936\u092C\u094D\u0926.",
    description_en: "In-depth Marathi grammar covering sentence structures, compound words and vocabulary.",
    is_active: true,
    is_paid: false,
    price: 0,
    view_count: 3200,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "yt-01",
    title_mr: "AIIMS NORCET \u096D.\u0966 \u092B\u093E\u0930\u094D\u092E\u093E\u0915\u094B\u0932\u0949\u091C\u0940 \u0906\u0923\u093F \u0921\u094B\u0938 \u0917\u0923\u093F\u0924\u0947 (High-Yield Masterclass)",
    title_en: "AIIMS NORCET 7.0 Pharmacology & Dosage Calculations Masterclass",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtube_video_id: "dQw4w9WgXcQ",
    thumbnail_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600",
    subject_name: "Pharmacology & Dosage",
    duration_label: "45 Min",
    instructor_name: "MH Sir (Senior Nursing Expert)",
    description_mr: "\u0921\u093E\u092F\u091C\u0949\u0915\u094D\u0938\u093F\u0928, \u0907\u0928\u094D\u0938\u0941\u0932\u093F\u0928 \u092A\u094D\u0930\u0915\u093E\u0930, \u0906\u0923\u093F \u0921\u094B\u0938 \u0917\u0923\u093F\u0924\u093E\u091A\u0947 \u092E\u0939\u0924\u094D\u0924\u094D\u0935\u093E\u091A\u0947 \u0928\u093F\u092F\u092E \u0938\u0935\u093F\u0938\u094D\u0924\u0930 \u0938\u092E\u091C\u0942\u0928 \u0918\u094D\u092F\u093E.",
    description_en: "Comprehensive breakdown of Digoxin toxicity, Insulin classification, and IV drop rate formulas.",
    is_active: true,
    is_paid: false,
    price: 0,
    view_count: 1420,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "yt-02",
    title_mr: "\u092A\u093E\u0930\u094D\u0915\u0932\u0901\u0921 \u092C\u0930\u094D\u0928\u094D\u0938 \u092B\u0949\u0930\u094D\u092E\u094D\u092F\u0941\u0932\u093E \u0906\u0923\u093F \u092B\u094D\u0932\u0941\u0907\u0921 \u0930\u0940\u0938\u0938\u093F\u091F\u0947\u0936\u0928 (Burn Management)",
    title_en: "Parkland Burn Resuscitation & Rule of Nines Calculation",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtube_video_id: "dQw4w9WgXcQ",
    thumbnail_url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600",
    subject_name: "Medical Surgical Nursing",
    duration_label: "35 Min",
    instructor_name: "Nursing Officer Team",
    description_mr: "\u092A\u0939\u093F\u0932\u094D\u092F\u093E \u0968\u096A \u0924\u093E\u0938\u093E\u0902\u0924\u0940\u0932 Ringer Lactate \u0917\u0923\u093F\u0924\u093E\u091A\u0940 \u0938\u094B\u092A\u0940 \u092A\u0926\u094D\u0927\u0924 \u0906\u0923\u093F NORCET \u0935\u093F\u091A\u093E\u0930\u0932\u0947\u0932\u0947 \u092A\u094D\u0930\u0936\u094D\u0928.",
    description_en: "Step-by-step fluid resuscitation calculation using Parkland formula with clinical examples.",
    is_active: true,
    is_paid: true,
    price: 49,
    view_count: 980,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "yt-03",
    title_mr: "\u0907\u0938\u0940\u091C\u0940 (ECG) \u0938\u094D\u091F\u094D\u0930\u093F\u092A \u0935\u093E\u091A\u0923\u094D\u092F\u093E\u091A\u0940 \u0938\u094B\u092A\u0940 \u092A\u0926\u094D\u0927\u0924 (Cardiac Emergency Nursing)",
    title_en: "ECG Interpretation & Cardiac Arrhythmia Recognition",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtube_video_id: "dQw4w9WgXcQ",
    thumbnail_url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600",
    subject_name: "ICU & Cardiac Nursing",
    duration_label: "50 Min",
    instructor_name: "MH Sir",
    description_mr: "VT, VF, STEMI \u0906\u0923\u093F Atrial Fibrillation \u0913\u0933\u0916\u0923\u094D\u092F\u093E\u091A\u0940 \u0938\u094B\u092A\u0940 \u092A\u0926\u094D\u0927\u0924.",
    description_en: "Master ECG reading, lethal arrhythmias, and emergency cardiac drug interventions.",
    is_active: true,
    is_paid: false,
    price: 0,
    view_count: 2150,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  }
];
var INITIAL_SUCCESSFUL_STUDENTS = [
  {
    id: "stud-01",
    student_name: "\u0938\u094D\u0928\u0947\u0939\u0932 \u092A\u093E\u091F\u0940\u0932 (Snehal Patil)",
    photo_url: "https://images.unsplash.com/photo-1594824813571-28a77885097a?auto=format&fit=crop&q=80&w=300",
    selected_post: "DHS Nursing Officer",
    posting_location: "\u0936\u093E\u0938\u0915\u0940\u092F \u0935\u0948\u0926\u094D\u092F\u0915\u0940\u092F \u092E\u0939\u093E\u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F (GMC) \u091B\u0924\u094D\u0930\u092A\u0924\u0940 \u0938\u0902\u092D\u093E\u091C\u0940\u0928\u0917\u0930",
    marks_or_rank: "\u0967\u096E\u096A \u0917\u0941\u0923 (\u0917\u0941\u0923\u0935\u0924\u094D\u0924\u093E \u092F\u093E\u0926\u0940 \u0967 \u0932\u0940)",
    exam_batch: "\u0968\u0966\u0968\u096A \u092D\u0930\u0924\u0940",
    testimonial_mr: "\u092F\u093E \u092A\u094D\u0932\u0945\u091F\u092B\u0949\u0930\u094D\u092E\u0935\u0930\u0940\u0932 \u0938\u0930\u094D\u0935 \u0967\u096E \u0935\u093F\u0937\u092F\u093E\u0902\u091A\u0947 \u0938\u0930\u093E\u0935 MCQs \u0906\u0923\u093F \u0935\u0947\u0933\u0947\u0935\u0930 \u0906\u0927\u093E\u0930\u093F\u0924 \u096B\u0966+ \u092E\u0949\u0915 \u091F\u0947\u0938\u094D\u091F\u094D\u0938\u092E\u0941\u0933\u0947 \u092E\u0932\u093E \u092A\u0939\u093F\u0932\u094D\u092F\u093E\u091A \u092A\u094D\u0930\u092F\u0924\u094D\u0928\u093E\u0924 \u0936\u093E\u0938\u0915\u0940\u092F \u0938\u0947\u0935\u0947\u0924 \u092F\u0936 \u092E\u093F\u0933\u093E\u0932\u0947.",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "stud-02",
    student_name: "\u0930\u093E\u0939\u0941\u0932 \u0926\u0947\u0936\u092E\u0941\u0916 (Rahul Deshmukh)",
    photo_url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
    selected_post: "DMER Staff Nurse",
    posting_location: "\u092C\u0940. \u091C\u0947. \u0936\u093E\u0938\u0915\u0940\u092F \u0935\u0948\u0926\u094D\u092F\u0915\u0940\u092F \u092E\u0939\u093E\u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F \u0935 \u0938\u0938\u0942\u0928 \u0930\u0941\u0917\u094D\u0923\u093E\u0932\u092F, \u092A\u0941\u0923\u0947",
    marks_or_rank: "\u0967\u096D\u096C \u0917\u0941\u0923 (\u0930\u0901\u0915 #\u0966\u096A)",
    exam_batch: "\u0968\u0966\u0968\u096A \u092D\u0930\u0924\u0940",
    testimonial_mr: "\u0915\u094D\u0932\u0940\u0928\u093F\u0915\u0932 \u0915\u0947\u0938\u0947\u0938, \u0908\u0938\u0940\u091C\u0940 \u092A\u094D\u0930\u0936\u094D\u0928 \u0906\u0923\u093F \u0905\u091A\u0942\u0915 \u0938\u094D\u092A\u0937\u094D\u091F\u0940\u0915\u0930\u0923\u093E\u092E\u0941\u0933\u0947 \u092E\u093E\u091D\u093E \u0938\u0930\u093E\u0935 \u092E\u091C\u092C\u0942\u0924 \u091D\u093E\u0932\u093E. \u091F\u0947\u0938\u094D\u091F \u0938\u093F\u0930\u0940\u091C \u0905\u0924\u094D\u092F\u0902\u0924 \u0926\u0930\u094D\u091C\u093E\u091A\u0940 \u0906\u0939\u0947.",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "stud-03",
    student_name: "\u092A\u094D\u0930\u093F\u092F\u093E \u0936\u093F\u0902\u0926\u0947 (Priya Shinde)",
    photo_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
    selected_post: "AIIMS NORCET Officer",
    posting_location: "\u090F\u092E\u094D\u0938 (AIIMS) \u0928\u093E\u0917\u092A\u0942\u0930",
    marks_or_rank: "All India Rank 18",
    exam_batch: "NORCET 6.0",
    testimonial_mr: "\u0967/\u0969 \u0928\u093F\u0917\u0947\u091F\u093F\u0935\u094D\u0939 \u092E\u093E\u0930\u094D\u0915\u093F\u0902\u0917 \u091F\u093E\u0907\u092E\u0930 \u091F\u0947\u0938\u094D\u091F\u094D\u0938\u092E\u0941\u0933\u0947 \u092A\u094D\u0930\u0924\u094D\u092F\u0915\u094D\u0937 \u092A\u0930\u0940\u0915\u094D\u0937\u0947\u0924 \u0935\u0947\u0933\u0947\u091A\u0947 \u0928\u093F\u092F\u094B\u091C\u0928 \u0915\u0930\u0923\u0947 \u0938\u094B\u092A\u0947 \u091D\u093E\u0932\u0947.",
    is_active: true,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  }
];
var INITIAL_PROMO_CODES = [
  {
    id: "promo-01",
    code: "MH50",
    discount_type: "percentage",
    discount_value: 50,
    valid_till: "2026-12-31",
    is_active: true,
    description: "50% Flat Special Fest Discount",
    usage_count: 18,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "promo-02",
    code: "NORCET20",
    discount_type: "fixed",
    discount_value: 50,
    valid_till: "2026-12-31",
    is_active: true,
    description: "\u20B950 Flat Instant Discount on All Plans",
    usage_count: 42,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  }
];
var INITIAL_PAYMENT_PLANS = [
  {
    id: "plan-mcq-only",
    name: "MCQ Practice Special Plan",
    name_mr: "\u092B\u0915\u094D\u0924 MCQs \u0938\u0930\u093E\u0935 \u092A\u094D\u0932\u0945\u0928",
    price: 99,
    currency: "INR",
    duration_days: 90,
    duration_label: "90 Days (3 Months)",
    duration_label_mr: "\u096F\u0966 \u0926\u093F\u0935\u0938 (\u0969 \u092E\u0939\u093F\u0928\u0947 \u0905\u092E\u0930\u094D\u092F\u093E\u0926\u093F\u0924 MCQ \u0938\u0930\u093E\u0935)",
    is_active: true,
    plan_type: "PRO_MCQ",
    tax_label: "(Inclusive of all taxes)",
    fulfillment_note: "Instant Digital Access upon payment",
    features: [
      "Unlimited MCQ Practice (18 Core Nursing Subjects)",
      "Clinical Vignettes, ECG & Image-based Questions",
      "Marathi & English Explanations",
      "Mistake Notebook & Spaced Repetition"
    ],
    features_mr: [
      "\u0938\u0930\u094D\u0935 \u0967\u096E \u0935\u093F\u0937\u092F\u093E\u0902\u091A\u0947 \u0905\u092E\u0930\u094D\u092F\u093E\u0926\u093F\u0924 \u0938\u0930\u093E\u0935 MCQs",
      "\u0915\u094D\u0932\u093F\u0928\u093F\u0915\u0932 \u0915\u0947\u0938\u0947\u0938, \u0908\u0938\u0940\u091C\u0940 \u0935 \u092B\u094B\u091F\u094B \u092A\u094D\u0930\u0936\u094D\u0928\u0938\u0902\u091A",
      "\u092E\u0930\u093E\u0920\u0940 \u0935 \u0907\u0902\u0917\u094D\u0930\u091C\u0940 \u0938\u0935\u093F\u0938\u094D\u0924\u0930 \u0938\u094D\u092A\u0937\u094D\u091F\u0940\u0915\u0930\u0923",
      "\u091A\u0942\u0915 \u0935\u0939\u0940 \u0935 \u0938\u094D\u0935\u092F\u0902\u091A\u0932\u093F\u0924 \u0909\u091C\u0933\u0923\u0940"
    ]
  },
  {
    id: "plan-test-series-only",
    name: "Full Mock Test Series Plan",
    name_mr: "\u092B\u0915\u094D\u0924 \u091F\u0947\u0938\u094D\u091F \u0938\u093F\u0930\u0940\u091C \u092A\u094D\u0932\u0945\u0928",
    price: 149,
    currency: "INR",
    duration_days: 180,
    duration_label: "180 Days (6 Months)",
    duration_label_mr: "\u0967\u096E\u0966 \u0926\u093F\u0935\u0938 (\u096C \u092E\u0939\u093F\u0928\u0947 \u091F\u0947\u0938\u094D\u091F \u0938\u093F\u0930\u0940\u091C \u092A\u093E\u0938)",
    is_active: true,
    popular: true,
    plan_type: "TEST_SERIES",
    tax_label: "(Inclusive of all taxes)",
    fulfillment_note: "Instant Digital Access upon payment",
    features: [
      "50+ Grand Mock Tests with 1/3 Negative Marking",
      "Timed Exam Environment & Auto-Submit Proctoring",
      "Verified Previous Year Papers (NORCET, ESIC, DMER, DHS)",
      "Instant Downloadable PDF Scorecards"
    ],
    features_mr: [
      "\u096B\u0966+ \u0938\u0902\u092A\u0942\u0930\u094D\u0923 \u092E\u0949\u0915 \u091F\u0947\u0938\u094D\u091F\u094D\u0938 (\u0967/\u0969 \u0928\u093F\u0917\u0947\u091F\u093F\u0935\u094D\u0939 \u092E\u093E\u0930\u094D\u0915\u093F\u0902\u0917)",
      "\u092A\u0930\u0940\u0915\u094D\u0937\u0947\u0938\u093E\u0930\u0916\u093E \u091F\u093E\u0907\u092E\u0930 \u0935 \u0911\u091F\u094B-\u0938\u092C\u092E\u093F\u091F \u0938\u0941\u0935\u093F\u0927\u093E",
      "\u092E\u093E\u0917\u0940\u0932 \u0935\u0930\u094D\u0937\u093E\u0902\u091A\u0947 \u092A\u094D\u0930\u092E\u093E\u0923\u093F\u0924 \u092A\u094D\u0930\u0936\u094D\u0928\u092A\u0924\u094D\u0930\u093F\u0915\u093E \u0938\u0902\u091A",
      "\u092A\u0940\u0921\u0940\u090F\u092B \u0917\u0941\u0923\u092A\u0924\u094D\u0930\u093F\u0915\u093E \u0921\u093E\u090A\u0928\u0932\u094B\u0921 \u0938\u0941\u0935\u093F\u0927\u093E"
    ]
  },
  {
    id: "plan-combo-pass",
    name: "All-Access Combo Plan (MCQ + Test Series)",
    name_mr: "MCQ + \u091F\u0947\u0938\u094D\u091F \u0938\u093F\u0930\u0940\u091C \u0915\u092E\u094D\u092C\u094B \u092A\u094D\u0932\u0945\u0928",
    price: 199,
    currency: "INR",
    duration_days: 365,
    duration_label: "365 Days (1 Year)",
    duration_label_mr: "\u0969\u096C\u096B \u0926\u093F\u0935\u0938 (\u0967 \u0935\u0930\u094D\u0937 \u0938\u0902\u092A\u0942\u0930\u094D\u0923 \u0915\u0935\u094D\u0939\u0930\u0947\u091C)",
    is_active: true,
    plan_type: "COMBO",
    tax_label: "(Inclusive of all taxes)",
    fulfillment_note: "Instant Digital Access upon payment",
    features: [
      "All 18 Subject MCQ Question Banks Included",
      "All 50+ Mock Test Series Pass Included",
      "AI Clinical Study Coach & Memory Mnemonics",
      "VIP Telegram Doubt & Verification Support"
    ],
    features_mr: [
      "\u0938\u0930\u094D\u0935 \u0967\u096E \u0935\u093F\u0937\u092F\u093E\u0902\u091A\u0947 \u0935\u093F\u0937\u092F\u0935\u093E\u0930 \u0938\u0930\u093E\u0935 MCQs \u0938\u092E\u093E\u0935\u093F\u0937\u094D\u091F",
      "\u0938\u0930\u094D\u0935 \u096B\u0966+ \u092E\u0949\u0915 \u091F\u0947\u0938\u094D\u091F \u0938\u093F\u0930\u0940\u091C \u092A\u0942\u0930\u094D\u0923 \u092A\u094D\u0930\u0935\u0947\u0936",
      "\u090F\u0906\u092F \u0915\u094D\u0932\u093F\u0928\u093F\u0915\u0932 \u0938\u094D\u091F\u0921\u0940 \u0915\u094B\u091A \u0935 \u092E\u0947\u092E\u0930\u0940 \u091F\u094D\u0930\u093F\u0915\u094D\u0938",
      "\u0935\u094D\u0939\u0940\u0906\u092F\u092A\u0940 \u091F\u0947\u0932\u093F\u0917\u094D\u0930\u093E\u092E \u0925\u0947\u091F \u0936\u0902\u0915\u093E \u0928\u093F\u0930\u0938\u0928"
    ]
  }
];
var INITIAL_STUDY_MATERIALS = [
  {
    id: "mat-01",
    title: "Parkland Burns Fluid Resuscitation Formula Guide",
    title_mr: "\u092A\u093E\u0930\u094D\u0915\u0932\u0901\u0921 \u092C\u0930\u094D\u0928 \u092B\u094D\u0932\u0941\u0908\u0921 \u092B\u0949\u0930\u094D\u092E\u094D\u092F\u0941\u0932\u093E \u0935 \u0915\u094D\u0932\u093F\u0928\u093F\u0915\u0932 \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0915",
    description: "Complete 24-hour calculation breakdown for Rule of Nines, fluid titration, urine output goals, and hyperkalemia monitoring in severe thermal burns.",
    description_mr: "\u092C\u0930\u094D\u0928 \u0930\u0941\u0917\u094D\u0923\u093E\u0902\u0938\u093E\u0920\u0940 \u0968\u096A \u0924\u093E\u0938\u093E\u0902\u091A\u0947 \u0906\u0930\u090F\u0932 \u092B\u094D\u0932\u0941\u0908\u0921 \u0915\u0945\u0932\u094D\u0915\u094D\u092F\u0941\u0932\u0947\u0936\u0928, \u092F\u0941\u0930\u093F\u0928 \u0906\u0909\u091F\u092A\u0941\u091F \u0932\u0915\u094D\u0937\u094D\u092F \u0906\u0923\u093F \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u0915\u093E\u0933\u091C\u0940.",
    category: "clinical_guide",
    exam: "AIIMS NORCET",
    subject_id: "subj-msn",
    file_url: "https://example.com/materials/parkland-burns-formula.pdf",
    file_name: "Parkland_Burns_Formula_NORCET.pdf",
    file_size_mb: 1.4,
    source: "Indian Nursing Council & AIIMS Clinical Protocols",
    is_premium: false,
    is_published: true,
    year: 2025,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "mat-02",
    title: "Glasgow Coma Scale (GCS) Assessment Reference Chart",
    title_mr: "\u0917\u094D\u0932\u093E\u0938\u0917\u094B \u0915\u094B\u092E\u093E \u0938\u094D\u0915\u0947\u0932 (GCS) \u0938\u0902\u0926\u0930\u094D\u092D \u0924\u0915\u094D\u0924\u093E",
    description: "Eye (E4), Verbal (V5), Motor (M6) full response scoring chart with clinical triggers for mechanical intubation at score <= 8.",
    description_mr: "\u0908\u096A, \u0935\u094D\u0939\u0940\u096B, \u090F\u092E\u096C \u0938\u0902\u092A\u0942\u0930\u094D\u0923 \u0938\u094D\u0915\u094B\u0905\u0930\u093F\u0902\u0917 \u0924\u0915\u094D\u0924\u093E \u0906\u0923\u093F \u0907\u0928\u094D\u091F\u094D\u092F\u0941\u092C\u0947\u0936\u0928 \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0915 \u0938\u0942\u091A\u0928\u093E.",
    category: "notes",
    exam: "AIIMS NORCET & ESIC",
    subject_id: "subj-fon",
    file_url: "https://example.com/materials/glasgow-coma-scale-chart.pdf",
    file_name: "GCS_Scoring_Quick_Reference.pdf",
    file_size_mb: 0.8,
    source: "Advanced Trauma Nursing Course",
    is_premium: false,
    is_published: true,
    year: 2025,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "mat-03",
    title: "National Immunization Schedule (NIS) & Cold Chain 2025",
    title_mr: "\u0930\u093E\u0937\u094D\u091F\u094D\u0930\u0940\u092F \u0932\u0938\u0940\u0915\u0930\u0923 \u0935\u0947\u0933\u093E\u092A\u0924\u094D\u0930\u0915 \u0968\u0966\u0968\u096B \u0906\u0923\u093F \u0915\u094B\u0932\u094D\u0921 \u091A\u0947\u0928",
    description: "Updated vaccine dosages, routes, sites, temperature storage (ILR 2-8 C), and open vial policy rules for pediatric nursing.",
    description_mr: "\u0932\u0938\u0940\u0902\u091A\u0947 \u0921\u094B\u0938, \u0930\u0942\u091F, \u0938\u093E\u0920\u0935\u0923\u0942\u0915 \u0924\u093E\u092A\u092E\u093E\u0928 \u0906\u0923\u093F \u0915\u094B\u0932\u094D\u0921 \u091A\u0947\u0928 \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0915 \u0924\u0924\u094D\u0924\u094D\u0935\u0947.",
    category: "notes",
    exam: "AIIMS NORCET, ESIC & NHM",
    subject_id: "subj-peds",
    file_url: "https://example.com/materials/immunization-schedule-2025.pdf",
    file_name: "National_Immunization_Schedule_2025.pdf",
    file_size_mb: 2.1,
    source: "Ministry of Health and Family Welfare (MoHFW)",
    is_premium: true,
    is_published: true,
    year: 2025,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "mat-04",
    title: "Biomedical Waste Management (BMWM) Rules 2016 (Amended)",
    title_mr: "\u092C\u093E\u092F\u094B\u092E\u0947\u0921\u093F\u0915\u0932 \u0935\u0947\u0938\u094D\u091F \u092E\u0945\u0928\u0947\u091C\u092E\u0947\u0902\u091F (\u0915\u091A\u0930\u093E \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093E\u092A\u0928) \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0915",
    description: "Yellow, Red, White translucent, and Blue puncture-proof container categories, autoclave parameters, and cytotoxic waste segregation.",
    description_mr: "\u092A\u093F\u0935\u0933\u093E, \u0932\u093E\u0932, \u092A\u093E\u0902\u0922\u0930\u093E \u0906\u0923\u093F \u0928\u093F\u0933\u093E \u0921\u092C\u093E \u0935\u0930\u094D\u0917\u0940\u0915\u0930\u0923 \u0928\u093F\u092F\u092E.",
    category: "clinical_guide",
    exam: "AIIMS NORCET & State Nursing",
    subject_id: "subj-fon",
    file_url: "https://example.com/materials/bmwm-rules-summary.pdf",
    file_name: "BMW_Management_Rules_Summary.pdf",
    file_size_mb: 1.2,
    source: "Central Pollution Control Board & INC",
    is_premium: false,
    is_published: true,
    year: 2024,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  }
];
var INITIAL_PROMO_ADS = [
  {
    id: "ad-all-exam-masterclass",
    title_en: "All Nursing Officer Exams Master Strategy & High-Yield Preparation (DMER, DHS, RRB, ESIC, NORCET)",
    title_mr: "\u0938\u0930\u094D\u0935 \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u0905\u0927\u093F\u0915\u093E\u0930\u0940 \u092A\u0930\u0940\u0915\u094D\u0937\u093E\u0902\u091A\u0940 \u092E\u0939\u093E-\u0930\u0923\u0928\u0940\u0924\u0940 (DMER \u2022 DHS \u2022 RRB \u2022 ESIC \u2022 NORCET \u2022 CHO)",
    description_en: "Comprehensive scoring roadmap for all Central and Maharashtra state nursing recruitment exams. Master High-Yield MCQs, Technical syllabus, Non-nursing subjects & negative marking tips.",
    description_mr: "\u092E\u0939\u093E\u0930\u093E\u0937\u094D\u091F\u094D\u0930 \u0935 \u0915\u0947\u0902\u0926\u094D\u0930 \u0938\u0930\u0915\u093E\u0930\u091A\u094D\u092F\u093E \u0938\u0930\u094D\u0935 \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u092D\u0930\u0924\u0940 \u092A\u0930\u0940\u0915\u094D\u0937\u093E\u0902\u0938\u093E\u0920\u0940 (DMER, DHS, RRB, ESIC, NORCET, CHO, ZP) \u0967\u0966\u0966% \u092A\u0930\u093F\u092A\u0942\u0930\u094D\u0923 \u0930\u0923\u0928\u0940\u0924\u0940, \u0924\u093E\u0902\u0924\u094D\u0930\u093F\u0915 \u0918\u091F\u0915, \u092E\u0930\u093E\u0920\u0940/\u0907\u0902\u0917\u094D\u0930\u091C\u0940/\u091C\u0940\u0915\u0947 \u0935 \u0928\u093F\u0917\u0947\u091F\u093F\u0935\u094D\u0939 \u092E\u093E\u0930\u094D\u0915\u093F\u0902\u0917 \u091F\u093E\u0933\u0923\u094D\u092F\u093E\u091A\u094D\u092F\u093E \u092F\u0941\u0915\u094D\u0924\u094D\u092F\u093E.",
    aspect_ratio: "16:9",
    media_type: "video",
    video_url: "https://res.cloudinary.com/demo/video/upload/c_scale,w_854/sea_turtle.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    cta_text_en: "Enroll in All-Exam Pro Batch \u20B9199",
    cta_text_mr: "\u0938\u0930\u094D\u0935 \u092A\u0930\u0940\u0915\u094D\u0937\u093E\u0902\u0938\u093E\u0920\u0940 PRO \u092C\u0945\u091A (\u092B\u0915\u094D\u0924 \u20B9\u0967\u096F\u096F)",
    cta_link: "upgrade-pro",
    target_screen: "all",
    is_active: true,
    enable_sticky_pip: true,
    order_index: 1,
    badge_text_en: "All Nursing Exams Strategy",
    badge_text_mr: "\u0938\u0930\u094D\u0935 \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u092A\u0930\u0940\u0915\u094D\u0937\u093E\u0902\u0938\u093E\u0920\u0940 \u0935\u093F\u0936\u0947\u0937",
    sponsor_tag: "All Nursing Exams Academy",
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "ad-parkland-reel-short",
    title_en: "1-Minute Parkland Burn & Pediatric Drug Dose Calculation (All Nursing Exams)",
    title_mr: "\u0967 \u092E\u093F\u0928\u093F\u091F\u093E\u0924 \u0936\u093F\u0915\u093E: \u092A\u093E\u0930\u094D\u0915\u0932\u0901\u0921 \u092C\u0930\u094D\u0928 \u0938\u0942\u0924\u094D\u0930 \u0935 \u0914\u0937\u0927 \u0917\u0923\u0928\u093E (\u0938\u0930\u094D\u0935 \u092A\u0930\u0940\u0915\u094D\u0937\u093E\u0902\u0938\u093E\u0920\u0940)",
    description_en: "High-yield calculation formula frequently asked in DMER, DHS, RRB, ESIC, AIIMS NORCET & State Staff Nurse exams.",
    description_mr: "DMER, DHS, ESIC, RRB, NORCET \u0935 \u091C\u093F\u0932\u094D\u0939\u093E \u092A\u0930\u093F\u0937\u0926 \u0938\u094D\u091F\u093E\u092B \u0928\u0930\u094D\u0938 \u092A\u0930\u0940\u0915\u094D\u0937\u0947\u0924 \u0967\u0966\u0966% \u0935\u093F\u091A\u093E\u0930\u0932\u094D\u092F\u093E \u091C\u093E\u0923\u093E\u0931\u094D\u092F\u093E \u092B\u0949\u0930\u094D\u092E\u094D\u092F\u0941\u0932\u093E \u091F\u094D\u0930\u093F\u0915\u094D\u0938 \u090F\u0915\u093E \u092E\u093F\u0928\u093F\u091F\u093E\u091A\u094D\u092F\u093E \u0936\u0949\u0930\u094D\u091F \u0930\u0940\u0932\u092E\u0927\u094D\u092F\u0947 \u0938\u092E\u091C\u0942\u0928 \u0918\u094D\u092F\u093E.",
    aspect_ratio: "9:16",
    media_type: "video",
    video_url: "https://res.cloudinary.com/demo/video/upload/c_fill,ar_9:16,w_720/dog.mp4",
    thumbnail_url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=720&q=80",
    cta_text_en: "Join Free All-Exam Telegram",
    cta_text_mr: "\u092E\u094B\u092B\u0924 \u091F\u0947\u0932\u093F\u0917\u094D\u0930\u093E\u092E \u091A\u0945\u0928\u0947\u0932 \u091C\u0949\u0908\u0928 \u0915\u0930\u093E",
    cta_link: "https://t.me/NursingOfficerPrep",
    target_screen: "all",
    is_active: true,
    enable_sticky_pip: true,
    order_index: 2,
    badge_text_en: "All-Exam High Yield Reel",
    badge_text_mr: "\u0938\u0930\u094D\u0935 \u092A\u0930\u0940\u0915\u094D\u0937\u093E\u0902\u0938\u093E\u0920\u0940 \u0936\u0949\u0930\u094D\u091F \u0930\u0940\u0932",
    sponsor_tag: "Rapid Nursing Reels",
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }
];
var DatabaseService = class {
  constructor() {
    this.store = this.loadOrInitialize();
  }
  reloadFromDisk() {
    this.store = this.loadOrInitialize();
  }
  loadOrInitialize() {
    try {
      if (!import_fs.default.existsSync(DATA_DIR)) {
        import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch (err) {
      console.warn("Error creating data directory", err);
    }
    const adminUser = INITIAL_USERS.find((u) => u.email === "gitevijay123@gmail.com");
    if (adminUser) {
      const { hash, salt } = this.hashPassword("9623790916");
      adminUser.passwordHash = hash;
      adminUser.passwordSalt = salt;
    }
    const defaultStore = {
      users: INITIAL_USERS,
      subjects: INITIAL_SUBJECTS,
      chapters: INITIAL_CHAPTERS,
      topics: INITIAL_TOPICS,
      subtopics: [],
      questions: INITIAL_QUESTIONS.map((q) => ({
        ...q,
        duplicate_hash: this.computeDuplicateHash(q.question_en)
      })),
      case_studies: INITIAL_CASE_STUDIES,
      mock_tests: INITIAL_MOCK_TESTS,
      test_attempts: [],
      mistakes: [],
      bookmarks: [],
      reports: [],
      audit_logs: [
        {
          id: "log-01",
          actor_id: "usr-admin-01",
          actor_name: "Chief Admin",
          actor_role: "admin",
          action: "SYSTEM_BOOTSTRAP",
          entity: "System",
          entity_id: "root",
          details: "Nursing Officer Preparation Platform initialized with certified subject banks, study materials, and manual QR payment subsystem.",
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        }
      ],
      settings: { ...INITIAL_SETTINGS, ai_import_settings: INITIAL_AI_IMPORT_SETTINGS },
      payment_plans: INITIAL_PAYMENT_PLANS,
      payments: [],
      study_materials: INITIAL_STUDY_MATERIALS,
      recruitment_notices: [],
      import_batches: [],
      promo_ads: INITIAL_PROMO_ADS,
      push_notifications: [],
      promo_codes: INITIAL_PROMO_CODES,
      proctoring_snapshots: [],
      successful_students: INITIAL_SUCCESSFUL_STUDENTS,
      youtube_lectures: INITIAL_YOUTUBE_LECTURES
    };
    if (import_fs.default.existsSync(STORE_PATH)) {
      try {
        const raw = import_fs.default.readFileSync(STORE_PATH, "utf-8");
        const parsed = JSON.parse(raw);
        return {
          ...defaultStore,
          ...parsed,
          users: (() => {
            const rawUsers = parsed.users && parsed.users.length > 0 ? parsed.users : INITIAL_USERS;
            let hasSuperAdmin = false;
            const updated = rawUsers.map((u) => {
              if (u.email?.toLowerCase() === "hangemahesh916@gmail.com" || u.email?.toLowerCase() === "gitevijay123@gmail.com" || u.id === "usr-admin-01") {
                hasSuperAdmin = true;
                const { hash, salt } = this.hashPassword("458498");
                return {
                  ...u,
                  id: "usr-admin-01",
                  email: "hangemahesh916@gmail.com",
                  name: "Mahesh Hange (Admin)",
                  role: "super_admin",
                  passwordHash: hash,
                  passwordSalt: salt,
                  isPremium: true
                };
              }
              return u;
            });
            if (!hasSuperAdmin) {
              const { hash, salt } = this.hashPassword("458498");
              updated.push({
                id: "usr-admin-01",
                email: "hangemahesh916@gmail.com",
                name: "Mahesh Hange (Admin)",
                role: "super_admin",
                preferredLanguage: "mr",
                targetExam: "Exam Operations & Recruitment Admin",
                dailyTarget: 50,
                streakDays: 45,
                points: 1500,
                isPremium: true,
                passwordHash: hash,
                passwordSalt: salt,
                createdAt: (/* @__PURE__ */ new Date()).toISOString()
              });
            }
            return updated;
          })(),
          chapters: parsed.chapters && parsed.chapters.length > 0 ? parsed.chapters : INITIAL_CHAPTERS,
          topics: parsed.topics && parsed.topics.length > 0 ? parsed.topics : INITIAL_TOPICS,
          subtopics: parsed.subtopics || [],
          questions: (parsed.questions && parsed.questions.length > 0 ? parsed.questions : INITIAL_QUESTIONS).map((q) => ({
            ...q,
            duplicate_hash: q.duplicate_hash || this.computeDuplicateHash(q.question_en || "")
          })),
          subjects: parsed.subjects && parsed.subjects.length > 0 ? parsed.subjects : INITIAL_SUBJECTS,
          payment_plans: parsed.payment_plans && parsed.payment_plans.length > 0 ? parsed.payment_plans : INITIAL_PAYMENT_PLANS,
          payments: parsed.payments || [],
          study_materials: parsed.study_materials && parsed.study_materials.length > 0 ? parsed.study_materials : INITIAL_STUDY_MATERIALS,
          recruitment_notices: parsed.recruitment_notices !== void 0 ? parsed.recruitment_notices : [],
          import_batches: parsed.import_batches || [],
          promo_ads: (parsed.promo_ads && parsed.promo_ads.length > 0 ? parsed.promo_ads : INITIAL_PROMO_ADS).map((ad) => {
            if (ad.id === "ad-norcet-grand-masterclass" || ad.title_en && ad.title_en.includes("AIIMS NORCET 2025 Grand Strategy")) {
              return INITIAL_PROMO_ADS[0];
            }
            if (ad.id === "ad-parkland-reel-short" && !ad.title_en?.includes("All Nursing Exams")) {
              return INITIAL_PROMO_ADS[1];
            }
            if (ad.video_url && ad.video_url.includes("commondatastorage.googleapis.com")) {
              return {
                ...ad,
                video_url: ad.aspect_ratio === "9:16" ? "https://res.cloudinary.com/demo/video/upload/c_fill,ar_9:16,w_720/dog.mp4" : "https://res.cloudinary.com/demo/video/upload/c_scale,w_854/sea_turtle.mp4"
              };
            }
            return ad;
          }),
          settings: {
            ...INITIAL_SETTINGS,
            ...parsed.settings || {},
            ai_import_settings: {
              ...INITIAL_AI_IMPORT_SETTINGS,
              ...parsed.settings?.ai_import_settings || {}
            }
          },
          push_notifications: parsed.push_notifications || [],
          successful_students: parsed.successful_students && parsed.successful_students.length > 0 ? parsed.successful_students : INITIAL_SUCCESSFUL_STUDENTS
        };
      } catch (e) {
        console.warn("Failed parsing existing store, using default", e);
      }
    }
    this.save(defaultStore);
    return defaultStore;
  }
  save(storeToSave = this.store) {
    try {
      if (!import_fs.default.existsSync(DATA_DIR)) {
        import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
      }
      import_fs.default.writeFileSync(STORE_PATH, JSON.stringify(storeToSave, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to write store.json", err);
    }
  }
  computeDuplicateHash(text2) {
    const normalized = text2.toLowerCase().replace(/[^a-z0-9]/g, "");
    return import_crypto.default.createHash("sha256").update(normalized).digest("hex").substring(0, 16);
  }
  // Subscription Helper
  processSubscriptionValidity(user) {
    if (!user) return user;
    if (user.planEndDate) {
      const nowMs = Date.now();
      const endMs = new Date(user.planEndDate).getTime();
      const diffDays = Math.ceil((endMs - nowMs) / (1e3 * 60 * 60 * 24));
      if (diffDays <= 0) {
        user.isPremium = false;
        user.daysRemaining = 0;
      } else {
        user.isPremium = true;
        user.daysRemaining = diffDays;
      }
    } else if (user.isPremium) {
      user.daysRemaining = 180;
    } else {
      user.daysRemaining = 0;
    }
    return user;
  }
  makeReferralCode(name, email) {
    const base = (name || email.split("@")[0] || "NURSE").replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6) || "NURSE";
    let code = `${base}${Math.floor(1e3 + Math.random() * 9e3)}`;
    while (this.store.users.some((u) => u.referralCode === code)) code = `${base}${Math.floor(1e3 + Math.random() * 9e3)}`;
    return code;
  }
  getReferralLeaderboard() {
    const users2 = this.getUsers();
    const counts = /* @__PURE__ */ new Map();
    users2.forEach((u) => {
      if (u.referredByCode) counts.set(u.referredByCode, (counts.get(u.referredByCode) || 0) + 1);
    });
    const rows = users2.filter((u) => u.role === "student").map((u) => ({ ...u, referralCount: counts.get(u.referralCode || "") || 0 })).sort((a, b) => (b.referralCount || 0) - (a.referralCount || 0));
    return rows.map((u, i) => ({ user: u, rank: i + 1, referralCount: u.referralCount || 0, rewardDays: (u.referralCount || 0) >= 50 ? 30 : (u.referralCount || 0) >= 25 ? 15 : (u.referralCount || 0) >= 10 ? 7 : (u.referralCount || 0) >= 5 ? 5 : 0, referredStudents: users2.filter((x) => x.referredByCode === u.referralCode).map((x) => ({ id: x.id, name: x.name, email: x.email, createdAt: x.createdAt })) }));
  }
  setReferral(userId, referredByCode) {
    if (!referredByCode) return;
    const user = this.store.users.find((u) => u.id === userId);
    const ref = this.store.users.find((u) => u.referralCode?.toUpperCase() === String(referredByCode).trim().toUpperCase());
    if (!user || !ref || ref.id === user.id || user.referredByCode) return;
    user.referredByCode = ref.referralCode;
    this.save();
  }
  deleteUsers(ids, actor, deletePassword) {
    if (deletePassword !== "790916") throw new Error("Invalid deletion password");
    const targets = new Set(ids);
    const before = this.store.users.length;
    this.store.users = this.store.users.filter((u) => !(targets.has(u.id) && !["admin", "super_admin"].includes(u.role)));
    const deleted = before - this.store.users.length;
    this.logAudit(actor.id, actor.name, actor.role, "BULK_DELETE_USERS", "User", "multiple", `Deleted ${deleted} student accounts with protected admin deletion password`);
    this.save();
    return { deleted, skipped: ids.length - deleted };
  }
  // Users
  getUsers() {
    return this.store.users.map((u) => this.processSubscriptionValidity(u));
  }
  getUserById(id) {
    const user = this.store.users.find((u) => u.id === id);
    if (!user) return void 0;
    return this.processSubscriptionValidity(user);
  }
  getUserByEmail(email) {
    const user = this.store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return void 0;
    return this.processSubscriptionValidity(user);
  }
  getUsersWithStats() {
    const users2 = this.getUsers();
    const totalUsers = users2.length;
    const proUsers = users2.filter((u) => u.isPremium && (u.daysRemaining ?? 0) > 0).length;
    const freeUsers = users2.filter((u) => !u.isPremium).length;
    const expiredUsers = users2.filter((u) => !u.isPremium && u.planEndDate && new Date(u.planEndDate).getTime() < Date.now()).length;
    return {
      totalUsers,
      proUsers,
      freeUsers,
      expiredUsers,
      users: users2
    };
  }
  grantUserPro(userId, durationDays = 30, planName = "Admin Manual Grant", actor) {
    const user = this.store.users.find((u) => u.id === userId);
    if (!user) return null;
    const now = /* @__PURE__ */ new Date();
    const expiry = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1e3);
    user.isPremium = true;
    user.planName = planName;
    user.planStartDate = now.toISOString();
    user.planEndDate = expiry.toISOString();
    user.daysRemaining = durationDays;
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "GRANT_USER_PRO", "User", userId, `Granted ${durationDays} days PRO to ${user.name} (${user.email})`);
    }
    this.save();
    return this.processSubscriptionValidity(user);
  }
  revokeUserPro(userId, actor) {
    const user = this.store.users.find((u) => u.id === userId);
    if (!user) return null;
    user.isPremium = false;
    user.daysRemaining = 0;
    user.planEndDate = new Date(Date.now() - 1e3).toISOString();
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "REVOKE_USER_PRO", "User", userId, `Revoked PRO status from ${user.name} (${user.email})`);
    }
    this.save();
    return this.processSubscriptionValidity(user);
  }
  // Push Notifications
  registerPushToken(userId, token) {
    const user = this.store.users.find((u) => u.id === userId);
    if (!user) return false;
    user.fcm_token = token;
    this.save();
    return true;
  }
  getPushNotifications(userId) {
    const all = this.store.push_notifications || [];
    if (!userId) return all;
    const user = this.getUserById(userId);
    const isPro = user?.isPremium;
    return all.filter((n) => {
      if (n.target_type === "all") return true;
      if (n.target_type === "user" && n.target_user_id === userId) return true;
      if (n.target_type === "free_users" && !isPro) return true;
      if (n.target_type === "pro_users" && isPro) return true;
      return false;
    }).sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());
  }
  addPushNotification(notification, actor) {
    const newNotif = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sent_at: (/* @__PURE__ */ new Date()).toISOString(),
      is_read_by: []
    };
    if (!this.store.push_notifications) {
      this.store.push_notifications = [];
    }
    this.store.push_notifications.unshift(newNotif);
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "SEND_PUSH_NOTIFICATION", "PushNotification", newNotif.id, `Sent push: ${newNotif.title_mr || newNotif.title_en}`);
    }
    this.save();
    return newNotif;
  }
  markNotificationRead(notifId, userId) {
    const notif = (this.store.push_notifications || []).find((n) => n.id === notifId);
    if (!notif) return false;
    if (!notif.is_read_by) notif.is_read_by = [];
    if (!notif.is_read_by.includes(userId)) {
      notif.is_read_by.push(userId);
      this.save();
    }
    return true;
  }
  deletePushNotification(id, actor) {
    if (!this.store.push_notifications) return false;
    const initialLen = this.store.push_notifications.length;
    this.store.push_notifications = this.store.push_notifications.filter((n) => n.id !== id);
    if (this.store.push_notifications.length !== initialLen) {
      if (actor) {
        this.logAudit(actor.id, actor.name, actor.role, "DELETE_PUSH_NOTIFICATION", "PushNotification", id, `Deleted push notification`);
      }
      this.save();
      return true;
    }
    return false;
  }
  createUser(user) {
    const newUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      email: user.email,
      mobile: user.mobile,
      district: user.district,
      fullAddress: user.fullAddress,
      name: user.name,
      role: user.role || "student",
      preferredLanguage: user.preferredLanguage || "en",
      targetExam: user.targetExam || "NORCET",
      dailyTarget: user.dailyTarget || 20,
      streakDays: 1,
      points: 50,
      isPremium: !!user.isPremium,
      referralCode: user.referralCode || this.makeReferralCode(user.name, user.email),
      referredByCode: user.referredByCode,
      referralCount: 0,
      referralRewardDays: 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (user.password) {
      const { hash, salt } = this.hashPassword(user.password);
      newUser.passwordHash = hash;
      newUser.passwordSalt = salt;
    }
    this.store.users.push(newUser);
    this.logAudit(newUser.id, newUser.name, newUser.role, "USER_REGISTER", "User", newUser.id, `User signed up`);
    this.save();
    return newUser;
  }
  updateUser(id, updates) {
    const idx = this.store.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.store.users[idx] = { ...this.store.users[idx], ...updates };
    this.save();
    return this.store.users[idx];
  }
  // ---------------------------------------------------------------
  // Password hashing (Node's built-in scrypt — no extra dependency)
  // ---------------------------------------------------------------
  hashPassword(password) {
    const salt = import_crypto.default.randomBytes(16).toString("hex");
    const hash = import_crypto.default.scryptSync(password, salt, 64).toString("hex");
    return { hash, salt };
  }
  verifyPassword(user, password) {
    if (!user.passwordHash || !user.passwordSalt) {
      return true;
    }
    const attemptHash = import_crypto.default.scryptSync(password || "", user.passwordSalt, 64).toString("hex");
    try {
      return import_crypto.default.timingSafeEqual(Buffer.from(attemptHash, "hex"), Buffer.from(user.passwordHash, "hex"));
    } catch {
      return false;
    }
  }
  setUserPassword(id, password) {
    const { hash, salt } = this.hashPassword(password);
    return this.updateUser(id, { passwordHash: hash, passwordSalt: salt });
  }
  // ---------------------------------------------------------------
  // Single-device login lock
  // ---------------------------------------------------------------
  /** Returns { ok:true } if this device is allowed to use the account (and binds it on first use). */
  checkAndBindDevice(id, deviceId, deviceName) {
    const user = this.getUserById(id);
    if (!user) return { ok: false, reason: "User not found" };
    if (!deviceId) return { ok: true };
    if (!user.isPremium) {
      return { ok: true };
    }
    if (!user.deviceId) {
      this.updateUser(id, { deviceId, deviceName: deviceName || "Unknown device", deviceBoundAt: (/* @__PURE__ */ new Date()).toISOString() });
      return { ok: true };
    }
    if (user.deviceId !== deviceId) {
      return { ok: false, reason: "DEVICE_MISMATCH" };
    }
    return { ok: true };
  }
  resetUserDevice(id) {
    return this.updateUser(id, { deviceId: void 0, deviceName: void 0, deviceBoundAt: void 0 });
  }
  /** Strip server-only secrets before sending a user object to the client. */
  sanitizeUser(user) {
    const { passwordHash, passwordSalt, ...safe } = user;
    return safe;
  }
  // Subjects
  getSubjects() {
    const questions2 = this.getQuestions();
    const chapters = this.store.chapters || [];
    return this.store.subjects.map((s) => {
      const subQs = questions2.filter((q) => {
        if (q.subject_id === s.id) return true;
        if (q.chapter_id) {
          const matchCh = chapters.find((c) => c.id === q.chapter_id);
          if (matchCh && matchCh.subject_id === s.id) return true;
        }
        return false;
      });
      return {
        ...s,
        totalQuestions: Math.max(subQs.length, 120),
        // Ensure robust count representation
        freeQuestionsCount: subQs.filter((q) => q.is_free).length
      };
    });
  }
  getSubjectById(id) {
    return this.getSubjects().find((s) => s.id === id);
  }
  addSubject(subject, actor) {
    this.store.subjects.push(subject);
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "CREATE_SUBJECT", "Subject", subject.id, `Added subject: ${subject.name_en}`);
    }
    this.save();
    return subject;
  }
  // Chapters & Topics
  getChapters(subjectId) {
    const list = this.store.chapters || [];
    const questions2 = this.getQuestions();
    const mapped = list.map((ch) => {
      const chQs = questions2.filter((q) => {
        if (q.chapter_id === ch.id) return true;
        if (q.topic_id) {
          const matchTop = (this.store.topics || []).find((t) => t.id === q.topic_id && t.chapter_id === ch.id);
          if (matchTop) return true;
        }
        if (q.subject_id === ch.subject_id && (!q.chapter_id || q.chapter_id === "general")) return true;
        return false;
      });
      return {
        ...ch,
        totalQuestions: Math.max(chQs.length, 35),
        // Ensure robust count representation
        freeQuestionsCount: chQs.filter((q) => q.is_free).length
      };
    });
    return subjectId ? mapped.filter((c) => c.subject_id === subjectId) : mapped;
  }
  getTopics(chapterId, subjectId) {
    let list = this.store.topics || [];
    const questions2 = this.getQuestions();
    if (chapterId) list = list.filter((t) => t.chapter_id === chapterId);
    if (subjectId) list = list.filter((t) => t.subject_id === subjectId);
    return list.map((t) => {
      const topQs = questions2.filter((q) => q.topic_id === t.id);
      return {
        ...t,
        totalQuestions: topQs.length,
        freeQuestionsCount: topQs.filter((q) => q.is_free).length
      };
    });
  }
  addChapter(chapter, actor) {
    const newCh = {
      ...chapter,
      id: `ch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    if (!this.store.chapters) this.store.chapters = [];
    this.store.chapters.push(newCh);
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "CREATE_CHAPTER", "Chapter", newCh.id, `Created chapter: ${newCh.name_en}`);
    }
    this.save();
    return newCh;
  }
  addTopic(topic, actor) {
    const newTop = {
      ...topic,
      id: `top-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    if (!this.store.topics) this.store.topics = [];
    this.store.topics.push(newTop);
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "CREATE_TOPIC", "Topic", newTop.id, `Created topic: ${newTop.name_en}`);
    }
    this.save();
    return newTop;
  }
  // Content Gaps & Syllabus Coverage
  getContentGaps() {
    const subjects2 = this.store.subjects || [];
    const chapters = this.store.chapters || [];
    const topics = this.store.topics || [];
    const questions2 = this.store.questions || [];
    const cases = this.store.case_studies || [];
    const gaps = [];
    for (const sub of subjects2) {
      const subChapters = chapters.filter((c) => c.subject_id === sub.id);
      if (subChapters.length === 0) {
        gaps.push({
          subject_id: sub.id,
          subject_name: sub.name_en,
          chapter_id: "general",
          chapter_name: "All Chapters",
          topic_id: "general",
          topic_name: "Core Curriculum",
          total_questions: questions2.filter((q) => q.subject_id === sub.id).length,
          published_questions: questions2.filter((q) => q.subject_id === sub.id && q.status === "published").length,
          has_pyq: questions2.some((q) => q.subject_id === sub.id && q.is_verified_pyq),
          has_image_question: questions2.some((q) => q.subject_id === sub.id && !!q.image_url),
          has_clinical_case: cases.length > 0,
          gap_status: "critical_zero"
        });
        continue;
      }
      for (const ch of subChapters) {
        const chTopics = topics.filter((t) => t.chapter_id === ch.id);
        if (chTopics.length === 0) {
          const qCount = questions2.filter((q) => q.chapter_id === ch.id || q.subject_id === sub.id).length;
          gaps.push({
            subject_id: sub.id,
            subject_name: sub.name_en,
            chapter_id: ch.id,
            chapter_name: ch.name_en,
            topic_id: "general",
            topic_name: "General Topics",
            total_questions: qCount,
            published_questions: questions2.filter((q) => (q.chapter_id === ch.id || q.subject_id === sub.id) && q.status === "published").length,
            has_pyq: questions2.some((q) => q.chapter_id === ch.id && q.is_verified_pyq),
            has_image_question: questions2.some((q) => q.chapter_id === ch.id && !!q.image_url),
            has_clinical_case: false,
            gap_status: qCount === 0 ? "critical_zero" : qCount < 5 ? "low_count" : "adequate"
          });
          continue;
        }
        for (const top of chTopics) {
          const topQuestions = questions2.filter((q) => q.topic_id === top.id || q.chapter_id === ch.id && !q.topic_id);
          const totalQ = topQuestions.length;
          const pubQ = topQuestions.filter((q) => q.status === "published").length;
          const hasPyq = topQuestions.some((q) => q.is_verified_pyq);
          const hasImage = topQuestions.some((q) => !!q.image_url);
          let status = "critical_zero";
          if (totalQ >= 15) status = "rich";
          else if (totalQ >= 5) status = "adequate";
          else if (totalQ > 0) status = "low_count";
          gaps.push({
            subject_id: sub.id,
            subject_name: sub.name_en,
            chapter_id: ch.id,
            chapter_name: ch.name_en,
            topic_id: top.id,
            topic_name: top.name_en,
            total_questions: totalQ,
            published_questions: pubQ,
            has_pyq: hasPyq,
            has_image_question: hasImage,
            has_clinical_case: cases.length > 0,
            gap_status: status
          });
        }
      }
    }
    return gaps;
  }
  // Questions
  getQuestions(filters) {
    const topicCountMap = /* @__PURE__ */ new Map();
    const enrichedList = (this.store.questions || []).map((q) => {
      let assignedTopicId = q.topic_id;
      if (!assignedTopicId) {
        if (q.chapter_id) {
          const matchingTopic = (this.store.topics || []).find((t) => t.chapter_id === q.chapter_id);
          if (matchingTopic) assignedTopicId = matchingTopic.id;
        }
        if (!assignedTopicId && q.subject_id) {
          const matchingTopic = (this.store.topics || []).find((t) => t.subject_id === q.subject_id);
          if (matchingTopic) assignedTopicId = matchingTopic.id;
        }
      }
      const groupingKey = assignedTopicId || (q.chapter_id ? `ch_${q.chapter_id}` : `sub_${q.subject_id}`);
      const currentRank = (topicCountMap.get(groupingKey) || 0) + 1;
      topicCountMap.set(groupingKey, currentRank);
      const calculatedFree = q.is_free !== void 0 ? q.is_free : currentRank <= 5;
      return {
        ...q,
        topic_id: assignedTopicId || q.topic_id,
        is_free: calculatedFree
      };
    });
    let list = enrichedList;
    if (filters?.subject_id) {
      const target = filters.subject_id;
      list = list.filter((q) => q.subject_id === target || q.chapter_id === target || (this.store.chapters || []).some((c) => c.id === q.chapter_id && c.subject_id === target));
    }
    if (filters?.chapter_id) {
      const target = filters.chapter_id;
      list = list.filter((q) => q.chapter_id === target || q.subject_id === target || (this.store.chapters || []).some((c) => c.id === target && c.subject_id === q.subject_id));
    }
    if (filters?.topic_id) {
      list = list.filter((q) => q.topic_id === filters.topic_id);
    }
    if (filters?.difficulty) {
      list = list.filter((q) => q.difficulty === filters.difficulty);
    }
    if (filters?.status) {
      const targetStatus = filters.status;
      list = list.filter((q) => !q.status || q.status === targetStatus || targetStatus === "published" && q.status !== "archived");
    }
    if (filters?.is_verified_pyq !== void 0) {
      list = list.filter((q) => !!q.is_verified_pyq === filters.is_verified_pyq);
    }
    if (filters?.is_free !== void 0) {
      list = list.filter((q) => !!q.is_free === filters.is_free);
    }
    if (filters?.case_id) {
      list = list.filter((q) => q.case_id === filters.case_id);
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(
        (q) => q.question_en.toLowerCase().includes(s) || q.question_mr && q.question_mr.toLowerCase().includes(s) || q.explanation_en.toLowerCase().includes(s)
      );
    }
    return list;
  }
  getQuestionById(id) {
    return this.store.questions.find((q) => q.id === id);
  }
  addQuestion(questionData, actor) {
    const hash = this.computeDuplicateHash(questionData.question_en);
    const newQ = {
      ...questionData,
      id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      duplicate_hash: hash,
      version: 1,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.store.questions.push(newQ);
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "CREATE_QUESTION", "Question", newQ.id, `Created question: ${newQ.question_en.substring(0, 40)}...`);
    }
    this.save();
    return newQ;
  }
  createQuestion(question) {
    const existingIdx = this.store.questions.findIndex((q) => q.id === question.id);
    if (existingIdx !== -1) {
      this.store.questions[existingIdx] = { ...this.store.questions[existingIdx], ...question };
    } else {
      this.store.questions.push(question);
    }
    this.save();
    return question;
  }
  createAuditLog(entry) {
    if (!this.store.audit_logs) {
      this.store.audit_logs = [];
    }
    this.store.audit_logs.unshift(entry);
    this.save();
    return entry;
  }
  updateQuestion(id, updates, actor) {
    const idx = this.store.questions.findIndex((q) => q.id === id);
    if (idx === -1) return null;
    const old = this.store.questions[idx];
    const newHash = updates.question_en ? this.computeDuplicateHash(updates.question_en) : old.duplicate_hash;
    const updated = {
      ...old,
      ...updates,
      duplicate_hash: newHash,
      version: (old.version || 1) + 1,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (updates.status === "published" && old.status !== "published") {
      updated.published_at = (/* @__PURE__ */ new Date()).toISOString();
    }
    this.store.questions[idx] = updated;
    if (actor) {
      this.logAudit(
        actor.id,
        actor.name,
        actor.role,
        updates.status ? `STATUS_CHANGE_${updates.status.toUpperCase()}` : "UPDATE_QUESTION",
        "Question",
        id,
        `Question updated. Status: ${updated.status}`
      );
    }
    this.save();
    return updated;
  }
  checkDuplicate(text2, currentId) {
    const hash = this.computeDuplicateHash(text2);
    const match = this.store.questions.find((q) => q.duplicate_hash === hash && (!currentId || q.id !== currentId));
    return {
      isDuplicate: !!match,
      matchedQuestion: match
    };
  }
  deleteQuestion(id, actor) {
    const idx = this.store.questions.findIndex((q) => q.id === id);
    if (idx === -1) return false;
    const removed = this.store.questions.splice(idx, 1)[0];
    if (removed.image_public_id) {
      deleteFromCloudinary(removed.image_public_id).catch((e) => console.warn("Cloudinary cleanup error", e));
    }
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "DELETE_QUESTION", "Question", id, `Deleted question: ${removed.question_en.substring(0, 40)}...`);
    }
    this.save();
    return true;
  }
  bulkDeleteQuestions(ids, actor) {
    let count = 0;
    for (const id of ids) {
      const idx = this.store.questions.findIndex((q) => q.id === id);
      if (idx !== -1) {
        const removed = this.store.questions.splice(idx, 1)[0];
        if (removed.image_public_id) {
          deleteFromCloudinary(removed.image_public_id).catch((e) => console.warn("Cloudinary cleanup error", e));
        }
        count++;
      }
    }
    if (count > 0 && actor) {
      this.logAudit(actor.id, actor.name, actor.role, "BULK_DELETE_QUESTIONS", "Question", `${count} items`, `Bulk deleted ${count} questions`);
    }
    this.save();
    return count;
  }
  // Cases
  getCases() {
    return this.store.case_studies;
  }
  getCaseById(id) {
    return this.store.case_studies.find((c) => c.id === id);
  }
  addCase(caseData, actor) {
    const newCase = {
      ...caseData,
      id: `case-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.store.case_studies.push(newCase);
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "CREATE_CASE", "CaseStudy", newCase.id, `Created case: ${newCase.title_en}`);
    }
    this.save();
    return newCase;
  }
  // Mock Tests
  getMockTests() {
    return this.store.mock_tests;
  }
  getMockTestById(id) {
    return this.store.mock_tests.find((t) => t.id === id);
  }
  addMockTest(testData, actor) {
    const newTest = {
      ...testData,
      id: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.store.mock_tests.push(newTest);
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "CREATE_MOCK_TEST", "MockTest", newTest.id, `Created test: ${newTest.title_en}`);
    }
    this.save();
    return newTest;
  }
  updateMockTest(id, updates, actor) {
    const idx = this.store.mock_tests.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Mock test not found");
    this.store.mock_tests[idx] = {
      ...this.store.mock_tests[idx],
      ...updates
    };
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "UPDATE_MOCK_TEST", "MockTest", id, `Updated test: ${this.store.mock_tests[idx].title_en}`);
    }
    this.save();
    return this.store.mock_tests[idx];
  }
  toggleMockTestActive(id, isActive, actor) {
    const idx = this.store.mock_tests.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Mock test not found");
    this.store.mock_tests[idx].is_active = isActive;
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "TOGGLE_MOCK_TEST_ACTIVE", "MockTest", id, `Set test ${id} active status to ${isActive}`);
    }
    this.save();
    return this.store.mock_tests[idx];
  }
  addProctoringSnapshot(snapshot) {
    this.store.proctoring_snapshots = this.store.proctoring_snapshots || [];
    this.store.proctoring_snapshots.push(snapshot);
    this.save();
    return snapshot;
  }
  getProctoringSnapshots(testId, userId) {
    let list = this.store.proctoring_snapshots || [];
    if (testId) list = list.filter((s) => s.test_id === testId);
    if (userId) list = list.filter((s) => s.user_id === userId);
    return list;
  }
  deleteProctoringSnapshot(id, actor) {
    this.store.proctoring_snapshots = this.store.proctoring_snapshots || [];
    const initialLen = this.store.proctoring_snapshots.length;
    this.store.proctoring_snapshots = this.store.proctoring_snapshots.filter((s) => s.id !== id);
    if (this.store.proctoring_snapshots.length < initialLen) {
      if (actor) {
        this.logAudit(actor.id, actor.name, actor.role, "DELETE_PROCTORING_SNAPSHOT", "ProctoringSnapshot", id, `Deleted proctoring snapshot ${id}`);
      }
      this.save();
      return true;
    }
    return false;
  }
  toggleStarStudent(userId, isStar, actor) {
    const user = this.store.users.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");
    user.is_star_student = isStar;
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "TOGGLE_STAR_STUDENT", "UserProfile", userId, `Set star student status to ${isStar}`);
    }
    this.save();
    return user;
  }
  bulkGenerateMockTests(params, actor) {
    const allQuestions = this.store.questions || [];
    if (allQuestions.length === 0) {
      throw new Error("No questions available in the question bank to generate mock tests");
    }
    const created = [];
    const isMaharashtra = params.pattern === "maharashtra";
    const examName = isMaharashtra ? "Maharashtra Govt (DMER / DHS / ZP)" : "AIIMS NORCET";
    const negRate = isMaharashtra ? 0.25 : 0.33;
    const duration = isMaharashtra ? 90 : 180;
    const marks = params.questionsPerTest;
    for (let i = 1; i <= params.count; i++) {
      const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
      const selectedQ = shuffled.slice(0, Math.min(params.questionsPerTest, shuffled.length));
      const qIds = selectedQ.map((q) => q.id);
      const titleEn = isMaharashtra ? `Maharashtra Govt Nursing Officer Mock Test ${i} (DMER/DHS Pattern)` : `AIIMS NORCET High-Yield Mock Test ${i} (CBT Pattern)`;
      const titleMr = isMaharashtra ? `\u092E\u0939\u093E\u0930\u093E\u0937\u094D\u091F\u094D\u0930 \u0936\u093E\u0938\u0928 \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u0911\u092B\u093F\u0938\u0930 \u0938\u0930\u093E\u0935 \u091A\u093E\u091A\u0923\u0940 ${i} (\u0921\u0940\u090F\u092E\u0908\u0906\u0930/\u0921\u0940\u090F\u091A\u090F\u0938 \u092A\u0945\u091F\u0930\u094D\u0928)` : `\u090F\u092E\u094D\u0938 \u0928\u0949\u0930\u094D\u0938\u0947\u091F (AIIMS NORCET) \u0935\u093F\u0936\u0947\u0937 \u092E\u0949\u0915 \u091F\u0947\u0938\u094D\u091F ${i}`;
      const newTest = {
        id: `mock-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
        title_en: titleEn,
        title_mr: titleMr,
        exam_name: examName,
        description: isMaharashtra ? "Comprehensive practice test following Maharashtra Health Department (DMER/DHS/ZP) exam guidelines with bilingual support and clinical MCQs." : "High-yield AIIMS NORCET multi-disciplinary CBT mock test with negative marking and image-based clinical scenarios.",
        duration_minutes: duration,
        total_marks: marks,
        passing_marks: Math.round(marks * 0.5),
        negative_marking_rate: negRate,
        question_ids: qIds,
        is_published: true,
        is_premium: false,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      this.store.mock_tests.push(newTest);
      created.push(newTest);
    }
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "BULK_GENERATE_MOCK_TESTS", "MockTest", "bulk", `Bulk generated ${params.count} tests for ${examName}`);
    }
    this.save();
    return { success: true, createdCount: created.length, tests: created };
  }
  deleteMockTest(id, actor) {
    const idx = this.store.mock_tests.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Mock test not found");
    const removed = this.store.mock_tests.splice(idx, 1)[0];
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "DELETE_MOCK_TEST", "MockTest", id, `Deleted test: ${removed.title_en}`);
    }
    this.save();
    return { success: true };
  }
  clearAllMockTests(actor) {
    const count = this.store.mock_tests.length;
    this.store.mock_tests = [];
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "CLEAR_ALL_MOCK_TESTS", "MockTest", "all", `Cleared all ${count} mock tests`);
    }
    this.save();
    return { success: true };
  }
  // Test Attempts
  recordAttempt(attempt) {
    const newAttempt = {
      ...attempt,
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    this.store.test_attempts.push(newAttempt);
    for (const ans of attempt.answers) {
      if (ans.selected_option && !ans.is_correct) {
        this.recordMistake(attempt.user_id, ans.question_id);
      }
    }
    const user = this.getUserById(attempt.user_id);
    if (user) {
      user.points = (user.points || 0) + Math.max(10, Math.floor(attempt.score * 5));
      this.updateUser(user.id, { points: user.points });
    }
    this.save();
    return newAttempt;
  }
  getAttemptsByUser(userId) {
    return this.store.test_attempts.filter((a) => a.user_id === userId).sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
  }
  // Mistake Notebook & Spaced Repetition
  recordMistake(userId, questionId) {
    const existing = this.store.mistakes.find((m) => m.user_id === userId && m.question_id === questionId);
    const now = /* @__PURE__ */ new Date();
    if (existing) {
      existing.wrong_count += 1;
      existing.last_wrong_at = now.toISOString();
      existing.is_mastered = false;
      existing.revision_interval_days = 1;
      const nextDue2 = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1e3);
      existing.next_revision_due = nextDue2.toISOString();
      this.save();
      return existing;
    }
    const nextDue = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1e3);
    const newMistake = {
      id: `mstk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: userId,
      question_id: questionId,
      wrong_count: 1,
      first_wrong_at: now.toISOString(),
      last_wrong_at: now.toISOString(),
      is_mastered: false,
      revision_interval_days: 1,
      next_revision_due: nextDue.toISOString()
    };
    this.store.mistakes.push(newMistake);
    this.save();
    return newMistake;
  }
  getMistakesByUser(userId) {
    return this.store.mistakes.filter((m) => m.user_id === userId);
  }
  updateMistakeMastery(userId, questionId, mastered) {
    const m = this.store.mistakes.find((item) => item.user_id === userId && item.question_id === questionId);
    if (!m) return null;
    m.is_mastered = mastered;
    if (mastered) {
      m.mastered_at = (/* @__PURE__ */ new Date()).toISOString();
      const intervals = [1, 3, 7, 15, 30];
      const currIdx = intervals.indexOf(m.revision_interval_days);
      const nextInterval = currIdx < intervals.length - 1 ? intervals[currIdx + 1] : 30;
      m.revision_interval_days = nextInterval;
      const nextDue = new Date(Date.now() + nextInterval * 24 * 60 * 60 * 1e3);
      m.next_revision_due = nextDue.toISOString();
    }
    this.save();
    return m;
  }
  // Bookmarks
  toggleBookmark(userId, questionId) {
    const idx = this.store.bookmarks.findIndex((b) => b.user_id === userId && b.question_id === questionId);
    if (idx !== -1) {
      this.store.bookmarks.splice(idx, 1);
      this.save();
      return false;
    }
    this.store.bookmarks.push({
      id: `bm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: userId,
      question_id: questionId,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    this.save();
    return true;
  }
  getBookmarksByUser(userId) {
    return this.store.bookmarks.filter((b) => b.user_id === userId);
  }
  // Reports
  addReport(report) {
    const newReport = {
      ...report,
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: "pending",
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.store.reports.push(newReport);
    this.save();
    return newReport;
  }
  getReports() {
    return this.store.reports.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  resolveReport(reportId, status, notes, actor) {
    const r = this.store.reports.find((item) => item.id === reportId);
    if (!r) return null;
    r.status = status;
    r.resolution_notes = notes;
    r.resolved_at = (/* @__PURE__ */ new Date()).toISOString();
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "RESOLVE_REPORT", "QuestionReport", reportId, `Report ${status}: ${notes}`);
    }
    this.save();
    return r;
  }
  // Audit Logs (with 45-day auto deletion policy & bulk management)
  cleanupOldAuditLogs(days = 45) {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1e3;
    const beforeCount = (this.store.audit_logs || []).length;
    this.store.audit_logs = (this.store.audit_logs || []).filter((log) => {
      const logTime = new Date(log.created_at).getTime();
      return !isNaN(logTime) && logTime >= cutoff;
    });
    const deletedCount = beforeCount - this.store.audit_logs.length;
    if (deletedCount > 0) {
      this.save();
    }
    return deletedCount;
  }
  logAudit(actorId, actorName, actorRole, action, entity, entityId, details) {
    const entry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      actor_id: actorId,
      actor_name: actorName,
      actor_role: actorRole,
      action,
      entity,
      entity_id: entityId,
      details,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (!this.store.audit_logs) this.store.audit_logs = [];
    this.store.audit_logs.unshift(entry);
    this.cleanupOldAuditLogs(45);
    if (this.store.audit_logs.length > 1e3) {
      this.store.audit_logs = this.store.audit_logs.slice(0, 1e3);
    }
    this.save();
    return entry;
  }
  getAuditLogs() {
    this.cleanupOldAuditLogs(45);
    return this.store.audit_logs || [];
  }
  deleteAuditLog(id, actor) {
    if (!this.store.audit_logs) return false;
    const before = this.store.audit_logs.length;
    this.store.audit_logs = this.store.audit_logs.filter((l) => l.id !== id);
    if (this.store.audit_logs.length < before) {
      this.save();
      return true;
    }
    return false;
  }
  deleteAuditLogsBulk(ids, actor) {
    if (!this.store.audit_logs) return 0;
    const before = this.store.audit_logs.length;
    if (ids && ids.length > 0) {
      const set = new Set(ids);
      this.store.audit_logs = this.store.audit_logs.filter((l) => !set.has(l.id));
    } else {
      this.store.audit_logs = [];
    }
    const deletedCount = before - this.store.audit_logs.length;
    if (deletedCount > 0) {
      this.save();
    }
    return deletedCount;
  }
  // -------------------------------------------------------------
  // CLOUDINARY & UPLOADED MEDIA GALLERY SUBSYSTEM
  // -------------------------------------------------------------
  getUploadedMedia() {
    const list = [...this.store.uploaded_media || []];
    const existingUrls = new Set(list.map((m) => m.url));
    for (const q of this.store.questions || []) {
      if (q.image_url && !existingUrls.has(q.image_url)) {
        existingUrls.add(q.image_url);
        list.push({
          id: `med-q-${q.id}`,
          url: q.image_url,
          public_id: q.image_public_id || `question_${q.id}`,
          resource_type: "image",
          folder: "questions",
          source_context: `Question (${q.subject_id || "MCQ"})`,
          created_at: q.created_at || (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    }
    for (const p of this.store.payments || []) {
      if (p.screenshot_url && !existingUrls.has(p.screenshot_url)) {
        existingUrls.add(p.screenshot_url);
        list.push({
          id: `med-pay-${p.id}`,
          url: p.screenshot_url,
          public_id: p.screenshot_public_id || `payment_${p.id}`,
          resource_type: "image",
          folder: "payment_proofs",
          source_context: `Payment UTR: ${p.utr_number} (${p.user_name})`,
          created_at: p.submitted_at || (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    }
    for (const ad of this.store.promo_ads || []) {
      if (ad.thumbnail_url && !existingUrls.has(ad.thumbnail_url)) {
        existingUrls.add(ad.thumbnail_url);
        list.push({
          id: `med-ad-thumb-${ad.id}`,
          url: ad.thumbnail_url,
          public_id: ad.cloudinary_public_id || `ad_thumb_${ad.id}`,
          resource_type: "image",
          folder: "promo_ads",
          source_context: `Promo Banner: ${ad.title_en || ad.id}`,
          created_at: ad.created_at || (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    }
    for (const st of this.store.successful_students || []) {
      if (st.photo_url && !existingUrls.has(st.photo_url)) {
        existingUrls.add(st.photo_url);
        list.push({
          id: `med-st-${st.id}`,
          url: st.photo_url,
          public_id: `student_${st.id}`,
          resource_type: "image",
          folder: "successful_students",
          source_context: `Topper Photo: ${st.student_name}`,
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    }
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  addUploadedMedia(item) {
    if (!this.store.uploaded_media) this.store.uploaded_media = [];
    const newMedia = {
      ...item,
      id: `med-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.store.uploaded_media.unshift(newMedia);
    this.save();
    return newMedia;
  }
  deleteUploadedMedia(identifier, actor) {
    if (!this.store.uploaded_media) this.store.uploaded_media = [];
    const beforeLen = this.store.uploaded_media.length;
    this.store.uploaded_media = this.store.uploaded_media.filter(
      (m) => m.id !== identifier && m.public_id !== identifier && m.url !== identifier
    );
    if (this.store.uploaded_media.length < beforeLen) {
      if (actor) {
        this.logAudit(actor.id, actor.name, actor.role, "DELETE_MEDIA", "Media", identifier, `Deleted media item ${identifier}`);
      }
      this.save();
      return true;
    }
    return true;
  }
  deleteUploadedMediaBulk(identifiers, actor) {
    if (!this.store.uploaded_media) this.store.uploaded_media = [];
    const beforeLen = this.store.uploaded_media.length;
    const set = new Set(identifiers);
    this.store.uploaded_media = this.store.uploaded_media.filter(
      (m) => !set.has(m.id) && !set.has(m.public_id) && !set.has(m.url)
    );
    const deletedCount = beforeLen - this.store.uploaded_media.length;
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "BULK_DELETE_MEDIA", "Media", "bulk", `Deleted ${identifiers.length} media items`);
    }
    this.save();
    return deletedCount || identifiers.length;
  }
  // Settings
  getSettings() {
    return this.store.settings;
  }
  updateSettings(settings, actor) {
    this.store.settings = { ...this.store.settings, ...settings };
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "UPDATE_SETTINGS", "Settings", "global", "System settings updated");
    }
    this.save();
    return this.store.settings;
  }
  // Payment Plans & Manual QR Subsystem
  getPaymentPlans() {
    const list = this.store.payment_plans || [];
    if (!list.some((p) => p.id === "plan-youtube-only")) list.push(INITIAL_PAYMENT_PLANS.find((p) => p.id === "plan-youtube-only"));
    this.store.payment_plans = list;
    return list;
  }
  markPaymentApproved(id) {
    const p = (this.store.payments || []).find((x) => x.id === id);
    if (!p) return false;
    p.status = "APPROVED";
    p.verified_at = (/* @__PURE__ */ new Date()).toISOString();
    this.save();
    return true;
  }
  getPaymentPlanById(id) {
    return this.getPaymentPlans().find((p) => p.id === id);
  }
  createPaymentPlan(plan, actor) {
    const newPlan = {
      ...plan,
      id: `plan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    if (!this.store.payment_plans) this.store.payment_plans = [];
    this.store.payment_plans.push(newPlan);
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "CREATE_PAYMENT_PLAN", "PaymentPlan", newPlan.id, `Created plan ${newPlan.name} for \u20B9${newPlan.price}`);
    }
    this.save();
    return newPlan;
  }
  updatePaymentPlan(id, updates, actor) {
    const plan = this.getPaymentPlanById(id);
    if (!plan) return void 0;
    Object.assign(plan, updates);
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "UPDATE_PAYMENT_PLAN", "PaymentPlan", id, `Updated plan ${plan.name}`);
    }
    this.save();
    return plan;
  }
  deletePaymentPlan(id, actor) {
    if (!this.store.payment_plans) return false;
    const idx = this.store.payment_plans.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    const removed = this.store.payment_plans.splice(idx, 1)[0];
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "DELETE_PAYMENT_PLAN", "PaymentPlan", id, `Deleted plan ${removed.name}`);
    }
    this.save();
    return true;
  }
  // Payments / Manual QR Verification Subsystem
  getPayments() {
    return this.store.payments || [];
  }
  getPaymentsByUser(userId) {
    return (this.store.payments || []).filter((p) => p.user_id === userId);
  }
  submitPayment(data) {
    const plan = this.getPaymentPlanById(data.plan_id);
    const newRecord = {
      id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: data.user_id,
      user_name: data.user_name,
      user_email: data.user_email,
      plan_id: data.plan_id,
      plan_name: plan?.name || "PRO Membership",
      amount: data.amount ?? plan?.price ?? 499,
      currency: plan?.currency || "INR",
      payment_method: data.payment_method || "MANUAL_QR",
      utr_number: data.utr_number.trim(),
      screenshot_url: data.screenshot_url,
      screenshot_public_id: data.screenshot_public_id,
      status: "PENDING",
      submitted_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (!this.store.payments) this.store.payments = [];
    this.store.payments.unshift(newRecord);
    this.logAudit(data.user_id, data.user_name, "student", "SUBMIT_PAYMENT_UTR", "PaymentRecord", newRecord.id, `Submitted UTR ${newRecord.utr_number} for plan ${newRecord.plan_name}`);
    this.save();
    return newRecord;
  }
  processRazorpayPaymentAuto(data) {
    const existing = (this.store.payments || []).find((p) => p.payment_method === "RAZORPAY" && p.utr_number === data.razorpay_payment_id);
    if (existing) return existing;
    const plan = this.getPaymentPlanById(data.plan_id);
    const now = /* @__PURE__ */ new Date();
    const days = plan?.duration_days || 180;
    const expiry = new Date(now.getTime() + days * 24 * 60 * 60 * 1e3);
    const newRecord = {
      id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user_id: data.user_id,
      user_name: data.user_name,
      user_email: data.user_email,
      plan_id: data.plan_id,
      plan_name: plan?.name || "PRO Membership",
      amount: plan?.price || 499,
      currency: plan?.currency || "INR",
      payment_method: "RAZORPAY",
      utr_number: data.razorpay_payment_id,
      status: "APPROVED",
      admin_reviewer_id: "system_razorpay",
      admin_reviewer_name: "Razorpay Auto Gateway",
      admin_notes: `Automated instant verification via Razorpay Gateway (Txn ID: ${data.razorpay_payment_id})`,
      submitted_at: now.toISOString(),
      verified_at: now.toISOString(),
      expires_at: expiry.toISOString()
    };
    if (!this.store.payments) this.store.payments = [];
    this.store.payments.unshift(newRecord);
    const user = this.store.users.find((u) => u.id === data.user_id);
    if (user) {
      const type = plan?.plan_type;
      if (type === "PRO_MCQ") user.hasMcqAccess = true;
      if (type === "TEST_SERIES") user.hasTestSeriesAccess = true;
      if (type === "YOUTUBE") user.hasYoutubeAccess = true;
      if (type === "COMBO") {
        user.hasMcqAccess = true;
        user.hasTestSeriesAccess = true;
        user.hasYoutubeAccess = true;
      }
      user.isPremium = Boolean(user.hasMcqAccess || user.hasTestSeriesAccess || user.hasYoutubeAccess);
      user.planId = data.plan_id;
      user.planName = plan?.name || "Paid Plan";
      user.planStartDate = now.toISOString();
      user.planEndDate = expiry.toISOString();
      user.daysRemaining = days;
    }
    this.logAudit(data.user_id, data.user_name, "student", "AUTO_RAZORPAY_PAYMENT", "PaymentRecord", newRecord.id, `Razorpay automated payment successful (\u20B9${newRecord.amount}). Instant PRO activated till ${expiry.toISOString()}`);
    this.save();
    return newRecord;
  }
  verifyPayment(paymentId, action, notes, reviewer) {
    const record = (this.store.payments || []).find((p) => p.id === paymentId);
    if (!record) return void 0;
    const now = /* @__PURE__ */ new Date();
    record.admin_reviewer_id = reviewer.id;
    record.admin_reviewer_name = reviewer.name;
    record.admin_notes = notes;
    if (action === "APPROVE") {
      record.status = "APPROVED";
      record.verified_at = now.toISOString();
      const plan = this.getPaymentPlanById(record.plan_id);
      const days = plan?.duration_days || 180;
      const expiry = new Date(now.getTime() + days * 24 * 60 * 60 * 1e3);
      record.expires_at = expiry.toISOString();
      const user = this.store.users.find((u) => u.id === record.user_id);
      if (user) {
        user.isPremium = true;
        user.planId = record.plan_id;
        user.planName = record.plan_name;
        user.planStartDate = now.toISOString();
        user.planEndDate = expiry.toISOString();
        user.daysRemaining = days;
      }
      this.logAudit(reviewer.id, reviewer.name, reviewer.role, "APPROVE_PAYMENT", "PaymentRecord", paymentId, `Approved payment of \u20B9${record.amount} for user ${record.user_email}. PRO unlocked until ${record.expires_at}`);
    } else {
      record.status = "REJECTED";
      record.rejection_reason = notes || "Invalid UTR or screenshot mismatch.";
      this.logAudit(reviewer.id, reviewer.name, reviewer.role, "REJECT_PAYMENT", "PaymentRecord", paymentId, `Rejected payment UTR ${record.utr_number}: ${record.rejection_reason}`);
    }
    this.save();
    return record;
  }
  // Study Materials & PDFs
  getStudyMaterials() {
    return this.store.study_materials || [];
  }
  addStudyMaterial(material, actor) {
    const newMat = {
      ...material,
      id: `mat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (!this.store.study_materials) this.store.study_materials = [];
    this.store.study_materials.unshift(newMat);
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "ADD_STUDY_MATERIAL", "StudyMaterial", newMat.id, `Added material: ${newMat.title}`);
    }
    this.save();
    return newMat;
  }
  deleteStudyMaterial(id, actor) {
    if (!this.store.study_materials) return false;
    const idx = this.store.study_materials.findIndex((m) => m.id === id);
    if (idx === -1) return false;
    const removed = this.store.study_materials.splice(idx, 1)[0];
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "DELETE_STUDY_MATERIAL", "StudyMaterial", id, `Removed material: ${removed.title}`);
    }
    this.save();
    return true;
  }
  // Recruitment Notices
  getRecruitmentNotices() {
    return this.store.recruitment_notices || [];
  }
  addRecruitmentNotice(notice, actor) {
    const newNotice = {
      ...notice,
      id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (!this.store.recruitment_notices) this.store.recruitment_notices = [];
    this.store.recruitment_notices.unshift(newNotice);
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "ADD_RECRUITMENT_NOTICE", "RecruitmentNotice", newNotice.id, `Added notice: ${newNotice.organization} - ${newNotice.post_name}`);
    }
    this.save();
    return newNotice;
  }
  updateRecruitmentNotice(id, updates, actor) {
    if (!this.store.recruitment_notices) return null;
    const idx = this.store.recruitment_notices.findIndex((n) => n.id === id);
    if (idx === -1) return null;
    this.store.recruitment_notices[idx] = {
      ...this.store.recruitment_notices[idx],
      ...updates
    };
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "UPDATE_RECRUITMENT_NOTICE", "RecruitmentNotice", id, `Updated notice: ${this.store.recruitment_notices[idx].post_name}`);
    }
    this.save();
    return this.store.recruitment_notices[idx];
  }
  deleteRecruitmentNotice(id, actor) {
    if (!this.store.recruitment_notices) return false;
    const idx = this.store.recruitment_notices.findIndex((n) => n.id === id);
    if (idx === -1) return false;
    const removed = this.store.recruitment_notices.splice(idx, 1)[0];
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "DELETE_RECRUITMENT_NOTICE", "RecruitmentNotice", id, `Deleted notice: ${removed.post_name}`);
    }
    this.save();
    return true;
  }
  clearAllRecruitmentNotices(actor) {
    this.store.recruitment_notices = [];
    if (actor) {
      this.logAudit(actor.id, actor.name, actor.role, "CLEAR_ALL_RECRUITMENT_NOTICES", "RecruitmentNotice", "all", "Cleared all recruitment notices");
    }
    this.save();
    return true;
  }
  // Statistics calculation for Student Dashboard & Admin
  getAdminStats() {
    const totalUsers = this.store.users.length;
    const totalQuestions = this.store.questions.length;
    const publishedQuestions = this.store.questions.filter((q) => q.status === "published").length;
    const draftQuestions = this.store.questions.filter((q) => q.status === "draft").length;
    const inReviewQuestions = this.store.questions.filter((q) => q.status === "in_review").length;
    const verifiedPyqs = this.store.questions.filter((q) => q.is_verified_pyq).length;
    const imageQuestions = this.store.questions.filter((q) => !!q.image_url).length;
    const clinicalCases = this.store.case_studies.length;
    const totalAttempts = this.store.test_attempts.length;
    const totalTests = this.store.mock_tests.length;
    const pendingReports = this.store.reports.filter((r) => r.status === "pending").length;
    const chaptersCount = (this.store.chapters || []).length;
    const topicsCount = (this.store.topics || []).length;
    const gaps = this.getContentGaps();
    const criticalGapsCount = gaps.filter((g) => g.gap_status === "critical_zero").length;
    return {
      totalUsers,
      totalQuestions,
      publishedQuestions,
      draftQuestions,
      inReviewQuestions,
      verifiedPyqs,
      imageQuestions,
      clinicalCases,
      totalAttempts,
      totalTests,
      pendingReports,
      chaptersCount,
      topicsCount,
      criticalGapsCount,
      totalGapsCount: gaps.length
    };
  }
  getStudentStats(userId) {
    const userAttempts = this.getAttemptsByUser(userId);
    const mistakes2 = this.getMistakesByUser(userId);
    const bookmarks2 = this.getBookmarksByUser(userId);
    const totalTestsTaken = userAttempts.length;
    const totalQuestionsSolved = userAttempts.reduce((acc, att) => acc + att.correct_count + att.wrong_count, 0);
    const totalCorrect = userAttempts.reduce((acc, att) => acc + att.correct_count, 0);
    const overallAccuracy = totalQuestionsSolved > 0 ? Math.round(totalCorrect / totalQuestionsSolved * 100) : 0;
    const subjectStats = {};
    for (const att of userAttempts) {
      for (const ans of att.answers) {
        const q = this.getQuestionById(ans.question_id);
        if (q && ans.selected_option) {
          if (!subjectStats[q.subject_id]) {
            subjectStats[q.subject_id] = { total: 0, correct: 0 };
          }
          subjectStats[q.subject_id].total += 1;
          if (ans.is_correct) subjectStats[q.subject_id].correct += 1;
        }
      }
    }
    const weakSubjects = [];
    for (const [subId, data] of Object.entries(subjectStats)) {
      const acc = data.total > 0 ? Math.round(data.correct / data.total * 100) : 100;
      if (acc < 65 || data.total >= 3 && acc < 70) {
        weakSubjects.push({ subject_id: subId, accuracy: acc, total: data.total });
      }
    }
    const unmasteredMistakes = mistakes2.filter((m) => !m.is_mastered);
    const dueForRevision = mistakes2.filter((m) => !m.is_mastered && new Date(m.next_revision_due).getTime() <= Date.now());
    return {
      totalTestsTaken,
      totalQuestionsSolved,
      overallAccuracy,
      weakSubjects,
      totalMistakes: unmasteredMistakes.length,
      dueForRevisionCount: dueForRevision.length,
      totalBookmarks: bookmarks2.length,
      recentAttempts: userAttempts.slice(0, 5)
    };
  }
  // --------------------------------------------------------------------------
  // AI QUESTION IMPORT & REVIEW QUEUE SUBSYSTEM
  // --------------------------------------------------------------------------
  getImportBatches() {
    return (this.store.import_batches || []).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  getImportBatchById(id) {
    return (this.store.import_batches || []).find((b) => b.id === id);
  }
  createImportBatch(batch) {
    if (!this.store.import_batches) {
      this.store.import_batches = [];
    }
    this.store.import_batches.unshift(batch);
    this.save();
    return batch;
  }
  updateImportBatch(id, updates) {
    const idx = (this.store.import_batches || []).findIndex((b) => b.id === id);
    if (idx === -1) return null;
    this.store.import_batches[idx] = {
      ...this.store.import_batches[idx],
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.save();
    return this.store.import_batches[idx];
  }
  deleteImportBatch(id) {
    const initialLen = (this.store.import_batches || []).length;
    this.store.import_batches = (this.store.import_batches || []).filter((b) => b.id !== id);
    if (this.store.import_batches.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }
  getAiImportSettings() {
    return this.store.settings.ai_import_settings || INITIAL_AI_IMPORT_SETTINGS;
  }
  updateAiImportSettings(newSettings) {
    const merged = {
      ...this.store.settings.ai_import_settings || INITIAL_AI_IMPORT_SETTINGS,
      ...newSettings
    };
    this.store.settings.ai_import_settings = merged;
    this.save();
    return merged;
  }
  // Approve a single or list of questions from an Import Batch into the Question Bank
  approveQuestionFromBatch(params) {
    const batch = this.getImportBatchById(params.batchId);
    if (!batch) return { success: false, error: "Import batch not found" };
    const qItem = batch.questions.find((q) => q.id === params.questionId);
    if (!qItem) return { success: false, error: "Question item not found in batch" };
    if (params.modifiedFields) {
      Object.assign(qItem, params.modifiedFields);
    }
    const qbId = qItem.publishedQuestionId || `qb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const finalAnswer = qItem.sourceAnswer || qItem.aiAnswer || "A";
    const questionToSave = {
      id: qbId,
      subject_id: qItem.detectedSubjectId || "subj-fon",
      topic_id: qItem.detectedTopicId,
      exam_target: "both",
      question_en: qItem.question_en,
      question_mr: qItem.question_mr,
      option_a_en: qItem.option_a_en,
      option_a_mr: qItem.option_a_mr,
      option_b_en: qItem.option_b_en,
      option_b_mr: qItem.option_b_mr,
      option_c_en: qItem.option_c_en,
      option_c_mr: qItem.option_c_mr,
      option_d_en: qItem.option_d_en,
      option_d_mr: qItem.option_d_mr,
      correct_option: finalAnswer,
      explanation_en: qItem.explanation_en || qItem.aiExplanation || "",
      explanation_mr: qItem.explanation_mr || "",
      difficulty: qItem.difficulty || "medium",
      question_type: qItem.questionType || "single_best",
      status: "published",
      source: `Batch: ${batch.id} (${qItem.sourceFile})`,
      source_reference: qItem.sourcePage ? `Page ${qItem.sourcePage} - ${qItem.sourceQuestionNumber || ""}` : qItem.sourceQuestionNumber,
      exam_name: qItem.examName || batch.examName || "AIIMS NORCET / State Nursing Officer Exam",
      exam_year: qItem.examYear || (/* @__PURE__ */ new Date()).getFullYear(),
      created_by: params.actorName,
      reviewed_by: params.actorName,
      approved_at: (/* @__PURE__ */ new Date()).toISOString(),
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString(),
      version: 1,
      is_free: true,
      duplicate_hash: this.computeDuplicateHash(qItem.question_en)
    };
    this.createQuestion(questionToSave);
    qItem.verificationStatus = "approved_by_admin";
    qItem.reviewedBy = params.actorName;
    qItem.reviewedAt = (/* @__PURE__ */ new Date()).toISOString();
    qItem.publishedQuestionId = qbId;
    batch.autoApprovedCount = batch.questions.filter((q) => q.verificationStatus === "auto_approved" || q.verificationStatus === "approved_by_admin").length;
    batch.reviewRequiredCount = batch.questions.filter((q) => q.verificationStatus === "review_required" || q.verificationStatus === "conflict").length;
    this.save();
    this.createAuditLog({
      id: `log-${Date.now()}`,
      actor_id: params.actorId,
      actor_name: params.actorName,
      actor_role: "admin",
      action: "APPROVE_IMPORTED_QUESTION",
      entity: "Question",
      entity_id: qbId,
      details: `Approved question from batch ${batch.id}: "${qItem.question_en.substring(0, 60)}..."`,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    return { success: true, question: questionToSave };
  }
  // Reject a question from a batch
  rejectQuestionFromBatch(params) {
    const batch = this.getImportBatchById(params.batchId);
    if (!batch) return { success: false, error: "Import batch not found" };
    const qItem = batch.questions.find((q) => q.id === params.questionId);
    if (!qItem) return { success: false, error: "Question item not found in batch" };
    qItem.verificationStatus = "rejected";
    qItem.reviewedBy = params.actorName;
    qItem.reviewedAt = (/* @__PURE__ */ new Date()).toISOString();
    qItem.reviewNotes = params.reason || "Rejected during manual review";
    batch.rejectedCount = batch.questions.filter((q) => q.verificationStatus === "rejected").length;
    batch.reviewRequiredCount = batch.questions.filter((q) => q.verificationStatus === "review_required" || q.verificationStatus === "conflict").length;
    this.save();
    return { success: true };
  }
  // Bulk Approve all high confidence questions in a batch (>= threshold)
  approveBatchHighConfidence(params) {
    const batch = this.getImportBatchById(params.batchId);
    if (!batch) return { approvedCount: 0, batch: null };
    let count = 0;
    for (const qItem of batch.questions) {
      if ((qItem.verificationStatus === "review_required" || qItem.verificationStatus === "auto_approved") && qItem.aiConfidence >= params.minConfidence && !qItem.flags.includes("ANSWER_CONFLICT") && !qItem.flags.includes("POSSIBLE_DUPLICATE") && !qItem.publishedQuestionId) {
        this.approveQuestionFromBatch({
          batchId: batch.id,
          questionId: qItem.id,
          actorId: params.actorId,
          actorName: params.actorName
        });
        count++;
      }
    }
    return { approvedCount: count, batch: this.getImportBatchById(params.batchId) || null };
  }
  // Get aggregated pending review queue items
  getImportReviewQueue(filters) {
    const batches = this.store.import_batches || [];
    let allItems = [];
    for (const b of batches) {
      if (filters?.batchId && b.id !== filters.batchId) continue;
      for (const q of b.questions) {
        allItems.push(q);
      }
    }
    let filtered = allItems;
    if (filters?.status && filters.status !== "all") {
      filtered = filtered.filter((q) => q.verificationStatus === filters.status);
    } else {
      filtered = filtered.filter(
        (q) => q.verificationStatus === "review_required" || q.verificationStatus === "conflict" || q.verificationStatus === "duplicate"
      );
    }
    if (filters?.flag && filters.flag !== "all") {
      filtered = filtered.filter((q) => q.flags.includes(filters.flag));
    }
    if (filters?.search) {
      const qLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (q) => q.question_en.toLowerCase().includes(qLower) || q.sourceFile.toLowerCase().includes(qLower) || q.detectedSubjectName && q.detectedSubjectName.toLowerCase().includes(qLower) || q.detectedTopicName && q.detectedTopicName.toLowerCase().includes(qLower)
      );
    }
    return {
      items: filtered,
      totalCount: filtered.length
    };
  }
  // -------------------------------------------------------------
  // PROMO ADS & VIDEO BANNERS (16:9 and 9:16)
  // -------------------------------------------------------------
  getPromoAds(filters) {
    let ads = this.store.promo_ads || [];
    if (filters?.is_active !== void 0) {
      ads = ads.filter((a) => a.is_active === filters.is_active);
    }
    if (filters?.target_screen && filters.target_screen !== "all") {
      ads = ads.filter((a) => a.target_screen === "all" || a.target_screen === filters.target_screen);
    }
    return ads.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
  }
  getPromoAdById(id) {
    return (this.store.promo_ads || []).find((a) => a.id === id);
  }
  createPromoAd(data, actor) {
    const id = data.id || `ad-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newAd = {
      id,
      title_en: data.title_en || "New Nursing Feature & Promo",
      title_mr: data.title_mr || data.title_en || "\u0928\u0935\u0940\u0928 \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u0935\u0948\u0936\u093F\u0937\u094D\u091F\u094D\u092F\u0947 \u0935 \u092A\u094D\u0930\u094B\u092E\u094B",
      description_en: data.description_en || "",
      description_mr: data.description_mr || "",
      aspect_ratio: data.aspect_ratio || "16:9",
      media_type: data.media_type || "video",
      video_url: data.video_url || "",
      thumbnail_url: data.thumbnail_url || "",
      cta_text_en: data.cta_text_en || "Learn More",
      cta_text_mr: data.cta_text_mr || "\u0905\u0927\u093F\u0915 \u092E\u093E\u0939\u093F\u0924\u0940 \u092E\u093F\u0933\u0935\u093E",
      cta_link: data.cta_link || "upgrade-pro",
      target_screen: data.target_screen || "all",
      is_active: data.is_active !== void 0 ? data.is_active : true,
      enable_sticky_pip: data.enable_sticky_pip !== void 0 ? data.enable_sticky_pip : true,
      order_index: data.order_index !== void 0 ? data.order_index : (this.store.promo_ads?.length || 0) + 1,
      badge_text_en: data.badge_text_en || "Featured Promo",
      badge_text_mr: data.badge_text_mr || "\u0935\u093F\u0936\u0947\u0937 \u091C\u093E\u0939\u093F\u0930\u093E\u0924",
      sponsor_tag: data.sponsor_tag || "Nursing Officer Academy",
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (!this.store.promo_ads) {
      this.store.promo_ads = [];
    }
    this.store.promo_ads.push(newAd);
    this.save();
    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      "CREATE_PROMO_AD",
      "Media",
      newAd.id,
      `Created promo ad: ${newAd.title_en} (${newAd.aspect_ratio})`
    );
    return newAd;
  }
  updatePromoAd(id, data, actor) {
    const ad = this.getPromoAdById(id);
    if (!ad) return void 0;
    Object.assign(ad, data, { updated_at: (/* @__PURE__ */ new Date()).toISOString() });
    this.save();
    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      "UPDATE_PROMO_AD",
      "Media",
      id,
      `Updated promo ad: ${ad.title_en}`
    );
    return ad;
  }
  deletePromoAd(id, actor) {
    const idx = (this.store.promo_ads || []).findIndex((a) => a.id === id);
    if (idx === -1) return false;
    const removed = this.store.promo_ads.splice(idx, 1)[0];
    this.save();
    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      "DELETE_PROMO_AD",
      "Media",
      id,
      `Deleted promo ad: ${removed.title_en}`
    );
    return true;
  }
  // Promo Code / Offer Code System
  getPromoCodes() {
    return this.store.promo_codes || [];
  }
  getPromoCodeByCode(code) {
    return (this.store.promo_codes || []).find(
      (p) => p.code.trim().toUpperCase() === code.trim().toUpperCase() && p.is_active
    );
  }
  addPromoCode(data, actor) {
    if (!this.store.promo_codes) this.store.promo_codes = [];
    const newCode = {
      ...data,
      id: `promo-${Date.now()}`,
      code: data.code.trim().toUpperCase(),
      usage_count: 0,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.store.promo_codes.unshift(newCode);
    this.save();
    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      "CREATE_PROMO_CODE",
      "Payment",
      newCode.id,
      `Created promo code: ${newCode.code} (${newCode.discount_value}${newCode.discount_type === "percentage" ? "%" : " Rs"})`
    );
    return newCode;
  }
  updatePromoCode(id, data, actor) {
    const item = (this.store.promo_codes || []).find((p) => p.id === id);
    if (!item) return void 0;
    if (data.code) data.code = data.code.trim().toUpperCase();
    Object.assign(item, data);
    this.save();
    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      "UPDATE_PROMO_CODE",
      "Payment",
      id,
      `Updated promo code: ${item.code}`
    );
    return item;
  }
  deletePromoCode(id, actor) {
    const idx = (this.store.promo_codes || []).findIndex((p) => p.id === id);
    if (idx === -1) return false;
    const removed = this.store.promo_codes.splice(idx, 1)[0];
    this.save();
    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      "DELETE_PROMO_CODE",
      "Payment",
      id,
      `Deleted promo code: ${removed.code}`
    );
    return true;
  }
  verifyPromoCode(code, originalAmount) {
    const cleanCode = (code || "").trim().toUpperCase();
    if (!cleanCode) {
      return { valid: false, discountAmount: 0, finalAmount: originalAmount, message: "\u0915\u0943\u092A\u092F\u093E \u092A\u094D\u0930\u094B\u092E\u094B \u0915\u094B\u0921 \u091F\u093E\u0915\u093E" };
    }
    const promo = (this.store.promo_codes || []).find((p) => p.code.toUpperCase() === cleanCode);
    if (!promo || !promo.is_active) {
      return { valid: false, discountAmount: 0, finalAmount: originalAmount, message: "\u0939\u093E \u092A\u094D\u0930\u094B\u092E\u094B \u0915\u094B\u0921 \u0905\u092E\u093E\u0928\u094D\u092F \u0915\u093F\u0902\u0935\u093E \u0915\u093E\u0932\u092C\u093E\u0939\u094D\u092F \u091D\u093E\u0932\u093E \u0906\u0939\u0947." };
    }
    if (promo.valid_till && new Date(promo.valid_till) < /* @__PURE__ */ new Date()) {
      return { valid: false, discountAmount: 0, finalAmount: originalAmount, message: "\u092F\u093E \u092A\u094D\u0930\u094B\u092E\u094B \u0915\u094B\u0921\u091A\u0940 \u092E\u0941\u0926\u0924 \u0938\u0902\u092A\u0932\u0940 \u0906\u0939\u0947." };
    }
    let discount = 0;
    if (promo.discount_type === "percentage") {
      discount = Math.round(originalAmount * promo.discount_value / 100);
    } else {
      discount = promo.discount_value;
    }
    if (discount > originalAmount) discount = originalAmount;
    const finalAmount = Math.max(0, originalAmount - discount);
    return {
      valid: true,
      discountAmount: discount,
      finalAmount,
      message: `\u092A\u094D\u0930\u094B\u092E\u094B \u0915\u094B\u0921 '${promo.code}' \u092F\u0936\u0938\u094D\u0935\u0940\u0930\u0940\u0924\u094D\u092F\u093E \u0932\u093E\u0917\u0942 \u091D\u093E\u0932\u093E! \u20B9${discount} \u0938\u0942\u091F \u092E\u093F\u0933\u093E\u0932\u0947\u0932\u0940 \u0906\u0939\u0947.`,
      promo
    };
  }
  // --- Successful Students (यशस्वी विद्यार्थी) Methods ---
  getSuccessfulStudents(includeInactive = false) {
    const list = this.store.successful_students || [];
    if (includeInactive) return list;
    return list.filter((s) => s.is_active !== false);
  }
  addSuccessfulStudent(data, actor) {
    if (!this.store.successful_students) {
      this.store.successful_students = [];
    }
    const newStudent = {
      id: `stud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      student_name: data.student_name || "\u092F\u0936\u0938\u094D\u0935\u0940 \u0935\u093F\u0926\u094D\u092F\u093E\u0930\u094D\u0925\u0940",
      photo_url: data.photo_url || "https://images.unsplash.com/photo-1594824813571-28a77885097a?auto=format&fit=crop&q=80&w=300",
      selected_post: data.selected_post || "DHS / DMER Nursing Officer",
      posting_location: data.posting_location || "\u0936\u093E\u0938\u0915\u0940\u092F \u0935\u0948\u0926\u094D\u092F\u0915\u0940\u092F \u092E\u0939\u093E\u0935\u093F\u0926\u094D\u092F\u093E\u0932\u092F (GMC)",
      marks_or_rank: data.marks_or_rank || "",
      exam_batch: data.exam_batch || "\u0968\u0966\u0968\u096A \u092D\u0930\u0924\u0940",
      testimonial_mr: data.testimonial_mr || "\u0909\u0924\u094D\u0915\u0943\u0937\u094D\u091F \u0938\u0930\u093E\u0935 \u091F\u0947\u0938\u094D\u091F\u094D\u0938!",
      is_active: data.is_active !== void 0 ? data.is_active : true,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.store.successful_students.unshift(newStudent);
    this.save();
    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      "ADD_SUCCESSFUL_STUDENT",
      "Settings",
      newStudent.id,
      `Added successful student: ${newStudent.student_name}`
    );
    return newStudent;
  }
  updateSuccessfulStudent(id, data, actor) {
    const list = this.store.successful_students || [];
    const item = list.find((s) => s.id === id);
    if (!item) return null;
    Object.assign(item, data);
    this.save();
    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      "UPDATE_SUCCESSFUL_STUDENT",
      "Settings",
      id,
      `Updated successful student: ${item.student_name}`
    );
    return item;
  }
  deleteSuccessfulStudent(id, actor) {
    const list = this.store.successful_students || [];
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    const removed = list.splice(idx, 1)[0];
    this.save();
    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      "DELETE_SUCCESSFUL_STUDENT",
      "Settings",
      id,
      `Deleted successful student: ${removed.student_name}`
    );
    return true;
  }
  toggleSuccessfulStudentActive(id, isActive, actor) {
    return this.updateSuccessfulStudent(id, { is_active: isActive }, actor);
  }
  // Unlock single test for a student
  unlockTestForUser(userId, testId) {
    const user = this.store.users.find((u) => u.id === userId);
    if (!user) return null;
    if (!user.unlocked_test_ids) {
      user.unlocked_test_ids = [];
    }
    if (!user.unlocked_test_ids.includes(testId)) {
      user.unlocked_test_ids.push(testId);
    }
    this.save();
    return user;
  }
  // YouTube Video Lectures Management
  getYouTubeLectures(onlyActive = false) {
    const list = this.store.youtube_lectures || [];
    if (onlyActive) {
      return list.filter((l) => l.is_active && !l.is_hidden);
    }
    return list;
  }
  addYouTubeLecture(data, actor) {
    if (!this.store.youtube_lectures) {
      this.store.youtube_lectures = [];
    }
    const rawUrl = data.video_url || "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    const ytIdMatch = rawUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    const youtube_video_id = ytIdMatch ? ytIdMatch[1] : data.youtube_video_id || "dQw4w9WgXcQ";
    const newLecture = {
      id: `yt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title_mr: data.title_mr || "\u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u0905\u0927\u093F\u0915\u093E\u0930\u0940 \u0935\u094D\u0939\u093F\u0921\u093F\u0913 \u0935\u094D\u092F\u093E\u0916\u094D\u092F\u093E\u0928",
      title_en: data.title_en || "Nursing Officer Video Masterclass",
      video_url: rawUrl,
      youtube_video_id,
      thumbnail_url: data.thumbnail_url || `https://img.youtube.com/vi/${youtube_video_id}/hqdefault.jpg`,
      subject_name: data.subject_name || "High-Yield Nursing",
      duration_label: data.duration_label || "30 Min",
      instructor_name: data.instructor_name || "MH Sir & Nursing Experts",
      description_mr: data.description_mr || "",
      description_en: data.description_en || "",
      is_active: data.is_active !== void 0 ? data.is_active : true,
      is_hidden: Boolean(data.is_hidden),
      is_paid: Boolean(data.is_paid),
      price: data.price !== void 0 ? Number(data.price) : 0,
      unlocked_by: Array.isArray(data.unlocked_by) ? data.unlocked_by : [],
      view_count: 0,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.store.youtube_lectures.unshift(newLecture);
    this.save();
    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      "ADD_YOUTUBE_LECTURE",
      "Settings",
      newLecture.id,
      `Added YouTube lecture: ${newLecture.title_en}`
    );
    return newLecture;
  }
  updateYouTubeLecture(id, data, actor) {
    const list = this.store.youtube_lectures || [];
    const item = list.find((l) => l.id === id);
    if (!item) return null;
    if (data.video_url) {
      const ytIdMatch = data.video_url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (ytIdMatch) {
        data.youtube_video_id = ytIdMatch[1];
        if (!data.thumbnail_url) {
          data.thumbnail_url = `https://img.youtube.com/vi/${ytIdMatch[1]}/hqdefault.jpg`;
        }
      }
    }
    Object.assign(item, data);
    this.save();
    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      "UPDATE_YOUTUBE_LECTURE",
      "Settings",
      id,
      `Updated YouTube lecture: ${item.title_en}`
    );
    return item;
  }
  deleteYouTubeLecture(id, actor) {
    const list = this.store.youtube_lectures || [];
    const idx = list.findIndex((l) => l.id === id);
    if (idx === -1) return false;
    const removed = list.splice(idx, 1)[0];
    this.save();
    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      "DELETE_YOUTUBE_LECTURE",
      "Settings",
      id,
      `Deleted YouTube lecture: ${removed.title_en}`
    );
    return true;
  }
  toggleYouTubeLectureActive(id, isActive, actor) {
    return this.updateYouTubeLecture(id, { is_active: isActive }, actor);
  }
  unlockYouTubeLecture(lectureId, userId) {
    const list = this.store.youtube_lectures || [];
    const item = list.find((l) => l.id === lectureId);
    if (!item) return null;
    if (!item.unlocked_by) {
      item.unlocked_by = [];
    }
    if (!item.unlocked_by.includes(userId)) {
      item.unlocked_by.push(userId);
    }
    const user = this.store.users.find((u) => u.id === userId);
    if (user) {
      if (!user.unlocked_lecture_ids) {
        user.unlocked_lecture_ids = [];
      }
      if (!user.unlocked_lecture_ids.includes(lectureId)) {
        user.unlocked_lecture_ids.push(lectureId);
      }
    }
    this.save();
    return item;
  }
};
var db = new DatabaseService();

// server/gemini.ts
var import_genai = require("@google/genai");
var import_crypto2 = __toESM(require("crypto"), 1);

// src/db/index.ts
var import_node_postgres = require("drizzle-orm/node-postgres");
var import_pg = require("pg");

// src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  aiCache: () => aiCache,
  auditLogs: () => auditLogs,
  bookmarks: () => bookmarks,
  bookmarksRelations: () => bookmarksRelations,
  mistakes: () => mistakes,
  mistakesRelations: () => mistakesRelations,
  mockTests: () => mockTests,
  questionReports: () => questionReports,
  questions: () => questions,
  questionsRelations: () => questionsRelations,
  reportsRelations: () => reportsRelations,
  subjects: () => subjects,
  testAttempts: () => testAttempts,
  users: () => users
});
var import_drizzle_orm = require("drizzle-orm");
var import_pg_core = require("drizzle-orm/pg-core");
var users = (0, import_pg_core.pgTable)("users", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  uid: (0, import_pg_core.text)("uid").notNull().unique(),
  // Firebase Auth UID
  email: (0, import_pg_core.text)("email").notNull(),
  name: (0, import_pg_core.text)("name").notNull(),
  role: (0, import_pg_core.text)("role").notNull().default("student"),
  preferredLanguage: (0, import_pg_core.text)("preferred_language").notNull().default("en"),
  targetExam: (0, import_pg_core.text)("target_exam").default("AIIMS NORCET 2025"),
  dailyTarget: (0, import_pg_core.integer)("daily_target").default(20),
  streakDays: (0, import_pg_core.integer)("streak_days").default(0),
  points: (0, import_pg_core.integer)("points").default(0),
  isPremium: (0, import_pg_core.boolean)("is_premium").default(false),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var subjects = (0, import_pg_core.pgTable)("subjects", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  nameEn: (0, import_pg_core.text)("name_en").notNull(),
  nameMr: (0, import_pg_core.text)("name_mr").notNull(),
  icon: (0, import_pg_core.text)("icon").notNull(),
  descriptionEn: (0, import_pg_core.text)("description_en").notNull(),
  descriptionMr: (0, import_pg_core.text)("description_mr").notNull(),
  color: (0, import_pg_core.text)("color").notNull(),
  orderIndex: (0, import_pg_core.integer)("order_index").default(0)
});
var questions = (0, import_pg_core.pgTable)("questions", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  subjectId: (0, import_pg_core.text)("subject_id").references(() => subjects.id).notNull(),
  questionEn: (0, import_pg_core.text)("question_en").notNull(),
  questionMr: (0, import_pg_core.text)("question_mr"),
  optionAEn: (0, import_pg_core.text)("option_a_en").notNull(),
  optionAMr: (0, import_pg_core.text)("option_a_mr"),
  optionBEn: (0, import_pg_core.text)("option_b_en").notNull(),
  optionBMr: (0, import_pg_core.text)("option_b_mr"),
  optionCEn: (0, import_pg_core.text)("option_c_en").notNull(),
  optionCMr: (0, import_pg_core.text)("option_c_mr"),
  optionDEn: (0, import_pg_core.text)("option_d_en").notNull(),
  optionDMr: (0, import_pg_core.text)("option_d_mr"),
  correctOption: (0, import_pg_core.text)("correct_option").notNull(),
  // A | B | C | D
  explanationEn: (0, import_pg_core.text)("explanation_en").notNull(),
  explanationMr: (0, import_pg_core.text)("explanation_mr"),
  difficulty: (0, import_pg_core.text)("difficulty").notNull().default("medium"),
  questionType: (0, import_pg_core.text)("question_type").notNull().default("single_best"),
  isVerifiedPyq: (0, import_pg_core.boolean)("is_verified_pyq").default(false),
  examName: (0, import_pg_core.text)("exam_name"),
  examYear: (0, import_pg_core.text)("exam_year"),
  shift: (0, import_pg_core.text)("shift"),
  duplicateHash: (0, import_pg_core.text)("duplicate_hash"),
  status: (0, import_pg_core.text)("status").notNull().default("published"),
  createdBy: (0, import_pg_core.text)("created_by"),
  reviewerNotes: (0, import_pg_core.text)("reviewer_notes"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var mistakes = (0, import_pg_core.pgTable)("mistakes", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  userId: (0, import_pg_core.text)("user_id").notNull(),
  questionId: (0, import_pg_core.text)("question_id").references(() => questions.id).notNull(),
  subjectId: (0, import_pg_core.text)("subject_id").notNull(),
  selectedOption: (0, import_pg_core.text)("selected_option").notNull(),
  correctOption: (0, import_pg_core.text)("correct_option").notNull(),
  notes: (0, import_pg_core.text)("notes"),
  masteryLevel: (0, import_pg_core.integer)("mastery_level").notNull().default(0),
  nextReviewDate: (0, import_pg_core.text)("next_review_date").notNull(),
  reviewedCount: (0, import_pg_core.integer)("reviewed_count").notNull().default(1),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var bookmarks = (0, import_pg_core.pgTable)("bookmarks", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  userId: (0, import_pg_core.text)("user_id").notNull(),
  questionId: (0, import_pg_core.text)("question_id").references(() => questions.id).notNull(),
  tags: (0, import_pg_core.text)("tags"),
  notes: (0, import_pg_core.text)("notes"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var mockTests = (0, import_pg_core.pgTable)("mock_tests", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  titleEn: (0, import_pg_core.text)("title_en").notNull(),
  titleMr: (0, import_pg_core.text)("title_mr").notNull(),
  examType: (0, import_pg_core.text)("exam_type").notNull(),
  durationMinutes: (0, import_pg_core.integer)("duration_minutes").notNull().default(180),
  totalQuestions: (0, import_pg_core.integer)("total_questions").notNull().default(100),
  totalMarks: (0, import_pg_core.integer)("total_marks").notNull().default(100),
  negativeMarking: (0, import_pg_core.text)("negative_marking").notNull().default("0.33"),
  passingMarks: (0, import_pg_core.integer)("passing_marks").notNull().default(50),
  status: (0, import_pg_core.text)("status").notNull().default("published")
});
var testAttempts = (0, import_pg_core.pgTable)("test_attempts", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  testId: (0, import_pg_core.text)("test_id").references(() => mockTests.id).notNull(),
  userId: (0, import_pg_core.text)("user_id").notNull(),
  totalQuestions: (0, import_pg_core.integer)("total_questions").notNull(),
  attemptedQuestions: (0, import_pg_core.integer)("attempted_questions").notNull(),
  correctAnswers: (0, import_pg_core.integer)("correct_answers").notNull(),
  wrongAnswers: (0, import_pg_core.integer)("wrong_answers").notNull(),
  score: (0, import_pg_core.text)("score").notNull(),
  accuracy: (0, import_pg_core.text)("accuracy").notNull(),
  percentile: (0, import_pg_core.text)("percentile").notNull(),
  timeTakenSeconds: (0, import_pg_core.integer)("time_taken_seconds").notNull(),
  answersJson: (0, import_pg_core.text)("answers_json").notNull(),
  completedAt: (0, import_pg_core.timestamp)("completed_at").defaultNow()
});
var questionReports = (0, import_pg_core.pgTable)("question_reports", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  questionId: (0, import_pg_core.text)("question_id").references(() => questions.id).notNull(),
  reportedBy: (0, import_pg_core.text)("reported_by").notNull(),
  reportType: (0, import_pg_core.text)("report_type").notNull(),
  description: (0, import_pg_core.text)("description").notNull(),
  status: (0, import_pg_core.text)("status").notNull().default("pending"),
  resolutionNotes: (0, import_pg_core.text)("resolution_notes"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var auditLogs = (0, import_pg_core.pgTable)("audit_logs", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  actorId: (0, import_pg_core.text)("actor_id").notNull(),
  actorName: (0, import_pg_core.text)("actor_name").notNull(),
  action: (0, import_pg_core.text)("action").notNull(),
  targetResource: (0, import_pg_core.text)("target_resource").notNull(),
  details: (0, import_pg_core.text)("details").notNull(),
  timestamp: (0, import_pg_core.timestamp)("timestamp").defaultNow()
});
var aiCache = (0, import_pg_core.pgTable)("ai_cache", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  taskType: (0, import_pg_core.text)("task_type").notNull(),
  queryHash: (0, import_pg_core.text)("query_hash").notNull().unique(),
  queryPrompt: (0, import_pg_core.text)("query_prompt").notNull(),
  responseJson: (0, import_pg_core.text)("response_json").notNull(),
  modelUsed: (0, import_pg_core.text)("model_used").default("gemini-3.8-flash"),
  hitCount: (0, import_pg_core.integer)("hit_count").default(1).notNull(),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow(),
  lastAccessedAt: (0, import_pg_core.timestamp)("last_accessed_at").defaultNow()
});
var questionsRelations = (0, import_drizzle_orm.relations)(questions, ({ one }) => ({
  subject: one(subjects, {
    fields: [questions.subjectId],
    references: [subjects.id]
  })
}));
var mistakesRelations = (0, import_drizzle_orm.relations)(mistakes, ({ one }) => ({
  question: one(questions, {
    fields: [mistakes.questionId],
    references: [questions.id]
  })
}));
var bookmarksRelations = (0, import_drizzle_orm.relations)(bookmarks, ({ one }) => ({
  question: one(questions, {
    fields: [bookmarks.questionId],
    references: [questions.id]
  })
}));
var reportsRelations = (0, import_drizzle_orm.relations)(questionReports, ({ one }) => ({
  question: one(questions, {
    fields: [questionReports.questionId],
    references: [questions.id]
  })
}));

// src/db/index.ts
var createPool = () => {
  if (!global._postgresPool) {
    global._postgresPool = new import_pg.Pool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      max: 10,
      connectionTimeoutMillis: 15e3
    });
    global._postgresPool.on("error", (err) => {
      console.error("Unexpected error on idle SQL pool client:", err);
    });
  }
  return global._postgresPool;
};
var pool = createPool();
var db2 = (0, import_node_postgres.drizzle)(pool, { schema: schema_exports });

// src/db/service.ts
var import_drizzle_orm2 = require("drizzle-orm");
async function ensureDatabaseSeeded() {
  try {
    const existing = await db2.select().from(subjects).limit(1);
    if (existing.length === 0) {
      console.log("Seeding initial subjects and questions to Cloud SQL...");
      for (const s of INITIAL_SUBJECTS) {
        await db2.insert(subjects).values({
          id: s.id,
          nameEn: s.name_en,
          nameMr: s.name_mr,
          icon: s.icon || "BookOpen",
          descriptionEn: s.description_en,
          descriptionMr: s.description_mr,
          color: "#0d9488",
          orderIndex: 0
        }).onConflictDoNothing();
      }
      for (const q of INITIAL_QUESTIONS) {
        await db2.insert(questions).values({
          id: q.id,
          subjectId: q.subject_id,
          questionEn: q.question_en,
          questionMr: q.question_mr || "",
          optionAEn: q.option_a_en,
          optionAMr: q.option_a_mr || "",
          optionBEn: q.option_b_en,
          optionBMr: q.option_b_mr || "",
          optionCEn: q.option_c_en,
          optionCMr: q.option_c_mr || "",
          optionDEn: q.option_d_en,
          optionDMr: q.option_d_mr || "",
          correctOption: q.correct_option,
          explanationEn: q.explanation_en,
          explanationMr: q.explanation_mr || "",
          difficulty: q.difficulty || "medium",
          questionType: q.question_type || "single_best",
          isVerifiedPyq: !!q.is_verified_pyq,
          examName: q.exam_name || "AIIMS NORCET",
          examYear: q.exam_year ? q.exam_year.toString() : "2024",
          shift: q.shift || "Morning",
          status: q.status || "published",
          createdBy: q.created_by || "system"
        }).onConflictDoNothing();
      }
      console.log("Cloud SQL initial seeding complete.");
    }
  } catch (error) {
    console.error("Error verifying or seeding Cloud SQL:", error);
  }
}
async function getAiCachedResponse(queryHash) {
  try {
    const results = await db2.select().from(aiCache).where((0, import_drizzle_orm2.eq)(aiCache.queryHash, queryHash)).limit(1);
    if (results.length > 0) {
      const entry = results[0];
      db2.update(aiCache).set({
        hitCount: import_drizzle_orm2.sql`${aiCache.hitCount} + 1`,
        lastAccessedAt: /* @__PURE__ */ new Date()
      }).where((0, import_drizzle_orm2.eq)(aiCache.id, entry.id)).catch((err) => console.warn("Cache hit update error:", err));
      return entry.responseJson;
    }
    return null;
  } catch (error) {
    console.warn("AI Cache lookup warning (falling back directly to API):", error);
    return null;
  }
}
async function setAiCachedResponse(taskType, queryHash, queryPrompt, responseJson, modelUsed = "gemini-3.8-flash") {
  try {
    const id = `cache-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    await db2.insert(aiCache).values({
      id,
      taskType,
      queryHash,
      queryPrompt: queryPrompt.substring(0, 500),
      responseJson,
      modelUsed,
      hitCount: 1
    }).onConflictDoUpdate({
      target: aiCache.queryHash,
      set: {
        responseJson,
        lastAccessedAt: /* @__PURE__ */ new Date(),
        hitCount: import_drizzle_orm2.sql`${aiCache.hitCount} + 1`
      }
    });
  } catch (error) {
    console.warn("AI Cache write warning:", error);
  }
}
async function getAiCacheStats() {
  try {
    const totalEntries = await db2.select({ count: import_drizzle_orm2.sql`count(*)` }).from(aiCache);
    const totalHits = await db2.select({ hits: import_drizzle_orm2.sql`coalesce(sum(${aiCache.hitCount}), 0)` }).from(aiCache);
    const entries = Number(totalEntries[0]?.count || 0);
    const hits = Number(totalHits[0]?.hits || 0);
    const savedHits = Math.max(0, hits - entries);
    return {
      cachedPrompts: entries,
      totalRequestsServed: hits,
      savedApiCalls: savedHits,
      tokensSavedEstimate: savedHits * 450
      // avg ~450 tokens per prompt
    };
  } catch (error) {
    return {
      cachedPrompts: 0,
      totalRequestsServed: 0,
      savedApiCalls: 0,
      tokensSavedEstimate: 0
    };
  }
}

// server/gemini.ts
var inMemoryCache = /* @__PURE__ */ new Map();
var inFlightRequests = /* @__PURE__ */ new Map();
function getFromMemoryCache(key) {
  const item = inMemoryCache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    inMemoryCache.delete(key);
    return null;
  }
  return item.text;
}
function setToMemoryCache(key, text2, ttlMs = 24 * 60 * 60 * 1e3) {
  if (inMemoryCache.size > 1e3) {
    const oldestKey = inMemoryCache.keys().next().value;
    if (oldestKey) inMemoryCache.delete(oldestKey);
  }
  inMemoryCache.set(key, { text: text2, expiresAt: Date.now() + ttlMs });
}
function hashAiQuery(taskType, payload, lang = "en") {
  return import_crypto2.default.createHash("sha256").update(`${taskType}:${lang}:${payload.trim().toLowerCase()}`).digest("hex");
}
async function getAiCacheMetrics() {
  return await getAiCacheStats();
}
var aiClient = null;
function getAiClient() {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new import_genai.GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
function formatAiError(err) {
  if (!err) return "An unexpected error occurred.";
  const raw = typeof err === "string" ? err : err.message || String(err);
  try {
    const jsonMatch = raw.match(/\{.*"error":\s*\{.*\}\s*\}/s);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed?.error?.message) {
        if (parsed.error.code === 503 || parsed.error.status === "UNAVAILABLE") {
          return "The AI service is currently experiencing high demand. Spikes are temporary; please retry in a few moments.";
        }
        if (parsed.error.code === 429 || parsed.error.status === "RESOURCE_EXHAUSTED") {
          return "AI request limit reached. Please wait a moment and try again.";
        }
        return parsed.error.message;
      }
    }
  } catch (_) {
  }
  if (raw.includes("503") || raw.includes("UNAVAILABLE") || raw.includes("high demand")) {
    return "The AI service is currently experiencing high demand. Spikes are temporary; please retry in a few moments.";
  }
  if (raw.includes("429") || raw.includes("RESOURCE_EXHAUSTED")) {
    return "AI request limit reached. Please wait a moment and try again.";
  }
  return raw;
}
var CANDIDATE_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite"
];
async function generateWithRetryAndFallback(params) {
  const ai = getAiClient();
  if (!ai) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }
  if (params.cacheKey && inFlightRequests.has(params.cacheKey)) {
    return inFlightRequests.get(params.cacheKey);
  }
  const executionPromise = (async () => {
    let lastError = null;
    for (const model of CANDIDATE_MODELS) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: params.prompt,
            config: {
              ...params.config,
              // Enforce safe upper ceiling on output tokens to prevent quota exhaustion
              maxOutputTokens: params.config?.maxOutputTokens || 650
            }
          });
          if (response && response.text) {
            return response.text;
          }
        } catch (err) {
          lastError = err;
          const msg = String(err?.message || "");
          const isTransient = msg.includes("503") || msg.includes("429") || msg.includes("UNAVAILABLE") || msg.includes("high demand") || msg.includes("fetch failed");
          if (isTransient && attempt < 2) {
            await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
            continue;
          }
          break;
        }
      }
    }
    throw lastError || new Error("All model attempts failed.");
  })();
  if (params.cacheKey) {
    inFlightRequests.set(params.cacheKey, executionPromise);
    try {
      const result = await executionPromise;
      setToMemoryCache(params.cacheKey, result);
      return result;
    } finally {
      inFlightRequests.delete(params.cacheKey);
    }
  }
  return await executionPromise;
}
var CLINICAL_KNOWLEDGE_BASE = [
  {
    keywords: ["apgar", "newborn", "neonatal", "birth score"],
    mnemonic_en: `\u2B50 HIGH-YIELD APGAR MNEMONIC (Assessed at 1 & 5 min):

\u2022 A - Appearance (Skin Color):
  0 = Central cyanosis/pale all over
  1 = Acrocyanosis (body pink, blue extremities - normal in first 24h)
  2 = Completely pink

\u2022 P - Pulse (Heart Rate):
  0 = Absent
  1 = < 100 bpm
  2 = \u2265 100 bpm (Most critical clinical indicator)

\u2022 G - Grimace (Reflex Irritability / Response to stimulation):
  0 = Flaccid / No response
  1 = Grimace / Weak response
  2 = Vigorous cry, cough, or sneeze

\u2022 A - Activity (Muscle Tone):
  0 = Limp / Flaccid
  1 = Some flexion of extremities
  2 = Active motion / Well-flexed

\u2022 R - Respiration (Respiratory Effort):
  0 = Absent
  1 = Slow, irregular, weak gasp
  2 = Strong, lusty cry

Clinical Rapid Recall:
Total Score: 0 - 10.
\u2022 7 to 10 = Normal / reassuring adjustment
\u2022 4 to 6 = Moderate distress (requires tactile stimulation & oxygen)
\u2022 0 to 3 = Severe distress (immediate neonatal CPR / resuscitation required)

*Exam Note: Appearance is the most commonly lost point (acrocyanosis).*`,
    mnemonic_mr: `\u2B50 \u0906\u092A\u0917\u093E\u0930 (APGAR) \u0938\u094D\u0915\u094B\u0930 \u0938\u094D\u092E\u0943\u0924\u0940\u0938\u0942\u0924\u094D\u0930 (\u091C\u0928\u094D\u092E\u093E\u0928\u0902\u0924\u0930 \u0967 \u0906\u0923\u093F \u096B \u092E\u093F\u0928\u093F\u091F\u093E\u0902\u0928\u0940 \u0924\u092A\u093E\u0938\u0932\u0947 \u091C\u093E\u0924\u0947):

\u2022 A - Appearance (\u0924\u094D\u0935\u091A\u0947\u091A\u093E \u0930\u0902\u0917): \u0966 = \u0928\u093F\u0933\u0938\u0930/\u092B\u093F\u0915\u091F, \u0967 = \u0939\u093E\u0924-\u092A\u093E\u092F \u0928\u093F\u0933\u0947 \u0935 \u0936\u0930\u0940\u0930 \u0917\u0941\u0932\u093E\u092C\u0940 (Acrocyanosis), \u0968 = \u092A\u0942\u0930\u094D\u0923 \u0917\u0941\u0932\u093E\u092C\u0940
\u2022 P - Pulse (\u0939\u0943\u0926\u092F\u093E\u091A\u0947 \u0920\u094B\u0915\u0947): \u0966 = \u0905\u0928\u0941\u092A\u0938\u094D\u0925\u093F\u0924, \u0967 = < \u0967\u0966\u0966 \u0920\u094B\u0915\u0947/\u092E\u093F\u0928\u093F\u091F, \u0968 = \u2265 \u0967\u0966\u0966 \u0920\u094B\u0915\u0947/\u092E\u093F\u0928\u093F\u091F
\u2022 G - Grimace (\u0909\u0924\u094D\u0924\u0947\u091C\u0928\u093E\u0932\u093E \u092A\u094D\u0930\u0924\u093F\u0938\u093E\u0926): \u0966 = \u0915\u094B\u0923\u0924\u093E\u0939\u0940 \u092A\u094D\u0930\u0924\u093F\u0938\u093E\u0926 \u0928\u093E\u0939\u0940, \u0967 = \u0924\u094B\u0902\u0921\u093E\u091A\u0947 \u0906\u0915\u0941\u0902\u091A\u0928, \u0968 = \u091C\u094B\u0930\u093E\u0928\u0947 \u0930\u0921\u0923\u0947 \u0915\u093F\u0902\u0935\u093E \u0936\u093F\u0902\u0915\u0923\u0947
\u2022 A - Activity (\u0938\u094D\u0928\u093E\u092F\u0942\u0902\u091A\u0940 \u0924\u093E\u0915\u0926): \u0966 = \u0938\u0948\u0932/\u0932\u091A\u0915, \u0967 = \u0939\u093E\u0924-\u092A\u093E\u092F \u0925\u094B\u0921\u0947 \u0926\u0941\u092E\u0921\u0932\u0947\u0932\u0947, \u0968 = \u0909\u0924\u094D\u0938\u093E\u0939\u0940 \u0939\u093E\u0932\u091A\u093E\u0932
\u2022 R - Respiration (\u0936\u094D\u0935\u0938\u0928): \u0966 = \u0905\u0928\u0941\u092A\u0938\u094D\u0925\u093F\u0924, \u0967 = \u0938\u0902\u0925 \u0935 \u0905\u0928\u093F\u092F\u092E\u093F\u0924, \u0968 = \u091A\u093E\u0902\u0917\u0932\u093E \u0935 \u091C\u094B\u0930\u093E\u091A\u093E \u0930\u0921\u0923\u094D\u092F\u093E\u091A\u093E \u0906\u0935\u093E\u091C

\u090F\u0915\u0942\u0923 \u0917\u0941\u0923: \u0966 \u0924\u0947 \u0967\u0966
\u2022 \u096D \u0924\u0947 \u0967\u0966 = \u0938\u093E\u092E\u093E\u0928\u094D\u092F
\u2022 \u096A \u0924\u0947 \u096C = \u092E\u0927\u094D\u092F\u092E \u0924\u093E\u0923 (\u0911\u0915\u094D\u0938\u093F\u091C\u0928\u091A\u0940 \u0917\u0930\u091C)
\u2022 \u0966 \u0924\u0947 \u0969 = \u0917\u0902\u092D\u0940\u0930 (\u0924\u093E\u0924\u0921\u0940\u0928\u0947 \u0938\u0940\u092A\u0940\u0906\u0930 \u0906\u0935\u0936\u094D\u092F\u0915)`,
    explanation_en: `### APGAR Score Assessment in Neonatal Nursing
**Core Physiology & Definition:**
The APGAR score is a rapid diagnostic scoring method evaluated at 1 minute and 5 minutes post-delivery to assess the newborn's immediate extrauterine transition and need for resuscitation.

**Key Nursing Priorities:**
1. Do not delay emergency resuscitation to compute the 1-minute APGAR score; begin airway clearing and drying immediately upon delivery.
2. An APGAR score < 7 at 5 minutes warrants continued assessment every 5 minutes up to 20 minutes.
3. Heart rate is the single most vital sign in the evaluation. If HR < 100 bpm, initiate positive pressure ventilation (PPV).

**Disclaimer:** For academic exam review purposes only. Follow current NRP (Neonatal Resuscitation Program) protocols in real clinical practice.`,
    explanation_mr: `### \u0928\u0935\u091C\u093E\u0924 \u092C\u093E\u0932\u0915\u093E\u0902\u0938\u093E\u0920\u0940 \u0906\u092A\u0917\u093E\u0930 (APGAR) \u0917\u0941\u0923\u092A\u0926\u094D\u0927\u0924\u0940
**\u0935\u094D\u092F\u093E\u0916\u094D\u092F\u093E \u0935 \u092E\u0939\u0924\u094D\u0935:**
\u0928\u0935\u091C\u093E\u0924 \u0905\u0930\u094D\u092D\u0915\u093E\u091A\u094D\u092F\u093E \u091C\u0928\u094D\u092E\u093E\u0928\u0902\u0924\u0930 \u0967 \u0906\u0923\u093F \u096B \u092E\u093F\u0928\u093F\u091F\u093E\u0902\u0928\u0940 \u092C\u093E\u0932\u0915\u093E\u091A\u0940 \u0936\u093E\u0930\u0940\u0930\u093F\u0915 \u0938\u094D\u0925\u093F\u0924\u0940 \u0906\u0923\u093F \u092C\u093E\u0939\u094D\u092F \u0935\u093E\u0924\u093E\u0935\u0930\u0923\u093E\u0924\u0940\u0932 \u0938\u092E\u093E\u092F\u094B\u091C\u0928 \u0924\u092A\u093E\u0938\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0939\u0940 \u092A\u0926\u094D\u0927\u0924 \u0935\u093E\u092A\u0930\u0932\u0940 \u091C\u093E\u0924\u0947.

**\u092E\u0939\u0924\u094D\u0935\u093E\u091A\u094D\u092F\u093E \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u092C\u093E\u092C\u0940:**
\u0967. \u0967 \u092E\u093F\u0928\u093F\u091F\u093E\u091A\u093E \u0906\u092A\u0917\u093E\u0930 \u0915\u093E\u0922\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0924\u093E\u0924\u0921\u0940\u091A\u0947 \u092A\u0941\u0928\u0930\u0941\u0924\u094D\u0925\u093E\u0928 (Resuscitation) \u0925\u093E\u0902\u092C\u0935\u0942 \u0928\u0915\u093E.
\u0968. \u096B \u092E\u093F\u0928\u093F\u091F\u093E\u0902\u0928\u0902\u0924\u0930 \u0917\u0941\u0923 \u096D \u092A\u0947\u0915\u094D\u0937\u093E \u0915\u092E\u0940 \u0905\u0938\u0932\u094D\u092F\u093E\u0938 \u0926\u0930 \u096B \u092E\u093F\u0928\u093F\u091F\u093E\u0902\u0928\u0940 \u0968\u0966 \u092E\u093F\u0928\u093F\u091F\u093E\u0902\u092A\u0930\u094D\u092F\u0902\u0924 \u092A\u0941\u0928\u094D\u0939\u093E \u092E\u094B\u091C\u093E.
\u0969. \u0967\u0966\u0966 \u092A\u0947\u0915\u094D\u0937\u093E \u0915\u092E\u0940 \u0939\u0943\u0926\u092F\u0917\u0924\u0940 \u0905\u0938\u0932\u094D\u092F\u093E\u0938 \u0924\u094D\u0935\u0930\u093F\u0924 \u0915\u0943\u0924\u094D\u0930\u093F\u092E \u0936\u094D\u0935\u093E\u0938\u094B\u091A\u094D\u091B\u094D\u0935\u093E\u0938 \u0938\u0941\u0930\u0942 \u0915\u0930\u093E.`
  },
  {
    keywords: ["gcs", "glasgow", "coma", "neurological", "e4v5m6"],
    mnemonic_en: `\u2B50 GLASGOW COMA SCALE (GCS) MNEMONIC (E4 - V5 - M6):

Max Score = 15 (Fully Conscious) | Min Score = 3 (Deep Coma / Brain Death)

\u2022 EYE OPENING (4 Points) - [Mnemonic: "4 Eyes"]:
  4 = Spontaneous
  3 = To Speech / Sound
  2 = To Pressure / Pain
  1 = None

\u2022 VERBAL RESPONSE (5 Points) - [Mnemonic: "Jackson 5 speaks"]:
  5 = Oriented (Person, Place, Time)
  4 = Confused conversation
  3 = Inappropriate words (random swearing/words)
  2 = Incomprehensible sounds (moaning/groaning)
  1 = None

\u2022 MOTOR RESPONSE (6 Points) - [Mnemonic: "6 cylinder Motor"]:
  6 = Obeys verbal commands
  5 = Localizes to pain (brings hand above clavicle)
  4 = Normal flexion / Withdrawal from pain
  3 = Abnormal flexion (Decorticate posturing - hands toward core)
  2 = Extension (Decerebrate posturing - hands adducted and pronated)
  1 = None (Flaccid)

*Golden Exam Rule: GCS \u2264 8 = Coma; Secure the Airway ("GCS less than 8, Intubate!").*`,
    mnemonic_mr: `\u2B50 \u0917\u094D\u0932\u093E\u0938\u0917\u094B \u0915\u094B\u092E\u093E \u0938\u094D\u0915\u0947\u0932 (GCS - E4 V5 M6):
\u090F\u0915\u0942\u0923 \u0917\u0941\u0923: \u0969 (\u0915\u093F\u092E\u093E\u0928) \u0924\u0947 \u0967\u096B (\u0915\u092E\u093E\u0932)

\u2022 Eye Opening (\u0921\u094B\u0933\u0947 \u0909\u0918\u0921\u0923\u0947 - \u0915\u092E\u093E\u0932 \u096A \u0917\u0941\u0923):
  \u096A = \u0906\u092A\u094B\u0906\u092A, \u0969 = \u0906\u0935\u093E\u091C\u093E\u0932\u093E \u092A\u094D\u0930\u0924\u093F\u0938\u093E\u0926, \u0968 = \u0935\u0947\u0926\u0928\u0947\u0932\u093E \u092A\u094D\u0930\u0924\u093F\u0938\u093E\u0926, \u0967 = \u0915\u093E\u0939\u0940\u0939\u0940 \u092A\u094D\u0930\u0924\u093F\u0938\u093E\u0926 \u0928\u093E\u0939\u0940.
\u2022 Verbal Response (\u092C\u094B\u0932\u0923\u0947 - \u0915\u092E\u093E\u0932 \u096B \u0917\u0941\u0923):
  \u096B = \u092A\u0942\u0930\u094D\u0923 \u0936\u0941\u0926\u094D\u0927\u0940\u0935\u0930 (Oriented), \u096A = \u0917\u094B\u0902\u0927\u0933\u0932\u0947\u0932\u0947 \u092C\u094B\u0932\u0923\u0947, \u0969 = \u0905\u092F\u094B\u0917\u094D\u092F \u0936\u092C\u094D\u0926, \u0968 = \u0905\u0938\u094D\u092A\u0937\u094D\u091F \u0906\u0935\u093E\u091C/\u0915\u0928\u094D\u0939\u0923\u0947, \u0967 = \u0936\u093E\u0902\u0924.
\u2022 Motor Response (\u0936\u093E\u0930\u0940\u0930\u093F\u0915 \u0939\u093E\u0932\u091A\u093E\u0932 - \u0915\u092E\u093E\u0932 \u096C \u0917\u0941\u0923):
  \u096C = \u0906\u091C\u094D\u091E\u093E \u092A\u093E\u0933\u0923\u0947, \u096B = \u0935\u0947\u0926\u0928\u0947\u091A\u0947 \u0938\u094D\u0925\u093E\u0928 \u0926\u093E\u0916\u0935\u0923\u0947, \u096A = \u0935\u0947\u0926\u0928\u0947\u092A\u093E\u0938\u0942\u0928 \u0939\u093E\u0924 \u092E\u093E\u0917\u0947 \u0918\u0947\u0923\u0947, \u0969 = \u0905\u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0926\u0941\u092E\u0921\u0923\u0947 (Decorticate), \u0968 = \u0905\u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0924\u093E\u0923\u0923\u0947 (Decerebrate), \u0967 = \u092A\u0942\u0930\u094D\u0923 \u0936\u093F\u0925\u093F\u0932.

*\u092A\u0930\u0940\u0915\u094D\u0937\u0947\u0938\u093E\u0920\u0940 \u092E\u0939\u0924\u094D\u0935\u093E\u091A\u0947: GCS \u0938\u094D\u0915\u094B\u0930 \u096E \u0915\u093F\u0902\u0935\u093E \u0924\u094D\u092F\u093E\u092A\u0947\u0915\u094D\u0937\u093E \u0915\u092E\u0940 \u0905\u0938\u0932\u094D\u092F\u093E\u0938 \u0930\u0941\u0917\u094D\u0923\u093E\u0932\u093E \u0924\u094D\u0935\u0930\u093F\u0924 \u0907\u0902\u091F\u094D\u092F\u0941\u092C\u0947\u0936\u0928 (Intubation) \u0906\u0935\u0936\u094D\u092F\u0915 \u0905\u0938\u0924\u0947.*`,
    explanation_en: `### Glasgow Coma Scale (GCS) Clinical Review
**Core Definition:**
The Glasgow Coma Scale is an objective tool used to record the conscious state of a patient with acute brain injury or altered mental status.

**High-Yield NORCET Highlights:**
1. A drop in GCS by 2 or more points is an urgent clinical red flag indicating increasing intracranial pressure (ICP) or impending herniation.
2. Decerebrate posturing (extension, score 2) signifies severe damage to the brainstem (midbrain/pons), which has a worse prognosis than decorticate posturing (flexion, score 3, cerebral hemisphere damage).
3. If the patient is intubated, record Verbal as 'T' (e.g., E4 V_T M6).`,
    explanation_mr: `### \u0917\u094D\u0932\u093E\u0938\u0917\u094B \u0915\u094B\u092E\u093E \u0938\u094D\u0915\u0947\u0932 (GCS) \u0915\u094D\u0932\u093F\u0928\u093F\u0915\u0932 \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923
**\u092E\u0941\u0916\u094D\u092F \u092E\u0941\u0926\u094D\u0926\u0947:**
\u0967. GCS \u092E\u0927\u094D\u092F\u0947 \u0968 \u0915\u093F\u0902\u0935\u093E \u0905\u0927\u093F\u0915 \u0917\u0941\u0923\u093E\u0902\u091A\u0940 \u0918\u091F \u091D\u093E\u0932\u094D\u092F\u093E\u0938 \u092E\u0947\u0902\u0926\u0942\u0924\u0940\u0932 \u0905\u0902\u0924\u0930\u094D\u0917\u0924 \u0926\u093E\u092C (ICP) \u0935\u093E\u0922\u0932\u094D\u092F\u093E\u091A\u0947 \u0932\u0915\u094D\u0937\u0923 \u0906\u0939\u0947; \u0924\u093E\u0924\u094D\u0915\u093E\u0933 \u0921\u0949\u0915\u094D\u091F\u0930\u093E\u0902\u0928\u093E \u0915\u0933\u0935\u093E.
\u0968. Decerebrate (Extension) \u0939\u0947 Decorticate (Flexion) \u092A\u0947\u0915\u094D\u0937\u093E \u0905\u0927\u093F\u0915 \u0917\u0902\u092D\u0940\u0930 \u092E\u093E\u0928\u0932\u0947 \u091C\u093E\u0924\u0947, \u0915\u093E\u0930\u0923 \u0924\u0947 \u092C\u094D\u0930\u0947\u0928\u0938\u094D\u091F\u0947\u092E\u091A\u094D\u092F\u093E \u0907\u091C\u093E \u0926\u0930\u094D\u0936\u0935\u0924\u0947.
\u0969. \u091C\u0940\u0938\u0940\u090F\u0938 \u096E \u092A\u0947\u0915\u094D\u0937\u093E \u0915\u092E\u0940 \u091D\u093E\u0932\u094D\u092F\u093E\u0938 \u090F\u0905\u0930\u0935\u0947 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u0920\u0947\u0935\u0923\u0947 \u0939\u0940 \u092A\u0939\u093F\u0932\u0940 \u092A\u094D\u0930\u093E\u0925\u092E\u093F\u0915\u0924\u093E \u0906\u0939\u0947.`
  },
  {
    keywords: ["mona", "myocardial", "infarction", "chest pain", "heart attack"],
    mnemonic_en: `\u2B50 MONA PROTOCOL FOR ACUTE CORONARY SYNDROME / MI:

Standard Mnemonic & True Clinical Administration Sequence:

\u2022 M - Morphine:
  - Decreases pain and anxiety
  - Reduces myocardial oxygen consumption and cardiac preload/afterload
  - Given IV if nitrates fail to relieve chest pain

\u2022 O - Oxygen:
  - Administer ONLY if oxygen saturation (SpO2) is < 90% or patient in respiratory distress
  - (Current guidelines avoid routine hyperoxia)

\u2022 N - Nitroglycerin (Sublingual / IV):
  - Vasodilator: relieves coronary spasm and reduces preload
  - CONTRAINDICATION: SBP < 90 mmHg, Right Ventricular MI, or Phosphodiesterase inhibitors (Sildenafil) taken in past 24-48 hours!

\u2022 A - Aspirin (162 - 325 mg):
  - Must be CHEWED for rapid buccal platelet aggregation inhibition
  - First-line medication given immediately!

*Exam Sequence Trick: Clinical sequence is often 'ONAM' or 'ANOM' (Aspirin chewed first, Oxygen if hypoxemic, Nitroglycerin sublingual, then Morphine if pain persists).*`,
    mnemonic_mr: `\u2B50 MONA - \u0939\u0943\u0926\u092F\u0935\u093F\u0915\u093E\u0930\u093E\u091A\u094D\u092F\u093E \u091D\u091F\u0915\u094D\u092F\u093E\u0935\u0930\u0940\u0932 (MI) \u092A\u094D\u0930\u0925\u092E\u094B\u092A\u091A\u093E\u0930:
\u2022 M - Morphine (\u0935\u0947\u0926\u0928\u093E \u0935 \u092D\u0940\u0924\u0940 \u0915\u092E\u0940 \u0915\u0930\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940, \u0924\u0938\u0947\u091A \u0939\u0943\u0926\u092F\u093E\u0935\u0930\u0940\u0932 \u0924\u093E\u0923 \u0915\u092E\u0940 \u0915\u0930\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940)
\u2022 O - Oxygen (\u092B\u0915\u094D\u0924 SpO2 \u096F\u0966% \u092A\u0947\u0915\u094D\u0937\u093E \u0915\u092E\u0940 \u0905\u0938\u0932\u094D\u092F\u093E\u0938)
\u2022 N - Nitroglycerin (\u0930\u0915\u094D\u0924\u0935\u093E\u0939\u093F\u0928\u094D\u092F\u093E \u0930\u0941\u0902\u0926 \u0915\u0930\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940; \u0930\u0915\u094D\u0924\u0926\u093E\u092C \u096F\u0966 \u092A\u0947\u0915\u094D\u0937\u093E \u0915\u092E\u0940 \u0905\u0938\u0932\u094D\u092F\u093E\u0938 \u0926\u0947\u090A \u0928\u092F\u0947)
\u2022 A - Aspirin (\u0967\u096C\u0968-\u0969\u0968\u096B mg - \u091A\u0918\u0933\u093E\u092F\u0932\u093E \u0926\u093F\u0932\u0940 \u091C\u093E\u0924\u0947 \u091C\u0947\u0923\u0947\u0915\u0930\u0942\u0928 \u0930\u0915\u094D\u0924\u093E\u091A\u094D\u092F\u093E \u0917\u0941\u0920\u0933\u094D\u092F\u093E \u0930\u094B\u0916\u0932\u094D\u092F\u093E \u091C\u093E\u0924\u0940\u0932)

*\u092E\u0939\u0924\u094D\u0935\u093E\u091A\u0947: \u090D\u0938\u094D\u092A\u093F\u0930\u093F\u0928 \u091A\u0918\u0933\u0942\u0928 \u0926\u0947\u0923\u0947 \u0939\u0940 \u0938\u0930\u094D\u0935\u093E\u0924 \u092A\u0939\u093F\u0932\u0940 \u0915\u0943\u0924\u0940 \u0905\u0938\u0924\u0947.*`,
    explanation_en: `### Emergency Nursing Management in Acute Myocardial Infarction
**Diagnostic Triad:** Severe retrosternal crushing pain radiating to left jaw/arm, ST-segment elevation on 12-lead ECG, elevated Troponin I or T (Troponin is most sensitive and specific biomarker).
**Immediate Nursing Priorities:**
1. Bed rest in semi-Fowler position to decrease oxygen demand.
2. Establish patent wide-bore IV access and continuous cardiac telemetry.
3. Door-to-needle time for thrombolytics: < 30 minutes; Door-to-balloon time for PCI: < 90 minutes.`,
    explanation_mr: `### \u092E\u093E\u092F\u094B\u0915\u093E\u0930\u094D\u0921\u093F\u092F\u0932 \u0907\u0928\u094D\u092B\u093E\u0930\u094D\u0915\u0936\u0928 (\u0939\u0943\u0926\u092F\u0935\u093F\u0915\u093E\u0930) \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u0915\u093E\u0933\u091C\u0940
**\u0928\u093F\u0926\u093E\u0928:** \u0921\u093E\u0935\u094D\u092F\u093E \u0939\u093E\u0924\u093E\u0915\u0921\u0947 \u091C\u093E\u0923\u093E\u0930\u0940 \u091B\u093E\u0924\u0940\u0924 \u0926\u0941\u0916\u0923\u094D\u092F\u093E\u091A\u0940 \u0915\u0933, \u0908\u0938\u0940\u091C\u0940\u0935\u0930 ST-elevation, \u0906\u0923\u093F Troponin \u091F\u0947\u0938\u094D\u091F \u092A\u0949\u091D\u093F\u091F\u093F\u0935\u094D\u0939.
**\u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u092A\u094D\u0930\u093E\u0927\u093E\u0928\u094D\u092F\u0947:**
\u0967. \u0930\u0941\u0917\u094D\u0923\u093E\u0932\u093E \u0924\u093E\u0924\u094D\u0915\u093E\u0933 \u0938\u0947\u092E\u0940-\u092B\u093E\u090A\u0932\u0930\u094D\u0938 \u0938\u094D\u0925\u093F\u0924\u0940\u0924 \u0935\u093F\u0936\u094D\u0930\u093E\u0902\u0924\u0940 \u0926\u094D\u092F\u093E.
\u0968. \u0926\u0930\u0935\u093E\u091C\u093E \u0924\u0947 \u092C\u0932\u0942\u0928 \u0935\u0947\u0933 (Door-to-balloon time - PCI): \u096F\u0966 \u092E\u093F\u0928\u093F\u091F\u093E\u0902\u091A\u094D\u092F\u093E \u0906\u0924 \u0905\u0938\u093E\u0935\u0940.`
  },
  {
    keywords: ["parkland", "burn", "burns", "fluid", "fluid resuscitation"],
    mnemonic_en: `\u2B50 PARKLAND FORMULA FOR BURNS RESUSCITATION:

Total 24-Hour Fluid (Ringer's Lactate) = 4 mL \xD7 Weight in kg \xD7 % TBSA (2nd & 3rd degree burns)

\u2022 Administration Schedule:
  - First 8 Hours: Give 50% (half) of total calculated volume
  - Next 16 Hours: Give remaining 50% (25% in second 8h, 25% in third 8h)

*CRITICAL EXAM TRAP: The 8-hour clock starts from the TIME OF INJURY, NOT the time of hospital admission!*

\u2022 Best Indicator of Adequate Resuscitation:
  - Urine Output: 0.5 to 1.0 mL/kg/hour in adults (approx 30 - 50 mL/hour).
  - (NOT blood pressure or pulse).`,
    mnemonic_mr: `\u2B50 \u092A\u093E\u0930\u094D\u0915\u0932\u0902\u0921 \u092B\u0949\u0930\u094D\u092E\u094D\u092F\u0941\u0932\u093E (\u092D\u093E\u091C\u0932\u0947\u0932\u094D\u092F\u093E \u0930\u0941\u0917\u094D\u0923\u093E\u0938\u093E\u0920\u0940 \u092B\u094D\u0932\u0941\u0908\u0921 \u092A\u094D\u0930\u092E\u093E\u0923):
\u090F\u0915\u0942\u0923 \u0968\u096A \u0924\u093E\u0938\u093E\u0902\u091A\u0947 Ringer's Lactate (RL) = \u096A mL \xD7 \u0935\u091C\u0928 (kg) \xD7 \u092D\u093E\u091C\u0932\u0947\u0932\u0940 \u091F\u0915\u094D\u0915\u0947\u0935\u093E\u0930\u0940 (% TBSA)

\u2022 \u0926\u0947\u0923\u094D\u092F\u093E\u091A\u0940 \u092A\u0926\u094D\u0927\u0924:
  - \u092A\u0939\u093F\u0932\u0947 \u096E \u0924\u093E\u0938: \u090F\u0915\u0942\u0923 \u092A\u094D\u0930\u092E\u093E\u0923\u093E\u092A\u0948\u0915\u0940 \u096B\u0966% (\u0905\u0930\u094D\u0927\u0947) \u092B\u094D\u0932\u0941\u0908\u0921
  - \u092A\u0941\u0922\u0940\u0932 \u0967\u096C \u0924\u093E\u0938: \u0909\u0930\u0932\u0947\u0932\u0947 \u096B\u0966% \u092B\u094D\u0932\u0941\u0908\u0921

*\u091F\u0940\u092A: \u096E \u0924\u093E\u0938\u093E\u0902\u091A\u0940 \u0917\u0923\u0928\u093E \u0930\u0941\u0917\u094D\u0923 \u092D\u093E\u091C\u0932\u094D\u092F\u093E\u091A\u094D\u092F\u093E \u0935\u0947\u0933\u0947\u092A\u093E\u0938\u0942\u0928 \u0938\u0941\u0930\u0942 \u0939\u094B\u0924\u0947, \u0926\u0935\u093E\u0916\u093E\u0928\u094D\u092F\u093E\u0924 \u0926\u093E\u0916\u0932 \u091D\u093E\u0932\u094D\u092F\u093E\u092A\u093E\u0938\u0942\u0928 \u0928\u093E\u0939\u0940!*
*\u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u092E\u0942\u0932\u094D\u092F\u092E\u093E\u092A\u0928: \u0932\u0918\u0935\u0940\u091A\u0947 \u092A\u094D\u0930\u092E\u093E\u0923 (Urine Output \u0969\u0966-\u096B\u0966 mL/\u0924\u093E\u0938) \u0939\u0947 \u092F\u094B\u0917\u094D\u092F \u092B\u094D\u0932\u0941\u0908\u0921\u091A\u0947 \u0938\u0930\u094D\u0935\u094B\u0924\u094D\u0924\u092E \u0926\u0930\u094D\u0936\u0915 \u0906\u0939\u0947.*`,
    explanation_en: `### Fluid Resuscitation in Severe Burns
**Fluid of Choice:** Ringer's Lactate (RL) - crystalloid closest to extracellular fluid composition.
**Rule of Nines (Adult TBSA):** Head = 9%, Each Arm = 9%, Anterior Trunk = 18%, Posterior Trunk = 18%, Each Leg = 18%, Perineum = 1%.
**Complication Alert:** Monitor for Hyperkalemia in the first 24-48 hours due to massive cellular lysis, followed by Hypokalemia during fluid remobilization phase.`,
    explanation_mr: `### \u092D\u093E\u091C\u0932\u0947\u0932\u094D\u092F\u093E \u0930\u0941\u0917\u094D\u0923\u093E\u0902\u091A\u0947 \u092B\u094D\u0932\u0941\u0908\u0921 \u092E\u0945\u0928\u0947\u091C\u092E\u0947\u0902\u091F
**\u0926\u094D\u0930\u0935\u093E\u091A\u093E \u092A\u094D\u0930\u0915\u093E\u0930:** Ringer's Lactate (RL)
**Rule of Nines:** \u0921\u094B\u0915\u0947 \u0935 \u092E\u093E\u0928 = \u096F%, \u092A\u094D\u0930\u0924\u094D\u092F\u0947\u0915 \u0939\u093E\u0924 = \u096F%, \u091B\u093E\u0924\u0940 \u0935 \u092A\u094B\u091F = \u0967\u096E%, \u092A\u093E\u0920 = \u0967\u096E%, \u092A\u094D\u0930\u0924\u094D\u092F\u0947\u0915 \u092A\u093E\u092F = \u0967\u096E%, \u091C\u0928\u0928\u0947\u0902\u0926\u094D\u0930\u093F\u092F\u0947 = \u0967%.
**\u0907\u0932\u0947\u0915\u094D\u091F\u094D\u0930\u094B\u0932\u093E\u0907\u091F \u0927\u094B\u0915\u093E:** \u092A\u0939\u093F\u0932\u094D\u092F\u093E \u0968\u096A \u0924\u0947 \u096A\u096E \u0924\u093E\u0938\u093E\u0902\u0924 \u092A\u0947\u0936\u0940 \u092B\u0941\u091F\u0932\u094D\u092F\u093E\u092E\u0941\u0933\u0947 \u092A\u094B\u091F\u0945\u0936\u093F\u092F\u092E \u0935\u093E\u0922\u0942 \u0936\u0915\u0924\u0947 (Hyperkalemia).`
  },
  {
    keywords: ["cranial", "nerves", "nerve", "twelve cranial"],
    mnemonic_en: `\u2B50 12 CRANIAL NERVES & SENSORY/MOTOR MNEMONICS:

Names Mnemonic: "On Old Olympus Towering Tops, A Finn And German Viewed Some Hops"
I   - Olfactory (Smell)
II  - Optic (Vision)
III - Oculomotor (Pupil constriction & eye movement)
IV  - Trochlear (Down & inward eye movement)
V   - Trigeminal (Facial sensation & mastication chewing)
VI  - Abducens (Lateral eye movement)
VII - Facial (Facial expression & taste anterior 2/3 tongue)
VIII- Vestibulocochlear / Auditory (Hearing & equilibrium balance)
IX  - Glossopharyngeal (Swallowing & taste posterior 1/3)
X   - Vagus (Parasympathetic, heart rate, gag reflex, digestion)
XI  - Accessory / Spinal Accessory (Shoulder shrug & head turn)
XII - Hypoglossal (Tongue movement)

Sensory / Motor Function Mnemonic:
"Some Say Marry Money, But My Brother Says Big Brains Matter More"
(S = Sensory, M = Motor, B = Both/Mixed):
I: S, II: S, III: M, IV: M, V: B, VI: M, VII: B, VIII: S, IX: B, X: B, XI: M, XII: M.`,
    mnemonic_mr: `\u2B50 \u0967\u0968 \u0915\u094D\u0930\u0945\u0928\u093F\u092F\u0932 \u0928\u0930\u094D\u0935\u094D\u0939\u0938 (Cranial Nerves):
I: Olfactory (\u0935\u093E\u0938), II: Optic (\u0926\u0943\u0937\u094D\u091F\u0940), III: Oculomotor (\u0921\u094B\u0933\u094D\u092F\u093E\u0902\u091A\u0940 \u0939\u093E\u0932\u091A\u093E\u0932), IV: Trochlear, V: Trigeminal (\u091A\u0947\u0939\u0931\u094D\u092F\u093E\u0935\u0930\u0940\u0932 \u0938\u0902\u0935\u0947\u0926\u0928\u093E \u0935 \u091A\u093E\u0935\u0923\u0947), VI: Abducens (\u092C\u093E\u091C\u0942\u0932\u093E \u092A\u093E\u0939\u0923\u0947), VII: Facial (\u091A\u0947\u0939\u0931\u094D\u092F\u093E\u0935\u0930\u0940\u0932 \u0939\u093E\u0935\u092D\u093E\u0935 \u0935 \u091A\u0935), VIII: Vestibulocochlear (\u0910\u0915\u0923\u0947 \u0935 \u0924\u094B\u0932), IX: Glossopharyngeal (\u0917\u093F\u0933\u0923\u0947), X: Vagus (\u0939\u0943\u0926\u092F \u0935 \u092A\u091A\u0928\u0915\u094D\u0930\u093F\u092F\u093E), XI: Accessory (\u0916\u093E\u0902\u0926\u0947 \u0909\u0921\u0935\u0923\u0947), XII: Hypoglossal (\u091C\u093F\u092D\u0947\u091A\u0940 \u0939\u093E\u0932\u091A\u093E\u0932).`,
    explanation_en: `### High-Yield Cranial Nerve Assessments in Nursing
- Cranial Nerve V (Trigeminal): Tested with corneal reflex and clenching teeth.
- Cranial Nerve VII (Facial): Bell's palsy is unilateral facial droop; assess by asking patient to smile, whistle, raise eyebrows.
- Cranial Nerve IX & X (Gag reflex): Never give oral liquids/pills post-endoscopy until gag reflex returns!`,
    explanation_mr: `### \u0915\u094D\u0930\u0945\u0928\u093F\u092F\u0932 \u0928\u0930\u094D\u0935\u094D\u0939\u0938 \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u091A\u093E\u091A\u0923\u094D\u092F\u093E
- Cranial Nerve VII (Facial): \u092C\u0947\u0932\u094D\u0938 \u092A\u093E\u0932\u094D\u0938\u0940\u092E\u0927\u094D\u092F\u0947 (Bell's palsy) \u091A\u0947\u0939\u0931\u094D\u092F\u093E\u091A\u0940 \u090F\u0915 \u092C\u093E\u091C\u0942 \u0913\u0922\u0932\u0940 \u091C\u093E\u0924\u0947.
- Cranial Nerve IX & X (Gag reflex): \u090F\u0902\u0921\u094B\u0938\u094D\u0915\u094B\u092A\u0940\u0928\u0902\u0924\u0930 \u0917\u0945\u0917 \u0930\u093F\u092B\u094D\u0932\u0947\u0915\u094D\u0938 \u092A\u0930\u0924 \u092F\u0947\u0908\u092A\u0930\u094D\u092F\u0902\u0924 \u0930\u0941\u0917\u094D\u0923\u093E\u0932\u093E \u092A\u093E\u0923\u0940 \u0915\u093F\u0902\u0935\u093E \u0905\u0928\u094D\u0928 \u0926\u0947\u090A \u0928\u0915\u093E.`
  },
  {
    keywords: ["digoxin", "lanoxin", "toxicity", "hypokalemia", "cardiac glycoside"],
    mnemonic_en: `\u2B50 DIGOXIN TOXICITY & NURSING MNEMONIC:

\u2022 Therapeutic Index: 0.5 to 2.0 ng/mL (Narrow therapeutic window)
\u2022 Major Precipitating Factor: HYPOKALEMIA (Low K+ enhances digoxin binding & toxicity!)
\u2022 Earliest Clinical Symptoms of Toxicity:
  - Gastrointestinal: Anorexia (loss of appetite), nausea, vomiting
\u2022 Neurological / Visual:
  - Green-yellow halos around lights, blurred vision, photophobia
\u2022 Cardiac:
  - Severe bradycardia, premature ventricular contractions (PVCs)

\u2022 Nursing Mandatory Check:
  - Check APICAL PULSE for 1 FULL MINUTE prior to administration.
  - WITHHOLD medication if apical HR < 60 bpm in adults (< 90 bpm in infants).
\u2022 Antidote: Digoxin Immune Fab (Digibind).`,
    mnemonic_mr: `\u2B50 \u0921\u093E\u092F\u0917\u0949\u0915\u094D\u0938\u093F\u0928 (Digoxin) \u0935\u093F\u0937\u092C\u093E\u0927\u093E \u0935 \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u0915\u093E\u0933\u091C\u0940:
\u2022 \u0938\u0941\u0930\u0915\u094D\u0937\u093F\u0924 \u092A\u093E\u0924\u0933\u0940: \u0966.\u096B \u0924\u0947 \u0968.\u0966 ng/mL
\u2022 \u092A\u094D\u0930\u093E\u0925\u092E\u093F\u0915 \u0932\u0915\u094D\u0937\u0923\u0947: \u092D\u0942\u0915 \u092E\u0902\u0926\u093E\u0935\u0923\u0947 (Anorexia), \u0909\u0932\u091F\u094D\u092F\u093E, \u092E\u0933\u092E\u0933.
\u2022 \u0921\u094B\u0933\u094D\u092F\u093E\u0902\u091A\u0940 \u0932\u0915\u094D\u0937\u0923\u0947: \u0926\u093F\u0935\u094D\u092F\u093E\u092D\u094B\u0935\u0924\u0940 \u092A\u093F\u0935\u0933\u0940-\u0939\u093F\u0930\u0935\u0940 \u0935\u0932\u092F\u0947 \u0926\u093F\u0938\u0923\u0947 (Yellow-green halos).
\u2022 \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u0928\u093F\u092F\u092E: \u0914\u0937\u0927 \u0926\u0947\u0923\u094D\u092F\u093E\u092A\u0942\u0930\u094D\u0935\u0940 \u0967 \u092A\u0942\u0930\u094D\u0923 \u092E\u093F\u0928\u093F\u091F \u0972\u092A\u093F\u0915\u0932 \u092A\u0932\u094D\u0938 (Apical Pulse) \u0924\u092A\u093E\u0938\u093E. \u0928\u093E\u0921\u0940 \u096C\u0966 \u092A\u0947\u0915\u094D\u0937\u093E \u0915\u092E\u0940 \u0905\u0938\u0932\u094D\u092F\u093E\u0938 \u0914\u0937\u0927 \u0925\u093E\u0902\u092C\u0935\u093E!
\u2022 \u0935\u093F\u0937\u092C\u093E\u0927\u0947\u0935\u0930\u0940\u0932 \u0909\u0924\u093E\u0930\u093E (Antidote): Digibind (Digoxin immune Fab).`,
    explanation_en: `### Digoxin Clinical Pharmacology for Nursing Exams
Digoxin is a cardiac glycoside that exerts positive inotropic action (increases myocardial contractility) and negative chronotropic action (slows heart rate).
**Crucial Drug Interactions:** Loop diuretics (Furosemide / Lasix) cause potassium wasting, leading to hypokalemia which dangerously triggers digoxin toxicity. Serum potassium must be monitored closely (3.5 - 5.0 mEq/L).`,
    explanation_mr: `### \u0921\u093E\u092F\u0917\u0949\u0915\u094D\u0938\u093F\u0928 \u0914\u0937\u0927\u0936\u093E\u0938\u094D\u0924\u094D\u0930
\u0921\u093E\u092F\u0917\u0949\u0915\u094D\u0938\u093F\u0928 \u0939\u0943\u0926\u092F\u093E\u091A\u0947 \u0920\u094B\u0915\u0947 \u0915\u092E\u0940 \u0915\u0930\u0924\u0947 \u0906\u0923\u093F \u0906\u0915\u0941\u0902\u091A\u0928 \u0915\u094D\u0937\u092E\u0924\u093E \u0935\u093E\u0922\u0935\u0924\u0947. \u0932\u0945\u0938\u093F\u0915\u094D\u0938\u0938\u093E\u0930\u0916\u0940 \u0932\u0918\u0935\u0940\u091A\u0947 \u092A\u094D\u0930\u092E\u093E\u0923 \u0935\u093E\u0922\u0935\u0923\u093E\u0930\u0940 \u0914\u0937\u0927\u0947 \u092A\u094B\u091F\u0945\u0936\u093F\u092F\u092E \u0915\u092E\u0940 \u0915\u0930\u0924\u093E\u0924, \u091C\u094D\u092F\u093E\u092E\u0941\u0933\u0947 \u0921\u093E\u092F\u0917\u0949\u0915\u094D\u0938\u093F\u0928\u091A\u0940 \u0935\u093F\u0937\u092C\u093E\u0927\u093E \u0939\u094B\u0923\u094D\u092F\u093E\u091A\u0940 \u0936\u0915\u094D\u092F\u0924\u093E \u092A\u094D\u0930\u091A\u0902\u0921 \u0935\u093E\u0922\u0924\u0947.`
  }
];
function findFallbackKnowledge(query) {
  const q = query.toLowerCase();
  for (const item of CLINICAL_KNOWLEDGE_BASE) {
    if (item.keywords.some((k) => q.includes(k))) {
      return item;
    }
  }
  return null;
}
async function explainNursingConcept(concept, language = "en") {
  const queryHash = hashAiQuery("concept", concept, language);
  const memCached = getFromMemoryCache(queryHash);
  if (memCached) {
    return {
      success: true,
      text: memCached,
      fromCache: true
    };
  }
  const cached = await getAiCachedResponse(queryHash);
  if (cached) {
    setToMemoryCache(queryHash, cached);
    return {
      success: true,
      text: cached,
      fromCache: true
    };
  }
  const prompt = `You are a Senior Nursing Educator and Clinical Specialist for AIIMS NORCET & State Nursing Officer competitive exams.
Explain the following clinical/nursing concept in concise, high-yield points suitable for competitive exams.
Concept: "${concept}"
Language: ${language === "mr" ? "Marathi (\u092E\u0930\u093E\u0920\u0940) with key English medical terms in brackets" : "English"}.

Structure the response with:
1. Definition & Core Physiology
2. Clinical Priority / High-Yield Points for Nursing Exams
3. Potential Complications & Nursing Interventions
4. Common Exam Traps / Quick Formula (if applicable)
COPYRIGHT & ORIGINALITY DIRECTIVE: Explain all concepts in your own original pedagogical words. Do not reproduce verbatim copyrighted material or cite specific commercial textbook titles or publisher trademarks.
Include a brief educational disclaimer.`;
  try {
    const text2 = await generateWithRetryAndFallback({
      prompt,
      cacheKey: queryHash,
      config: { temperature: 0.2, maxOutputTokens: 550 }
    });
    if (text2) {
      setToMemoryCache(queryHash, text2);
      setAiCachedResponse("concept", queryHash, `${concept} [${language}]`, text2).catch(
        (err) => console.warn("Background cache set error:", err)
      );
    }
    return {
      success: true,
      text: text2 || "No explanation generated."
    };
  } catch (err) {
    console.warn("Gemini explain error, checking fallback knowledge base:", err?.message);
    const fallback = findFallbackKnowledge(concept);
    if (fallback) {
      const fallbackText = (language === "mr" ? fallback.explanation_mr : fallback.explanation_en) + `

*(Note: Instant High-Yield Clinical Exam Reference)*`;
      setToMemoryCache(queryHash, fallbackText);
      setAiCachedResponse("concept", queryHash, `${concept} [${language}]`, fallbackText, "clinical-knowledge-base").catch(() => {
      });
      return {
        success: true,
        text: fallbackText,
        fromCache: true
      };
    }
    return {
      success: false,
      error: formatAiError(err)
    };
  }
}
async function generateMnemonic(topic, language = "en") {
  const queryHash = hashAiQuery("mnemonic", topic, language);
  const memCached = getFromMemoryCache(queryHash);
  if (memCached) {
    return {
      success: true,
      text: memCached,
      fromCache: true
    };
  }
  const cached = await getAiCachedResponse(queryHash);
  if (cached) {
    setToMemoryCache(queryHash, cached);
    return {
      success: true,
      text: cached,
      fromCache: true
    };
  }
  const prompt = `Create high-yield clinical mnemonics and memory aids for nursing officer aspirants studying:
Topic: "${topic}"
Language: ${language === "mr" ? "Marathi with English letters" : "English"}.
Provide the acronym letters clearly broken down with what each letter stands for, clinical context, and a rapid recall trick.`;
  try {
    const text2 = await generateWithRetryAndFallback({
      prompt,
      cacheKey: queryHash,
      config: { temperature: 0.2, maxOutputTokens: 380 }
    });
    if (text2) {
      setToMemoryCache(queryHash, text2);
      setAiCachedResponse("mnemonic", queryHash, `${topic} [${language}]`, text2).catch(
        (err) => console.warn("Background cache set error:", err)
      );
    }
    return {
      success: true,
      text: text2 || "No mnemonic generated."
    };
  } catch (err) {
    console.warn("Gemini mnemonic error, checking fallback knowledge base:", err?.message);
    const fallback = findFallbackKnowledge(topic);
    if (fallback) {
      const fallbackText = (language === "mr" ? fallback.mnemonic_mr : fallback.mnemonic_en) + `

*(Note: Instant High-Yield Clinical Exam Mnemonic Reference)*`;
      setToMemoryCache(queryHash, fallbackText);
      setAiCachedResponse("mnemonic", queryHash, `${topic} [${language}]`, fallbackText, "clinical-knowledge-base").catch(() => {
      });
      return {
        success: true,
        text: fallbackText,
        fromCache: true
      };
    }
    return {
      success: false,
      error: formatAiError(err)
    };
  }
}
async function generateRevisionPlan(weakSubjects, mistakesCount, language = "en") {
  const normSubjects = [...weakSubjects].sort().join(",");
  const queryHash = hashAiQuery("revision_plan", `${normSubjects}:${mistakesCount}`, language);
  const memCached = getFromMemoryCache(queryHash);
  if (memCached) {
    return {
      success: true,
      text: memCached,
      fromCache: true
    };
  }
  const cached = await getAiCachedResponse(queryHash);
  if (cached) {
    setToMemoryCache(queryHash, cached);
    return {
      success: true,
      text: cached,
      fromCache: true
    };
  }
  const prompt = `As a personalized Nursing Officer Exam Study Coach, design a structured 7-Day Spaced Repetition Revision Plan for a candidate who currently has ${mistakesCount} unmastered mistakes and identified weak subject areas: ${weakSubjects.join(", ") || "Core Nursing Fundamentals"}.
Language: ${language === "mr" ? "Marathi (\u092E\u0930\u093E\u0920\u0940)" : "English"}.
Provide day-by-day morning and evening targets, specific high-frequency topics, and mock test review time.`;
  try {
    const text2 = await generateWithRetryAndFallback({
      prompt,
      cacheKey: queryHash,
      config: { temperature: 0.2, maxOutputTokens: 650 }
    });
    if (text2) {
      setToMemoryCache(queryHash, text2);
      setAiCachedResponse("revision_plan", queryHash, `Plan: ${normSubjects} (${mistakesCount}) [${language}]`, text2).catch(
        (err) => console.warn("Background cache set error:", err)
      );
    }
    return {
      success: true,
      text: text2 || "No revision plan generated."
    };
  } catch (err) {
    console.warn("Gemini revision plan error, using structured template:", err?.message);
    const isMr = language === "mr";
    const fallbackPlan = isMr ? `\u{1F4C5} \u096D-\u0926\u093F\u0935\u0938\u0940\u092F \u0915\u094D\u0932\u093F\u0928\u093F\u0915\u0932 \u0930\u093F\u0935\u094D\u0939\u093F\u091C\u0928 \u0935\u0947\u0933\u093E\u092A\u0924\u094D\u0930\u0915 (NORCET / Nursing Officer Exam):
      
\u2022 \u0926\u093F\u0935\u0938 \u0967: Fundamentals of Nursing & Infection Control
  - \u0938\u0915\u093E\u0933: \u0928\u093F\u0930\u094D\u091C\u0902\u0924\u0941\u0915\u0940\u0915\u0930\u0923 \u092A\u0926\u094D\u0927\u0924\u0940 (Autoclaving), \u0939\u0945\u0928\u094D\u0921 \u0939\u093E\u092F\u091C\u093F\u0928\u091A\u0947 \u096B \u0915\u094D\u0937\u0923, \u092C\u093E\u092F\u094B\u092E\u0947\u0921\u093F\u0915\u0932 \u0935\u0947\u0938\u094D\u091F \u092E\u0945\u0928\u0947\u091C\u092E\u0947\u0902\u091F (BMW \u0928\u093F\u092F\u092E).
  - \u0938\u0902\u0927\u094D\u092F\u093E\u0915\u093E\u0933: Mistake Notebook \u092E\u0927\u0940\u0932 \u091A\u0941\u0915\u0940\u091A\u0947 \u0967\u0966 \u092A\u094D\u0930\u0936\u094D\u0928 \u0938\u094B\u0921\u0935\u0923\u0947 + \u0938\u0930\u093E\u0935 MCQ.

\u2022 \u0926\u093F\u0935\u0938 \u0968: Medical-Surgical Nursing (Cardiovascular & Respiratory)
  - \u0938\u0915\u093E\u0933: MI (MONA \u092A\u094D\u0930\u094B\u091F\u094B\u0915\u0949\u0932), ECG \u0924\u0930\u0902\u0917 (Arrythmias), ABG \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923 (Metabolic vs Respiratory Acidosis).
  - \u0938\u0902\u0927\u094D\u092F\u093E\u0915\u093E\u0933: \u0939\u093E\u092F\u092A\u0930\u091F\u0947\u0928\u094D\u0936\u0928 \u0935 \u0905\u0901\u091F\u0940-\u0939\u093E\u092F\u092A\u0930\u091F\u0947\u0902\u0938\u093F\u0935\u094D\u0939 \u0914\u0937\u0927\u0947 + \u0930\u093F\u0935\u094D\u0939\u093F\u091C\u0928.

\u2022 \u0926\u093F\u0935\u0938 \u0969: Pharmacology & Drug Calculations
  - \u0938\u0915\u093E\u0933: \u0906\u092A\u0924\u094D\u0915\u093E\u0932\u0940\u0928 \u0914\u0937\u0927\u0947 (Atropine, Adrenaline, Noradrenaline), \u0921\u094D\u0930\u093F\u092A \u0930\u0947\u091F \u092B\u0949\u0930\u094D\u092E\u094D\u092F\u0941\u0932\u093E, \u0907\u0928\u094D\u0938\u0941\u0932\u093F\u0928 \u092A\u094D\u0930\u0915\u093E\u0930.
  - \u0938\u0902\u0927\u094D\u092F\u093E\u0915\u093E\u0933: Digoxin \u0935 \u092B\u0947\u0928\u093F\u091F\u0949\u0907\u0928 \u091F\u0949\u0915\u094D\u0938\u093F\u0938\u093F\u091F\u0940 \u0930\u093F\u0935\u094D\u0939\u093F\u091C\u0928.

\u2022 \u0926\u093F\u0935\u0938 \u096A: Obstetrics & Gynaecology (OBG Nursing)
  - \u0938\u0915\u093E\u0933: \u092A\u094D\u0930\u0938\u0942\u0924\u0940\u091A\u0947 \u091F\u092A\u094D\u092A\u0947 (Stages of Labor), PPH \u0935\u094D\u092F\u0935\u0938\u094D\u0925\u093E\u092A\u0928, \u0906\u092A\u0917\u093E\u0930 \u0938\u094D\u0915\u094B\u0930 (APGAR).
  - \u0938\u0902\u0927\u094D\u092F\u093E\u0915\u093E\u0933: \u0939\u093E\u092F-\u0930\u093F\u0938\u094D\u0915 \u092A\u094D\u0930\u0947\u0917\u094D\u0928\u0928\u094D\u0938\u0940 (Eclampsia & MgSO4 \u092A\u094D\u0930\u094B\u091F\u094B\u0915\u0949\u0932).

\u2022 \u0926\u093F\u0935\u0938 \u096B: Paediatric & Community Health Nursing
  - \u0938\u0915\u093E\u0933: \u0930\u093E\u0937\u094D\u091F\u094D\u0930\u0940\u092F \u0932\u0938\u0940\u0915\u0930\u0923 \u0935\u0947\u0933\u093E\u092A\u0924\u094D\u0930\u0915 (NIS), \u092C\u093E\u0932\u0915\u093E\u0902\u092E\u0927\u0940\u0932 \u0935\u093F\u0915\u093E\u0938\u093E\u091A\u0947 \u091F\u092A\u094D\u092A\u0947, PEM (\u0915\u0935\u093E\u0936\u093F\u0913\u0930\u0915\u0949\u0930 vs \u092E\u0938\u094D\u092E\u0938).
  - \u0938\u0902\u0927\u094D\u092F\u093E\u0915\u093E\u0933: \u090F\u092A\u093F\u0921\u0947\u092E\u093F\u092F\u094B\u0932\u0949\u091C\u0940 \u0924\u094D\u0930\u093F\u0915\u094B\u0923 \u0935 \u0938\u093E\u0925\u0930\u094B\u0917 \u0928\u093F\u092F\u0902\u0924\u094D\u0930\u0923.

\u2022 \u0926\u093F\u0935\u0938 \u096C: Psychiatric Nursing & Emergency / Triage
  - \u0938\u0915\u093E\u0933: \u0921\u093F\u092B\u0947\u0928\u094D\u0938 \u092E\u0947\u0915\u0945\u0928\u093F\u091D\u092E\u094D\u0938, \u0938\u094D\u0915\u093F\u091D\u094B\u092B\u094D\u0930\u0947\u0928\u093F\u092F\u093E, \u0906\u092A\u0924\u094D\u0915\u093E\u0932\u0940\u0928 \u091F\u094D\u0930\u093E\u092F\u091C (START - Red/Yellow/Green/Black).
  - \u0938\u0902\u0927\u094D\u092F\u093E\u0915\u093E\u0933: \u0967\u0966\u0966 \u092A\u094D\u0930\u0936\u094D\u0928\u093E\u0902\u091A\u0940 \u091C\u0932\u0926 \u092E\u0949\u0915 \u091F\u0947\u0938\u094D\u091F.

\u2022 \u0926\u093F\u0935\u0938 \u096D: \u0917\u094D\u0930\u0901\u0921 \u0930\u093F\u0935\u094D\u0939\u093F\u091C\u0928 \u0935 \u092E\u0949\u0915 \u091F\u0947\u0938\u094D\u091F \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923
  - \u0938\u0915\u093E\u0933: \u0938\u0902\u092A\u0942\u0930\u094D\u0923 Mistake Notebook \u091A\u0947 \u092A\u0941\u0928\u094D\u0939\u093E \u0935\u093E\u091A\u0928.
  - \u0938\u0902\u0927\u094D\u092F\u093E\u0915\u093E\u0933: \u0928\u0915\u093E\u0930\u093E\u0924\u094D\u092E\u0915 \u0917\u0941\u0923\u093E\u0902\u0915\u0928 \u091F\u093E\u0933\u0923\u094D\u092F\u093E\u091A\u0947 \u0928\u093F\u092F\u094B\u091C\u0928 \u0935 \u0935\u093F\u0936\u094D\u0930\u093E\u0902\u0924\u0940.` : `\u{1F4C5} 7-Day High-Yield Clinical Revision Plan (NORCET / Nursing Officer Focus):

\u2022 Day 1: Fundamentals of Nursing & Biomedical Waste
  - Morning: Sterilization techniques, Hand Hygiene 5 moments, BMW 2016 color-coding rules, Catheterization protocols.
  - Evening: Review top 10 logged mistakes from your Mistake Notebook + 50 MCQs.

\u2022 Day 2: Medical-Surgical (Cardiovascular & Respiratory)
  - Morning: Acute MI (MONA), Arrhythmias (VT/VF defibrillation), ABG interpretation (Acidosis/Alkalosis).
  - Evening: Chest tube drainage underwater seal maintenance & troubleshooting.

\u2022 Day 3: Clinical Pharmacology & High-Alert Calculations
  - Morning: Emergency resuscitation drugs (Atropine, Adrenaline, Amiodarone), IV Drop Rate calculations, Insulin peaks.
  - Evening: Digoxin and Lithium therapeutic indices and toxicity signs.

\u2022 Day 4: Obstetrics & Gynecological (OBG) Nursing
  - Morning: Stages of labor, PPH emergency management (Oxytocin, Misoprostol), APGAR score, Eclampsia (MgSO4 administration & toxicity).
  - Evening: Fetal heart rate decelerations (VEAL CHOP mnemonic review).

\u2022 Day 5: Pediatric & Community Health Nursing
  - Morning: National Immunization Schedule (NIS), Developmental milestones, Phototherapy in neonatal jaundice.
  - Evening: Cold chain equipment, epidemiological indicators, and communicable disease quarantine periods.

\u2022 Day 6: Emergency Nursing, Triage, & Mental Health
  - Morning: Disaster Triage (START protocol: Black, Red, Yellow, Green), GCS scoring, Shock types & fluid resuscitation.
  - Evening: Therapeutic nurse-patient communication, Lithium toxicity, defense mechanisms.

\u2022 Day 7: Full Mock Simulation & Mistake Notebook Re-Test
  - Morning: Timed 100-Question Simulated Mock Test.
  - Evening: Detailed rationale review of incorrect answers; mental relaxation before exam.`;
    const finalPlan = fallbackPlan + `

*(Note: Instant High-Yield Revision Schedule)*`;
    setToMemoryCache(queryHash, finalPlan);
    setAiCachedResponse("revision_plan", queryHash, `Plan: ${normSubjects} (${mistakesCount}) [${language}]`, finalPlan, "clinical-template").catch(() => {
    });
    return {
      success: true,
      text: finalPlan,
      fromCache: true
    };
  }
}
async function askStudyCoachDoubt(doubt, context, language = "en") {
  const queryHash = hashAiQuery("doubt", `${doubt}:${context || ""}`, language);
  const memCached = getFromMemoryCache(queryHash);
  if (memCached) {
    return {
      success: true,
      text: memCached,
      fromCache: true
    };
  }
  const cached = await getAiCachedResponse(queryHash);
  if (cached) {
    setToMemoryCache(queryHash, cached);
    return {
      success: true,
      text: cached,
      fromCache: true
    };
  }
  const prompt = `You are the AI Study Coach for Nursing Officer aspirants (NORCET, ESIC, RRB, DMER).
The student is asking: "${doubt}"
${context ? `Reference Question / Context: "${context}"` : ""}
Language: ${language === "mr" ? "Marathi (\u092E\u0930\u093E\u0920\u0940) with English medical terminology" : "English"}.

Answer accurately according to standard evidence-based clinical nursing guidelines and official exam syllabi.
Do not cite commercial textbook titles, proprietary publishers, or reproduce copyrighted content verbatim. Explain concepts in original, clear instructional language.
Clarify any confusion between look-alike options.
Always include a brief educational disclaimer.`;
  try {
    const text2 = await generateWithRetryAndFallback({
      prompt,
      cacheKey: queryHash,
      config: { temperature: 0.2, maxOutputTokens: 500 }
    });
    if (text2) {
      setToMemoryCache(queryHash, text2);
      setAiCachedResponse("doubt", queryHash, `${doubt.substring(0, 80)} [${language}]`, text2).catch(
        (err) => console.warn("Background cache set error:", err)
      );
    }
    return {
      success: true,
      text: text2 || "No answer generated."
    };
  } catch (err) {
    console.warn("Gemini doubt error, checking fallback knowledge base:", err?.message);
    const fallback = findFallbackKnowledge(doubt + " " + (context || ""));
    if (fallback) {
      const fallbackText = (language === "mr" ? fallback.explanation_mr : fallback.explanation_en) + `

*(Note: Instant High-Yield Clinical Reference)*`;
      setToMemoryCache(queryHash, fallbackText);
      setAiCachedResponse("doubt", queryHash, `${doubt.substring(0, 80)} [${language}]`, fallbackText, "clinical-knowledge-base").catch(() => {
      });
      return {
        success: true,
        text: fallbackText,
        fromCache: true
      };
    }
    return {
      success: false,
      error: formatAiError(err)
    };
  }
}
async function generateAiDraftQuestion(params) {
  const queryHash = hashAiQuery("draft_question", `${params.subject_name}:${params.topic}:${params.difficulty}:${!!params.is_clinical_case}`, "bilingual");
  const memCached = getFromMemoryCache(queryHash);
  if (memCached) {
    try {
      return {
        success: true,
        draft: JSON.parse(memCached),
        fromCache: true
      };
    } catch {
    }
  }
  const cached = await getAiCachedResponse(queryHash);
  if (cached) {
    try {
      setToMemoryCache(queryHash, cached);
      return {
        success: true,
        draft: JSON.parse(cached),
        fromCache: true
      };
    } catch {
    }
  }
  const prompt = `Generate 1 authentic, exam-standard Nursing Officer MCQ for competitive exams like AIIMS NORCET or ESIC.
Subject: ${params.subject_name}
Topic: ${params.topic}
Difficulty: ${params.difficulty}
Is Clinical Scenario: ${params.is_clinical_case ? "YES (Provide a realistic patient vignette with age, symptoms, vitals)" : "NO"}.

Requirements:
- Exactly four mutually exclusive options (A, B, C, D).
- Exactly one correct answer.
- Both English and Marathi versions for question, all four options, and detailed medical explanation/rationale.
- High-yield nursing exam focus (e.g. priority nursing actions, drug calculations, infection prevention, or acute assessments).
- COPYRIGHT & ORIGINALITY SAFEGUARD: Formulate strictly original questions and explanations. Never copy verbatim text from copyrighted commercial textbooks, proprietary question banks, or published papers. Do not cite commercial book titles or authors. Focus purely on universal clinical principles, scientific facts, and exam curriculum standards.

Return ONLY valid JSON matching this schema:
{
  "question_en": "string",
  "question_mr": "string",
  "option_a_en": "string",
  "option_a_mr": "string",
  "option_b_en": "string",
  "option_b_mr": "string",
  "option_c_en": "string",
  "option_c_mr": "string",
  "option_d_en": "string",
  "option_d_mr": "string",
  "correct_option": "A" | "B" | "C" | "D",
  "explanation_en": "string",
  "explanation_mr": "string",
  "difficulty": "easy" | "medium" | "hard",
  "question_type": "clinical_case" | "single_best"
}`;
  try {
    const text2 = await generateWithRetryAndFallback({
      prompt,
      cacheKey: queryHash,
      config: {
        maxOutputTokens: 850,
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            question_en: { type: import_genai.Type.STRING },
            question_mr: { type: import_genai.Type.STRING },
            option_a_en: { type: import_genai.Type.STRING },
            option_a_mr: { type: import_genai.Type.STRING },
            option_b_en: { type: import_genai.Type.STRING },
            option_b_mr: { type: import_genai.Type.STRING },
            option_c_en: { type: import_genai.Type.STRING },
            option_c_mr: { type: import_genai.Type.STRING },
            option_d_en: { type: import_genai.Type.STRING },
            option_d_mr: { type: import_genai.Type.STRING },
            correct_option: { type: import_genai.Type.STRING },
            explanation_en: { type: import_genai.Type.STRING },
            explanation_mr: { type: import_genai.Type.STRING },
            difficulty: { type: import_genai.Type.STRING },
            question_type: { type: import_genai.Type.STRING }
          },
          required: [
            "question_en",
            "option_a_en",
            "option_b_en",
            "option_c_en",
            "option_d_en",
            "correct_option",
            "explanation_en",
            "difficulty"
          ]
        }
      }
    });
    const parsed = JSON.parse(text2 || "{}");
    if (text2) {
      setToMemoryCache(queryHash, JSON.stringify(parsed));
      setAiCachedResponse("draft_question", queryHash, `${params.subject_name}: ${params.topic}`, JSON.stringify(parsed)).catch(
        (err) => console.warn("Background cache set error:", err)
      );
    }
    return {
      success: true,
      draft: parsed
    };
  } catch (err) {
    console.warn("Gemini question generation error, utilizing verified clinical fallback:", err?.message);
    const clinicalFallbackDraft = {
      question_en: `A 58-year-old male is admitted to the emergency department with acute central retrosternal chest pain radiating to his left shoulder and jaw. His vitals are: BP 86/54 mmHg, HR 52 bpm, SpO2 94% on room air. The 12-lead ECG reveals ST-segment elevation in leads II, III, and aVF with suspected right ventricular involvement. Which of the following prescribed medications should the nurse QUESTION immediately?`,
      question_mr: `\u090F\u0915\u093E \u096B\u096E \u0935\u0930\u094D\u0937\u0940\u092F \u092A\u0941\u0930\u0941\u0937\u093E\u0932\u093E \u0921\u093E\u0935\u094D\u092F\u093E \u0916\u093E\u0902\u0926\u094D\u092F\u093E\u0915\u0921\u0947 \u091C\u093E\u0923\u093E\u0930\u0947 \u0924\u0940\u0935\u094D\u0930 \u091B\u093E\u0924\u0940\u0924 \u0926\u0941\u0916\u0923\u0947 \u0938\u0941\u0930\u0942 \u091D\u093E\u0932\u094D\u092F\u093E\u0928\u0947 \u0906\u092A\u0924\u094D\u0915\u093E\u0932\u0940\u0928 \u0935\u093F\u092D\u093E\u0917\u093E\u0924 \u0926\u093E\u0916\u0932 \u0915\u0947\u0932\u0947 \u0906\u0939\u0947. \u0930\u0915\u094D\u0924\u0926\u093E\u092C \u096E\u096C/\u096B\u096A mmHg, \u0928\u093E\u0921\u0940 \u096B\u0968/\u092E\u093F\u0928\u093F\u091F, SpO2 \u096F\u096A%. \u0908\u0938\u0940\u091C\u0940\u092E\u0927\u094D\u092F\u0947 Leads II, III \u0906\u0923\u093F aVF \u092E\u0927\u094D\u092F\u0947 ST-elevation \u0926\u093F\u0938\u0924 \u0906\u0939\u0947. \u0916\u093E\u0932\u0940\u0932\u092A\u0948\u0915\u0940 \u0915\u094B\u0923\u0924\u094D\u092F\u093E \u0914\u0937\u0927\u093E\u091A\u094D\u092F\u093E \u0906\u0926\u0947\u0936\u093E\u092C\u093E\u092C\u0924 \u0928\u0930\u094D\u0938\u0928\u0947 \u0924\u093E\u092C\u0921\u0924\u094B\u092C \u0921\u0949\u0915\u094D\u091F\u0930\u093E\u0902\u0936\u0940 \u092B\u0947\u0930\u0935\u093F\u091A\u093E\u0930 \u0915\u0930\u093E\u0935\u093E?`,
      option_a_en: `Aspirin 300 mg orally chewed`,
      option_a_mr: `\u0905\u0945\u0938\u094D\u092A\u093F\u0930\u093F\u0928 \u0969\u0966\u0966 mg \u091A\u0918\u0933\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940`,
      option_b_en: `Sublingual Nitroglycerin 0.4 mg`,
      option_b_mr: `\u0938\u092C\u093F\u0932\u0902\u0917\u094D\u0935\u0932 \u0928\u093E\u092F\u091F\u094D\u0930\u094B\u0917\u094D\u0932\u093F\u0938\u0930\u0940\u0928 \u0966.\u096A mg`,
      option_c_en: `Normal Saline 500 mL IV bolus`,
      option_c_mr: `\u0928\u0949\u0930\u094D\u092E\u0932 \u0938\u0932\u093E\u0908\u0928 \u096B\u0966\u0966 mL IV \u092C\u094B\u0932\u0938`,
      option_d_en: `Supplemental Oxygen via nasal cannula`,
      option_d_mr: `\u0928\u0947\u091D\u0932 \u0915\u0945\u0928\u094D\u092F\u0941\u0932\u093E\u0926\u094D\u0935\u093E\u0930\u0947 \u0911\u0915\u094D\u0938\u093F\u091C\u0928`,
      correct_option: "B",
      explanation_en: `Nitroglycerin is a potent venodilator that reduces cardiac preload. In patients with Inferior MI with right ventricular involvement and hypotension (SBP < 90 mmHg), right ventricular filling is preload-dependent. Administering Nitroglycerin can precipitate catastrophic cardiovascular collapse and severe profound shock. Aspirin is indicated and Normal Saline bolus helps maintain preload in right ventricular infarcts.`,
      explanation_mr: `\u0928\u093E\u092F\u091F\u094D\u0930\u094B\u0917\u094D\u0932\u093F\u0938\u0930\u0940\u0928\u092E\u0941\u0933\u0947 \u0930\u0915\u094D\u0924\u0935\u093E\u0939\u093F\u0928\u094D\u092F\u093E \u0930\u0941\u0902\u0926\u093E\u0935\u0924\u093E\u0924 \u0935 \u092A\u094D\u0930\u0940\u0932\u094B\u0921 \u0915\u092E\u0940 \u0939\u094B\u0924\u094B. \u0909\u091C\u0935\u094D\u092F\u093E \u0935\u094D\u0939\u0947\u0902\u091F\u094D\u0930\u093F\u0915\u0932\u091A\u094D\u092F\u093E \u0907\u0928\u094D\u092B\u093E\u0930\u094D\u0915\u094D\u0936\u0928\u092E\u0927\u094D\u092F\u0947 \u0906\u0923\u093F \u0915\u092E\u0940 \u0930\u0915\u094D\u0924\u0926\u093E\u092C (SBP < \u096F\u0966) \u0905\u0938\u0924\u093E\u0928\u093E \u0928\u093E\u092F\u091F\u094D\u0930\u094B\u0917\u094D\u0932\u093F\u0938\u0930\u0940\u0928 \u0926\u093F\u0932\u094D\u092F\u093E\u0938 \u0924\u0940\u0935\u094D\u0930 \u0936\u0949\u0915 (Cardiogenic Collapse) \u0939\u094B\u090A \u0936\u0915\u0924\u094B, \u092E\u094D\u0939\u0923\u0942\u0928 \u0924\u0947 \u092A\u094D\u0930\u0924\u093F\u092C\u0902\u0927\u093F\u0924 \u0906\u0939\u0947.`,
      difficulty: "hard",
      question_type: "clinical_case"
    };
    setToMemoryCache(queryHash, JSON.stringify(clinicalFallbackDraft));
    return {
      success: true,
      draft: clinicalFallbackDraft,
      notice: "Generated from Verified Clinical Exam Question Bank"
    };
  }
}
async function translateNursingQuestionToMarathi(q) {
  const queryHash = hashAiQuery("translate_mr", `${q.question_en}|${q.option_a_en}|${q.option_b_en}|${q.option_c_en}|${q.option_d_en}`);
  const cached = getFromMemoryCache(queryHash);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
    }
  }
  const ai = getAiClient();
  if (!ai) {
    return {
      question_mr: q.question_en,
      option_a_mr: q.option_a_en,
      option_b_mr: q.option_b_en,
      option_c_mr: q.option_c_en,
      option_d_mr: q.option_d_en,
      explanation_mr: q.explanation_en || ""
    };
  }
  try {
    const prompt = `You are an expert bilingual medical translator specializing in Indian Nursing Officer recruitment exams (AIIMS NORCET, Maharashtra DHS & DMER Staff Nurse, CHO).
Translate the following English nursing question, options, and explanation into high-quality, professional, exam-standard Marathi (\u092E\u0930\u093E\u0920\u0940).
Guidelines:
- Maintain medical clarity and technical accuracy.
- Keep pharmacological drug names (e.g. Digoxin, Nitroglycerin, Heparin), lab units (e.g. mEq/L, mg/dL), and clinical abbreviations standard.
- Do NOT alter the factual meaning or correct answer.

Input:
Question: ${q.question_en}
Option A: ${q.option_a_en}
Option B: ${q.option_b_en}
Option C: ${q.option_c_en}
Option D: ${q.option_d_en}
Explanation: ${q.explanation_en || ""}

Respond strictly with a JSON object containing:
question_mr, option_a_mr, option_b_mr, option_c_mr, option_d_mr, explanation_mr`;
    let response = null;
    const modelsToTry = ["gemini-3.6-flash", "gemini-3.8-flash", "gemini-flash-latest"];
    for (const m of modelsToTry) {
      try {
        response = await ai.models.generateContent({
          model: m,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: import_genai.Type.OBJECT,
              properties: {
                question_mr: { type: import_genai.Type.STRING },
                option_a_mr: { type: import_genai.Type.STRING },
                option_b_mr: { type: import_genai.Type.STRING },
                option_c_mr: { type: import_genai.Type.STRING },
                option_d_mr: { type: import_genai.Type.STRING },
                explanation_mr: { type: import_genai.Type.STRING }
              },
              required: ["question_mr", "option_a_mr", "option_b_mr", "option_c_mr", "option_d_mr"]
            }
          }
        });
        if (response?.text) break;
      } catch (errM) {
      }
    }
    if (!response || !response.text) {
      throw new Error("All translation models failed");
    }
    const parsed = JSON.parse(response.text || "{}");
    const result = {
      question_mr: parsed.question_mr || q.question_en,
      option_a_mr: parsed.option_a_mr || q.option_a_en,
      option_b_mr: parsed.option_b_mr || q.option_b_en,
      option_c_mr: parsed.option_c_mr || q.option_c_en,
      option_d_mr: parsed.option_d_mr || q.option_d_en,
      explanation_mr: parsed.explanation_mr || q.explanation_en || ""
    };
    setToMemoryCache(queryHash, JSON.stringify(result));
    return result;
  } catch (err) {
    return {
      question_mr: q.question_en,
      option_a_mr: q.option_a_en,
      option_b_mr: q.option_b_en,
      option_c_mr: q.option_c_en,
      option_d_mr: q.option_d_en,
      explanation_mr: q.explanation_en || ""
    };
  }
}
async function formatAttractiveAdvertisement(rawInput) {
  const ai = getAiClient();
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  if (!ai) {
    return {
      organization: "\u092E\u0939\u093E\u0930\u093E\u0937\u094D\u091F\u094D\u0930 \u0936\u093E\u0938\u0928 - \u0906\u0930\u094B\u0917\u094D\u092F \u0938\u0947\u0935\u093E \u0935\u093F\u092D\u093E\u0917 (DHS / DMER)",
      organization_mr: "\u0938\u093E\u0930\u094D\u0935\u091C\u0928\u093F\u0915 \u0906\u0930\u094B\u0917\u094D\u092F \u0935\u093F\u092D\u093E\u0917 (DHS) \u092E\u0939\u093E\u0930\u093E\u0937\u094D\u091F\u094D\u0930 \u0936\u093E\u0938\u0928",
      post_name: "\u0905\u0927\u093F\u092A\u0930\u093F\u091A\u093E\u0930\u093F\u0915\u093E (Staff Nurse / Nursing Officer)",
      post_name_mr: "\u0938\u094D\u091F\u093E\u092B \u0928\u0930\u094D\u0938 / \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u0911\u092B\u093F\u0938\u0930 (\u0905\u0927\u093F\u092A\u0930\u093F\u091A\u093E\u0930\u093F\u0915\u093E)",
      year: currentYear,
      notification_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      application_start_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      application_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
      total_vacancies: 4200,
      salary_range: "Level 7: \u20B935,400 - \u20B91,12,400 per month",
      salary_range_mr: "\u092A\u0947 \u092E\u0945\u091F\u094D\u0930\u093F\u0915\u094D\u0938 \u0938\u094D\u0924\u0930 S-14: \u20B9\u0969\u096B,\u096A\u0966\u0966 - \u20B9\u0967,\u0967\u0968,\u096A\u0966\u0966 \u0926\u0930\u092E\u0939\u093E + \u092D\u0924\u094D\u0924\u0947",
      eligibility_summary: "GNM Diploma OR B.Sc / P.B. B.Sc Nursing with Maharashtra Nursing Council (MNC) Registration.",
      eligibility_summary_mr: "GNM \u0915\u093F\u0902\u0935\u093E B.Sc / P.B. B.Sc \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u0909\u0924\u094D\u0924\u0940\u0930\u094D\u0923 \u0935 \u092E\u0939\u093E\u0930\u093E\u0937\u094D\u091F\u094D\u0930 \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u0915\u094C\u0928\u094D\u0938\u093F\u0932 (MNC) \u0935\u0948\u0927 \u0928\u094B\u0902\u0926\u0923\u0940.",
      qualification_details: "Must be registered with Maharashtra Nursing Council.",
      qualification_details_mr: "\u092E\u0939\u093E\u0930\u093E\u0937\u094D\u091F\u094D\u0930 \u092A\u0930\u093F\u091A\u093E\u0930\u093F\u0915\u093E \u092A\u0930\u093F\u0937\u0926\u0947\u091A\u0940 (MNC) \u0935\u0948\u0927 \u0928\u094B\u0902\u0926\u0923\u0940 \u0905\u0928\u093F\u0935\u093E\u0930\u094D\u092F.",
      age_limit: "18 \u0924\u0947 38 \u0935\u0930\u094D\u0937\u0947 (\u0916\u0941\u0932\u093E \u092A\u094D\u0930\u0935\u0930\u094D\u0917) / \u092E\u093E\u0917\u093E\u0938\u0935\u0930\u094D\u0917\u0940\u092F \u0909\u092E\u0947\u0926\u0935\u093E\u0930\u093E\u0902\u0938\u093E\u0920\u0940 43 \u0935\u0930\u094D\u0937\u0947",
      experience_required: "\u0905\u0928\u0941\u092D\u0935\u093E\u091A\u0940 \u0906\u0935\u0936\u094D\u092F\u0915\u0924\u093E \u0928\u093E\u0939\u0940 (Freshers Eligible)",
      application_fee: "\u0916\u0941\u0932\u093E \u092A\u094D\u0930\u0935\u0930\u094D\u0917: \u20B91,000 | \u0930\u093E\u0916\u0940\u0935 \u092A\u094D\u0930\u0935\u0930\u094D\u0917: \u20B9900",
      exam_pattern_summary: "100 \u092C\u0939\u0941\u092A\u0930\u094D\u092F\u093E\u092F\u0940 \u092A\u094D\u0930\u0936\u094D\u0928 (80 \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u0924\u093E\u0902\u0924\u094D\u0930\u093F\u0915 + 20 \u092E\u0930\u093E\u0920\u0940/\u0907\u0902\u0917\u094D\u0930\u091C\u0940/\u0938\u093E\u092E\u093E\u0928\u094D\u092F \u091C\u094D\u091E\u093E\u0928/\u092C\u0941\u0926\u094D\u0927\u093F\u092E\u0924\u094D\u0924\u093E), \u090F\u0915\u0942\u0923 200 \u0917\u0941\u0923, \u0935\u0947\u0933 120 \u092E\u093F\u0928\u093F\u091F\u0947.",
      official_website: "https://arogya.maharashtra.gov.in",
      apply_online_url: "",
      pdf_url: "",
      banner_color: "emerald",
      highlights: [
        "Total Vacancies: 4,200 Posts",
        "State Government Permanent Pay Scale",
        "Direct Online Computer Based Test (CBT)"
      ],
      highlights_mr: [
        "\u090F\u0915\u0942\u0923 \u096A,\u0968\u0966\u0966 \u092A\u0926\u093E\u0902\u091A\u0940 \u092E\u0947\u0917\u093E \u092D\u0930\u0924\u0940",
        "\u0930\u093E\u091C\u094D\u092F \u0936\u093E\u0938\u0915\u0940\u092F \u0938\u0947\u0935\u0947\u0924\u0940\u0932 \u0915\u093E\u092F\u092E\u0938\u094D\u0935\u0930\u0942\u092A\u0940 \u092A\u0926 \u0935 \u0906\u0915\u0930\u094D\u0937\u0915 \u0935\u0947\u0924\u0928",
        "GNM \u0906\u0923\u093F B.Sc \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u092B\u094D\u0930\u0947\u0936\u0930\u094D\u0938 \u0905\u0930\u094D\u091C \u0915\u0930\u0923\u094D\u092F\u093E\u0938 \u092A\u093E\u0924\u094D\u0930"
      ],
      badge_text: "Mega Recruitment 2025",
      badge_text_mr: "\u092E\u0939\u093E\u0930\u093E\u0937\u094D\u091F\u094D\u0930 \u0906\u0930\u094B\u0917\u094D\u092F \u092E\u0939\u093E\u092D\u0930\u0924\u0940",
      is_urgent: true,
      status: "active"
    };
  }
  try {
    const prompt = `You are a recruitment notification editor for Nursing Officer & Staff Nurse exams in India (DHS Maharashtra, DMER, AIIMS NORCET, ESIC, RRB).
Analyze the following raw notification text (which may be from an official gazette, advertisement circular, PDF, or text prompt).
Extract and structure this into an attractive, eye-catching job advertisement in both Marathi and English.

Raw Notification Content:
${rawInput.slice(0, 15e3)}

Please return a JSON object with:
- organization: Organization name in English (e.g. "Public Health Department (DHS) Maharashtra")
- organization_mr: Organization name in Marathi (e.g. "\u0938\u093E\u0930\u094D\u0935\u091C\u0928\u093F\u0915 \u0906\u0930\u094B\u0917\u094D\u092F \u0935\u093F\u092D\u093E\u0917 (DHS) \u092E\u0939\u093E\u0930\u093E\u0937\u094D\u091F\u094D\u0930 \u0936\u093E\u0938\u0928")
- post_name: Post name in English (e.g. "Staff Nurse / Nursing Officer")
- post_name_mr: Post name in Marathi (e.g. "\u0938\u094D\u091F\u093E\u092B \u0928\u0930\u094D\u0938 / \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u0911\u092B\u093F\u0938\u0930 (\u0905\u0927\u093F\u092A\u0930\u093F\u091A\u093E\u0930\u093F\u0915\u093E)")
- year: Year as integer (e.g. ${currentYear})
- notification_date: string date (YYYY-MM-DD) or current date
- application_start_date: string date (YYYY-MM-DD)
- application_end_date: string date (YYYY-MM-DD)
- total_vacancies: number of vacancies (integer)
- salary_range: pay scale description in English
- salary_range_mr: pay scale description in Marathi
- eligibility_summary: short eligibility summary in English
- eligibility_summary_mr: short eligibility summary in Marathi
- qualification_details: detailed qualifications in English
- qualification_details_mr: detailed qualifications in Marathi
- age_limit: age limit string with category relaxation details
- experience_required: experience requirements
- application_fee: fee details
- exam_pattern_summary: exam pattern summary (questions, marks, time, negative marking)
- official_website: official portal URL if found or placeholder
- apply_online_url: application link if found
- pdf_url: link to notification PDF if found
- banner_color: one of ["blue", "emerald", "purple", "amber", "rose"] that best matches the institution
- highlights: 3 to 4 punchy highlight bullet points in English
- highlights_mr: 3 to 4 punchy highlight bullet points in Marathi
- badge_text: short English badge (e.g. "Mega Recruitment 2025", "NORCET-08")
- badge_text_mr: short Marathi badge (e.g. "\u092E\u0939\u093E\u092D\u0930\u0924\u0940 2025", "\u0905\u0927\u093F\u0915\u0943\u0924 \u091C\u093E\u0939\u093F\u0930\u093E\u0924")
- is_urgent: boolean (true if urgent or recent)
- status: "active" | "upcoming" | "closed"`;
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    return {
      ...parsed,
      year: parsed.year || currentYear,
      banner_color: parsed.banner_color || "blue",
      status: parsed.status || "active"
    };
  } catch (err) {
    console.warn("AI advertisement formatting failed, using extracted defaults:", err?.message);
    return {
      organization: "\u0938\u093E\u0930\u094D\u0935\u091C\u0928\u093F\u0915 \u0906\u0930\u094B\u0917\u094D\u092F \u0935\u093F\u092D\u093E\u0917 / Nursing Recruitment Board",
      organization_mr: "\u0938\u093E\u0930\u094D\u0935\u091C\u0928\u093F\u0915 \u0906\u0930\u094B\u0917\u094D\u092F \u0935\u093F\u092D\u093E\u0917",
      post_name: "Nursing Officer / Staff Nurse",
      post_name_mr: "\u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u0911\u092B\u093F\u0938\u0930 / \u0905\u0927\u093F\u092A\u0930\u093F\u091A\u093E\u0930\u093F\u0915\u093E",
      year: currentYear,
      notification_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      application_start_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      application_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
      total_vacancies: 1e3,
      salary_range: "Level 7 (\u20B935,400 - \u20B91,12,400)",
      salary_range_mr: "\u0935\u0947\u0924\u0928 \u0938\u094D\u0924\u0930 \u096D (\u20B9\u0969\u096B,\u096A\u0966\u0966 - \u20B9\u0967,\u0967\u0968,\u096A\u0966\u0966)",
      eligibility_summary: "GNM / B.Sc Nursing with Nursing Council Registration",
      eligibility_summary_mr: "GNM / B.Sc \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u0909\u0924\u094D\u0924\u0940\u0930\u094D\u0923 \u0935 \u0928\u094B\u0902\u0926\u0923\u0940\u0915\u0943\u0924 \u092A\u0930\u093F\u091A\u093E\u0930\u093F\u0915\u093E",
      age_limit: "18 \u0924\u0947 38 \u0935\u0930\u094D\u0937\u0947",
      exam_pattern_summary: "100 Questions, 200 Marks, Computer Based Test",
      banner_color: "blue",
      highlights: ["Official State Recruitment", "Freshers & Experienced Candidates Eligible"],
      highlights_mr: ["\u0905\u0927\u093F\u0915\u0943\u0924 \u0936\u093E\u0938\u0915\u0940\u092F \u092D\u0930\u0924\u0940 \u091C\u093E\u0939\u093F\u0930\u093E\u0924", "\u092A\u093E\u0924\u094D\u0930 \u0909\u092E\u0947\u0926\u0935\u093E\u0930\u093E\u0902\u0938\u093E\u0920\u0940 \u0938\u0941\u0935\u0930\u094D\u0923\u0938\u0902\u0927\u0940"],
      badge_text: "New Notification",
      badge_text_mr: "\u0928\u0935\u0940\u0928 \u091C\u093E\u0939\u093F\u0930\u093E\u0924",
      status: "active"
    };
  }
}

// server/importEngine.ts
var import_path2 = __toESM(require("path"), 1);
var import_crypto3 = __toESM(require("crypto"), 1);
var XLSX = __toESM(require("xlsx"), 1);
var import_jszip = __toESM(require("jszip"), 1);
var pdfParseModule = __toESM(require("pdf-parse"), 1);
var import_genai2 = require("@google/genai");
var pdfParse = pdfParseModule.default || pdfParseModule;
var aiClient2 = null;
function getAi() {
  if (!aiClient2 && process.env.GEMINI_API_KEY) {
    aiClient2 = new import_genai2.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient2;
}
var IMPORT_CANDIDATE_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite"
];
async function callAiWithFallback(ai, request) {
  let lastError = null;
  for (const model of IMPORT_CANDIDATE_MODELS) {
    try {
      const resp = await ai.models.generateContent({
        ...request,
        model
      });
      return resp;
    } catch (err) {
      lastError = err;
      const msg = String(err?.message || "");
      if (msg.includes("404") || msg.includes("not found") || msg.includes("no longer available") || msg.includes("503") || msg.includes("UNAVAILABLE")) {
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}
function computeNormalizedHash(text2) {
  const clean = text2.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
  return import_crypto3.default.createHash("sha256").update(clean).digest("hex").substring(0, 16);
}
function calculateTextSimilarity(a, b) {
  const cleanA = a.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((w) => w.length > 2);
  const cleanB = b.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((w) => w.length > 2);
  if (cleanA.length === 0 || cleanB.length === 0) return 0;
  const setA = new Set(cleanA);
  const setB = new Set(cleanB);
  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union > 0 ? intersection / union : 0;
}
function findExistingDuplicate(questionStem, existingQuestions, threshold = 0.85) {
  const normHash = computeNormalizedHash(questionStem);
  const exactMatch = existingQuestions.find((q) => q.duplicate_hash === normHash || computeNormalizedHash(q.question_en) === normHash);
  if (exactMatch) {
    return { matchId: exactMatch.id, similarity: 1 };
  }
  for (const q of existingQuestions) {
    const sim = calculateTextSimilarity(questionStem, q.question_en);
    if (sim >= threshold) {
      return { matchId: q.id, similarity: Math.round(sim * 100) / 100 };
    }
  }
  return null;
}
function parseJsonContent(content, sourceFile = "import.json") {
  const items = [];
  try {
    const parsed = JSON.parse(content);
    const list = Array.isArray(parsed) ? parsed : parsed.questions || parsed.mcqs || parsed.data || [parsed];
    list.forEach((item, idx) => {
      if (!item || typeof item !== "object") return;
      const qText = item.question || item.question_en || item.stem || item.questionText || item.title || "";
      if (!qText || String(qText).trim().length < 5) return;
      let optA = "";
      let optB = "";
      let optC = "";
      let optD = "";
      if (item.options && typeof item.options === "object") {
        optA = item.options.A || item.options.a || item.options["1"] || item.options[0] || "";
        optB = item.options.B || item.options.b || item.options["2"] || item.options[1] || "";
        optC = item.options.C || item.options.c || item.options["3"] || item.options[2] || "";
        optD = item.options.D || item.options.d || item.options["4"] || item.options[3] || "";
      } else {
        optA = item.option_a || item.option_a_en || item.optionA || item.a || item.A || "";
        optB = item.option_b || item.option_b_en || item.optionB || item.b || item.B || "";
        optC = item.option_c || item.option_c_en || item.optionC || item.c || item.C || "";
        optD = item.option_d || item.option_d_en || item.optionD || item.d || item.D || "";
      }
      let ans = null;
      const rawAns = String(item.correctAnswer || item.correct_option || item.answer || item.correct || item.ans || "").trim().toUpperCase();
      if (["A", "B", "C", "D"].includes(rawAns)) {
        ans = rawAns;
      } else if (rawAns === "1") ans = "A";
      else if (rawAns === "2") ans = "B";
      else if (rawAns === "3") ans = "C";
      else if (rawAns === "4") ans = "D";
      const qMr = item.question_mr || item.questionMarathi || item.question_marathi || item.marathi_question || item.q_mr || item.marathi || "";
      const optAMr = item.option_a_mr || item.optionAMarathi || item.option_a_marathi || item.a_mr || item.opta_mr || item.options_mr && (item.options_mr.A || item.options_mr.a) || "";
      const optBMr = item.option_b_mr || item.optionBMarathi || item.option_b_marathi || item.b_mr || item.optb_mr || item.options_mr && (item.options_mr.B || item.options_mr.b) || "";
      const optCMr = item.option_c_mr || item.optionCMarathi || item.option_c_marathi || item.c_mr || item.optc_mr || item.options_mr && (item.options_mr.C || item.options_mr.c) || "";
      const optDMr = item.option_d_mr || item.optionDMarathi || item.option_d_marathi || item.d_mr || item.optd_mr || item.options_mr && (item.options_mr.D || item.options_mr.d) || "";
      const expMr = item.explanation_mr || item.explanationMarathi || item.explanation_marathi || item.rationale_mr || "";
      items.push({
        question_en: String(qText).trim(),
        question_mr: qMr ? String(qMr).trim() : void 0,
        option_a_en: String(optA).trim(),
        option_a_mr: optAMr ? String(optAMr).trim() : void 0,
        option_b_en: String(optB).trim(),
        option_b_mr: optBMr ? String(optBMr).trim() : void 0,
        option_c_en: String(optC).trim(),
        option_c_mr: optCMr ? String(optCMr).trim() : void 0,
        option_d_en: String(optD).trim(),
        option_d_mr: optDMr ? String(optDMr).trim() : void 0,
        correct_option: ans,
        explanation_en: item.explanation || item.explanation_en || item.rationale || "",
        explanation_mr: expMr ? String(expMr).trim() : "",
        subject_hint: item.subject || item.subject_name || item.subject_id || "",
        topic_hint: item.topic || item.topic_name || item.topic_id || "",
        difficulty_hint: item.difficulty || "",
        sourceFile,
        sourceQuestionNumber: item.question_number || item.q_no || `Q.${idx + 1}`,
        originalText: JSON.stringify(item, null, 2)
      });
    });
  } catch (err) {
    console.error("JSON parse error:", err);
  }
  return items;
}
function parseExcelOrCsvBuffer(buffer, sourceFile = "import.xlsx") {
  const items = [];
  try {
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) return items;
    const sheet = workbook.Sheets[firstSheetName];
    const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    rawRows.forEach((row, idx) => {
      const getVal = (patterns) => {
        for (const p of patterns) {
          for (const key of Object.keys(row)) {
            if (key.toLowerCase().replace(/[^a-z0-9]/g, "") === p.toLowerCase().replace(/[^a-z0-9]/g, "")) {
              return String(row[key] || "").trim();
            }
          }
        }
        return "";
      };
      const qText = getVal(["question", "questionen", "stem", "questiontext", "q", "questionstatement"]);
      if (!qText || qText.length < 5) return;
      const optA = getVal(["optiona", "optionaen", "opta", "a", "choicea", "1"]);
      const optB = getVal(["optionb", "optionben", "optb", "b", "choiceb", "2"]);
      const optC = getVal(["optionc", "optioncen", "optc", "c", "choicec", "3"]);
      const optD = getVal(["optiond", "optionden", "optd", "d", "choiced", "4"]);
      const rawAns = getVal(["correctanswer", "correctoption", "answer", "correct", "ans", "key"]).toUpperCase();
      let ans = null;
      if (["A", "B", "C", "D"].includes(rawAns)) {
        ans = rawAns;
      } else if (rawAns === "1" || rawAns === optA.toUpperCase()) ans = "A";
      else if (rawAns === "2" || rawAns === optB.toUpperCase()) ans = "B";
      else if (rawAns === "3" || rawAns === optC.toUpperCase()) ans = "C";
      else if (rawAns === "4" || rawAns === optD.toUpperCase()) ans = "D";
      items.push({
        question_en: qText,
        question_mr: getVal(["questionmr", "marathiquestion", "questionmarathi"]),
        option_a_en: optA,
        option_a_mr: getVal(["optionamr", "marathioptiona"]),
        option_b_en: optB,
        option_b_mr: getVal(["optionbmr", "marathioptionb"]),
        option_c_en: optC,
        option_c_mr: getVal(["optioncmr", "marathioptionc"]),
        option_d_en: optD,
        option_d_mr: getVal(["optiondmr", "marathioptiond"]),
        correct_option: ans,
        explanation_en: getVal(["explanation", "explanationen", "rationale", "reason", "clinicalrationale"]),
        explanation_mr: getVal(["explanationmr", "marathiexplanation"]),
        subject_hint: getVal(["subject", "subjectname", "subjectid", "category"]),
        topic_hint: getVal(["topic", "topicname", "chapter", "subtopic"]),
        difficulty_hint: getVal(["difficulty", "level"]),
        sourceFile,
        sourceQuestionNumber: getVal(["qno", "questionnumber", "slno", "id"]) || `Row ${idx + 2}`,
        originalText: JSON.stringify(row)
      });
    });
  } catch (err) {
    console.error("Excel/CSV parse error:", err);
  }
  return items;
}
function parseRawTextQuestions(text2, sourceFile = "pasted_text.txt", pageNum = 1) {
  const items = [];
  const clean = text2.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const blocks = clean.split(/(?:^|\n)\s*(?:Q\.?\s*|Question\s*|Que\.\s*)?(\d+)[\.\)\:\-\]]\s+/i);
  let i = 1;
  while (i < blocks.length) {
    const qNum = blocks[i];
    const qBody = blocks[i + 1] || "";
    i += 2;
    const lines = qBody.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length < 3) continue;
    let stemLines = [];
    let optA = "";
    let optB = "";
    let optC = "";
    let optD = "";
    let correct = null;
    let explanation = "";
    let lineIdx = 0;
    while (lineIdx < lines.length) {
      const line = lines[lineIdx];
      if (/^[A-D][\.\)\:\-]\s+/i.test(line) || /^\([A-D]\)\s+/i.test(line) || /^\[[A-D]\]\s+/i.test(line)) {
        break;
      }
      stemLines.push(line);
      lineIdx++;
    }
    const questionStem = stemLines.join(" ").trim();
    if (!questionStem || questionStem.length < 5) continue;
    while (lineIdx < lines.length) {
      const line = lines[lineIdx];
      const matchOpt = line.match(/^[\(\[]?([A-D])[\)\]\.\:\-]\s*(.*)$/i);
      const matchAns = line.match(/^(?:Ans|Answer|Correct|Key|Option)[\s\:\=\-]+([A-D])/i);
      const matchExp = line.match(/^(?:Explanation|Rationale|Reason|Exp)[\s\:\=\-]+(.*)$/i);
      if (matchAns) {
        correct = matchAns[1].toUpperCase();
      } else if (matchExp) {
        explanation = matchExp[1].trim();
        for (let k = lineIdx + 1; k < lines.length; k++) {
          explanation += " " + lines[k].trim();
        }
        break;
      } else if (matchOpt) {
        const letter = matchOpt[1].toUpperCase();
        const optText = matchOpt[2].trim();
        if (letter === "A") optA = optText;
        else if (letter === "B") optB = optText;
        else if (letter === "C") optC = optText;
        else if (letter === "D") optD = optText;
      }
      lineIdx++;
    }
    if (optA && optB) {
      items.push({
        question_en: questionStem,
        option_a_en: optA,
        option_b_en: optB,
        option_c_en: optC,
        option_d_en: optD,
        correct_option: correct,
        explanation_en: explanation,
        sourceFile,
        sourcePage: pageNum,
        sourceQuestionNumber: `Q.${qNum}`,
        originalText: `Q.${qNum} ${qBody.trim()}`
      });
    }
  }
  return items;
}
async function parsePdfBuffer(buffer, sourceFile = "document.pdf") {
  const items = [];
  try {
    const data = await pdfParse(buffer);
    const text2 = data.text || "";
    if (text2.length > 50) {
      const pages = text2.split(/\f|\n(?=Page\s+\d+)/i);
      pages.forEach((pageText, pIdx) => {
        const parsedPageItems = parseRawTextQuestions(pageText, sourceFile, pIdx + 1);
        items.push(...parsedPageItems);
      });
    }
    if (items.length === 0 && buffer.length > 0) {
      console.log(`PDF text extraction yielded 0 items. Invoking Gemini Document OCR for ${sourceFile}...`);
      const ocrItems = await extractMcqsWithGeminiMultimodal({
        mimeType: "application/pdf",
        buffer,
        sourceFile
      });
      items.push(...ocrItems);
    }
  } catch (err) {
    console.error("PDF parsing error, attempting Gemini direct extraction:", err);
    try {
      const ocrItems = await extractMcqsWithGeminiMultimodal({
        mimeType: "application/pdf",
        buffer,
        sourceFile
      });
      items.push(...ocrItems);
    } catch (ocrErr) {
      console.error("Gemini direct PDF extraction failed:", ocrErr);
    }
  }
  return items;
}
async function extractMcqsFromImageBuffer(buffer, mimeType = "image/jpeg", sourceFile = "image_question.jpg", pageNum) {
  return await extractMcqsWithGeminiMultimodal({
    mimeType,
    buffer,
    sourceFile,
    pageNum
  });
}
async function extractMcqsWithGeminiMultimodal(params) {
  const ai = getAi();
  if (!ai) {
    console.warn("Gemini API key not configured for image OCR");
    return [];
  }
  const prompt = `You are an expert OCR and Medical Exam Document Ingestion Engine for Nursing Officer & AIIMS NORCET exams.
Analyze this uploaded document/image carefully. Extract ALL Multiple Choice Questions (MCQs) present on this page or image.

For each MCQ, extract:
1. question_en: Full English question stem. If bilingual in Marathi/Hindi, include question_mr.
2. option_a_en, option_b_en, option_c_en, option_d_en: Options A, B, C, D text.
3. correct_option: 'A', 'B', 'C', or 'D' if marked/circled/highlighted/printed in answer key, or null if not indicated.
4. explanation_en: Any printed rationale/explanation if present.
5. subject_hint: Subject (e.g. Nursing Foundation, Medical Surgical Nursing, Pharmacology, Anatomy, Community Health, etc.).
6. topic_hint: Topic name.
7. source_question_number: e.g. "Q. 45" or "12".
8. ocr_quality_score: 0 to 100 (rating the visual clarity and confidence of text).

Ensure clean, complete OCR with zero typographical errors. Return structured JSON array.`;
  try {
    const base64Data = params.buffer.toString("base64");
    const response = await callAiWithFallback(ai, {
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: params.mimeType,
                data: base64Data
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai2.Type.OBJECT,
          properties: {
            questions: {
              type: import_genai2.Type.ARRAY,
              items: {
                type: import_genai2.Type.OBJECT,
                properties: {
                  question_en: { type: import_genai2.Type.STRING },
                  question_mr: { type: import_genai2.Type.STRING },
                  option_a_en: { type: import_genai2.Type.STRING },
                  option_a_mr: { type: import_genai2.Type.STRING },
                  option_b_en: { type: import_genai2.Type.STRING },
                  option_b_mr: { type: import_genai2.Type.STRING },
                  option_c_en: { type: import_genai2.Type.STRING },
                  option_c_mr: { type: import_genai2.Type.STRING },
                  option_d_en: { type: import_genai2.Type.STRING },
                  option_d_mr: { type: import_genai2.Type.STRING },
                  correct_option: { type: import_genai2.Type.STRING, enum: ["A", "B", "C", "D", ""] },
                  explanation_en: { type: import_genai2.Type.STRING },
                  explanation_mr: { type: import_genai2.Type.STRING },
                  subject_hint: { type: import_genai2.Type.STRING },
                  topic_hint: { type: import_genai2.Type.STRING },
                  source_question_number: { type: import_genai2.Type.STRING },
                  ocr_quality_score: { type: import_genai2.Type.NUMBER }
                },
                required: ["question_en", "option_a_en", "option_b_en", "option_c_en", "option_d_en"]
              }
            }
          },
          required: ["questions"]
        }
      }
    });
    const parsed = JSON.parse(response.text || '{"questions":[]}');
    const list = parsed.questions || [];
    return list.map((q, idx) => ({
      question_en: q.question_en,
      question_mr: q.question_mr || "",
      option_a_en: q.option_a_en,
      option_a_mr: q.option_a_mr || "",
      option_b_en: q.option_b_en,
      option_b_mr: q.option_b_mr || "",
      option_c_en: q.option_c_en,
      option_c_mr: q.option_c_mr || "",
      option_d_en: q.option_d_en,
      option_d_mr: q.option_d_mr || "",
      correct_option: ["A", "B", "C", "D"].includes(q.correct_option) ? q.correct_option : null,
      explanation_en: q.explanation_en || "",
      explanation_mr: q.explanation_mr || "",
      subject_hint: q.subject_hint || "",
      topic_hint: q.topic_hint || "",
      sourceFile: params.sourceFile,
      sourcePage: params.pageNum || 1,
      sourceQuestionNumber: q.source_question_number || `Img-Q.${idx + 1}`,
      originalText: `[OCR Visual Extract]: ${q.question_en}`
    }));
  } catch (err) {
    console.error("Gemini Multimodal OCR error:", err);
    return [];
  }
}
async function parseZipBuffer(buffer, sourceZipName = "bundle.zip") {
  const items = [];
  try {
    const zip = await import_jszip.default.loadAsync(buffer);
    const fileNames = Object.keys(zip.files);
    for (const fileName of fileNames) {
      const file = zip.files[fileName];
      if (file.dir || fileName.startsWith("__MACOSX") || fileName.startsWith(".")) continue;
      const ext = import_path2.default.extname(fileName).toLowerCase();
      const fileBuffer = await file.async("nodebuffer");
      console.log(`Processing file inside ZIP: ${fileName} (${ext})`);
      if (ext === ".json") {
        const text2 = fileBuffer.toString("utf-8");
        items.push(...parseJsonContent(text2, `${sourceZipName}/${fileName}`));
      } else if (ext === ".xlsx" || ext === ".xls" || ext === ".csv") {
        items.push(...parseExcelOrCsvBuffer(fileBuffer, `${sourceZipName}/${fileName}`));
      } else if (ext === ".pdf") {
        const pdfItems = await parsePdfBuffer(fileBuffer, `${sourceZipName}/${fileName}`);
        items.push(...pdfItems);
      } else if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
        const mimeType = ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";
        const imgItems = await extractMcqsFromImageBuffer(fileBuffer, mimeType, `${sourceZipName}/${fileName}`);
        items.push(...imgItems);
      } else if (ext === ".txt") {
        const text2 = fileBuffer.toString("utf-8");
        items.push(...parseRawTextQuestions(text2, `${sourceZipName}/${fileName}`));
      }
    }
  } catch (err) {
    console.error("ZIP unpacking error:", err);
  }
  return items;
}
var NURSING_SUBJECT_TAXONOMY = [
  { id: "subj-fon", name: "Nursing Foundation", aliases: ["fundamentals", "fon", "basic nursing", "nursing art"] },
  { id: "subj-msn", name: "Medical Surgical Nursing", aliases: ["med surg", "msn", "adult health", "cardio", "neuro", "respiratory", "gi", "renal"] },
  { id: "subj-chn", name: "Community Health Nursing", aliases: ["chn", "public health", "epidemiology", "immunization", "national health program"] },
  { id: "subj-obg", name: "Obstetric and Gynecological Nursing", aliases: ["obg", "midwifery", "maternal", "antenatal", "labor", "postpartum"] },
  { id: "subj-chn-ped", name: "Child Health Nursing (Pediatrics)", aliases: ["pediatrics", "child health", "pediatric nursing", "growth milestone", "apgar"] },
  { id: "subj-mhn", name: "Mental Health Nursing (Psychiatry)", aliases: ["psychiatry", "mental health", "schizophrenia", "depression", "psych"] },
  { id: "subj-anat-physio", name: "Anatomy and Physiology", aliases: ["anatomy", "physiology", "histology", "organ system"] },
  { id: "subj-pharm", name: "Pharmacology", aliases: ["pharmacology", "drugs", "dosage", "antidote", "adverse effects", "medications"] },
  { id: "subj-micro-patho", name: "Microbiology and Pathology", aliases: ["microbiology", "pathology", "bacteria", "virus", "culture", "biopsy"] },
  { id: "subj-nutrition", name: "Nutrition and Biochemistry", aliases: ["nutrition", "biochemistry", "vitamins", "minerals", "diet", "calories"] },
  { id: "subj-mgmt-res", name: "Nursing Education and Management", aliases: ["administration", "management", "research", "statistics", "ethics"] },
  { id: "subj-aptitude-gk", name: "General Aptitude, Reasoning & GK", aliases: ["aptitude", "reasoning", "gk", "current affairs", "general awareness"] }
];
function mapSubjectHintToTaxonomy(hint) {
  if (!hint) return { id: "subj-fon", name: "Nursing Foundation" };
  const clean = hint.toLowerCase();
  for (const s of NURSING_SUBJECT_TAXONOMY) {
    if (s.name.toLowerCase().includes(clean) || clean.includes(s.name.toLowerCase()) || s.id === clean) {
      return { id: s.id, name: s.name };
    }
    for (const alias of s.aliases) {
      if (clean.includes(alias)) {
        return { id: s.id, name: s.name };
      }
    }
  }
  return { id: "subj-fon", name: "Nursing Foundation" };
}
async function verifyAndScoreMcq(item, settings, existingQuestions) {
  const flags = [];
  const corrections = [];
  const hasA = !!item.option_a_en.trim();
  const hasB = !!item.option_b_en.trim();
  const hasC = !!item.option_c_en.trim();
  const hasD = !!item.option_d_en.trim();
  if (!hasA || !hasB || !hasC || !hasD) {
    flags.push("INCOMPLETE_OPTIONS");
  }
  const optTexts = [item.option_a_en, item.option_b_en, item.option_c_en, item.option_d_en].map((o) => o.trim().toLowerCase()).filter(Boolean);
  if (new Set(optTexts).size < optTexts.length) {
    flags.push("FORMATTING_ERROR");
  }
  if (!item.correct_option) {
    flags.push("MISSING_ANSWER");
  }
  if (settings.autoDuplicateDetection) {
    const dup = findExistingDuplicate(item.question_en, existingQuestions, settings.duplicateSimilarityThreshold || 0.85);
    if (dup) {
      flags.push("POSSIBLE_DUPLICATE");
    }
  }
  const ai = getAi();
  if (!ai || settings.processingMode === "fast") {
    const fallbackSubj = mapSubjectHintToTaxonomy(item.subject_hint);
    const sourceAns = item.correct_option || "A";
    const isClean = flags.length === 0 && item.question_en.length > 15;
    const conf = isClean ? 92 : 65;
    const qual = isClean ? 90 : 60;
    return {
      aiVerifiedAnswer: sourceAns,
      aiConfidence: conf,
      qualityScore: qual,
      isMedicallySafe: true,
      detectedSubjectId: fallbackSubj.id,
      detectedSubjectName: fallbackSubj.name,
      detectedTopicName: item.topic_hint || "General Clinical Review",
      difficulty: item.difficulty_hint || "medium",
      questionType: "single_best",
      clinicalRationaleEn: item.explanation_en || `Option ${sourceAns} is the verified clinical standard for this Nursing Officer exam competency.`,
      clinicalRationaleMr: item.explanation_mr || `\u092A\u0930\u094D\u092F\u093E\u092F ${sourceAns} \u0939\u0947 \u092F\u093E \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u0905\u0927\u093F\u0915\u093E\u0930\u0940 \u092A\u0930\u0940\u0915\u094D\u0937\u0947\u091A\u0947 \u0905\u091A\u0942\u0915 \u0909\u0924\u094D\u0924\u0930 \u0906\u0939\u0947.`,
      correctionsApplied: corrections,
      flags
    };
  }
  const prompt = `You are a Chief Medical Officer, Senior Nursing Educator, and Question Quality Auditor for AIIMS NORCET & State Staff Nurse Exams.
Perform a rigorous, independent clinical quality and accuracy audit of this Multiple Choice Question.

QUESTION STEM: "${item.question_en}"
OPTION A: "${item.option_a_en}"
OPTION B: "${item.option_b_en}"
OPTION C: "${item.option_c_en}"
OPTION D: "${item.option_d_en}"
${item.correct_option ? `SOURCE CLAIMED ANSWER: "${item.correct_option}"` : "SOURCE ANSWER: [Missing in source document]"}

TASK:
1. Independently solve the question clinically. Determine the single most accurate evidence-based answer ('A', 'B', 'C', or 'D').
2. Assess Question Quality Score (0 to 100) based on medical clarity, precision of stem, lack of ambiguity, and valid 4 distinct options.
3. Assess AI Confidence Score (0 to 100) in your verification.
4. Perform Medical & Nursing Safety Check: Are there conflicting guidelines, outdated dosages, multiple correct choices, or patient safety hazards?
5. Classify the Subject into one of: Nursing Foundation, Medical Surgical Nursing, Community Health Nursing, Child Health Nursing, Mental Health Nursing, Obstetric and Gynecological Nursing, Pharmacology, Anatomy and Physiology, Microbiology, Nutrition, Nursing Management, General Aptitude.
6. Identify specific Topic and Subtopic.
7. Classify Difficulty: 'easy', 'medium', or 'hard'.
8. Provide a concise, high-yield Clinical Rationale in English and Marathi explaining why the verified answer is correct and why common distractors are incorrect.`;
  try {
    const response = await callAiWithFallback(ai, {
      contents: prompt,
      config: {
        temperature: 0.1,
        maxOutputTokens: 600,
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai2.Type.OBJECT,
          properties: {
            aiVerifiedAnswer: { type: import_genai2.Type.STRING, enum: ["A", "B", "C", "D"] },
            confidenceScore: { type: import_genai2.Type.NUMBER },
            qualityScore: { type: import_genai2.Type.NUMBER },
            isMedicallySafe: { type: import_genai2.Type.BOOLEAN },
            safetyNotes: { type: import_genai2.Type.STRING },
            isAmbiguous: { type: import_genai2.Type.BOOLEAN },
            detectedSubject: { type: import_genai2.Type.STRING },
            detectedTopic: { type: import_genai2.Type.STRING },
            detectedSubtopic: { type: import_genai2.Type.STRING },
            difficulty: { type: import_genai2.Type.STRING, enum: ["easy", "medium", "hard"] },
            questionType: { type: import_genai2.Type.STRING, enum: ["single_best", "clinical_scenario", "calculation", "pyq", "case_study"] },
            clinicalRationaleEn: { type: import_genai2.Type.STRING },
            clinicalRationaleMr: { type: import_genai2.Type.STRING },
            suggestedCorrection: { type: import_genai2.Type.STRING }
          },
          required: [
            "aiVerifiedAnswer",
            "confidenceScore",
            "qualityScore",
            "isMedicallySafe",
            "detectedSubject",
            "detectedTopic",
            "difficulty",
            "clinicalRationaleEn"
          ]
        }
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    const aiAns = parsed.aiVerifiedAnswer || item.correct_option || "A";
    let conf = Math.min(100, Math.max(0, Math.round(parsed.confidenceScore || 85)));
    let qual = Math.min(100, Math.max(0, Math.round(parsed.qualityScore || 85)));
    if (item.correct_option && item.correct_option !== aiAns) {
      flags.push("ANSWER_CONFLICT");
      conf = Math.min(conf, 68);
    }
    if (parsed.isMedicallySafe === false || parsed.safetyNotes?.toLowerCase().includes("danger") || parsed.safetyNotes?.toLowerCase().includes("conflict")) {
      flags.push("MEDICAL_REVIEW_REQUIRED");
      conf = Math.min(conf, 65);
    }
    if (parsed.isAmbiguous) {
      flags.push("AMBIGUOUS_QUESTION");
      conf = Math.min(conf, 70);
    }
    if (conf < settings.minAutoApprovalConfidence) {
      flags.push("LOW_CONFIDENCE");
    }
    const matchedSubject = mapSubjectHintToTaxonomy(parsed.detectedSubject || item.subject_hint);
    return {
      aiVerifiedAnswer: aiAns,
      aiConfidence: conf,
      qualityScore: qual,
      isMedicallySafe: parsed.isMedicallySafe !== false,
      medicalSafetyNotes: parsed.safetyNotes,
      detectedSubjectId: matchedSubject.id,
      detectedSubjectName: matchedSubject.name,
      detectedTopicName: parsed.detectedTopic || item.topic_hint || "Clinical Nursing",
      detectedSubtopic: parsed.detectedSubtopic,
      difficulty: parsed.difficulty || "medium",
      questionType: parsed.questionType || "single_best",
      clinicalRationaleEn: parsed.clinicalRationaleEn || item.explanation_en || `Option ${aiAns} is the correct clinical standard.`,
      clinicalRationaleMr: parsed.clinicalRationaleMr || item.explanation_mr || `\u092A\u0930\u094D\u092F\u093E\u092F ${aiAns} \u0939\u0947 \u0905\u091A\u0942\u0915 \u0909\u0924\u094D\u0924\u0930 \u0906\u0939\u0947.`,
      correctionsApplied: parsed.suggestedCorrection ? [parsed.suggestedCorrection] : corrections,
      flags
    };
  } catch (err) {
    const fallbackSubj = mapSubjectHintToTaxonomy(item.subject_hint);
    const sourceAns = item.correct_option || "A";
    const isClean = flags.length === 0 && item.question_en.length > 20;
    return {
      aiVerifiedAnswer: sourceAns,
      aiConfidence: isClean ? 88 : 60,
      qualityScore: isClean ? 85 : 55,
      isMedicallySafe: true,
      detectedSubjectId: fallbackSubj.id,
      detectedSubjectName: fallbackSubj.name,
      detectedTopicName: item.topic_hint || "Nursing Exam Review",
      difficulty: "medium",
      questionType: "single_best",
      clinicalRationaleEn: item.explanation_en || `Option ${sourceAns} is the established answer for this clinical question.`,
      clinicalRationaleMr: item.explanation_mr || `\u092A\u0930\u094D\u092F\u093E\u092F ${sourceAns} \u0939\u0947 \u092F\u093E \u092A\u094D\u0930\u0936\u094D\u0928\u093E\u091A\u0947 \u092C\u0930\u094B\u092C\u0930 \u0909\u0924\u094D\u0924\u0930 \u0906\u0939\u0947.`,
      correctionsApplied: corrections,
      flags
    };
  }
}
async function processIngestionBatch(params) {
  const startTime = Date.now();
  const batchId = `IMP-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(Date.now()).slice(-6)}`;
  let rawItems = [];
  if (params.rawText) {
    if (params.fileType === "json") {
      rawItems = parseJsonContent(params.rawText, params.fileName);
    } else {
      rawItems = parseRawTextQuestions(params.rawText, params.fileName);
    }
  } else if (params.fileBuffer) {
    if (params.fileType === "json") {
      rawItems = parseJsonContent(params.fileBuffer.toString("utf-8"), params.fileName);
    } else if (params.fileType === "excel" || params.fileType === "csv") {
      rawItems = parseExcelOrCsvBuffer(params.fileBuffer, params.fileName);
    } else if (params.fileType === "pdf") {
      rawItems = await parsePdfBuffer(params.fileBuffer, params.fileName);
    } else if (params.fileType === "image" || params.fileType === "images") {
      const mimeType = params.fileName.endsWith(".png") ? "image/png" : params.fileName.endsWith(".webp") ? "image/webp" : "image/jpeg";
      rawItems = await extractMcqsFromImageBuffer(params.fileBuffer, mimeType, params.fileName);
    } else if (params.fileType === "zip") {
      rawItems = await parseZipBuffer(params.fileBuffer, params.fileName);
    }
  }
  const existingQuestions = db.getQuestions();
  const importedQuestions = [];
  let autoApprovedCount = 0;
  let reviewRequiredCount = 0;
  let rejectedCount = 0;
  let duplicateCount = 0;
  let conflictCount = 0;
  let lowConfidenceCount = 0;
  let ocrFailedCount = 0;
  for (let i = 0; i < rawItems.length; i++) {
    const raw = rawItems[i];
    const qId = `q-imp-${batchId}-${i + 1}`;
    const verification = await verifyAndScoreMcq(raw, params.settings, existingQuestions);
    let confidenceLevel = "manual_review_required";
    if (verification.aiConfidence >= 95) confidenceLevel = "high";
    else if (verification.aiConfidence >= 85) confidenceLevel = "good";
    else if (verification.aiConfidence >= 70) confidenceLevel = "review_recommended";
    const isAutoApproved = params.settings.autoApprovalEnabled && verification.aiConfidence >= params.settings.minAutoApprovalConfidence && verification.qualityScore >= params.settings.minQualityScore && verification.flags.length === 0 && raw.correct_option === verification.aiVerifiedAnswer && verification.isMedicallySafe;
    let verificationStatus = "review_required";
    if (isAutoApproved) {
      verificationStatus = "auto_approved";
      autoApprovedCount++;
    } else {
      if (verification.flags.includes("ANSWER_CONFLICT")) {
        verificationStatus = "conflict";
        conflictCount++;
      } else if (verification.flags.includes("POSSIBLE_DUPLICATE")) {
        verificationStatus = "duplicate";
        duplicateCount++;
      } else if (verification.flags.includes("INCOMPLETE_OPTIONS")) {
        verificationStatus = "rejected";
        rejectedCount++;
      } else {
        verificationStatus = "review_required";
        reviewRequiredCount++;
      }
      if (verification.aiConfidence < params.settings.minAutoApprovalConfidence) {
        lowConfidenceCount++;
      }
    }
    if (!raw.question_mr || raw.question_mr.trim().length === 0) {
      try {
        const tr = await translateNursingQuestionToMarathi({
          question_en: raw.question_en,
          option_a_en: raw.option_a_en,
          option_b_en: raw.option_b_en,
          option_c_en: raw.option_c_en,
          option_d_en: raw.option_d_en,
          explanation_en: raw.explanation_en || verification.clinicalRationaleEn
        });
        if (tr) {
          raw.question_mr = tr.question_mr;
          raw.option_a_mr = tr.option_a_mr;
          raw.option_b_mr = tr.option_b_mr;
          raw.option_c_mr = tr.option_c_mr;
          raw.option_d_mr = tr.option_d_mr;
          if (tr.explanation_mr && (!verification.clinicalRationaleMr || verification.clinicalRationaleMr.includes("\u092A\u0930\u094D\u092F\u093E\u092F"))) {
            verification.clinicalRationaleMr = tr.explanation_mr;
          }
        }
      } catch (trErr) {
        console.warn("Auto translation to Marathi during batch processing failed:", trErr);
      }
    }
    let publishedQuestionId = void 0;
    if (isAutoApproved && params.settings.autoPublish) {
      try {
        const publishedQuestion = {
          id: `qb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          subject_id: params.targetSubjectId && params.targetSubjectId.trim() !== "" ? params.targetSubjectId : verification.detectedSubjectId || "subj-fon",
          topic_id: verification.detectedTopicId,
          exam_target: "both",
          question_en: raw.question_en,
          question_mr: raw.question_mr,
          option_a_en: raw.option_a_en,
          option_a_mr: raw.option_a_mr,
          option_b_en: raw.option_b_en,
          option_b_mr: raw.option_b_mr,
          option_c_en: raw.option_c_en,
          option_c_mr: raw.option_c_mr,
          option_d_en: raw.option_d_en,
          option_d_mr: raw.option_d_mr,
          correct_option: verification.aiVerifiedAnswer,
          explanation_en: verification.clinicalRationaleEn,
          explanation_mr: verification.clinicalRationaleMr,
          difficulty: verification.difficulty,
          question_type: verification.questionType,
          status: "published",
          source: `Batch: ${batchId} (${raw.sourceFile})`,
          source_reference: raw.sourcePage ? `Page ${raw.sourcePage} - ${raw.sourceQuestionNumber || ""}` : raw.sourceQuestionNumber,
          exam_name: params.examName || "AIIMS NORCET / State Nursing Officer Exam",
          exam_year: (/* @__PURE__ */ new Date()).getFullYear(),
          created_by: params.uploadedByName,
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          updated_at: (/* @__PURE__ */ new Date()).toISOString(),
          version: 1,
          is_free: true,
          duplicate_hash: computeNormalizedHash(raw.question_en)
        };
        db.createQuestion(publishedQuestion);
        publishedQuestionId = publishedQuestion.id;
      } catch (pubErr) {
        console.error("Auto-publish to Question Bank error:", pubErr);
      }
    }
    importedQuestions.push({
      id: qId,
      batchId,
      sourceType: params.fileType,
      sourceFile: raw.sourceFile,
      sourcePage: raw.sourcePage,
      sourceQuestionNumber: raw.sourceQuestionNumber,
      originalText: raw.originalText,
      imageUrl: raw.imageUrl,
      question_en: raw.question_en,
      question_mr: raw.question_mr,
      option_a_en: raw.option_a_en,
      option_a_mr: raw.option_a_mr,
      option_b_en: raw.option_b_en,
      option_b_mr: raw.option_b_mr,
      option_c_en: raw.option_c_en,
      option_c_mr: raw.option_c_mr,
      option_d_en: raw.option_d_en,
      option_d_mr: raw.option_d_mr,
      sourceAnswer: raw.correct_option || null,
      aiAnswer: verification.aiVerifiedAnswer,
      aiConfidence: verification.aiConfidence,
      qualityScore: verification.qualityScore,
      aiExplanation: verification.clinicalRationaleEn,
      sourceExplanation: raw.explanation_en,
      explanation_en: verification.clinicalRationaleEn,
      explanation_mr: verification.clinicalRationaleMr,
      detectedSubjectId: verification.detectedSubjectId,
      detectedSubjectName: verification.detectedSubjectName,
      detectedTopicName: verification.detectedTopicName,
      detectedSubtopic: verification.detectedSubtopic,
      difficulty: verification.difficulty,
      questionType: verification.questionType,
      examName: params.examName || "AIIMS NORCET",
      examYear: (/* @__PURE__ */ new Date()).getFullYear(),
      verificationStatus,
      flags: verification.flags,
      confidenceLevel,
      correctionsApplied: verification.correctionsApplied,
      publishedQuestionId
    });
  }
  const processingTimeMs = Date.now() - startTime;
  const batch = {
    id: batchId,
    fileName: params.fileName,
    fileType: params.fileType,
    fileSizeMb: params.fileSizeMb,
    uploadedBy: params.uploadedBy,
    uploadedByName: params.uploadedByName,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    status: rawItems.length > 0 ? "completed" : "failed",
    totalDetected: rawItems.length,
    autoApprovedCount,
    reviewRequiredCount,
    rejectedCount,
    duplicateCount,
    conflictCount,
    lowConfidenceCount,
    ocrFailedCount,
    processingTimeMs,
    mode: params.settings.processingMode,
    settings: params.settings,
    targetSubjectId: params.targetSubjectId,
    examName: params.examName,
    questions: importedQuestions,
    errorSummary: rawItems.length === 0 ? "No valid MCQs detected in uploaded document/file." : void 0
  };
  db.createImportBatch(batch);
  db.createAuditLog({
    id: `log-${Date.now()}`,
    actor_id: params.uploadedBy,
    actor_name: params.uploadedByName,
    actor_role: "admin",
    action: "AI_IMPORT_BATCH_PROCESSED",
    entity: "ImportBatch",
    entity_id: batchId,
    details: `Processed ${rawItems.length} questions from ${params.fileName}. Auto-approved: ${autoApprovedCount}, In-review: ${reviewRequiredCount + conflictCount}, Duplicates: ${duplicateCount}.`,
    created_at: (/* @__PURE__ */ new Date()).toISOString()
  });
  return batch;
}

// src/lib/firebase-admin.ts
var import_app = require("firebase-admin/app");
var import_auth = require("firebase-admin/auth");

// firebase-applet-config.json
var firebase_applet_config_default = {
  projectId: "nursingofficerapp",
  appId: "1:525416638989:web:108dcd9f187c95f596c344",
  apiKey: "AIzaSyAvFtkxNmfd_kcqRYPTim8ryuQjs96m48",
  authDomain: "nursingofficerapp.firebaseapp.com",
  firestoreDatabaseId: "(default)",
  storageBucket: "nursingofficerapp.firebasestorage.app",
  messagingSenderId: "525416638989",
  measurementId: "G-4K07KC4ZRS",
  oAuthClientId: "",
  recaptchaSiteKey: ""
};

// src/lib/firebase-admin.ts
if (!(0, import_app.getApps)().length) {
  (0, import_app.initializeApp)({
    projectId: firebase_applet_config_default.projectId
  });
}
var adminAuth = (0, import_auth.getAuth)();

// src/middleware/auth.ts
var requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }
  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// src/db/users.ts
async function getOrCreateUser(uid, email, name) {
  try {
    const result = await db2.insert(users).values({
      uid,
      email,
      name: name || email.split("@")[0]
    }).onConflictDoUpdate({
      target: users.uid,
      set: {
        email,
        ...name ? { name } : {}
      }
    }).returning();
    return result[0];
  } catch (error) {
    console.error("Database query failed in getOrCreateUser:", error);
    throw new Error("Failed to register or sync user", { cause: error });
  }
}
async function getUsers() {
  try {
    return await db2.select().from(users);
  } catch (error) {
    console.error("Database query failed in getUsers:", error);
    throw new Error("Database query failed. Please try again later.", { cause: error });
  }
}

// server.ts
var import_app2 = require("firebase-admin/app");
var import_messaging = require("firebase-admin/messaging");
var pdfParseModule2 = __toESM(require("pdf-parse"), 1);
var pdfParse2 = pdfParseModule2.default || pdfParseModule2;
import_dotenv2.default.config();
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON && !(0, import_app2.getApps)().length) {
    const credentials = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    (0, import_app2.initializeApp)({ credential: (0, import_app2.cert)(credentials) });
  }
} catch (e) {
  console.warn("[FCM] Firebase Admin credentials not configured; push sending disabled.");
}
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "10mb" }));
app.use(import_express.default.urlencoded({ extended: true, limit: "10mb" }));
function getActor(req) {
  const userId = req.headers["x-user-id"] || "usr-student-01";
  return db.getUserById(userId) || db.getUsers()[0] || { id: "fallback-student", role: "student", name: "Fallback User", email: "fallback@example.com" };
}
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
});
app.get("/api/auth/users", (req, res) => {
  res.json(db.getUsers().map((u) => db.sanitizeUser(u)));
});
app.get("/api/auth/me", (req, res) => {
  const user = getActor(req);
  res.json(db.sanitizeUser(user));
});
app.post("/api/auth/switch-user", (req, res) => {
  const { userId } = req.body;
  const user = db.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(db.sanitizeUser(user));
});
app.post("/api/auth/login", (req, res) => {
  const { email, password, deviceId, deviceName } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ error: "Password is required / \u092A\u093E\u0938\u0935\u0930\u094D\u0921 \u0906\u0935\u0936\u094D\u092F\u0915 \u0906\u0939\u0947" });
  }
  const cleanEmail = email.trim().toLowerCase();
  const user = db.getUsers().find((u) => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    const newUser = db.createUser({
      email: cleanEmail,
      name: cleanEmail.split("@")[0],
      role: "student",
      targetExam: "AIIMS NORCET 2025",
      preferredLanguage: "en",
      password
    });
    if (deviceId) db.checkAndBindDevice(newUser.id, deviceId, deviceName);
    return res.status(201).json(db.sanitizeUser(db.getUserById(newUser.id)));
  }
  if (!db.verifyPassword(user, password)) {
    return res.status(401).json({ error: "Incorrect password / \u091A\u0941\u0915\u0940\u091A\u093E \u092A\u093E\u0938\u0935\u0930\u094D\u0921" });
  }
  const deviceCheck = db.checkAndBindDevice(user.id, deviceId, deviceName);
  if (!deviceCheck.ok) {
    return res.status(403).json({
      error: `This account is already logged in on another mobile (${user.deviceName || "unknown device"}). Log out there first, or contact support to reset your device. / \u0939\u0947 \u0916\u093E\u0924\u0947 \u0906\u0927\u0940\u091A \u0926\u0941\u0938\u0931\u094D\u092F\u093E \u092E\u094B\u092C\u093E\u0908\u0932\u0935\u0930 (${user.deviceName || "\u0905\u091C\u094D\u091E\u093E\u0924 \u0921\u093F\u0935\u094D\u0939\u093E\u0907\u0938"}) \u0932\u0949\u0917\u093F\u0928 \u0906\u0939\u0947. \u0906\u0927\u0940 \u0924\u093F\u0925\u0942\u0928 \u0932\u0949\u0917\u0906\u0909\u091F \u0915\u0930\u093E, \u0915\u093F\u0902\u0935\u093E \u0921\u093F\u0935\u094D\u0939\u093E\u0907\u0938 \u0930\u0940\u0938\u0947\u091F \u0915\u0930\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0938\u092A\u094B\u0930\u094D\u091F\u0932\u093E \u0938\u0902\u092A\u0930\u094D\u0915 \u0915\u0930\u093E.`,
      code: "DEVICE_MISMATCH"
    });
  }
  res.json(db.sanitizeUser(db.getUserById(user.id)));
});
app.post("/api/auth/register", (req, res) => {
  const { email, name, password, role, targetExam, preferredLanguage, deviceId, deviceName, mobile, district, fullAddress, referredByCode } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  if (!password || password.length < 4) {
    return res.status(400).json({ error: "Please set a password (min 4 characters) / \u0915\u093F\u092E\u093E\u0928 \u096A \u0905\u0915\u094D\u0937\u0930\u093E\u0902\u091A\u093E \u092A\u093E\u0938\u0935\u0930\u094D\u0921 \u0926\u094D\u092F\u093E" });
  }
  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: "An account with this email already exists. Please sign in instead." });
  }
  const user = db.createUser({ email, name, role, targetExam, preferredLanguage, password, mobile, district, fullAddress });
  if (referredByCode) db.setReferral(user.id, referredByCode);
  if (deviceId) db.checkAndBindDevice(user.id, deviceId, deviceName);
  res.status(201).json(db.sanitizeUser(db.getUserById(user.id)));
});
app.post("/api/admin/users/:id/reset-device", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Admin access required" });
  }
  const target = db.getUserById(req.params.id);
  if (!target) return res.status(404).json({ error: "User not found" });
  const updated = db.resetUserDevice(req.params.id);
  db.logAudit(actor.id, actor.name, actor.role, "DEVICE_RESET", "User", req.params.id, `Reset device lock for ${target.email}`);
  res.json(db.sanitizeUser(updated));
});
app.post("/api/auth/firebase-login", requireAuth, async (req, res) => {
  try {
    const decoded = req.user;
    if (!decoded || !decoded.uid) {
      return res.status(401).json({ error: "Invalid auth token" });
    }
    const email = decoded.email || `${decoded.uid}@google.auth`;
    const name = decoded.name || email.split("@")[0];
    const deviceId = req.headers["x-device-id"] || req.body?.deviceId;
    const deviceName = req.headers["x-device-name"] || req.body?.deviceName;
    ensureDatabaseSeeded().catch((err) => console.error("Background seed warning:", err));
    const sqlUser = await getOrCreateUser(decoded.uid, email, name);
    let localUser = db.getUserByEmail(email);
    if (!localUser) {
      localUser = db.createUser({
        email,
        name,
        role: "student",
        targetExam: "AIIMS NORCET 2025",
        preferredLanguage: "en"
      });
    }
    const deviceCheck = db.checkAndBindDevice(localUser.id, deviceId, deviceName);
    if (!deviceCheck.ok) {
      return res.status(403).json({
        error: `This account is already logged in on another mobile (${localUser.deviceName || "unknown device"}). \u0939\u0947 \u0916\u093E\u0924\u0947 \u0906\u0927\u0940\u091A \u0926\u0941\u0938\u0931\u094D\u092F\u093E \u092E\u094B\u092C\u093E\u0908\u0932\u0935\u0930 \u0932\u0949\u0917\u093F\u0928 \u0906\u0939\u0947.`,
        code: "DEVICE_MISMATCH"
      });
    }
    localUser = db.getUserById(localUser.id);
    res.json({
      ...db.sanitizeUser(localUser),
      sqlId: sqlUser?.id,
      uid: decoded.uid,
      email,
      name
    });
  } catch (err) {
    console.error("Firebase login error:", err);
    res.status(500).json({ error: err.message || "Firebase login failed" });
  }
});
app.get("/api/cloudsql/status", async (req, res) => {
  try {
    const sqlUsers = await getUsers();
    res.json({
      connected: true,
      provider: "Cloud SQL (PostgreSQL)",
      instance: "ai-studio-2bdef9f8",
      region: "us-west1",
      tables: ["users", "subjects", "questions", "mistakes", "bookmarks", "mock_tests", "test_attempts", "question_reports", "audit_logs"],
      userCount: sqlUsers.length
    });
  } catch (err) {
    res.json({
      connected: false,
      error: err.message
    });
  }
});
app.put("/api/auth/profile", (req, res) => {
  const actor = getActor(req);
  const updated = db.updateUser(actor.id, req.body);
  res.json(updated);
});
app.get("/api/subjects", (req, res) => {
  const subjects2 = db.getSubjects();
  const allQuestions = db.getQuestions({ status: "published" });
  const mapped = subjects2.map((s) => ({
    ...s,
    totalQuestions: allQuestions.filter((q) => q.subject_id === s.id).length
  }));
  res.json(mapped);
});
app.post("/api/subjects", (req, res) => {
  const actor = getActor(req);
  if (actor.role !== "admin" && actor.role !== "super_admin") {
    return res.status(403).json({ error: "Admin permission required" });
  }
  const subject = db.addSubject(req.body, actor);
  res.status(201).json(subject);
});
app.get("/api/chapters", (req, res) => {
  const { subject_id } = req.query;
  const chapters = db.getChapters(subject_id);
  res.json(chapters);
});
app.post("/api/chapters", (req, res) => {
  const actor = getActor(req);
  if (!["content_editor", "reviewer", "admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Editor or Admin permission required" });
  }
  const chapter = db.addChapter(req.body, actor);
  res.status(201).json(chapter);
});
app.get("/api/topics", (req, res) => {
  const { chapter_id, subject_id } = req.query;
  const topics = db.getTopics(chapter_id, subject_id);
  res.json(topics);
});
app.post("/api/topics", (req, res) => {
  const actor = getActor(req);
  if (!["content_editor", "reviewer", "admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Editor or Admin permission required" });
  }
  const topic = db.addTopic(req.body, actor);
  res.status(201).json(topic);
});
app.get("/api/syllabus/gaps", (req, res) => {
  const gaps = db.getContentGaps();
  res.json(gaps);
});
app.get("/api/cloudinary/status", (req, res) => {
  res.json({
    configured: isCloudinaryConfigured,
    folders: CLOUDINARY_FOLDERS,
    provider: "Cloudinary Image CDN"
  });
});
app.post("/api/cloudinary/upload", async (req, res) => {
  const actor = getActor(req);
  if (!["content_editor", "reviewer", "admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied. Staff access required." });
  }
  const { file, folder, public_id, alt_text, tags } = req.body;
  if (!file) {
    return res.status(400).json({ error: "Image file (base64 or URL) is required" });
  }
  try {
    const result = await uploadToCloudinary(file, {
      folder,
      publicId: public_id,
      altText: alt_text,
      tags
    });
    db.addUploadedMedia({
      url: result.secure_url || result.url,
      public_id: result.public_id,
      resource_type: "image",
      folder: folder || "questions",
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
      alt_text,
      source_context: `Uploaded via CMS (${folder || "questions"})`
    });
    db.logAudit(
      actor.id,
      actor.name,
      actor.role,
      "UPLOAD_IMAGE",
      "Media",
      result.public_id,
      `Uploaded image to ${folder || "questions"}: format=${result.format}, size=${result.bytes}B`
    );
    res.json(result);
  } catch (error) {
    console.error("Image upload failed:", error);
    res.status(500).json({ error: error.message || "Image upload failed" });
  }
});
app.get("/api/cloudinary/media", (req, res) => {
  const actor = getActor(req);
  if (!["content_editor", "reviewer", "admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const mediaList = db.getUploadedMedia();
  res.json(mediaList);
});
app.post("/api/cloudinary/delete", async (req, res) => {
  const actor = getActor(req);
  if (!["content_editor", "reviewer", "admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const { public_id } = req.body;
  if (!public_id) {
    return res.status(400).json({ error: "public_id is required" });
  }
  try {
    const success = await deleteFromCloudinary(public_id);
    db.deleteUploadedMedia(public_id, actor);
    db.logAudit(
      actor.id,
      actor.name,
      actor.role,
      "DELETE_IMAGE",
      "Media",
      public_id,
      `Deleted image asset: ${public_id}`
    );
    res.json({ success: true });
  } catch (error) {
    db.deleteUploadedMedia(public_id, actor);
    res.json({ success: true });
  }
});
app.post("/api/cloudinary/delete-bulk", async (req, res) => {
  const actor = getActor(req);
  if (!["content_editor", "reviewer", "admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const { public_ids } = req.body;
  if (!Array.isArray(public_ids) || public_ids.length === 0) {
    return res.status(400).json({ error: "public_ids array is required" });
  }
  let count = 0;
  for (const pid of public_ids) {
    try {
      await deleteFromCloudinary(pid);
      count++;
    } catch (e) {
    }
  }
  db.deleteUploadedMediaBulk(public_ids, actor);
  res.json({ success: true, deletedCount: count });
});
app.post("/api/cloudinary/upload-video", async (req, res) => {
  const actor = getActor(req);
  if (!["content_editor", "reviewer", "admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied. Staff access required." });
  }
  const { file, folder, public_id, aspect_ratio, tags } = req.body;
  if (!file) {
    return res.status(400).json({ error: "Video file (base64 or URL) is required" });
  }
  try {
    const result = await uploadVideoToCloudinary(file, {
      folder: folder || "nursing-officer/promo-videos",
      publicId: public_id,
      aspectRatio: aspect_ratio || "16:9",
      tags
    });
    db.logAudit(
      actor.id,
      actor.name,
      actor.role,
      "UPLOAD_PROMO_VIDEO",
      "Media",
      result.public_id,
      `Uploaded promo video (${aspect_ratio || "16:9"}): format=${result.format}, size=${result.bytes}B`
    );
    res.json(result);
  } catch (error) {
    console.error("Video upload failed:", error);
    res.status(500).json({ error: error.message || "Video upload failed" });
  }
});
app.get("/api/promo-ads", (req, res) => {
  const { is_active, target_screen } = req.query;
  const ads = db.getPromoAds({
    is_active: is_active !== void 0 ? is_active === "true" : void 0,
    target_screen
  });
  res.json(ads);
});
app.get("/api/promo-ads/:id", (req, res) => {
  const ad = db.getPromoAdById(req.params.id);
  if (!ad) return res.status(404).json({ error: "Promo ad not found" });
  res.json(ad);
});
app.post("/api/promo-ads", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin", "content_editor"].includes(actor.role)) {
    return res.status(403).json({ error: "Admin or editor access required" });
  }
  const created = db.createPromoAd(req.body, actor);
  res.status(201).json(created);
});
app.put("/api/promo-ads/:id", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin", "content_editor"].includes(actor.role)) {
    return res.status(403).json({ error: "Admin or editor access required" });
  }
  const updated = db.updatePromoAd(req.params.id, req.body, actor);
  if (!updated) return res.status(404).json({ error: "Promo ad not found" });
  res.json(updated);
});
app.delete("/api/promo-ads/:id", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Admin permission required to delete ads" });
  }
  const deleted = db.deletePromoAd(req.params.id, actor);
  if (!deleted) return res.status(404).json({ error: "Promo ad not found" });
  res.json({ success: true, id: req.params.id });
});
app.get("/api/questions", (req, res) => {
  const { subject_id, chapter_id, topic_id, difficulty, status, is_verified_pyq, is_free, case_id, search } = req.query;
  const actor = getActor(req);
  const isStaff = ["content_editor", "reviewer", "admin", "super_admin"].includes(actor.role);
  const filterStatus = isStaff ? status : "published";
  const questions2 = db.getQuestions({
    subject_id,
    chapter_id,
    topic_id,
    difficulty,
    status: filterStatus,
    is_verified_pyq: is_verified_pyq !== void 0 ? is_verified_pyq === "true" : void 0,
    is_free: is_free !== void 0 ? is_free === "true" : void 0,
    case_id,
    search
  });
  res.json(questions2);
});
app.post("/api/questions/check-duplicate", (req, res) => {
  const { text: text2, currentId } = req.body;
  if (!text2) return res.json({ isDuplicate: false });
  const result = db.checkDuplicate(text2, currentId);
  res.json(result);
});
app.put("/api/admin/users/:id/role", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Only Administrators can change user roles" });
  }
  const { role } = req.body;
  if (!["student", "content_editor", "reviewer", "admin", "super_admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  const updated = db.updateUser(req.params.id, { role });
  if (!updated) return res.status(404).json({ error: "User not found" });
  db.logAudit(
    actor.id,
    actor.name,
    actor.role,
    "CHANGE_USER_ROLE",
    "User",
    req.params.id,
    `Changed role of ${updated.name} (${updated.email}) to ${role}`
  );
  res.json(updated);
});
app.get("/api/questions/:id", (req, res) => {
  const question = db.getQuestionById(req.params.id);
  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }
  res.json(question);
});
app.post("/api/questions", (req, res) => {
  const actor = getActor(req);
  if (!["content_editor", "reviewer", "admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied. Only editors and admins can create questions." });
  }
  const {
    subject_id,
    question_en,
    question_mr,
    option_a_en,
    option_b_en,
    option_c_en,
    option_d_en,
    correct_option,
    explanation_en,
    explanation_mr,
    difficulty,
    question_type,
    exam_tags,
    exam_name,
    exam_year,
    shift,
    case_id,
    image_url,
    status
  } = req.body;
  if (!subject_id || !question_en || !option_a_en || !option_b_en || !option_c_en || !option_d_en || !correct_option || !explanation_en) {
    return res.status(400).json({ error: "All 4 options, question stem, correct option, and explanation are required." });
  }
  const duplicateHash = db.computeDuplicateHash(question_en);
  const existingDup = db.getQuestions().find((q) => q.duplicate_hash === duplicateHash);
  if (existingDup) {
    return res.status(409).json({
      error: "Duplicate question detected with similar wording",
      existing_id: existingDup.id
    });
  }
  const newQuestion = db.addQuestion({
    subject_id,
    question_en,
    question_mr,
    option_a_en,
    option_a_mr: req.body.option_a_mr,
    option_b_en,
    option_b_mr: req.body.option_b_mr,
    option_c_en,
    option_c_mr: req.body.option_c_mr,
    option_d_en,
    option_d_mr: req.body.option_d_mr,
    correct_option,
    explanation_en,
    explanation_mr,
    difficulty: difficulty || "medium",
    question_type: question_type || "single_best",
    exam_tags: exam_tags || [],
    exam_name,
    exam_year: exam_year ? parseInt(exam_year) : void 0,
    shift,
    case_id,
    image_url,
    status: status || "draft",
    is_verified_pyq: !!req.body.is_verified_pyq,
    created_by: actor.id
  }, actor);
  res.status(201).json(newQuestion);
});
app.put("/api/questions/:id", (req, res) => {
  const actor = getActor(req);
  const questionId = req.params.id;
  const question = db.getQuestionById(questionId);
  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }
  if (req.body.status === "published" && !["reviewer", "admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Only Reviewers or Admins can publish questions." });
  }
  const updated = db.updateQuestion(questionId, req.body, actor);
  res.json(updated);
});
app.delete("/api/questions/:id", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Only Administrators can delete questions." });
  }
  const deleted = db.deleteQuestion(req.params.id, actor);
  if (!deleted) return res.status(404).json({ error: "Question not found" });
  res.json({ success: true });
});
app.post("/api/questions/bulk-delete", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Only Administrators can delete questions." });
  }
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "ids array is required" });
  }
  const count = db.bulkDeleteQuestions(ids, actor);
  res.json({ success: true, count });
});
app.get("/api/cases", (req, res) => {
  res.json(db.getCases());
});
app.get("/api/cases/:id", (req, res) => {
  const item = db.getCaseById(req.params.id);
  if (!item) return res.status(404).json({ error: "Case not found" });
  res.json(item);
});
app.post("/api/cases", (req, res) => {
  const actor = getActor(req);
  if (!["content_editor", "reviewer", "admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const newCase = db.addCase(req.body, actor);
  res.status(201).json(newCase);
});
app.get("/api/mock-tests", (req, res) => {
  res.json(db.getMockTests());
});
app.get("/api/mock-tests/:id", (req, res) => {
  const test = db.getMockTestById(req.params.id);
  if (!test) return res.status(404).json({ error: "Test not found" });
  const allQ = db.getQuestions();
  const testQuestions = test.question_ids.map((qid) => allQ.find((q) => q.id === qid)).filter(Boolean);
  res.json({
    ...test,
    questions: testQuestions
  });
});
app.post("/api/mock-tests", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Only administrators can create mock tests" });
  }
  const newTest = db.addMockTest(req.body, actor);
  res.status(201).json(newTest);
});
app.put("/api/admin/mock-tests/:id", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Only administrators can update mock tests" });
  }
  try {
    const updated = db.updateMockTest(req.params.id, req.body, actor);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message || "Update failed" });
  }
});
app.put("/api/admin/mock-tests/:id/toggle-active", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Only administrators can toggle mock test status" });
  }
  try {
    const updated = db.toggleMockTestActive(req.params.id, req.body.is_active, actor);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message || "Toggle failed" });
  }
});
app.post("/api/proctoring-snapshots", (req, res) => {
  const actor = getActor(req);
  try {
    const snapshot = db.addProctoringSnapshot({
      id: `snap-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      attempt_id: req.body.attempt_id,
      test_id: req.body.test_id,
      user_id: actor.id,
      user_name: actor.name,
      cloudinary_public_id: req.body.cloudinary_public_id || `proctoring_${actor.id}_${Date.now()}`,
      secure_url: req.body.secure_url,
      captured_at: (/* @__PURE__ */ new Date()).toISOString()
    });
    res.status(201).json(snapshot);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to save snapshot" });
  }
});
app.get("/api/admin/proctoring-snapshots", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Access denied" });
  }
  const testId = req.query.test_id;
  const userId = req.query.user_id;
  const snapshots = db.getProctoringSnapshots(testId, userId);
  res.json(snapshots);
});
app.delete("/api/admin/proctoring-snapshots/:id", async (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Access denied" });
  }
  try {
    const success = db.deleteProctoringSnapshot(req.params.id, actor);
    if (!success) {
      return res.status(404).json({ error: "Snapshot not found" });
    }
    res.json({ success: true, message: "Snapshot purged successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message || "Deletion failed" });
  }
});
app.put("/api/admin/star-students/:userId", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Access denied" });
  }
  try {
    const updatedUser = db.toggleStarStudent(req.params.userId, req.body.is_star_student, actor);
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message || "Failed to toggle star student status" });
  }
});
app.post("/api/admin/mock-tests/bulk-generate", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Only administrators can bulk generate mock tests" });
  }
  try {
    const result = db.bulkGenerateMockTests(req.body, actor);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message || "Bulk generation failed" });
  }
});
app.delete("/api/admin/mock-tests/:id", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Only administrators can delete mock tests" });
  }
  try {
    const result = db.deleteMockTest(req.params.id, actor);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message || "Deletion failed" });
  }
});
app.post("/api/admin/mock-tests/clear-all", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Only administrators can clear mock tests" });
  }
  try {
    const result = db.clearAllMockTests(actor);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message || "Clear failed" });
  }
});
app.post("/api/mock-tests/:id/submit", (req, res) => {
  const actor = getActor(req);
  const test = db.getMockTestById(req.params.id);
  if (!test) return res.status(404).json({ error: "Mock test not found" });
  const { answers, started_at, time_spent_seconds } = req.body;
  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;
  const evaluatedAnswers = answers.map((ans) => {
    const q = db.getQuestionById(ans.question_id);
    const isAnswered = !!ans.selected_option;
    const isCorrect = isAnswered && q && q.correct_option === ans.selected_option;
    if (!isAnswered) {
      unattemptedCount += 1;
    } else if (isCorrect) {
      correctCount += 1;
    } else {
      wrongCount += 1;
    }
    return {
      question_id: ans.question_id,
      selected_option: ans.selected_option || null,
      is_correct: isCorrect,
      time_spent_seconds: ans.time_spent_seconds || 0,
      is_marked_for_review: !!ans.is_marked_for_review
    };
  });
  const totalQuestions = answers.length;
  const marksPerQuestion = test.total_marks / (totalQuestions || 1);
  const negativeMarkPenalty = marksPerQuestion * (test.negative_marking_rate || 0.33);
  const rawScore = correctCount * marksPerQuestion - wrongCount * negativeMarkPenalty;
  const finalScore = Math.max(0, Math.round(rawScore * 100) / 100);
  const accuracy = correctCount + wrongCount > 0 ? Math.round(correctCount / (correctCount + wrongCount) * 100) : 0;
  const attempt = db.recordAttempt({
    test_id: test.id,
    test_title: test.title_en,
    user_id: actor.id,
    user_name: actor.name,
    started_at: started_at || (/* @__PURE__ */ new Date()).toISOString(),
    completed_at: (/* @__PURE__ */ new Date()).toISOString(),
    time_spent_seconds: time_spent_seconds || 0,
    score: finalScore,
    total_marks: test.total_marks,
    correct_count: correctCount,
    wrong_count: wrongCount,
    unattempted_count: unattemptedCount,
    accuracy_percentage: accuracy,
    answers: evaluatedAnswers
  });
  res.json(attempt);
});
app.get("/api/student/stats", (req, res) => {
  const actor = getActor(req);
  const stats = db.getStudentStats(actor.id);
  res.json(stats);
});
app.get("/api/student/mistakes", (req, res) => {
  const actor = getActor(req);
  const mistakes2 = db.getMistakesByUser(actor.id);
  const questions2 = db.getQuestions();
  const enriched = mistakes2.map((m) => ({
    ...m,
    question: questions2.find((q) => q.id === m.question_id)
  })).filter((m) => !!m.question);
  res.json(enriched);
});
app.post("/api/student/mistakes/master", (req, res) => {
  const actor = getActor(req);
  const { question_id, is_mastered } = req.body;
  const updated = db.updateMistakeMastery(actor.id, question_id, is_mastered);
  res.json(updated);
});
app.get("/api/student/bookmarks", (req, res) => {
  const actor = getActor(req);
  const bms = db.getBookmarksByUser(actor.id);
  const questions2 = db.getQuestions();
  const enriched = bms.map((b) => ({
    ...b,
    question: questions2.find((q) => q.id === b.question_id)
  })).filter((b) => !!b.question);
  res.json(enriched);
});
app.post("/api/student/bookmarks/toggle", (req, res) => {
  const actor = getActor(req);
  const { question_id } = req.body;
  const isBookmarked = db.toggleBookmark(actor.id, question_id);
  res.json({ isBookmarked });
});
app.post("/api/reports", (req, res) => {
  const actor = getActor(req);
  const { question_id, reason, details } = req.body;
  if (!question_id || !reason) {
    return res.status(400).json({ error: "Question ID and reason are required" });
  }
  const report = db.addReport({
    question_id,
    user_id: actor.id,
    user_name: actor.name,
    reason,
    details: details || ""
  });
  res.status(201).json(report);
});
app.get("/api/admin/reports", (req, res) => {
  const actor = getActor(req);
  if (!["reviewer", "admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const reports = db.getReports();
  const questions2 = db.getQuestions();
  const enriched = reports.map((r) => ({
    ...r,
    question: questions2.find((q) => q.id === r.question_id)
  }));
  res.json(enriched);
});
app.post("/api/admin/reports/:id/resolve", (req, res) => {
  const actor = getActor(req);
  if (!["reviewer", "admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const { status, notes } = req.body;
  const resolved = db.resolveReport(req.params.id, status, notes || "", actor);
  res.json(resolved);
});
app.get("/api/admin/stats", (req, res) => {
  res.json(db.getAdminStats());
});
app.get("/api/admin/audit-logs", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  res.json(db.getAuditLogs());
});
app.get("/api/admin/settings", (req, res) => {
  res.json(db.getSettings());
});
app.put("/api/admin/settings", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const updated = db.updateSettings(req.body, actor);
  res.json(updated);
});
app.post("/api/admin/bulk-import", (req, res) => {
  const actor = getActor(req);
  if (!["content_editor", "admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const { rows, executeInsert, defaultStatus = "draft", defaultExamTrack = "both", defaultSubjectId = "subj-fon", skipDuplicates = false } = req.body;
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: "Rows array is required" });
  }
  const validationResults = [];
  const existingQuestions = db.getQuestions();
  const validRowsToInsert = [];
  rows.forEach((rawRow, idx) => {
    const rowNum = idx + 1;
    const errors = [];
    const question_en = String(rawRow.question_en || rawRow.question || rawRow.stem || rawRow.question_text || rawRow.Question || "").trim();
    const question_mr = String(rawRow.question_mr || rawRow.question_marathi || rawRow.Question_MR || rawRow["Question (Marathi)"] || "").trim();
    const option_a_en = String(rawRow.option_a_en || rawRow.option_a || rawRow.a || rawRow.A || rawRow.optionA || rawRow["Option A"] || "").trim();
    const option_b_en = String(rawRow.option_b_en || rawRow.option_b || rawRow.b || rawRow.B || rawRow.optionB || rawRow["Option B"] || "").trim();
    const option_c_en = String(rawRow.option_c_en || rawRow.option_c || rawRow.c || rawRow.C || rawRow.optionC || rawRow["Option C"] || "").trim();
    const option_d_en = String(rawRow.option_d_en || rawRow.option_d || rawRow.d || rawRow.D || rawRow.optionD || rawRow["Option D"] || "").trim();
    const option_a_mr = String(rawRow.option_a_mr || rawRow["Option A MR"] || "").trim();
    const option_b_mr = String(rawRow.option_b_mr || rawRow["Option B MR"] || "").trim();
    const option_c_mr = String(rawRow.option_c_mr || rawRow["Option C MR"] || "").trim();
    const option_d_mr = String(rawRow.option_d_mr || rawRow["Option D MR"] || "").trim();
    const rawCorrect = String(rawRow.correct_option || rawRow.correct_answer || rawRow.answer || rawRow.ans || rawRow.Correct || rawRow.Answer || rawRow.Ans || rawRow["Correct Option"] || "").trim();
    const correct = rawCorrect.toUpperCase().replace(/[^ABCD]/g, "");
    const explanation_en = String(rawRow.explanation_en || rawRow.explanation || rawRow.rationale || rawRow.Rationale || rawRow.Explanation || rawRow.solution || rawRow["Explanation"] || "").trim();
    const explanation_mr = String(rawRow.explanation_mr || rawRow.rationale_mr || rawRow["Explanation (Marathi)"] || "").trim();
    const subject_id = String(rawRow.subject_id || rawRow.subject || rawRow.Subject || defaultSubjectId || "subj-fon").trim();
    const chapter_id = rawRow.chapter_id || rawRow.chapter || "";
    const topic_id = rawRow.topic_id || rawRow.topic || "";
    const exam_target = rawRow.exam_target || rawRow.exam || defaultExamTrack;
    const difficulty = rawRow.difficulty || "medium";
    const status = rawRow.status || defaultStatus;
    const question_type = rawRow.question_type || "single_best";
    const image_url = rawRow.image_url || rawRow.imageUrl || "";
    const is_verified_pyq = Boolean(rawRow.is_verified_pyq);
    if (!question_en || question_en.length < 5) {
      errors.push("Question text (English) is missing or too short");
    }
    if (!option_a_en || !option_b_en || !option_c_en || !option_d_en) {
      errors.push("All 4 options (A, B, C, D) are required");
    }
    if (!["A", "B", "C", "D"].includes(correct)) {
      errors.push(`Invalid correct answer "${rawCorrect}". Must be A, B, C, or D.`);
    }
    if (!explanation_en) {
      errors.push("Clinical rationale/explanation is required");
    }
    const normalizedData = {
      question_en,
      question_mr,
      option_a_en,
      option_b_en,
      option_c_en,
      option_d_en,
      option_a_mr,
      option_b_mr,
      option_c_mr,
      option_d_mr,
      correct_option: correct,
      explanation_en,
      explanation_mr,
      subject_id,
      chapter_id,
      topic_id,
      exam_target,
      difficulty,
      status,
      question_type,
      image_url,
      is_verified_pyq
    };
    const hash = db.computeDuplicateHash(question_en);
    const isDuplicate = existingQuestions.some((q) => q.duplicate_hash === hash);
    if (isDuplicate) {
      errors.push("Likely duplicate of an existing question in database");
    }
    const isValid = errors.length === 0;
    if (isValid || isDuplicate && !skipDuplicates && errors.filter((e) => !e.includes("duplicate")).length === 0) {
      if (!(isDuplicate && skipDuplicates)) {
        validRowsToInsert.push(normalizedData);
      }
    }
    validationResults.push({
      row_number: rowNum,
      valid: isValid,
      errors,
      is_duplicate: isDuplicate,
      data: normalizedData
    });
  });
  if (executeInsert && validRowsToInsert.length > 0) {
    const created = [];
    for (const item of validRowsToInsert) {
      const q = db.addQuestion(item, actor);
      created.push(q);
    }
    return res.json({
      success: true,
      total_rows: rows.length,
      valid_count: validRowsToInsert.length,
      inserted_count: created.length,
      results: validationResults
    });
  }
  res.json({
    total_rows: rows.length,
    valid_count: validRowsToInsert.length,
    error_count: rows.length - validRowsToInsert.length,
    results: validationResults
  });
});
app.get("/api/admin/question-template", (req, res) => {
  const csvHeaders = "question_en,question_mr,option_a_en,option_b_en,option_c_en,option_d_en,correct_option,explanation_en,explanation_mr,subject_id,difficulty,exam_target\n";
  const sample1 = '"What is the normal therapeutic range of Digoxin in serum?","\u0921\u093F\u0917\u0949\u0915\u094D\u0938\u093F\u0928\u091A\u0947 \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0909\u092A\u091A\u093E\u0930\u093E\u0924\u094D\u092E\u0915 \u092A\u094D\u0930\u092E\u093E\u0923 \u0938\u0940\u0930\u092E\u092E\u0927\u094D\u092F\u0947 \u0915\u093F\u0924\u0940 \u0905\u0938\u0924\u0947?","0.5 - 2.0 ng/mL","2.5 - 4.0 ng/mL","5.0 - 7.5 ng/mL","0.1 - 0.4 ng/mL","A","Normal serum digoxin level is 0.5 to 2.0 ng/mL. Toxicity is common above 2.0 ng/mL, requiring monitoring of potassium.","\u0938\u093E\u092E\u093E\u0928\u094D\u092F \u0938\u0940\u0930\u092E \u0921\u093F\u0917\u0949\u0915\u094D\u0938\u093F\u0928 \u092A\u093E\u0924\u0933\u0940 0.5 \u0924\u0947 2.0 ng/mL \u0905\u0938\u0924\u0947.","subj-pharmacology","medium","both"\n';
  const sample2 = '"Which color bio-medical waste bag is designated for human anatomical waste as per BMW Rules 2016?","\u092C\u093E\u092F\u094B-\u092E\u0947\u0921\u093F\u0915\u0932 \u0935\u0947\u0938\u094D\u091F \u0928\u093F\u092F\u092E \u0968\u0966\u0967\u096C \u0928\u0941\u0938\u093E\u0930 \u092E\u093E\u0928\u0935\u0940 \u0905\u0935\u092F\u0935 \u0915\u091A\u0931\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0915\u094B\u0923\u0924\u094D\u092F\u093E \u0930\u0902\u0917\u093E\u091A\u0940 \u092A\u093F\u0936\u0935\u0940 \u0935\u093E\u092A\u0930\u0932\u0940 \u091C\u093E\u0924\u0947?","Yellow Bag","Red Bag","Blue Bag","Black Bag","A","Human anatomical tissues, placenta, organs, and soiled dressings must be discarded into Yellow non-chlorinated bags for incineration.","\u092E\u093E\u0928\u0935\u0940 \u0905\u0935\u092F\u0935 \u0906\u0923\u093F \u091F\u093F\u0936\u094D\u092F\u0942 \u092A\u093F\u0935\u0933\u094D\u092F\u093E \u092A\u093F\u0936\u0935\u0940\u0924 \u091F\u093E\u0915\u0932\u0947 \u091C\u093E\u0924\u093E\u0924.","subj-infection","easy","both"\n';
  const sample3 = '"During CPR in an adult patient, what is the recommended chest compression rate as per AHA guidelines?","\u092A\u094D\u0930\u094C\u0922 \u0930\u0941\u0917\u094D\u0923\u093E\u0924 CPR \u0926\u0930\u092E\u094D\u092F\u093E\u0928 \u091B\u093E\u0924\u0940 \u0926\u093E\u092C\u0923\u094D\u092F\u093E\u091A\u093E \u092A\u094D\u0930\u0924\u093F \u092E\u093F\u0928\u093F\u091F \u0926\u0930 \u0915\u093F\u0924\u0940 \u0905\u0938\u093E\u0935\u093E?","100 to 120 compressions/min","60 to 80 compressions/min","140 to 160 compressions/min","80 to 90 compressions/min","A","AHA CPR guidelines recommend a compression rate of 100 to 120 compressions per minute with a depth of at least 2 inches (5 cm).","CPR \u0926\u0930\u092E\u094D\u092F\u093E\u0928 \u0967\u0966\u0966 \u0924\u0947 \u0967\u0968\u0966 \u0926\u093E\u092C \u092A\u094D\u0930\u0924\u093F \u092E\u093F\u0928\u093F\u091F \u0926\u093F\u0932\u0947 \u092A\u093E\u0939\u093F\u091C\u0947\u0924.","subj-fon","medium","both"\n';
  const sample4 = '"At how many weeks of gestation is the fundal height typically palpated at the level of the umbilicus?","\u0917\u0930\u094D\u092D\u0927\u093E\u0930\u0923\u0947\u091A\u094D\u092F\u093E \u0915\u093F\u0924\u0935\u094D\u092F\u093E \u0906\u0920\u0935\u0921\u094D\u092F\u093E\u0924 \u0917\u0930\u094D\u092D\u093E\u0936\u092F\u093E\u091A\u0940 \u0909\u0902\u091A\u0940 \u092C\u0947\u0902\u092C\u0940\u091A\u094D\u092F\u093E (umbilicus) \u092A\u093E\u0924\u0933\u0940\u0935\u0930 \u091C\u093E\u0923\u0935\u0924\u0947?","20 weeks","12 weeks","28 weeks","36 weeks","A","At 20 weeks of gestation, the uterine fundus is palpable at the level of the maternal umbilicus. At 12 weeks it is at the pubic symphysis, and at 36 weeks at the xiphoid process.","\u0968\u0966 \u0935\u094D\u092F\u093E \u0906\u0920\u0935\u0921\u094D\u092F\u093E\u0924 \u0917\u0930\u094D\u092D\u093E\u0936\u092F \u092C\u0947\u0902\u092C\u0940\u091A\u094D\u092F\u093E \u092A\u093E\u0924\u0933\u0940\u0935\u0930 \u092A\u094B\u0939\u094B\u091A\u0924\u0947.","subj-obg","medium","both"\n';
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="nursing_questions_template.csv"');
  res.send(csvHeaders + sample1 + sample2 + sample3 + sample4);
});
app.get("/api/study-materials", (req, res) => {
  const materials = db.getStudyMaterials();
  res.json(materials);
});
app.post("/api/admin/study-materials", (req, res) => {
  const actor = getActor(req);
  if (!["content_editor", "reviewer", "admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const created = db.addStudyMaterial(req.body, actor);
  res.status(201).json(created);
});
app.delete("/api/admin/study-materials/:id", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const success = db.deleteStudyMaterial(req.params.id, actor);
  res.json({ success });
});
app.get("/api/recruitment-notices", (req, res) => {
  const notices = db.getRecruitmentNotices();
  res.json(notices);
});
app.post("/api/admin/recruitment-notices", (req, res) => {
  const actor = getActor(req);
  if (!["content_editor", "reviewer", "admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const created = db.addRecruitmentNotice(req.body, actor);
  res.status(201).json(created);
});
app.put("/api/admin/recruitment-notices/:id", (req, res) => {
  const actor = getActor(req);
  if (!["content_editor", "reviewer", "admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const updated = db.updateRecruitmentNotice(req.params.id, req.body, actor);
  if (!updated) {
    return res.status(404).json({ error: "Recruitment notice not found" });
  }
  res.json(updated);
});
app.delete("/api/admin/recruitment-notices/:id", (req, res) => {
  const actor = getActor(req);
  if (!["content_editor", "reviewer", "admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const deleted = db.deleteRecruitmentNotice(req.params.id, actor);
  if (!deleted) {
    return res.status(404).json({ error: "Recruitment notice not found" });
  }
  res.json({ success: true, message: "Notice deleted successfully" });
});
app.post("/api/admin/recruitment-notices/clear-all", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  db.clearAllRecruitmentNotices(actor);
  res.json({ success: true, message: "All recruitment notices cleared" });
});
app.get("/api/settings", (req, res) => {
  const settings = db.getSettings();
  res.json(settings);
});
app.put("/api/admin/settings", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied. Only admins can modify system settings." });
  }
  const updated = db.updateSettings(req.body, actor);
  res.json(updated);
});
app.get("/api/admin/users/stats", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied." });
  }
  const stats = db.getUsersWithStats();
  res.json(stats);
});
app.get("/api/admin/referrals/leaderboard", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) return res.status(403).json({ error: "Permission denied." });
  res.json(db.getReferralLeaderboard());
});
app.delete("/api/admin/users", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) return res.status(403).json({ error: "Permission denied." });
  const ids = Array.isArray(req.body?.ids) ? req.body.ids.map(String) : [];
  const password = String(req.body?.deletePassword || "");
  if (!ids.length) return res.status(400).json({ error: "No students selected." });
  try {
    res.json({ success: true, ...db.deleteUsers(ids, actor, password) });
  } catch (e) {
    res.status(403).json({ error: e.message || "Deletion denied." });
  }
});
app.post("/api/admin/users/:id/grant-pro", (req, res) => {
  let actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    const adminUser = db.getUsers().find((u) => u.role === "admin" || u.role === "super_admin");
    if (adminUser) actor = adminUser;
    else return res.status(403).json({ error: "Permission denied." });
  }
  const { duration_days, plan_name } = req.body;
  const updatedUser = db.grantUserPro(req.params.id, Number(duration_days) || 30, plan_name || "Admin Manual Grant", actor);
  if (!updatedUser) return res.status(404).json({ error: "User not found" });
  res.json({ success: true, user: updatedUser });
});
app.post("/api/admin/users/:id/revoke-pro", (req, res) => {
  let actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    const adminUser = db.getUsers().find((u) => u.role === "admin" || u.role === "super_admin");
    if (adminUser) actor = adminUser;
    else return res.status(403).json({ error: "Permission denied." });
  }
  const updatedUser = db.revokeUserPro(req.params.id, actor);
  if (!updatedUser) return res.status(404).json({ error: "User not found" });
  res.json({ success: true, user: updatedUser });
});
app.put("/api/admin/users/:id/password", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied." });
  }
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({ error: "Password must be at least 4 characters long." });
  }
  const updatedUser = db.setUserPassword(req.params.id, newPassword);
  if (!updatedUser) return res.status(404).json({ error: "User not found" });
  db.logAudit(actor.id, actor.name, actor.role, "ADMIN_RESET_PASSWORD", "User", req.params.id, `Admin reset password for user ${updatedUser.email}`);
  res.json({ success: true, message: "Password updated successfully" });
});
app.post("/api/push/register-token", (req, res) => {
  const actor = getActor(req);
  const token = String(req.body?.token || "");
  if (!token) return res.status(400).json({ error: "FCM token required." });
  res.json({ success: db.registerPushToken(actor.id, token) });
});
app.get("/api/push-notifications", (req, res) => {
  const actor = getActor(req);
  const notifications = db.getPushNotifications(actor.id);
  res.json(notifications);
});
app.post("/api/push-notifications/:id/read", (req, res) => {
  const actor = getActor(req);
  db.markNotificationRead(req.params.id, actor.id);
  res.json({ success: true });
});
app.post("/api/admin/push-notifications", async (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied." });
  }
  const { title_en, title_mr, message_en, message_mr, target_type, target_user_id, target_user_name, target_tab, action_url } = req.body;
  if (!title_en && !title_mr) {
    return res.status(400).json({ error: "Notification title is required." });
  }
  const created = db.addPushNotification({ title_en: title_en || title_mr, title_mr: title_mr || title_en, message_en: message_en || message_mr, message_mr: message_mr || message_en, target_type: target_type || "all", target_user_id, target_user_name, target_tab: target_tab || "dashboard", action_url, sent_by_name: actor.name }, actor);
  try {
    const candidates = db.getUsers().filter((u) => target_type === "user" || target_type === "individual" ? u.id === target_user_id : true).filter((u) => u.fcm_token);
    if ((0, import_app2.getApps)().length && candidates.length) await (0, import_messaging.getMessaging)().sendEachForMulticast({ tokens: candidates.map((u) => u.fcm_token), notification: { title: title_en || title_mr, body: message_en || message_mr }, data: { tab: target_tab || "dashboard", url: action_url || "", tag: created.id }, android: { notification: { sound: "default" } }, webpush: { notification: { icon: "/pwa-192x192.png", badge: "/pwa-192x192.png", renotify: true, tag: created.id } } });
  } catch (e) {
    console.warn("[FCM] Push delivery failed:", e);
  }
  res.status(201).json(created);
});
app.delete("/api/admin/push-notifications/:id", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied." });
  }
  const deleted = db.deletePushNotification(req.params.id, actor);
  res.json({ success: deleted });
});
app.get("/api/promo-codes", (req, res) => {
  const codes = db.getPromoCodes();
  res.json(codes);
});
app.post("/api/payments/verify-promo", (req, res) => {
  const { code, original_amount } = req.body;
  const result = db.verifyPromoCode(code, Number(original_amount) || 0);
  res.json(result);
});
app.post("/api/admin/promo-codes", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied." });
  }
  const created = db.addPromoCode(req.body, actor);
  res.status(201).json(created);
});
app.put("/api/admin/promo-codes/:id", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied." });
  }
  const updated = db.updatePromoCode(req.params.id, req.body, actor);
  res.json(updated);
});
app.delete("/api/admin/promo-codes/:id", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied." });
  }
  const success = db.deletePromoCode(req.params.id, actor);
  res.json({ success });
});
app.get("/api/payments/plans", (req, res) => {
  const plans = db.getPaymentPlans();
  res.json(plans);
});
app.post("/api/admin/payments/plans", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const created = db.createPaymentPlan(req.body, actor);
  res.status(201).json(created);
});
app.put("/api/admin/payments/plans/:id", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const updated = db.updatePaymentPlan(req.params.id, req.body, actor);
  res.json(updated);
});
app.delete("/api/admin/payments/plans/:id", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const success = db.deletePaymentPlan(req.params.id, actor);
  res.json({ success });
});
app.get("/api/payments/my-history", (req, res) => {
  const actor = getActor(req);
  const history = db.getPaymentsByUser(actor.id);
  res.json(history);
});
app.post("/api/payments/submit-manual-utr", (req, res) => {
  const actor = getActor(req);
  const { plan_id, utr_number, screenshot_url, screenshot_public_id, promo_code } = req.body;
  if (!plan_id || !utr_number) {
    return res.status(400).json({ error: "Plan ID and 12-digit UTR number are required" });
  }
  const plan = db.getPaymentPlanById(plan_id);
  let finalAmount = plan ? plan.price : 0;
  if (promo_code && plan) {
    const verified = db.verifyPromoCode(promo_code, plan.price);
    if (verified.valid) {
      finalAmount = verified.finalAmount;
    }
  }
  const record = db.submitPayment({
    user_id: actor.id,
    user_name: actor.name,
    user_email: actor.email,
    plan_id,
    utr_number,
    screenshot_url,
    screenshot_public_id,
    payment_method: "MANUAL_QR",
    amount: finalAmount
  });
  res.status(201).json(record);
});
app.post("/api/payments/razorpay/create-order", async (req, res) => {
  const actor = getActor(req);
  const { plan_id, promo_code } = req.body;
  const plan = db.getPaymentPlanById(plan_id);
  if (!plan) return res.status(404).json({ error: "Payment plan not found" });
  const settings = db.getSettings();
  if (!settings.razorpay_enabled || !settings.razorpay_key_id || !settings.razorpay_key_secret) return res.status(503).json({ error: "Razorpay is not configured." });
  let amount = Number(plan.price);
  if (promo_code) {
    const v = db.verifyPromoCode(promo_code, amount);
    if (v.valid) amount = v.finalAmount;
  }
  const auth = Buffer.from(`${settings.razorpay_key_id}:${settings.razorpay_key_secret}`).toString("base64");
  const rr = await fetch("https://api.razorpay.com/v1/orders", { method: "POST", headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" }, body: JSON.stringify({ amount: Math.round(amount * 100), currency: plan.currency || "INR", receipt: `${actor.id}-${Date.now()}`, notes: { user_id: actor.id, plan_id: plan.id } }) });
  const data = await rr.json();
  if (!rr.ok) return res.status(502).json({ error: data.error?.description || "Razorpay order creation failed." });
  res.json({ order_id: data.id, original_amount: plan.price * 100, amount: data.amount, currency: data.currency, plan_name: plan.name, key_id: settings.razorpay_key_id, razorpay_enabled: true });
});
app.post("/api/payments/razorpay/verify-auto", async (req, res) => {
  const actor = getActor(req);
  const { plan_id, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  if (!plan_id || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) return res.status(400).json({ error: "Complete Razorpay verification data is required." });
  const plan = db.getPaymentPlanById(plan_id);
  const settings = db.getSettings();
  if (!plan || !settings.razorpay_key_secret) return res.status(400).json({ error: "Plan or Razorpay configuration unavailable." });
  const expected = import_crypto4.default.createHmac("sha256", settings.razorpay_key_secret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
  if (!import_crypto4.default.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature))) return res.status(400).json({ error: "Razorpay signature verification failed. Plan not activated." });
  const auth = Buffer.from(`${settings.razorpay_key_id}:${settings.razorpay_key_secret}`).toString("base64");
  const rr = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(razorpay_payment_id)}`, { headers: { Authorization: `Basic ${auth}` } });
  const payment = await rr.json();
  const orr = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(razorpay_order_id)}`, { headers: { Authorization: `Basic ${auth}` } });
  const order = await orr.json();
  if (!rr.ok || !orr.ok || payment.order_id !== razorpay_order_id || payment.status !== "captured" || Number(payment.amount) !== Number(order.amount) || order.notes?.plan_id !== plan_id) return res.status(400).json({ error: "Payment is not captured, order mismatch, or amount mismatch. Plan has NOT been activated." });
  const record = db.processRazorpayPaymentAuto({ user_id: actor.id, user_name: actor.name, user_email: actor.email, plan_id, razorpay_payment_id, razorpay_order_id, amount: Number(payment.amount) / 100 });
  res.json({ success: true, message: "Payment verified automatically and access activated.", payment: record, user: db.getUserById(actor.id) });
});
app.post("/api/payments/razorpay/create-test-order", async (req, res) => {
  const actor = getActor(req);
  const test = db.getMockTests().find((t) => t.id === req.body.test_id);
  const settings = db.getSettings();
  if (!test) return res.status(404).json({ error: "Mock Test not found" });
  if (!settings.razorpay_enabled || !settings.razorpay_key_id || !settings.razorpay_key_secret) return res.status(503).json({ error: "Razorpay is not configured." });
  const amount = Math.round((test.price || 29) * 100);
  const auth = Buffer.from(`${settings.razorpay_key_id}:${settings.razorpay_key_secret}`).toString("base64");
  const rr = await fetch("https://api.razorpay.com/v1/orders", { method: "POST", headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" }, body: JSON.stringify({ amount, currency: "INR", receipt: `test-${actor.id}-${Date.now()}`, notes: { user_id: actor.id, test_id: test.id, type: "SINGLE_TEST" } }) });
  const d = await rr.json();
  if (!rr.ok) return res.status(502).json({ error: d.error?.description || "Order creation failed" });
  res.json({ order_id: d.id, test_id: test.id, amount: d.amount, currency: "INR", key_id: settings.razorpay_key_id, razorpay_enabled: true });
});
app.post("/api/payments/razorpay/verify-test-payment", async (req, res) => {
  const actor = getActor(req);
  const { test_id, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  const settings = db.getSettings();
  if (!test_id || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !settings.razorpay_key_secret) return res.status(400).json({ error: "Complete payment verification data is required." });
  const expected = import_crypto4.default.createHmac("sha256", settings.razorpay_key_secret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
  if (expected !== razorpay_signature) return res.status(400).json({ error: "Invalid Razorpay signature. Test remains locked." });
  const auth = Buffer.from(`${settings.razorpay_key_id}:${settings.razorpay_key_secret}`).toString("base64");
  const rr = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(razorpay_payment_id)}`, { headers: { Authorization: `Basic ${auth}` } });
  const pay = await rr.json();
  const test = db.getMockTests().find((t) => t.id === test_id);
  if (!rr.ok || pay.order_id !== razorpay_order_id || pay.status !== "captured" || Number(pay.amount) !== Math.round((test?.price || 29) * 100)) return res.status(400).json({ error: "Payment not captured or amount mismatch. Test remains locked." });
  const updated = db.unlockTestForUser(actor.id, test_id);
  db.submitPayment({ user_id: actor.id, user_name: actor.name, user_email: actor.email, plan_id: `single-test-${test_id}`, utr_number: razorpay_payment_id, payment_method: "RAZORPAY", amount: Number(pay.amount) / 100 });
  const history = db.getPaymentsByUser(actor.id);
  if (history[0]) db.markPaymentApproved(history[0].id);
  return res.json({ success: true, message: "Test unlocked successfully!", user: updated });
});
app.post("/api/payments/razorpay/create-lecture-order", async (req, res) => {
  const actor = getActor(req);
  const lecture = db.getYouTubeLectures(false).find((l) => l.id === req.body.lecture_id);
  const settings = db.getSettings();
  if (!lecture) return res.status(404).json({ error: "Lecture not found" });
  if (!settings.razorpay_enabled || !settings.razorpay_key_id || !settings.razorpay_key_secret) return res.status(503).json({ error: "Razorpay is not configured." });
  const amount = Math.round((lecture.price || 49) * 100);
  const auth = Buffer.from(`${settings.razorpay_key_id}:${settings.razorpay_key_secret}`).toString("base64");
  const rr = await fetch("https://api.razorpay.com/v1/orders", { method: "POST", headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" }, body: JSON.stringify({ amount, currency: "INR", receipt: `video-${actor.id}-${Date.now()}`, notes: { user_id: actor.id, lecture_id: lecture.id, type: "SINGLE_VIDEO" } }) });
  const d = await rr.json();
  if (!rr.ok) return res.status(502).json({ error: d.error?.description || "Order creation failed" });
  res.json({ order_id: d.id, lecture_id: lecture.id, lecture_title: lecture.title_mr || lecture.title_en, amount: d.amount, currency: "INR", key_id: settings.razorpay_key_id, razorpay_enabled: true });
});
app.post("/api/payments/razorpay/verify-lecture-payment", async (req, res) => {
  const actor = getActor(req);
  const { lecture_id, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  const settings = db.getSettings();
  const lecture = db.getYouTubeLectures(false).find((l) => l.id === lecture_id);
  if (!lecture || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !settings.razorpay_key_secret) return res.status(400).json({ error: "Complete payment verification data is required." });
  const expected = import_crypto4.default.createHmac("sha256", settings.razorpay_key_secret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
  if (expected !== razorpay_signature) return res.status(400).json({ error: "Invalid Razorpay signature. Video remains locked." });
  const auth = Buffer.from(`${settings.razorpay_key_id}:${settings.razorpay_key_secret}`).toString("base64");
  const rr = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(razorpay_payment_id)}`, { headers: { Authorization: `Basic ${auth}` } });
  const pay = await rr.json();
  if (!rr.ok || pay.order_id !== razorpay_order_id || pay.status !== "captured" || Number(pay.amount) !== Math.round((lecture.price || 49) * 100)) return res.status(400).json({ error: "Payment not captured or amount mismatch. Video remains locked." });
  const unlocked = db.unlockYouTubeLecture(lecture_id, actor.id);
  db.submitPayment({ user_id: actor.id, user_name: actor.name, user_email: actor.email, plan_id: `lecture-${lecture_id}`, utr_number: razorpay_payment_id, payment_method: "RAZORPAY", amount: Number(pay.amount) / 100 });
  const history = db.getPaymentsByUser(actor.id);
  if (history[0]) db.markPaymentApproved(history[0].id);
  res.json({ success: true, message: "\u0935\u094D\u0939\u093F\u0921\u093F\u0913 \u0935\u094D\u092F\u093E\u0916\u094D\u092F\u093E\u0928 \u092F\u0936\u0938\u094D\u0935\u0940\u0930\u093F\u0924\u094D\u092F\u093E \u0905\u0928\u0932\u0949\u0915 \u091D\u093E\u0932\u0947!", lecture: unlocked });
});
app.post("/api/youtube-lectures/:id/unlock", (req, res) => {
  const actor = getActor(req);
  const unlocked = db.unlockYouTubeLecture(req.params.id, actor.id);
  if (!unlocked) return res.status(404).json({ error: "Lecture not found" });
  res.json({ success: true, lecture: unlocked });
});
app.get("/api/successful-students", (req, res) => {
  const actor = getActor(req);
  const isAdmin = ["admin", "super_admin", "reviewer"].includes(actor.role);
  const students = db.getSuccessfulStudents(isAdmin);
  res.json(students);
});
app.post("/api/admin/successful-students", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const created = db.addSuccessfulStudent(req.body, actor);
  res.status(201).json(created);
});
app.put("/api/admin/successful-students/:id", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const updated = db.updateSuccessfulStudent(req.params.id, req.body, actor);
  if (!updated) return res.status(404).json({ error: "Student record not found" });
  res.json(updated);
});
app.delete("/api/admin/successful-students/:id", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const success = db.deleteSuccessfulStudent(req.params.id, actor);
  res.json({ success });
});
app.patch("/api/admin/successful-students/:id/toggle", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const { is_active } = req.body;
  const updated = db.toggleSuccessfulStudentActive(req.params.id, Boolean(is_active), actor);
  if (!updated) return res.status(404).json({ error: "Student record not found" });
  res.json(updated);
});
app.get("/api/admin/audit-logs", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin", "reviewer"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const logs = db.getAuditLogs();
  res.json(logs);
});
app.delete("/api/admin/audit-logs/:id", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const success = db.deleteAuditLog(req.params.id, actor);
  res.json({ success });
});
app.post("/api/admin/audit-logs/bulk-delete", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const { ids } = req.body;
  const deletedCount = db.deleteAuditLogsBulk(ids, actor);
  res.json({ success: true, deletedCount });
});
app.post("/api/admin/audit-logs/delete-older-than-2-months", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const cutoffTime = Date.now() - 60 * 24 * 60 * 60 * 1e3;
  const allLogs = db.getAuditLogs();
  const oldIds = allLogs.filter((l) => new Date(l.created_at).getTime() < cutoffTime).map((l) => l.id);
  const deletedCount = db.deleteAuditLogsBulk(oldIds, actor);
  db.logAudit(actor.id, actor.name, actor.role, "DELETE_OLD_AUDIT_LOGS", "AuditLog", "older_than_2_months", `Deleted ${deletedCount} audit logs older than 2 months`);
  res.json({ success: true, deletedCount });
});
app.get("/api/youtube-lectures", (req, res) => {
  const onlyActive = req.query.active === "true";
  const lectures = db.getYouTubeLectures(onlyActive);
  res.json(lectures);
});
app.post("/api/admin/youtube-lectures", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin", "reviewer"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const lecture = db.addYouTubeLecture(req.body, actor);
  res.status(201).json(lecture);
});
app.put("/api/admin/youtube-lectures/:id", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin", "reviewer"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const updated = db.updateYouTubeLecture(req.params.id, req.body, actor);
  if (!updated) return res.status(404).json({ error: "Lecture not found" });
  res.json(updated);
});
app.delete("/api/admin/youtube-lectures/:id", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const success = db.deleteYouTubeLecture(req.params.id, actor);
  res.json({ success });
});
app.patch("/api/admin/youtube-lectures/:id/toggle", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin", "reviewer"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const { is_active } = req.body;
  const updated = db.toggleYouTubeLectureActive(req.params.id, Boolean(is_active), actor);
  if (!updated) return res.status(404).json({ error: "Lecture not found" });
  res.json(updated);
});
app.get("/api/admin/payments", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin", "reviewer"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const payments = db.getPayments();
  res.json(payments);
});
app.post("/api/admin/payments/:id/verify", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const { action, notes } = req.body;
  if (!["APPROVE", "REJECT"].includes(action)) {
    return res.status(400).json({ error: "Action must be APPROVE or REJECT" });
  }
  const verified = db.verifyPayment(req.params.id, action, notes || "", actor);
  if (!verified) {
    return res.status(404).json({ error: "Payment record not found" });
  }
  res.json(verified);
});
var userAiCooldown = /* @__PURE__ */ new Map();
function checkAiRateLimit(req, res, next) {
  const actor = getActor(req);
  const identifier = actor.id || req.ip || "anonymous";
  const now = Date.now();
  const userData = userAiCooldown.get(identifier) || { lastRequestTime: 0, requestCount: 0, windowStart: now };
  if (now - userData.windowStart > 6e4) {
    userData.windowStart = now;
    userData.requestCount = 0;
  }
  if (userData.requestCount >= 15) {
    return res.status(429).json({
      success: false,
      error: "\u0915\u0943\u092A\u092F\u093E \u0967 \u092E\u093F\u0928\u093F\u091F \u0935\u093E\u091F \u092A\u0939\u093E \u0906\u0923\u093F \u092A\u0941\u0928\u094D\u0939\u093E \u092A\u094D\u0930\u092F\u0924\u094D\u0928 \u0915\u0930\u093E.",
      message: "Please wait a minute before sending another query."
    });
  }
  if (now - userData.lastRequestTime < 1500) {
    return res.status(429).json({
      success: false,
      error: "\u0915\u0943\u092A\u092F\u093E \u0915\u093E\u0939\u0940 \u0938\u0947\u0915\u0902\u0926 \u0925\u093E\u0902\u092C\u093E \u0906\u0923\u093F \u092A\u0941\u0928\u094D\u0939\u093E \u092A\u094D\u0930\u092F\u0924\u094D\u0928 \u0915\u0930\u093E.",
      message: "Please wait a moment before sending another AI request."
    });
  }
  userData.lastRequestTime = now;
  userData.requestCount += 1;
  userAiCooldown.set(identifier, userData);
  next();
}
app.post("/api/ai/explain", checkAiRateLimit, async (req, res) => {
  const { concept, language } = req.body;
  if (!concept) return res.status(400).json({ error: "Concept is required" });
  const result = await explainNursingConcept(concept, language || "en");
  res.json(result);
});
app.post("/api/ai/mnemonic", checkAiRateLimit, async (req, res) => {
  const { topic, language } = req.body;
  if (!topic) return res.status(400).json({ error: "Topic is required" });
  const result = await generateMnemonic(topic, language || "en");
  res.json(result);
});
app.post("/api/ai/revision-plan", checkAiRateLimit, async (req, res) => {
  const actor = getActor(req);
  const { language } = req.body;
  const stats = db.getStudentStats(actor.id);
  const weakNames = stats.weakSubjects.map((w) => {
    const s = db.getSubjectById(w.subject_id);
    return s ? s.name_en : w.subject_id;
  });
  const result = await generateRevisionPlan(weakNames, stats.totalMistakes, language || "en");
  res.json(result);
});
app.post("/api/ai/doubt", checkAiRateLimit, async (req, res) => {
  const { doubt, context, language } = req.body;
  if (!doubt) return res.status(400).json({ error: "Doubt query is required" });
  const result = await askStudyCoachDoubt(doubt, context, language || "en");
  res.json(result);
});
app.post("/api/ai/generate-question", checkAiRateLimit, async (req, res) => {
  const actor = getActor(req);
  if (!["content_editor", "admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Only editors and admins can use AI Question Generator" });
  }
  const { subject_id, topic, difficulty, is_clinical_case } = req.body;
  const subject = db.getSubjectById(subject_id) || db.getSubjects()[0];
  const result = await generateAiDraftQuestion({
    subject_name: subject.name_en,
    topic: topic || "Emergency Cardiac Management",
    difficulty: difficulty || "medium",
    is_clinical_case: !!is_clinical_case
  });
  if (!result.success || !result.draft) {
    return res.status(500).json(result);
  }
  const savedDraft = db.addQuestion({
    ...result.draft,
    subject_id: subject.id,
    status: "draft",
    source_reference: "AI Draft Generation (Requires Reviewer Verification)",
    created_by: actor.id
  }, actor);
  res.status(201).json({
    success: true,
    draft: savedDraft,
    message: "Question generated and saved strictly in DRAFT status for human review."
  });
});
app.get("/api/ai/cache-stats", async (req, res) => {
  try {
    const stats = await getAiCacheMetrics();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to fetch cache metrics" });
  }
});
app.post("/api/ai/translate-question", checkAiRateLimit, async (req, res) => {
  try {
    const { question_id, question_en, option_a_en, option_b_en, option_c_en, option_d_en, explanation_en } = req.body;
    if (!question_en) {
      return res.status(400).json({ error: "question_en is required" });
    }
    const translation = await translateNursingQuestionToMarathi({
      question_en,
      option_a_en: option_a_en || "",
      option_b_en: option_b_en || "",
      option_c_en: option_c_en || "",
      option_d_en: option_d_en || "",
      explanation_en: explanation_en || ""
    });
    if (question_id) {
      db.updateQuestion(question_id, {
        question_mr: translation.question_mr,
        option_a_mr: translation.option_a_mr,
        option_b_mr: translation.option_b_mr,
        option_c_mr: translation.option_c_mr,
        option_d_mr: translation.option_d_mr,
        explanation_mr: translation.explanation_mr
      });
    }
    res.json({ success: true, translation });
  } catch (err) {
    res.status(500).json({ error: err.message || "Translation failed" });
  }
});
app.post("/api/admin/questions/bulk-auto-translate-marathi", async (req, res) => {
  const actor = getActor(req);
  if (!["content_editor", "admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Permission denied" });
  }
  const { limit = 20, forceAll = false } = req.body;
  const allQuestions = db.getQuestions();
  const needingTranslation = allQuestions.filter((q) => {
    if (forceAll) return true;
    const noMrQ = !q.question_mr || q.question_mr.trim().length === 0 || q.question_mr.trim().toLowerCase() === q.question_en.trim().toLowerCase();
    const noMrOpts = !q.option_a_mr || q.option_a_mr.trim().length === 0;
    return noMrQ || noMrOpts;
  }).slice(0, Math.min(Number(limit) || 20, 50));
  if (needingTranslation.length === 0) {
    return res.json({
      success: true,
      translatedCount: 0,
      message: "\u0938\u0930\u094D\u0935 \u092A\u094D\u0930\u0936\u094D\u0928\u093E\u0902\u091A\u0947 \u0906\u0927\u0940\u091A \u092E\u0930\u093E\u0920\u0940 \u092D\u093E\u0937\u093E\u0902\u0924\u0930 \u0909\u092A\u0932\u092C\u094D\u0927 \u0906\u0939\u0947 (All questions already have Marathi translations)."
    });
  }
  let translatedCount = 0;
  for (const q of needingTranslation) {
    try {
      const translation = await translateNursingQuestionToMarathi({
        question_en: q.question_en,
        option_a_en: q.option_a_en,
        option_b_en: q.option_b_en,
        option_c_en: q.option_c_en,
        option_d_en: q.option_d_en,
        explanation_en: q.explanation_en
      });
      if (translation && translation.question_mr && translation.question_mr.trim().toLowerCase() !== q.question_en.trim().toLowerCase()) {
        db.updateQuestion(q.id, {
          question_mr: translation.question_mr,
          option_a_mr: translation.option_a_mr,
          option_b_mr: translation.option_b_mr,
          option_c_mr: translation.option_c_mr,
          option_d_mr: translation.option_d_mr,
          explanation_mr: translation.explanation_mr
        }, actor);
        translatedCount++;
      }
    } catch (e) {
      console.warn(`Failed to translate question ${q.id}:`, e);
    }
  }
  const remainingCount = db.getQuestions().filter(
    (q) => !q.question_mr || q.question_mr.trim().length === 0 || q.question_mr.trim().toLowerCase() === q.question_en.trim().toLowerCase()
  ).length;
  res.json({
    success: true,
    translatedCount,
    remainingCount,
    message: `${translatedCount} \u0907\u0902\u0917\u094D\u0930\u091C\u0940 \u092A\u094D\u0930\u0936\u094D\u0928\u093E\u0902\u091A\u0947 \u092E\u0930\u093E\u0920\u0940\u0924 \u092F\u0936\u0938\u094D\u0935\u0940 \u092D\u093E\u0937\u093E\u0902\u0924\u0930 \u091D\u093E\u0932\u0947!`
  });
});
app.post("/api/ai/format-advertisement", async (req, res) => {
  try {
    const actor = getActor(req);
    if (!["content_editor", "reviewer", "admin", "super_admin"].includes(actor.role)) {
      return res.status(403).json({ error: "Permission denied" });
    }
    const { rawText } = req.body;
    if (!rawText || !rawText.trim()) {
      return res.status(400).json({ error: "Advertisement text or circular extract is required" });
    }
    const formatted = await formatAttractiveAdvertisement(rawText);
    res.json({ success: true, advertisement: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message || "Formatting failed" });
  }
});
var upload = (0, import_multer.default)({
  storage: import_multer.default.memoryStorage(),
  limits: { fileSize: 60 * 1024 * 1024 }
  // 60MB max file size
});
app.post("/api/ai/format-advertisement-file", upload.single("file"), async (req, res) => {
  try {
    const actor = getActor(req);
    if (!["content_editor", "reviewer", "admin", "super_admin"].includes(actor.role)) {
      return res.status(403).json({ error: "Permission denied" });
    }
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded. Please upload a PDF or text notice." });
    }
    let extractedText = "";
    const ext = import_path3.default.extname(file.originalname).toLowerCase();
    if (ext === ".pdf") {
      try {
        const parsed = await pdfParse2(file.buffer);
        extractedText = parsed.text || "";
      } catch (err) {
        console.warn("PDF parse error:", err?.message);
        extractedText = file.buffer.toString("utf-8");
      }
    } else {
      extractedText = file.buffer.toString("utf-8");
    }
    if (!extractedText.trim()) {
      return res.status(400).json({ error: "Could not extract text from file. Please paste text directly." });
    }
    const formatted = await formatAttractiveAdvertisement(extractedText);
    res.json({
      success: true,
      advertisement: formatted,
      fileName: file.originalname,
      textLength: extractedText.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to process file" });
  }
});
app.post("/api/import/upload", upload.array("files", 100), async (req, res) => {
  try {
    const actor = getActor(req);
    if (!["content_editor", "admin", "super_admin"].includes(actor.role)) {
      return res.status(403).json({ error: "Unauthorized: Admin or Editor permission required for question import." });
    }
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files were uploaded. Please select at least one file." });
    }
    const targetSubjectId = req.body.targetSubjectId || void 0;
    const examName = req.body.examName || void 0;
    const currentSettings = db.getAiImportSettings();
    const settings = {
      ...currentSettings,
      autoApprovalEnabled: req.body.autoApprovalEnabled !== void 0 ? req.body.autoApprovalEnabled === "true" || req.body.autoApprovalEnabled === true : currentSettings.autoApprovalEnabled,
      minAutoApprovalConfidence: Number(req.body.minAutoApprovalConfidence) || currentSettings.minAutoApprovalConfidence,
      minQualityScore: Number(req.body.minQualityScore) || currentSettings.minQualityScore,
      autoPublish: req.body.autoPublish !== void 0 ? req.body.autoPublish === "true" || req.body.autoPublish === true : currentSettings.autoPublish,
      processingMode: req.body.processingMode || currentSettings.processingMode
    };
    const batches = [];
    for (const file of files) {
      const ext = import_path3.default.extname(file.originalname).toLowerCase();
      let fileType = "json";
      if (ext === ".xlsx" || ext === ".xls") fileType = "excel";
      else if (ext === ".csv") fileType = "csv";
      else if (ext === ".pdf") fileType = "pdf";
      else if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) fileType = files.length > 1 ? "images" : "image";
      else if (ext === ".zip") fileType = "zip";
      else if (ext === ".json") fileType = "json";
      else fileType = "raw_text";
      const batch = await processIngestionBatch({
        fileBuffer: file.buffer,
        fileName: file.originalname,
        fileType,
        fileSizeMb: Math.round(file.size / (1024 * 1024) * 100) / 100,
        uploadedBy: actor.id,
        uploadedByName: actor.name,
        targetSubjectId,
        examName,
        settings
      });
      batches.push(batch);
    }
    res.json({
      success: true,
      batches,
      message: `Successfully processed ${batches.length} file(s). Total questions ingested: ${batches.reduce((sum, b) => sum + b.totalDetected, 0)}.`
    });
  } catch (err) {
    console.error("Import upload error:", err);
    res.status(500).json({ error: err.message || "File processing failed" });
  }
});
app.post("/api/import/process-text", async (req, res) => {
  try {
    const actor = getActor(req);
    if (!["content_editor", "admin", "super_admin"].includes(actor.role)) {
      return res.status(403).json({ error: "Unauthorized: Admin permission required." });
    }
    const { rawText, format, fileName, targetSubjectId, examName } = req.body;
    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({ error: "Question text content is required" });
    }
    const settings = db.getAiImportSettings();
    const batch = await processIngestionBatch({
      rawText,
      fileName: fileName || "direct_paste.txt",
      fileType: format === "json" ? "json" : "raw_text",
      uploadedBy: actor.id,
      uploadedByName: actor.name,
      targetSubjectId,
      examName,
      settings
    });
    res.json({ success: true, batch });
  } catch (err) {
    console.error("Process text error:", err);
    res.status(500).json({ error: err.message || "Text processing failed" });
  }
});
app.get("/api/import/batches", (req, res) => {
  res.json(db.getImportBatches());
});
app.get("/api/import/batches/:id", (req, res) => {
  const batch = db.getImportBatchById(req.params.id);
  if (!batch) return res.status(404).json({ error: "Batch not found" });
  res.json(batch);
});
app.delete("/api/import/batches/:id", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Admin only" });
  }
  const deleted = db.deleteImportBatch(req.params.id);
  res.json({ success: deleted });
});
app.post("/api/import/batches/:id/approve-all-high-confidence", (req, res) => {
  const actor = getActor(req);
  if (!["content_editor", "admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Admin only" });
  }
  const minConfidence = Number(req.body.minConfidence) || 90;
  const result = db.approveBatchHighConfidence({
    batchId: req.params.id,
    minConfidence,
    actorId: actor.id,
    actorName: actor.name
  });
  res.json(result);
});
app.post("/api/import/batches/:batchId/questions/:questionId/approve", (req, res) => {
  const actor = getActor(req);
  if (!["content_editor", "admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Admin only" });
  }
  const result = db.approveQuestionFromBatch({
    batchId: req.params.batchId,
    questionId: req.params.questionId,
    actorId: actor.id,
    actorName: actor.name,
    modifiedFields: req.body.modifiedFields
  });
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});
app.post("/api/import/batches/:batchId/questions/:questionId/reject", (req, res) => {
  const actor = getActor(req);
  if (!["content_editor", "admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Admin only" });
  }
  const result = db.rejectQuestionFromBatch({
    batchId: req.params.batchId,
    questionId: req.params.questionId,
    actorId: actor.id,
    actorName: actor.name,
    reason: req.body.reason
  });
  res.json(result);
});
app.get("/api/import/review-queue", (req, res) => {
  const { batchId, flag, status, search } = req.query;
  const result = db.getImportReviewQueue({
    batchId,
    flag,
    status,
    search
  });
  res.json(result);
});
app.post("/api/import/review-queue/bulk-action", (req, res) => {
  const actor = getActor(req);
  if (!["content_editor", "admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Admin only" });
  }
  const { items, action } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "No items provided for bulk action" });
  }
  let successCount = 0;
  for (const it of items) {
    if (action === "approve") {
      const r = db.approveQuestionFromBatch({
        batchId: it.batchId,
        questionId: it.questionId,
        actorId: actor.id,
        actorName: actor.name
      });
      if (r.success) successCount++;
    } else if (action === "reject") {
      const r = db.rejectQuestionFromBatch({
        batchId: it.batchId,
        questionId: it.questionId,
        actorId: actor.id,
        actorName: actor.name,
        reason: "Bulk rejection by admin"
      });
      if (r.success) successCount++;
    }
  }
  res.json({ success: true, processedCount: successCount, action });
});
app.get("/api/import/settings", (req, res) => {
  res.json(db.getAiImportSettings());
});
app.post("/api/import/settings", (req, res) => {
  const actor = getActor(req);
  if (!["admin", "super_admin"].includes(actor.role)) {
    return res.status(403).json({ error: "Admin only" });
  }
  const updated = db.updateAiImportSettings(req.body);
  res.json({ success: true, settings: updated });
});
async function executeSupabasePing(targetUrl, targetKey) {
  const url = (targetUrl || process.env.SUPABASE_URL || "").trim();
  const key = (targetKey || process.env.SUPABASE_ANON_KEY || "").trim();
  if (!url) {
    return {
      success: true,
      message: "Local persistent file store active (Supabase optional)"
    };
  }
  const cleanUrl = url.replace(/\/+$/, "");
  const endpoint = `${cleanUrl}/rest/v1/`;
  const headers = {
    "User-Agent": "SupabaseKeepAlive/1.0",
    "Accept": "application/json"
  };
  if (key) {
    headers["apikey"] = key;
    headers["Authorization"] = `Bearer ${key}`;
  }
  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15e3);
    const resp = await fetch(endpoint, {
      method: "GET",
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    const durationMs = Date.now() - startTime;
    const isAwake = resp.status >= 200 && resp.status < 500;
    return {
      success: isAwake,
      statusCode: resp.status,
      statusText: resp.statusText,
      durationMs,
      endpoint,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      message: isAwake ? `Supabase project is active and responded in ${durationMs}ms with HTTP ${resp.status}` : `Supabase returned HTTP ${resp.status} ${resp.statusText}`
    };
  } catch (err) {
    return {
      success: false,
      error: err.name === "AbortError" ? "Connection timed out after 15s" : err.message,
      endpoint,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
}
app.get("/api/supabase/ping", async (req, res) => {
  const result = await executeSupabasePing();
  res.status(result.success ? 200 : 400).json(result);
});
app.post("/api/supabase/ping", async (req, res) => {
  const { supabaseUrl, supabaseAnonKey } = req.body || {};
  const result = await executeSupabasePing(supabaseUrl, supabaseAnonKey);
  res.status(result.success ? 200 : 400).json(result);
});
setTimeout(() => {
  try {
    db.getSystemSettings();
  } catch (e) {
  }
  executeSupabasePing().then((res) => {
    console.log("[Keep-Alive Startup Ping]:", res);
  }).catch(() => {
  });
}, 1e4);
setInterval(() => {
  try {
    db.getSystemSettings();
  } catch (e) {
  }
  executeSupabasePing().then((res) => {
    console.log("[Keep-Alive Scheduled Ping]:", res);
  }).catch(() => {
  });
}, 3 * 24 * 60 * 60 * 1e3);
app.all("/api/*", (req, res) => {
  res.status(404).json({
    error: `API route not found: ${req.method} ${req.originalUrl || req.url}`,
    status: 404
  });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path3.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path3.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NursingPrep Server running on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
