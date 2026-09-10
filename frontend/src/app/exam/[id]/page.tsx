'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, AlertTriangle, CheckCircle2, Bookmark, ArrowRight, ArrowLeft } from 'lucide-react';
import { api } from '@/services/api';

export default function ExamPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [testData, setTestData] = useState<any>(null);
  const [attemptId, setAttemptId] = useState<string>('');
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, { selectedOptions: string[]; numericalValue: string; isMarkedForReview: boolean }>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(3600);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const startExam = async () => {
      try {
        const res = await api.post(`/tests/${params.id}/start`);
        const data = res.data.data;
        setTestData(data.test);
        setAttemptId(data.attemptId);
        setTimeLeftSeconds(data.test.durationMinutes * 60);

        const initialAnswers: any = {};
        data.test.questions.forEach((q: any) => {
          initialAnswers[q._id] = { selectedOptions: [], numericalValue: '', isMarkedForReview: false };
        });
        setUserAnswers(initialAnswers);
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to start exam');
        router.push('/student/dashboard');
      } finally {
        setLoading(false);
      }
    };

    startExam();
  }, [params.id, router]);

  // Timer countdown hook
  useEffect(() => {
    if (timeLeftSeconds <= 0 && testData) {
      handleFinalSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeftSeconds, testData]);

  const handleOptionSelect = (qId: string, optionId: string) => {
    const current = userAnswers[qId] || { selectedOptions: [], numericalValue: '', isMarkedForReview: false };
    setUserAnswers({
      ...userAnswers,
      [qId]: { ...current, selectedOptions: [optionId] },
    });
  };

  const handleToggleBookmark = (qId: string) => {
    const current = userAnswers[qId] || { selectedOptions: [], numericalValue: '', isMarkedForReview: false };
    setUserAnswers({
      ...userAnswers,
      [qId]: { ...current, isMarkedForReview: !current.isMarkedForReview },
    });
  };

  const handleFinalSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const payloadAnswers = Object.entries(userAnswers).map(([qId, val]) => ({
        questionId: qId,
        selectedOptions: val.selectedOptions,
        numericalValue: val.numericalValue,
        timeSpentSeconds: 60,
        isMarkedForReview: val.isMarkedForReview,
      }));

      const res = await api.post(`/tests/${params.id}/submit`, {
        attemptId,
        answers: payloadAnswers,
      });

      const attemptResult = res.data.data;
      router.push(`/student/tests/${attemptResult._id}/result`);
    } catch (err: any) {
      alert('Error submitting test: ' + err.message);
      setSubmitting(false);
    }
  };

  if (loading || !testData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-gold-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-bold text-lg">Initializing SADGYANAM Secure Exam Engine...</p>
        </div>
      </div>
    );
  }

  const currentQ = testData.questions[currentIdx];
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col min-w-0 max-w-full overflow-x-hidden">
      {/* Exam Header */}
      <header className="bg-brand-blue-900 text-white px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b-4 border-brand-gold-500 shadow-md min-w-0 max-w-full">
        <div>
          <h1 className="font-black text-lg sm:text-xl text-white leading-snug">{testData.title}</h1>
          <p className="text-xs text-brand-gold-400 font-semibold">Total Questions: {testData.questions.length} | Marks: {testData.totalMarks}</p>
        </div>

        {/* Timer */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          <div className="flex items-center gap-2 bg-slate-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-slate-700">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold-400 animate-pulse" />
            <span className="font-mono font-bold text-base sm:text-lg text-white">{formatTime(timeLeftSeconds)}</span>
          </div>

          <button
            onClick={handleFinalSubmit}
            disabled={submitting}
            className="px-4 sm:px-6 py-2 bg-brand-gold-500 text-slate-900 font-extrabold rounded-lg hover:bg-brand-gold-400 transition shadow-md text-xs sm:text-sm"
          >
            {submitting ? 'Submitting...' : 'Submit Test'}
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-7xl mx-auto w-full p-4 sm:p-6 gap-6 min-w-0">
        
        {/* Question Area */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-4 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <span className="font-bold text-sm text-brand-blue-800 bg-brand-blue-50 px-3 py-1 rounded-md">
                Question {currentIdx + 1} of {testData.questions.length}
              </span>
              <button
                onClick={() => handleToggleBookmark(currentQ._id)}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-md transition ${
                  userAnswers[currentQ._id]?.isMarkedForReview
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                {userAnswers[currentQ._id]?.isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}
              </button>
            </div>

            <h2 className="text-lg font-bold text-slate-900 leading-relaxed">
              {currentQ.questionText}
            </h2>

            {/* MCQ Options */}
            <div className="space-y-3 pt-4">
              {currentQ.options.map((opt: any) => {
                const isSelected = userAnswers[currentQ._id]?.selectedOptions.includes(opt.optionId);
                return (
                  <button
                    key={opt.optionId}
                    onClick={() => handleOptionSelect(currentQ._id, opt.optionId)}
                    className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition flex items-center justify-between ${
                      isSelected
                        ? 'border-brand-blue-800 bg-brand-blue-50/70 text-brand-blue-900 shadow-sm'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full text-xs flex items-center justify-center font-bold ${
                        isSelected ? 'bg-brand-blue-800 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {opt.optionId}
                      </span>
                      <span>{opt.text}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-blue-800" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-8 border-t border-slate-100 mt-8">
            <button
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((prev) => prev - 1)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            <button
              disabled={currentIdx === testData.questions.length - 1}
              onClick={() => setCurrentIdx((prev) => prev + 1)}
              className="px-5 py-2 bg-brand-blue-800 text-white rounded-lg text-sm font-bold hover:bg-brand-blue-900 transition flex items-center gap-2 shadow-sm"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question Palette Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3 text-base">Question Palette</h3>

          <div className="grid grid-cols-5 gap-2.5">
            {testData.questions.map((q: any, i: number) => {
              const ansState = userAnswers[q._id];
              const isAnswered = ansState?.selectedOptions.length > 0;
              const isMarked = ansState?.isMarkedForReview;
              const isCurrent = i === currentIdx;

              let btnBg = 'bg-slate-100 text-slate-700 border-slate-200';
              if (isAnswered) btnBg = 'bg-emerald-600 text-white border-emerald-700';
              if (isMarked) btnBg = 'bg-amber-500 text-white border-amber-600';
              if (isCurrent) btnBg += ' ring-2 ring-brand-blue-800 ring-offset-2 font-black';

              return (
                <button
                  key={q._id}
                  onClick={() => setCurrentIdx(i)}
                  className={`h-10 rounded-lg text-xs font-bold border transition flex items-center justify-center ${btnBg}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-emerald-600 inline-block"></span> Answered
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-amber-500 inline-block"></span> Marked for Review
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-300 inline-block"></span> Unanswered
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
