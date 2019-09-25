/**
 * Proxy Pattern
 * Provides a surrogate or placeholder for another object to control access to it.
 */

// Subject Interface - defines common interface for RealSubject and Proxy
export interface Image {
  display(): string;

  getFilename(): string;

  getSize(): number; // in bytes
}

// RealSubject - the real object that the proxy represents
export class RealImage implements Image {
  private filename: string;
  private size: number;
  private imageData: string = '';

  constructor(filename: string, size: number) {
    this.filename = filename;
    this.size = size;
    // Simulate loading of image data (expensive operation)
    this.loadFromDisk();
  }

  public display(): string {
    return `Displaying image: ${this.filename}\n${this.imageData}`;
  }

  public getFilename(): string {
    return this.filename;
  }

  public getSize(): number {
    return this.size;
  }

  private loadFromDisk(): void {
    console.log(`Loading image ${this.filename} from disk...`);
    // Simulate loading time for a large image
    // In a real application, this would be reading from a file
    this.imageData = `[Image data for ${this.filename} - ${this.size} bytes]`;
    console.log(`Image ${this.filename} loaded successfully.`);
  }
}

// Proxy - controls access to the RealSubject
export class ImageProxy implements Image {
  private filename: string;
  private size: number;
  private realImage: RealImage | null = null;
  private accessCount: number = 0;

  constructor(filename: string, size: number) {
    this.filename = filename;
    this.size = size;
  }

  public display(): string {
    this.accessCount++;
    console.log(`Access count for ${this.filename}: ${this.accessCount}`);

    // Create RealImage only when needed (lazy initialization)
    if (this.realImage === null) {
      this.realImage = new RealImage(this.filename, this.size);
    }

    return this.realImage.display();
  }

  public getFilename(): string {
    return this.filename;
  }

  public getSize(): number {
    return this.size;
  }

  public getAccessCount(): number {
    return this.accessCount;
  }
}

// Protection Proxy - adds access control to the RealImage
export class ProtectedImageProxy implements Image {
  private filename: string;
  private size: number;
  private realImage: RealImage | null = null;
  private accessLevel: number;
  private requiredAccessLevel: number;

  constructor(filename: string, size: number, accessLevel: number, requiredAccessLevel: number) {
    this.filename = filename;
    this.size = size;
    this.accessLevel = accessLevel;
    this.requiredAccessLevel = requiredAccessLevel;
  }

  public display(): string {
    // Check access rights before creating the RealImage
    if (this.accessLevel < this.requiredAccessLevel) {
      return `Access denied: You need access level ${this.requiredAccessLevel} to view ${this.filename}`;
    }

    // Create RealImage only when needed and when access is granted
    if (this.realImage === null) {
      this.realImage = new RealImage(this.filename, this.size);
    }

    return this.realImage.display();
  }

  public getFilename(): string {
    return this.filename;
  }

  public getSize(): number {
    return this.size;
  }
}

// Virtual Proxy - caches information about the RealImage
export class CachingImageProxy implements Image {
  private filename: string;
  private size: number;
  private realImage: RealImage | null = null;
  private cachedDisplay: string | null = null;
  private imageMetadata: ImageMetadata;

  constructor(filename: string, size: number) {
    this.filename = filename;
    this.size = size;
    // Initialize metadata without loading the actual image
    this.imageMetadata = new ImageMetadata(filename, size);
  }

  public display(): string {
    // Use cached result if available
    if (this.cachedDisplay !== null) {
      console.log(`Returning cached display for ${this.filename}`);
      return this.cachedDisplay;
    }

    // Create RealImage only when needed
    if (this.realImage === null) {
      this.realImage = new RealImage(this.filename, this.size);
    }

    // Cache the result for future calls
    this.cachedDisplay = this.realImage.display();
    return this.cachedDisplay;
  }

  public getFilename(): string {
    return this.filename;
  }

  public getSize(): number {
    return this.size;
  }

  // Additional method that doesn't require loading the RealImage
  public getMetadata(): ImageMetadata {
    return this.imageMetadata;
  }
}

// Helper class for the CachingImageProxy
export class ImageMetadata {
  private filename: string;
  private size: number;
  private createdAt: Date;

  constructor(filename: string, size: number) {
    this.filename = filename;
    this.size = size;
    this.createdAt = new Date();
  }

  public getInfo(): string {
    return `Metadata for ${this.filename}: Size=${this.size} bytes, Created=${this.createdAt.toISOString()}`;
  }
}

// Remote Proxy - represents an object located on a remote server
export class RemoteImageProxy implements Image {
  private filename: string;
  private size: number;
  private realImage: RealImage | null = null;
  private serverUrl: string;

  constructor(filename: string, size: number, serverUrl: string) {
    this.filename = filename;
    this.size = size;
    this.serverUrl = serverUrl;
  }

  public display(): string {
    if (this.realImage === null) {
      console.log(`Fetching image from remote server: ${this.serverUrl}/${this.filename}`);
      // In a real application, this would make an HTTP request
      // For demonstration, we'll simulate it with a local RealImage
      this.realImage = new RealImage(this.filename, this.size);
    }
    return this.realImage.display();
  }

  public getFilename(): string {
    return this.filename;
  }

  public getSize(): number {
    return this.size;
  }

  public getServerUrl(): string {
    return this.serverUrl;
  }
}

// Gallery that uses images through the Image interface
export class ImageGallery {
  private images: Image[] = [];

  public addImage(image: Image): void {
    this.images.push(image);
  }

  public showGallery(): string[] {
    return this.images.map(image => {
      return `Image: ${image.getFilename()} (${image.getSize()} bytes)\n${image.display()}`;
    });
  }
}
