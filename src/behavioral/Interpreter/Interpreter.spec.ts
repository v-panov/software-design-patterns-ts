import {
  Context,
  VariableExpression,
  NumberExpression,
  AddExpression,
  SubtractExpression,
  MultiplyExpression,
  DivideExpression,
  ExpressionParser,
  BooleanContext,
  BooleanVariableExpression,
  BooleanConstantExpression,
  AndExpression,
  OrExpression,
  NotExpression,
  BooleanExpressionParser,
  QueryContext,
  SelectAllExpression,
  EqualsExpression,
  GreaterThanExpression,
  CompositeQuery,
  WhereExpression
} from './Interpreter';

describe('Interpreter Pattern', () => {
  describe('Arithmetic Expression Interpreter', () => {
    let context: Context;

    beforeEach(() => {
      context = new Context();
      context.setValue('a', 10);
      context.setValue('b', 5);
      context.setValue('c', 7);
    });

    it('should interpret variable expressions', () => {
      const expression = new VariableExpression('a');
      expect(expression.interpret(context)).toBe(10);
      expect(expression.toString()).toBe('a');
    });

    it('should interpret number expressions', () => {
      const expression = new NumberExpression(42);
      expect(expression.interpret(context)).toBe(42);
      expect(expression.toString()).toBe('42');
    });

    it('should interpret addition expressions', () => {
      const left = new VariableExpression('a');
      const right = new NumberExpression(5);
      const expression = new AddExpression(left, right);

      expect(expression.interpret(context)).toBe(15); // 10 + 5
      expect(expression.toString()).toBe('(a + 5)');
    });

    it('should interpret subtraction expressions', () => {
      const left = new VariableExpression('a');
      const right = new VariableExpression('b');
      const expression = new SubtractExpression(left, right);

      expect(expression.interpret(context)).toBe(5); // 10 - 5
      expect(expression.toString()).toBe('(a - b)');
    });

    it('should interpret multiplication expressions', () => {
      const left = new VariableExpression('b');
      const right = new VariableExpression('c');
      const expression = new MultiplyExpression(left, right);

      expect(expression.interpret(context)).toBe(35); // 5 * 7
      expect(expression.toString()).toBe('(b * c)');
    });

    it('should interpret division expressions', () => {
      const left = new VariableExpression('a');
      const right = new VariableExpression('b');
      const expression = new DivideExpression(left, right);

      expect(expression.interpret(context)).toBe(2); // 10 / 5
      expect(expression.toString()).toBe('(a / b)');
    });

    it('should throw error when dividing by zero', () => {
      const left = new VariableExpression('a');
      const right = new NumberExpression(0);
      const expression = new DivideExpression(left, right);

      expect(() => expression.interpret(context)).toThrow('Division by zero');
    });

    it('should throw error when variable is not defined', () => {
      const expression = new VariableExpression('d'); // 'd' is not defined

      expect(() => expression.interpret(context)).toThrow('Variable d not defined');
    });

    it('should interpret complex expressions', () => {
      // a + b * c = 10 + (5 * 7) = 10 + 35 = 45
      const a = new VariableExpression('a');
      const b = new VariableExpression('b');
      const c = new VariableExpression('c');
      const mult = new MultiplyExpression(b, c);
      const add = new AddExpression(a, mult);

      expect(add.interpret(context)).toBe(45);
      expect(add.toString()).toBe('(a + (b * c))');

      // (a + b) / (c - 2) = (10 + 5) / (7 - 2) = 15 / 5 = 3
      const addExpr = new AddExpression(a, b);
      const subtractExpr = new SubtractExpression(c, new NumberExpression(2));
      const divideExpr = new DivideExpression(addExpr, subtractExpr);

      expect(divideExpr.interpret(context)).toBe(3);
      expect(divideExpr.toString()).toBe('((a + b) / (c - 2))');
    });

    it('should parse and interpret simple expressions', () => {
      const parser = new ExpressionParser();
      const expr = parser.parse('a + 5');

      expect(expr.interpret(context)).toBe(15); // 10 + 5
      expect(expr.toString()).toBe('(a + 5)');
    });

    it('should parse and interpret complex expressions', () => {
      const parser = new ExpressionParser();
      const expr = parser.parse('a + b * c');

      expect(expr.interpret(context)).toBe(45); // 10 + (5 * 7) = 45 (note: no operator precedence)
    });
  });

  describe('Boolean Expression Interpreter', () => {
    let context: BooleanContext;

    beforeEach(() => {
      context = new BooleanContext();
      context.setVariable('x', true);
      context.setVariable('y', false);
      context.setVariable('z', true);
    });

    it('should interpret boolean variables', () => {
      const x = new BooleanVariableExpression('x');
      const y = new BooleanVariableExpression('y');

      expect(x.interpret(context)).toBe(true);
      expect(y.interpret(context)).toBe(false);
    });

    it('should interpret boolean constants', () => {
      const trueExpr = new BooleanConstantExpression(true);
      const falseExpr = new BooleanConstantExpression(false);

      expect(trueExpr.interpret(context)).toBe(true);
      expect(falseExpr.interpret(context)).toBe(false);
    });

    it('should interpret AND expressions', () => {
      const x = new BooleanVariableExpression('x');
      const y = new BooleanVariableExpression('y');
      const z = new BooleanVariableExpression('z');

      // x AND y = true AND false = false
      const expr1 = new AndExpression(x, y);
      expect(expr1.interpret(context)).toBe(false);

      // x AND z = true AND true = true
      const expr2 = new AndExpression(x, z);
      expect(expr2.interpret(context)).toBe(true);

      // y AND z = false AND true = false
      const expr3 = new AndExpression(y, z);
      expect(expr3.interpret(context)).toBe(false);
    });

    it('should interpret OR expressions', () => {
      const x = new BooleanVariableExpression('x');
      const y = new BooleanVariableExpression('y');
      const z = new BooleanVariableExpression('z');

      // x OR y = true OR false = true
      const expr1 = new OrExpression(x, y);
      expect(expr1.interpret(context)).toBe(true);

      // x OR z = true OR true = true
      const expr2 = new OrExpression(x, z);
      expect(expr2.interpret(context)).toBe(true);

      // y OR z = false OR true = true
      const expr3 = new OrExpression(y, z);
      expect(expr3.interpret(context)).toBe(true);

      // y OR y = false OR false = false
      const expr4 = new OrExpression(y, y);
      expect(expr4.interpret(context)).toBe(false);
    });

    it('should interpret NOT expressions', () => {
      const x = new BooleanVariableExpression('x');
      const y = new BooleanVariableExpression('y');

      // NOT x = NOT true = false
      const expr1 = new NotExpression(x);
      expect(expr1.interpret(context)).toBe(false);

      // NOT y = NOT false = true
      const expr2 = new NotExpression(y);
      expect(expr2.interpret(context)).toBe(true);

      // NOT (NOT y) = NOT (NOT false) = NOT true = false
      const expr3 = new NotExpression(expr2);
      expect(expr3.interpret(context)).toBe(false);
    });

    it('should interpret complex boolean expressions', () => {
      const x = new BooleanVariableExpression('x');
      const y = new BooleanVariableExpression('y');
      const z = new BooleanVariableExpression('z');

      // x AND (y OR z) = true AND (false OR true) = true AND true = true
      const orExpr = new OrExpression(y, z);
      const andExpr = new AndExpression(x, orExpr);
      expect(andExpr.interpret(context)).toBe(true);
      expect(andExpr.toString()).toBe('(x AND (y OR z))');

      // (x AND y) OR (NOT z) = (true AND false) OR (NOT true) = false OR false = false
      const andExpr2 = new AndExpression(x, y);
      const notExpr = new NotExpression(z);
      const orExpr2 = new OrExpression(andExpr2, notExpr);
      expect(orExpr2.interpret(context)).toBe(false);
      expect(orExpr2.toString()).toBe('((x AND y) OR NOT z)');
    });

    it('should parse and interpret boolean expressions', () => {
      const parser = new BooleanExpressionParser();

      const expr1 = parser.parse('x AND y');
      expect(expr1.interpret(context)).toBe(false);

      const expr2 = parser.parse('x OR y');
      expect(expr2.interpret(context)).toBe(true);

      const expr3 = parser.parse('NOT y');
      expect(expr3.interpret(context)).toBe(true);

      const expr4 = parser.parse('x AND (y OR z)');
      expect(expr4.interpret(context)).toBe(true);

      const expr5 = parser.parse('(x AND y) OR (NOT z)');
      expect(expr5.interpret(context)).toBe(false);
    });
  });

  describe('SQL-like Query Interpreter', () => {
    let data: Array<{ id: number; name: string; age: number; active: boolean }>;
    let context: QueryContext;

    beforeEach(() => {
      data = [
        {id: 1, name: 'John', age: 25, active: true},
        {id: 2, name: 'Jane', age: 30, active: true},
        {id: 3, name: 'Bob', age: 20, active: false},
        {id: 4, name: 'Alice', age: 35, active: true},
        {id: 5, name: 'Charlie', age: 40, active: false}
      ];
      context = new QueryContext(data);
    });

    it('should select all records', () => {
      const query = new SelectAllExpression();
      const result = query.interpret(context);

      expect(result).toHaveLength(5);
      expect(result).toEqual(data);
    });

    it('should filter records by equals condition', () => {
      const query = new EqualsExpression('name', 'John');
      const result = query.interpret(context);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('John');
      expect(result[0].id).toBe(1);
    });

    it('should filter records by greater than condition', () => {
      const query = new GreaterThanExpression('age', 30);
      const result = query.interpret(context);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Alice');
      expect(result[1].name).toBe('Charlie');
    });

    it('should handle custom where conditions', () => {
      const query = new WhereExpression(
        record => record.age >= 25 && record.active,
        'age >= 25 AND active = true'
      );
      const result = query.interpret(context);

      expect(result).toHaveLength(3);
      expect(result.map(r => r.name)).toEqual(['John', 'Jane', 'Alice']);
    });

    it('should combine multiple expressions', () => {
      const composite = new CompositeQuery();
      composite.add(new SelectAllExpression());
      composite.add(new GreaterThanExpression('age', 25));
      composite.add(new EqualsExpression('active', true));

      const result = composite.interpret(context);

      expect(result).toHaveLength(2);
      expect(result.map(r => r.name)).toEqual(['Jane', 'Alice']);
      expect(composite.toString()).toBe('SELECT * age > 25 active = true');
    });
  });
});
