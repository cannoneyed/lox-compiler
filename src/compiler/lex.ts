import { Token, TokenType } from './tokens';

const captureGroups = [
  { str: '\\d+(?:\\.\\d+)?', type: TokenType.NUMBER },
  { str: '\\+', type: TokenType.PLUS },
  { str: '\\-', type: TokenType.MINUS },
  { str: '\\*', type: TokenType.MULTIPLY },
  { str: '\\/', type: TokenType.DIVIDE },
  { str: '\\^', type: TokenType.POWER },
  { str: '\\(', type: TokenType.LEFT_PAREN },
  { str: '\\)', type: TokenType.RIGHT_PAREN },
  { str: 'var', type: TokenType.VAR },
  { str: 'and', type: TokenType.AND },
  { str: 'or', type: TokenType.OR },
  { str: '!=', type: TokenType.NOT_EQUAL },
  { str: '==', type: TokenType.EQUAL_EQUAL },
  { str: '>=', type: TokenType.GT_EQUAL },
  { str: '<=', type: TokenType.LT_EQUAL },
  { str: '>', type: TokenType.GT },
  { str: '<', type: TokenType.LT },
  { str: '!', type: TokenType.NOT },
  { str: '=', type: TokenType.EQUAL },
  { str: '{', type: TokenType.LEFT_BRACE },
  { str: '}', type: TokenType.RIGHT_BRACE },
  { str: ';', type: TokenType.SEMICOLON },
  { str: 'if', type: TokenType.IF },
  { str: 'else', type: TokenType.ELSE },
  { str: 'print', type: TokenType.PRINT },
  { str: 'true', type: TokenType.TRUE },
  { str: 'false', type: TokenType.FALSE },
  { str: 'nil', type: TokenType.NIL },
  { str: '[a-zA-Z_][a-zA-Z_0-9]*', type: TokenType.IDENTIFIER },
];

const regexpStr = captureGroups.map(captureGroup => `(${captureGroup.str})`).join('|');
const lexRegex = new RegExp(regexpStr, 'g');

export default function lex(input: string) {
  let result;
  const tokens: Token[] = [];
  do {
    result = lexRegex.exec(input);
    if (result) {
      const captureResults = result.slice(1, result.length);
      const index = captureResults.findIndex(item => item !== undefined);
      if (index !== undefined) {
        const type = captureGroups[index].type;
        const lexeme = captureResults[index];
        tokens.push({ type, lexeme });
      }
    }
  } while (result);
  return tokens;
}
