import { AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorLocation {
  position: number;
  character: string;
  expectedCharacter: string;
  timestamp: number;
  corrected: boolean;
}

interface ErrorLocationTrackerProps {
  errors: ErrorLocation[];
  promptText: string;
  onClear?: () => void;
}

const ErrorLocationTracker = ({ errors, promptText, onClear }: ErrorLocationTrackerProps) => {
  if (errors.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-success/10 border border-success/30 text-center">
        <CheckCircle className="w-6 h-6 text-success mx-auto mb-2" />
        <p className="text-sm font-medium text-success">Perfect! No errors detected.</p>
      </div>
    );
  }

  // Group errors by position
  const errorsByPosition = errors.reduce((acc, error) => {
    if (!acc[error.position]) {
      acc[error.position] = [];
    }
    acc[error.position].push(error);
    return acc;
  }, {} as Record<number, ErrorLocation[]>);

  const getWordAtPosition = (pos: number) => {
    let wordStart = pos;
    let wordEnd = pos;
    while (wordStart > 0 && promptText[wordStart - 1] !== ' ') wordStart--;
    while (wordEnd < promptText.length && promptText[wordEnd] !== ' ') wordEnd++;
    return {
      word: promptText.substring(wordStart, wordEnd),
      start: wordStart,
      end: wordEnd,
    };
  };

  return (
    <div className="space-y-4 p-4 rounded-lg bg-card border border-border/30">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-danger" />
          Error Locations ({errors.length})
        </h3>
        {onClear && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onClear}
            className="gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {Object.entries(errorsByPosition).map(([pos, errorList]) => {
          const position = Number(pos);
          const { word, start } = getWordAtPosition(position);
          const lastError = errorList[errorList.length - 1];
          const charIndex = position - start;

          return (
            <div
              key={pos}
              className="p-3 rounded-lg bg-muted/20 border-l-4 border-danger hover:bg-muted/30 transition-colors"
            >
              <div className="grid grid-cols-2 gap-3">
                {/* Error Details */}
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Position: {position + 1}</div>
                  <div className="text-sm font-semibold">
                    Error in: <span className="text-danger">{word}</span>
                  </div>
                </div>

                {/* Character Info */}
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">Character</div>
                  <div className="flex justify-end gap-2">
                    <div className="px-2 py-1 rounded bg-danger/20 text-danger text-sm font-mono font-bold">
                      {lastError.character || '·'}
                    </div>
                    <div className="px-2 py-1 rounded bg-success/20 text-success text-sm font-mono font-bold">
                      {lastError.expectedCharacter}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="mt-2 flex items-center gap-2">
                {lastError.corrected ? (
                  <span className="text-xs px-2 py-1 rounded-full bg-success/20 text-success">
                    ✓ Corrected
                  </span>
                ) : (
                  <span className="text-xs px-2 py-1 rounded-full bg-danger/20 text-danger">
                    ✗ Not corrected
                  </span>
                )}
                {errorList.length > 1 && (
                  <span className="text-xs px-2 py-1 rounded-full bg-warning/20 text-warning">
                    {errorList.length}x mistake
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/30">
        <div className="text-center p-2 rounded bg-muted/20">
          <div className="text-xs text-muted-foreground">Total Errors</div>
          <div className="text-lg font-bold text-danger">{errors.length}</div>
        </div>
        <div className="text-center p-2 rounded bg-muted/20">
          <div className="text-xs text-muted-foreground">Unique Positions</div>
          <div className="text-lg font-bold text-warning">{Object.keys(errorsByPosition).length}</div>
        </div>
        <div className="text-center p-2 rounded bg-muted/20">
          <div className="text-xs text-muted-foreground">Corrected</div>
          <div className="text-lg font-bold text-success">
            {errors.filter((e) => e.corrected).length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorLocationTracker;
