/**
 * Interpreter Pattern
 * Given a language, defines a representation for its grammar along with an interpreter that uses the representation
 * to interpret sentences in the language.
 */

// Context class - contains information that's global to the interpreter
export class Context {
  private variables: Map<string, number> = new Map();

  public setValue(variable: string, value: number): void {
    this.variables.set(variable, value);
  }

  public getValue(variable: string): number {
    const value = this.variables.get(variable);
    if (value === undefined) {
      throw new Error(`Variable ${variable} not defined`);
    }
    return value;
  }
}

// Abstract Expression interface
export interface Expression {
  interpret(context: Context): number;

  toString(): string;
}

// Terminal Expression - Variable
export class VariableExpression implements Expression {
  private readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  public interpret(context: Context): number {
    return context.getValue(this.name);
  }

  public toString(): string {
    return this.name;
  }
}

// Terminal Expression - Number
export class NumberExpression implements Expression {
  private readonly value: number;

  constructor(value: number) {
    this.value = value;
  }

  public interpret(context: Context): number {
    return this.value;
  }

  public toString(): string {
    return this.value.toString();
  }
}

// Non-terminal Expression - Addition
export class AddExpression implements Expression {
  private readonly leftExpression: Expression;
  private readonly rightExpression: Expression;

  constructor(left: Expression, right: Expression) {
    this.leftExpression = left;
    this.rightExpression = right;
  }

  public interpret(context: Context): number {
    return this.leftExpression.interpret(context) + this.rightExpression.interpret(context);
  }

  public toString(): string {
    return `(${this.leftExpression.toString()} + ${this.rightExpression.toString()})`;
  }
}

// Non-terminal Expression - Subtraction
export class SubtractExpression implements Expression {
  private readonly leftExpression: Expression;
  private readonly rightExpression: Expression;

  constructor(left: Expression, right: Expression) {
    this.leftExpression = left;
    this.rightExpression = right;
  }

  public interpret(context: Context): number {
    return this.leftExpression.interpret(context) - this.rightExpression.interpret(context);
  }

  public toString(): string {
    return `(${this.leftExpression.toString()} - ${this.rightExpression.toString()})`;
  }
}

// Non-terminal Expression - Multiplication
export class MultiplyExpression implements Expression {
  private readonly leftExpression: Expression;
  private readonly rightExpression: Expression;

  constructor(left: Expression, right: Expression) {
    this.leftExpression = left;
    this.rightExpression = right;
  }

  public interpret(context: Context): number {
    return this.leftExpression.interpret(context) * this.rightExpression.interpret(context);
  }

  public toString(): string {
    return `(${this.leftExpression.toString()} * ${this.rightExpression.toString()})`;
  }
}

// Non-terminal Expression - Division
export class DivideExpression implements Expression {
  private readonly leftExpression: Expression;
  private readonly rightExpression: Expression;

  constructor(left: Expression, right: Expression) {
    this.leftExpression = left;
    this.rightExpression = right;
  }

  public interpret(context: Context): number {
    const divisor = this.rightExpression.interpret(context);
    if (divisor === 0) {
      throw new Error('Division by zero');
    }
    return this.leftExpression.interpret(context) / divisor;
  }

  public toString(): string {
    return `(${this.leftExpression.toString()} / ${this.rightExpression.toString()})`;
  }
}

// Expression parser
export class ExpressionParser {
  private tokenize(expression: string): string[] {
    // A simple tokenizer that separates tokens by spaces
    return expression.replace(/[\(\)\+\-\*\/]/g, ' $& ').trim().split(/\s+/);
  }

  public parse(expression: string): Expression {
    const tokens = this.tokenize(expression);
    return this.parseExpression(tokens);
  }

  private parseExpression(tokens: string[]): Expression {
    // Parse with proper operator precedence
    // Addition and subtraction have lower precedence than multiplication and division

    if (tokens.length === 0) {
      throw new Error('Empty expression');
    }

    return this.parseAddSubtract(tokens);
  }

  private parseAddSubtract(tokens: string[]): Expression {
    let left = this.parseMultiplyDivide(tokens);

    while (tokens.length > 0 && (tokens[0] === '+' || tokens[0] === '-')) {
      const operator = tokens.shift()!;
      const right = this.parseMultiplyDivide(tokens);

      if (operator === '+') {
        left = new AddExpression(left, right);
      } else {
        left = new SubtractExpression(left, right);
      }
    }

    return left;
  }

  private parseMultiplyDivide(tokens: string[]): Expression {
    let left = this.parseTerm(tokens.shift()!);

    while (tokens.length > 0 && (tokens[0] === '*' || tokens[0] === '/')) {
      const operator = tokens.shift()!;
      const right = this.parseTerm(tokens.shift()!);

      if (operator === '*') {
        left = new MultiplyExpression(left, right);
      } else {
        left = new DivideExpression(left, right);
      }
    }

    return left;
  }

  private parseTerm(token: string): Expression {
    // If it's a number, create a NumberExpression
    if (!isNaN(Number(token))) {
      return new NumberExpression(Number(token));
    }
    // Otherwise it's a variable
    return new VariableExpression(token);
  }
}

// More advanced example: Boolean expression interpreter

// Context for boolean expressions
export class BooleanContext {
  private variables: Map<string, boolean> = new Map();

  public setVariable(name: string, value: boolean): void {
    this.variables.set(name, value);
  }

  public getVariable(name: string): boolean {
    const value = this.variables.get(name);
    if (value === undefined) {
      throw new Error(`Boolean variable ${name} not defined`);
    }
    return value;
  }
}

// Boolean Expression interface
export interface BooleanExpression {
  interpret(context: BooleanContext): boolean;

  toString(): string;
}

// Terminal Expression - Variable
export class BooleanVariableExpression implements BooleanExpression {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  public interpret(context: BooleanContext): boolean {
    return context.getVariable(this.name);
  }

  public toString(): string {
    return this.name;
  }
}

// Terminal Expression - Constant
export class BooleanConstantExpression implements BooleanExpression {
  private value: boolean;

  constructor(value: boolean) {
    this.value = value;
  }

  public interpret(context: BooleanContext): boolean {
    return this.value;
  }

  public toString(): string {
    return this.value.toString();
  }
}

// Non-terminal Expression - AND
export class AndExpression implements BooleanExpression {
  private left: BooleanExpression;
  private right: BooleanExpression;

  constructor(left: BooleanExpression, right: BooleanExpression) {
    this.left = left;
    this.right = right;
  }

  public interpret(context: BooleanContext): boolean {
    return this.left.interpret(context) && this.right.interpret(context);
  }

  public toString(): string {
    return `(${this.left.toString()} AND ${this.right.toString()})`;
  }
}

// Non-terminal Expression - OR
export class OrExpression implements BooleanExpression {
  private left: BooleanExpression;
  private right: BooleanExpression;

  constructor(left: BooleanExpression, right: BooleanExpression) {
    this.left = left;
    this.right = right;
  }

  public interpret(context: BooleanContext): boolean {
    return this.left.interpret(context) || this.right.interpret(context);
  }

  public toString(): string {
    return `(${this.left.toString()} OR ${this.right.toString()})`;
  }
}

// Non-terminal Expression - NOT
export class NotExpression implements BooleanExpression {
  private expression: BooleanExpression;

  constructor(expression: BooleanExpression) {
    this.expression = expression;
  }

  public interpret(context: BooleanContext): boolean {
    return !this.expression.interpret(context);
  }

  public toString(): string {
    return `NOT ${this.expression.toString()}`;
  }
}

// Parser for boolean expressions
export class BooleanExpressionParser {
  public parse(expression: string): BooleanExpression {
    expression = expression.trim().toUpperCase();

    // Handle constants
    if (expression === 'TRUE') return new BooleanConstantExpression(true);
    if (expression === 'FALSE') return new BooleanConstantExpression(false);

    // Handle NOT
    if (expression.startsWith('NOT ')) {
      return new NotExpression(this.parse(expression.substring(4)));
    }

    // Look for OR first (lower precedence)
    const orIndex = this.findTopLevelOperator(expression, ' OR ');
    if (orIndex !== -1) {
      const left = this.parse(expression.substring(0, orIndex));
      const right = this.parse(expression.substring(orIndex + 4));
      return new OrExpression(left, right);
    }

    // Look for AND (higher precedence)
    const andIndex = this.findTopLevelOperator(expression, ' AND ');
    if (andIndex !== -1) {
      const left = this.parse(expression.substring(0, andIndex));
      const right = this.parse(expression.substring(andIndex + 5));
      return new AndExpression(left, right);
    }

    // Handle parentheses - only if the entire expression is wrapped
    if (expression.startsWith('(') && expression.endsWith(')') && this.isCompletelyWrapped(expression)) {
      return this.parse(expression.substring(1, expression.length - 1));
    }

    // If none of the above, it's a variable (convert back to lowercase for lookup)
    return new BooleanVariableExpression(expression.toLowerCase());
  }

  private isCompletelyWrapped(expression: string): boolean {
    if (!expression.startsWith('(') || !expression.endsWith(')')) {
      return false;
    }

    let count = 0;
    for (let i = 0; i < expression.length - 1; i++) {
      if (expression[i] === '(') count++;
      else if (expression[i] === ')') count--;
      if (count === 0) return false; // Parentheses closed before the end
    }
    return count === 1; // Should be 1 because we haven't processed the final ')'
  }

  private findTopLevelOperator(expression: string, operator: string): number {
    let parenthesesCount = 0;
    for (let i = 0; i <= expression.length - operator.length; i++) {
      if (expression[i] === '(') {
        parenthesesCount++;
      } else if (expression[i] === ')') {
        parenthesesCount--;
      } else if (parenthesesCount === 0 && expression.substring(i, i + operator.length) === operator) {
        return i;
      }
    }
    return -1;
  }
}

// SQL-like query interpreter

// Data record type
export type Record = { [key: string]: any };

// Query context
export class QueryContext {
  private data: Record[];

  constructor(data: Record[]) {
    this.data = data;
  }

  public getData(): Record[] {
    return this.data;
  }
}

// Query expression interface
export interface QueryExpression {
  interpret(context: QueryContext): Record[];

  toString(): string;
}

// Select all expression
export class SelectAllExpression implements QueryExpression {
  public interpret(context: QueryContext): Record[] {
    return context.getData();
  }

  public toString(): string {
    return 'SELECT *';
  }
}

// Where expression
export class WhereExpression implements QueryExpression {
  private condition: (record: Record) => boolean;
  private conditionString: string;

  constructor(condition: (record: Record) => boolean, conditionString: string) {
    this.condition = condition;
    this.conditionString = conditionString;
  }

  public interpret(context: QueryContext): Record[] {
    return context.getData().filter(this.condition);
  }

  public toString(): string {
    return `WHERE ${this.conditionString}`;
  }
}

// Field equals value expression
export class EqualsExpression implements QueryExpression {
  private field: string;
  private value: any;

  constructor(field: string, value: any) {
    this.field = field;
    this.value = value;
  }

  public interpret(context: QueryContext): Record[] {
    return context.getData().filter(record => record[this.field] === this.value);
  }

  public toString(): string {
    return `${this.field} = ${typeof this.value === 'string' ? `'${this.value}'` : this.value}`;
  }
}

// Field greater than value expression
export class GreaterThanExpression implements QueryExpression {
  private field: string;
  private value: number;

  constructor(field: string, value: number) {
    this.field = field;
    this.value = value;
  }

  public interpret(context: QueryContext): Record[] {
    return context.getData().filter(record => record[this.field] > this.value);
  }

  public toString(): string {
    return `${this.field} > ${this.value}`;
  }
}

// Composite query
export class CompositeQuery implements QueryExpression {
  private expressions: QueryExpression[] = [];

  public add(expression: QueryExpression): void {
    this.expressions.push(expression);
  }

  public interpret(context: QueryContext): Record[] {
    let result = context.getData();

    for (const expression of this.expressions) {
      // Create a new context with the current result
      const newContext = new QueryContext(result);
      result = expression.interpret(newContext);
    }

    return result;
  }

  public toString(): string {
    return this.expressions.map(expr => expr.toString()).join(' ');
  }
}
