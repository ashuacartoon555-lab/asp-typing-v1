# 🚀 Online Typing Test - Centered Text Studio

> **Professional typing speed and accuracy testing platform with multi-language support, multiple test modes, and gamification features.**

[![Live Demo](https://img.shields.io/badge/demo-online-brightgreen)](https://onlinetypingtest.in/)
[![Build Status](https://img.shields.io/badge/build-passing-success)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)]()
[![React](https://img.shields.io/badge/React-18-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

---

## 🌟 Features

### ⏱️ Flexible Time Durations
Choose from **9 different test durations**:
- Quick Tests: 5s, 6s, 7s, 9s, 10s
- Standard: 15s, 30s
- Extended: 1 minute (60s), 2 minutes (120s)

### 🎯 Multiple Test Modes
**6 specialized typing modes** for different practice needs:
- **Words**: Random words for speed building
- **Sentences**: Natural sentence structure for flow
- **Paragraph**: Realistic typing scenarios
- **Numbers**: Numerical typing practice
- **Quotes**: Inspirational quotes (API-powered)
- **Programming**: Real code snippets for developers (JavaScript/React/TypeScript)

### 🌐 Multi-Language Support
Practice in **3 different languages**:
- 🇬🇧 **English**: 100+ words across 3 difficulty levels
- 🇮🇳 **हिंदी (Hindi)**: Complete Devanagari script support
- 🌐 **Hinglish**: Mix of Hindi and English

### 📊 Difficulty Levels
- **Easy**: Common words, perfect for beginners
- **Medium**: Technical terms, intermediate practice
- **Hard**: Complex words, advanced challenge
- **Custom**: Use your own text (min. 20 characters)

### ✨ Advanced Features
- ⚡ **Auto-Focus**: Start typing immediately, no clicking needed
- 📜 **Smooth Auto-Scroll**: Text scrolls automatically as you type
- 🎨 **Real-time Feedback**: See errors highlighted instantly
- 📈 **Live Statistics**: WPM, accuracy, and error counter
- 💾 **Export Results**: Download results as JSON
- 📱 **Fully Responsive**: Works perfectly on all devices
- 🎮 **Keyboard Shortcuts**: Quick controls (Ctrl+Enter, ESC)
- 🌈 **10+ Themes**: Including eye-care, focus mode, exam mode
- 🔊 **Sound Effects**: Customizable audio feedback
- 🏆 **Gamification**: Daily challenges, achievements, streak tracking

---

## 🎮 Additional Features

### Games Section
- **Word Master**: Word matching game
- **Speed Racer**: Time-based typing race
- **Keyboard Warrior**: Combat-style typing
- **Quote Quest**: Quote-based challenge
- **Word Rain**: Falling words game
- **Code Typer**: Programming challenge

### Learning Tools
- **Tutorial Mode**: Step-by-step typing lessons
- **Keyboard Heatmap**: Visualize your typing patterns
- **Error Analysis**: Detailed mistake tracking
- **Mistake Replay**: Review your errors
- **Progress Dashboard**: Track improvements over time

### Exam Mode
- **Structured Tests**: Timed exam simulation
- **Certificate Generation**: PDF certificates for completed exams
- **Score Tracking**: Performance history

---

## 📦 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: TailwindCSS + Custom CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React Context API
- **Icons**: Lucide React
- **Sound**: Web Audio API
- **PDF Generation**: jsPDF (for certificates)
- **Routing**: React Router 6
- **Date Handling**: date-fns

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd centered-text-studio

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080/`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

---
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## 📖 Documentation

- **[NEW_FEATURES_SUMMARY.md](./NEW_FEATURES_SUMMARY.md)**: Complete overview of all new features
- **[QUICK_START_GUIDE.md](./QUICK_START_GUIDE.md)**: Step-by-step guide for users
- **[ADVANCED_FEATURES_GUIDE.md](./ADVANCED_FEATURES_GUIDE.md)**: Advanced sound settings and error tracking
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)**: Technical implementation details

---

## 🎯 Usage Examples

### Basic Typing Test
```typescript
// User visits https://onlinetypingtest.in/
// Cursor auto-focuses in typing area
// Select: 15s duration, Words mode, English, Easy difficulty
// Click "Start Test" or press Ctrl+Enter
// Start typing - text scrolls automatically
// View results: WPM, Accuracy, Errors, Time
```

### Programming Practice
```typescript
// Select: 60s, Programming mode, English, Medium
// Practice with real code snippets:
// - Function declarations
// - React components
// - TypeScript interfaces
// - Array methods
// Perfect for developers preparing for interviews
```

### Multilingual Practice
```typescript
// Hindi: 30s, Sentences, हिंदी, Easy
// Hinglish: 30s, Paragraph, Hinglish, Medium
// Compare your WPM across languages
```

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── typing/          # Main typing test components
│   │   ├── TypingArea.tsx
│   │   ├── Options.tsx
│   │   ├── ResultDisplay.tsx
│   │   └── ...
│   ├── games/           # Game components
│   ├── exam/            # Exam mode components
│   ├── ui/              # Reusable UI components (shadcn)
│   ├── ErrorVisualizer.tsx
│   ├── KeyboardHeatmap.tsx
│   └── ...
├── hooks/
│   ├── useTypingTest.ts    # Core typing test logic
│   ├── useCodeTyperGame.ts
│   └── ...
├── contexts/
│   ├── ThemeContext.tsx    # Theme management
│   └── SoundContext.tsx    # Sound effects
├── data/
│   ├── wordBanks.ts        # All word banks & content
│   └── examData.ts         # Exam questions
├── pages/
│   ├── Index.tsx           # Main typing test page
│   ├── Games.tsx           # Games collection
│   └── ...
└── lib/
    └── utils.ts            # Utility functions
```

---

## 🎨 Themes

10+ beautiful themes included:
- Smart (Auto light/dark)
- Exam Light & Dark
- Eye Care
- Focus Practice
- Focus Game
- High Contrast
- Warm & Cool
- And more!

---

## 🔧 Configuration

### Custom Text
Users can provide their own text (minimum 20 characters) using the Custom difficulty option.

### Sound Settings
- 3 intensity modes: Relaxed, Focus, Silent
- 4 error sound profiles: Classic, Sci-Fi, Gentle, Gaming
- Individual sound toggles for errors, start, end, keypress
- Volume control (0-100%)

### Keyboard Shortcuts
- `Ctrl + Enter`: Start/Finish test
- `Esc`: Reset test
- Auto-focus enabled for seamless typing

---

## 📊 Data & Privacy

- **Local Storage Only**: All data stored locally in browser
- **No Backend**: No user data sent to servers
- **No Tracking**: No analytics or tracking scripts
- **Export Anytime**: Download your data as JSON
- **Privacy First**: Your typing data stays on your device

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🌐 Live Demo

Visit **[https://onlinetypingtest.in/](https://onlinetypingtest.in/)** to try it out!

---

**Made with ❤️ for typists worldwide**
# asp-typing-v1
# asp-typing-v1
# asp-typing-v1
