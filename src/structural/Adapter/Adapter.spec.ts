import {
  MediaPlayer,
  AudioPlayer,
  AdvancedVideoPlayer,
  LegacyMediaLibrary,
  VideoPlayerAdapter,
  LegacyMediaAdapter,
  VideoPlayerClassAdapter,
  UnifiedMediaPlayer
} from './Adapter';

describe('Adapter Pattern', () => {
  describe('AudioPlayer (Target)', () => {
    const audioPlayer = new AudioPlayer();

    it('should play audio files', () => {
      expect(audioPlayer.play('song.mp3')).toBe('Playing audio file: song.mp3');
      expect(audioPlayer.play('music.wav')).toBe('Playing audio file: music.wav');
    });

    it('should reject non-audio files', () => {
      expect(audioPlayer.play('video.mp4')).toContain('Error');
      expect(audioPlayer.play('document.pdf')).toContain('Error');
    });

    it('should stop playback', () => {
      expect(audioPlayer.stop()).toBe('Stopped audio playback');
    });

    it('should display audio file info', () => {
      expect(audioPlayer.displayInfo('song.mp3')).toBe('Audio file: song.mp3');
      expect(audioPlayer.displayInfo('video.mp4')).toBe('Unknown format: video.mp4');
    });
  });

  describe('AdvancedVideoPlayer (Adaptee)', () => {
    const videoPlayer = new AdvancedVideoPlayer();

    it('should play videos with its own interface', () => {
      expect(videoPlayer.playVideo('movie.mp4')).toBe('Playing video with advanced features: movie.mp4');
    });

    it('should support additional operations', () => {
      expect(videoPlayer.pauseVideo()).toBe('Video paused');
      expect(videoPlayer.rewind(30)).toBe('Rewinding video by 30 seconds');
      expect(videoPlayer.fastForward(15)).toBe('Fast-forwarding video by 15 seconds');
    });

    it('should provide video metadata', () => {
      const metadata = videoPlayer.getVideoMetadata('movie.mp4');
      expect(metadata.filename).toBe('movie.mp4');
      expect(metadata.codec).toBe('H.264');
    });
  });

  describe('VideoPlayerAdapter (Object Adapter)', () => {
    const adaptee = new AdvancedVideoPlayer();
    const adapter = new VideoPlayerAdapter(adaptee);

    it('should adapt video player to MediaPlayer interface', () => {
      expect(adapter.play('movie.mp4')).toBe('Playing video with advanced features: movie.mp4');
      expect(adapter.stop()).toBe('Video stopped');
    });

    it('should reject non-video files', () => {
      expect(adapter.play('song.mp3')).toContain('Error');
    });

    it('should format video metadata for display', () => {
      const info = adapter.displayInfo('movie.mp4');
      expect(info).toContain('Video file: movie.mp4');
      expect(info).toContain('Resolution: 1920x1080');
      expect(info).toContain('Codec: H.264');
    });

    it('should provide additional functionality', () => {
      adapter.play('movie.mp4'); // Start playing first
      expect(adapter.pause()).toBe('Video paused');
      expect(adapter.rewind(10)).toBe('Rewinding video by 10 seconds');
    });
  });

  describe('LegacyMediaAdapter', () => {
    const legacyLibrary = new LegacyMediaLibrary();
    const adapter = new LegacyMediaAdapter(legacyLibrary);

    it('should adapt legacy library to MediaPlayer interface', () => {
      const result = adapter.play('old_movie.avi');
      expect(result).toContain('File loaded: old_movie.avi');
      expect(result).toContain('Playing media on legacy system');
    });

    it('should translate stop command', () => {
      expect(adapter.stop()).toBe('Media halted on legacy system');
    });

    it('should display legacy media info', () => {
      const info = adapter.displayInfo('old_file.dat');
      expect(info).toContain('File loaded: old_file.dat');
      expect(info).toContain('Legacy media info');
    });
  });

  describe('VideoPlayerClassAdapter (Class Adapter)', () => {
    const adapter = new VideoPlayerClassAdapter();

    it('should implement MediaPlayer interface while extending AdvancedVideoPlayer', () => {
      expect(adapter.play('movie.mp4')).toBe('Playing video with advanced features: movie.mp4');
      expect(adapter.stop()).toBe('Video stopped');
    });

    it('should still have access to the adaptee methods', () => {
      expect(adapter.pauseVideo()).toBe('Video paused');
      expect(adapter.rewind(5)).toBe('Rewinding video by 5 seconds');
    });

    it('should format video metadata for display', () => {
      const info = adapter.displayInfo('clip.webm');
      expect(info).toContain('Video file: clip.webm');
      expect(info).toContain('Codec: VP9'); // Different codec for webm
    });
  });

  describe('UnifiedMediaPlayer (Adapter Client)', () => {
    const player = new UnifiedMediaPlayer();

    it('should route audio files to AudioPlayer', () => {
      expect(player.play('music.mp3')).toBe('Playing audio file: music.mp3');
    });

    it('should route video files to VideoPlayerAdapter', () => {
      expect(player.play('movie.mp4')).toContain('Playing video with advanced features');
    });

    it('should route unknown files to LegacyMediaAdapter', () => {
      expect(player.play('unknown.dat')).toContain('legacy system');
    });

    it('should display appropriate info for each file type', () => {
      expect(player.displayInfo('music.wav')).toBe('Audio file: music.wav');
      expect(player.displayInfo('movie.mp4')).toContain('Resolution: 1920x1080');
      expect(player.displayInfo('old.dat')).toContain('Legacy media info');
    });
  });

  describe('Client code using Target interface', () => {
    // This test shows how client code can work with different adapters
    // as long as they implement the MediaPlayer interface

    it('should work with any class implementing MediaPlayer', () => {
      const testClient = (player: MediaPlayer, filename: string) => {
        const playResult = player.play(filename);
        const stopResult = player.stop();
        return {playResult, stopResult};
      };

      // Test with various implementations
      const audioPlayer = new AudioPlayer();
      const videoAdapter = new VideoPlayerAdapter(new AdvancedVideoPlayer());
      const legacyAdapter = new LegacyMediaAdapter(new LegacyMediaLibrary());

      // All should work with the client function
      expect(testClient(audioPlayer, 'song.mp3').playResult).toContain('Playing audio file');
      expect(testClient(videoAdapter, 'movie.mp4').playResult).toContain('Playing video');
      expect(testClient(legacyAdapter, 'old.dat').playResult).toContain('legacy system');
    });
  });
});
