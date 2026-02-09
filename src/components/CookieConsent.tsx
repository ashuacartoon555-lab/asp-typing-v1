import { useState, useEffect } from 'react';
import { Cookie, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl shadow-lg p-4 md:p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Cookie className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Cookie Consent</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We use cookies to enhance your browsing experience, serve personalized ads, and analyze our traffic. 
                By clicking "Accept All", you consent to our use of cookies.{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  Learn more
                </Link>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={declineCookies}
              className="flex-1 md:flex-none gap-2"
            >
              <X className="w-4 h-4" />
              Decline
            </Button>
            <Button
              size="sm"
              onClick={acceptCookies}
              className="flex-1 md:flex-none gap-2 gradient-bg text-primary-foreground hover:opacity-90"
            >
              <Check className="w-4 h-4" />
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
