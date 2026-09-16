import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { MockTest, Question, TestAttempt } from '../types';
import { TestResultView } from './TestResultView';
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Check,
  Award,
  Play,
  Target
} from 'lucide-react';

interface MockTestEngineViewProps {
  onGoToMistakes: () => void;
  onBackToDashboard: () => void;
  onNavigateToUpgradePro?: () => void;
  openLoginModal?: (tab: 'member' | 'admin', registerMode?: boolean) => void;
}

export const MockTestEngineView: React.FC<MockTestEngineViewProps> = ({
  onGoToMistakes,
  onBackToDashboard,
  onNavigateToUpgradePro,
  openLoginModal
}) => {
  const { language, t } = useLanguage();
  const { currentUser, refreshUsers } = useAuth();

  const [availableTests, setAvailableTests] = useState<MockTest[]>([]);
  const [testTypeFilter, setTestTypeFilter] = useState<'all' | 'topic_test' | 'full_mock'>('all');
  const [activeTest, setActiveTest] = useState<(MockTest & { questions: Question[] }) | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [buyingTestId, setBuyingTestId] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingTestToStart, setPendingTestToStart] = useState<string | null>(null);

  // Attempt State
  const [answers, setAnswers] = useState<Record<string, {
    selected_option: 'A' | 'B' | 'C' | 'D' | null;
    is_marked_for_review: boolean;
    time_spent_seconds: number;
    visited: boolean;
  }>>({});

  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [startedAt, setStartedAt] = useState<string>('');
  const [totalTimeSpent, setTotalTimeSpent] = useState<number>(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [completedAttempt, setCompletedAttempt] = useState<TestAttempt | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Timer reference
  const timerRef = useRef<any>(null);

  // Proctoring & Anti-cheating State
  const [cheatStrikeCount, setCheatStrikeCount] = useState<number>(0);
  const [showCheatModal, setShowCheatModal] = useState<boolean>(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const proctorTimerRef = useRef<any>(null);

  useEffect(() => {
    loadTests();
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(track => track.stop());
      cameraStreamRef.current = null;
    }
    if (proctorTimerRef.current) {
      clearInterval(proctorTimerRef.current);
    }
  };

  const requestCameraPermissionAndStartStream = async (): Promise<boolean> => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 320, height: 240 } });
        cameraStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraPermissionGranted(true);
        return true;
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
    }
    return false;
  };

  const captureProctoringSnapshot = async (testId: string) => {
    try {
      let imageDataUrl = '';
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = 320;
        canvas.height = 240;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, 320, 240);
          imageDataUrl = canvas.toDataURL('image/jpeg', 0.6);
        }
      }

      if (!imageDataUrl) {
        // Fallback placeholder image data if webcam not available in container
        imageDataUrl = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" fill="%230f172a"><rect width="100%" height="100%" fill="%231e293b"/><text x="50%" y="50%" fill="%23f43f5e" font-size="16" text-anchor="middle" font-family="sans-serif">PROCTOR SNAPSHOT</text></svg>';
      }

      await api.sendProctoringSnapshot({
        test_id: testId,
        user_name: currentUser?.name || 'Student Candidate',
        image_data: imageDataUrl
      });
    } catch (err) {
      console.error('Failed to capture snapshot:', err);
    }
  };

  // Anti-cheating blur & tab switch listener
  useEffect(() => {
    if (!activeTest || completedAttempt) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setCheatStrikeCount(prev => {
          const next = prev + 1;
          if (next >= 3) {
            alert('⚠️ 3-Strike Rule Violation: तुम्ही परीक्षा चालू असताना अनेकदा दुसरी विंडो/ॲप उघडले. तुमची परीक्षा ऑटो-सबमिट होत आहे!');
            submitTest();
          } else {
            setShowCheatModal(true);
          }
          return next;
        });
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeTest, completedAttempt]);

  const loadTests = async () => {
    try {
      setLoading(true);
      const tests = await api.getMockTests();
      // Filter active tests for students unless admin
      setAvailableTests(tests.filter(t => t.is_active !== false));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayForSingleTest = async (test: MockTest) => {
    if (!currentUser) {
      setPendingTestToStart(test.id);
      setShowAuthModal(true);
      return;
    }
    try {
      setBuyingTestId(test.id);
      const order = await api.createTestRazorpayOrder(test.id);

      const win = window as any;
      if (!win.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      if ((window as any).Razorpay) {
        const rzp = new (window as any).Razorpay({
          key: order.key_id,
          amount: order.amount,
          currency: order.currency || 'INR',
          name: 'Nursing Officer Exam Prep',
          description: `Single Test Purchase: ${order.test_title}`,
          order_id: order.order_id,
          prefill: {
            name: currentUser?.name || '',
            email: currentUser?.email || '',
            contact: currentUser?.phone || ''
          },
          theme: { color: '#0f172a' },
          handler: async (response: any) => {
            try {
              await api.verifyTestRazorpayPayment(
                test.id,
                response.razorpay_payment_id,
                response.razorpay_order_id,
                response.razorpay_signature
              );
              alert('🎉 चाचणी यशस्वीरित्या अनलॉक झाली! आपण आता चाचणी सोडवू शकता.');
              if (refreshUsers) await refreshUsers();
              loadTests();
            } catch (err: any) {
              alert(err.message || 'Payment verification failed');
            }
          }
        });
        rzp.open();
      } else {
        alert('Payment gateway could not be loaded. Please try again.');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to initiate test payment');
    } finally {
      setBuyingTestId(null);
    }
  };

  const startTest = async (testId: string) => {
    if (!currentUser) {
      setPendingTestToStart(testId);
      setShowAuthModal(true);
      return;
    }
    try {
      setLoading(true);
      const fullTest = await api.getMockTest(testId);

      // Server-Side Timed Window Verification
      if (fullTest.strict_timing_enabled && fullTest.start_window_time && fullTest.end_window_time) {
        const now = new Date();
        const startTime = new Date(fullTest.start_window_time);
        const endTime = new Date(fullTest.end_window_time);

        if (now < startTime || now > endTime) {
          alert(`⚠️ परीक्षा प्रवेश वेळ मर्यादित आहे!\nही चाचणी फक्त ${startTime.toLocaleString('mr-IN')} ते ${endTime.toLocaleString('mr-IN')} या वेळेतच सोडवता येईल.`);
          setLoading(false);
          return;
        }
      }

      // Camera Permission Request on Test Enter
      if (fullTest.proctoring_enabled) {
        await requestCameraPermissionAndStartStream();
      }

      setActiveTest(fullTest);
      setCurrentQIndex(0);
      setCompletedAttempt(null);
      setStartedAt(new Date().toISOString());
      setCheatStrikeCount(0);

      // Initialize answer states
      const initAnswers: typeof answers = {};
      (fullTest.questions || []).forEach((q, idx) => {
        if (!q?.id) return;
        initAnswers[q.id] = {
          selected_option: null,
          is_marked_for_review: false,
          time_spent_seconds: 0,
          visited: idx === 0
        };
      });
      setAnswers(initAnswers);

      const totalSec = fullTest.duration_minutes * 60;
      setSecondsRemaining(totalSec);
      setTotalTimeSpent(0);

      // Start Proctoring Periodic Snapshot (every 2 mins)
      if (fullTest.proctoring_enabled) {
        captureProctoringSnapshot(fullTest.id);
        proctorTimerRef.current = setInterval(() => {
          captureProctoringSnapshot(fullTest.id);
        }, 120000); // 2 minutes
      }
    } catch (err) {
      console.error('Failed to start test', err);
    } finally {
      setLoading(false);
    }
  };

  // Live Timer Countdown
  useEffect(() => {
    if (!activeTest || completedAttempt) return;

    timerRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
      setTotalTimeSpent(prev => prev + 1);

      // increment time on current question
      if (activeTest.questions && activeTest.questions[currentQIndex]) {
        const qId = activeTest.questions[currentQIndex]?.id;
        if (qId) {
          setAnswers(prev => ({
            ...prev,
            [qId]: {
              ...prev[qId],
              time_spent_seconds: (prev[qId]?.time_spent_seconds || 0) + 1
            }
          }));
        }
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [activeTest, currentQIndex, completedAttempt]);

  const handleSelectOption = (opt: 'A' | 'B' | 'C' | 'D') => {
    if (!activeTest || !activeTest.questions || !activeTest.questions[currentQIndex]) return;
    const qId = activeTest.questions[currentQIndex]?.id;
    if (!qId) return;
    setAnswers(prev => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        selected_option: prev[qId]?.selected_option === opt ? null : opt,
        visited: true
      }
    }));
  };

  const clearResponse = () => {
    if (!activeTest || !activeTest.questions || !activeTest.questions[currentQIndex]) return;
    const qId = activeTest.questions[currentQIndex]?.id;
    if (!qId) return;
    setAnswers(prev => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        selected_option: null
      }
    }));
  };

  const toggleMarkForReview = () => {
    if (!activeTest || !activeTest.questions || !activeTest.questions[currentQIndex]) return;
    const qId = activeTest.questions[currentQIndex]?.id;
    if (!qId) return;
    setAnswers(prev => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        is_marked_for_review: !prev[qId]?.is_marked_for_review
      }
    }));
  };

  const jumpToQuestion = (index: number) => {
    if (!activeTest || !activeTest.questions || !activeTest.questions[index]) return;
    setCurrentQIndex(index);
    const targetQId = activeTest.questions[index]?.id;
    if (!targetQId) return;
    setAnswers(prev => ({
      ...prev,
      [targetQId]: {
        ...prev[targetQId],
        visited: true
      }
    }));
  };

  const handleNext = () => {
    if (!activeTest) return;
    if (currentQIndex < activeTest.questions.length - 1) {
      jumpToQuestion(currentQIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQIndex > 0) {
      jumpToQuestion(currentQIndex - 1);
    }
  };

  const submitTest = async () => {
    if (!activeTest || isSubmitting) return;
    try {
      setIsSubmitting(true);
      if (timerRef.current) clearInterval(timerRef.current);

      const formattedAnswers = (activeTest.questions || [])
        .filter(q => Boolean(q && q.id))
        .map(q => {
          const state = answers[q.id];
          return {
            question_id: q.id,
            selected_option: state?.selected_option || null,
            time_spent_seconds: state?.time_spent_seconds || 0,
            is_marked_for_review: !!state?.is_marked_for_review
          };
        });

      const attempt = await api.submitMockTest(activeTest.id, {
        answers: formattedAnswers,
        started_at: startedAt,
        time_spent_seconds: totalTimeSpent
      });

      // Stop camera stream immediately upon test submission
      stopCamera();
      setCompletedAttempt(attempt);
      setShowSubmitModal(false);
    } catch (err) {
      console.error('Failed to submit test', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoSubmit = () => {
    alert('Time has expired! Submitting your exam responses automatically.');
    submitTest();
  };

  // Palette status calculator
  const getPaletteStatus = (qId: string) => {
    const s = answers[qId];
    if (!s || !s.visited) return 'not_visited';
    if (s.is_marked_for_review) return 'marked';
    if (s.selected_option !== null) return 'answered';
    return 'not_answered';
  };

  // Counts for modal and stats
  const answerList = Object.values(answers) as { selected_option: string | null; is_marked_for_review: boolean }[];
  const answeredCount = answerList.filter(a => a.selected_option !== null).length;
  const markedCount = answerList.filter(a => a.is_marked_for_review).length;
  const unattemptedCount = (activeTest?.questions.length || 0) - answeredCount;

  // Render Result View if finished
  if (completedAttempt && activeTest) {
    return (
      <TestResultView
        attempt={completedAttempt}
        questions={activeTest.questions}
        test={activeTest}
        onRetest={() => startTest(activeTest.id)}
        onGoToMistakes={onGoToMistakes}
        onBackToDashboard={() => {
          stopCamera();
          setActiveTest(null);
          setCompletedAttempt(null);
          onBackToDashboard();
        }}
        onNavigateToPro={onNavigateToUpgradePro}
      />
    );
  }

  // 1. Available Tests Selection Screen
  if (!activeTest) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {language === 'mr' ? 'AIIMS NORCET व नर्सिंग मॉक टेस्ट्स' : 'Nursing Officer Mock Test Series'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl">
            {language === 'mr'
              ? 'प्रत्यक्ष परीक्षेसारखा अनुभव. १/३ निगेटिव्ह मार्किंग, टाइमर, प्रश्न पॅलेट आणि तपशीलवार अचूकता विश्लेषण.'
              : 'Simulate high-stakes computer-based tests with real exam timers, 1/3 negative marking, official question palette navigation, and instant scorecards.'}
          </p>
        </div>

        {/* Test Type Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1 pb-2">
          <button
            onClick={() => setTestTypeFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              testTypeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {language === 'mr' ? 'सर्व चाचण्या' : 'All Tests'} ({availableTests.length})
          </button>
          <button
            onClick={() => setTestTypeFilter('topic_test')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              testTypeFilter === 'topic_test'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>{language === 'mr' ? '🎯 घटक चाचण्या (Topic Tests)' : 'Topic Tests'}</span>
            <span className="ml-1 text-[10px] bg-white text-indigo-700 px-1.5 py-0.2 rounded-full font-black border border-indigo-200">
              {availableTests.filter(t => t.test_type === 'topic_test').length}
            </span>
          </button>
          <button
            onClick={() => setTestTypeFilter('full_mock')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              testTypeFilter === 'full_mock'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {language === 'mr' ? '🏛️ संपूर्ण पॅटर्न मॉक टेस्ट्स' : 'Full Exam Mocks'}
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500 text-sm">Loading mock tests...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(availableTests || [])
              .filter(test => {
                if (!test || !test.id) return false;
                if (testTypeFilter === 'topic_test') return test.test_type === 'topic_test';
                if (testTypeFilter === 'full_mock') return test.test_type !== 'topic_test';
                return true;
              })
              .map((test, index) => {
              const isFreeTest = test.test_number === 1 || index === 0 || test.is_free;
              const isProUser = currentUser?.role === 'pro_member' || currentUser?.role === 'admin' || currentUser?.hasTestSeriesAccess;
              const isSingleUnlocked = currentUser?.unlocked_test_ids?.includes(test.id);
              const isLocked = !isFreeTest && test.requires_test_series_pass && !isProUser && !isSingleUnlocked;
              
              const isScheduled = test.scheduled_date && new Date(test.scheduled_date) > new Date();
              const testPrice = test.price || 29;

              return (
                <div
                  key={test.id}
                  className={`bg-white rounded-2xl border p-6 shadow-xs transition flex flex-col justify-between relative overflow-hidden ${
                    isFreeTest
                      ? 'border-emerald-300 ring-2 ring-emerald-500/20 bg-emerald-50/10 hover:border-emerald-500 hover:shadow-md'
                      : isLocked
                      ? 'border-amber-200 bg-amber-50/20'
                      : 'border-slate-200 hover:border-teal-400 hover:shadow-md'
                  }`}
                >
                  {isFreeTest && (
                    <div className="bg-emerald-600 text-white text-[10px] font-black px-3 py-0.5 uppercase tracking-wider text-center -mx-6 -mt-6 mb-4 flex items-center justify-center gap-1 shadow-xs">
                      <span>✨ १ ली चाचणी सर्वांसाठी १००% मोफत (FREE Test Paper 1)</span>
                    </div>
                  )}

                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-3">
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                          {test.exam_pattern || test.exam_name}
                        </span>
                        {test.test_type === 'topic_test' && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1">
                            <Target className="w-3 h-3 text-purple-700" />
                            <span>घटक चाचणी</span>
                          </span>
                        )}
                      </div>
                      
                      {isFreeTest ? (
                        <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                          🎁 FREE 100%
                        </span>
                      ) : isSingleUnlocked ? (
                        <span className="text-[10px] font-extrabold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md border border-blue-300">
                          🔓 एकच चाचणी खरेदी (Unlocked)
                        </span>
                      ) : isLocked ? (
                        <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                          🔒 Single: ₹{testPrice} / Pass
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          -{(test.negative_marking_rate * 100).toFixed(0)}% Negative Mark
                        </span>
                      )}
                    </div>

                    {test.topic_name_mr && (
                      <div className="mb-2">
                        <span className="text-xs font-extrabold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 inline-block">
                          🎯 {test.topic_name_mr} {test.topic_name_en ? `(${test.topic_name_en})` : ''}
                        </span>
                      </div>
                    )}

                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      {language === 'mr' ? test.title_mr : test.title_en}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                      {language === 'mr' ? test.description_mr : test.description_en}
                    </p>

                    {test.scheduled_label && (
                      <div className="mb-3 p-2 bg-indigo-50 border border-indigo-200 rounded-xl text-[11px] text-indigo-900 font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        <span>रिलीज तारीख: {test.scheduled_label}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-slate-100 mb-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{test.duration_minutes} Minutes</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Award className="w-3.5 h-3.5 text-slate-400" />
                        <span>{test.total_marks} Total Marks</span>
                      </div>
                    </div>
                  </div>

                  {isScheduled ? (
                    <button
                      disabled
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-200 text-slate-500 text-xs font-bold cursor-not-allowed"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{test.scheduled_label} रोजी रिलीज होईल</span>
                    </button>
                  ) : isFreeTest ? (
                    <button
                      onClick={() => startTest(test.id)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition cursor-pointer shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>✨ पहिली मोफत चाचणी सुरू करा</span>
                    </button>
                  ) : isLocked ? (
                    <div className="space-y-2">
                      <div>
                        <button
                          onClick={() => handlePayForSingleTest(test)}
                          disabled={buyingTestId === test.id}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          💳 फक्त ही चाचणी घ्या (Pay ₹{testPrice})
                        </button>
                        <div className="text-[10px] text-center text-slate-500 mt-1 font-medium">
                          {language === 'mr' ? '(सर्व करांसहित • लगेच डिजिटल ॲक्सेस)' : '(Inclusive of all taxes • Instant Digital Access)'}
                        </div>
                      </div>

                      <button
                        onClick={() => onNavigateToUpgradePro ? onNavigateToUpgradePro() : onBackToDashboard()}
                        className="w-full py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-[11px] font-bold transition cursor-pointer border border-amber-300 text-center"
                      >
                        👑 सर्व ५०+ चाचण्यांचा Pass घ्या (₹१४९ पासून)
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startTest(test.id)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{t('startTest')}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Auth Required Modal for Free Test / Guest Users */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 border border-slate-100 animate-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shrink-0">
                  <Play className="w-6 h-6 fill-current translate-x-0.5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                    {language === 'mr' ? 'मोफत टेस्ट अनलॉक करण्यासाठी लॉगिन करा' : 'Login to Unlock Free Mock Test'}
                  </h3>
                  <p className="text-xs text-blue-600 font-bold mt-0.5">
                    {language === 'mr' ? '✨ मोफत नोंदणीवर लगेच टेस्ट सुरू होईल' : '✨ Instant test access upon free registration'}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50/80 rounded-2xl p-4 border border-blue-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
                <p>
                  <strong>{language === 'mr' ? 'परीक्षार्थी सूचना:' : 'Candidate Notice:'}</strong> {language === 'mr' ? 'परीक्षार्थीचे मोफत रजिस्ट्रेशन / लॉगिन केल्यानंतर ही मोफत टेस्ट पूर्णपणे अनलॉक होईल. तुमचे गुण, ऑल महाराष्ट्र मेरिट रँक आणि चुकीच्या प्रश्नांचे विश्लेषण सुरक्षित सेव्ह राहण्यासाठी लॉगिन आवश्यक आहे.' : 'Please Login or Register for free to unlock and attempt this test. Your marks, statewide ranking, and detailed analytics will be safely saved to your profile.'}
                </p>
              </div>

              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowAuthModal(false);
                    if (openLoginModal) {
                      openLoginModal('member', true);
                    }
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-black shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>✨ मोफत नोंदणी करा (Register Free)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowAuthModal(false);
                    if (openLoginModal) {
                      openLoginModal('member', false);
                    }
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>🔐 आधीच खाते आहे? लॉगिन करा (Login)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="w-full py-2 text-center text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
                >
                  ✕ नंतर करा (Close)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Active Timed Mock Exam Engine
  const safeQIndex = (activeTest?.questions && activeTest.questions.length > 0)
    ? Math.max(0, Math.min(currentQIndex, activeTest.questions.length - 1))
    : 0;
  const currentQ = activeTest?.questions ? activeTest.questions[safeQIndex] : null;
  const qState = (currentQ?.id ? answers[currentQ.id] : null) || {
    selected_option: null,
    is_marked_for_review: false,
    visited: true
  };

  const minutesLeft = Math.floor(secondsRemaining / 60);
  const secsLeft = secondsRemaining % 60;
  const isUrgentTimer = secondsRemaining < 300; // < 5 mins

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-100 flex flex-col">
      {/* Exam Header Bar */}
      <div className="bg-slate-900 text-white px-4 sm:px-8 py-3 flex items-center justify-between shadow-md">
        <div>
          <div className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
            {activeTest.exam_pattern} Simulation
          </div>
          <div className="text-sm sm:text-base font-bold truncate max-w-md">
            {language === 'mr' ? activeTest.title_mr : activeTest.title_en}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Countdown Clock */}
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-sm font-mono font-bold ${
            isUrgentTimer
              ? 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse'
              : 'bg-slate-800 border-slate-700 text-emerald-400'
          }`}>
            <Clock className="w-4 h-4" />
            <span>
              {String(minutesLeft).padStart(2, '0')}:{String(secsLeft).padStart(2, '0')}
            </span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Main Examination Canvas */}
      <div className="grow max-w-7xl mx-auto w-full px-2.5 sm:px-4 lg:px-6 py-2 sm:py-3 grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Left 3 Columns: Active Question Area */}
        <div className="lg:col-span-3 flex flex-col justify-between bg-white rounded-xl border border-slate-200 p-3 sm:p-4.5 shadow-2xs">
          <div className="space-y-3">
            {/* Question Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-extrabold text-slate-900">
                  Question {currentQIndex + 1}
                </span>
                <span className="text-xs text-slate-400">/ {activeTest.questions.length}</span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  +1.00
                </span>
                <span className="text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                  -0.33
                </span>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-1.5">
              <div className="text-[13.5px] sm:text-[15.5px] font-bold text-slate-900 leading-snug">
                {currentQ?.question_en || 'Question text unavailable'}
              </div>
              {currentQ?.question_mr &&
                currentQ.question_mr.trim().toLowerCase() !== (currentQ.question_en || '').trim().toLowerCase() && (
                  <div className="text-[12px] sm:text-[13.5px] font-medium text-slate-700 bg-blue-50/60 p-2 rounded-lg border border-blue-100 leading-snug">
                    {currentQ.question_mr}
                  </div>
                )}
            </div>

            {/* Options List */}
            <div className="space-y-1.5 pt-0.5">
              {(['A', 'B', 'C', 'D'] as const).map(optKey => {
                const optEn = currentQ ? (currentQ[`option_${optKey.toLowerCase()}_en` as keyof Question] as string) : '';
                const optMr = currentQ ? (currentQ[`option_${optKey.toLowerCase()}_mr` as keyof Question] as string) : '';
                const isSelected = qState.selected_option === optKey;

                return (
                  <button
                    key={optKey}
                    onClick={() => handleSelectOption(optKey)}
                    className={`w-full text-left px-2.5 py-2 rounded-xl border transition cursor-pointer flex items-center gap-2.5 min-h-[38px] ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className={`w-5.5 h-5.5 rounded-md border flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-300 text-slate-600'
                    }`}>
                      {optKey}
                    </div>
                    <div className="grow min-w-0">
                      <div className="text-[12.5px] sm:text-[13.5px] font-medium leading-snug">{optEn}</div>
                      {optMr && optMr.trim().toLowerCase() !== optEn.trim().toLowerCase() && (
                        <div className="text-[11.5px] sm:text-[12px] text-blue-900 font-medium leading-snug">{optMr}</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Controls */}
          <div className="pt-3 mt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleMarkForReview}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer flex items-center gap-1 ${
                  qState.is_marked_for_review
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{qState.is_marked_for_review ? 'Marked' : 'Review'}</span>
              </button>

              <button
                onClick={clearResponse}
                disabled={!qState.selected_option}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Clear
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentQIndex === 0}
                onClick={handlePrevious}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={currentQIndex >= activeTest.questions.length - 1}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
              >
                Save & Next
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Question Palette */}
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-2xs flex flex-col justify-between space-y-3">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Question Palette ({activeTest.questions.length})
            </h3>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-1.5 text-[10px] sm:text-[11px] mb-3 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 shrink-0"></span>
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-rose-500 shrink-0"></span>
                <span>Not Answered</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-purple-500 shrink-0"></span>
                <span>Review ({markedCount})</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-slate-200 shrink-0"></span>
                <span>Not Visited</span>
              </div>
            </div>

            {/* Palette Grid */}
            <div className="grid grid-cols-5 gap-1.5 max-h-[300px] overflow-y-auto p-0.5">
              {(activeTest.questions || []).map((q, idx) => {
                if (!q?.id) return null;
                const status = getPaletteStatus(q.id);
                const isCurrent = currentQIndex === idx;

                let btnBg = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
                if (status === 'answered') {
                  btnBg = 'bg-emerald-500 text-white font-bold';
                } else if (status === 'marked') {
                  btnBg = 'bg-purple-600 text-white font-bold';
                } else if (status === 'not_answered') {
                  btnBg = 'bg-rose-500 text-white font-bold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => jumpToQuestion(idx)}
                    className={`h-9 rounded-lg text-xs flex items-center justify-center transition cursor-pointer ${btnBg} ${
                      isCurrent ? 'ring-2 ring-slate-900 ring-offset-2' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
            >
              Submit Examination
            </button>
          </div>
        </div>
      </div>

      {/* Hidden elements for video capture & canvas snapshot processing */}
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />
      <canvas ref={canvasRef} className="hidden" />

      {/* Anti-Cheating Warning Strike Modal */}
      {showCheatModal && (
        <div className="fixed inset-0 bg-rose-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-900 border-4 border-rose-600">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="text-center space-y-1">
              <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black uppercase tracking-wider">
                ⚠️ Anti-Cheating Alert • Strike {cheatStrikeCount}/3
              </span>
              <h3 className="text-lg font-black text-rose-950">परीक्षा सुरक्षा सूचना (Screen Switch Warning)</h3>
              <p className="text-xs text-slate-600">
                परीक्षा सुरू असताना दुसरी विंडो, ॲप किंवा टॅब उघडण्यास सक्त मनाई आहे.
              </p>
            </div>

            <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200 text-xs text-rose-900 font-medium">
              ३ स्ट्राइक्स पूर्ण झाल्यास तुमची परीक्षा कोणतीही पूर्वसूचना न देता आपोआप सबमिट (Auto-Submit) केली जाईल.
            </div>

            <button
              onClick={() => setShowCheatModal(false)}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition"
            >
              मी समजलो / समजले, चाचणी सुरू ठेवा
            </button>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold">Submit Test Verification</h3>
                <p className="text-xs text-slate-500">Are you sure you want to finish your attempt?</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Questions:</span>
                <span className="font-bold text-slate-900">{activeTest.questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700 font-semibold">Answered:</span>
                <span className="font-bold text-emerald-700">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rose-700 font-semibold">Unattempted:</span>
                <span className="font-bold text-rose-700">{unattemptedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-700 font-semibold">Marked for Review:</span>
                <span className="font-bold text-purple-700">{markedCount}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500">Time Remaining:</span>
                <span className="font-mono font-bold text-slate-900">
                  {minutesLeft}m {secsLeft}s
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Return to Test
              </button>
              <button
                disabled={isSubmitting}
                onClick={submitTest}
                className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Evaluating...' : 'Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
