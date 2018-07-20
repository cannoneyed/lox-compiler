import { Token, TokenType } from './tokens';

export type Statement = ExpressionStatement | PrintStatement | VariableDeclaration;

export type Expression =
  | Empty
  | Identifier
  | GroupExpression
  | Number
  | UnaryExpression
  | BinaryExpression;

export type Node = Empty | Block | Statement | Expression;

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

export class VariableDeclaration {
  constructor(public identifier: Token, public expression: Expression | null) {}
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

export class UnaryExpression {
  constructor(public operation: TokenType, public right: Expression) {}
}

export class BinaryExpression {
  constructor(public left: Expression, public operation: TokenType, public right: Expression) {}
}
