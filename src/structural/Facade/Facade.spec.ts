import {
  VideoConversionFacade,
  Computer,
  HomeTheaterFacade,
  Projector,
  SoundSystem,
  StreamingPlayer,
  Lights
} from './Facade';

describe('Facade Pattern', () => {
  describe('VideoConversionFacade', () => {
    const converter = new VideoConversionFacade();

    it('should convert video from mp4 to ogg', () => {
      const result = converter.convertVideo('video.mp4', 'ogg');
      expect(result).toContain('Started processing file');
      expect(result).toContain('Converting to ogg');
      expect(result).toContain('Conversion completed successfully');
      expect(result).toContain('video.mp4 -> video.ogg');
    });

    it('should convert video from ogg to mp4', () => {
      const result = converter.convertVideo('song.ogg', 'mp4');
      expect(result).toContain('Started processing file');
      expect(result).toContain('Converting to mp4');
      expect(result).toContain('Conversion completed successfully');
      expect(result).toContain('song.ogg -> song.mp4');
    });

    it('should handle unsupported source formats', () => {
      const result = converter.convertVideo('file.avi', 'mp4');
      expect(result).toContain('Codec avi is not supported');
    });

    it('should handle unsupported destination formats', () => {
      const result = converter.convertVideo('video.mp4', 'avi');
      expect(result).toContain('Format avi is not supported');
    });
  });

  describe('Computer Facade', () => {
    const computer = new Computer();

    it('should perform boot sequence', () => {
      const bootSequence = computer.start();
      expect(bootSequence).toHaveLength(5);
      expect(bootSequence[0]).toContain('Freezing processor');
      expect(bootSequence[1]).toContain('Loading data');
      expect(bootSequence[2]).toContain('Reading');
      expect(bootSequence[3]).toContain('Jumping');
      expect(bootSequence[4]).toContain('Executing');
    });

    it('should perform shutdown sequence', () => {
      const shutdownSequence = computer.shutDown();
      expect(shutdownSequence).toHaveLength(3);
      expect(shutdownSequence[0]).toContain('Saving data');
      expect(shutdownSequence[1]).toContain('Freezing');
      expect(shutdownSequence[2]).toContain('Power off');
    });
  });

  describe('HomeTheaterFacade', () => {
    const projector = new Projector();
    const soundSystem = new SoundSystem();
    const streamingPlayer = new StreamingPlayer();
    const lights = new Lights();
    const homeTheater = new HomeTheaterFacade(
      projector,
      soundSystem,
      streamingPlayer,
      lights
    );

    it('should provide a simplified interface for watching a movie', () => {
      const actions = homeTheater.watchMovie('Inception');

      expect(actions).toHaveLength(8);
      expect(actions).toContain('Lights: Dimming to 10%');
      expect(actions).toContain('Projector: On');
      expect(actions).toContain('Sound System: On');
      expect(actions).toContain('Streaming Player: Playing "Inception"');
    });

    it('should provide a simplified interface for ending a movie', () => {
      const actions = homeTheater.endMovie();

      expect(actions).toHaveLength(6);
      expect(actions).toContain('Streaming Player: Stopped');
      expect(actions).toContain('Streaming Player: Off');
      expect(actions).toContain('Projector: Off');
      expect(actions).toContain('Lights: Brightening to 100%');
    });
  });
});
