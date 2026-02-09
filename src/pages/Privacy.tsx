import Header from '@/components/typing/Header';
import Footer from '@/components/typing/Footer';
import DynamicBackground from '@/components/DynamicBackground';
import { Lock, Cookie, ExternalLink, Users, AlertCircle, CheckCircle2 } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <DynamicBackground />
      <Header />
      
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        
        {/* Hero Section */}
        <div className="glass p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl mb-8 text-center border border-border shadow-lg">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">
              Privacy Policy
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            How We Handle Your Information
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">
            Last Updated: February 2026
          </p>
        </div>

        {/* Introduction */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <p className="text-muted-foreground leading-relaxed">
            At OnlineTypingTest.in, we respect your privacy and believe in being transparent about how information 
            is handled on our website.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-4">Information We Collect</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-cyan-400 pl-4">
              <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
              <p className="text-muted-foreground text-sm">
                We do not ask for personal information to use our typing tests. If you contact us through the 
                contact form or email, we may receive your name and email address only for replying to your query.
              </p>
            </div>

            <div className="border-l-4 border-cyan-400 pl-4">
              <h3 className="font-semibold text-foreground mb-2">Usage Information</h3>
              <p className="text-muted-foreground text-sm">
                Like most websites, we may receive basic non-personal information such as browser type, device 
                type, pages visited, and general usage data. This helps us understand how visitors use the site 
                and improve the experience.
              </p>
            </div>

            <div className="border-l-4 border-cyan-400 pl-4">
              <h3 className="font-semibold text-foreground mb-2">Local Storage</h3>
              <p className="text-muted-foreground text-sm">
                Your typing test results and preferences may be stored in your browser using local storage so 
                that you can see your progress when you return. You can clear this anytime from your browser settings.
              </p>
            </div>
          </div>
        </div>

        {/* Cookies and Advertising */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Cookie className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-bold gradient-text">Cookies & Advertising</h2>
          </div>

          <p className="text-muted-foreground mb-4">
            We may use cookies to keep the website working properly and to remember basic preferences.
          </p>

          <div className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <h3 className="font-semibold text-amber-400 mb-2 flex items-center gap-2">
                <span>Google AdSense</span>
              </h3>
              <p className="text-muted-foreground text-sm">
                OnlineTypingTest.in uses Google AdSense to show advertisements. Google may use cookies to 
                display ads based on your interests. You can manage or turn off personalized ads from your 
                Google account.
              </p>
            </div>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <h3 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                <span>Google Analytics</span>
              </h3>
              <p className="text-muted-foreground text-sm">
                We may also use Google Analytics to understand how visitors interact with our website. This 
                data is used only to improve our content and features.
              </p>
            </div>
          </div>
        </div>

        {/* Third-Party Services */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <ExternalLink className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl sm:text-2xl font-bold gradient-text">Third-Party Services</h2>
          </div>

          <p className="text-muted-foreground mb-4">
            We may use trusted third-party services such as:
          </p>
          
          <ul className="space-y-2">
            <li className="flex items-center gap-3 text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
              <span>Google AdSense (for advertisements)</span>
            </li>
            <li className="flex items-center gap-3 text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
              <span>Google Analytics (for visitor insights)</span>
            </li>
          </ul>

          <p className="text-muted-foreground text-sm mt-4">
            These services may collect data according to their own privacy policies. Please review their 
            policies for more information.
          </p>
        </div>

        {/* Children's Privacy */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl sm:text-2xl font-bold gradient-text">Children's Privacy</h2>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            Our website is intended for general use and does not intentionally collect personal information from 
            children. If you believe a child has shared personal information with us, please contact us and we 
            will take appropriate action.
          </p>
        </div>

        {/* Your Choices */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-4">Your Choices</h2>
          
          <p className="text-muted-foreground mb-4">
            You have control over your data and privacy settings. You can:
          </p>

          <ul className="space-y-2">
            <li className="flex items-start gap-3 text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              <span>Clear your browser storage to remove saved typing data</span>
            </li>
            <li className="flex items-start gap-3 text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              <span>Disable cookies from your browser settings</span>
            </li>
            <li className="flex items-start gap-3 text-muted-foreground">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              <span>Manage ad preferences from your Google account</span>
            </li>
          </ul>
        </div>

        {/* Updates to This Policy */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-bold gradient-text">Updates to This Policy</h2>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy when needed. Any updates will be posted on this page, and your 
            continued use of the website indicates your acceptance of any changes.
          </p>
        </div>

        {/* Contact Us */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl mb-6 border border-border">
          <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-4">📞 Contact Us</h2>
          <p className="text-muted-foreground mb-4">
            If you have any questions about our privacy practices or concerns about your personal information, 
            please contact us:
          </p>
          
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
            <p className="text-cyan-400 font-medium">
              Email: support@onlinetypingtest.in
            </p>
          </div>
        </div>

        {/* Agreement */}
        <div className="glass p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-border text-center">
          <p className="text-muted-foreground leading-relaxed">
            By using <strong className="text-foreground">OnlineTypingTest.in</strong>, you agree to this Privacy Policy.
          </p>
        </div>

      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
