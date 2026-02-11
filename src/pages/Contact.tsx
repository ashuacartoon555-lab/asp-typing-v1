import Header from '@/components/typing/Header';
import Footer from '@/components/typing/Footer';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare, Send, Clock, HelpCircle, Users, Globe, FileText, Keyboard, Shield, CheckCircle, Zap, BookOpen, Phone, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form is for demonstration purposes - opens email client
    const subject = encodeURIComponent(formData.subject);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nCategory: ${formData.category}\n\nMessage:\n${formData.message}`);
    window.location.href = `mailto:support@onlinetypingtest.in?subject=${subject}&body=${body}`;
    setFormData({ name: '', email: '', subject: '', category: 'general', message: '' });
  };

  const faqs = [
    {
      question: "Is OnlineTypingTest completely free to use?",
      answer: "Yes, OnlineTypingTest.in is completely free to use. All our typing tests, games, tutorials, and exam practice modes are available without any cost. We do not have any premium tiers or hidden charges. We sustain our platform through minimal advertising that does not interrupt your practice."
    },
    {
      question: "Do I need to create an account to practice?",
      answer: "No, account creation is not required to use our platform. You can start practicing immediately without any registration. Simply visit our website and begin your typing test. Your practice data is stored locally on your device for your convenience."
    },
    {
      question: "How accurate are the WPM calculations?",
      answer: "Our WPM calculations follow the industry-standard formula used in government examinations like SSC, IBPS, and CPCT. We calculate Words Per Minute based on gross keystrokes divided by 5 (the standard word length), with accuracy adjustments that match official evaluation criteria."
    },
    {
      question: "Can I practice Hindi typing on your platform?",
      answer: "Yes, we support Hindi typing practice with both Mangal and Kruti Dev fonts. Our Hindi typing tests are designed to match the requirements of government examinations that include Hindi typing components. You can switch between English and Hindi easily."
    },
    {
      question: "Is my typing data saved or tracked?",
      answer: "Your privacy is important to us. All your typing practice data is stored locally on your device's browser storage. We do not track personal information, typing patterns, or practice history on our servers. You have complete control over your data."
    },
    {
      question: "Can I use OnlineTypingTest on my mobile phone?",
      answer: "Yes, our platform is fully responsive and works on smartphones, tablets, laptops, and desktop computers. While we recommend using a physical keyboard for optimal practice, our mobile-optimized interface ensures you can practice anywhere."
    },
    {
      question: "How do I prepare for government typing tests?",
      answer: "We recommend using our Exam Mode feature which simulates actual government exam conditions. Practice with the specific duration and settings that match your target examination. Focus on accuracy first, then gradually increase speed. Daily practice of 30-60 minutes is ideal for exam preparation."
    },
    {
      question: "What typing speed do I need for government jobs?",
      answer: "Requirements vary by examination. SSC typically requires 35 WPM for English and 30 WPM for Hindi. IBPS clerical positions generally require 30 WPM. CPCT requirements range from 30-35 WPM depending on the position. Check the official notification for your specific examination."
    }
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Contact",
      description: "For inquiries and feedback",
      contact: "support@onlinetypingtest.in",
      response: "Direct email for support"
    },
    {
      icon: MessageSquare,
      title: "Feedback Form",
      description: "Opens your email client",
      contact: "Use the form below",
      response: "Sends via your email app"
    },
    {
      icon: BookOpen,
      title: "Help Resources",
      description: "Self-service support",
      contact: "Tutorials & FAQs",
      response: "Available 24/7"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-6xl mx-auto px-3 sm:px-5 py-8">
        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold gradient-text mb-4 flex items-center justify-center gap-2 sm:gap-3">
            <Mail className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
            Contact Us
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Have questions, feedback, or suggestions? Check our FAQs below for instant answers, or email us directly for specific inquiries.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-12">
          {contactMethods.map((method, index) => (
            <div key={index} className="card-gradient p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border border-border text-center">
              <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
                <method.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">{method.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
              <p className="font-medium text-primary">{method.contact}</p>
              <p className="text-xs text-muted-foreground mt-1">{method.response}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-12">
          {/* Contact Form */}
          <div className="card-gradient p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-lg border border-border">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2">
              <Send className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              Send Us a Message
            </h2>
            <p className="text-muted-foreground mb-6">
              Fill out the form below to compose an email. The form will open your default email client with your message pre-filled.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name *</label>
                  <Input 
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="bg-muted/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <Input 
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="bg-muted/50"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="general">General Inquiry</option>
                  <option value="feedback">Feedback & Suggestions</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="exam">Exam Preparation Help</option>
                  <option value="partnership">Partnership Inquiry</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <Input 
                  placeholder="Brief summary of your message"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required
                  className="bg-muted/50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Your Message *</label>
                <Textarea 
                  placeholder="Please describe your question, feedback, or suggestion in detail..."
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                  className="bg-muted/50"
                />
              </div>
              
              <Button type="submit" className="w-full gradient-bg text-white gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                By submitting this form, you agree to our Privacy Policy. We will only use your information to respond to your inquiry.
              </p>
            </form>
          </div>

          {/* FAQ Section */}
          <div className="space-y-6">
            <div className="card-gradient p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-lg border border-border">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {faqs.map((faq, index) => (
                  <details key={index} className="group bg-muted/30 rounded-xl">
                    <summary className="flex items-start gap-3 p-4 cursor-pointer list-none">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <span className="font-medium text-foreground">{faq.question}</span>
                    </summary>
                    <div className="px-4 pb-4 pl-12">
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="card-gradient p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border border-border">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Quick Links
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/tutorial" className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm">Tutorials</span>
                </Link>
                <Link to="/tips" className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm">Typing Tips</span>
                </Link>
                <Link to="/games" className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                  <Keyboard className="w-4 h-4 text-primary" />
                  <span className="text-sm">Typing Games</span>
                </Link>
                <Link to="/exam-mode" className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-sm">Exam Mode</span>
                </Link>
              </div>
            </div>

            {/* Community */}
            <div className="card-gradient p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border border-border text-center">
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold mb-2">Share & Connect</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Share this free typing practice platform with friends and colleagues.
              </p>
              <div className="flex justify-center gap-3">
                <Link to="/" title="Visit OnlineTypingTest.in" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-all">
                  <Globe className="w-5 h-5 text-primary" />
                </Link>
                <a href="mailto:support@onlinetypingtest.in" title="Email us" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-all">
                  <Users className="w-5 h-5 text-primary" />
                </a>
                <a href="https://twitter.com/intent/tweet?text=Check%20out%20OnlineTypingTest.in%20for%20free%20typing%20practice" target="_blank" rel="noopener noreferrer" title="Share on Twitter" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-all">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="card-gradient p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-lg border border-border text-center">
          <h3 className="text-xl font-bold mb-3">Need Immediate Assistance?</h3>
          <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
            For urgent matters or partnership inquiries, reach us directly at our official email address.
          </p>
          <a 
            href="mailto:support@onlinetypingtest.in" 
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            <Mail className="w-5 h-5" />
            support@onlinetypingtest.in
          </a>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
