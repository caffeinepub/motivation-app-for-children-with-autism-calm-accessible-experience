export function isTTSSupported(): boolean {
  return 'speechSynthesis' in window;
}

export function speak(text: string): void {
  if (!isTTSSupported()) {
    console.warn('Text-to-speech is not supported in this browser');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1.1; // Slightly higher, friendlier tone
  utterance.volume = 0.8;

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (isTTSSupported()) {
    window.speechSynthesis.cancel();
  }
}
