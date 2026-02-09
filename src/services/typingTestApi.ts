/**
 * Typing Test API Service
 * Provides APIs for fetching typing test content from various sources
 */

export interface TypingTestApiResponse {
  text: string;
  source: string;
  wordCount: number;
  charCount: number;
}

export interface ThreeLinesResponse {
  lines: string[];
  fullText: string;
  wordCount: number;
}

/**
 * API 1: Fetch random quotes for typing practice
 */
export async function fetchQuotesApi(limit: number = 10): Promise<TypingTestApiResponse> {
  try {
    const response = await fetch(`https://api.quotable.io/quotes?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    const text = data.results
      .map((item: { content: string }) => item.content)
      .join(" ");
    
    return {
      text,
      source: 'quotable.io',
      wordCount: text.split(' ').length,
      charCount: text.length
    };
  } catch (error) {
    console.error('fetchQuotesApi error:', error);
    throw error;
  }
}

/**
 * API 2: Fetch typing text from Bacon Ipsum (Lorem ipsum generator)
 */
export async function fetchBaconIpsumApi(paragraphs: number = 3): Promise<TypingTestApiResponse> {
  try {
    const response = await fetch(
      `https://baconipsum.com/api/?type=meat-and-filler&paras=${paragraphs}&format=text`
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const text = await response.text();
    
    return {
      text: text.trim(),
      source: 'baconipsum.com',
      wordCount: text.split(' ').length,
      charCount: text.length
    };
  } catch (error) {
    console.error('fetchBaconIpsumApi error:', error);
    throw error;
  }
}

/**
 * API 3: Fetch random text from Lorem Ipsum API
 */
export async function fetchLoremIpsumApi(length: 'short' | 'medium' | 'long' = 'medium'): Promise<TypingTestApiResponse> {
  const lengthMap = {
    short: 3,
    medium: 5,
    long: 10
  };
  
  try {
    const paragraphs = lengthMap[length];
    const response = await fetch(
      `https://loripsum.net/api/${paragraphs}/medium/plaintext`
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const text = await response.text();
    
    return {
      text: text.trim(),
      source: 'loripsum.net',
      wordCount: text.split(' ').length,
      charCount: text.length
    };
  } catch (error) {
    console.error('fetchLoremIpsumApi error:', error);
    throw error;
  }
}

/**
 * API 4: Generate exactly 3 lines of typing text (90 chars per line)
 * This splits the text to fit the UnifiedTypingBox's 3-line display
 */
export async function fetchThreeLinesApi(): Promise<ThreeLinesResponse> {
  try {
    // Fetch text from quotes API
    const response = await fetchQuotesApi(5);
    const fullText = response.text;
    
    // Split into words
    const words = fullText.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    // Create exactly 3 lines with ~90 chars each
    for (let i = 0; i < 3; i++) {
      currentLine = '';
      while (words.length > 0 && currentLine.length < 85) {
        const word = words.shift();
        if (!word) break;
        
        if ((currentLine + ' ' + word).trim().length <= 90) {
          currentLine = (currentLine + ' ' + word).trim();
        } else {
          words.unshift(word);
          break;
        }
      }
      if (currentLine) {
        lines.push(currentLine);
      }
    }
    
    const reconstructedText = lines.join(' ');
    
    return {
      lines,
      fullText: reconstructedText,
      wordCount: reconstructedText.split(' ').length
    };
  } catch (error) {
    console.error('fetchThreeLinesApi error:', error);
    
    // Fallback: Generate 3 lines from predefined text
    const fallbackText = "Practice makes perfect. Typing speed improves with consistency and dedication. The quick brown fox jumps over the lazy dog. Success is not final, failure is not fatal. It is the courage to continue that counts. Technology is best when it brings people together and helps achieve goals.";
    const words = fallbackText.split(' ');
    const lines: string[] = [];
    
    for (let i = 0; i < 3; i++) {
      let currentLine = '';
      while (words.length > 0 && currentLine.length < 85) {
        const word = words.shift();
        if (!word) break;
        if ((currentLine + ' ' + word).trim().length <= 90) {
          currentLine = (currentLine + ' ' + word).trim();
        } else {
          words.unshift(word);
          break;
        }
      }
      if (currentLine) lines.push(currentLine);
    }
    
    return {
      lines,
      fullText: lines.join(' '),
      wordCount: lines.join(' ').split(' ').length
    };
  }
}

/**
 * API 5: Fetch random advice for typing motivation
 */
export async function fetchAdviceApi(): Promise<{ advice: string; source: string }> {
  try {
    const response = await fetch('https://api.adviceslip.com/advice');
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      advice: data.slip.advice,
      source: 'adviceslip.com'
    };
  } catch (error) {
    console.error('fetchAdviceApi error:', error);
    return {
      advice: 'Keep practicing and you will improve!',
      source: 'fallback'
    };
  }
}

/**
 * API 6: Fetch programming quotes for coding-themed typing tests
 */
export async function fetchProgrammingQuotesApi(): Promise<TypingTestApiResponse> {
  try {
    const response = await fetch('https://programming-quotes-api.herokuapp.com/quotes/random');
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    const text = `${data.en} — ${data.author}`;
    
    return {
      text,
      source: 'programming-quotes-api',
      wordCount: text.split(' ').length,
      charCount: text.length
    };
  } catch (error) {
    console.error('fetchProgrammingQuotesApi error:', error);
    
    // Fallback programming quotes
    const fallbackQuotes = [
      "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
      "First, solve the problem. Then, write the code.",
      "Code is like humor. When you have to explain it, it's bad.",
      "Make it work, make it right, make it fast."
    ];
    
    const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    
    return {
      text: randomQuote,
      source: 'fallback',
      wordCount: randomQuote.split(' ').length,
      charCount: randomQuote.length
    };
  }
}

/**
 * Helper: Combine multiple API calls for longer text
 */
export async function fetchCombinedTextApi(sources: number = 3): Promise<TypingTestApiResponse> {
  try {
    const promises = [];
    
    for (let i = 0; i < sources; i++) {
      promises.push(fetchQuotesApi(5));
    }
    
    const results = await Promise.all(promises);
    const combinedText = results.map(r => r.text).join(' ');
    
    return {
      text: combinedText,
      source: 'combined',
      wordCount: combinedText.split(' ').length,
      charCount: combinedText.length
    };
  } catch (error) {
    console.error('fetchCombinedTextApi error:', error);
    throw error;
  }
}

/**
 * API 7: Fetch random words from Random Word API
 */
export async function fetchRandomWordsApi(count: number = 200): Promise<TypingTestApiResponse> {
  try {
    const response = await fetch(`https://random-word-api.herokuapp.com/word?number=${count}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const words: string[] = await response.json();
    const text = words.join(' ');
    
    return {
      text,
      source: 'random-word-api',
      wordCount: words.length,
      charCount: text.length
    };
  } catch (error) {
    console.error('fetchRandomWordsApi error:', error);
    
    // Fallback words
    const fallbackWords = ['the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'practice', 'makes', 'perfect', 'typing', 'speed', 'improves', 'with', 'consistency'];
    const text = Array(count).fill(0).map(() => fallbackWords[Math.floor(Math.random() * fallbackWords.length)]).join(' ');
    
    return {
      text,
      source: 'fallback',
      wordCount: count,
      charCount: text.length
    };
  }
}

/**
 * API 7b: Fetch a single random sentence from Quotable with length bounds
 */
export async function fetchQuotableRandomApi(
  minLength: number = 80,
  maxLength: number = 200
): Promise<TypingTestApiResponse> {
  try {
    const response = await fetch(
      `https://api.quotable.io/random?minLength=${minLength}&maxLength=${maxLength}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data: { content: string } = await response.json();
    const text = data.content;

    return {
      text,
      source: 'quotable.io',
      wordCount: text.split(' ').length,
      charCount: text.length
    };
  } catch (error) {
    console.error('fetchQuotableRandomApi error:', error);
    // Fallback to quote list API
    return fetchQuotesApi(1);
  }
}

/**
 * API 7c: Fetch a random paragraph from Wikipedia summary
 */
export async function fetchWikipediaSummaryApi(): Promise<TypingTestApiResponse> {
  try {
    const response = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary');

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data: { extract: string } = await response.json();
    const text = (data.extract || '').replace(/\n/g, ' ').trim();

    return {
      text,
      source: 'wikipedia',
      wordCount: text.split(' ').length,
      charCount: text.length
    };
  } catch (error) {
    console.error('fetchWikipediaSummaryApi error:', error);
    return fetchBaconIpsumApi(2);
  }
}

/**
 * API 7d: Fetch a random number fact (single line)
 */
export async function fetchNumbersTriviaApi(): Promise<TypingTestApiResponse> {
  try {
    let response = await fetch('http://numbersapi.com/random/trivia');

    if (!response.ok) {
      response = await fetch('https://numbersapi.com/random/trivia');
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const text = (await response.text()).trim();

    return {
      text,
      source: 'numbersapi',
      wordCount: text.split(' ').length,
      charCount: text.length
    };
  } catch (error) {
    console.error('fetchNumbersTriviaApi error:', error);
    return fetchNumbersApi(1);
  }
}

/**
 * API 7e: Fetch GitHub README for programming mode
 * Decodes base64 and strips basic markdown
 */
export async function fetchProgrammingReadmeApi(): Promise<TypingTestApiResponse> {
  try {
    const response = await fetch('https://api.github.com/repos/freeCodeCamp/freeCodeCamp/readme');

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data: { content: string } = await response.json();
    const decoded = atob(data.content || '');
    const text = decoded
      .replace(/[#>*`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      text,
      source: 'github-readme',
      wordCount: text.split(' ').length,
      charCount: text.length
    };
  } catch (error) {
    console.error('fetchProgrammingReadmeApi error:', error);
    return fetchProgrammingQuotesApi();
  }
}

/**
 * API 8: Fetch related/difficulty-based words from Datamuse API
 */
export async function fetchDatamuseWordsApi(
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  count: number = 50
): Promise<TypingTestApiResponse> {
  try {
    // Datamuse queries by topic/difficulty
    const topics = {
      easy: 'common words',
      medium: 'general vocabulary',
      hard: 'advanced vocabulary'
    };
    
    const maxLength = {
      easy: 5,
      medium: 8,
      hard: 12
    };
    
    // Fetch words with max length constraint
    const response = await fetch(
      `https://api.datamuse.com/words?topics=${encodeURIComponent(topics[difficulty])}&max=${count * 2}`
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data: { word: string; score: number }[] = await response.json();
    
    // Filter by length for difficulty
    const filteredWords = data
      .filter(item => item.word.length <= maxLength[difficulty])
      .slice(0, count)
      .map(item => item.word);
    
    const text = filteredWords.join(' ');
    
    return {
      text,
      source: 'datamuse',
      wordCount: filteredWords.length,
      charCount: text.length
    };
  } catch (error) {
    console.error('fetchDatamuseWordsApi error:', error);
    
    // Fallback to random words
    return fetchRandomWordsApi(count);
  }
}

/**
 * API 9: Fetch number facts and sequences from Numbers API
 */
export async function fetchNumbersApi(count: number = 5): Promise<TypingTestApiResponse> {
  try {
    const promises = [];
    
    // Fetch random number facts (using HTTPS proxy or direct)
    for (let i = 0; i < count; i++) {
      const randomNum = Math.floor(Math.random() * 100);
      promises.push(
        fetch(`https://numbersapi.com/${randomNum}/trivia`)
          .then(r => r.text())
          .catch(() => `${randomNum} is an interesting number.`)
      );
    }
    
    const facts = await Promise.all(promises);
    const text = facts.join(' ');
    
    return {
      text,
      source: 'numbersapi',
      wordCount: text.split(' ').length,
      charCount: text.length
    };
  } catch (error) {
    console.error('fetchNumbersApi error:', error);
    
    // Fallback number sequences
    const sequences = [];
    for (let i = 0; i < count * 10; i++) {
      sequences.push(Math.floor(Math.random() * 1000));
    }
    const text = sequences.join(' ');
    
    return {
      text,
      source: 'fallback',
      wordCount: sequences.length,
      charCount: text.length
    };
  }
}

/**
 * API 10: INFINITE MODE - Never-ending text stream
 * Rotates through all available APIs for continuous content
 */
export async function fetchInfiniteTextApi(): Promise<TypingTestApiResponse> {
  const apiPool = [
    () => fetchQuotesApi(8),
    () => fetchRandomWordsApi(40),
    () => fetchBaconIpsumApi(2),
    () => fetchProgrammingQuotesApi(),
    () => fetchNumbersApi(3),
    () => fetchDatamuseWordsApi('medium', 30)
  ];
  
  // Randomly select 2-3 APIs and combine
  const numAPIs = Math.floor(Math.random() * 2) + 2; // 2 or 3 APIs
  const selectedAPIs = [];
  
  for (let i = 0; i < numAPIs; i++) {
    const randomIndex = Math.floor(Math.random() * apiPool.length);
    selectedAPIs.push(apiPool[randomIndex]());
  }
  
  try {
    const results = await Promise.all(selectedAPIs);
    const combinedText = results.map(r => r.text).join(' ');
    
    return {
      text: combinedText,
      source: 'infinite-mode',
      wordCount: combinedText.split(' ').length,
      charCount: combinedText.length
    };
  } catch (error) {
    console.error('fetchInfiniteTextApi error:', error);
    
    // Fallback to quotes
    return fetchQuotesApi(10);
  }
}
