import { Target, TrendingDown, Zap, Brain } from 'lucide-react';
import { Button } from './ui/button';

interface WeakSpot {
  character: string;
  errors: number;
  attempts: number;
  accuracy: number;
}

interface WeakWord {
  word: string;
  errors: number;
  attempts: number;
  avgTime: number;
}

interface WeakSpotTrainingProps {
  weakCharacters: WeakSpot[];
  weakWords: WeakWord[];
  improvementSuggestion: string;
  onStartCustomPractice: () => void;
}

const WeakSpotTraining = ({ 
  weakCharacters, 
  weakWords, 
  improvementSuggestion,
  onStartCustomPractice 
}: WeakSpotTrainingProps) => {
  if (weakCharacters.length === 0 && weakWords.length === 0) {
    return (
      <div className="card-gradient p-6 rounded-2xl border border-border">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <Target className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-lg font-bold mb-2">Perfect Performance! 🎯</h3>
          <p className="text-sm text-muted-foreground">
            No weak spots detected. Keep up the excellent work!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-gradient p-6 rounded-2xl border border-border space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Weak Spot Analysis
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            AI-identified areas for improvement
          </p>
        </div>
        <Button
          onClick={onStartCustomPractice}
          className="gradient-bg text-white"
          size="sm"
        >
          <Zap className="w-4 h-4 mr-2" />
          Practice Weak Spots
        </Button>
      </div>

      {/* Improvement Suggestion */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <Target className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1">Recommendation</h4>
            <p className="text-sm text-muted-foreground">{improvementSuggestion}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Weak Characters */}
        {weakCharacters.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              Problem Characters ({weakCharacters.length})
            </h4>
            <div className="space-y-2">
              {weakCharacters.slice(0, 5).map((spot, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-muted/50 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center font-mono font-bold text-red-500">
                      {spot.character}
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {spot.errors} error{spot.errors > 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {spot.accuracy.toFixed(1)}% accuracy
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-red-500">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weak Words */}
        {weakWords.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-orange-500" />
              Problem Words ({weakWords.length})
            </h4>
            <div className="space-y-2">
              {weakWords.slice(0, 5).map((word, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-muted/50 p-3 rounded-lg"
                >
                  <div>
                    <div className="text-sm font-medium font-mono">
                      "{word.word}"
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {word.errors} error{word.errors > 1 ? 's' : ''} in {word.attempts} attempt{word.attempts > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-orange-500">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Practice Tip */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Pro Tip:</strong> Click "Practice Weak Spots" to get a custom typing test
          focused on your problem areas. Consistent practice on these specific characters and
          words will rapidly improve your overall accuracy.
        </p>
      </div>
    </div>
  );
};

export default WeakSpotTraining;
