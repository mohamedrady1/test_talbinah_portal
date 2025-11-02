import {
  Injectable,
  PLATFORM_ID,
  inject,
  signal,
  DestroyRef,
  effect,
  NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../assets/environments/environment';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Logger } from '../utilities';

export interface RemoteUser {
  uid: string | number;
  videoTrack?: any;
  audioTrack?: any;
  hasVideo: boolean;
  hasAudio: boolean;
  elementId?: string;
  audioContext?: AudioContext;
  analyser?: AnalyserNode;
  audioSource?: MediaStreamAudioSourceNode;
  codec?: 'vp8' | 'h264';
}

@Injectable({ providedIn: 'root' })
export class AgoraRtcService {
  private readonly APP_ID = environment.agoraAppId;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  private readonly zone = inject(NgZone);

  // SDK instances
  private AgoraRTC: any = null;
  private agoraClient: any = null;

  // Local tracks
  public localAudioTrack: any = null;
  public localVideoTrack: any = null;

  // State signals
  public readonly isJoined = signal(false);
  public readonly remoteUsers = signal<RemoteUser[]>([]);
  public readonly audioMuted = signal(true);
  public readonly videoMuted = signal(true);
  public readonly audioVolume = signal(100);
  public readonly screenSharing = signal(false);
  public readonly hasAudioPermission = signal(false);
  public readonly hasVideoPermission = signal(false);
  public readonly preferredCodec = signal<'vp8' | 'h264'>('vp8');

  // Constants
  private readonly volumeStorageKey = 'agora_audio_volume';
  private readonly SDK_SCRIPT_ID = 'agora-rtc-sdk';
  private readonly SDK_VERSION = '4.23.4';
  private currentChannel: string = '';
  private currentUid: string | number = '';
  private currentToken: string = '';

  private localScreenTrack: any = null;
  public readonly hasScreenSharePermission = signal(false);

  public readonly connectionQuality = signal<
    'excellent' | 'good' | 'poor' | 'disconnected'
  >('excellent');
  public readonly connectionStats = signal<{
    uplink: number;
    downlink: number;
    rtt: number;
  }>({ uplink: 0, downlink: 0, rtt: 0 });

  constructor() {
    if (this.isBrowser) {
      this.initializeVolume();
      this.setupDebugEffects();
      this.checkPermissions();
    }
  }

  private async checkPermissions(): Promise<void> {
    try {
      const micPermission = await navigator.permissions.query({
        name: 'microphone' as any,
      });
      const cameraPermission = await navigator.permissions.query({
        name: 'camera' as any,
      });

      this.hasAudioPermission.set(micPermission.state === 'granted');
      this.hasVideoPermission.set(cameraPermission.state === 'granted');

      micPermission.onchange = () =>
        this.hasAudioPermission.set(micPermission.state === 'granted');
      cameraPermission.onchange = () =>
        this.hasVideoPermission.set(cameraPermission.state === 'granted');
    } catch (error) {
      Logger.debug(
        '[AgoraRtcService] Permission API not supported, using fallback'
      );
      this.hasAudioPermission.set(true);
      this.hasVideoPermission.set(true);
    }
  }

  private initializeVolume(): void {
    const savedVolume = localStorage.getItem(this.volumeStorageKey);
    if (savedVolume !== null) {
      this.audioVolume.set(Number(savedVolume));
    }
  }

  private setupDebugEffects(): void {
    effect(() => {
      Logger.debug('[AgoraRtcService] Remote users state:', this.remoteUsers());
    });
  }

  private async loadAgoraSdk(): Promise<void> {
    if (this.AgoraRTC) return;

    Logger.debug('[AgoraRtcService] Loading Agora SDK...');

    return new Promise<void>((resolve, reject) => {
      if ((window as any).AgoraRTC) {
        this.AgoraRTC = (window as any).AgoraRTC;
        Logger.debug('[AgoraRtcService] SDK already available');
        return resolve();
      }

      const script = document.createElement('script');
      script.id = this.SDK_SCRIPT_ID;
      script.src = `https://download.agora.io/sdk/release/AgoraRTC_N-${this.SDK_VERSION}.js`;
      script.async = true;

      script.onload = () => {
        this.AgoraRTC = (window as any).AgoraRTC;
        if (this.AgoraRTC) {
          Logger.debug(
            '[AgoraRtcService] SDK loaded, version:',
            this.AgoraRTC.VERSION
          );
          resolve();
        } else {
          reject(new Error('AgoraRTC global object not found after load'));
        }
      };

      script.onerror = (error) => {
        Logger.error('[AgoraRtcService] SDK script load failed:', error);
        reject(new Error('Failed to load Agora SDK script'));
      };

      document.head.appendChild(script);
    });
  }

  private async initializeClient(): Promise<void> {
    if (this.agoraClient) return;

    try {
      await this.loadAgoraSdk();

      if (!this.AgoraRTC) {
        throw new Error('Agora SDK not available');
      }

      this.agoraClient = this.AgoraRTC.createClient({
        mode: 'rtc',
        codec: this.preferredCodec(), // Use preferred codec
        proxyConfig: {
          proxyType: 'cloud',
          turnServer: {
            turnServerSTUN: 'stun:global.stun.twilio.com:3478?transport=udp',
            forceturn: false,
            udpport: '3478',
            tcpport: '3478',
          },
        },
      });

      this.AgoraRTC.setLogLevel(1);
      this.AgoraRTC.enableLogUpload();

      this.setupEventHandlers();
      Logger.debug('[AgoraRtcService] Client initialized with event handlers');
    } catch (error) {
      Logger.error('[AgoraRtcService] Client initialization failed:', error);
      throw error;
    }
  }

  private setupEventHandlers(): void {
    if (!this.agoraClient) return;

    this.agoraClient.removeAllListeners();

    const runInZone = (fn: (...args: any[]) => void) => {
      return (...args: any[]) => this.zone.run(() => fn(...args));
    };

    this.agoraClient.on(
      'user-joined',
      runInZone((user: any) => {
        Logger.debug('[AgoraRtcService] User joined:', user.uid);
        this.addRemoteUser(user.uid);
      })
    );

    this.agoraClient.on(
      'user-published',
      runInZone(async (user: any, mediaType: 'video' | 'audio') => {
        Logger.debug(
          `[AgoraRtcService] User ${user.uid} published ${mediaType}`
        );
        await this.handleUserPublished(user, mediaType);
      })
    );

    this.agoraClient.on(
      'user-unpublished',
      runInZone((user: any, mediaType: 'video' | 'audio') => {
        Logger.debug(
          `[AgoraRtcService] User ${user.uid} unpublished ${mediaType}`
        );
        this.handleUserUnpublished(user, mediaType);
      })
    );

    this.agoraClient.on(
      'user-left',
      runInZone((user: any) => {
        Logger.debug(`[AgoraRtcService] User ${user.uid} left`);
        this.removeRemoteUser(user.uid);
      })
    );

    this.agoraClient.on(
      'connection-state-change',
      runInZone((curState: string) => {
        Logger.debug(`[AgoraRtcService] Connection state: ${curState}`);
        if (['DISCONNECTED', 'CLOSED'].includes(curState)) {
          this.cleanup();
        }
      })
    );

    this.agoraClient.on(
      'stream-type-changed',
      runInZone((uid: any, streamType: any) => {
        Logger.debug(
          `[AgoraRtcService] Stream type changed for ${uid}:`,
          streamType
        );
        this.handleStreamTypeChanged(uid, streamType);
      })
    );

    this.agoraClient.on(
      'stream-fallback',
      runInZone((uid: any, isFallbackOrRecover: any) => {
        Logger.debug(
          `[AgoraRtcService] Stream fallback for ${uid}:`,
          isFallbackOrRecover
        );
        this.handleStreamFallback(uid, isFallbackOrRecover);
      })
    );

    this.agoraClient.on(
      'network-quality',
      runInZone((stats: any) => {
        this.connectionStats.set({
          uplink: stats.uplinkNetworkQuality,
          downlink: stats.downlinkNetworkQuality,
          rtt: stats.rtt,
        });

        const worstQuality = Math.max(
          stats.uplinkNetworkQuality,
          stats.downlinkNetworkQuality
        );
        let quality: 'excellent' | 'good' | 'poor' | 'disconnected' =
          'excellent';

        if (worstQuality >= 5) {
          quality = 'disconnected';
        } else if (worstQuality >= 3) {
          quality = 'poor';
        } else if (worstQuality >= 1) {
          quality = 'good';
        }

        this.connectionQuality.set(quality);
        this.handleNetworkQualityChange(quality);
      })
    );

    this.agoraClient.on(
      'track-ended',
      runInZone((user: any) => {
        Logger.debug(`[AgoraRtcService] Track ended for user ${user.uid}`);
        this.handleTrackEnded(user);
      })
    );
  }

  private handleNetworkQualityChange(
    quality: 'excellent' | 'good' | 'poor' | 'disconnected'
  ): void {
    try {
      switch (quality) {
        case 'poor':
        case 'disconnected':
          this.handlePoorNetwork();
          break;
        case 'good':
          this.setVideoQuality('medium').catch((e) =>
            Logger.debug('[AgoraRtcService] Could not set medium quality:', e)
          );
          break;
        case 'excellent':
          this.setVideoQuality('high').catch((e) =>
            Logger.debug('[AgoraRtcService] Could not set high quality:', e)
          );
          break;
      }
    } catch (error) {
      Logger.error(
        '[AgoraRtcService] Error handling network quality change:',
        error
      );
    }
  }

  public getArabicQualityText(): string {
    switch (this.connectionQuality()) {
      case 'excellent':
        return 'ممتاز';
      case 'good':
        return 'جيد';
      case 'poor':
        return 'ضعيف';
      case 'disconnected':
        return 'متوقف';
      default:
        return 'غير معروف';
    }
  }

  private addRemoteUser(uid: string | number): void {
    this.remoteUsers.update((users) => {
      if (!users.some((u) => u.uid === uid)) {
        return [
          ...users,
          {
            uid,
            hasVideo: false,
            hasAudio: false,
            elementId: `remote-video-${uid}`,
            codec: this.preferredCodec(),
          },
        ];
      }
      return users;
    });
  }

  private async handleUserPublished(
    user: any,
    mediaType: 'video' | 'audio'
  ): Promise<void> {
    try {
      const subscribeOptions = {
        video: {
          optimizationMode: 'detail',
          decoderConfiguration: {
            codec: this.preferredCodec(),
            resolution: '480p',
          },
        },
      };

      await this.agoraClient.subscribe(user, mediaType, subscribeOptions);

      if (typeof user.uid === 'number') {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      this.remoteUsers.update((users) =>
        users.map((u) => {
          if (u.uid === user.uid) {
            const updatedUser = { ...u };

            if (mediaType === 'video') {
              updatedUser.videoTrack = user.videoTrack;
              updatedUser.hasVideo = true;
              this.scheduleVideoPlayback(updatedUser);
            } else {
              updatedUser.audioTrack = user.audioTrack;
              updatedUser.hasAudio = true;
              this.playAudioTrack(user.audioTrack, updatedUser);
            }

            return updatedUser;
          }
          return u;
        })
      );
    } catch (error) {
      Logger.error(
        `[AgoraRtcService] Failed to handle user-published for ${user.uid}:`,
        error
      );
      if (mediaType === 'video') {
        await this.retryVideoSubscription(user);
      }
    }
  }

  private async retryVideoSubscription(user: any): Promise<void> {
    try {
      Logger.debug(
        `[AgoraRtcService] Retrying video subscription for ${user.uid}`
      );

      // Try with alternative codec
      const altCodec = this.preferredCodec() === 'vp8' ? 'h264' : 'vp8';

      try {
        await this.agoraClient.subscribe(user, 'video', {
          optimizationMode: 'detail',
          decoderConfiguration: {
            codec: altCodec,
            resolution: '360p',
          },
        });

        // Update user with alternative codec
        this.remoteUsers.update((users) =>
          users.map((u) => {
            if (u.uid === user.uid) {
              return { ...u, codec: altCodec };
            }
            return u;
          })
        );
      } catch (altError) {
        Logger.error(
          `[AgoraRtcService] Failed to subscribe with ${altCodec}:`,
          altError
        );
        throw altError;
      }

      const remoteUser = this.remoteUsers().find((u) => u.uid === user.uid);
      if (remoteUser?.videoTrack) {
        await remoteUser.videoTrack.setStreamType('high');
      }

      this.remoteUsers.update((users) =>
        users.map((u) => {
          if (u.uid === user.uid) {
            return {
              ...u,
              videoTrack: user.videoTrack,
              hasVideo: true,
            };
          }
          return u;
        })
      );

      const updatedUser = this.remoteUsers().find((u) => u.uid === user.uid);
      if (updatedUser) {
        this.scheduleVideoPlayback(updatedUser);
      }
    } catch (retryError) {
      Logger.error(
        `[AgoraRtcService] Retry failed for ${user.uid}:`,
        retryError
      );
    }
  }

  public async setVideoQuality(
    quality: 'low' | 'medium' | 'high'
  ): Promise<void> {
    try {
      if (
        this.localVideoTrack &&
        typeof this.localVideoTrack.setStreamType === 'function'
      ) {
        await this.localVideoTrack.setStreamType(quality);
      }

      this.remoteUsers().forEach((user) => {
        if (
          user?.videoTrack &&
          typeof user.videoTrack.setStreamType === 'function'
        ) {
          try {
            user.videoTrack.setStreamType(quality);
          } catch (error) {
            Logger.error(
              `[AgoraRtcService] Error setting quality for user ${user.uid}:`,
              error
            );
          }
        }
      });
    } catch (error) {
      Logger.error('[AgoraRtcService] Error setting video quality:', error);
      throw error;
    }
  }

  private scheduleVideoPlayback(user: RemoteUser): void {
    if (!user?.videoTrack || !user?.elementId) return;

    const container = document.getElementById(user.elementId);
    if (container) container.innerHTML = '';

    setTimeout(() => {
      const container = document.getElementById(user.elementId!);
      if (
        container &&
        user?.videoTrack &&
        typeof user.videoTrack.play === 'function'
      ) {
        try {
          user.videoTrack.play(container, { fit: 'cover' });
          Logger.debug(
            `[AgoraRtcService] Video playback started for ${user.uid}`
          );

          if (typeof user.videoTrack.on === 'function') {
            user.videoTrack.on('track-ended', () => {
              this.handleTrackEnded(user);
            });
          }
        } catch (err) {
          Logger.error(
            `[AgoraRtcService] Failed to play video for ${user.uid}:`,
            err
          );
        }
      }
    }, 100);
  }

  private playAudioTrack(track: any, user: RemoteUser): void {
    try {
      if (
        track &&
        typeof track.play === 'function' &&
        typeof track.setVolume === 'function'
      ) {
        track.play();
        track.setVolume(this.audioVolume());

        if (!user.audioContext) {
          this.setupAudioVisualization(track, user);
        }

        if (typeof track.on === 'function') {
          track.on('track-ended', () => {
            this.handleTrackEnded(user);
          });
        }
      }
    } catch (err) {
      Logger.error('[AgoraRtcService] Error playing audio track:', err);
    }
  }

  private setupAudioVisualization(track: any, user: RemoteUser): void {
    try {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(
        new MediaStream([track.getMediaStreamTrack()])
      );
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      analyser.fftSize = 64;

      user.audioContext = audioContext;
      user.analyser = analyser;
      user.audioSource = source;

      this.drawAudioVisualization(user);
    } catch (err) {
      Logger.error(
        '[AgoraRtcService] Error setting up audio visualization:',
        err
      );
    }
  }

  private drawAudioVisualization(user: RemoteUser): void {
    if (!user.analyser || !user.elementId) return;

    const container = document.getElementById(user.elementId);
    if (!container) return;

    let canvas = container.querySelector('canvas.audio-visualizer') as HTMLCanvasElement;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'audio-visualizer';
      container.appendChild(canvas);

      Object.assign(canvas.style, {
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '100%',
        height: '4px',
        zIndex: '12',
        pointerEvents: 'none'
      });
    }

    // Add active class when audio is playing
    canvas.classList.add('active');

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const WIDTH = (canvas.width = container.clientWidth);
    const HEIGHT = (canvas.height = 4); // Thin bar like Google Meet

    const bufferLength = user.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, WIDTH, 0);
    gradient.addColorStop(0, '#0E39B6'); // Primary color
    gradient.addColorStop(1, '#3A7BFF'); // Lighter blue

    const draw = () => {
      if (!user.analyser) return;

      requestAnimationFrame(draw);
      user.analyser.getByteFrequencyData(dataArray);

      // Clear with slight transparency for glow effect
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      // Calculate average volume
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const avg = sum / bufferLength;
      const normalizedVolume = avg / 255;

      // Draw smooth animated bar
      const barHeight = HEIGHT;
      const barWidth = WIDTH * normalizedVolume * 0.7; // Scale width with volume

      // Animate from center like Google Meet
      const centerX = WIDTH / 2;
      const animatedWidth = barWidth * (0.8 + 0.2 * Math.sin(Date.now() / 200)); // Subtle pulse

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(
        centerX - animatedWidth / 2,
        0,
        animatedWidth,
        barHeight,
        [barHeight / 2, barHeight / 2, barHeight / 2, barHeight / 2] // Rounded corners
      );
      ctx.fill();

      // Add glow effect
      ctx.shadowBlur = 10;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#0E39B6';
    };

    draw();
  }

  private handleTrackEnded(user: RemoteUser): void {
    Logger.debug(
      `[AgoraRtcService] Track ended for user ${user.uid}, attempting to reconnect...`
    );

    if (user.videoTrack) {
      user.videoTrack.stop();
      const container = document.getElementById(user.elementId!);
      if (container) container.innerHTML = '';
    }

    if (user.audioTrack) {
      user.audioTrack.stop();
      this.cleanupAudioVisualization(user);
    }

    this.remoteUsers.update((users) =>
      users.map((u) =>
        u.uid === user.uid
          ? {
            ...u,
            videoTrack: undefined,
            audioTrack: undefined,
            hasVideo: false,
            hasAudio: false,
          }
          : u
      )
    );

    setTimeout(() => {
      if (this.agoraClient) {
        this.agoraClient.remoteUsers.forEach((remoteUser: any) => {
          if (remoteUser.uid === user.uid) {
            if (remoteUser.hasVideo) {
              this.handleUserPublished(remoteUser, 'video');
            }
            if (remoteUser.hasAudio) {
              this.handleUserPublished(remoteUser, 'audio');
            }
          }
        });
      }
    }, 1000);
  }

  private cleanupAudioVisualization(user: RemoteUser): void {
    if (user.audioContext) {
      user.audioContext.close().catch((err) => {
        Logger.error('[AgoraRtcService] Error closing audio context:', err);
      });
      user.audioContext = undefined;
      user.analyser = undefined;
      user.audioSource = undefined;

      // Remove active class
      const container = document.getElementById(user.elementId!);
      if (container) {
        const canvas = container.querySelector('canvas.audio-visualizer');
        if (canvas) canvas.classList.remove('active');
      }
    }
  }

  private handleUserUnpublished(user: any, mediaType: 'video' | 'audio'): void {
    this.remoteUsers.update((users) =>
      users.map((u) => {
        if (u.uid === user.uid) {
          const updatedUser = { ...u };

          if (mediaType === 'video') {
            if (updatedUser.videoTrack) {
              updatedUser.videoTrack.stop();
              const container = document.getElementById(updatedUser.elementId!);
              if (container) container.innerHTML = '';
            }
            updatedUser.videoTrack = undefined;
            updatedUser.hasVideo = false;
          } else {
            if (updatedUser.audioTrack) {
              updatedUser.audioTrack.stop();
              this.cleanupAudioVisualization(updatedUser);
            }
            updatedUser.audioTrack = undefined;
            updatedUser.hasAudio = false;
          }

          return updatedUser;
        }
        return u;
      })
    );
  }

  private removeRemoteUser(uid: string | number): void {
    this.remoteUsers.update((users) => {
      const userToRemove = users.find((u) => u.uid === uid);
      if (userToRemove) {
        if (userToRemove.videoTrack) {
          userToRemove.videoTrack.stop();
          const container = document.getElementById(userToRemove.elementId!);
          if (container) container.innerHTML = '';
        }
        if (userToRemove.audioTrack) {
          userToRemove.audioTrack.stop();
          this.cleanupAudioVisualization(userToRemove);
        }
        return users.filter((u) => u.uid !== uid);
      }
      return users;
    });
  }

  private handleStreamTypeChanged(uid: string | number, streamType: any): void {
    Logger.debug(
      `[AgoraRtcService] Handling stream type change for ${uid}:`,
      streamType
    );

    this.remoteUsers.update((users) =>
      users.map((u) => {
        if (
          u.uid === uid &&
          u?.videoTrack &&
          typeof u.videoTrack.setStreamType === 'function'
        ) {
          try {
            let mappedType = 'high';
            if (streamType === 'low' || streamType === 0) {
              mappedType = 'low';
            } else if (streamType === 'medium' || streamType === 1) {
              mappedType = 'medium';
            }

            u.videoTrack.setStreamType(mappedType);
            Logger.debug(
              `[AgoraRtcService] Set stream type to ${mappedType} for ${uid}`
            );
          } catch (error) {
            Logger.error(
              `[AgoraRtcService] Error setting stream type for ${uid}:`,
              error
            );
          }
        }
        return u;
      })
    );
  }

  private handleStreamFallback(
    uid: string | number,
    isFallbackOrRecover: any
  ): void {
    Logger.debug(
      `[AgoraRtcService] Stream fallback for ${uid}:`,
      isFallbackOrRecover
    );
  }

  private handlePoorNetwork(): void {
    this.remoteUsers().forEach((user) => {
      try {
        if (
          user?.videoTrack &&
          typeof user.videoTrack.setStreamType === 'function'
        ) {
          user.videoTrack.setStreamType('low');
        } else {
          Logger.debug(
            `[AgoraRtcService] Video track not available or invalid for user ${user.uid}`
          );
        }
      } catch (error) {
        Logger.error(
          `[AgoraRtcService] Error adjusting stream quality for user ${user.uid}:`,
          error
        );
      }
    });
  }

  public async joinChannel(
    channel: string,
    uid: string | number,
    token?: string
  ): Promise<void> {
    if (!this.isBrowser) return;

    try {
      await this.initializeClient();
      if (!this.agoraClient) throw new Error('Client not initialized');

      this.currentChannel = channel;
      this.currentUid = uid;
      this.currentToken = token || '';

      Logger.debug(
        '[AgoraRtcService] Pre-join connection state:',
        this.agoraClient.connectionState
      );

      await this.agoraClient.join(this.APP_ID, channel, token || null, uid);

      this.isJoined.set(true);

      await this.createLocalTracks();
      await this.publishLocalTracks();

      Logger.debug(
        `[AgoraRtcService] Successfully joined channel ${channel} as ${uid}`
      );
      Logger.debug(
        '[AgoraRtcService] Post-join connection state:',
        this.agoraClient.connectionState
      );
    } catch (error) {
      Logger.error('[AgoraRtcService] Channel join failed:', error);
      this.cleanup();
      throw error;
    }
  }

  private async createLocalTracks(): Promise<void> {
    try {
      try {
        this.localAudioTrack = await this.AgoraRTC.createMicrophoneAudioTrack({
          AEC: true,
          ANS: true,
        });
        this.hasAudioPermission.set(true);
      } catch (audioError) {
        Logger.warn(
          '[AgoraRtcService] Microphone access denied or not available'
        );
        this.hasAudioPermission.set(false);
        this.audioMuted.set(true);
      }

      try {
        this.localVideoTrack = await this.AgoraRTC.createCameraVideoTrack({
          encoderConfig: '480p_4',
          optimizationMode: 'detail',
          codec: this.preferredCodec(),
        });
        this.hasVideoPermission.set(true);
      } catch (videoError) {
        Logger.warn('[AgoraRtcService] Camera access denied or not available');
        this.hasVideoPermission.set(false);
        this.videoMuted.set(true);
      }

      if (this.localAudioTrack) {
        this.localAudioTrack.setVolume(this.audioVolume());
      }
    } catch (error) {
      Logger.error('[AgoraRtcService] Local track creation failed:', error);
      throw error;
    }
  }

  private async publishLocalTracks(): Promise<void> {
    try {
      await this.agoraClient.publish([
        this.localAudioTrack,
        this.localVideoTrack,
      ]);
      this.audioMuted.set(false);
      this.videoMuted.set(false);
    } catch (error) {
      Logger.error('[AgoraRtcService] Failed to publish local tracks:', error);
      throw error;
    }
  }

  public async leaveChannel(): Promise<void> {
    if (!this.agoraClient) return;

    try {
      if (this.localAudioTrack || this.localVideoTrack) {
        await this.agoraClient.unpublish(
          [this.localAudioTrack, this.localVideoTrack].filter(Boolean)
        );
      }
      await this.agoraClient.leave();
      Logger.debug('[AgoraRtcService] Left channel successfully');
    } catch (error) {
      Logger.error('[AgoraRtcService] Error leaving channel:', error);
    } finally {
      this.cleanup();
    }
  }

  public async reconnect(): Promise<void> {
    if (!this.agoraClient || !this.currentChannel) return;

    try {
      Logger.debug('[AgoraRtcService] Attempting to reconnect...');
      await this.agoraClient.renewToken(this.currentToken);
      Logger.debug('[AgoraRtcService] Connection renewed');
    } catch (error) {
      Logger.error('[AgoraRtcService] Reconnection failed:', error);
      await this.leaveChannel();
      await this.joinChannel(
        this.currentChannel,
        this.currentUid,
        this.currentToken
      );
    }
  }

  private cleanup(): void {
    this.localAudioTrack?.close();
    this.localVideoTrack?.close();
    this.localScreenTrack?.close();

    this.localAudioTrack = null;
    this.localVideoTrack = null;
    this.localScreenTrack = null;

    this.cleanupRemoteUsers();

    this.isJoined.set(false);
    this.audioMuted.set(false);
    this.videoMuted.set(false);
    this.screenSharing.set(false);

    this.currentChannel = '';
    this.currentUid = '';
    this.currentToken = '';
  }

  private cleanupRemoteUsers(): void {
    this.remoteUsers().forEach((user) => {
      user.videoTrack?.stop();
      user.audioTrack?.stop();
      const container = document.getElementById(user.elementId!);
      if (container) container.innerHTML = '';
    });
    this.remoteUsers.set([]);
  }

  public async toggleAudio(): Promise<void> {
    if (!this.localAudioTrack) return;

    const mute = !this.audioMuted();
    await this.localAudioTrack.setEnabled(!mute);
    this.audioMuted.set(mute);
    Logger.debug(`[AgoraRtcService] Audio ${mute ? 'muted' : 'unmuted'}`);
  }

  public async toggleVideo(): Promise<void> {
    if (!this.localVideoTrack) return;

    const mute = !this.videoMuted();
    await this.localVideoTrack.setEnabled(!mute);
    this.videoMuted.set(mute);
    Logger.debug(`[AgoraRtcService] Video ${mute ? 'muted' : 'unmuted'}`);
  }

  public async setAudioVolume(volume: number): Promise<void> {
    this.audioVolume.set(volume);
    localStorage.setItem(this.volumeStorageKey, volume.toString());

    if (this.localAudioTrack) {
      this.localAudioTrack.setVolume(volume);
    }

    this.remoteUsers().forEach((user) => {
      if (user.audioTrack) {
        user.audioTrack.setVolume(volume);
      }
    });

    if (volume === 0 && !this.audioMuted()) {
      await this.toggleAudio();
    } else if (volume > 0 && this.audioMuted()) {
      await this.toggleAudio();
    }
  }

  public async startLocalPreview(containerId: string): Promise<void> {
    if (!this.localVideoTrack) return;
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    try {
      this.localVideoTrack.play(container, { fit: 'cover' });
    } catch (error) {
      Logger.error('[AgoraRtcService] Preview error:', error);
    }
  }

  public async toggleScreenShare(): Promise<void> {
    if (!this.isBrowser) return;

    try {
      if (this.screenSharing()) {
        await this.stopScreenShare();
      } else {
        await this.startScreenShare();
      }
    } catch (error) {
      Logger.error('[AgoraRtcService] Screen share toggle failed:', error);
      throw error;
    }
  }

  private async startScreenShare(): Promise<void> {
    try {
      this.localScreenTrack = await this.AgoraRTC.createScreenVideoTrack({
        encoderConfig: '1080p_1',
        optimizationMode: 'detail',
        codec: this.preferredCodec(),
      });

      await this.agoraClient.publish(this.localScreenTrack);

      if (this.localVideoTrack) {
        await this.localVideoTrack.setEnabled(false);
        this.videoMuted.set(true);
      }

      this.screenSharing.set(true);
      Logger.debug('[AgoraRtcService] Screen sharing started');
    } catch (error) {
      Logger.error('[AgoraRtcService] Failed to start screen sharing:', error);
      await this.stopScreenShare();
      throw error;
    }
  }

  private async stopScreenShare(): Promise<void> {
    try {
      if (this.localScreenTrack) {
        await this.agoraClient.unpublish(this.localScreenTrack);
        this.localScreenTrack.close();
        this.localScreenTrack = null;
      }

      if (this.localVideoTrack && !this.videoMuted()) {
        await this.localVideoTrack.setEnabled(true);
      }

      this.screenSharing.set(false);
      Logger.debug('[AgoraRtcService] Screen sharing stopped');
    } catch (error) {
      Logger.error('[AgoraRtcService] Failed to stop screen sharing:', error);
      throw error;
    }
  }

  public async checkScreenSharePermissions(): Promise<void> {
    if (!this.isBrowser) return;

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      stream.getTracks().forEach((track) => track.stop());
      this.hasScreenSharePermission.set(true);
    } catch (error) {
      this.hasScreenSharePermission.set(false);
      Logger.debug('[AgoraRtcService] Screen share permission denied');
    }
  }

  public async joinWithBackendToken(channel: string): Promise<void> {
    try {
      const { token, uid } = await this.fetchAgoraToken(channel);
      await this.joinChannel(channel, uid, token);
    } catch (error) {
      Logger.error('[AgoraRtcService] Failed to join with backend token:', error);
      throw error;
    }
  }

  private async fetchAgoraToken(
    channel: string
  ): Promise<{ token: string; uid: number }> {
    const url = `${environment.apiUrl}/api/agora/token`;
    const params = { channelName: channel };

    let response: { data: { token: string; uid: number } };
    try {
      response = await firstValueFrom(
        this.http
          .get<{ data: { token: string; uid: number } }>(url, { params })
          .pipe(takeUntilDestroyed(this.destroyRef))
      );
    } catch (err: any) {
      // Surface a clear error up the stack so the component can show a toast
      const message = err?.message || 'Failed to fetch Agora token';
      throw new Error(message);
    }

    if (!response.data?.token) {
      throw new Error('Invalid token response');
    }

    Logger.debug(
      `[AgoraRtcService] Fetched response for channel ${channel}:`,
      response.data
    );
    return {
      token: response.data.token,
      uid: Number(response.data.uid),
    };
  }

  public async setPreferredCodec(codec: 'vp8' | 'h264'): Promise<void> {
    this.preferredCodec.set(codec);
    if (this.agoraClient) {
      await this.leaveChannel();
      await this.joinChannel(
        this.currentChannel,
        this.currentUid,
        this.currentToken
      );
    }
  }
}
