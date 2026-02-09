import { Award, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExamResult } from '@/hooks/useExamTest';
import { useRef } from 'react';

interface ExamCertificateProps {
  result: ExamResult;
  onClose: () => void;
}

const ExamCertificate = ({ result, onClose }: ExamCertificateProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    // Create a simple text-based certificate for download
    const certificateText = `
========================================
        TYPING PROFICIENCY CERTIFICATE
========================================

This is to certify that

        ${result.certificate?.name || 'Candidate'}

has successfully completed the

        ${result.examTitle} Typing Test

with the following performance:

        Speed: ${result.wpm} WPM
        Accuracy: ${result.accuracy}%
        Grade: ${result.certificate?.grade}
        Score: ${result.certificate?.score}/100

Date: ${new Date(result.date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })}

========================================
        TypeMaster Pro - Free Typing Test
========================================
    `;

    const blob = new Blob([certificateText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.examTitle}_Certificate_${result.certificate?.name || 'Candidate'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareText = `I passed the ${result.examTitle} Typing Test with ${result.wpm} WPM and ${result.accuracy}% accuracy! Grade: ${result.certificate?.grade}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Typing Test Certificate',
          text: shareText,
          url: window.location.href
        });
      } catch {
        navigator.clipboard.writeText(shareText);
      }
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div 
          ref={certificateRef}
          className="p-8 text-center"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)'
          }}
        >
          {/* Certificate Border */}
          <div className="border-4 border-primary/30 rounded-2xl p-6 relative">
            {/* Decorative corners */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />

            {/* Header */}
            <div className="mb-6">
              <Award className="w-16 h-16 mx-auto text-primary mb-2" />
              <h1 className="text-2xl md:text-3xl font-bold gradient-text">
                Certificate of Achievement
              </h1>
              <p className="text-muted-foreground text-sm mt-1">Typing Proficiency</p>
            </div>

            {/* Content */}
            <div className="space-y-4 mb-6">
              <p className="text-muted-foreground">This is to certify that</p>
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                {result.certificate?.name || 'Candidate'}
              </h2>
              <p className="text-muted-foreground">has successfully completed the</p>
              <h3 className="text-xl font-semibold">{result.examTitle} Typing Test</h3>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6 bg-muted/50 rounded-xl p-4">
              <div>
                <div className="text-2xl font-bold text-primary">{result.wpm}</div>
                <div className="text-xs text-muted-foreground">WPM</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{result.accuracy}%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{result.certificate?.grade}</div>
                <div className="text-xs text-muted-foreground">Grade</div>
              </div>
            </div>

            {/* Score */}
            <div className="mb-6">
              <div className="inline-block bg-primary/10 rounded-full px-6 py-2">
                <span className="text-lg font-semibold">
                  Score: {result.certificate?.score}/100
                </span>
              </div>
            </div>

            {/* Date */}
            <div className="text-sm text-muted-foreground mb-4">
              <p>Date: {new Date(result.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}</p>
            </div>

            {/* Signature */}
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-sm font-semibold">TypeMaster Pro</p>
              <p className="text-xs text-muted-foreground">Free Online Typing Test Platform</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border flex flex-wrap gap-3 justify-center">
          <Button onClick={handleDownload} className="gradient-bg text-white">
            <Download className="w-4 h-4 mr-2" />
            Download Certificate
          </Button>
          <Button onClick={handleShare} variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button onClick={onClose} variant="ghost">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExamCertificate;
