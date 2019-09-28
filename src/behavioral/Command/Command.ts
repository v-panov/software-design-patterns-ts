/**
 * Command Pattern
 * Encapsulates a request as an object, allowing you to parameterize clients with different requests,
 * queue or log requests, and support undoable operations.
 */

// Command interface
export interface Command {
  execute(): void;

  undo(): void;
}

// Receiver class
export class Light {
  private isOn: boolean = false;

  public turnOn(): void {
    this.isOn = true;
  }

  public turnOff(): void {
    this.isOn = false;
  }

  public getStatus(): boolean {
    return this.isOn;
  }
}

// Concrete Commands
export class LightOnCommand implements Command {
  private light: Light;

  constructor(light: Light) {
    this.light = light;
  }

  public execute(): void {
    this.light.turnOn();
  }

  public undo(): void {
    this.light.turnOff();
  }
}

export class LightOffCommand implements Command {
  private light: Light;

  constructor(light: Light) {
    this.light = light;
  }

  public execute(): void {
    this.light.turnOff();
  }

  public undo(): void {
    this.light.turnOn();
  }
}

// Invoker
export class RemoteControl {
  private commands: Command[] = [];
  private history: Command[] = [];

  public addCommand(command: Command): void {
    this.commands.push(command);
  }

  public executeCommand(index: number): void {
    if (index >= 0 && index < this.commands.length) {
      const command = this.commands[index];
      command.execute();
      this.history.push(command);
    }
  }

  public undoLastCommand(): void {
    const command = this.history.pop();
    if (command) {
      command.undo();
    }
  }

  public getCommandsCount(): number {
    return this.commands.length;
  }

  public getHistoryCount(): number {
    return this.history.length;
  }
}

// More complex example with multiple devices
export class Fan {
  private speed: number = 0; // 0: off, 1: low, 2: medium, 3: high
  private prevSpeed: number = 0;

  public setSpeed(speed: number): void {
    this.prevSpeed = this.speed;
    this.speed = speed;
  }

  public getSpeed(): number {
    return this.speed;
  }

  public getPrevSpeed(): number {
    return this.prevSpeed;
  }
}

export class FanCommand implements Command {
  private fan: Fan;
  private speed: number;

  constructor(fan: Fan, speed: number) {
    this.fan = fan;
    this.speed = speed;
  }

  public execute(): void {
    this.fan.setSpeed(this.speed);
  }

  public undo(): void {
    this.fan.setSpeed(this.fan.getPrevSpeed());
  }
}

// Macro Command - executes multiple commands
export class MacroCommand implements Command {
  private commands: Command[];

  constructor(commands: Command[]) {
    this.commands = commands;
  }

  public execute(): void {
    this.commands.forEach(command => command.execute());
  }

  public undo(): void {
    // Undo commands in reverse order
    for (let i = this.commands.length - 1; i >= 0; i--) {
      this.commands[i].undo();
    }
  }

  public getCommandCount(): number {
    return this.commands.length;
  }
}
