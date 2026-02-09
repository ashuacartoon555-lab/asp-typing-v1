import { useState, useCallback, useEffect, useRef } from 'react';
import { examPatterns, ExamType } from '@/data/examData';

export interface ExamResult {
  examType: ExamType;
  examTitle: string;
  wpm: number;
  accuracy: number;
  errors: number;
  totalCharacters: number;
  correctCharacters: number;
  timeTaken: number;
  totalTime: number;
  passed: boolean;
  date: string;
  certificate?: {
    name: string;
    score: number;
    grade: string;
  };
}

export const useExamTest = () => {
  const [selectedExam, setSelectedExam] = useState<ExamType | null>(null);
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [passageIndex, setPassageIndex] = useState(0);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [candidateName, setCandidateName] = useState('');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const currentExam = selectedExam ? examPatterns[selectedExam] : null;
  const currentPassage = currentExam?.passages[passageIndex] || '';
  const totalTime = currentExam?.duration || 0;

  const calculateStats = useCallback(() => {
    if (!currentPassage) return { wpm: 0, accuracy: 100, errors: 0, correctChars: 0 };
    
    let errors = 0;
    let correctChars = 0;
    
    for (let i = 0; i < inputValue.length; i++) {
      if (inputValue[i] === currentPassage[i]) {
        correctChars++;
      } else {
        errors++;
      }
    }
    
    const accuracy = inputValue.length > 0 
      ? Math.round((correctChars / inputValue.length) * 100) 
      : 100;
    
    const timeInMinutes = currentTime / 60;
    const words = correctChars / 5;
    const wpm = timeInMinutes > 0 ? Math.round(words / timeInMinutes) : 0;
    
    return { wpm, accuracy, errors, correctChars };
  }, [inputValue, currentPassage, currentTime]);

  const { wpm, accuracy, errors, correctChars } = calculateStats();

  const progress = currentPassage.length > 0 
    ? Math.min((inputValue.length / currentPassage.length) * 100, 100) 
    : 0;

  const getCharClasses = useCallback(() => {
    return currentPassage.split('').map((char, index) => {
      if (index >= inputValue.length) return 'pending';
      return inputValue[index] === char ? 'correct' : 'incorrect';
    });
  }, [currentPassage, inputValue]);

  const startExam = useCallback(() => {
    if (!selectedExam) return;
    
    setExamStarted(true);
    setExamCompleted(false);
    setCurrentTime(0);
    setInputValue('');
    setPassageIndex(0);
    setResult(null);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + 1;
        if (newTime >= totalTime) {
          finishExam();
          return prev;
        }
        return newTime;
      });
    }, 1000);
  }, [selectedExam, totalTime]);

  const finishExam = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setExamStarted(false);
    setExamCompleted(true);

    const stats = calculateStats();
    const exam = currentExam!;
    const passed = stats.wpm >= exam.requiredSpeed && stats.accuracy >= exam.requiredAccuracy;
    
    let grade = 'F';
    let score = 0;
    
    if (passed) {
      score = Math.round((stats.wpm / exam.requiredSpeed) * 50 + (stats.accuracy / 100) * 50);
      if (score >= 90) grade = 'A+';
      else if (score >= 80) grade = 'A';
      else if (score >= 70) grade = 'B';
      else if (score >= 60) grade = 'C';
      else grade = 'D';
    }

    const examResult: ExamResult = {
      examType: selectedExam!,
      examTitle: exam.title,
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      errors: stats.errors,
      totalCharacters: inputValue.length,
      correctCharacters: stats.correctChars,
      timeTaken: currentTime,
      totalTime: totalTime,
      passed,
      date: new Date().toISOString(),
      certificate: passed ? {
        name: candidateName || 'Candidate',
        score,
        grade
      } : undefined
    };

    setResult(examResult);
  }, [calculateStats, currentExam, selectedExam, inputValue, currentTime, totalTime, candidateName]);

  const resetExam = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setExamStarted(false);
    setExamCompleted(false);
    setCurrentTime(0);
    setInputValue('');
    setPassageIndex(0);
    setResult(null);
  }, []);

  const selectExam = useCallback((examType: ExamType) => {
    resetExam();
    setSelectedExam(examType);
  }, [resetExam]);

  const goBack = useCallback(() => {
    resetExam();
    setSelectedExam(null);
  }, [resetExam]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Auto-advance to next passage when current one is completed
  useEffect(() => {
    if (examStarted && inputValue.length >= currentPassage.length && currentExam) {
      if (passageIndex < currentExam.passages.length - 1) {
        setPassageIndex(prev => prev + 1);
        setInputValue('');
      } else {
        finishExam();
      }
    }
  }, [inputValue, currentPassage, examStarted, passageIndex, currentExam, finishExam]);

  return {
    selectedExam,
    examStarted,
    examCompleted,
    currentTime,
    totalTime,
    inputValue,
    currentPassage,
    passageIndex,
    totalPassages: currentExam?.passages.length || 0,
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
    finishExam,
    resetExam,
    goBack,
    getCharClasses
  };
};
