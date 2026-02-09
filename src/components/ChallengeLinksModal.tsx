import React, { useState } from 'react';
import { storageManager } from '@/lib/storageManager';
import { Copy, Check, Share2 } from 'lucide-react';

const ChallengeLinksModal: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [targetWPM, setTargetWPM] = useState(50);
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const generateChallenge = () => {
    if (!selectedText.trim()) {
      alert('Please enter some text for the challenge!');
      return;
    }

    const link = storageManager.generateChallengeLink(selectedText, difficulty, targetWPM);
    setGeneratedLink(link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToWhatsApp = () => {
    const message = `🎯 Challenge me! Can you beat ${targetWPM} WPM?\n\n${generatedLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareToTwitter = () => {
    const text = `I just created a typing challenge! 🚀 Can you beat ${targetWPM} WPM?\n\n${generatedLink}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const downloadDataUrl = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateChallengeShareCard = async () => {
    const width = 1200;
    const height = 630;
    const canvas = document.createElement('canvas');
    const scale = window.devicePixelRatio || 1;
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(scale, scale);

    // Simple dark background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 44px Segoe UI, Arial, sans-serif';
    ctx.fillText('Typing Challenge', 70, 110);

    ctx.fillStyle = '#22d3ee';
    ctx.font = '700 36px Segoe UI, Arial, sans-serif';
    ctx.fillText(`Target: ${targetWPM} WPM`, 70, 170);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 26px Segoe UI, Arial, sans-serif';
    ctx.fillText(`Difficulty: ${difficulty}`, 70, 230);
    ctx.fillText(`Text Length: ${selectedText.length} chars`, 70, 280);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 20px Segoe UI, Arial, sans-serif';
    const preview = selectedText.trim().slice(0, 120);
    ctx.fillText(`Preview: ${preview}${selectedText.length > 120 ? '…' : ''}`, 70, 340);

    // Website badge
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(70, 450, 420, 60);
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 22px Segoe UI, Arial, sans-serif';
    ctx.fillText('onlinetypingtest.in', 90, 488);

    // QR code
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent('http://onlinetypingtest.in/')}`;
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

    canvas.toBlob((blob) => {
      if (!blob) {
        const dataUrl = canvas.toDataURL('image/png');
        downloadDataUrl(dataUrl, `Typing_Challenge_${targetWPM}WPM.png`);
        return;
      }
      const url = URL.createObjectURL(blob);
      downloadDataUrl(url, `Typing_Challenge_${targetWPM}WPM.png`);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  if (!showModal) {
    return (
      <button
        onClick={() => setShowModal(true)}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105"
      >
        <Share2 className="w-5 h-5" />
        Generate Challenge Link
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700 max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Create Challenge Link</h2>

        {!generatedLink ? (
          <>
            {/* Text Input */}
            <div className="mb-4">
              <label className="block text-slate-300 text-sm font-semibold mb-2">Challenge Text</label>
              <textarea
                value={selectedText}
                onChange={(e) => setSelectedText(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white text-sm h-24 focus:outline-none focus:border-blue-500"
                placeholder="Enter the text users should type..."
              />
              <p className="text-xs text-slate-400 mt-1">{selectedText.length} characters</p>
            </div>

            {/* Difficulty */}
            <div className="mb-4">
              <label className="block text-slate-300 text-sm font-semibold mb-2">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Target WPM */}
            <div className="mb-6">
              <label className="block text-slate-300 text-sm font-semibold mb-2">Target WPM: {targetWPM}</label>
              <input
                type="range"
                min="20"
                max="150"
                value={targetWPM}
                onChange={(e) => setTargetWPM(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={generateChallenge}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
              >
                Generate Link
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 mb-4">
              <p className="text-green-300 text-sm">✅ Challenge link created!</p>
            </div>

            {/* Generated Link */}
            <div className="mb-4">
              <label className="block text-slate-300 text-sm font-semibold mb-2">Share Link</label>
              <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={generatedLink}
                  readOnly
                  className="flex-1 bg-transparent text-white text-sm focus:outline-none truncate"
                />
                <button
                  onClick={copyToClipboard}
                  className="text-slate-400 hover:text-white transition-all"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3">
                <a
                  href={generatedLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-300 underline"
                >
                  {generatedLink}
                </a>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(generatedLink)}`}
                  alt="Challenge QR"
                  className="w-16 h-16 rounded bg-white p-1"
                />
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={shareToWhatsApp}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
              >
                WhatsApp
              </button>
              <button
                onClick={shareToTwitter}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
              >
                Twitter
              </button>
            </div>

            <button
              onClick={generateChallengeShareCard}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm mb-4"
            >
              Download Share Card
            </button>

            {/* Challenge Info */}
            <div className="bg-slate-700/50 rounded-lg p-3 mb-4 text-sm text-slate-300">
              <p className="mb-1"><strong>Difficulty:</strong> {difficulty}</p>
              <p className="mb-1"><strong>Target WPM:</strong> {targetWPM}+</p>
              <p><strong>Text Length:</strong> {selectedText.length} chars</p>
            </div>

            {/* Actions */}
            <button
              onClick={() => {
                setGeneratedLink('');
                setSelectedText('');
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
            >
              Create Another
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ChallengeLinksModal;
