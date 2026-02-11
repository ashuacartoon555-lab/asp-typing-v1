import { useState } from 'react';
import Header from '@/components/typing/Header';
import Footer from '@/components/typing/Footer';
import { GraduationCap, FileText, Clock, Award, Users, Building, TrendingUp, BarChart3, Zap, Shield, Target, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExamInterface from '@/components/exam/ExamInterface';
import { ExamType, examPatterns } from '@/data/examData';

const exams: { id: ExamType; title: string; description: string; duration: string; words: string; icon: typeof FileText }[] = [
  {
    id: 'ssc-cgl',
    title: "SSC CGL",
    description: "Staff Selection Commission - Combined Graduate Level typing test pattern",
    duration: "15 minutes",
    words: "35 WPM (typical)",
    icon: FileText
  },
  {
    id: 'ssc-chsl',
    title: "SSC CHSL",
    description: "Combined Higher Secondary Level - Data Entry Operator typing test",
    duration: "15 minutes",
    words: "35 WPM (typical)",
    icon: FileText
  },
  {
    id: 'ibps-clerk',
    title: "IBPS Clerk",
    description: "Institute of Banking Personnel Selection - Clerk typing test",
    duration: "10 minutes",
    words: "30 WPM (typical)",
    icon: Building
  },
  {
    id: 'rrb-ntpc',
    title: "RRB NTPC",
    description: "Railway Recruitment Board - Non Technical Popular Categories",
    duration: "10 minutes",
    words: "30 WPM (typical)",
    icon: Users
  },
  {
    id: 'high-court',
    title: "High Court",
    description: "High Court Stenographer and Typist exam pattern",
    duration: "10 minutes",
    words: "35 WPM (typical)",
    icon: Award
  },
  {
    id: 'cpct',
    title: "CPCT",
    description: "Computer Proficiency Certification Test - MP Online",
    duration: "15 minutes",
    words: "30 WPM (typical)",
    icon: GraduationCap
  }
];

const ExamMode = () => {
  const [selectedExam, setSelectedExam] = useState<ExamType | null>(null);

  if (selectedExam) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-5xl mx-auto px-5 py-6">
          <ExamInterface 
            examType={selectedExam} 
            onBack={() => setSelectedExam(null)} 
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-5xl mx-auto px-3 sm:px-5 py-4 sm:py-6">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text mb-3 sm:mb-4">
            <GraduationCap className="inline w-6 h-6 sm:w-8 sm:h-8 mr-2" />
            Exam Mode
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg">
            Practice with exam-style patterns inspired by SSC, Banking, Railways & more
          </p>
        </div>

        <div className="card-gradient p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border border-border mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-center">
            <div>
              <div className="text-xl sm:text-3xl font-bold text-primary">6</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Exam Patterns</div>
            </div>
            <div className="w-px h-12 bg-border hidden md:block" />
            <div>
              <div className="text-xl sm:text-3xl font-bold text-primary">100%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Exam-Style Patterns</div>
            </div>
            <div className="w-px h-12 bg-border hidden md:block" />
            <div>
              <div className="text-xl sm:text-3xl font-bold text-primary">Practice</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Practice Summary</div>
            </div>
            <div className="w-px h-12 bg-border hidden md:block" />
            <div>
              <div className="text-xl sm:text-3xl font-bold text-primary">Free</div>
              <div className="text-xs sm:text-sm text-muted-foreground">No Registration</div>
            </div>
            <div className="w-px h-12 bg-border hidden md:block" />
            <div>
              <div className="text-xl sm:text-3xl font-bold text-primary">Analytics</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Performance Tracking</div>
            </div>
          </div>
        </div>

        {/* 4 Feature Highlight Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-4 rounded-lg border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-sm">Progress Tracking</span>
            </div>
            <p className="text-xs text-muted-foreground">Monitor your improvement with detailed analytics</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 p-4 rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-sm">Performance Report</span>
            </div>
            <p className="text-xs text-muted-foreground">Get detailed WPM, accuracy & weak areas</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-4 rounded-lg border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-purple-500" />
              <span className="font-semibold text-sm">Speed Insights</span>
            </div>
            <p className="text-xs text-muted-foreground">Real-time WPM & accuracy metrics</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 p-4 rounded-lg border border-orange-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-orange-500" />
              <span className="font-semibold text-sm">Privacy Focused</span>
            </div>
            <p className="text-xs text-muted-foreground">Local-first practice with optional saved progress</p>
          </div>
        </div>

        {/* Smart Customization & Weakness Identification */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 p-6 rounded-3xl border border-cyan-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-cyan-500" />
              <h3 className="text-lg font-bold">🎯 Smart Exam Customization</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Choose exam type (SSC, Banking, Railways, etc.)</li>
              <li>✓ Select difficulty level</li>
              <li>✓ Customize time duration</li>
              <li>✓ Practice specific sections</li>
              <li>✓ Save your exam settings</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-rose-500/10 to-rose-500/5 p-6 rounded-3xl border border-rose-500/20">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-8 h-8 text-rose-500" />
              <h3 className="text-lg font-bold">💡 Weakness Identification</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Identify typing weak areas</li>
              <li>✓ Pinpoint error patterns</li>
              <li>✓ Get targeted practice suggestions</li>
              <li>✓ Track improvement over time</li>
              <li>✓ Focus on problem areas</li>
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div key={exam.id} className="card-gradient p-6 rounded-3xl shadow-lg border border-border hover:shadow-xl transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
                  <exam.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold">{exam.title}</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4">{exam.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Duration: {exam.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>Requirement: {exam.words}</span>
                </div>
              </div>
              <Button 
                className="w-full gradient-bg text-white"
                onClick={() => setSelectedExam(exam.id)}
              >
                Start Practice
              </Button>
            </div>
          ))}
        </div>

        {/* 3 Detailed Feature Sections */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card-gradient p-6 rounded-3xl shadow-lg border border-border">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-500" />
              📊 Performance Analytics
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ WPM tracking per exam</li>
              <li>✓ Accuracy % chart</li>
              <li>✓ Error analysis</li>
              <li>✓ Progress over time</li>
              <li>✓ Personal best tracking</li>
            </ul>
          </div>

          <div className="card-gradient p-6 rounded-3xl shadow-lg border border-border">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              ⚡ Real-time Feedback
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Live WPM calculation</li>
              <li>✓ Accuracy percentage</li>
              <li>✓ Error highlighting</li>
              <li>✓ Timer with warnings</li>
              <li>✓ Instant results</li>
            </ul>
          </div>

          <div className="card-gradient p-6 rounded-3xl shadow-lg border border-border">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-green-500" />
              🏆 Achievement System
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>✓ Practice certificate generation</li>
              <li>✓ Speed badges</li>
              <li>✓ Accuracy milestones</li>
              <li>✓ Exam completion badges</li>
              <li>✓ Streak rewards</li>
            </ul>
          </div>
        </div>

        {/* 4 Unique Exam Features */}
        <div className="card-gradient p-6 rounded-3xl shadow-lg border border-border mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">🎯 Unique Exam Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-background rounded-lg border border-border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">1</span>
                  Accurate Exam Patterns
                </h4>
                <p className="text-sm text-muted-foreground">Follows exact government exam rules, duration, and difficulty levels</p>
              </div>
              <div className="p-4 bg-background rounded-lg border border-border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">2</span>
                  Detailed Performance Report
                </h4>
                <p className="text-sm text-muted-foreground">Get comprehensive analysis of your typing skills with error tracking</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-background rounded-lg border border-border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">3</span>
                  Practice Certificate
                </h4>
                <p className="text-sm text-muted-foreground">Download a practice certificate showing your exam performance and results</p>
              </div>
              <div className="p-4 bg-background rounded-lg border border-border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">4</span>
                  Unlimited Attempts
                </h4>
                <p className="text-sm text-muted-foreground">Practice unlimited exams with full history and improvement tracking</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card-gradient p-6 md:p-8 rounded-3xl shadow-lg border border-border mt-8">
          <h2 className="text-2xl font-bold mb-4 text-center">📋 Exam Preparation Tips</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Before the Exam:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Practice daily for at least 30 minutes</li>
                <li>• Focus on accuracy before speed</li>
                <li>• Learn proper finger placement</li>
                <li>• Take mock tests regularly</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">During the Exam:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Stay calm and focused</li>
                <li>• Don't rush - maintain steady pace</li>
                <li>• Check for errors periodically</li>
                <li>• Use backspace wisely</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ExamMode;
