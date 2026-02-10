import { FileDown, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface ErrorDetail {
  position: number;
  typed: string;
  correct: string;
  word: string;
}

interface ErrorAnalysisProps {
  promptText: string;
  inputValue: string;
  result: {
    wpm: number;
    accuracy: number;
    errors: number;
    timeTaken: number;
    date: string;
  };
}

const ErrorAnalysis = ({ promptText, inputValue, result }: ErrorAnalysisProps) => {
  const analyzeErrors = (): ErrorDetail[] => {
    const errors: ErrorDetail[] = [];
    const words = promptText.split(' ');
    let charIndex = 0;
    
    words.forEach((word) => {
      for (let i = 0; i < word.length; i++) {
        const globalIndex = charIndex + i;
        if (globalIndex < inputValue.length && inputValue[globalIndex] !== promptText[globalIndex]) {
          errors.push({
            position: globalIndex + 1,
            typed: inputValue[globalIndex] || '(missing)',
            correct: promptText[globalIndex],
            word: word
          });
        }
      }
      charIndex += word.length + 1;
    });
    
    return errors;
  };

  const errorDetails = analyzeErrors();
  
  const errorsByChar: Record<string, number> = {};
  errorDetails.forEach(err => {
    const key = `${err.correct}`;
    errorsByChar[key] = (errorsByChar[key] || 0) + 1;
  });
  
  const sortedErrors = Object.entries(errorsByChar).sort((a, b) => b[1] - a[1]);

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = 20;

    const date = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Header with gradient-like effect
    doc.setFillColor(99, 102, 241); // Primary purple
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('TYPING TEST REPORT', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('OnlineTypingTest.in', pageWidth / 2, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(date, pageWidth / 2, 38, { align: 'center' });

    yPos = 60;

    // Performance Summary Box
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, yPos - 5, pageWidth - 2 * margin, 50, 3, 3, 'F');
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Performance Summary', margin + 5, yPos + 5);
    
    yPos += 15;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    // Stats in grid layout
    const col1 = margin + 10;
    const col2 = pageWidth / 2 + 10;
    
    // WPM with color indicator
    doc.setTextColor(100, 116, 139);
    doc.text('Speed (WPM):', col1, yPos);
    doc.setTextColor(result.wpm >= 40 ? 34 : result.wpm >= 25 ? 234 : 239, result.wpm >= 40 ? 197 : result.wpm >= 25 ? 179 : 68, result.wpm >= 40 ? 94 : result.wpm >= 25 ? 8 : 68);
    doc.setFont('helvetica', 'bold');
    doc.text(String(result.wpm), col1 + 45, yPos);
    
    // Accuracy
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text('Accuracy:', col2, yPos);
    doc.setTextColor(result.accuracy >= 90 ? 34 : result.accuracy >= 70 ? 234 : 239, result.accuracy >= 90 ? 197 : result.accuracy >= 70 ? 179 : 68, result.accuracy >= 90 ? 94 : result.accuracy >= 70 ? 8 : 68);
    doc.setFont('helvetica', 'bold');
    doc.text(`${result.accuracy}%`, col2 + 35, yPos);
    
    yPos += 12;
    
    // Errors
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text('Total Errors:', col1, yPos);
    doc.setTextColor(result.errors === 0 ? 34 : 239, result.errors === 0 ? 197 : 68, result.errors === 0 ? 94 : 68);
    doc.setFont('helvetica', 'bold');
    doc.text(String(result.errors), col1 + 45, yPos);
    
    // Time
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text('Time Taken:', col2, yPos);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text(`${result.timeTaken}s`, col2 + 35, yPos);

    yPos += 25;

    // Error Breakdown Section
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Error Breakdown', margin, yPos);
    yPos += 10;

    if (sortedErrors.length === 0) {
      doc.setFillColor(220, 252, 231);
      doc.roundedRect(margin, yPos - 5, pageWidth - 2 * margin, 20, 3, 3, 'F');
      doc.setTextColor(34, 197, 94);
      doc.setFontSize(12);
      doc.text('✓ Perfect! No errors detected. Excellent typing!', margin + 10, yPos + 7);
      yPos += 25;
    } else {
      // Table header
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, yPos - 3, pageWidth - 2 * margin, 10, 'F');
      
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Character', margin + 5, yPos + 4);
      doc.text('Error Count', margin + 50, yPos + 4);
      doc.text('Frequency', margin + 100, yPos + 4);
      
      yPos += 12;
      doc.setFont('helvetica', 'normal');
      
      const totalErrors = errorDetails.length;
      sortedErrors.slice(0, 8).forEach(([char, count]) => {
        const displayChar = char === ' ' ? '(space)' : `"${char}"`;
        const percentage = ((count / totalErrors) * 100).toFixed(1);
        
        doc.setTextColor(30, 41, 59);
        doc.text(displayChar, margin + 5, yPos);
        doc.text(String(count), margin + 50, yPos);
        
        // Progress bar
        const barWidth = 40;
        const fillWidth = (count / totalErrors) * barWidth;
        doc.setFillColor(254, 226, 226);
        doc.roundedRect(margin + 100, yPos - 4, barWidth, 6, 1, 1, 'F');
        doc.setFillColor(239, 68, 68);
        doc.roundedRect(margin + 100, yPos - 4, fillWidth, 6, 1, 1, 'F');
        doc.text(`${percentage}%`, margin + 145, yPos);
        
        yPos += 10;
      });
    }

    yPos += 10;

    // Detailed Error List
    if (errorDetails.length > 0) {
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Detailed Error List', margin, yPos);
      yPos += 10;

      // Table header
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, yPos - 3, pageWidth - 2 * margin, 10, 'F');
      
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('#', margin + 5, yPos + 4);
      doc.text('Position', margin + 20, yPos + 4);
      doc.text('You Typed', margin + 50, yPos + 4);
      doc.text('Correct', margin + 85, yPos + 4);
      doc.text('In Word', margin + 115, yPos + 4);
      
      yPos += 12;
      doc.setFont('helvetica', 'normal');

      errorDetails.slice(0, 15).forEach((err, idx) => {
        if (yPos > pageHeight - 40) {
          doc.addPage();
          yPos = 20;
        }
        
        const typed = err.typed === ' ' ? '(space)' : err.typed;
        const correct = err.correct === ' ' ? '(space)' : err.correct;
        
        doc.setTextColor(100, 116, 139);
        doc.text(String(idx + 1), margin + 5, yPos);
        doc.text(String(err.position), margin + 20, yPos);
        
        doc.setTextColor(239, 68, 68);
        doc.text(typed, margin + 50, yPos);
        
        doc.setTextColor(34, 197, 94);
        doc.text(correct, margin + 85, yPos);
        
        doc.setTextColor(30, 41, 59);
        doc.text(err.word.substring(0, 20), margin + 115, yPos);
        
        yPos += 8;
      });

      if (errorDetails.length > 15) {
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(9);
        doc.text(`... and ${errorDetails.length - 15} more errors`, margin + 5, yPos + 5);
        yPos += 15;
      }
    }

    // Improvement Tips
    yPos += 10;
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFillColor(239, 246, 255);
    doc.roundedRect(margin, yPos - 5, pageWidth - 2 * margin, 45, 3, 3, 'F');
    
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('💡 Improvement Tips', margin + 5, yPos + 5);
    
    yPos += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 64, 175);

    const tips: string[] = [];
    if (sortedErrors.length > 0) {
      tips.push(`• Focus on the "${sortedErrors[0][0]}" key - most errors here`);
    }
    if (result.accuracy < 90) {
      tips.push('• Slow down! Accuracy matters more than speed');
    }
    if (result.wpm < 30) {
      tips.push('• Practice home row keys for muscle memory');
    }
    tips.push('• Take breaks every 20-30 minutes');

    tips.slice(0, 3).forEach(tip => {
      doc.text(tip, margin + 5, yPos);
      yPos += 8;
    });

    // Footer
    doc.setFillColor(99, 102, 241);
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('Generated by OnlineTypingTest.in - Your Free Typing Practice Platform', pageWidth / 2, pageHeight - 6, { align: 'center' });

    // Save PDF
    doc.save(`typing-report-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF report downloaded successfully!');
  };

  return (
    <div className="mt-6 p-5 bg-muted/30 rounded-2xl border border-border">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          Error Analysis ({result.errors} errors)
        </h4>
        <Button onClick={generatePDF} variant="outline" size="sm" className="gap-2">
          <FileDown className="w-4 h-4" />
          Download Report
        </Button>
      </div>

      {sortedErrors.length === 0 ? (
        <div className="text-center py-6 bg-green-500/10 rounded-xl border border-green-500/30">
          <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" strokeWidth={3} fill="currentColor" />
          <p className="font-semibold text-green-600 dark:text-green-400">Perfect Score!</p>
          <p className="text-sm text-muted-foreground">No errors detected. Excellent typing!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Most Common Errors */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Most Common Errors:</p>
            <div className="flex flex-wrap gap-2">
              {sortedErrors.slice(0, 6).map(([char, count]) => (
                <div 
                  key={char}
                  className="flex items-center gap-2 bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg border border-red-500/20"
                >
                  <span className="font-mono font-bold text-lg">
                    {char === ' ' ? '␣' : char}
                  </span>
                  <XCircle className="w-4 h-4" />
                  <span className="text-sm">{count}x</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Error List */}
          <div className="max-h-60 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3">#</th>
                  <th className="text-left py-2 px-3">You Typed</th>
                  <th className="text-left py-2 px-3">Correct</th>
                  <th className="text-left py-2 px-3">In Word</th>
                </tr>
              </thead>
              <tbody>
                {errorDetails.slice(0, 20).map((err, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-2 px-3 text-muted-foreground">{idx + 1}</td>
                    <td className="py-2 px-3">
                      <span className="bg-red-500/20 text-red-600 dark:text-red-400 px-2 py-1 rounded font-mono">
                        {err.typed === ' ' ? '␣' : err.typed}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className="bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-1 rounded font-mono">
                        {err.correct === ' ' ? '␣' : err.correct}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-mono text-muted-foreground">{err.word}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {errorDetails.length > 20 && (
              <p className="text-center text-sm text-muted-foreground py-2">
                ... and {errorDetails.length - 20} more errors (download report for full list)
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorAnalysis;
