import { Trophy, PlusCircle, Share2, Save, Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import ErrorAnalysis from './ErrorAnalysis';

interface ResultDisplayProps {
  result: {
    wpm: number;
    accuracy: number;
    errors: number;
    timeTaken: number;
    date: string;
  };
  motivation: { emoji: string; text: string } | null;
  onNewTest: () => void;
  promptText?: string;
  inputValue?: string;
}

const ResultDisplay = ({ result, motivation, onNewTest, promptText = '', inputValue = '' }: ResultDisplayProps) => {
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [certificateName, setCertificateName] = useState('');
  const [isShareCardOpen, setIsShareCardOpen] = useState(false);
  const [shareName, setShareName] = useState('Your Result');
  const [shareTheme, setShareTheme] = useState<'teal' | 'purple' | 'gold'>('teal');
  const getPerformanceFeedback = () => {
    if (result.wpm >= 70) {
      return 'Professional typist level. You type faster than 98% of people.';
    } else if (result.wpm >= 50) {
      return 'Great job! Your typing speed is well above average. Keep practicing to reach expert level.';
    } else if (result.wpm >= 35) {
      return 'Good! Average typing speed. Consistent practice will help you improve further.';
    } else if (result.wpm >= 20) {
      return 'Fair speed. Focus on accuracy and finger placement to build muscle memory.';
    } else {
      return 'Beginner level. Practice regularly with proper technique to see significant improvement.';
    }
  };

  const handleShare = () => {
    const text = `I just scored ${result.wpm} WPM with ${result.accuracy}% accuracy on Online Typing Test! Try it yourself.`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Typing Test Results',
        text,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Results copied to clipboard!');
    }
  };

  const handleSave = () => {
    const history = JSON.parse(localStorage.getItem('typingTestHistory') || '[]');
    history.unshift(result);
    localStorage.setItem('typingTestHistory', JSON.stringify(history.slice(0, 50)));
    toast.success('Result saved to history!');
  };

  const blobToDataUrl = (blob: Blob) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read QR image'));
    reader.readAsDataURL(blob);
  });

  const downloadDataUrl = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateShareCard = async () => {
    const width = 1200;
    const height = 630;
    const canvas = document.createElement('canvas');
    const scale = window.devicePixelRatio || 1;
    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      toast.error('Unable to generate share card. Please try again.');
      return;
    }
    ctx.scale(scale, scale);

    const themes = {
      teal: { bg1: '#0f172a', bg2: '#0b3b46', accent: '#22d3ee' },
      purple: { bg1: '#0b1020', bg2: '#2b0f4a', accent: '#a78bfa' },
      gold: { bg1: '#1a1205', bg2: '#3b2a0c', accent: '#fbbf24' }
    } as const;

    const theme = themes[shareTheme];

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, theme.bg1);
    gradient.addColorStop(1, theme.bg2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Accent glow
    ctx.fillStyle = `${theme.accent}22`;
    ctx.beginPath();
    ctx.arc(980, 120, 140, 0, Math.PI * 2);
    ctx.fill();

    const shareUrl = 'http://onlinetypingtest.in/';

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 44px Segoe UI, Arial, sans-serif';
    ctx.fillText('Typing Performance', 70, 110);

    // Name
    ctx.fillStyle = theme.accent;
    ctx.font = '700 40px Segoe UI, Arial, sans-serif';
    ctx.fillText(shareName || 'Your Result', 70, 170);

    // Stats
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 28px Segoe UI, Arial, sans-serif';
    ctx.fillText(`WPM: ${result.wpm}`, 70, 260);
    ctx.fillText(`Accuracy: ${result.accuracy}%`, 70, 310);
    ctx.fillText(`Errors: ${result.errors}`, 70, 360);
    ctx.fillText(`Time: ${result.timeTaken}s`, 70, 410);

    // Badge
    ctx.fillStyle = `${theme.accent}33`;
    ctx.fillRect(70, 450, 320, 60);
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 22px Segoe UI, Arial, sans-serif';
    ctx.fillText('onlinetypingtest.in', 90, 488);

    // QR
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(shareUrl)}`;
      const qrImage = new Image();
      qrImage.crossOrigin = 'anonymous';
      const qrLoaded = new Promise<void>((resolve, reject) => {
        qrImage.onload = () => resolve();
        qrImage.onerror = () => reject(new Error('QR load failed'));
      });
      qrImage.src = qrUrl;
      await qrLoaded;
      ctx.drawImage(qrImage, 980, 420, 140, 140);
    } catch {
      // ignore QR errors
    }

    // Footer
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 18px Segoe UI, Arial, sans-serif';
    ctx.fillText('Share your speed • Keep practicing daily', 70, 570);

    canvas.toBlob((blob) => {
      if (!blob) {
        const dataUrl = canvas.toDataURL('image/png');
        downloadDataUrl(dataUrl, `Typing_Share_Card_${result.wpm}WPM.png`);
        toast.success('Share card generated.');
        return;
      }
      const url = URL.createObjectURL(blob);
      downloadDataUrl(url, `Typing_Share_Card_${result.wpm}WPM.png`);
      URL.revokeObjectURL(url);
      toast.success('Share card generated.');
    }, 'image/png');
  };

  const handleDownloadCertificate = async () => {
    const name = certificateName.trim();
    if (!name) {
      toast.error('Please enter your name to download the certificate.');
      return;
    }

    const wpm = result.wpm;
    const accuracy = result.accuracy;
    const date = new Date(result.date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    let level = 'Beginner';
    if (wpm >= 65) level = 'Typing Master';
    else if (wpm >= 46) level = 'Professional';
    else if (wpm >= 36) level = 'Skilled';
    else if (wpm >= 26) level = 'Average';

    const verifyParams = new URLSearchParams({
      name,
      wpm: String(wpm),
      accuracy: String(accuracy),
      date,
      level
    });
    const verifyURL = `https://onlinetypingtest.in/?${verifyParams.toString()}`;

    const qrResponse = await fetch(
      `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(verifyURL)}`
    );
    const qrBlob = await qrResponse.blob();
    const qrDataUrl = await blobToDataUrl(qrBlob);

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const theme = level === 'Typing Master'
      ? {
          background: [255, 249, 232] as const,
          border: [194, 148, 58] as const,
          title: [143, 96, 30] as const,
          name: [120, 70, 18] as const,
          body: [110, 95, 70] as const,
          watermark: [230, 214, 178] as const,
          seal: [212, 175, 55] as const,
          footer: [143, 96, 30] as const,
          text: [0, 0, 0] as const
        }
      : level === 'Professional'
      ? {
          background: [244, 238, 255] as const,
          border: [118, 90, 168] as const,
          title: [94, 64, 140] as const,
          name: [72, 44, 120] as const,
          body: [96, 84, 115] as const,
          watermark: [210, 198, 232] as const,
          seal: [212, 175, 55] as const,
          footer: [94, 64, 140] as const,
          text: [0, 0, 0] as const
        }
      : level === 'Skilled'
      ? {
          background: [238, 252, 240] as const,
          border: [66, 148, 90] as const,
          title: [44, 120, 70] as const,
          name: [34, 100, 60] as const,
          body: [80, 100, 90] as const,
          watermark: [200, 228, 210] as const,
          seal: [52, 166, 86] as const,
          footer: [44, 120, 70] as const,
          text: [0, 0, 0] as const
        }
      : level === 'Average'
      ? {
          background: [235, 245, 255] as const,
          border: [60, 118, 200] as const,
          title: [35, 90, 170] as const,
          name: [20, 70, 140] as const,
          body: [80, 100, 120] as const,
          watermark: [200, 220, 245] as const,
          seal: [60, 118, 200] as const,
          footer: [35, 90, 170] as const,
          text: [0, 0, 0] as const
        }
      : {
          background: [242, 242, 242] as const,
          border: [130, 130, 130] as const,
          title: [90, 90, 90] as const,
          name: [70, 70, 70] as const,
          body: [95, 95, 95] as const,
          watermark: [210, 210, 210] as const,
          seal: [160, 160, 160] as const,
          footer: [90, 90, 90] as const,
          text: [0, 0, 0] as const
        };

    // Background
    doc.setFillColor(...theme.background);
    doc.rect(0, 0, 210, 297, 'F');

    // Border
    doc.setDrawColor(...theme.border);
    doc.setLineWidth(3);
    doc.rect(10, 10, 190, 277);
    doc.setLineWidth(1);
    doc.rect(14, 14, 182, 269);

    // Watermark
    doc.setTextColor(...theme.watermark);
    doc.setFontSize(48);
    doc.text('onlinetypingtest.in', 105, 180, { angle: 28, align: 'center' });

    // Title
    doc.setTextColor(...theme.title);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(34);
    doc.text('CERTIFICATE', 105, 55, { align: 'center' });
    doc.setFontSize(18);
    doc.text('OF ACHIEVEMENT', 105, 70, { align: 'center' });

    // Presented to
    doc.setFontSize(16);
    doc.setTextColor(...theme.text);
    doc.setFont('helvetica', 'normal');
    doc.text('Proudly Presented To', 105, 95, { align: 'center' });

    // Name
    doc.setFontSize(30);
    doc.setTextColor(...theme.name);
    doc.setFont('helvetica', 'bold');
    doc.text(name, 105, 115, { align: 'center' });

    // Description
    doc.setFontSize(14);
    doc.setTextColor(...theme.body);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'For successfully completing the typing test with excellent performance.',
      105,
      135,
      { align: 'center', maxWidth: 160 }
    );

    // Stats
    doc.setFontSize(16);
    doc.setTextColor(...theme.text);
    doc.text(`Typing Speed: ${wpm} WPM`, 105, 155, { align: 'center' });
    doc.text(`Accuracy: ${accuracy}%`, 105, 168, { align: 'center' });
    doc.text(`Level: ${level}`, 105, 181, { align: 'center' });
    doc.text(`Date: ${date}`, 105, 194, { align: 'center' });

    // QR
    doc.addImage(qrDataUrl, 'PNG', 80, 205, 50, 50);

    // Signature lines
    doc.setDrawColor(...theme.text);
    doc.line(30, 250, 80, 250);
    doc.line(130, 250, 180, 250);
    doc.setFontSize(11);
    doc.text('Authorized Signature', 55, 257, { align: 'center' });
    doc.text('Official Stamp', 155, 257, { align: 'center' });

    // Gold seal
    doc.setFillColor(...theme.seal);
    doc.circle(175, 85, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('SEAL', 175, 87, { align: 'center' });

    // Footer
    doc.setTextColor(...theme.footer);
    doc.setFontSize(12);
    doc.text('www.onlinetypingtest.in', 105, 275, { align: 'center' });

    doc.save(`Typing_Certificate_${name.replace(/\s+/g, '_')}.pdf`);

    toast.success('Certificate downloaded successfully!');
    setIsCertificateOpen(false);
    setCertificateName('');
  };

  return (
    <div className="animate-slide-up mt-6 sm:mt-10 p-6 sm:p-8 md:p-10 bg-black/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 max-w-5xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl mb-6">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500" />
      </div>
      
      <div className="mb-8 text-center">
        <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 text-3xl font-bold flex items-center justify-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-400" /> Test Results
        </h2>
      </div>
      
      {motivation && (
        <div className="bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border-2 border-emerald-400/30 rounded-2xl p-6 mb-8 text-center shadow-lg backdrop-blur-sm">
          <span className="text-5xl block mb-3">{motivation.emoji}</span>
          <p className="text-lg font-semibold text-white">{motivation.text}</p>
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mb-8 text-center">
        <div className="stat-card bg-black/60 border-2 border-emerald-400/40 backdrop-blur-sm hover:shadow-xl hover:shadow-emerald-500/30 hover:border-emerald-400/60 transition-all">
          <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-400 block mb-2">{result.wpm}</span>
          <span className="text-xs sm:text-sm uppercase tracking-wide text-white/80 font-medium">Words Per Minute</span>
        </div>
        <div className="stat-card bg-black/60 border-2 border-cyan-400/40 backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-500/30 hover:border-cyan-400/60 transition-all">
          <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-400 block mb-2">{result.accuracy}%</span>
          <span className="text-xs sm:text-sm uppercase tracking-wide text-white/80 font-medium">Accuracy</span>
        </div>
        <div className="stat-card bg-black/60 border-2 border-blue-400/40 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/30 hover:border-blue-400/60 transition-all">
          <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-400 block mb-2">{result.errors}</span>
          <span className="text-xs sm:text-sm uppercase tracking-wide text-white/80 font-medium">Total Errors</span>
        </div>
        <div className="stat-card bg-black/60 border-2 border-purple-400/40 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/30 hover:border-purple-400/60 transition-all">
          <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-400 block mb-2">{result.timeTaken}s</span>
          <span className="text-xs sm:text-sm uppercase tracking-wide text-white/80 font-medium">Time Taken</span>
        </div>
      </div>
      
      <div className="mb-8 text-center bg-black/60 rounded-xl p-6 border-2 border-white/10">
        <h3 className="text-lg font-semibold mb-3 text-white">Performance Analysis</h3>
        <p className="text-white/90 text-base leading-relaxed max-w-3xl mx-auto">
          {getPerformanceFeedback()}
          {result.accuracy < 90 && ' Focus on accuracy before speed.'}
        </p>
      </div>

      {/* Error Analysis Section */}
      {promptText && inputValue && (
        <ErrorAnalysis 
          promptText={promptText}
          inputValue={inputValue}
          result={result}
        />
      )}
      
      <div className="flex flex-wrap gap-4 justify-center mt-8">
        <button 
          onClick={onNewTest}
          className="flex items-center justify-center gap-3 px-6 py-3 gradient-bg text-primary-foreground rounded-xl font-semibold hover:-translate-y-1 hover:shadow-lg transition-all"
        >
          <PlusCircle className="w-5 h-5" /> Start New Test
        </button>
        <button 
          onClick={handleShare}
          className="flex items-center justify-center gap-3 px-6 py-3 bg-muted text-foreground rounded-xl font-semibold hover:-translate-y-1 hover:shadow-md transition-all"
        >
          <Share2 className="w-5 h-5" /> Share
        </button>
        <button 
          onClick={() => setIsShareCardOpen(true)}
          className="flex items-center justify-center gap-3 px-6 py-3 bg-muted text-foreground rounded-xl font-semibold hover:-translate-y-1 hover:shadow-md transition-all"
        >
          <Share2 className="w-5 h-5" /> Share Card
        </button>
        <button 
          onClick={handleSave}
          className="flex items-center justify-center gap-3 px-6 py-3 bg-muted text-foreground rounded-xl font-semibold hover:-translate-y-1 hover:shadow-md transition-all"
        >
          <Save className="w-5 h-5" /> Save
        </button>
        <button 
          onClick={() => setIsCertificateOpen(true)}
          className="flex items-center justify-center gap-3 px-6 py-3 bg-muted text-foreground rounded-xl font-semibold hover:-translate-y-1 hover:shadow-md transition-all"
        >
          <Download className="w-5 h-5" /> Download Certificate
        </button>
      </div>

      {isCertificateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-background w-full max-w-md rounded-2xl border border-border p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Download Certificate</h3>
            <p className="text-sm text-muted-foreground mb-4">Enter your name to generate your certificate.</p>
            <input
              type="text"
              value={certificateName}
              onChange={(e) => setCertificateName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="words"
              spellCheck={false}
            />
            <div className="flex gap-3 justify-end mt-5">
              <button
                onClick={() => {
                  setIsCertificateOpen(false);
                  setCertificateName('');
                }}
                className="px-4 py-2 rounded-lg bg-muted text-foreground hover:bg-muted/80"
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadCertificate}
                disabled={!certificateName.trim()}
                className="px-4 py-2 rounded-lg gradient-bg text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Download Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {isShareCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-background w-full max-w-2xl rounded-2xl border border-border p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Share Card</h3>
              <button
                onClick={() => setIsShareCardOpen(false)}
                className="px-3 py-1 rounded-lg bg-muted text-foreground hover:bg-muted/80"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_260px]">
              <div className={`rounded-2xl p-5 border border-border animate-pulse ${
                shareTheme === 'teal'
                  ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-900'
                  : shareTheme === 'purple'
                  ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900'
                  : 'bg-gradient-to-br from-slate-900 via-slate-900 to-amber-900'
              }`}>
                <div className="text-sm text-muted-foreground">Typing Performance</div>
                <div className="text-2xl font-bold mt-1 text-white">{shareName || 'Your Result'}</div>
                <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                  <div className="rounded-xl bg-black/30 p-3">
                    <div className="text-muted-foreground">WPM</div>
                    <div className="text-xl font-bold text-white">{result.wpm}</div>
                  </div>
                  <div className="rounded-xl bg-black/30 p-3">
                    <div className="text-muted-foreground">Accuracy</div>
                    <div className="text-xl font-bold text-white">{result.accuracy}%</div>
                  </div>
                  <div className="rounded-xl bg-black/30 p-3">
                    <div className="text-muted-foreground">Errors</div>
                    <div className="text-xl font-bold text-white">{result.errors}</div>
                  </div>
                  <div className="rounded-xl bg-black/30 p-3">
                    <div className="text-muted-foreground">Time</div>
                    <div className="text-xl font-bold text-white">{result.timeTaken}s</div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-white/70">onlinetypingtest.in</div>
                <div className="mt-3 flex items-center gap-3">
                  <a
                    href="http://onlinetypingtest.in/"
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                  >
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=http%3A%2F%2Fonlinetypingtest.in%2F"
                      alt="QR Code"
                      className="w-20 h-20 rounded-md bg-white p-1"
                    />
                  </a>
                  <a
                    href="http://onlinetypingtest.in/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-cyan-300 underline"
                  >
                    http://onlinetypingtest.in/
                  </a>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={shareName}
                  onChange={(e) => setShareName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-3 py-2 rounded-lg bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/40"
                />

                <label className="text-sm font-medium">Theme</label>
                <select
                  value={shareTheme}
                  onChange={(e) => setShareTheme(e.target.value as 'teal' | 'purple' | 'gold')}
                  className="w-full px-3 py-2 rounded-lg bg-muted text-foreground border border-border"
                >
                  <option value="teal">Teal</option>
                  <option value="purple">Purple</option>
                  <option value="gold">Gold</option>
                </select>

                <button
                  onClick={generateShareCard}
                  className="w-full px-4 py-2 rounded-lg gradient-bg text-primary-foreground font-semibold"
                >
                  Download PNG
                </button>

                <button
                  onClick={() => navigator.clipboard.writeText('http://onlinetypingtest.in/')}
                  className="w-full px-4 py-2 rounded-lg bg-muted text-foreground font-semibold"
                >
                  Copy Link
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent('Check my typing results: http://onlinetypingtest.in/')}`, '_blank')}
                    className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check my typing results: http://onlinetypingtest.in/')}`, '_blank')}
                    className="px-3 py-2 rounded-lg bg-blue-500 text-white text-sm font-semibold"
                  >
                    Twitter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
