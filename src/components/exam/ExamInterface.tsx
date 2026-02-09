import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Clock, Target, Zap, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useExamTest } from '@/hooks/useExamTest';
import { ExamType } from '@/data/examData';
import ExamCertificate from './ExamCertificate';

interface ExamInterfaceProps {
  examType: ExamType;
  onBack: () => void;
}

const ExamInterface = ({ examType, onBack }: ExamInterfaceProps) => {
  const {
    examStarted,
    examCompleted,
    currentTime,
    totalTime,
    inputValue,
    currentPassage,
    passageIndex,
    totalPassages,
    wpm,
    accuracy,
    errors,
    progress,
    result,
    currentExam,
    candidateName,
    setCandidateName,
    setInputValue,
    selectExam,
    startExam,
    resetExam,
    getCharClasses
  } = useExamTest();

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  // Select exam when component mounts or examType changes
  useEffect(() => {
    selectExam(examType);
  }, [examType, selectExam]);

  useEffect(() => {
    if (examStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [examStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const remainingTime = totalTime - currentTime;
  const isLowTime = remainingTime <= 60 && remainingTime > 0;

  if (!currentExam) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} disabled={examStarted}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Exams
        </Button>
        <div className="text-center">
          <h2 className="text-xl font-bold">{currentExam.title}</h2>
          <p className="text-sm text-muted-foreground">{currentExam.fullName}</p>
        </div>
        <div className="w-24" />
      </div>

      {/* Pre-exam setup */}
      {!examStarted && !examCompleted && (
        <div className="card-gradient p-8 rounded-3xl shadow-lg border border-border text-center">
          <h3 className="text-2xl font-bold mb-4">Exam Instructions</h3>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-muted/50 rounded-xl p-4">
              <Clock className="w-8 h-8 mx-auto text-primary mb-2" />
              <div className="font-semibold">{formatTime(totalTime)}</div>
              <div className="text-sm text-muted-foreground">Duration</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4">
              <Zap className="w-8 h-8 mx-auto text-primary mb-2" />
              <div className="font-semibold">{currentExam.requiredSpeed} WPM</div>
              <div className="text-sm text-muted-foreground">Required Speed</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4">
              <Target className="w-8 h-8 mx-auto text-primary mb-2" />
              <div className="font-semibold">{currentExam.requiredAccuracy}%</div>
              <div className="text-sm text-muted-foreground">Required Accuracy</div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Enter Your Name (for certificate)</label>
            <Input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="Your full name"
              className="max-w-xs mx-auto text-center"
            />
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-600 dark:text-yellow-400">Important</h4>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• Type exactly as shown, including punctuation and capitalization</li>
                  <li>• You will type {totalPassages} passage(s) during this exam</li>
                  <li>• The timer cannot be paused once started</li>
                  <li>• Press Ctrl+Enter to start the exam</li>
                </ul>
              </div>
            </div>
          </div>

          <Button onClick={startExam} className="gradient-bg text-white px-8 py-6 text-lg">
            Start Exam
          </Button>
        </div>
      )}

      {/* Active exam */}
      {examStarted && (
        <div className="card-gradient p-6 md:p-8 rounded-3xl shadow-lg border border-border">
          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className={`bg-muted/50 rounded-xl p-3 text-center ${isLowTime ? 'animate-pulse bg-red-500/20' : ''}`}>
              <Clock className={`w-5 h-5 mx-auto mb-1 ${isLowTime ? 'text-red-500' : 'text-primary'}`} />
              <div className={`text-xl font-bold ${isLowTime ? 'text-red-500' : ''}`}>
                {formatTime(remainingTime)}
              </div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <Zap className="w-5 h-5 mx-auto mb-1 text-primary" />
              <div className="text-xl font-bold">{wpm}</div>
              <div className="text-xs text-muted-foreground">WPM</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <Target className="w-5 h-5 mx-auto mb-1 text-primary" />
              <div className="text-xl font-bold">{accuracy}%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 text-center">
              <div className="text-xl font-bold text-red-500">{errors}</div>
              <div className="text-xs text-muted-foreground">Errors</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-3 text-center col-span-2 md:col-span-1">
              <div className="text-xl font-bold">{passageIndex + 1}/{totalPassages}</div>
              <div className="text-xs text-muted-foreground">Passage</div>
            </div>
          </div>

          {/* Passage display */}
          <div className="bg-muted/30 rounded-xl p-4 md:p-6 mb-6 font-mono text-base md:text-lg leading-relaxed">
            {currentPassage.split('').map((char, index) => {
              const charClass = getCharClasses()[index];
              return (
                <span
                  key={index}
                  className={
                    charClass === 'correct' ? 'text-green-500' :
                    charClass === 'incorrect' ? 'text-red-500 bg-red-500/20' :
                    index === inputValue.length ? 'bg-primary/30 animate-pulse' :
                    'text-muted-foreground'
                  }
                >
                  {char}
                </span>
              );
            })}
          </div>

          {/* Input area */}
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full h-32 p-4 rounded-xl border border-border bg-background font-mono text-base resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Start typing here..."
            autoFocus
          />

          {/* Progress bar */}
          <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full gradient-bg transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Results */}
      {examCompleted && result && (
        <div className="card-gradient p-6 md:p-8 rounded-3xl shadow-lg border border-border">
          <div className="text-center mb-6">
            {result.passed ? (
              <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            ) : (
              <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            )}
            <h2 className="text-2xl font-bold mb-2">
              {result.passed ? 'Congratulations! You Passed!' : 'Keep Practicing!'}
            </h2>
            <p className="text-muted-foreground">
              {result.passed 
                ? 'You have met the required criteria for this exam.'
                : `You need ${currentExam.requiredSpeed} WPM and ${currentExam.requiredAccuracy}% accuracy to pass.`
              }
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <div className={`text-3xl font-bold ${result.wpm >= currentExam.requiredSpeed ? 'text-green-500' : 'text-red-500'}`}>
                {result.wpm}
              </div>
              <div className="text-sm text-muted-foreground">WPM</div>
              <div className="text-xs text-muted-foreground">(Required: {currentExam.requiredSpeed})</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <div className={`text-3xl font-bold ${result.accuracy >= currentExam.requiredAccuracy ? 'text-green-500' : 'text-red-500'}`}>
                {result.accuracy}%
              </div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
              <div className="text-xs text-muted-foreground">(Required: {currentExam.requiredAccuracy}%)</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{result.errors}</div>
              <div className="text-sm text-muted-foreground">Errors</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{formatTime(result.timeTaken)}</div>
              <div className="text-sm text-muted-foreground">Time Used</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {result.passed && (
              <Button onClick={() => setShowCertificate(true)} className="gradient-bg text-white">
                View Certificate
              </Button>
            )}
            <Button onClick={resetExam} variant="outline">
              Try Again
            </Button>
            <Button onClick={onBack} variant="ghost">
              Back to Exams
            </Button>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificate && result?.certificate && (
        <ExamCertificate result={result} onClose={() => setShowCertificate(false)} />
      )}
    </div>
  );
};

export default ExamInterface;
