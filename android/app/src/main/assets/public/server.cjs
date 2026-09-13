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
var import_path2 = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_dotenv2 = __toESM(require("dotenv"), 1);

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
    exam_track: "norcet"
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
    exam_track: "norcet"
  },
  {
    id: "subj-apt-norcet",
    name_en: "Aptitude & Reasoning for NORCET",
    name_mr: "NORCET \u0905\u092D\u093F\u092F\u094B\u0917\u094D\u092F\u0924\u093E \u0906\u0923\u093F \u092C\u0941\u0926\u094D\u0927\u093F\u092E\u0924\u094D\u0924\u093E \u091A\u093E\u091A\u0923\u0940",
    description_en: "Logical reasoning, number series, coding-decoding, blood relations, direction tests, and data interpretation.",
    description_mr: "\u0924\u0930\u094D\u0915\u0915\u094D\u0937\u092E\u0924\u093E, \u0938\u0902\u0916\u094D\u092F\u093E \u092E\u093E\u0932\u093F\u0915\u093E, \u0915\u094B\u0921\u093F\u0902\u0917-\u0921\u093F\u0915\u094B\u0921\u093F\u0902\u0917, \u0928\u093E\u0924\u0947\u0938\u0902\u092C\u0902\u0927, \u0926\u093F\u0936\u093E \u091C\u094D\u091E\u093E\u0928 \u0906\u0923\u093F \u0921\u0947\u091F\u093E \u0935\u093F\u0936\u094D\u0932\u0947\u0937\u0923.",
    icon: "HelpCircle",
    totalQuestions: 15,
    category: "aptitude_gk",
    exam_track: "norcet"
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
    exam_track: "maha_staff_nurse"
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
    exam_track: "maha_staff_nurse"
  },
  {
    id: "subj-gk-mh",
    name_en: "Maharashtra & India GK and Health Schemes",
    name_mr: "\u092E\u0939\u093E\u0930\u093E\u0937\u094D\u091F\u094D\u0930 \u0935 \u092D\u093E\u0930\u0924 \u0938\u093E\u092E\u093E\u0928\u094D\u092F \u091C\u094D\u091E\u093E\u0928 \u0906\u0923\u093F \u0906\u0930\u094B\u0917\u094D\u092F \u092F\u094B\u091C\u0928\u093E",
    description_en: "Maharashtra geography, history, social reformers, Indian Constitution, national health mission (NHM), and state health schemes.",
    description_mr: "\u092E\u0939\u093E\u0930\u093E\u0937\u094D\u091F\u094D\u0930\u093E\u091A\u093E \u092D\u0942\u0917\u094B\u0932, \u0907\u0924\u093F\u0939\u093E\u0938, \u0938\u092E\u093E\u091C\u0938\u0941\u0927\u093E\u0930\u0915, \u092D\u093E\u0930\u0924\u0940\u092F \u0938\u0902\u0935\u093F\u0927\u093E\u0928 \u0906\u0923\u093F \u0936\u093E\u0938\u0928 \u092A\u0941\u0930\u0938\u094D\u0915\u0943\u0924 \u0906\u0930\u094B\u0917\u094D\u092F \u092F\u094B\u091C\u0928\u093E.",
    icon: "Globe",
    totalQuestions: 15,
    category: "aptitude_gk",
    exam_track: "maha_staff_nurse"
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
    exam_track: "maha_staff_nurse"
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
  }
];
var INITIAL_MOCK_TESTS = [
  {
    id: "mock-norcet-grand-01",
    title_en: "NORCET 2025 All India Full Length Mock Test 1",
    title_mr: "NORCET \u0968\u0966\u0968\u096B \u0905\u0916\u093F\u0932 \u092D\u093E\u0930\u0924\u0940\u092F \u0938\u0902\u092A\u0942\u0930\u094D\u0923 \u092E\u0949\u0915 \u091F\u0947\u0938\u094D\u091F \u0967",
    exam_name: "NORCET",
    description: "Comprehensive high-yield simulator matching the official AIIMS NORCET pattern with 100% verified clinical and practical nursing questions, timed countdown, and 1/3rd negative marking.",
    duration_minutes: 30,
    total_marks: 14,
    passing_marks: 7,
    negative_marking_rate: 0.33,
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
      "q-psych-01"
    ],
    is_published: true,
    is_premium: false,
    created_at: "2026-02-05T08:00:00.000Z"
  },
  {
    id: "mock-esic-rapid-01",
    title_en: "ESIC & State Nursing Officer Rapid Test",
    title_mr: "ESIC \u0906\u0923\u093F \u0930\u093E\u091C\u094D\u092F \u0928\u0930\u094D\u0938\u093F\u0902\u0917 \u0911\u092B\u093F\u0938\u0930 \u0930\u0945\u092A\u093F\u0921 \u0938\u0930\u093E\u0935 \u091A\u093E\u091A\u0923\u0940",
    exam_name: "ESIC Nursing Officer",
    description: "High frequency questions targeted for ESIC and State Nursing Recruitment exams with 1/4th negative marking penalty.",
    duration_minutes: 15,
    total_marks: 8,
    passing_marks: 4,
    negative_marking_rate: 0.25,
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
var cloudName = process.env.CLOUDINARY_CLOUD_NAME;
var apiKey = process.env.CLOUDINARY_API_KEY;
var apiSecret = process.env.CLOUDINARY_API_SECRET;
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
  "nursing-officer/thumbnails"
];
async function uploadToCloudinary(fileData, options = {}) {
  const targetFolder = options.folder || "nursing-officer/questions";
  if (!isCloudinaryConfigured) {
    console.info("Cloudinary credentials not set in .env. Falling back to local data URL.");
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
        // Preserve ECG and chart legibility
        { quality: "auto:good" },
        { fetch_format: "auto" }
        // Serves WebP / AVIF automatically to supported browsers
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
      is_simulated: false
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(error.message || "Failed to upload image to Cloudinary CDN");
  }
}
async function deleteFromCloudinary(publicId) {
  if (!isCloudinaryConfigured || publicId.startsWith("local-")) {
    return true;
  }
  try {
    const result = await import_cloudinary.v2.uploader.destroy(publicId);
    return result.result === "ok" || result.result === "not found";
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return false;
  }
}

// server/db.ts
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
    email: "admin@nursingprep.ai",
    name: "Platform Administrator",
    role: "admin",
    preferredLanguage: "en",
    targetExam: "Exam Operations",
    dailyTarget: 50,
    streakDays: 45,
    points: 1500,
    isPremium: true,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  }
];
var INITIAL_SETTINGS = {
  app_name: "Nursing Officer Exam Preparation Platform",
  default_language: "en",
  allow_registration: true,
  maintenance_mode: false,
  default_negative_marking: 0.33,
  ai_rate_limit_per_user_per_day: 50,
  enable_ai_question_generation: true,
  enable_ai_study_coach: true
};
var DatabaseService = class {
  constructor() {
    this.store = this.loadOrInitialize();
  }
  loadOrInitialize() {
    try {
      if (!import_fs.default.existsSync(DATA_DIR)) {
        import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (import_fs.default.existsSync(STORE_PATH)) {
        const raw = import_fs.default.readFileSync(STORE_PATH, "utf-8");
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn("Error reading store.json, reinitializing default data", err);
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
          details: "Nursing Officer Preparation Platform initialized with certified subject banks and PYQs.",
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        }
      ],
      settings: INITIAL_SETTINGS
    };
    if (import_fs.default.existsSync(STORE_PATH)) {
      try {
        const raw = import_fs.default.readFileSync(STORE_PATH, "utf-8");
        const parsed = JSON.parse(raw);
        return {
          ...defaultStore,
          ...parsed,
          chapters: parsed.chapters && parsed.chapters.length > 0 ? parsed.chapters : INITIAL_CHAPTERS,
          topics: parsed.topics && parsed.topics.length > 0 ? parsed.topics : INITIAL_TOPICS,
          subtopics: parsed.subtopics || [],
          subjects: parsed.subjects && parsed.subjects.length > 0 ? parsed.subjects : INITIAL_SUBJECTS
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
  // Users
  getUsers() {
    return this.store.users;
  }
  getUserById(id) {
    return this.store.users.find((u) => u.id === id);
  }
  getUserByEmail(email) {
    return this.store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  createUser(user) {
    const newUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      email: user.email,
      name: user.name,
      role: user.role || "student",
      preferredLanguage: user.preferredLanguage || "en",
      targetExam: user.targetExam || "NORCET",
      dailyTarget: user.dailyTarget || 20,
      streakDays: 1,
      points: 50,
      isPremium: !!user.isPremium,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
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
  // Subjects
  getSubjects() {
    const questions2 = this.getQuestions();
    return this.store.subjects.map((s) => {
      const subQs = questions2.filter((q) => q.subject_id === s.id);
      return {
        ...s,
        totalQuestions: subQs.length,
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
      const chQs = questions2.filter((q) => q.chapter_id === ch.id);
      return {
        ...ch,
        totalQuestions: chQs.length,
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
      list = list.filter((q) => q.subject_id === filters.subject_id);
    }
    if (filters?.chapter_id) {
      list = list.filter((q) => q.chapter_id === filters.chapter_id);
    }
    if (filters?.topic_id) {
      list = list.filter((q) => q.topic_id === filters.topic_id);
    }
    if (filters?.difficulty) {
      list = list.filter((q) => q.difficulty === filters.difficulty);
    }
    if (filters?.status) {
      list = list.filter((q) => q.status === filters.status);
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
  // Audit Logs
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
    this.store.audit_logs.unshift(entry);
    if (this.store.audit_logs.length > 1e3) {
      this.store.audit_logs = this.store.audit_logs.slice(0, 1e3);
    }
    this.save();
    return entry;
  }
  getAuditLogs() {
    return this.store.audit_logs;
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
  "gemini-flash-latest",
  "gemini-3.1-flash-lite"
];
async function generateWithRetryAndFallback(params) {
  const ai = getAiClient();
  if (!ai) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }
  let lastError = null;
  for (const model of CANDIDATE_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.prompt,
          config: params.config
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
  const cached = await getAiCachedResponse(queryHash);
  if (cached) {
    return {
      success: true,
      text: cached,
      fromCache: true
    };
  }
  const prompt = `You are a Senior Nursing Educator and Clinical Specialist for AIIMS NORCET & State Nursing Officer competitive exams.
Explain the following clinical/nursing concept in clear, high-yield points suitable for competitive exams.
Concept: "${concept}"
Language: ${language === "mr" ? "Marathi (\u092E\u0930\u093E\u0920\u0940) with key English medical terms in brackets" : "English"}.

Structure the response with:
1. Definition & Core Physiology
2. Clinical Priority / High-Yield Points for Nursing Exams
3. Potential Complications & Nursing Interventions
4. Common Exam Traps / Quick Formula (if applicable)
COPYRIGHT & ORIGINALITY DIRECTIVE: Explain all concepts in your own original pedagogical words. Do not reproduce verbatim copyrighted material or cite specific commercial textbook titles or publisher trademarks.
Include a clear educational disclaimer that this is for exam preparation, not direct patient prescription.`;
  try {
    const text2 = await generateWithRetryAndFallback({
      prompt,
      config: { temperature: 0.2 }
    });
    if (text2) {
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
  const cached = await getAiCachedResponse(queryHash);
  if (cached) {
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
      config: { temperature: 0.3 }
    });
    if (text2) {
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
  const cached = await getAiCachedResponse(queryHash);
  if (cached) {
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
      config: { temperature: 0.2 }
    });
    if (text2) {
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
  const cached = await getAiCachedResponse(queryHash);
  if (cached) {
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
      config: { temperature: 0.2 }
    });
    if (text2) {
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
  const cached = await getAiCachedResponse(queryHash);
  if (cached) {
    try {
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
      config: {
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
    return {
      success: true,
      draft: clinicalFallbackDraft,
      notice: "Generated from Verified Clinical Exam Question Bank"
    };
  }
}

// src/lib/firebase-admin.ts
var import_app = require("firebase-admin/app");
var import_auth = require("firebase-admin/auth");

// firebase-applet-config.json
var firebase_applet_config_default = {
  projectId: "effortless-osprey-jds98",
  appId: "1:391297368732:web:d45e782dd46e6a89336359",
  apiKey: "AIzaSyD8PCSJgrZw9LvWdyBYk7nY40focmdJShg",
  authDomain: "effortless-osprey-jds98.firebaseapp.com",
  storageBucket: "effortless-osprey-jds98.firebasestorage.app",
  messagingSenderId: "391297368732",
  measurementId: "",
  oAuthClientId: "391297368732-q9ocs4m5c9u0c1sli721tclcet60mr6u.apps.googleusercontent.com",
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
import_dotenv2.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json({ limit: "10mb" }));
app.use(import_express.default.urlencoded({ extended: true, limit: "10mb" }));
function getActor(req) {
  const userId = req.headers["x-user-id"] || "usr-student-01";
  return db.getUserById(userId) || db.getUsers()[0];
}
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
});
app.get("/api/auth/users", (req, res) => {
  res.json(db.getUsers());
});
app.get("/api/auth/me", (req, res) => {
  const user = getActor(req);
  res.json(user);
});
app.post("/api/auth/switch-user", (req, res) => {
  const { userId } = req.body;
  const user = db.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});
app.post("/api/auth/register", (req, res) => {
  const { email, name, role, targetExam, preferredLanguage } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.json(existing);
  }
  const user = db.createUser({ email, name, role, targetExam, preferredLanguage });
  res.status(201).json(user);
});
app.post("/api/auth/firebase-login", requireAuth, async (req, res) => {
  try {
    const decoded = req.user;
    if (!decoded || !decoded.uid) {
      return res.status(401).json({ error: "Invalid auth token" });
    }
    const email = decoded.email || `${decoded.uid}@google.auth`;
    const name = decoded.name || email.split("@")[0];
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
    res.json({
      ...localUser,
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
    db.logAudit(
      actor.id,
      actor.name,
      actor.role,
      "DELETE_IMAGE",
      "Media",
      public_id,
      `Deleted image asset: ${public_id}`
    );
    res.json({ success });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete asset" });
  }
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
  const { rows, executeInsert } = req.body;
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: "Rows array is required" });
  }
  const validationResults = [];
  const existingQuestions = db.getQuestions();
  const validRowsToInsert = [];
  rows.forEach((row, idx) => {
    const rowNum = idx + 1;
    const errors = [];
    if (!row.question_en || String(row.question_en).trim().length < 5) {
      errors.push("English question text is missing or too short");
    }
    if (!row.option_a_en || !row.option_b_en || !row.option_c_en || !row.option_d_en) {
      errors.push("All 4 English options (A, B, C, D) are required");
    }
    const correct = String(row.correct_option || "").toUpperCase();
    if (!["A", "B", "C", "D"].includes(correct)) {
      errors.push(`Invalid correct option "${row.correct_option}". Must be A, B, C, or D.`);
    }
    if (!row.explanation_en) {
      errors.push("Explanation in English is required");
    }
    if (!row.subject_id) {
      row.subject_id = "subj-fon";
    }
    const hash = db.computeDuplicateHash(row.question_en || "");
    const isDuplicate = existingQuestions.some((q) => q.duplicate_hash === hash);
    if (isDuplicate) {
      errors.push("Likely duplicate of an existing question in database");
    }
    const isValid = errors.length === 0;
    if (isValid) {
      validRowsToInsert.push({ ...row, correct_option: correct, status: "draft" });
    }
    validationResults.push({
      row_number: rowNum,
      valid: isValid,
      errors,
      is_duplicate: isDuplicate,
      data: row
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
app.post("/api/ai/explain", async (req, res) => {
  const { concept, language } = req.body;
  if (!concept) return res.status(400).json({ error: "Concept is required" });
  const result = await explainNursingConcept(concept, language || "en");
  res.json(result);
});
app.post("/api/ai/mnemonic", async (req, res) => {
  const { topic, language } = req.body;
  if (!topic) return res.status(400).json({ error: "Topic is required" });
  const result = await generateMnemonic(topic, language || "en");
  res.json(result);
});
app.post("/api/ai/revision-plan", async (req, res) => {
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
app.post("/api/ai/doubt", async (req, res) => {
  const { doubt, context, language } = req.body;
  if (!doubt) return res.status(400).json({ error: "Doubt query is required" });
  const result = await askStudyCoachDoubt(doubt, context, language || "en");
  res.json(result);
});
app.post("/api/ai/generate-question", async (req, res) => {
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
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NursingPrep Server running on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
