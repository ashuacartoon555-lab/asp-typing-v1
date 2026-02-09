import Header from '@/components/typing/Header';
import Footer from '@/components/typing/Footer';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react';

const EnglishTypingRules = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-5 py-12">
        <Link to="/tips" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Typing Tips
        </Link>
        
        <article className="prose prose-lg max-w-none">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1 gradient-text">English Typing Test Rules</h1>
              <div className="flex items-center text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" /> 12 min read
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border mb-8">
            <p className="text-lg text-foreground leading-relaxed">
              English typing test ke official rules samajhna bahut zaroori hai - chahe aap government exam de rahe ho ya private job interview. Is article mein hum sab rules detail mein cover karenge: scoring system, error penalties, formatting rules, aur exam-specific guidelines. Sab kuch ek jagah!
            </p>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Basic Typing Test Rules - Standard Guidelines</h2>
          <p className="text-muted-foreground mb-4">
            Most English typing tests follow these standard rules:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li>Type exactly what is shown on screen</li>
            <li>Maintain same capitalization as in passage</li>
            <li>Follow same punctuation and spacing</li>
            <li>Do not skip any words or lines</li>
            <li>Complete within given time limit</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Word Count Calculation Rules</h2>
          <p className="text-muted-foreground mb-4">
            Typing speed measure karne ke liye standard word definition use hoti hai:
          </p>
          <div className="bg-primary/5 rounded-lg p-4 my-4 border-l-4 border-primary">
            <p className="font-medium">Standard Word Definition:</p>
            <p className="text-muted-foreground mt-2">1 Word = 5 Characters (including spaces)</p>
            <p className="text-muted-foreground mt-2">Example: "Hello World" = 11 characters = 2.2 words</p>
          </div>
          <p className="text-muted-foreground mb-4">
            Yeh internationally accepted standard hai jo almost sab typing tests mein use hota hai. Kuch tests "actual words" count karte hain, lekin government exams mein 5-character rule hi follow hota hai.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Gross WPM vs Net WPM</h2>
          <div className="bg-card rounded-lg p-4 my-4 border">
            <p className="font-medium mb-3">Two Types of Speed Measurement:</p>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">Gross WPM (Raw Speed)</p>
                <p>Total keystrokes typed ÷ 5 ÷ Time in minutes</p>
                <p>Errors ko consider nahi karta</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Net WPM (Adjusted Speed)</p>
                <p>Gross WPM - (Uncorrected Errors × Penalty)</p>
                <p>Yeh actual usable speed hai</p>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground mb-4">
            Government exams mein usually Net WPM consider hota hai. Toh errors minimize karna important hai.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Error Types Aur Penalties</h2>
          <p className="text-muted-foreground mb-4">
            Different types of errors aur unke penalties:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">1. Spelling Errors (Full Mistake)</h3>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li>Wrong letter typed ("recieve" instead of "receive")</li>
            <li>Missing letters ("develoment" instead of "development")</li>
            <li>Extra letters ("developement" instead of "development")</li>
            <li><strong>Penalty:</strong> Usually 1 word or 5-10 keystrokes deducted</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2. Capitalization Errors (Half Mistake)</h3>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li>Starting sentence with lowercase</li>
            <li>Proper nouns not capitalized ("india" instead of "India")</li>
            <li>Wrong capitalization ("THE" instead of "The")</li>
            <li><strong>Penalty:</strong> Usually half word or 2.5-5 keystrokes</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">3. Spacing Errors (Half Mistake)</h3>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li>Missing space between words</li>
            <li>Extra space between words</li>
            <li>Space before punctuation</li>
            <li><strong>Penalty:</strong> Usually half word</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">4. Punctuation Errors (Half Mistake)</h3>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li>Missing comma, full stop, apostrophe</li>
            <li>Wrong punctuation mark used</li>
            <li>Extra punctuation added</li>
            <li><strong>Penalty:</strong> Usually half word</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">5. Omission Errors (Full Mistake per word)</h3>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li>Skipping a word completely</li>
            <li>Skipping a line or paragraph</li>
            <li><strong>Penalty:</strong> Each skipped word counts as full error</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">6. Addition Errors (Full Mistake per word)</h3>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li>Typing extra words not in passage</li>
            <li>Repeating words</li>
            <li><strong>Penalty:</strong> Each extra word counts as full error</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Formatting Rules</h2>
          <div className="bg-card rounded-lg p-4 my-4 border">
            <ul className="space-y-3 text-muted-foreground">
              <li><strong>Single Space After Period:</strong> Modern typing standard ek space use karti hai full stop ke baad, not two</li>
              <li><strong>No Space Before Punctuation:</strong> Comma, period, colon ke pehle space nahi aata</li>
              <li><strong>Space After Punctuation:</strong> Comma, period ke baad ek space</li>
              <li><strong>Paragraph Indentation:</strong> Some tests require, some don't - follow the passage</li>
              <li><strong>Line Breaks:</strong> Exactly follow karo jaise passage mein hai</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Special Characters Typing Rules</h2>
          <p className="text-muted-foreground mb-4">
            Special characters ke liye specific rules:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li><strong>Apostrophe ('):</strong> Don't ke "'" mein space nahi - "don't" correct, "don' t" wrong</li>
            <li><strong>Hyphen (-):</strong> No spaces around hyphen - "well-known" correct</li>
            <li><strong>Quotation Marks (" "):</strong> Opening quote ke baad no space, closing quote ke pehle no space</li>
            <li><strong>Parentheses ( ):</strong> Space before opening, space after closing</li>
            <li><strong>Colon (:):</strong> No space before, one space after</li>
            <li><strong>Semicolon (;):</strong> No space before, one space after</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Numbers Typing Rules</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li>Type numbers exactly as shown (don't convert to words)</li>
            <li>Use proper punctuation in large numbers if shown (1,000,000)</li>
            <li>Decimal points aur currency symbols exact copy karo</li>
            <li>Dates ka format same rakhho (01/01/2024 vs January 1, 2024)</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Government Exam Specific Rules</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">SSC Typing Test Rules</h3>
          <div className="bg-card rounded-lg p-4 my-4 border">
            <ul className="space-y-2 text-muted-foreground">
              <li>• Passage screen par show hota hai - exactly copy karo</li>
              <li>• Backspace allowed hai corrections ke liye</li>
              <li>• Save/Submit button click karna padta hai end mein</li>
              <li>• Net speed = Gross speed - (Mistakes × 10) / Time</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Court/Legal Typing Test Rules</h3>
          <div className="bg-card rounded-lg p-4 my-4 border">
            <ul className="space-y-2 text-muted-foreground">
              <li>• Legal terminology exact match hona chahiye</li>
              <li>• Case names aur citations proper format mein</li>
              <li>• Higher accuracy required (usually 90%+)</li>
              <li>• Speed requirement: Usually 40-50 WPM</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Common Rule Violations Aur How to Avoid</h2>
          <div className="bg-card rounded-lg p-4 my-4 border">
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <p className="font-medium text-foreground">❌ Auto-correct use karna</p>
                <p>Exam systems mein auto-correct disabled hota hai. Practice bhi bina auto-correct ke karo.</p>
              </li>
              <li>
                <p className="font-medium text-foreground">❌ Copy-paste try karna</p>
                <p>Disabled hota hai aur flag ho sakta hai. Don't even try.</p>
              </li>
              <li>
                <p className="font-medium text-foreground">❌ Looking at keyboard</p>
                <p>Screen par passage hai - wahan focus karo, keyboard nahi dekhna.</p>
              </li>
              <li>
                <p className="font-medium text-foreground">❌ Rushing at the end</p>
                <p>Last minute mein speed badhane se errors badhte hain. Steady pace maintain karo.</p>
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Accuracy Standards</h2>
          <p className="text-muted-foreground mb-4">
            Different organizations ke different accuracy standards:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li><strong>Government Exams:</strong> Usually 90%+ accuracy expected</li>
            <li><strong>Professional Typing:</strong> 95%+ accuracy standard hai</li>
            <li><strong>Data Entry Jobs:</strong> 98%+ accuracy required</li>
            <li><strong>Medical/Legal Transcription:</strong> 99%+ accuracy mandatory</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Keyboard Layout Rules</h2>
          <p className="text-muted-foreground mb-4">
            English typing tests mein QWERTY layout use hota hai:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li>Standard 104-key layout expected</li>
            <li>Num pad optional, but helpful for numbers</li>
            <li>Function keys usually not required</li>
            <li>Practice on similar keyboard layout as exam center</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Time Management Rules</h2>
          <div className="bg-primary/5 rounded-lg p-4 my-4 border-l-4 border-primary">
            <p className="font-medium">Smart Time Strategy:</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• First 2 minutes: Warm up, get comfortable pace</li>
              <li>• Middle period: Maintain steady speed</li>
              <li>• Last 2 minutes: Don't rush, focus on completing cleanly</li>
              <li>• If ahead of time: Slow down slightly, reduce errors</li>
              <li>• If behind: Slightly increase pace, but don't panic</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mt-8 mb-4">Practice Tips to Master Rules</h2>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li>Practice with auto-correct OFF</li>
            <li>Use exam-style passages for practice</li>
            <li>Time yourself strictly</li>
            <li>Review your errors after each test</li>
            <li>Focus on consistent accuracy before speed</li>
            <li>Learn proper finger placement</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4">Conclusion</h2>
          <p className="text-muted-foreground mb-4">
            English typing test rules simple hain agar aap samajh lo. Key points: exactly match the passage, minimize errors, maintain steady speed, aur time manage karo. Rules jaanne ke baad practice karo toh exam mein confidence rahega.
          </p>
          <p className="text-muted-foreground mb-4">
            Hamare typing test mein bhi same rules follow hote hain. Regular practice se aap exam-ready ho jaoge. Start practicing today!
          </p>

          <div className="bg-primary/10 rounded-xl p-6 mt-8 text-center">
            <p className="text-lg font-medium mb-4">Practice with Official Rules</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Take Typing Test <CheckCircle className="w-4 h-4" />
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default EnglishTypingRules;
