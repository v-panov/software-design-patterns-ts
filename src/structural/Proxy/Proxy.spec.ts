import {
  RealImage,
  ImageProxy,
  ProtectedImageProxy,
  CachingImageProxy,
  RemoteImageProxy,
  ImageGallery
} from './Proxy';

describe('Proxy Pattern', () => {
  beforeEach(() => {
    // Spy on console.log
    jest.spyOn(console, 'log').mockImplementation(() => {
    });
  });

  afterEach(() => {
    // Restore console.log
    jest.restoreAllMocks();
  });

  describe('RealImage', () => {
    it('should load and display the image', () => {
      const image = new RealImage('photo.jpg', 1024);
      const result = image.display();

      expect(result).toContain('Displaying image: photo.jpg');
      expect(result).toContain('1024 bytes');
      expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/Loading image photo\.jpg/));
    });
  });

  describe('ImageProxy (Virtual Proxy)', () => {
    it('should not load the image until display is called', () => {
      const proxy = new ImageProxy('large-photo.jpg', 2048);

      // Verify image is not loaded yet
      expect(console.log).not.toHaveBeenCalledWith(expect.stringMatching(/Loading image/));

      // Call display to load the image
      const result = proxy.display();

      expect(result).toContain('Displaying image: large-photo.jpg');
      expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/Loading image large-photo\.jpg/));
    });

    it('should track access count', () => {
      const proxy = new ImageProxy('access-counted.jpg', 1500);

      // First access
      proxy.display();
      expect(proxy.getAccessCount()).toBe(1);

      // Second access
      proxy.display();
      expect(proxy.getAccessCount()).toBe(2);

      // Third access
      proxy.display();
      expect(proxy.getAccessCount()).toBe(3);
    });

    it('should only load the image once despite multiple display calls', () => {
      const proxy = new ImageProxy('cached.jpg', 3000);

      // First display call loads the image
      proxy.display();

      // Clear the mock to check if loading happens again
      jest.clearAllMocks();

      // Second display call should not reload the image
      proxy.display();

      // Verify the image was not loaded again
      expect(console.log).not.toHaveBeenCalledWith(expect.stringMatching(/Loading image cached\.jpg/));
    });
  });

  describe('ProtectedImageProxy', () => {
    it('should allow access when access level is sufficient', () => {
      const proxy = new ProtectedImageProxy('confidential.jpg', 5000, 5, 5);
      const result = proxy.display();

      expect(result).toContain('Displaying image: confidential.jpg');
    });

    it('should deny access when access level is insufficient', () => {
      const proxy = new ProtectedImageProxy('top-secret.jpg', 8000, 3, 10);
      const result = proxy.display();

      expect(result).toContain('Access denied');
      expect(result).toContain('You need access level 10');

      // Verify the real image was never loaded
      expect(console.log).not.toHaveBeenCalledWith(expect.stringMatching(/Loading image top-secret\.jpg/));
    });
  });

  describe('CachingImageProxy', () => {
    it('should cache display results', () => {
      const proxy = new CachingImageProxy('heavy-image.jpg', 10000);

      // First call should load the image
      proxy.display();
      expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/Loading image heavy-image\.jpg/));

      // Clear the mock to check for cached response
      jest.clearAllMocks();

      // Second call should use cached result
      proxy.display();
      expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/Returning cached display/));
      expect(console.log).not.toHaveBeenCalledWith(expect.stringMatching(/Loading image/));
    });

    it('should provide metadata without loading the image', () => {
      const proxy = new CachingImageProxy('metadata-test.jpg', 2500);

      // Get metadata without calling display
      const metadata = proxy.getMetadata();
      const info = metadata.getInfo();

      expect(info).toContain('Metadata for metadata-test.jpg');
      expect(info).toContain('Size=2500 bytes');

      // Verify the real image was never loaded
      expect(console.log).not.toHaveBeenCalledWith(expect.stringMatching(/Loading image/));
    });
  });

  describe('RemoteImageProxy', () => {
    it('should simulate fetching from a remote server', () => {
      const proxy = new RemoteImageProxy('remote-image.jpg', 4096, 'https://example.com/images');

      // Call display to fetch the remote image
      const result = proxy.display();

      expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/Fetching image from remote server/));
      expect(result).toContain('Displaying image: remote-image.jpg');
    });

    it('should provide server URL information', () => {
      const proxy = new RemoteImageProxy('server-test.jpg', 1234, 'https://cdn.example.org');
      expect(proxy.getServerUrl()).toBe('https://cdn.example.org');
    });
  });

  describe('ImageGallery with Proxies', () => {
    it('should work with different types of image proxies', () => {
      const gallery = new ImageGallery();

      // Add different types of images/proxies
      gallery.addImage(new RealImage('real.jpg', 1000));
      gallery.addImage(new ImageProxy('proxy.jpg', 2000));
      gallery.addImage(new ProtectedImageProxy('protected.jpg', 3000, 5, 3)); // Access granted
      gallery.addImage(new CachingImageProxy('cached.jpg', 4000));
      gallery.addImage(new RemoteImageProxy('remote.jpg', 5000, 'https://example.com'));

      // Show the gallery
      const results = gallery.showGallery();

      // Should have 5 entries
      expect(results.length).toBe(5);

      // Check for specific images
      expect(results[0]).toContain('real.jpg');
      expect(results[1]).toContain('proxy.jpg');
      expect(results[2]).toContain('protected.jpg');
      expect(results[3]).toContain('cached.jpg');
      expect(results[4]).toContain('remote.jpg');
    });
  });
});
