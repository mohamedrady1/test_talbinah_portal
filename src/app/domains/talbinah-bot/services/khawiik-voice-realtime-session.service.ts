import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { IKhawiikVoiceRealtimeSessionDataDto } from '../dtos';
import { Logger } from '../../../common';

export type VoiceSessionState = 'idle' | 'connecting' | 'connected' | 'error';

@Injectable({
  providedIn: 'root'
})
export class RealtimeVoiceSessionService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // --- State ---
  private readonly _connectionState = signal<VoiceSessionState>('idle');
  readonly connectionState = this._connectionState.asReadonly();

  private readonly _logs = signal<string[]>([]);
  readonly logs = this._logs.asReadonly();

  private readonly _incomingMessages = signal<string[]>([]);
  readonly incomingMessages = this._incomingMessages.asReadonly();

  private readonly _currentMessage = signal<string>('');
  readonly currentMessage = this._currentMessage.asReadonly();

  private readonly _nextMessage = signal<string>('');
  readonly nextMessage = this._nextMessage.asReadonly();

  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private localMediaStream: MediaStream | null = null;

  private sessionData: IKhawiikVoiceRealtimeSessionDataDto | null = null;
  private refreshTimer: any = null;

  // rotating message index
  private messageIndex = 0;

  constructor() { }

  /**
   * Start a realtime WebRTC session (browser only)
   */
  async startSession(session: IKhawiikVoiceRealtimeSessionDataDto | null): Promise<void> {
    if (!this.isBrowser) {
      Logger.warn('RealtimeVoiceSessionService: Skipping WebRTC init (SSR).');
      return;
    }

    if (!session) {
      Logger.warn('RealtimeVoiceSessionService: session does not have data');
      return;
    }

    this._connectionState.set('connecting');
    this.sessionData = session;

    try {
      this.log('Starting realtime session…');

      const { ephemeral_key, webrtc_url, deployment, seconds_until_expiry } = session;

      this.peerConnection = new RTCPeerConnection();

      // --- Remote audio playback ---
      this.audioElement = document.createElement('audio');
      this.audioElement.autoplay = true;
      document.body.appendChild(this.audioElement);

      this.peerConnection.ontrack = (event) => {
        if (this.audioElement) {
          this.audioElement.srcObject = event.streams[0];
        }
      };

      // --- Local microphone ---
      const clientMedia = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.localMediaStream = clientMedia; // Store reference for mute/unmute
      const audioTrack = clientMedia.getAudioTracks()[0];
      this.peerConnection.addTrack(audioTrack);

      // --- Data channel ---
      this.dataChannel = this.peerConnection.createDataChannel('realtime-channel');
      this.dataChannel.addEventListener('open', () => {
        this.log('Data channel open');
        this._connectionState.set('connected');
      });

      this.dataChannel.addEventListener('message', (event) => {
        const raw = event.data as string;
        this.log('Incoming message: ' + raw);

        let parsed: any;
        try {
          parsed = JSON.parse(raw);
        } catch {
          parsed = null;
        }

        if (parsed?.type === 'response.audio_transcript.done' && parsed?.transcript) {
          const transcript = parsed.transcript as string;

          this._incomingMessages.update((prev) => [...prev, transcript]);

          // manage current + next messages
          this._handleIncomingMessage(transcript);
        }
      });

      // --- SDP Offer ---
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      const sdpResponse = await fetch(`${webrtc_url}?model=${deployment}`, {
        method: 'POST',
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${ephemeral_key}`,
          'Content-Type': 'application/sdp',
        },
      });

      const answer: RTCSessionDescriptionInit = {
        type: 'answer',
        sdp: await sdpResponse.text(),
      };
      await this.peerConnection.setRemoteDescription(answer);

      this._connectionState.set('connected');
      this.log('Session started successfully.');

      // auto-refresh before expiry (90s buffer)
      this.scheduleRefresh(seconds_until_expiry);
    } catch (error: any) {
      this._connectionState.set('error');
      this.log('Error starting session: ' + (error.message ?? error));
      Logger.error('RealtimeVoiceSessionService: ', error);
    }
  }

  /**
   * Mute/unmute the local microphone
   */
  toggleMicrophone(mute: boolean): void {
    if (!this.isBrowser || !this.localMediaStream) return;

    this.localMediaStream.getAudioTracks().forEach(track => {
      track.enabled = !mute;
    });

    this.log(`Microphone ${mute ? 'muted' : 'unmuted'}`);
  }

  /**
   * Stop and cleanup session
   */
  stopSession(): void {
    if (!this.isBrowser) return;

    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    this.peerConnection?.close();
    this.peerConnection = null;

    this.dataChannel?.close();
    this.dataChannel = null;

    this.audioElement?.remove();
    this.audioElement = null;

    // Stop and cleanup local media stream
    if (this.localMediaStream) {
      this.localMediaStream.getTracks().forEach(track => track.stop());
      this.localMediaStream = null;
    }

    this._connectionState.set('idle');
    this.log('Session stopped.');
  }

  /**
   * Clear all stored messages (manual reset)
   */
  clearMessages(): void {
    this._resetMessages();
    this.log('Messages cleared.');
  }

  /**
   * Send message to server over data channel
   */
  sendMessage(message: string): void {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(message);
      this.log('Sent: ' + message);
    } else {
      this.log('⚠️ Data channel not open, message not sent.');
    }
  }

  // --- Private Helpers ---
  private log(message: string): void {
    this._logs.update((prev) => [...prev, message]);
    Logger.debug('RealtimeVoiceSessionService:', message);
  }

  private scheduleRefresh(seconds: number): void {
    if (!seconds) return;

    // refresh a bit earlier than expiry
    const refreshMs = Math.max(0, (seconds - 90) * 1000);
    this.refreshTimer = setTimeout(async () => {
      this.log('Session expiring soon → refreshing...');
      this.stopSession();

      if (this.sessionData) {
        // fetch new ephemeral key from backend here
        await this.startSession(this.sessionData);
      }
    }, refreshMs);
  }

  private _handleIncomingMessage(msg: string): void {
    if (!msg) return;

    // first message
    if (this.messageIndex === 0) {
      this._currentMessage.set(msg);
    }

    // rotate messages
    this._currentMessage.set(msg);
    this._nextMessage.set(''); // next is unknown until another msg arrives
    this.messageIndex++;
  }

  private _resetMessages(): void {
    this.messageIndex = 0;
    this._currentMessage.set('');
    this._nextMessage.set('');
    this._incomingMessages.set([]);
  }

  /**
   * Restart session with new voice while preserving chat history
   */
  async restartSession(session: IKhawiikVoiceRealtimeSessionDataDto | null): Promise<void> {
    if (!this.isBrowser) return;

    this.log('Restarting realtime session with new voice…');

    try {
      // Store current messages to preserve chat history
      const currentMessages = [...this._incomingMessages()];
      const currentMessage = this._currentMessage();
      const nextMessage = this._nextMessage();
      const currentMessageIndex = this.messageIndex;

      // Stop current session but DON'T clear messages
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
        this.refreshTimer = null;
      }

      this.peerConnection?.close();
      this.dataChannel?.close();
      this.audioElement?.remove();

      // Stop local media stream but keep reference for reconnection
      if (this.localMediaStream) {
        this.localMediaStream.getTracks().forEach(track => track.stop());
        this.localMediaStream = null;
      }

      this.peerConnection = null;
      this.dataChannel = null;
      this.audioElement = null;

      // Recreate the session with new voice data
      await this.startSession(session);

      // Restore previous messages and state
      this._incomingMessages.set(currentMessages);
      this._currentMessage.set(currentMessage);
      this._nextMessage.set(nextMessage);
      this.messageIndex = currentMessageIndex;

      this.log('Realtime session restarted successfully with preserved chat history.');
    } catch (error: any) {
      this._connectionState.set('error');
      this.log('Error restarting session: ' + (error.message ?? error));
    }
  }
}
