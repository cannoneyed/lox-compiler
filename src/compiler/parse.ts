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
  let semicolonNeeded = true;

  if (match(TokenType.PRINT)) {
    const expression = parseExpression();
    statement = new Node.PrintStatement(expression);
  } else if (match(TokenType.VAR)) {
    statement = parseVariableDeclaration();
  } else if (match(TokenType.IF)) {
    statement = parseIfStatement();
    semicolonNeeded = false;
  } else if (match(TokenType.FOR)) {
    statement = parseForStatement();
    semicolonNeeded = false;
  } else if (match(TokenType.WHILE)) {
    statement = parseWhileStatement();
    semicolonNeeded = false;
  } else if (match(TokenType.LEFT_BRACE)) {
    const expression = parseBlock();
    statement = new Node.ExpressionStatement(expression);
    semicolonNeeded = false;
  } else {
    const expression = parseExpression();
    statement = new Node.ExpressionStatement(expression);
  }

  if (semicolonNeeded) {
    consume(TokenType.SEMICOLON, "Expect ';' after statement.");
  }
  return statement;
};

const parseForStatement = (): Node.Statement => {
  consume(TokenType.LEFT_PAREN, "Expect '(' after 'for'.");
  let initializer: Node.Statement | null;
  if (match(TokenType.SEMICOLON)) {
    initializer = null;
  } else if (match(TokenType.VAR)) {
    initializer = parseVariableDeclaration();
  } else {
    initializer = parseExpression();
  }

  let condition: Node.Expression | null = null;
  if (!check(TokenType.SEMICOLON)) {
    condition = parseExpression();
  }
  consume(TokenType.SEMICOLON, "Expect ';' after loop condition.");

  let increment: Node.Statement | null = null;
  if (!check(TokenType.RIGHT_PAREN)) {
    increment = parseExpression();
  }
  consume(TokenType.RIGHT_PAREN, "Expect ')' after for clause.");

  let body: Node.Statement = parseStatement();

  if (increment !== null) {
    const loopBody = body;
    body = new Node.Block();
    (body as Node.Block).statements = [loopBody, increment];
  }

  if (condition == null) {
    condition = new Node.Boolean(true);
  }
  body = new Node.WhileStatement(condition, body);

  if (initializer != null) {
    const loopBody = body;
    body = new Node.Block();
    (body as Node.Block).statements = [initializer, loopBody];
  }

  return body;
};

const parseWhileStatement = (): Node.WhileStatement => {
  consume(TokenType.LEFT_PAREN, "Expect '(' after 'while'.");
  const expression = parseExpression();
  consume(TokenType.RIGHT_PAREN, "Expect ')' after while condition.");
  const body: Node.Statement = parseStatement();
  return new Node.WhileStatement(expression, body);
};

const parseIfStatement = (): Node.IfStatement => {
  consume(TokenType.LEFT_PAREN, "Expect '(' after 'if'.");
  const expression = parseExpression();
  consume(TokenType.RIGHT_PAREN, "Expect ')' after if condition.");

  const thenBranch: Node.Statement = parseStatement();
  let elseBranch: Node.Statement | null = null;
  if (match(TokenType.ELSE)) {
    elseBranch = parseStatement();
  }
  return new Node.IfStatement(expression, thenBranch, elseBranch);
};

const parseVariableDeclaration = () => {
  let identifier: Token;
  let expression: Node.Expression;
  if (match(TokenType.IDENTIFIER)) {
    identifier = previous();
    if (match(TokenType.EQUAL)) {
      expression = parseExpression();
      return new Node.VariableDeclaration(identifier, expression);
    } else {
      return new Node.VariableDeclaration(identifier, null);
    }
  }
  error(previous(), 'Expected identifier...');
  return new Node.Empty();
};

const parseExpression = (): Node.Expression => {
  return parseAssignment();
};

const parseAssignment = (): Node.Expression => {
  const expression = parseOr();
  if (match(TokenType.EQUAL)) {
    const equals = previous();
    const value = parseAssignment();
    if (expression instanceof Node.Identifier) {
      return new Node.Assignment(expression, value);
    }
    error(equals, 'Invalid assignment target.');
  }
  return expression;
};

const parseOr = (): Node.Expression => {
  let expr = parseAnd();
  while (match(TokenType.OR)) {
    const operator = previous();
    const right = parseAnd();
    expr = new Node.BinaryExpression(expr, operator.type, right);
  }
  return expr;
};

const parseAnd = (): Node.Expression => {
  let expr = parseComparison();
  while (match(TokenType.AND)) {
    const operator = previous();
    const right = parseComparison();
    expr = new Node.BinaryExpression(expr, operator.type, right);
  }
  return expr;
};

const parseComparison = (): Node.Expression => {
  let expr = parseAddition();
  while (
    match(
      TokenType.EQUAL_EQUAL,
      TokenType.NOT_EQUAL,
      TokenType.GT,
      TokenType.GT_EQUAL,
      TokenType.LT,
      TokenType.LT_EQUAL
    )
  ) {
    const operator = previous();
    const right = parseAddition();
    expr = new Node.BinaryExpression(expr, operator.type, right);
  }
  return expr;
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
  while (match(TokenType.MINUS, TokenType.NOT)) {
    const token = previous();
    const right = parseUnary();
    return new Node.UnaryExpression(token.type, right);
  }
  return parsePrimary();
};

const parsePrimary = (): Node.Expression => {
  if (match(TokenType.NUMBER)) {
    return new Node.Number(Number(previous().lexeme));
  }

  if (match(TokenType.STRING)) {
    const value = previous().lexeme.replace(/"/g, '');
    return new Node.String(value);
  }

  if (match(TokenType.LEFT_PAREN)) {
    const expr = parseExpression();
    consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
    return new Node.GroupExpression(expr);
  }

  if (match(TokenType.IDENTIFIER)) {
    const identifier = previous();
    return new Node.Identifier(identifier.lexeme);
  }

  if (match(TokenType.TRUE, TokenType.FALSE)) {
    const token = previous();
    const value = token.type === TokenType.TRUE ? true : false;
    return new Node.Boolean(value);
  }

  if (match(TokenType.NIL)) {
    return new Node.Nil();
  }

  error(previous(), 'Invalid parsing...');
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
