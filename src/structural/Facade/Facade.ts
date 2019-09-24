/**
 * Facade Pattern
 * Provides a simplified interface to a complex subsystem.
 */

// Complex subsystem components

// Video conversion subsystem
export class VideoFile {
  private name: string;
  private codecType: string;

  constructor(name: string) {
    this.name = name;
    this.codecType = name.substring(name.indexOf('.') + 1);
  }

  public getName(): string {
    return this.name;
  }

  public getCodecType(): string {
    return this.codecType;
  }
}

export class CodecFactory {
  public static extract(file: VideoFile): Codec {
    const type = file.getCodecType();
    if (type === 'mp4') {
      return new MPEG4CompressionCodec();
    } else if (type === 'ogg') {
      return new OggCompressionCodec();
    } else {
      return new CodecNotSupportedError(type);
    }
  }
}

export interface Codec {
  type: string;
}

export class CodecNotSupportedError implements Codec {
  type = 'error';
  private codecType: string;

  constructor(codecType: string) {
    this.codecType = codecType;
  }

  public getMessage(): string {
    return `Codec ${this.codecType} is not supported.`;
  }
}

export class MPEG4CompressionCodec implements Codec {
  type = 'mp4';
}

export class OggCompressionCodec implements Codec {
  type = 'ogg';
}

export class BitrateReader {
  public static read(file: VideoFile, codec: Codec): VideoFile {
    return file; // In a real world scenario, this would process the file
  }

  public static convert(buffer: VideoFile, destinationCodec: Codec): VideoFile {
    // This would actually convert the buffer to the destination codec
    // For simplicity, we'll just return the original buffer
    return buffer;
  }
}

export class AudioMixer {
  public fix(result: VideoFile): string {
    return `Audio has been fixed for ${result.getName()}`;
  }
}

// Video compression subsystem
export class CompressionCodec {
  public compress(file: VideoFile, quality: 'high' | 'medium' | 'low'): string {
    return `Compressed ${file.getName()} with ${quality} quality`;
  }
}

// Metadata subsystem
export class MetadataReader {
  public read(file: VideoFile): string {
    return `Reading metadata from ${file.getName()}`;
  }
}

export class MetadataWriter {
  public write(file: VideoFile, metadata: string): string {
    return `Writing metadata to ${file.getName()}: ${metadata}`;
  }
}

// Facade
export class VideoConversionFacade {
  public convertVideo(fileName: string, format: string): string {
    let result = '';
    const file = new VideoFile(fileName);
    result += `Started processing file: ${file.getName()}\n`;

    // Extract codec
    const sourceCodec = CodecFactory.extract(file);
    if (sourceCodec.type === 'error') {
      return (sourceCodec as CodecNotSupportedError).getMessage();
    }

    // Get destination codec
    let destinationCodec: Codec;
    if (format === 'mp4') {
      destinationCodec = new MPEG4CompressionCodec();
    } else if (format === 'ogg') {
      destinationCodec = new OggCompressionCodec();
    } else {
      return `Format ${format} is not supported.`;
    }

    // Process the conversion using complex subsystems
    result += `Reading source file using codec: ${sourceCodec.type}\n`;
    const buffer = BitrateReader.read(file, sourceCodec);
    result += `Converting to ${destinationCodec.type}\n`;
    const convertedBuffer = BitrateReader.convert(buffer, destinationCodec);

    // Apply additional processing
    result += new CompressionCodec().compress(convertedBuffer, 'high') + '\n';
    result += new MetadataReader().read(convertedBuffer) + '\n';
    result += new MetadataWriter().write(convertedBuffer, 'Title: Converted Video') + '\n';
    result += new AudioMixer().fix(convertedBuffer) + '\n';

    result += `Conversion completed successfully: ${fileName} -> ${fileName.substring(0, fileName.lastIndexOf('.'))}.${format}`;
    return result;
  }
}

// Another example: Computer system facade
export class CPU {
  public freeze(): string {
    return 'CPU: Freezing processor';
  }

  public execute(): string {
    return 'CPU: Executing instructions';
  }

  public jump(position: string): string {
    return `CPU: Jumping to position ${position}`;
  }
}

export class Memory {
  public load(position: string, data: string): string {
    return `Memory: Loading data "${data}" at position ${position}`;
  }
}

export class HardDrive {
  public read(lba: number, size: number): string {
    return `HardDrive: Reading ${size} bytes from sector ${lba}`;
  }
}

// Computer Facade
export class Computer {
  private cpu: CPU;
  private memory: Memory;
  private hardDrive: HardDrive;

  constructor() {
    this.cpu = new CPU();
    this.memory = new Memory();
    this.hardDrive = new HardDrive();
  }

  public start(): string[] {
    const bootSequence: string[] = [];
    bootSequence.push(this.cpu.freeze());
    bootSequence.push(this.memory.load('BOOT_ADDRESS', 'BOOT_DATA'));
    bootSequence.push(this.hardDrive.read(0, 1024));
    bootSequence.push(this.cpu.jump('BOOT_ADDRESS'));
    bootSequence.push(this.cpu.execute());
    return bootSequence;
  }

  public shutDown(): string[] {
    const shutdownSequence: string[] = [];
    shutdownSequence.push('Saving data to disk...');
    shutdownSequence.push(this.cpu.freeze());
    shutdownSequence.push('Power off');
    return shutdownSequence;
  }
}

// Home Theater Facade
export class Projector {
  public on(): string {
    return 'Projector: On';
  }

  public off(): string {
    return 'Projector: Off';
  }

  public setInput(source: string): string {
    return `Projector: Setting input source to ${source}`;
  }
}

export class SoundSystem {
  public on(): string {
    return 'Sound System: On';
  }

  public off(): string {
    return 'Sound System: Off';
  }

  public setVolume(level: number): string {
    return `Sound System: Setting volume to ${level}`;
  }
}

export class StreamingPlayer {
  public on(): string {
    return 'Streaming Player: On';
  }

  public off(): string {
    return 'Streaming Player: Off';
  }

  public play(movie: string): string {
    return `Streaming Player: Playing "${movie}"`;
  }

  public stop(): string {
    return 'Streaming Player: Stopped';
  }
}

export class Lights {
  public dim(level: number): string {
    return `Lights: Dimming to ${level}%`;
  }

  public brighten(): string {
    return 'Lights: Brightening to 100%';
  }
}

export class HomeTheaterFacade {
  private projector: Projector;
  private soundSystem: SoundSystem;
  private streamingPlayer: StreamingPlayer;
  private lights: Lights;

  constructor(
    projector: Projector,
    soundSystem: SoundSystem,
    streamingPlayer: StreamingPlayer,
    lights: Lights
  ) {
    this.projector = projector;
    this.soundSystem = soundSystem;
    this.streamingPlayer = streamingPlayer;
    this.lights = lights;
  }

  public watchMovie(movie: string): string[] {
    const actions: string[] = [];
    actions.push('Get ready to watch a movie...');
    actions.push(this.lights.dim(10));
    actions.push(this.projector.on());
    actions.push(this.projector.setInput('Streaming'));
    actions.push(this.soundSystem.on());
    actions.push(this.soundSystem.setVolume(50));
    actions.push(this.streamingPlayer.on());
    actions.push(this.streamingPlayer.play(movie));
    return actions;
  }

  public endMovie(): string[] {
    const actions: string[] = [];
    actions.push('Shutting movie theater down...');
    actions.push(this.streamingPlayer.stop());
    actions.push(this.streamingPlayer.off());
    actions.push(this.soundSystem.off());
    actions.push(this.projector.off());
    actions.push(this.lights.brighten());
    return actions;
  }
}
