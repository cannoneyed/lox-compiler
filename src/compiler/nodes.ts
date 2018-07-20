import { Token, TokenType } from './tokens';

export type Statement =
  | Empty
  | Block
  | ExpressionStatement
  | PrintStatement
  | VariableDeclaration
  | IfStatement;

export type Expression =
  | Assignment
  | Boolean
  | Empty
  | Identifier
  | GroupExpression
  | Number
  | String
  | UnaryExpression
  | BinaryExpression;

export type Node = Statement | Expression;

export class Empty {}

export class Block {
  statements: Statement[] = [];
}

export class ExpressionStatement {
  constructor(public expression: Expression) {}
}

export class PrintStatement {
  constructor(public expression: Expression) {}
}

export class IfStatement {
  constructor(
    public condition: Expression,
    public thenBranch: Statement,
    public elseBranch: Statement | null
  ) {}
}

export class VariableDeclaration {
  constructor(public identifier: Token, public expression: Expression | null) {}
}

export class Assignment {
  constructor(public identifier: Identifier, public expression: Expression) {}
}

export class Identifier {
  constructor(public name: string) {}
}

export class GroupExpression {
  constructor(public expression: Expression) {}
}

export class Number {
  constructor(public value: number) {}
}

export class Boolean {
  constructor(public value: boolean) {}
}

export class String {
  constructor(public value: string) {}
}

export class UnaryExpression {
  constructor(public operation: TokenType, public right: Expression) {}
}

export class BinaryExpression {
  constructor(public left: Expression, public operation: TokenType, public right: Expression) {}
}
