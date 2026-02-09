import Header from '@/components/typing/Header';
import Footer from '@/components/typing/Footer';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, FileText } from 'lucide-react';

const SSCBankingTypingGuide = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-5 py-12">
        <Link to="/tips" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Typing Tips
        </Link>
        
        <article className="prose prose-lg max-w-none">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1 gradient-text">SSC / Banking Typing Test Guide</h1>
              <div className="flex items-center text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" /> 15 min read
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border mb-8">
            <p className="text-lg text-foreground leading-relaxed">
              Government exams jaise SSC CGL, SSC CHSL, IBPS Clerk, aur RRB mein typing test ek important qualifying stage hai. Is comprehensive guide mein hum cover karenge - exam patterns, required speed, preparation tips, aur common mistakes. Yeh guide aapki typing test preparation ko complete karega!
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">SSC Typing Test - Complete Overview</h2>
          <p className="text-muted-foreground mb-4">
            SSC (Staff Selection Commission) ke different exams mein typing test requirements alag hoti hain. Let's understand each one:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">SSC CGL (Combined Graduate Level)</h3>
          <div className="bg-card rounded-lg p-4 my-4 border">
            <ul className="space-y-2 text-muted-foreground">
              <li><strong>Required Speed:</strong> 35 WPM (English) / 30 WPM (Hindi)</li>
              <li><strong>Duration:</strong> 15 minutes</li>
              <li><strong>Total Words:</strong> Approximately 525 words (English) / 450 words (Hindi)</li>
              <li><strong>Nature:</strong> Qualifying (marks not counted)</li>
              <li><strong>Applicable Posts:</strong> Tax Assistant, CSS posts, etc.</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">SSC CHSL (Combined Higher Secondary Level)</h3>
          <div className="bg-card rounded-lg p-4 my-4 border">
            <ul className="space-y-2 text-muted-foreground">
              <li><strong>For LDC/JSA:</strong> 35 WPM English OR 30 WPM Hindi</li>
              <li><strong>For DEO:</strong> 8000 Key Depressions Per Hour (KDPH)</li>
              <li><strong>Duration:</strong> 15 minutes (LDC) / 15 minutes (DEO)</li>
              <li><strong>Nature:</strong> Skill Test - Qualifying only</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">SSC Stenographer</h3>
          <div className="bg-card rounded-lg p-4 my-4 border">
            <ul className="space-y-2 text-muted-foreground">
              <li><strong>Grade C:</strong> 100 WPM shorthand, transcription in 40 mins (English) / 55 mins (Hindi)</li>
              <li><strong>Grade D:</strong> 80 WPM shorthand, transcription in 50 mins (English) / 65 mins (Hindi)</li>
              <li><strong>Computer Proficiency:</strong> Required for both</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Banking Sector Typing Requirements</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">IBPS Clerk</h3>
          <p className="text-muted-foreground mb-4">
            IBPS Clerk mein typing test generally nahi hota, lekin basic computer proficiency zaroori hai. Some banks may conduct computer aptitude test.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">IBPS PO / SBI PO</h3>
          <p className="text-muted-foreground mb-4">
            PO posts ke liye dedicated typing test nahi hota. However, Group Discussion aur Personal Interview ke baad computer literacy verify ki jati hai.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">RBI Grade B / NABARD</h3>
          <p className="text-muted-foreground mb-4">
            Typing test typically required nahi hai, but computer proficiency zaroori hai interview stage mein.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Railway Typing Test Requirements</h2>
          <div className="bg-card rounded-lg p-4 my-4 border">
            <ul className="space-y-2 text-muted-foreground">
              <li><strong>RRB NTPC (Various Posts):</strong> 30 WPM (English) / 25 WPM (Hindi)</li>
              <li><strong>Junior Clerk cum Typist:</strong> 30 WPM minimum</li>
              <li><strong>Senior Clerk cum Typist:</strong> 35 WPM minimum</li>
              <li><strong>Duration:</strong> Usually 10-15 minutes</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">WPM Calculation - Kaise Hota Hai?</h2>
          <p className="text-muted-foreground mb-4">
            Government exams mein WPM calculation ka standard formula:
          </p>
          <div className="bg-primary/5 rounded-lg p-4 my-4 border-l-4 border-primary">
            <p className="font-medium">Formula:</p>
            <p className="text-muted-foreground mt-2">WPM = (Total Keystrokes / 5) / Time in Minutes</p>
            <p className="text-muted-foreground mt-2">Example: 2000 keystrokes in 15 minutes</p>
            <p className="text-muted-foreground">WPM = (2000/5) / 15 = 400/15 = 26.67 WPM</p>
          </div>
          <p className="text-muted-foreground mb-4">
            Note: 1 Word = 5 keystrokes (including spaces). Yeh standard formula hai jo most government exams follow karte hain.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Error Calculation Aur Penalties</h2>
          <p className="text-muted-foreground mb-4">
            Typing test mein errors ke liye penalties hoti hain:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li><strong>Full Mistake:</strong> Wrong word typed = 10 keystrokes penalty (2 words)</li>
            <li><strong>Half Mistake:</strong> Spacing errors, capitalization = 5 keystrokes penalty (1 word)</li>
            <li><strong>Omission:</strong> Skipped words = treated as full mistake</li>
            <li><strong>Extra Words:</strong> Typed but not in passage = full mistake</li>
          </ul>
          <div className="bg-card rounded-lg p-4 my-4 border">
            <p className="font-medium mb-2">Net Speed Formula:</p>
            <p className="text-muted-foreground">Net WPM = Gross WPM - (Total Mistakes × Penalty Factor)</p>
            <p className="text-muted-foreground mt-2">Different exams have different penalty systems, so check official notification.</p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Preparation Strategy - 30 Day Plan</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Week 1: Foundation Building</h3>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li>Focus on touch typing fundamentals</li>
            <li>Practice home row keys (ASDF JKL;)</li>
            <li>Target: Accuracy over speed</li>
            <li>Daily practice: 45 minutes</li>
            <li>Expected WPM: 15-20</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Week 2: Speed Building</h3>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li>All keys practice (A-Z, numbers, punctuation)</li>
            <li>Start timing your tests</li>
            <li>Practice with paragraphs similar to exam</li>
            <li>Daily practice: 1 hour</li>
            <li>Expected WPM: 20-28</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Week 3: Exam Simulation</h3>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li>Practice with actual exam passages</li>
            <li>Take timed tests (10-15 minutes)</li>
            <li>Identify and work on weak areas</li>
            <li>Practice under exam-like conditions</li>
            <li>Expected WPM: 28-35</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Week 4: Final Preparation</h3>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li>Mock tests daily (at least 3)</li>
            <li>Work on consistency</li>
            <li>Focus on reducing errors</li>
            <li>Build confidence and speed together</li>
            <li>Target WPM: 35+ (English) / 30+ (Hindi)</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Exam Day Tips</h2>
          <div className="bg-card rounded-lg p-4 my-4 border">
            <ul className="space-y-3 text-muted-foreground">
              <li><strong>1. Reach Early:</strong> Exam center par 1 hour pehle pahuncho</li>
              <li><strong>2. Check Keyboard:</strong> Test karo ki sab keys properly kaam kar rahi hain</li>
              <li><strong>3. Adjust Chair:</strong> Comfortable position mein baitho</li>
              <li><strong>4. Read Passage First:</strong> Typing start karne se pehle passage ek baar padho</li>
              <li><strong>5. Steady Pace:</strong> Rushing se mistakes hoti hain</li>
              <li><strong>6. Don't Panic:</strong> Mistake ho toh immediately correct karo aur aage badho</li>
              <li><strong>7. Time Management:</strong> Screen par time dekho aur pace adjust karo</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Common Mistakes Jo Candidates Karte Hain</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li><strong>Speed pe zyada focus:</strong> Errors badhte hain, net speed kam hoti hai</li>
            <li><strong>Practice skip karna:</strong> Consistency important hai</li>
            <li><strong>Wrong paragraphs practice:</strong> Exam style passages use karo</li>
            <li><strong>Keyboard nahi dekhe ka rule ignore:</strong> Touch typing zaroori hai</li>
            <li><strong>Finger placement galat:</strong> Home row position maintain karo</li>
            <li><strong>Last minute preparation:</strong> 1-2 months ka time do</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Hindi Typing Special Tips</h2>
          <p className="text-muted-foreground mb-4">
            Hindi typing ke liye additional preparation chahiye:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li><strong>Keyboard Layout:</strong> Remington (GAIL) ya Inscript - dono mein se ek choose karo</li>
            <li><strong>Remington Popular:</strong> Most government exams mein use hota hai</li>
            <li><strong>Matras Practice:</strong> Hindi matras (aa, ee, oo, etc.) important hain</li>
            <li><strong>Special Characters:</strong> Chandrabindu, anusvaar, visarga practice karo</li>
            <li><strong>Font Check:</strong> Exam mein Mangal ya Kruti Dev font ho sakta hai</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Recommended Practice Content</h2>
          <p className="text-muted-foreground mb-4">
            Government exam paragraphs typically in topics se hote hain:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li>Indian History and Culture</li>
            <li>Geography and Environment</li>
            <li>Current Affairs and Government Schemes</li>
            <li>Science and Technology</li>
            <li>Economy and Finance</li>
            <li>Social Issues</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            Hamare Exam Mode mein SSC, Banking, aur Railways ke actual pattern wale passages available hain. Regular practice se exam day par comfortable feel hoga.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Physical aur Mental Preparation</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li><strong>Hand Exercises:</strong> Typing se pehle fingers stretch karo</li>
            <li><strong>Eye Rest:</strong> 20-20-20 rule follow karo (20 min ke baad 20 sec ke liye 20 feet door dekho)</li>
            <li><strong>Posture Check:</strong> Back pain se bachne ke liye proper posture</li>
            <li><strong>Stay Calm:</strong> Nervousness se mistakes badhti hain</li>
            <li><strong>Sleep Well:</strong> Exam se pehle proper rest lo</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Conclusion</h2>
          <p className="text-muted-foreground mb-4">
            SSC aur Banking typing tests qualify karna mushkil nahi hai agar aap systematic preparation karo. Required speed achieve karna 1-2 months ki dedicated practice se possible hai.
          </p>
          <p className="text-muted-foreground mb-4">
            Remember: Typing test sirf qualifying nature ka hai - marks count nahi hote. Toh bas required speed achieve karo with good accuracy, aur aap clear kar loge. Hamare Exam Mode se daily practice karo aur confident ho kar exam do!
          </p>

          <div className="bg-primary/10 rounded-xl p-6 mt-8 text-center">
            <p className="text-lg font-medium mb-4">Practice SSC/Banking Style Tests</p>
            <Link to="/exam-mode" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Go to Exam Mode <FileText className="w-4 h-4" />
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default SSCBankingTypingGuide;
