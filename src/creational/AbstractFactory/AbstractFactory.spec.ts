import {
  WindowsFactory,
  MacOSFactory,
  Application,
  WindowsButton,
  MacOSButton,
  WindowsCheckbox,
  MacOSCheckbox
} from './AbstractFactory';

describe('Abstract Factory Pattern', () => {
  describe('WindowsFactory', () => {
    const factory = new WindowsFactory();

    it('should create Windows Button', () => {
      const button = factory.createButton();
      expect(button).toBeInstanceOf(WindowsButton);
      expect(button.render()).toBe('Rendering a button in Windows style');
    });

    it('should create Windows Checkbox', () => {
      const checkbox = factory.createCheckbox();
      expect(checkbox).toBeInstanceOf(WindowsCheckbox);
      expect(checkbox.render()).toBe('Rendering a checkbox in Windows style');
    });
  });

  describe('MacOSFactory', () => {
    const factory = new MacOSFactory();

    it('should create MacOS Button', () => {
      const button = factory.createButton();
      expect(button).toBeInstanceOf(MacOSButton);
      expect(button.render()).toBe('Rendering a button in MacOS style');
    });

    it('should create MacOS Checkbox', () => {
      const checkbox = factory.createCheckbox();
      expect(checkbox).toBeInstanceOf(MacOSCheckbox);
      expect(checkbox.render()).toBe('Rendering a checkbox in MacOS style');
    });
  });

  describe('Application', () => {
    it('should work with WindowsFactory', () => {
      const app = new Application(new WindowsFactory());
      expect(app.createUI()).toContain('Windows style');
      expect(app.executeUI()).toContain('Windows button clicked');
    });

    it('should work with MacOSFactory', () => {
      const app = new Application(new MacOSFactory());
      expect(app.createUI()).toContain('MacOS style');
      expect(app.executeUI()).toContain('MacOS button clicked');
    });
  });

  // Testing client code with different factories
  function clientCode(factory: WindowsFactory | MacOSFactory) {
    const app = new Application(factory);
    return app.createUI() + '\n' + app.executeUI();
  }

  it('should support changing factory at runtime', () => {
    // Client creates the factory
    const windowsResult = clientCode(new WindowsFactory());
    const macosResult = clientCode(new MacOSFactory());

    expect(windowsResult).toContain('Windows');
    expect(windowsResult).not.toContain('MacOS');

    expect(macosResult).toContain('MacOS');
    expect(macosResult).not.toContain('Windows');
  });
});
