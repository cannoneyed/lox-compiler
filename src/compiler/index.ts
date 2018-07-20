import { Token, TokenType } from './tokens';
import lex from './lex';
import parse, { SyntaxTree } from './parse';
// import { evaluate } from './evaluate-bytecode';

export const compile = (input: string) => {
  const tokens = lex(input);
  const ast = parse(tokens);
  return { tokens, ast };
};

export { SyntaxTree, Token, TokenType };
