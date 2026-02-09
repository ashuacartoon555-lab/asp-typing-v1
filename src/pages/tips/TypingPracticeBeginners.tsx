import Header from '@/components/typing/Header';
import Footer from '@/components/typing/Footer';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen } from 'lucide-react';

const TypingPracticeBeginners = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-5 py-12">
        <Link to="/tips" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Typing Tips
        </Link>
        
        <article className="prose prose-lg max-w-none">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1 gradient-text">Typing Practice for Beginners</h1>
              <div className="flex items-center text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" /> 12 min read
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border mb-8">
            <p className="text-lg text-foreground leading-relaxed">
              Agar aap typing mein bilkul naye ho, toh yeh article specially aapke liye hai! Hum step-by-step sikhayenge ki kaise shuru karna hai, kya common mistakes avoid karni hain, aur kaise ek complete beginner se confident typist ban sakte ho. Let's start your typing journey!
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Typing Seekhna Kyun Zaroori Hai?</h2>
          <p className="text-muted-foreground mb-4">
            Aaj ke digital world mein typing ek essential skill hai. Chahe aap school mein ho, college mein, ya job kar rahe ho - har jagah computer use hota hai. Fast aur accurate typing se aapka kaam jaldi hota hai aur productivity badhti hai.
          </p>
          <p className="text-muted-foreground mb-4">
            Government exams jaise SSC, IBPS, Railways mein typing test mandatory hai. Private sector mein bhi data entry, content writing, aur almost har office job mein typing zaroori hai. Toh ab waqt hai is skill ko seriously seekhne ka!
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Step 1: Keyboard Layout Samjho</h2>
          <p className="text-muted-foreground mb-4">
            Sabse pehle keyboard layout samajhna zaroori hai. Most common layout QWERTY hai (top row ke first 6 letters se naam aaya). Is layout ko 1870s mein design kiya gaya tha aur aaj bhi worldwide use hota hai.
          </p>
          <div className="bg-card rounded-lg p-4 my-4 border">
            <p className="font-medium mb-2">Keyboard Sections:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <strong>Top Row:</strong> Number keys (1-0) aur symbols</li>
              <li>• <strong>First Letter Row:</strong> Q, W, E, R, T, Y, U, I, O, P</li>
              <li>• <strong>Home Row:</strong> A, S, D, F, G, H, J, K, L (Most important!)</li>
              <li>• <strong>Bottom Row:</strong> Z, X, C, V, B, N, M</li>
              <li>• <strong>Space Bar:</strong> Sabse badi key, dono thumbs se press karo</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Step 2: Home Row Position - Foundation of Typing</h2>
          <p className="text-muted-foreground mb-4">
            Home row sabse important concept hai typing mein. Yeh woh position hai jahan se aapki fingers start karti hain aur wapas aati hain. F aur J keys par small bumps hote hain jo bina dekhe position find karne mein help karte hain.
          </p>
          <div className="bg-primary/5 rounded-lg p-4 my-4 border-l-4 border-primary">
            <p className="font-medium">Home Row Finger Placement:</p>
            <p className="text-muted-foreground mt-2">Left Hand: Pinky on A, Ring on S, Middle on D, Index on F</p>
            <p className="text-muted-foreground">Right Hand: Index on J, Middle on K, Ring on L, Pinky on ;</p>
            <p className="text-muted-foreground mt-2">Thumbs: Space bar par rest karein</p>
          </div>
          <p className="text-muted-foreground mb-4">
            Initially yeh uncomfortable lagega, lekin yahi sahi tarika hai. Jab fingers apni position se move karein aur key press karein, toh wapas home position par aayein. Isse consistency aati hai.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Step 3: Touch Typing Ki Shuruat</h2>
          <p className="text-muted-foreground mb-4">
            Touch typing matlab keyboard dekhe bina type karna. Beginners ke liye yeh sabse mushkil part hai kyunki hum naturally keyboard dekhte hain. Lekin yeh habit todna zaroori hai.
          </p>
          <p className="text-muted-foreground mb-4">
            Shuru mein keyboard cover kar sakte ho ya hands ke upar cloth rakh sakte ho. Initially speed bahut slow hogi - don't worry, yeh normal hai. Focus karo ki sahi finger sahi key press kare.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li>Pehle sirf home row keys practice karo: A S D F J K L ;</li>
            <li>Phir slowly top row add karo: Q W E R T Y U I O P</li>
            <li>Last mein bottom row: Z X C V B N M</li>
            <li>Numbers aur symbols end mein seekho</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Step 4: Finger Assignment Chart</h2>
          <p className="text-muted-foreground mb-4">
            Har finger ki specific keys assigned hoti hain. Yeh chart yaad kar lo aur practice mein strictly follow karo:
          </p>
          <div className="bg-card rounded-lg p-4 my-4 border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Finger</th>
                  <th className="text-left p-2">Left Hand Keys</th>
                  <th className="text-left p-2">Right Hand Keys</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b"><td className="p-2">Pinky</td><td className="p-2">Q, A, Z, 1, Tab, Caps, Shift</td><td className="p-2">P, ;, /, 0, -, =, Backspace</td></tr>
                <tr className="border-b"><td className="p-2">Ring</td><td className="p-2">W, S, X, 2</td><td className="p-2">O, L, ., 9</td></tr>
                <tr className="border-b"><td className="p-2">Middle</td><td className="p-2">E, D, C, 3</td><td className="p-2">I, K, ,, 8</td></tr>
                <tr><td className="p-2">Index</td><td className="p-2">R, T, F, G, V, B, 4, 5</td><td className="p-2">Y, U, H, J, N, M, 6, 7</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Step 5: Beginner Practice Exercises</h2>
          <p className="text-muted-foreground mb-4">
            Ab practice start karte hain! Pehle simple exercises se shuru karo:
          </p>
          <div className="bg-muted/30 rounded-lg p-4 my-4 font-mono text-sm">
            <p className="mb-2"><strong>Exercise 1 - Home Row:</strong></p>
            <p className="text-muted-foreground">asdf jkl; asdf jkl; fjdk slaf fjdk slaf</p>
            <p className="mt-4 mb-2"><strong>Exercise 2 - Simple Words:</strong></p>
            <p className="text-muted-foreground">sad dad fad lad ask flask add all fall</p>
            <p className="mt-4 mb-2"><strong>Exercise 3 - Common Words:</strong></p>
            <p className="text-muted-foreground">the and for are but not you all can had</p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Step 6: Posture Aur Setup</h2>
          <p className="text-muted-foreground mb-4">
            Sahi posture typing accuracy aur comfort dono ke liye zaroori hai. Galat posture se hand pain, back pain, aur fatigue ho sakti hai.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li><strong>Chair Height:</strong> Feet flat on floor, thighs parallel to ground</li>
            <li><strong>Screen Distance:</strong> Arm's length away from eyes</li>
            <li><strong>Keyboard Position:</strong> Elbows at 90-degree angle</li>
            <li><strong>Wrists:</strong> Straight, not bent up or down</li>
            <li><strong>Back:</strong> Straight with good lumbar support</li>
            <li><strong>Eyes:</strong> Screen top edge at or slightly below eye level</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Step 7: Practice Schedule For Beginners</h2>
          <p className="text-muted-foreground mb-4">
            Consistency important hai, lekin overdo mat karo. Beginners ke liye recommended schedule:
          </p>
          <div className="bg-card rounded-lg p-4 my-4 border">
            <p className="font-medium mb-3">4-Week Beginner Plan:</p>
            <div className="space-y-3 text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">Week 1: Home Row Mastery</p>
                <p>Daily 15 minutes, only home row keys, focus on correct finger placement</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Week 2: Add Top Row</p>
                <p>Daily 20 minutes, home row + top row, slow and steady</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Week 3: Complete Alphabet</p>
                <p>Daily 25 minutes, all letters including bottom row</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Week 4: Words and Sentences</p>
                <p>Daily 30 minutes, real words and simple sentences, start timing yourself</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Step 8: Common Beginner Mistakes</h2>
          <p className="text-muted-foreground mb-4">
            In mistakes se bachein - yeh progress slow kar deti hain:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li><strong>Keyboard Dekhna:</strong> Screen par focus rakho, not keyboard</li>
            <li><strong>Wrong Fingers:</strong> Har key ke liye designated finger use karo</li>
            <li><strong>Rushing:</strong> Speed baad mein aayegi, pehle accuracy</li>
            <li><strong>Bad Posture:</strong> Slouching se fatigue aur mistakes badhti hain</li>
            <li><strong>Inconsistent Practice:</strong> Daily practice karo, skip mat karo</li>
            <li><strong>Ignoring Errors:</strong> Mistakes note karo aur un par kaam karo</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Step 9: Accuracy vs Speed - Kya Focus Karein?</h2>
          <p className="text-muted-foreground mb-4">
            Beginners ko ALWAYS accuracy par focus karna chahiye. Speed naturally time ke saath aati hai. Agar aap fast type karne ki koshish karoge errors ke saath, toh galat muscle memory develop hogi.
          </p>
          <div className="bg-primary/5 rounded-lg p-4 my-4 border-l-4 border-primary">
            <p className="font-medium">Golden Rule for Beginners:</p>
            <p className="text-muted-foreground mt-2">Target: 95%+ accuracy maintain karo, chahe speed 10 WPM hi ho</p>
            <p className="text-muted-foreground">Jab accuracy consistent ho jaaye, tab slowly speed badhao</p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Step 10: Progress Track Karo</h2>
          <p className="text-muted-foreground mb-4">
            Weekly apni progress record karo. Note karo:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li>Current WPM (Words Per Minute)</li>
            <li>Accuracy percentage</li>
            <li>Problematic keys (jahan zyada mistakes hoti hain)</li>
            <li>Practice time completed</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            Hamare typing test ke baad detailed report milti hai jo automatically yeh sab track karti hai. PDF download kar ke records rakh sakte ho.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Realistic Expectations Set Karo</h2>
          <p className="text-muted-foreground mb-4">
            Typing seekhna time leta hai. Realistic milestones:
          </p>
          <div className="bg-card rounded-lg p-4 my-4 border">
            <ul className="space-y-2 text-muted-foreground">
              <li>• <strong>1 Month:</strong> 15-20 WPM with good accuracy</li>
              <li>• <strong>2 Months:</strong> 25-30 WPM, looking at keyboard kam</li>
              <li>• <strong>3 Months:</strong> 35-40 WPM, comfortable touch typing</li>
              <li>• <strong>6 Months:</strong> 45-55 WPM, professional level</li>
              <li>• <strong>1 Year:</strong> 60+ WPM possible with consistent practice</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Additional Resources</h2>
          <p className="text-muted-foreground mb-4">
            Hamare platform par aur bhi helpful resources hain:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li><strong>Tutorial Section:</strong> Step-by-step video guides</li>
            <li><strong>Typing Games:</strong> Fun way to practice (Word Rain, Speed Racer, etc.)</li>
            <li><strong>Exam Mode:</strong> SSC, Banking style tests</li>
            <li><strong>Daily Challenges:</strong> Keep motivated with daily goals</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Conclusion</h2>
          <p className="text-muted-foreground mb-4">
            Typing seekhna difficult nahi hai - bas patience aur consistency chahiye. Jo steps humne bataye unhe follow karo, daily practice karo, aur 3-6 months mein aap confident typist ban jaoge.
          </p>
          <p className="text-muted-foreground mb-4">
            Yaad rakho - har expert bhi kabhi beginner tha. Aaj se shuru karo, chhoti chhoti progress celebrate karo, aur keep practicing. All the best for your typing journey!
          </p>

          <div className="bg-primary/10 rounded-xl p-6 mt-8 text-center">
            <p className="text-lg font-medium mb-4">Start Your Practice Now!</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Take Free Typing Test <BookOpen className="w-4 h-4" />
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default TypingPracticeBeginners;
