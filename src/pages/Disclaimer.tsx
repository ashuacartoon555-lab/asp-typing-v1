import Header from '@/components/typing/Header';
import Footer from '@/components/typing/Footer';
import DynamicBackground from '@/components/DynamicBackground';
import { Mail, Globe, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const Disclaimer = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <DynamicBackground />
      <Header />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        
        {/* Hero Section */}
        <div className="glass p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl mb-8 text-center border border-border shadow-lg">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">
              Disclaimer & Legal Notice
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            Important Information About OnlineTypingTest.in
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            Last Updated: February 2026
          </p>
        </div>

        {/* Introduction */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <p className="text-muted-foreground leading-relaxed">
            Welcome to OnlineTypingTest.in. Please read this disclaimer carefully before using our platform. 
            By accessing and using this website, you acknowledge and accept all terms contained herein.
          </p>
        </div>

        {/* About Section */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-bold gradient-text">About OnlineTypingTest.in</h2>
          </div>
          <div className="space-y-4 text-muted-foreground">
            <p className="leading-relaxed">
              OnlineTypingTest.in is a free online platform created to help students and professionals practice 
              typing and improve their speed (WPM) and accuracy through interactive typing tests and exercises.
            </p>
            <p className="leading-relaxed">
              This website is developed for <strong className="text-foreground">educational and practice purposes only</strong>. 
              We are not affiliated, associated, or endorsed by any government organization, recruitment board, or 
              examination authority such as SSC, IBPS, CPCT, or any other public or private institution.
            </p>
          </div>
        </div>

        {/* Not Official Exam Software */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-bold gradient-text">Not Official Exam Software</h2>
          </div>
          <div className="space-y-4 text-muted-foreground">
            <p className="leading-relaxed">
              The typing test patterns, passages, and evaluation methods available on this website are designed 
              based on common typing standards used in many exams, but they are <strong className="text-foreground">not 
              official exam software</strong>. Practicing here helps you prepare, but actual exam systems, rules, 
              and evaluation methods may differ.
            </p>
            <p className="leading-relaxed">
              The WPM (Words Per Minute) and accuracy results shown after each test are calculated using standard 
              typing formulas to give you an estimate of your performance. Results in real examinations may vary 
              depending on the exam software, system setup, keyboard, and environment.
            </p>
          </div>
        </div>

        {/* Website Availability */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            <h2 className="text-xl sm:text-2xl font-bold gradient-text">Website Availability & Technical Limitations</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We regularly improve our platform to provide a smooth experience. However, temporary interruptions 
            or technical issues may sometimes occur.
          </p>
        </div>

        {/* Content & Intellectual Property */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-4">Content & Intellectual Property</h2>
          <div className="space-y-4 text-muted-foreground">
            <p className="leading-relaxed">
              All typing passages, word lists, practice content, and articles on this website are either:
            </p>
            <ul className="space-y-2 ml-6">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span>Originally created for OnlineTypingTest.in</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span>Properly licensed for use</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span>Sourced from public domain materials for educational purposes</span>
              </li>
            </ul>
            <p className="leading-relaxed">
              If you believe any content on this website violates your rights, please contact us and we will 
              take appropriate action.
            </p>
          </div>
        </div>

        {/* Third-Party Links */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-4">Third-Party Links & External Resources</h2>
          <p className="text-muted-foreground leading-relaxed">
            For additional learning, some pages may include links to third-party websites or resources. We are 
            not responsible for the content, accuracy, or privacy practices of those external websites.
          </p>
        </div>

        {/* Exam Preparation Recommendations */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-4">Exam Preparation Recommendations</h2>
          <div className="space-y-4 text-muted-foreground">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <p className="leading-relaxed">
                <strong className="text-amber-400">⚠️ Important:</strong> Users are advised to always check the 
                official guidelines and practice materials provided by examination authorities for final exam preparation.
              </p>
            </div>
            <p className="leading-relaxed">
              This platform is useful for regular typing practice, but users should also follow official exam 
              guidelines for final preparation.
            </p>
          </div>
        </div>

        {/* User Understanding & Agreement */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-4">User Understanding & Agreement</h2>
          <p className="text-muted-foreground leading-relaxed">
            By using OnlineTypingTest.in, you understand and agree that this platform is meant for practice, 
            learning, and self-improvement only. Your use of this platform indicates your acceptance of all the 
            terms and conditions outlined in this disclaimer.
          </p>
        </div>

        {/* Contact Section */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-4">📞 Contact Us</h2>
          <p className="text-muted-foreground mb-4">
            If you have any questions or concerns regarding this disclaimer, feel free to contact us:
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Mail className="w-5 h-5 text-cyan-400" />
              <a 
                href="mailto:support@onlinetypingtest.in" 
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                support@onlinetypingtest.in
              </a>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Globe className="w-5 h-5 text-cyan-400" />
              <a 
                href="https://www.onlinetypingtest.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                www.onlinetypingtest.in
              </a>
            </div>
          </div>
        </div>

        {/* Closing Message */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-border text-center">
          <p className="text-muted-foreground leading-relaxed">
            Thank you for using <strong className="text-foreground">OnlineTypingTest.in</strong>. We are committed 
            to providing a safe, reliable, and helpful platform for your typing practice journey.
          </p>
        </div>

      </main>
      
      <Footer />
    </div>
  );
};

export default Disclaimer;
