import Header from '@/components/typing/Header';
import Footer from '@/components/typing/Footer';
import { Info, Target, Smartphone, RefreshCw, Users, Mail, Award, Heart, CheckCircle, Zap, Shield, Globe, Clock, BookOpen, Gamepad2, GraduationCap, TrendingUp, Star, MessageSquare, Lightbulb, HandHeart, Rocket, Eye, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  const stats = [
    { label: 'Test Modes', value: '15+', icon: Gamepad2, description: 'Different typing games and practice modes' },
    { label: 'Difficulty Levels', value: '4+', icon: TrendingUp, description: 'From beginner to advanced practice' },
    { label: 'Languages', value: '2', icon: Globe, description: 'English and Hindi typing support' },
    { label: 'Always Free', value: '100%', icon: Heart, description: 'No premium features or hidden costs' },
  ];

  const features = [
    { icon: Target, title: 'Precision WPM Calculation', description: 'Industry-standard algorithms that match official government exam evaluation criteria for accurate speed measurement.' },
    { icon: Shield, title: 'Privacy Focused', description: 'Your typing data stays on your device. We do not track personal information or require account creation to practice.' },
    { icon: Smartphone, title: 'Mobile Responsive', description: 'Practice on any device including smartphones, tablets, laptops, and desktops with our fully responsive design.' },
    { icon: Globe, title: 'Multi-Language Support', description: 'Practice typing in English and Hindi with support for Mangal and Kruti Dev fonts used in government exams.' },
    { icon: Clock, title: 'Flexible Duration', description: 'Choose from multiple test durations including 1, 2, 5, 10, and 15-minute tests to match exam requirements.' },
    { icon: Gamepad2, title: 'Engaging Games', description: 'Make practice fun with typing games that improve skills while keeping you motivated and entertained.' },
  ];

  const teamValues = [
    { icon: Heart, title: 'Passion for Education', description: 'We believe quality education tools should be accessible to everyone, regardless of economic background.' },
    { icon: Lightbulb, title: 'Innovation Driven', description: 'Constantly improving our platform with new features, better algorithms, and enhanced user experience.' },
    { icon: HandHeart, title: 'Community First', description: 'Built by the community, for the community. Every feature is designed based on user feedback and needs.' },
    { icon: Rocket, title: 'Excellence in Execution', description: 'Attention to detail in every aspect, from accurate WPM calculations to smooth, responsive interfaces.' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-5xl mx-auto px-5 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold gradient-text mb-4 flex items-center justify-center gap-3">
            <Info className="w-8 h-8 md:w-10 md:h-10" />
            About OnlineTypingTest
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Free, No-Signup Typing Practice Platform for Students, Job Seekers, and Professionals
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card text-center p-5">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl gradient-bg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm font-medium text-foreground mt-1">{stat.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Our Story Section */}
        <div className="card-gradient p-6 md:p-10 rounded-3xl shadow-lg border border-border mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-primary" />
            Our Story
          </h2>
          
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p className="text-lg">
              OnlineTypingTest.in was born from a simple observation: thousands of Indian students preparing for government examinations struggle to find quality, free typing practice resources. Many existing platforms either required expensive subscriptions, were cluttered with intrusive advertisements, or simply did not match the actual exam environment and requirements.
            </p>
            
            <p>
              Our founding team consisted of individuals who had personally experienced the challenges of government exam preparation. We understood the pressure of typing tests for SSC, IBPS, CPCT, and various state-level examinations. We knew that a typing speed difference of just 5 words per minute could mean the difference between selection and rejection for a government position.
            </p>
            
            <p>
              This understanding drove us to create a platform that would be completely free, with no hidden costs or premium tiers. We wanted every student in India, from metropolitan cities to remote villages, to have access to the same high-quality practice tools that would genuinely prepare them for success.
            </p>
            
            <p>
              Since our launch, we have continuously improved our platform, adding features like exam-specific modes, Hindi typing support with multiple font options, detailed performance analytics, and engaging typing games that make practice enjoyable. Our platform is designed to be accessible to everyone, completely free, with no login required.
            </p>
            
            <p>
              Our commitment remains unchanged: to provide a high-quality, free typing practice platform that genuinely helps users improve. Whether you are preparing for a government exam, looking to improve productivity at work, or simply wanting to type faster, OnlineTypingTest.in is here to support your journey.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="card-gradient p-6 md:p-10 rounded-3xl shadow-lg border border-border mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <Target className="w-7 h-7 text-primary" />
            Our Mission
          </h2>
          
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p className="text-lg font-medium text-foreground">
              To democratize typing skill development by providing world-class practice tools completely free of charge, ensuring every Indian student and professional has equal opportunity to develop essential keyboard skills.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-muted/30 p-5 rounded-2xl">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Our Vision
                </h3>
                <p className="text-sm">
                  To provide reliable, accurate typing practice tools that help students prepare for government typing exams. We aim to ensure no candidate fails a typing test due to lack of quality practice resources, regardless of their economic background.
                </p>
              </div>
              
              <div className="bg-muted/30 p-5 rounded-2xl">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Our Promise
                </h3>
                <p className="text-sm">
                  We commit to keeping our core typing practice tools free forever. We will never compromise user experience with intrusive advertising. We will never sell user data or require unnecessary personal information. Quality will always remain our top priority.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What Makes Us Different */}
        <div className="card-gradient p-6 md:p-10 rounded-3xl shadow-lg border border-border mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-primary" />
            What Makes Us Different
          </h2>
          
          <div className="space-y-6 text-muted-foreground leading-relaxed mb-8">
            <p>
              The internet offers numerous typing practice websites, but OnlineTypingTest.in stands apart through our unwavering commitment to quality, user experience, and genuine helpfulness. Here is what distinguishes us from alternatives:
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">100% Free Forever</h4>
                <p className="text-sm text-muted-foreground">No hidden fees, no premium tiers, no login required. All features are accessible immediately without any payment or registration. We sustain our platform through minimal, non-intrusive advertising that never interrupts your practice.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Exam-Focused Design</h4>
                <p className="text-sm text-muted-foreground">Our platform is specifically designed for Indian government exam requirements. We support SSC, IBPS, CPCT, and various state-level examination patterns. Our timing, evaluation methods, and practice content mirror actual exam conditions.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Accurate Calculations</h4>
                <p className="text-sm text-muted-foreground">Our WPM and accuracy calculations use the same formulas as official government exam systems. This means your practice scores accurately predict your performance in actual typing tests, giving you reliable feedback for improvement.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Privacy First Approach</h4>
                <p className="text-sm text-muted-foreground">We believe your data belongs to you. We do not require account creation for basic practice. We do not track your personal information or sell data to third parties. Your typing practice remains private and secure.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Continuous Improvement</h4>
                <p className="text-sm text-muted-foreground">We actively listen to user feedback and continuously enhance our platform. New features, improved algorithms, better content, and enhanced user experience updates are released regularly based on community needs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Features */}
        <div className="card-gradient p-6 md:p-10 rounded-3xl shadow-lg border border-border mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
            <Zap className="w-7 h-7 text-primary" />
            Platform Features
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-muted/30 p-5 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Values */}
        <div className="card-gradient p-6 md:p-10 rounded-3xl shadow-lg border border-border mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
            <Heart className="w-7 h-7 text-primary" />
            Our Core Values
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {teamValues.map((value, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Benefits Section */}
        <div className="card-gradient p-6 md:p-10 rounded-3xl shadow-lg border border-border mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <Star className="w-7 h-7 text-primary" />
            Platform Benefits
          </h2>
          
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              OnlineTypingTest.in is designed to provide a realistic typing practice experience that closely mimics actual government exam conditions. Our platform features accurate WPM calculations, real-time error tracking, and a variety of practice modes to suit different skill levels and exam requirements.
            </p>
            
            <p>
              The platform is accessible from any device - desktop, laptop, tablet, or smartphone. Our efficient, lightweight design ensures smooth performance even on basic devices with slower internet connections. No downloads, no installations, and no account creation required.
            </p>
            
            <p>
              We offer multiple practice modes including timed tests (1, 2, 5, 10, 15 minutes), 15 typing games for engaging practice, exam-specific modes, Hindi typing with Mangal and Kruti Dev fonts, and detailed analytics to track your progress. All features are completely free with no premium tiers or hidden costs.
            </p>
            
            <div className="bg-primary/10 rounded-xl p-6 border border-primary/20 mt-8">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                Practice Tip
              </h3>
              <p className="text-foreground">
                For best results preparing for government typing exams, practice daily for at least 30 minutes. Focus on accuracy first, then gradually increase speed. Use our exam mode to simulate actual test conditions and track your improvement over time.
              </p>
            </div>
          </div>
        </div>

        {/* Team Values Section */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
            <Users className="w-7 h-7 text-primary" />
            Our Team
          </h2>
          
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border border-slate-700 mb-8">
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              OnlineTypingTest.in is built by developers and typing enthusiasts who share a common vision: to create a free, accessible typing practice platform for exam preparation. We focus on accurate calculations, realistic practice environments, and user-friendly design.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-700/50 rounded-xl p-5 border border-slate-600">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                  <Lightbulb className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-bold text-white mb-2">Product & Innovation</h3>
                <p className="text-sm text-slate-300">Constantly researching and implementing new features that enhance the typing practice experience and align with evolving exam requirements.</p>
              </div>
              
              <div className="bg-slate-700/50 rounded-xl p-5 border border-slate-600">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                  <GraduationCap className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-bold text-white mb-2">Education & Content</h3>
                <p className="text-sm text-slate-300">Creating comprehensive tutorials, guides, and resources that help users master typing skills and understand typing metrics.</p>
              </div>
              
              <div className="bg-slate-700/50 rounded-xl p-5 border border-slate-600">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-bold text-white mb-2">Technology & Performance</h3>
                <p className="text-sm text-slate-300">Building a fast, reliable, and lightweight platform optimized for performance on all devices without compromising quality.</p>
              </div>
              
              <div className="bg-slate-700/50 rounded-xl p-5 border border-slate-600">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-3">
                  <Heart className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="font-bold text-white mb-2">Community & Support</h3>
                <p className="text-sm text-slate-300">Listening to user feedback, responding to queries, and continuously improving based on the needs of our community.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
            <Star className="w-7 h-7 text-primary" />
            Our Core Values
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamValues.map((value, index) => (
              <div key={index} className="card-gradient p-6 rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="card-gradient p-6 md:p-8 rounded-3xl shadow-lg border border-border text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-bg flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-3">Get in Touch</h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Have questions, suggestions, or feedback? We would love to hear from you. Your input helps us improve and serve you better.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="gradient-bg text-white">
              <Link to="/contact" className="gap-2">
                <Mail className="w-4 h-4" />
                Contact Us
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:support@onlinetypingtest.in" className="gap-2">
                support@onlinetypingtest.in
              </a>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
