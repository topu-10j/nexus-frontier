// src/components/QuizModal.jsx
// Anytime quiz — 2 questions per session, 9s each, +$400 correct, -$100 wrong
import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { playSound } from '../audio/soundManager';
import { getRandomQuestion } from '../data/quizQuestions';

const QUESTIONS_PER_SESSION = 2;
const TIMER_PER_QUESTION = 9;

export default function QuizModal() {
  const {
    quizActive,
    currentQuiz,
    setCurrentQuiz,
    askedQuestionIds,
    quizCorrect,
    quizWrong,
    quizSessionCount,
    resetQuizCooldown,
    quizCooldown,
  } = useGameStore();

  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_PER_QUESTION);
  const [feedback, setFeedback] = useState(null);

  const timerRef = useRef(null);

  // ═══════════════════════════════════════════════════════
  // COOLDOWN RESET — after 60s, reset cooldown
  // ═══════════════════════════════════════════════════════
  useEffect(() => {
    if (!quizCooldown) return;
    const timer = setTimeout(() => {
      resetQuizCooldown();
    }, 60000); // 60 seconds
    return () => clearTimeout(timer);
  }, [quizCooldown, resetQuizCooldown]);

  // ═══════════════════════════════════════════════════════
  // LOAD NEW QUESTION when currentQuiz is null but quiz is active
  // ═══════════════════════════════════════════════════════
  useEffect(() => {
    if (quizActive && !currentQuiz) {
      const q = getRandomQuestion(askedQuestionIds || []);
      setCurrentQuiz(q);
      setSelected(null);
      setRevealed(false);
      setFeedback(null);
      setTimeLeft(TIMER_PER_QUESTION);
      playSound('nexa');
    }
  }, [quizActive, currentQuiz, askedQuestionIds, setCurrentQuiz]);

  // ═══════════════════════════════════════════════════════
  // 9s COUNTDOWN TIMER
  // ═══════════════════════════════════════════════════════
  useEffect(() => {
    if (!quizActive || !currentQuiz || revealed) return;

    setTimeLeft(TIMER_PER_QUESTION);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleAnswer(-1); // timeout
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizActive, currentQuiz, revealed]);

  // ═══════════════════════════════════════════════════════
  // ANSWER HANDLER
  // ═══════════════════════════════════════════════════════
  const handleAnswer = (idx) => {
    if (revealed || !currentQuiz) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelected(idx);
    setRevealed(true);

    const isCorrect = idx === currentQuiz.correct;

    if (isCorrect) {
      playSound('victory');
      setFeedback({ type: 'correct', text: '+$400! Correct!' });
      setTimeout(() => {
        quizCorrect();
        // quizCorrect() sets currentQuiz=null → next question auto-loads
      }, 1500);
    } else {
      playSound('hazard');
      setFeedback({
        type: 'wrong',
        text: idx === -1 ? `⏰ Time's up! -$100` : `Wrong! -$100`,
      });
      setTimeout(() => {
        quizWrong();
        // quizWrong() sets currentQuiz=null → next question auto-loads
      }, 1800);
    }
  };

  if (!quizActive || !currentQuiz) return null;

  const progressPercent = (timeLeft / TIMER_PER_QUESTION) * 100;
  const progressColor =
    timeLeft > 6 ? 'bg-green-500' : timeLeft > 3 ? 'bg-yellow-500' : 'bg-red-500';

  const questionNumber = quizSessionCount + 1;

  return (
    <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-6 md:p-8 rounded-3xl border-4 border-cyan-400 max-w-2xl w-full shadow-2xl">

        {/* ═══════════ HEADER ═══════════ */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-400/50 px-3 py-1 rounded-full mb-3">
            <span className="text-lg animate-pulse">🧠</span>
            <span className="text-cyan-300 text-xs font-black tracking-widest">
              NEXA'S QUIZ • {questionNumber}/{QUESTIONS_PER_SESSION}
            </span>
          </div>
          <h3 className="text-white text-lg font-bold mb-1">
            💰 Earn Space Credits!
          </h3>
          <p className="text-cyan-300 text-xs">
            Correct: <strong className="text-green-300">+$400</strong> • Wrong:{' '}
            <strong className="text-red-300">-$100</strong>
          </p>
        </div>

        {/* ═══════════ TIMER BAR ═══════════ */}
        <div className="mb-5">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-white/70 font-bold">⏱️ TIME</span>
            <span
              className={`font-black ${
                timeLeft > 6
                  ? 'text-green-400'
                  : timeLeft > 3
                  ? 'text-yellow-400'
                  : 'text-red-400 animate-pulse'
              }`}
            >
              {timeLeft}s
            </span>
          </div>
          <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-white/20">
            <div
              className={`h-full ${progressColor} transition-all duration-1000 ease-linear`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* ═══════════ CATEGORY ═══════════ */}
        <div className="mb-3">
          <span className="inline-block bg-purple-500/30 border border-purple-400/50 text-purple-200 text-[10px] font-black tracking-wider px-2 py-1 rounded-full">
            🪐 {currentQuiz.category?.toUpperCase() || 'SPACE'}
          </span>
        </div>

        {/* ═══════════ QUESTION ═══════════ */}
        <div className="bg-white/5 backdrop-blur rounded-2xl p-4 mb-5 border border-white/10">
          <p className="text-white text-base md:text-lg font-bold text-center leading-snug">
            {currentQuiz.q}
          </p>
        </div>

        {/* ═══════════ OPTIONS ═══════════ */}
        <div className="grid grid-cols-1 gap-2.5 mb-4">
          {currentQuiz.options.map((opt, idx) => {
            const isSelected = selected === idx;
            const isCorrect = idx === currentQuiz.correct;
            const showCorrect = revealed && isCorrect;
            const showWrong = revealed && isSelected && !isCorrect;

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={revealed}
                className={`text-left px-4 py-3 rounded-xl font-bold text-sm md:text-base
                  border-2 transition-all duration-200
                  ${
                    showCorrect
                      ? 'bg-green-500/30 border-green-400 text-white scale-[1.02]'
                      : showWrong
                      ? 'bg-red-500/30 border-red-400 text-white'
                      : revealed
                      ? 'bg-white/5 border-white/10 text-white/40 cursor-not-allowed'
                      : 'bg-white/10 hover:bg-cyan-500/30 border-white/20 hover:border-cyan-400 text-white hover:scale-[1.02] active:scale-95 cursor-pointer'
                  }`}
              >
                <span className="inline-block w-6 font-black text-cyan-300">
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span>{opt}</span>
                {showCorrect && <span className="float-right">✅</span>}
                {showWrong && <span className="float-right">❌</span>}
              </button>
            );
          })}
        </div>

        {/* ═══════════ FEEDBACK ═══════════ */}
        {feedback && (
          <div
            className={`p-3 rounded-xl text-center font-bold text-sm animate-pulse
              ${
                feedback.type === 'correct'
                  ? 'bg-green-500/20 border border-green-400 text-green-200'
                  : 'bg-red-500/20 border border-red-400 text-red-200'
              }`}
          >
            {feedback.text}
          </div>
        )}

        {/* ═══════════ FUN FACT (correct answers) ═══════════ */}
        {revealed && feedback?.type === 'correct' && currentQuiz.fact && (
          <div className="mt-3 bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-3">
            <p className="text-yellow-200 text-xs text-center">
              <strong>💡 Fun Fact:</strong> {currentQuiz.fact}
            </p>
          </div>
        )}

        {/* ═══════════ COOLDOWN MESSAGE ═══════════ */}
        {quizCooldown && (
          <div className="mt-3 text-center text-xs text-white/60">
            Quiz cooldown: 60s before next session
          </div>
        )}
      </div>
    </div>
  );
}