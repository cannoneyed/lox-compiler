import * as Node from './nodes';
import { TokenType } from './tokens';

type Scope = Map<string, any>;
const variables: Scope[] = [];

const declareVariable = (name: string, value: any) => {
  const scope = variables[variables.length - 1];
  scope.set(name, value);
};

const getVariable = (name: string) => {
  for (let i = variables.length - 1; i >= 0; i--) {
    const scope = variables[i];
    if (scope.has(name)) {
      return scope.get(name);
    }
  }
  throw new Error(`${name} is not defined`);
};

const setVariable = (name: string, value: any) => {
  for (let i = variables.length - 1; i >= 0; i--) {
    const scope = variables[i];
    if (scope.has(name)) {
      return scope.set(name, value);
    }
  }
  throw new Error(`${name} is not defined`);
};

const isTruthy = (value: number | string | null | boolean): boolean => {
  if (value === false || value === null) {
    return false;
  } else {
    return true;
  }
};

export const evaluate = (node: Node.Node): any => {
  if (node instanceof Node.Block) {
    variables.push(new Map());
    for (const statement of node.statements) {
      evaluate(statement);
    }
    variables.pop();
  }

  if (node instanceof Node.PrintStatement) {
    console.log(evaluate(node.expression));
  }

  if (node instanceof Node.IfStatement) {
    const { condition, thenBranch, elseBranch } = node;
    if (isTruthy(evaluate(condition))) {
      evaluate(thenBranch);
    } else if (elseBranch) {
      evaluate(elseBranch);
    }
  }

  if (node instanceof Node.WhileStatement) {
    const { condition, body } = node;
    while (isTruthy(evaluate(condition))) {
      evaluate(body);
    }
  }

  if (node instanceof Node.VariableDeclaration) {
    const { identifier, expression } = node;
    const value = expression ? evaluate(expression) : null;
    declareVariable(identifier.lexeme, value);
  }

  if (node instanceof Node.Assignment) {
    const { identifier, expression } = node;
    const value = expression ? evaluate(expression) : null;
    setVariable(identifier.name, value);
  }

  if (node instanceof Node.ExpressionStatement) {
    return evaluate(node.expression);
  }

  if (node instanceof Node.Identifier) {
    return getVariable(node.name);
  }

  if (node instanceof Node.GroupExpression) {
    return evaluate(node.expression);
  }

  if (node instanceof Node.UnaryExpression) {
    const right = evaluate(node.right);
    switch (node.operation) {
      case TokenType.MINUS:
        return -1 * right;
      case TokenType.NOT:
        return !isTruthy(right);
    }
  }

  if (node instanceof Node.BinaryExpression) {
    const left = evaluate(node.left);
    const right = evaluate(node.right);

    switch (node.operation) {
      case TokenType.AND:
        return isTruthy(left) && isTruthy(right);
      case TokenType.OR:
        return isTruthy(left) || isTruthy(right);
      case TokenType.EQUAL_EQUAL:
        return left === right;
      case TokenType.NOT_EQUAL:
        return left !== right;
      case TokenType.GT:
        return left > right;
      case TokenType.GT_EQUAL:
        return left >= right;
      case TokenType.LT:
        return left < right;
      case TokenType.LT_EQUAL:
        return left <= right;
      case TokenType.PLUS:
        return left + right;
      case TokenType.MINUS:
        return left - right;
      case TokenType.MULTIPLY:
        return left * right;
      case TokenType.DIVIDE:
        return left / right;
      case TokenType.POWER:
        return Math.pow(left, right);
    }
  }

  if (node instanceof Node.Number || node instanceof Node.Boolean || node instanceof Node.String) {
    return node.value;
  }

  if (node instanceof Node.Nil) {
    return null;
  }
};
