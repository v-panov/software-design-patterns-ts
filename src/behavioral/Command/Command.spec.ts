import {
  Light,
  LightOnCommand,
  LightOffCommand,
  RemoteControl,
  Fan,
  FanCommand,
  MacroCommand
} from './Command';

describe('Command Pattern', () => {
  describe('Light Control System', () => {
    let light: Light;
    let lightOn: LightOnCommand;
    let lightOff: LightOffCommand;
    let remote: RemoteControl;

    beforeEach(() => {
      light = new Light();
      lightOn = new LightOnCommand(light);
      lightOff = new LightOffCommand(light);
      remote = new RemoteControl();
    });

    it('should execute light on command', () => {
      remote.addCommand(lightOn);
      remote.executeCommand(0);

      expect(light.getStatus()).toBe(true);
    });

    it('should execute light off command', () => {
      remote.addCommand(lightOff);
      remote.executeCommand(0);

      expect(light.getStatus()).toBe(false);
    });

    it('should undo the last command', () => {
      remote.addCommand(lightOn);
      remote.executeCommand(0);
      expect(light.getStatus()).toBe(true);

      remote.undoLastCommand();
      expect(light.getStatus()).toBe(false);
    });

    it('should track commands in history', () => {
      remote.addCommand(lightOn);
      remote.addCommand(lightOff);

      expect(remote.getCommandsCount()).toBe(2);
      expect(remote.getHistoryCount()).toBe(0);

      remote.executeCommand(0);
      expect(remote.getHistoryCount()).toBe(1);

      remote.executeCommand(1);
      expect(remote.getHistoryCount()).toBe(2);

      remote.undoLastCommand();
      expect(remote.getHistoryCount()).toBe(1);
    });

    it('should handle invalid command index', () => {
      remote.addCommand(lightOn);

      // Should not throw error or affect the light
      remote.executeCommand(-1);
      expect(light.getStatus()).toBe(false);

      remote.executeCommand(1);
      expect(light.getStatus()).toBe(false);
    });

    it('should handle undo with empty history', () => {
      // Should not throw error
      expect(() => {
        remote.undoLastCommand();
      }).not.toThrow();
    });
  });

  describe('Fan Control System', () => {
    let fan: Fan;
    let fanLow: FanCommand;
    let fanMedium: FanCommand;
    let fanHigh: FanCommand;
    let fanOff: FanCommand;
    let remote: RemoteControl;

    beforeEach(() => {
      fan = new Fan();
      fanOff = new FanCommand(fan, 0);
      fanLow = new FanCommand(fan, 1);
      fanMedium = new FanCommand(fan, 2);
      fanHigh = new FanCommand(fan, 3);
      remote = new RemoteControl();
    });

    it('should set fan speed', () => {
      remote.addCommand(fanLow);
      remote.executeCommand(0);
      expect(fan.getSpeed()).toBe(1);

      remote.addCommand(fanMedium);
      remote.executeCommand(1);
      expect(fan.getSpeed()).toBe(2);
    });

    it('should undo fan speed changes', () => {
      remote.addCommand(fanOff);
      remote.addCommand(fanLow);
      remote.addCommand(fanMedium);
      remote.addCommand(fanHigh);

      remote.executeCommand(1); // Low
      expect(fan.getSpeed()).toBe(1);

      remote.executeCommand(2); // Medium
      expect(fan.getSpeed()).toBe(2);

      remote.undoLastCommand();
      expect(fan.getSpeed()).toBe(1);
    });

    it('should track previous speed for undo operations', () => {
      fan.setSpeed(2); // Medium
      expect(fan.getPrevSpeed()).toBe(0);

      fan.setSpeed(3); // High
      expect(fan.getPrevSpeed()).toBe(2);

      fan.setSpeed(1); // Low
      expect(fan.getPrevSpeed()).toBe(3);
    });
  });

  describe('Macro Command', () => {
    let light: Light;
    let fan: Fan;
    let lightOn: LightOnCommand;
    let fanHigh: FanCommand;
    let macroCommand: MacroCommand;
    let remote: RemoteControl;

    beforeEach(() => {
      light = new Light();
      fan = new Fan();
      lightOn = new LightOnCommand(light);
      fanHigh = new FanCommand(fan, 3);
      macroCommand = new MacroCommand([lightOn, fanHigh]);
      remote = new RemoteControl();
    });

    it('should execute multiple commands at once', () => {
      remote.addCommand(macroCommand);
      remote.executeCommand(0);

      expect(light.getStatus()).toBe(true);
      expect(fan.getSpeed()).toBe(3);
    });

    it('should undo multiple commands in reverse order', () => {
      fan.setSpeed(1); // Start with fan on low
      light.turnOff(); // Start with light off

      remote.addCommand(macroCommand);
      remote.executeCommand(0);

      expect(light.getStatus()).toBe(true);
      expect(fan.getSpeed()).toBe(3);

      remote.undoLastCommand();

      expect(light.getStatus()).toBe(false);
      expect(fan.getSpeed()).toBe(1);
    });

    it('should report correct command count', () => {
      expect(macroCommand.getCommandCount()).toBe(2);

      const newMacro = new MacroCommand([lightOn, fanHigh, new LightOffCommand(light)]);
      expect(newMacro.getCommandCount()).toBe(3);
    });
  });
});
