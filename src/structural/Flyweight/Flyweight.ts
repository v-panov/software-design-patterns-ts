/**
 * Flyweight Pattern
 * Minimizes memory usage by sharing as much data as possible with similar objects.
 * It separates the intrinsic state (shared) from the extrinsic state (unique to each instance).
 */

// Tree example with a Flyweight pattern

// Flyweight - intrinsic shared state
export class TreeType {
  private name: string;
  private color: string;
  private texture: string;

  constructor(name: string, color: string, texture: string) {
    this.name = name;
    this.color = color;
    this.texture = texture;
  }

  public render(canvas: Canvas, x: number, y: number, height: number, width: number): string {
    return `Drawing ${this.name} tree with ${this.color} color and ${this.texture} texture at (${x}, ${y}) with height=${height} and width=${width}`;
  }

  public getName(): string {
    return this.name;
  }

  public getColor(): string {
    return this.color;
  }

  public getTexture(): string {
    return this.texture;
  }
}

// Flyweight Factory - manages flyweights
export class TreeTypeFactory {
  private static treeTypes: Map<string, TreeType> = new Map();

  public static getTreeType(name: string, color: string, texture: string): TreeType {
    const key = `${name}_${color}_${texture}`;

    if (!this.treeTypes.has(key)) {
      console.log(`Creating new tree type: ${key}`);
      this.treeTypes.set(key, new TreeType(name, color, texture));
    }

    return this.treeTypes.get(key)!;
  }

  public static getCount(): number {
    return this.treeTypes.size;
  }

  // For testing purposes
  public static reset(): void {
    this.treeTypes.clear();
  }
}

// Context class that uses flyweight - contains extrinsic state
export class Tree {
  private x: number;
  private y: number;
  private height: number;
  private width: number;
  private treeType: TreeType; // reference to flyweight

  constructor(x: number, y: number, height: number, width: number, treeType: TreeType) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.treeType = treeType;
  }

  public draw(canvas: Canvas): string {
    return this.treeType.render(canvas, this.x, this.y, this.height, this.width);
  }

  public getPosition(): { x: number; y: number } {
    return {x: this.x, y: this.y};
  }

  public getSize(): { height: number; width: number } {
    return {height: this.height, width: this.width};
  }

  public getTreeType(): TreeType {
    return this.treeType;
  }
}

// Client context class
export class Forest {
  private trees: Tree[] = [];

  public plantTree(
    x: number,
    y: number,
    height: number,
    width: number,
    name: string,
    color: string,
    texture: string
  ): void {
    const treeType = TreeTypeFactory.getTreeType(name, color, texture);
    const tree = new Tree(x, y, height, width, treeType);
    this.trees.push(tree);
  }

  public draw(canvas: Canvas): string[] {
    return this.trees.map(tree => tree.draw(canvas));
  }

  public getTreeCount(): number {
    return this.trees.length;
  }

  public getTreeTypeCount(): number {
    return TreeTypeFactory.getCount();
  }
}

// Helper class for rendering
export class Canvas {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  public getSize(): { width: number; height: number } {
    return {width: this.width, height: this.height};
  }
}

// Another example: Text Formatting with Flyweight

// Character flyweight (intrinsic state)
export class CharacterStyle {
  private fontFamily: string;
  private fontSize: number;
  private isBold: boolean;
  private isItalic: boolean;
  private color: string;

  constructor(
    fontFamily: string,
    fontSize: number,
    isBold: boolean,
    isItalic: boolean,
    color: string
  ) {
    this.fontFamily = fontFamily;
    this.fontSize = fontSize;
    this.isBold = isBold;
    this.isItalic = isItalic;
    this.color = color;
  }

  public getDescription(): string {
    return `Font: ${this.fontFamily}, Size: ${this.fontSize}, ` +
      `${this.isBold ? 'Bold' : 'Not Bold'}, ` +
      `${this.isItalic ? 'Italic' : 'Not Italic'}, ` +
      `Color: ${this.color}`;
  }

  public getFontFamily(): string {
    return this.fontFamily;
  }

  public getFontSize(): number {
    return this.fontSize;
  }

  public isBoldStyle(): boolean {
    return this.isBold;
  }

  public isItalicStyle(): boolean {
    return this.isItalic;
  }

  public getColor(): string {
    return this.color;
  }
}

// Flyweight factory for character styles
export class StyleManager {
  private static styles: Map<string, CharacterStyle> = new Map();

  public static getStyle(
    fontFamily: string,
    fontSize: number,
    isBold: boolean,
    isItalic: boolean,
    color: string
  ): CharacterStyle {
    const key = `${fontFamily}-${fontSize}-${isBold}-${isItalic}-${color}`;

    if (!this.styles.has(key)) {
      this.styles.set(
        key,
        new CharacterStyle(fontFamily, fontSize, isBold, isItalic, color)
      );
    }

    return this.styles.get(key)!;
  }

  public static getStyleCount(): number {
    return this.styles.size;
  }

  // For testing purposes
  public static reset(): void {
    this.styles.clear();
  }
}

// Context class containing extrinsic state
export class FormattedCharacter {
  private char: string;
  private style: CharacterStyle;
  private position: number;

  constructor(char: string, position: number, style: CharacterStyle) {
    this.char = char;
    this.position = position;
    this.style = style;
  }

  public render(): string {
    return `Character '${this.char}' at position ${this.position} with ${this.style.getDescription()}`;
  }

  public getChar(): string {
    return this.char;
  }

  public getPosition(): number {
    return this.position;
  }

  public getStyle(): CharacterStyle {
    return this.style;
  }
}

// Client class
export class TextEditor {
  private characters: FormattedCharacter[] = [];

  public addText(text: string, fontFamily: string, fontSize: number, isBold: boolean, isItalic: boolean, color: string): void {
    const style = StyleManager.getStyle(fontFamily, fontSize, isBold, isItalic, color);

    for (let i = 0; i < text.length; i++) {
      const position = this.characters.length;
      this.characters.push(new FormattedCharacter(text[i], position, style));
    }
  }

  public render(): string[] {
    return this.characters.map(char => char.render());
  }

  public getCharacterCount(): number {
    return this.characters.length;
  }

  public getStyleCount(): number {
    return StyleManager.getStyleCount();
  }
}
