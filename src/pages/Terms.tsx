import Header from '@/components/typing/Header';
import Footer from '@/components/typing/Footer';
import DynamicBackground from '@/components/DynamicBackground';
import { FileText, Globe, AlertCircle, CheckCircle2, Users, RefreshCw, LinkIcon, Mail } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <DynamicBackground />
      <Header />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        
        {/* Hero Section */}
        <div className="glass p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl mb-8 text-center border border-border shadow-lg">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">
              Terms & Conditions
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            Your Agreement with OnlineTypingTest.in
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            Last Updated: February 2026
          </p>
        </div>

        {/* Welcome Message */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <p className="text-muted-foreground leading-relaxed">
            Welcome to OnlineTypingTest.in. By accessing and using this website, you agree to follow the terms 
            mentioned below.
          </p>
        </div>

        {/* Purpose of the Website */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-bold gradient-text">Purpose of the Website</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            OnlineTypingTest.in is a free educational platform created to help users practice typing and improve 
            their speed (WPM) and accuracy through online tests and exercises.
          </p>
        </div>

        {/* Use of Website */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            <h2 className="text-xl sm:text-2xl font-bold gradient-text">Use of Website</h2>
          </div>
          <div className="space-y-3 text-muted-foreground">
            <p>You agree to use this website only for learning and practice purposes. You must not:</p>
            <ul className="space-y-2 ml-6">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>Use the website for any illegal activity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>Try to harm, hack, or disrupt any part of the website</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span>Attempt to gain unauthorized access to our systems</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Typing Test Results */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-bold gradient-text">Typing Test Results</h2>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <p className="text-muted-foreground leading-relaxed">
              The typing speed and accuracy results shown after each test are for <strong className="text-amber-400">personal 
              practice and self-evaluation only</strong>. These results are not official certificates and may not match 
              actual exam software or evaluation methods.
            </p>
          </div>
        </div>

        {/* Content Ownership */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl sm:text-2xl font-bold gradient-text">Content Ownership</h2>
          </div>
          <div className="space-y-4 text-muted-foreground">
            <p className="leading-relaxed">
              All typing passages, text content, design elements, logos, and materials on this website belong to 
              OnlineTypingTest.in unless stated otherwise.
            </p>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <p className="text-sm">
                <strong className="text-purple-400">What you can do:</strong> Use them for personal practice<br/>
                <strong className="text-purple-400">What you cannot do:</strong> Copy, republish, or use content for commercial purposes
              </p>
            </div>
          </div>
        </div>

        {/* Website Availability */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-bold gradient-text">Website Availability</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We try to keep the website available and running smoothly at all times. However, there may be temporary 
            interruptions due to updates or technical reasons.
          </p>
        </div>

        {/* User Responsibility */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-6 h-6 text-orange-400" />
            <h2 className="text-xl sm:text-2xl font-bold gradient-text">User Responsibility</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            You are responsible for how you use this website. Any information you send through contact forms or email 
            should be correct and respectful. We expect all users to behave ethically and responsibly.
          </p>
        </div>

        {/* External Links */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <LinkIcon className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl sm:text-2xl font-bold gradient-text">External Links</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Some pages may include links to other websites for learning purposes. We are not responsible for the 
            content or policies of those external websites. Please review their terms before using their services.
          </p>
        </div>

        {/* Changes to Website or Terms */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl sm:text-2xl font-bold gradient-text">Changes to Website or Terms</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We may update or improve the website and these Terms & Conditions at any time. Continued use of the 
            website means you accept those changes.
          </p>
        </div>

        {/* Contact Information */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-4">📞 Contact Information</h2>
          <p className="text-muted-foreground mb-4">
            If you have any questions regarding these terms, you can contact us at:
          </p>
          
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-400 font-medium flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email: support@onlinetypingtest.in
            </p>
          </div>
        </div>

        {/* Agreement */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-border text-center">
          <p className="text-muted-foreground leading-relaxed">
            By using <strong className="text-foreground">OnlineTypingTest.in</strong>, you agree to these Terms and Conditions.
          </p>
        </div>

      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
