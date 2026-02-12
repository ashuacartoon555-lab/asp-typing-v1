import { Download, Palette, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export interface ShareCardData {
  type: 'challenge' | 'analytics';
  // Challenge data
  targetWPM?: number;
  difficulty?: string;
  textPreview?: string;
  textLength?: number;
  // Analytics data
  wpm?: number;
  accuracy?: number;
  tests?: number;
  bestWPM?: number;
  totalWords?: number;
  // Common
  title: string;
  subtitle?: string;
  link?: string;
}

interface ShareCardGeneratorProps {
  data: ShareCardData;
  onClose: () => void;
}

type ThemeType = 'gradient-blue' | 'gradient-purple' | 'neon-cyan' | 'sunset-orange' | 'forest-green' | 'royal-gold';
type LayoutType = 'modern' | 'classic' | 'minimal' | 'bold' | 'elegant' | 'playful';

const themes = {
  'gradient-blue': {
    name: '💠 Gradient Blue',
    bg: 'from-blue-900 via-blue-800 to-cyan-900',
    border: '#3b82f6',
    primary: '#60a5fa',
    secondary: '#93c5fd',
    accent: '#22d3ee',
  },
  'gradient-purple': {
    name: '💜 Gradient Purple',
    bg: 'from-purple-900 via-fuchsia-900 to-pink-900',
    border: '#a855f7',
    primary: '#c084fc',
    secondary: '#e879f9',
    accent: '#f0abfc',
  },
  'neon-cyan': {
    name: '⚡ Neon Cyan',
    bg: 'from-slate-900 via-cyan-950 to-slate-900',
    border: '#06b6d4',
    primary: '#22d3ee',
    secondary: '#67e8f9',
    accent: '#a5f3fc',
  },
  'sunset-orange': {
    name: '🌅 Sunset Orange',
    bg: 'from-orange-900 via-red-900 to-amber-900',
    border: '#f97316',
    primary: '#fb923c',
    secondary: '#fbbf24',
    accent: '#fde047',
  },
  'forest-green': {
    name: '🌲 Forest Green',
    bg: 'from-emerald-900 via-green-900 to-teal-900',
    border: '#10b981',
    primary: '#34d399',
    secondary: '#6ee7b7',
    accent: '#5eead4',
  },
  'royal-gold': {
    name: '👑 Royal Gold',
    bg: 'from-yellow-900 via-amber-900 to-orange-900',
    border: '#f59e0b',
    primary: '#fbbf24',
    secondary: '#fcd34d',
    accent: '#fde68a',
  },
};

const layouts = {
  modern: { name: '🎨 Modern', icon: '🎨' },
  classic: { name: '📜 Classic', icon: '📜' },
  minimal: { name: '✨ Minimal', icon: '✨' },
  bold: { name: '💥 Bold', icon: '💥' },
  elegant: { name: '🎭 Elegant', icon: '🎭' },
  playful: { name: '🎉 Playful', icon: '🎉' },
};

const ShareCardGenerator = ({ data, onClose }: ShareCardGeneratorProps) => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>('gradient-blue');
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>('modern');

  const theme = themes[selectedTheme];

  const generateCard = async () => {
    const width = 1200;
    const height = 630;
    const canvas = document.createElement('canvas');
    const scale = window.devicePixelRatio || 1;
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(scale, scale);

    // Background gradient (convert Tailwind classes to colors)
    const gradients: Record<typeof selectedTheme, string[]> = {
      'gradient-blue': ['#1e3a8a', '#1e40af', '#164e63'],
      'gradient-purple': ['#581c87', '#701a75', '#831843'],
      'neon-cyan': ['#0f172a', '#083344', '#0f172a'],
      'sunset-orange': ['#7c2d12', '#7f1d1d', '#78350f'],
      'forest-green': ['#064e3b', '#14532d', '#134e4a'],
      'royal-gold': ['#713f12', '#78350f', '#7c2d12'],
    };

    const colors = gradients[selectedTheme];
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Border based on layout
    if (selectedLayout === 'modern' || selectedLayout === 'bold') {
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = selectedLayout === 'bold' ? 12 : 6;
      ctx.strokeRect(20, 20, width - 40, height - 40);
    } else if (selectedLayout === 'elegant') {
      // Double border
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 3;
      ctx.strokeRect(20, 20, width - 40, height - 40);
      ctx.strokeRect(30, 30, width - 60, height - 60);
    } else if (selectedLayout === 'playful') {
      // Rounded corners effect with arcs
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 8;
      ctx.setLineDash([20, 10]);
      ctx.strokeRect(20, 20, width - 40, height - 40);
      ctx.setLineDash([]);
    }

    // Watermark
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(-Math.PI / 8);
    ctx.font = 'bold 80px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.textAlign = 'center';
    ctx.fillText('onlinetypingtest.in', 0, 0);
    ctx.restore();

    // Content based on type and layout
    if (data.type === 'challenge') {
      renderChallengeContent(ctx, width, height, data, theme, selectedLayout);
    } else {
      renderAnalyticsContent(ctx, width, height, data, theme, selectedLayout);
    }

    // QR Code
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(data.link || 'https://onlinetypingtest.in')}`;
      const qrImage = new Image();
      qrImage.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        qrImage.onload = () => {
          ctx.drawImage(qrImage, width - 200, height - 200, 140, 140);
          resolve();
        };
        qrImage.onerror = () => resolve(); // Continue without QR
        qrImage.src = qrUrl;
        setTimeout(() => resolve(), 2000); // Timeout after 2s
      });
    } catch (error) {
      console.log('QR code generation skipped');
    }

    // Download
    canvas.toBlob((blob) => {
      if (!blob) {
        const dataUrl = canvas.toDataURL('image/png');
        downloadFile(dataUrl, `${data.type}_${selectedTheme}_${selectedLayout}.png`);
        return;
      }
      const url = URL.createObjectURL(blob);
      downloadFile(url, `${data.type}_${selectedTheme}_${selectedLayout}.png`);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const renderChallengeContent = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    data: ShareCardData,
    theme: typeof themes[ThemeType],
    layout: LayoutType
  ) => {
    const leftMargin = layout === 'minimal' ? 80 : 60;
    let y = layout === 'bold' ? 100 : 80;

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = layout === 'bold' ? 'bold 56px Arial' : layout === 'elegant' ? 'italic bold 50px Georgia' : 'bold 48px Arial';
    ctx.fillText(data.title, leftMargin, y);
    y += layout === 'bold' ? 70 : 60;

    // Subtitle
    if (data.subtitle) {
      ctx.fillStyle = theme.secondary;
      ctx.font = layout === 'minimal' ? '28px Arial' : '32px Arial';
      ctx.fillText(data.subtitle, leftMargin, y);
      y += 50;
    }

    // Challenge details
    y += 30;
    ctx.fillStyle = theme.primary;
    ctx.font = layout === 'bold' ? 'bold 42px Arial' : 'bold 38px Arial';
    ctx.fillText(`🎯 Target: ${data.targetWPM} WPM`, leftMargin, y);
    y += 60;

    ctx.fillStyle = theme.accent;
    ctx.font = '32px Arial';
    ctx.fillText(`📊 Difficulty: ${data.difficulty || 'Medium'}`, leftMargin, y);
    y += 50;

    ctx.fillText(`📝 Length: ${data.textLength || 0} chars`, leftMargin, y);
    y += 70;

    // Preview text
    if (data.textPreview && layout !== 'minimal') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '22px Arial';
      const preview = data.textPreview.slice(0, 80) + (data.textPreview.length > 80 ? '...' : '');
      wrapText(ctx, `"${preview}"`, leftMargin, y, width - 300, 32);
    }

    // Footer
    ctx.fillStyle = theme.primary;
    ctx.font = layout === 'elegant' ? 'italic 26px Georgia' : 'bold 28px Arial';
    ctx.fillText('onlinetypingtest.in', leftMargin, height - 50);
  };

  const renderAnalyticsContent = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    data: ShareCardData,
    theme: typeof themes[ThemeType],
    layout: LayoutType
  ) => {
    const leftMargin = layout === 'minimal' ? 80 : 60;
    let y = layout === 'bold' ? 100 : 80;

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = layout === 'bold' ? 'bold 56px Arial' : layout === 'elegant' ? 'italic bold 50px Georgia' : 'bold 48px Arial';
    ctx.fillText(data.title, leftMargin, y);
    y += 80;

    // Stats grid
    const statY = y;
    const statWidth = 280;
    const statHeight = 120;
    const gap = 30;

    // Stat 1: WPM
    if (data.wpm !== undefined) {
      drawStatBox(ctx, leftMargin, statY, statWidth, statHeight, theme.border, layout);
      ctx.fillStyle = theme.primary;
      ctx.font = 'bold 52px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${data.wpm}`, leftMargin + statWidth / 2, statY + 65);
      ctx.font = '22px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('WPM', leftMargin + statWidth / 2, statY + 95);
      ctx.textAlign = 'left';
    }

    // Stat 2: Accuracy
    if (data.accuracy !== undefined) {
      const x2 = leftMargin + statWidth + gap;
      drawStatBox(ctx, x2, statY, statWidth, statHeight, theme.border, layout);
      ctx.fillStyle = theme.accent;
      ctx.font = 'bold 52px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${data.accuracy}%`, x2 + statWidth / 2, statY + 65);
      ctx.font = '22px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Accuracy', x2 + statWidth / 2, statY + 95);
      ctx.textAlign = 'left';
    }

    // Stat 3: Tests/Best
    if (data.tests !== undefined || data.bestWPM !== undefined) {
      const x3 = leftMargin + (statWidth + gap) * 2;
      drawStatBox(ctx, x3, statY, statWidth, statHeight, theme.border, layout);
      ctx.fillStyle = theme.secondary;
      ctx.font = 'bold 52px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${data.bestWPM || data.tests}`, x3 + statWidth / 2, statY + 65);
      ctx.font = '22px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(data.bestWPM ? 'Best WPM' : 'Tests', x3 + statWidth / 2, statY + 95);
      ctx.textAlign = 'left';
    }

    // Additional info
    y = statY + statHeight + 60;
    if (data.totalWords !== undefined) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '28px Arial';
      ctx.fillText(`📚 Total Words Typed: ${data.totalWords.toLocaleString()}`, leftMargin, y);
    }

    // Footer
    ctx.fillStyle = theme.primary;
    ctx.font = layout === 'elegant' ? 'italic 26px Georgia' : 'bold 28px Arial';
    ctx.fillText('onlinetypingtest.in', leftMargin, height - 50);
  };

  const drawStatBox = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    borderColor: string,
    layout: LayoutType
  ) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = layout === 'bold' ? 4 : 2;
    ctx.strokeRect(x, y, w, h);
  };

  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, x, currentY);
        line = words[i] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  };

  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Generate Share Card</h2>
            <p className="text-slate-400 text-sm">Customize your share card with themes and layouts</p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Theme Selection */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-400" />
              Choose Theme
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(Object.keys(themes) as ThemeType[]).map((themeKey) => {
                const t = themes[themeKey];
                return (
                  <button
                    key={themeKey}
                    onClick={() => setSelectedTheme(themeKey)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedTheme === themeKey
                        ? 'border-white scale-105 shadow-lg'
                        : 'border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div className={`h-20 rounded-lg bg-gradient-to-r ${t.bg} mb-2`}></div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Layout Selection */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Choose Layout</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(Object.keys(layouts) as LayoutType[]).map((layoutKey) => {
                const l = layouts[layoutKey];
                return (
                  <button
                    key={layoutKey}
                    onClick={() => setSelectedLayout(layoutKey)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedLayout === layoutKey
                        ? 'border-cyan-400 bg-cyan-500/10'
                        : 'border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-3xl mb-2">{l.icon}</div>
                    <p className="text-sm font-semibold text-white">{l.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Preview</h3>
            <div className={`relative rounded-xl bg-gradient-to-r ${theme.bg} p-8 border-2`} style={{ borderColor: theme.border }}>
              <div className="text-white space-y-4">
                <h4 className="text-2xl font-bold">{data.title}</h4>
                {data.type === 'challenge' ? (
                  <div className="space-y-2">
                    <p className="text-xl">🎯 Target: {data.targetWPM} WPM</p>
                    <p className="text-lg opacity-80">📊 {data.difficulty}</p>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <div className="bg-black/30 rounded-lg p-3 border" style={{ borderColor: theme.border }}>
                      <p className="text-3xl font-bold" style={{ color: theme.primary }}>{data.wpm}</p>
                      <p className="text-sm">WPM</p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-3 border" style={{ borderColor: theme.border }}>
                      <p className="text-3xl font-bold" style={{ color: theme.accent }}>{data.accuracy}%</p>
                      <p className="text-sm">Accuracy</p>
                    </div>
                  </div>
                )}
                <p className="text-sm opacity-60">onlinetypingtest.in watermark • QR code</p>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex gap-3">
            <Button
              onClick={generateCard}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-6 text-lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Share Card
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareCardGenerator;
