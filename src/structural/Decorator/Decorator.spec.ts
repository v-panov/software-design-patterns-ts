import {
  SimpleCoffee,
  MilkDecorator,
  SugarDecorator,
  WhipDecorator,
  VanillaDecorator,
  CaramelDecorator,
  PlainTextFormatter,
  BoldDecorator,
  ItalicDecorator,
  UnderlineDecorator,
  ColorDecorator
} from './Decorator';

describe('Decorator Pattern', () => {
  describe('Coffee Decorator', () => {
    it('should create simple coffee with correct description and cost', () => {
      const coffee = new SimpleCoffee();

      expect(coffee.getDescription()).toBe('Simple coffee');
      expect(coffee.getCost()).toBe(2.0);
    });

    it('should add milk to coffee', () => {
      const coffee = new SimpleCoffee();
      const milkCoffee = new MilkDecorator(coffee);

      expect(milkCoffee.getDescription()).toBe('Simple coffee, milk');
      expect(milkCoffee.getCost()).toBe(2.5);
    });

    it('should add sugar to coffee', () => {
      const coffee = new SimpleCoffee();
      const sugarCoffee = new SugarDecorator(coffee);

      expect(sugarCoffee.getDescription()).toBe('Simple coffee, sugar');
      expect(sugarCoffee.getCost()).toBe(2.2);
    });

    it('should chain multiple decorators', () => {
      const coffee = new SimpleCoffee();
      const decoratedCoffee = new CaramelDecorator(
        new WhipDecorator(
          new VanillaDecorator(
            new MilkDecorator(
              new SugarDecorator(coffee)
            )
          )
        )
      );

      expect(decoratedCoffee.getDescription()).toBe('Simple coffee, sugar, milk, vanilla, whip, caramel');
      expect(decoratedCoffee.getCost()).toBe(4.8); // 2.0 + 0.2 + 0.5 + 0.6 + 0.7 + 0.8
    });

    it('should allow different combinations of decorators', () => {
      const coffee1 = new VanillaDecorator(new MilkDecorator(new SimpleCoffee()));
      const coffee2 = new CaramelDecorator(new WhipDecorator(new SimpleCoffee()));

      expect(coffee1.getDescription()).toBe('Simple coffee, milk, vanilla');
      expect(coffee1.getCost()).toBe(3.1); // 2.0 + 0.5 + 0.6

      expect(coffee2.getDescription()).toBe('Simple coffee, whip, caramel');
      expect(coffee2.getCost()).toBe(3.5); // 2.0 + 0.7 + 0.8
    });

    it('should work with same decorator applied multiple times', () => {
      const coffee = new SimpleCoffee();
      const doubleMilkCoffee = new MilkDecorator(new MilkDecorator(coffee));

      expect(doubleMilkCoffee.getDescription()).toBe('Simple coffee, milk, milk');
      expect(doubleMilkCoffee.getCost()).toBe(3.0); // 2.0 + 0.5 + 0.5
    });
  });

  describe('Text Formatter Decorator', () => {
    it('should format plain text', () => {
      const formatter = new PlainTextFormatter();

      expect(formatter.format('Hello World')).toBe('Hello World');
    });

    it('should apply bold formatting', () => {
      const formatter = new PlainTextFormatter();
      const boldFormatter = new BoldDecorator(formatter);

      expect(boldFormatter.format('Hello World')).toBe('<b>Hello World</b>');
    });

    it('should apply italic formatting', () => {
      const formatter = new PlainTextFormatter();
      const italicFormatter = new ItalicDecorator(formatter);

      expect(italicFormatter.format('Hello World')).toBe('<i>Hello World</i>');
    });

    it('should apply underline formatting', () => {
      const formatter = new PlainTextFormatter();
      const underlineFormatter = new UnderlineDecorator(formatter);

      expect(underlineFormatter.format('Hello World')).toBe('<u>Hello World</u>');
    });

    it('should apply color formatting', () => {
      const formatter = new PlainTextFormatter();
      const colorFormatter = new ColorDecorator(formatter, 'red');

      expect(colorFormatter.format('Hello World')).toBe('<span style="color: red">Hello World</span>');
    });

    it('should chain multiple text formatters', () => {
      const formatter = new PlainTextFormatter();
      const decoratedFormatter = new ColorDecorator(
        new UnderlineDecorator(
          new ItalicDecorator(
            new BoldDecorator(formatter)
          )
        ),
        'blue'
      );

      expect(decoratedFormatter.format('Hello World')).toBe(
        '<span style="color: blue"><u><i><b>Hello World</b></i></u></span>'
      );
    });

    it('should allow different color combinations', () => {
      const formatter = new PlainTextFormatter();
      const redBoldFormatter = new ColorDecorator(new BoldDecorator(formatter), 'red');
      const greenItalicFormatter = new ColorDecorator(new ItalicDecorator(formatter), 'green');

      expect(redBoldFormatter.format('Red Bold')).toBe('<span style="color: red"><b>Red Bold</b></span>');
      expect(greenItalicFormatter.format('Green Italic')).toBe('<span style="color: green"><i>Green Italic</i></span>');
    });

    it('should work with same decorator applied multiple times', () => {
      const formatter = new PlainTextFormatter();
      const doubleBoldFormatter = new BoldDecorator(new BoldDecorator(formatter));

      expect(doubleBoldFormatter.format('Double Bold')).toBe('<b><b>Double Bold</b></b>');
    });
  });
});
