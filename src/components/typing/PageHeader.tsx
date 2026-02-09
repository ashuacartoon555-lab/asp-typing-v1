import { Rocket, Target, BarChart3, History, Gamepad2, Award, GraduationCap, Shield, Users, TrendingUp } from 'lucide-react';

const PageHeader = () => {
  return (
    <header className="text-center mb-10 py-8 relative">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">
        <span className="gradient-text">Master Your Typing</span>{' '}
        <span className="text-foreground">Speed & Accuracy</span>
      </h1>
      <p className="text-muted-foreground text-lg mb-6 max-w-xl mx-auto">
        Practice daily, analyze performance & improve productivity.
      </p>
      
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-1 rounded-full" 
        style={{ background: 'linear-gradient(90deg, hsl(178, 72%, 45%), hsl(42, 98%, 58%))' }}
      />
      
      {/* Trust Signals */}
      <div className="flex justify-center gap-6 mt-8 flex-wrap">
        <div className="stat-card flex items-center gap-4 min-w-[200px]">
          <GraduationCap className="w-8 h-8 text-primary" />
          <div className="text-left">
            <strong className="block text-sm">Exam Ready</strong>
            <span className="text-muted-foreground text-xs">SSC / Bank Pattern</span>
          </div>
        </div>
        <div className="stat-card flex items-center gap-4 min-w-[200px]">
          <Shield className="w-8 h-8 text-primary" />
          <div className="text-left">
            <strong className="block text-sm">Official Rules</strong>
            <span className="text-muted-foreground text-xs">Net WPM Calculation</span>
          </div>
        </div>
        <div className="stat-card flex items-center gap-4 min-w-[200px]">
          <Users className="w-8 h-8 text-primary" />
          <div className="text-left">
            <strong className="block text-sm">Trusted by</strong>
            <span className="text-muted-foreground text-xs">Thousands of Aspirants</span>
          </div>
        </div>
        <div className="stat-card flex items-center gap-4 min-w-[200px]">
          <TrendingUp className="w-8 h-8 text-primary" />
          <div className="text-left">
            <strong className="block text-sm">Progress Tracking</strong>
            <span className="text-muted-foreground text-xs">Detailed Analytics</span>
          </div>
        </div>
      </div>
      
      {/* Features */}
      <div className="flex justify-center gap-4 flex-wrap mt-6">
        <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl shadow-sm border border-border hover:shadow-md transition-all hover:-translate-y-0.5">
          <Rocket className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Speed Tracking</span>
        </div>
        <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl shadow-sm border border-border hover:shadow-md transition-all hover:-translate-y-0.5">
          <Target className="w-4 h-4 text-success" />
          <span className="text-sm font-medium">Accuracy Focus</span>
        </div>
        <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl shadow-sm border border-border hover:shadow-md transition-all hover:-translate-y-0.5">
          <BarChart3 className="w-4 h-4 text-info" />
          <span className="text-sm font-medium">Detailed Analytics</span>
        </div>
        <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl shadow-sm border border-border hover:shadow-md transition-all hover:-translate-y-0.5">
          <History className="w-4 h-4 text-warning" />
          <span className="text-sm font-medium">Progress History</span>
        </div>
        <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl shadow-sm border border-border hover:shadow-md transition-all hover:-translate-y-0.5">
          <Gamepad2 className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium">Typing Games</span>
        </div>
        <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-xl shadow-sm border border-border hover:shadow-md transition-all hover:-translate-y-0.5">
          <Award className="w-4 h-4 text-danger" />
          <span className="text-sm font-medium">Certificates</span>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
