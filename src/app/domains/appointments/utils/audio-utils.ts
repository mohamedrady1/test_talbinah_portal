import { isPlatformBrowser } from '@angular/common';

/**
 * Extracts audio duration from a Blob/File and returns it as a formatted string (hh:mm:ss).
 * Fully SSR-safe: Runs only in the browser.
 */
export async function extractAudioDurationFromBlob(
  blob: Blob,
  platformId: Object
): Promise<string | null> {
  if (!isPlatformBrowser(platformId)) {
    // Running on the server: return null
    return null;
  }

  return new Promise((resolve, reject) => {
    try {
      // Lazily create browser-only APIs inside this block
      const AudioContextCtor =
        (window as any).AudioContext || (window as any).webkitAudioContext;

      if (!AudioContextCtor) {
        reject(new Error('AudioContext is not supported in this browser.'));
        return;
      }

      const audioContext = new AudioContextCtor();
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer | null;
          if (!arrayBuffer) {
            reject(new Error('Failed to read Blob as ArrayBuffer.'));
            return;
          }

          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

          const totalSeconds = Math.floor(audioBuffer.duration);

          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;

          const formatted = [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0'),
          ].join(':');

          resolve(formatted);
        } catch (err) {
          console.error('Error decoding audio data:', err);
          reject(new Error('Failed to decode audio data.'));
        } finally {
          if (audioContext.state !== 'closed') {
            audioContext.close();
          }
        }
      };

      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        reject(new Error('Failed to read Blob.'));
      };

      reader.readAsArrayBuffer(blob);
    } catch (err) {
      reject(new Error('Audio decoding setup failed.'));
    }
  });
}
