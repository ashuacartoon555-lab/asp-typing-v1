import { Link } from 'react-router-dom';
import { Mail, Globe, CheckCircle, ArrowRight, Heart, Keyboard, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const features = [
    'Free Typing Test',
    'Exam Mode',
    'Progress Tracking',
    'Detailed Analytics',
    'Certificate Download',
    'Download Report',
    'Your Typing Analytics',
    'Speed Insights',
    'WPM Progress',
    'Accuracy Trend',
    'Performance by Difficulty',
    'Achievements',
    'Typing Streak'
  ];

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Typing Test', path: '/' },
    { label: 'Tutorials', path: '/tutorial' },
    { label: 'Typing Tips', path: '/tips' },
    { label: 'Games', path: '/games' },
    { label: 'Exam Mode', path: '/exam-mode' },
    { label: 'Analytics', path: '/analytics' },
    { label: 'Blog', path: '/blog' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms & Conditions', path: '/terms' },
    { label: 'Disclaimer', path: '/disclaimer' }
  ];

  return (
    <footer 
      className="mt-auto border-t"
      style={{
        background: 'hsla(200, 50%, 10%, 0.95)',
        borderColor: 'hsla(0, 0%, 100%, 0.2)'
      }}
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-base transition-transform group-hover:scale-110">
                Tt
              </div>
              <h3 className="text-xl font-bold">OnlineTypingTest.in</h3>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Free, no-registration typing practice platform for students and professionals preparing for speed tests and exams.
            </p>
            
            {/* Made in India Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg">
              <span className="text-base" role="img" aria-label="Indian flag">🇮🇳</span>
              <span className="text-xs font-medium text-muted-foreground">Made with</span>
              <Heart className="w-3 h-3 text-destructive fill-destructive" aria-hidden="true" />
              <span className="text-xs font-medium text-muted-foreground">in India</span>
            </div>
          </div>

          {/* Features Section */}
          <div>
            <h4 className="font-semibold mb-3 text-base">Features</h4>
            <ul className="space-y-1.5">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="font-semibold mb-3 text-base">Quick Links</h4>
            <ul className="space-y-1.5">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 shrink-0" aria-hidden="true" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="font-semibold mb-3 text-base">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:support@onlinetypingtest.in"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                  <span className="break-all">support@onlinetypingtest.in</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.onlinetypingtest.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Globe className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                  <span>www.onlinetypingtest.in</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t" style={{ borderColor: 'hsla(0, 0%, 100%, 0.2)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-muted-foreground">
              © {new Date().getFullYear()} OnlineTypingTest.in | Free Typing Practice Platform
            </p>
            <p className="text-xs text-muted-foreground/70">
              No registration required • 100% Free • Privacy Focused
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;