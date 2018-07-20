import { Token, TokenType } from './tokens';
import doLexing from './lex';
import doParsing, { SyntaxTree } from './parse';
import { evaluate } from './evaluate';

export const compile = (input: string) => {
  const tokens = doLexing(input);
  const ast = doParsing(tokens);
  console.time('execution');
  evaluate(ast);
  console.timeEnd('execution');
  return { tokens, ast };
};

export const lex = (input: string) => {
  const tokens = doLexing(input);
  return { tokens };
};

export const parse = (input: string) => {
  const tokens = doLexing(input);
  const ast = doParsing(tokens);
  return { ast, tokens };
};

export { SyntaxTree, Token, TokenType };
