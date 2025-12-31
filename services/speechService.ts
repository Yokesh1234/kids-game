
/**
 * Speech Recognition matching logic explanation:
 * We use the Web Speech API's SpeechRecognition interface. 
 * We convert both the target word and the heard transcript to lower-case.
 * We check if the heard string *contains* the target word (string.includes) 
 * to handle filler words kids might say like "um, apple" or "it is a car".
 */

export const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    // Cancel any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to pick a "friendly" voice
    const voices = window.speechSynthesis.getVoices();
    // Some browsers might not have voices loaded yet
    const childFriendlyVoice = voices.find(v => v.lang.includes('en-US') && v.name.includes('Google')) || voices[0];
    
    if (childFriendlyVoice) {
      utterance.voice = childFriendlyVoice;
    }
    
    utterance.pitch = 1.2; // Slightly higher pitch for "friendly" vibe
    utterance.rate = 0.9;  // Slightly slower for clarity
    window.speechSynthesis.speak(utterance);
  }
};

export const listen = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      reject('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      resolve(transcript);
    };

    recognition.onerror = (event: any) => {
      reject(event.error);
    };

    recognition.onend = () => {
      // Logic for cleanup if needed
    };

    recognition.start();
  });
};
