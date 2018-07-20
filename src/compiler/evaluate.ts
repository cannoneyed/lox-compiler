import { Node, Number, GroupExpression, BinaryExpression, UnaryExpression } from './nodes';
import { TokenType } from './tokens';

export const evaluate = (node: Node): number => {
  if (node instanceof Number) {
    return node.value;
  }

  if (node instanceof GroupExpression) {
    return evaluate(node.expression);
  }

  if (node instanceof UnaryExpression) {
    const right = evaluate(node.right);
    switch (node.operation) {
      case TokenType.MINUS:
        return -1 * right;
    }
  }

  if (node instanceof BinaryExpression) {
    const left = evaluate(node.left);
    const right = evaluate(node.right);

    switch (node.operation) {
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

  return 0;
};
