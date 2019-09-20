/**
 * Adapter Pattern
 * Converts the interface of a class into another interface the client expects.
 * Adapter lets classes work together that couldn't otherwise because of incompatible interfaces.
 */

// Target interface - What the client expects to work with
export interface MediaPlayer {
  play(filename: string): string;
  stop(): string;
  displayInfo(filename: string): string;
}

// Client code that uses the target interface
export class AudioPlayer implements MediaPlayer {
  public play(filename: string): string {
    // Check file extension to ensure it's an audio file
    if (this.isAudioFile(filename)) {
      return `Playing audio file: ${filename}`;
    }
    return `Error: ${filename} is not a supported audio format`;
  }

  public stop(): string {
    return 'Stopped audio playback';
  }

  public displayInfo(filename: string): string {
    if (this.isAudioFile(filename)) {
      return `Audio file: ${filename}`;
    }
    return `Unknown format: ${filename}`;
  }

  private isAudioFile(filename: string): boolean {
    const supportedExtensions = ['.mp3', '.wav', '.aac', '.flac'];
    return supportedExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  }
}

// Adaptee - The class that needs adapting (incompatible interface)
export class AdvancedVideoPlayer {
  public playVideo(filename: string): string {
    return `Playing video with advanced features: ${filename}`;
  }

  public pauseVideo(): string {
    return 'Video paused';
  }

  public stopVideo(): string {
    return 'Video stopped';
  }

  public rewind(seconds: number): string {
    return `Rewinding video by ${seconds} seconds`;
  }

  public fastForward(seconds: number): string {
    return `Fast-forwarding video by ${seconds} seconds`;
  }

  public getVideoMetadata(filename: string): VideoMetadata {
    // In a real implementation, this would extract actual metadata
    return {
      filename,
      resolution: '1920x1080',
      codec: filename.endsWith('.mp4') ? 'H.264' : 'VP9',
      duration: 120 // seconds
    };
  }
}

export interface VideoMetadata {
  filename: string;
  resolution: string;
  codec: string;
  duration: number;
}

// Another Adaptee - Legacy media library
export class LegacyMediaLibrary {
  public loadFile(filepath: string): string {
    return `File loaded: ${filepath}`;
  }

  public playMedia(): string {
    return 'Playing media on legacy system';
  }

  public haltMedia(): string {
    return 'Media halted on legacy system';
  }

  public getMediaInfo(): string {
    return 'Legacy media info';
  }
}

// Adapter - Makes AdvancedVideoPlayer compatible with MediaPlayer interface
export class VideoPlayerAdapter implements MediaPlayer {
  private videoPlayer: AdvancedVideoPlayer;
  private isPlaying: boolean = false;
  private currentFile: string = '';

  constructor(videoPlayer: AdvancedVideoPlayer) {
    this.videoPlayer = videoPlayer;
  }

  public play(filename: string): string {
    // Check if it's a video file
    if (this.isVideoFile(filename)) {
      this.isPlaying = true;
      this.currentFile = filename;
      return this.videoPlayer.playVideo(filename);
    }
    return `Error: ${filename} is not a supported video format`;
  }

  public stop(): string {
    if (this.isPlaying) {
      this.isPlaying = false;
      return this.videoPlayer.stopVideo();
    }
    return 'No video is currently playing';
  }

  public displayInfo(filename: string): string {
    if (this.isVideoFile(filename)) {
      const metadata = this.videoPlayer.getVideoMetadata(filename);
      return `Video file: ${metadata.filename}\nResolution: ${metadata.resolution}\nCodec: ${metadata.codec}\nDuration: ${metadata.duration} seconds`;
    }
    return `Unknown format: ${filename}`;
  }

  // Additional methods that extend the functionality
  public pause(): string {
    if (this.isPlaying) {
      return this.videoPlayer.pauseVideo();
    }
    return 'No video is currently playing';
  }

  public rewind(seconds: number): string {
    if (this.isPlaying) {
      return this.videoPlayer.rewind(seconds);
    }
    return 'No video is currently playing';
  }

  public fastForward(seconds: number): string {
    if (this.isPlaying) {
      return this.videoPlayer.fastForward(seconds);
    }
    return 'No video is currently playing';
  }

  private isVideoFile(filename: string): boolean {
    const supportedExtensions = ['.mp4', '.mkv', '.avi', '.webm'];
    return supportedExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  }
}

// Adapter for the legacy media library
export class LegacyMediaAdapter implements MediaPlayer {
  private legacyLibrary: LegacyMediaLibrary;
  private currentFile: string = '';

  constructor(legacyLibrary: LegacyMediaLibrary) {
    this.legacyLibrary = legacyLibrary;
  }

  public play(filename: string): string {
    this.currentFile = filename;
    const loadResult = this.legacyLibrary.loadFile(filename);
    const playResult = this.legacyLibrary.playMedia();
    return `${loadResult}\n${playResult}`;
  }

  public stop(): string {
    return this.legacyLibrary.haltMedia();
  }

  public displayInfo(filename: string): string {
    this.currentFile = filename;
    const loadResult = this.legacyLibrary.loadFile(filename);
    return `${loadResult}\n${this.legacyLibrary.getMediaInfo()}`;
  }
}

// Class Adapter example (using inheritance)
export class VideoPlayerClassAdapter extends AdvancedVideoPlayer implements MediaPlayer {
  public play(filename: string): string {
    if (this.isVideoFile(filename)) {
      return this.playVideo(filename);
    }
    return `Error: ${filename} is not a supported video format`;
  }

  public stop(): string {
    return this.stopVideo();
  }

  public displayInfo(filename: string): string {
    if (this.isVideoFile(filename)) {
      const metadata = this.getVideoMetadata(filename);
      return `Video file: ${metadata.filename}\nResolution: ${metadata.resolution}\nCodec: ${metadata.codec}\nDuration: ${metadata.duration} seconds`;
    }
    return `Unknown format: ${filename}`;
  }

  private isVideoFile(filename: string): boolean {
    const supportedExtensions = ['.mp4', '.mkv', '.avi', '.webm'];
    return supportedExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  }
}

// A unified media player that uses adapters internally
export class UnifiedMediaPlayer {
  private audioPlayer: MediaPlayer;
  private videoAdapter: MediaPlayer;
  private legacyAdapter: MediaPlayer;

  constructor() {
    this.audioPlayer = new AudioPlayer();
    this.videoAdapter = new VideoPlayerAdapter(new AdvancedVideoPlayer());
    this.legacyAdapter = new LegacyMediaAdapter(new LegacyMediaLibrary());
  }

  public play(filename: string): string {
    if (this.isAudioFile(filename)) {
      return this.audioPlayer.play(filename);
    } else if (this.isVideoFile(filename)) {
      return this.videoAdapter.play(filename);
    } else {
      // Try with legacy adapter as fallback
      return this.legacyAdapter.play(filename);
    }
  }

  public stop(): string {
    // In a real implementation, we would track which player is active
    return 'Stopping all media playback';
  }

  public displayInfo(filename: string): string {
    if (this.isAudioFile(filename)) {
      return this.audioPlayer.displayInfo(filename);
    } else if (this.isVideoFile(filename)) {
      return this.videoAdapter.displayInfo(filename);
    } else {
      return this.legacyAdapter.displayInfo(filename);
    }
  }

  private isAudioFile(filename: string): boolean {
    const supportedExtensions = ['.mp3', '.wav', '.aac', '.flac'];
    return supportedExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  }

  private isVideoFile(filename: string): boolean {
    const supportedExtensions = ['.mp4', '.mkv', '.avi', '.webm'];
    return supportedExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  }
}
