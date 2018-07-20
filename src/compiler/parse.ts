import { Token, TokenType } from './tokens';

import * as Node from './nodes';

let tokens: Token[];
let current = 0;

const isAtEnd = () => current === tokens.length;
const getToken = () => tokens[current];
const previous = () => tokens[current - 1];

const match = (...types: TokenType[]) => {
  for (let type of types) {
    if (check(type)) {
      advance();
      return true;
    }
  }
  return false;
};

const check = (tokenType: TokenType) => {
  if (isAtEnd()) return false;
  return getToken().type == tokenType;
};

const advance = () => {
  if (!isAtEnd()) current++;
  return previous();
};

const consume = (tokenType: TokenType, errorMessage: string) => {
  if (check(tokenType)) return advance();
  throw error(getToken(), errorMessage);
};

const error = (token: Token, errorMessage: string) => {
  return new Error(errorMessage);
};

const parseProgram = () => {
  const programNode = new Node.Block();
  while (!isAtEnd()) {
    const statement = parseStatement();
    programNode.statements.push(statement);
  }
  return programNode;
};

const parseBlock = () => {
  const blockNode = new Node.Block();
  while (!match(TokenType.RIGHT_BRACE) && !isAtEnd()) {
    const statement = parseStatement();
    blockNode.statements.push(statement);
  }
  return blockNode;
};

const parseStatement = () => {
  let statement: Node.Statement;

  if (match(TokenType.PRINT)) {
    const expression = parseExpression();
    statement = new Node.PrintStatement(expression);
  } else if (match(TokenType.VAR)) {
    statement = parseVariableDeclaration();
  } else if (match(TokenType.LEFT_BRACE)) {
    const expression = parseBlock();
    statement = new Node.ExpressionStatement(expression);
  } else {
    const expression = parseExpression();
    statement = new Node.ExpressionStatement(expression);
  }

  consume(TokenType.SEMICOLON, "Expect ';' after statement.");
  return statement;
};

const parseVariableDeclaration = () => {
  let identifier: Token;
  let expression: Node.Expression;
  if (match(TokenType.IDENTIFIER)) {
    identifier = previous();
    if (match(TokenType.EQUAL)) {
      expression = parseExpression();
      return new Node.VariableDeclaration(identifier, expression);
    }
  }
  throw error(previous(), 'Expected identifier...');
};

const parseExpression = (): Node.Expression => {
  return parseAddition();
};

const parseAddition = (): Node.Expression => {
  let expr = parseMultiplication();
  while (match(TokenType.PLUS, TokenType.MINUS)) {
    const operator = previous();
    const right = parseMultiplication();
    expr = new Node.BinaryExpression(expr, operator.type, right);
  }
  return expr;
};

const parseMultiplication = (): Node.Expression => {
  let expr = parseExponentiation();
  while (match(TokenType.MULTIPLY, TokenType.DIVIDE)) {
    const operator = previous();
    const right = parseExponentiation();
    expr = new Node.BinaryExpression(expr, operator.type, right);
  }
  return expr;
};

const parseExponentiation = (): Node.Expression => {
  let expr = parseUnary();
  while (match(TokenType.POWER)) {
    const operator = previous();
    const right = parseUnary();
    expr = new Node.BinaryExpression(expr, operator.type, right);
  }
  return expr;
};

const parseUnary = (): Node.Expression => {
  while (match(TokenType.MINUS)) {
    const right = parseUnary();
    return new Node.UnaryExpression(TokenType.MINUS, right);
  }
  return parsePrimary();
};

const parsePrimary = (): Node.Expression => {
  if (match(TokenType.NUMBER)) {
    return new Node.Number(Number(previous().lexeme));
  }

  if (match(TokenType.LEFT_PAREN)) {
    const expr = parseExpression();
    consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
    return new Node.GroupExpression(expr);
  }

  return new Node.Empty();
};

const parse = (inputTokens: Token[]) => {
  tokens = [...inputTokens];
  current = 0;
  const ast = parseProgram();
  return ast;
};

export default parse;

export type SyntaxTree = Node.Block;
