import { Award, Download, Palette, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';
import jsPDF from 'jspdf';

export interface CertificateData {
  name: string;
  testType: string;
  wpm: number;
  accuracy: number;
  grade?: string;
  score?: number;
  date: string;
  duration?: string;
}

interface CertificateGeneratorProps {
  data: CertificateData;
  onClose: () => void;
}

type ThemeType = 'modern' | 'classic' | 'professional' | 'elegant' | 'minimalist' | 'vibrant';

const themes = {
  modern: {
    name: 'Modern',
    primary: '#06b6d4',
    secondary: '#3b82f6',
    accent: '#8b5cf6',
    bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: '#8b5cf6',
  },
  classic: {
    name: 'Classic',
    primary: '#d4af37',
    secondary: '#c19a6b',
    accent: '#cd7f32',
    bg: 'linear-gradient(135deg, #f5f5dc 0%, #fffff0 100%)',
    border: '#d4af37',
  },
  professional: {
    name: 'Professional',
    primary: '#1e40af',
    secondary: '#1e3a8a',
    accent: '#2563eb',
    bg: 'linear-gradient(135deg, #e0e7ff 0%, #f0f9ff 100%)',
    border: '#1e40af',
  },
  elegant: {
    name: 'Elegant',
    primary: '#6b21a8',
    secondary: '#581c87',
    accent: '#7c3aed',
    bg: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
    border: '#6b21a8',
  },
  minimalist: {
    name: 'Minimalist',
    primary: '#0f172a',
    secondary: '#1e293b',
    accent: '#334155',
    bg: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    border: '#0f172a',
  },
  vibrant: {
    name: 'Vibrant',
    primary: '#dc2626',
    secondary: '#ea580c',
    accent: '#f59e0b',
    bg: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
    border: '#dc2626',
  },
};

const CertificateGenerator = ({ data, onClose }: CertificateGeneratorProps) => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('modern');
  const certificateRef = useRef<HTMLDivElement>(null);

  const theme = themes[selectedTheme];

  // Helper function to convert hex color to RGB
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const generatePDF = () => {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Background
    pdf.setFillColor(theme.primary);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // White content area
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(10, 10, pageWidth - 20, pageHeight - 20, 3, 3, 'F');

    // Double border design
    pdf.setDrawColor(theme.primary);
    pdf.setLineWidth(4);
    pdf.roundedRect(15, 15, pageWidth - 30, pageHeight - 30, 2, 2, 'S');
    
    pdf.setLineWidth(1.5);
    pdf.roundedRect(20, 20, pageWidth - 40, pageHeight - 40, 1.5, 1.5, 'S');

    // Decorative corner patterns (enhanced)
    pdf.setLineWidth(2);
    pdf.setDrawColor(theme.accent);
    const cornerSize = 15;
    const cornerOffset = 25;
    
    // Top-left corner
    pdf.line(cornerOffset, cornerOffset, cornerOffset + cornerSize, cornerOffset);
    pdf.line(cornerOffset, cornerOffset, cornerOffset, cornerOffset + cornerSize);
    pdf.circle(cornerOffset + 3, cornerOffset + 3, 1, 'F');
    
    // Top-right corner
    pdf.line(pageWidth - cornerOffset - cornerSize, cornerOffset, pageWidth - cornerOffset, cornerOffset);
    pdf.line(pageWidth - cornerOffset, cornerOffset, pageWidth - cornerOffset, cornerOffset + cornerSize);
    pdf.circle(pageWidth - cornerOffset - 3, cornerOffset + 3, 1, 'F');
    
    // Bottom-left corner
    pdf.line(cornerOffset, pageHeight - cornerOffset, cornerOffset + cornerSize, pageHeight - cornerOffset);
    pdf.line(cornerOffset, pageHeight - cornerOffset - cornerSize, cornerOffset, pageHeight - cornerOffset);
    pdf.circle(cornerOffset + 3, pageHeight - cornerOffset - 3, 1, 'F');
    
    // Bottom-right corner
    pdf.line(pageWidth - cornerOffset - cornerSize, pageHeight - cornerOffset, pageWidth - cornerOffset, pageHeight - cornerOffset);
    pdf.line(pageWidth - cornerOffset, pageHeight - cornerOffset - cornerSize, pageWidth - cornerOffset, pageHeight - cornerOffset);
    pdf.circle(pageWidth - cornerOffset - 3, pageHeight - cornerOffset - 3, 1, 'F');

    // Decorative seal/badge in top-right
    pdf.setFillColor(theme.accent);
    pdf.circle(pageWidth - 40, 40, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SEAL', pageWidth - 40, 42, { align: 'center' });

    // Title
    pdf.setFontSize(34);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(theme.primary);
    pdf.text('CERTIFICATE', pageWidth / 2, 45, { align: 'center' });

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(theme.secondary);
    pdf.text('OF ACHIEVEMENT', pageWidth / 2, 55, { align: 'center' });

    // Divider line with decorative elements
    pdf.setDrawColor(theme.secondary);
    pdf.setLineWidth(0.5);
    pdf.line(60, 60, pageWidth - 60, 60);
    pdf.setFillColor(theme.accent);
    pdf.circle(60, 60, 1.5, 'F');
    pdf.circle(pageWidth - 60, 60, 1.5, 'F');

    // Content
    pdf.setFontSize(12);
    pdf.setTextColor(80, 80, 80);
    pdf.text('This is to certify that', pageWidth / 2, 73, { align: 'center' });

    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(theme.primary);
    pdf.text(data.name, pageWidth / 2, 85, { align: 'center' });

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    pdf.text('has successfully completed the', pageWidth / 2, 98, { align: 'center' });

    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(theme.secondary);
    pdf.text(data.testType, pageWidth / 2, 110, { align: 'center' });

    // Stats box
    const statsY = 125;
    // Create light background by mixing theme color with white
    const rgb = hexToRgb(theme.primary);
    pdf.setFillColor(rgb.r + (255 - rgb.r) * 0.9, rgb.g + (255 - rgb.g) * 0.9, rgb.b + (255 - rgb.b) * 0.9);
    pdf.roundedRect(40, statsY - 5, pageWidth - 80, 30, 2, 2, 'F');

    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(theme.primary);
    
    const statX1 = pageWidth / 2 - 60;
    const statX2 = pageWidth / 2;
    const statX3 = pageWidth / 2 + 60;

    pdf.text(`${data.wpm}`, statX1, statsY + 5, { align: 'center' });
    pdf.text(`${data.accuracy}%`, statX2, statsY + 5, { align: 'center' });
    if (data.grade) {
      pdf.text(data.grade, statX3, statsY + 5, { align: 'center' });
    }

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text('WPM', statX1, statsY + 13, { align: 'center' });
    pdf.text('Accuracy', statX2, statsY + 13, { align: 'center' });
    if (data.grade) {
      pdf.text('Grade', statX3, statsY + 13, { align: 'center' });
    }

    // Score
    if (data.score) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(theme.accent);
      pdf.text(`Score: ${data.score}/100`, pageWidth / 2, 170, { align: 'center' });
    }

    // Date
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(80, 80, 80);
    pdf.text(`Date: ${data.date}`, pageWidth / 2, 180, { align: 'center' });

    // Signature lines (enhanced with decorative elements)
    const sigY = pageHeight - 40;
    const leftSigX = pageWidth / 4;
    const rightSigX = (pageWidth * 3) / 4;
    
    pdf.setLineWidth(0.8);
    pdf.setDrawColor(theme.secondary);
    // Left signature line
    pdf.line(leftSigX - 30, sigY, leftSigX + 30, sigY);
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Authorized Signature', leftSigX, sigY + 6, { align: 'center' });
    
    // Right signature line
    pdf.line(rightSigX - 30, sigY, rightSigX + 30, sigY);
    pdf.text('Official Stamp', rightSigX, sigY + 6, { align: 'center' });

    // Footer with decorative divider
    const footerY = pageHeight - 15;
    pdf.setDrawColor(theme.border);
    pdf.setLineWidth(0.3);
    pdf.line(40, footerY - 5, pageWidth - 40, footerY - 5);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(theme.primary);
    pdf.text('OnlineTypingTest.in', pageWidth / 2, footerY, { align: 'center' });

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(120, 120, 120);
    pdf.text('Free Online Typing Test & Practice Platform', pageWidth / 2, pageHeight - 14, { align: 'center' });

    // Watermark (very light color for transparency effect)
    pdf.setFontSize(60);
    pdf.setFont('helvetica', 'bold');
    // Extract RGB from theme.primary hex
    const rgbw = hexToRgb(theme.primary);
    // Mix with white by 92% to create 8% opacity effect
    pdf.setTextColor(rgbw.r + (255 - rgbw.r) * 0.92, rgbw.g + (255 - rgbw.g) * 0.92, rgbw.b + (255 - rgbw.b) * 0.92);
    pdf.text('onlinetypingtest.in', pageWidth / 2, pageHeight / 2 + 10, { 
      align: 'center',
      angle: 45 
    });

    // Save
    pdf.save(`${data.testType}_Certificate_${data.name}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-background rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-auto">
        
        {/* Theme Selector */}
        <div className="p-4 border-b border-border sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Choose Certificate Theme</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-accent rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {Object.entries(themes).map(([key, t]) => (
              <button
                key={key}
                onClick={() => setSelectedTheme(key as ThemeType)}
                className={`p-2 rounded-lg border-2 transition-all ${
                  selectedTheme === key
                    ? 'border-primary scale-105 shadow-lg'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div
                  className="w-full h-8 rounded mb-1"
                  style={{ background: t.bg }}
                />
                <div className="text-[10px] font-medium">{t.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Certificate Preview */}
        <div className="p-6">
          <div
            ref={certificateRef}
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: theme.bg }}
          >
            {/* Watermark */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                opacity: 0.08,
                transform: 'rotate(45deg)',
                fontSize: '3rem',
                fontWeight: 'bold',
                color: theme.primary,
              }}
            >
              onlinetypingtest.in
            </div>

            {/* Certificate Content */}
            <div className="relative bg-white/95 m-4 rounded-xl p-8 md:p-12">
              {/* Border */}
              <div
                className="absolute inset-6 rounded-lg pointer-events-none"
                style={{
                  border: `3px solid ${theme.border}`,
                }}
              >
                {/* Decorative Corners */}
                <div
                  className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 rounded-tl-lg"
                  style={{ borderColor: theme.accent }}
                />
                <div
                  className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 rounded-tr-lg"
                  style={{ borderColor: theme.accent }}
                />
                <div
                  className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 rounded-bl-lg"
                  style={{ borderColor: theme.accent }}
                />
                <div
                  className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 rounded-br-lg"
                  style={{ borderColor: theme.accent }}
                />
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                <Award
                  className="w-16 h-16 mx-auto mb-3"
                  style={{ color: theme.primary }}
                />
                <h1
                  className="text-3xl md:text-4xl font-bold"
                  style={{ color: theme.primary }}
                >
                  CERTIFICATE OF ACHIEVEMENT
                </h1>
                <p className="text-gray-600 text-sm mt-2">Typing Proficiency</p>
                <div
                  className="w-24 h-1 mx-auto mt-4 rounded-full"
                  style={{ backgroundColor: theme.secondary }}
                />
              </div>

              {/* Content */}
              <div className="text-center space-y-4 mb-8">
                <p className="text-gray-600 text-sm">This is to certify that</p>
                <h2
                  className="text-3xl md:text-4xl font-bold px-4"
                  style={{ color: theme.primary }}
                >
                  {data.name}
                </h2>
                <p className="text-gray-600 text-sm">has successfully completed the</p>
                <h3
                  className="text-xl font-semibold"
                  style={{ color: theme.secondary }}
                >
                  {data.testType}
                </h3>
              </div>

              {/* Stats */}
              <div
                className="rounded-xl p-6 mb-6"
                style={{ backgroundColor: `${theme.primary}15` }}
              >
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div
                      className="text-3xl font-bold"
                      style={{ color: theme.primary }}
                    >
                      {data.wpm}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">WPM</div>
                  </div>
                  <div>
                    <div
                      className="text-3xl font-bold"
                      style={{ color: theme.primary }}
                    >
                      {data.accuracy}%
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Accuracy</div>
                  </div>
                  {data.grade && (
                    <div>
                      <div
                        className="text-3xl font-bold"
                        style={{ color: theme.primary }}
                      >
                        {data.grade}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Grade</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Score */}
              {data.score && (
                <div className="text-center mb-6">
                  <div
                    className="inline-block rounded-full px-6 py-2"
                    style={{ backgroundColor: `${theme.accent}20` }}
                  >
                    <span
                      className="text-lg font-semibold"
                      style={{ color: theme.accent }}
                    >
                      Score: {data.score}/100
                    </span>
                  </div>
                </div>
              )}

              {/* Date */}
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600">Date: {data.date}</p>
              </div>

              {/* Signature Line */}
              <div className="flex justify-center mb-6">
                <div className="text-center">
                  <div className="w-48 border-t-2 border-gray-400 mb-2" />
                  <p className="text-xs text-gray-600">Authorized Signature</p>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center pt-6 border-t-2 border-gray-200">
                <p
                  className="text-lg font-bold"
                  style={{ color: theme.primary }}
                >
                  OnlineTypingTest.in
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Free Online Typing Test & Practice Platform
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border flex flex-wrap gap-3 justify-center sticky bottom-0 bg-background">
          <Button onClick={generatePDF} className="gradient-bg text-white">
            <Download className="w-4 h-4 mr-2" />
            Download as PDF
          </Button>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;
