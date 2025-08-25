import { TimerIcon } from "lucide-react";

interface TimerProps {
  timeLeft: number;
}
export default function Timer({ timeLeft }: TimerProps) {
  // Add warning class if timeLeft is 10 or less
  const timerClass =
    "flex items-center justify-center space-x-2 text-2xl font-bold mb-8 " +
    (timeLeft <= 10 ? "text-red-500 warning" : "text-gray-700");
  return (
    <div
      className={timerClass}
      data-testid="timer"
    >
      <TimerIcon className="w-6 h-6" />
      <span>{timeLeft}s</span>
    </div>
  );
}
