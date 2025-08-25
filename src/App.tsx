import { useEffect, useState, useRef } from "react";
import GameOver from "./components/game-over";
import QuestionCard from "./components/question-card";
import StartScreen from "./components/start-screen";
import { GameState } from "./types/quiz";
import { QUESTIONS } from "./data/questions";
import Timer from "./components/timer";

function getInitialTimer() {
  const params = new URLSearchParams(window.location.search);
  const timerParam = parseInt(params.get("timer") || "30", 10);
  return isNaN(timerParam) ? 30 : timerParam;
}

function App() {
  const [gameState, setGameState] = useState<GameState>("start");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(getInitialTimer());
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const answerLocked = useRef(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === "playing") {
      setGameState("end");
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameState]);

  const handleStart = () => {
    setGameState("playing");
    setTimeLeft(getInitialTimer());
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsProcessing(false);
    answerLocked.current = false;
  };

  const handleRestart = () => {
    setGameState("start");
    setTimeLeft(getInitialTimer());
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsProcessing(false);
    answerLocked.current = false;
  };

  const handleAnswer = (index: number): void => {
    if (isProcessing || selectedAnswer !== null || answerLocked.current) return;
    answerLocked.current = true;
    setIsProcessing(true);
    setSelectedAnswer(index);
    const isCorrect = index === QUESTIONS[currentQuestion].correct;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsProcessing(false);
        answerLocked.current = false;
      } else {
        setGameState("end");
        setIsProcessing(false);
        answerLocked.current = false;
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
  {gameState === "start" && <StartScreen onStart={handleStart} />}
        {gameState === "playing" && (
          <div className="p-8">
            <Timer timeLeft={timeLeft} />
            <QuestionCard
              question={QUESTIONS[currentQuestion]}
              onAnswerSelect={handleAnswer}
              selectedAnswer={selectedAnswer}
              totalQuestions={QUESTIONS.length}
              currentQuestion={currentQuestion}
              isProcessing={isProcessing}
            />
            <div className="mt-6 text-center text-gray-600" data-testid="score">
              Score: {score}/{QUESTIONS.length}
            </div>
          </div>
        )}
        {gameState === "end" && (
          <GameOver
            score={score}
            totalQuestions={QUESTIONS.length}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}

export default App;
