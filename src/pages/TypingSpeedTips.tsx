import Header from '@/components/typing/Header';
import Footer from '@/components/typing/Footer';
import { Link } from 'react-router-dom';
import { Zap, Target, BookOpen, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const tipArticles = [
  {
    path: '/tips/increase-typing-speed',
    title: 'How to Increase Typing Speed',
    description: 'Learn proven techniques to boost your WPM and type faster than ever before.',
    icon: Zap,
    color: 'text-yellow-500'
  },
  {
    path: '/tips/typing-practice-beginners',
    title: 'Typing Practice for Beginners',
    description: 'Start your typing journey with easy-to-follow exercises and tips.',
    icon: BookOpen,
    color: 'text-green-500'
  },
  {
    path: '/tips/ssc-banking-typing-guide',
    title: 'SSC / Banking Typing Test Guide',
    description: 'Complete preparation guide for government exam typing tests.',
    icon: FileText,
    color: 'text-blue-500'
  },
  {
    path: '/tips/english-typing-rules',
    title: 'English Typing Test Rules',
    description: 'Understand the official rules and scoring for English typing tests.',
    icon: CheckCircle,
    color: 'text-purple-500'
  },
  {
    path: '/tips/typing-accuracy-improvement',
    title: 'Typing Accuracy Improvement',
    description: 'Master the art of accurate typing with fewer mistakes.',
    icon: Target,
    color: 'text-red-500'
  }
];

const TypingSpeedTips = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-3 sm:px-5 py-6 sm:py-12">
        <div className="text-center mb-6 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4">Typing Speed Tips</h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Master the art of fast and accurate typing with our comprehensive guides and tips.
            Whether you're a beginner or preparing for exams, we've got you covered!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {tipArticles.map((article) => (
            <Link key={article.path} to={article.path}>
              <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/50">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 ${article.color}`}>
                    <article.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{article.title}</CardTitle>
                  <CardDescription>{article.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-primary font-medium">
                    Read Article <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-8 sm:mt-16 bg-card rounded-xl sm:rounded-2xl p-4 sm:p-8 border">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Why Typing Speed Matters?</h2>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3">For Students</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Complete assignments faster</li>
                <li>• Better performance in computer exams</li>
                <li>• Improved productivity in projects</li>
                <li>• Essential skill for modern education</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">For Job Seekers</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Required for government exams (SSC, Banking)</li>
                <li>• Data entry and office jobs</li>
                <li>• Competitive advantage in interviews</li>
                <li>• Higher salary potential</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TypingSpeedTips;
