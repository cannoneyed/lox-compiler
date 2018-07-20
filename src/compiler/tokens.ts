export const enum TokenType {
  NUMBER = 'NUMBER',
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  MULTIPLY = 'MULTIPLY',
  DIVIDE = 'DIVIDE',
  LEFT_PAREN = 'LEFT_PAREN',
  RIGHT_PAREN = 'RIGHT_PAREN',
  POWER = 'POWER',
  VAR = 'VAR',
  EQUAL = 'EQUAL',
  LEFT_BRACE = 'LEFT_BRACE',
  RIGHT_BRACE = 'RIGHT_BRACE',
  IDENTIFIER = 'IDENTIFIER',
  SEMICOLON = 'SEMICOLON',
  PRINT = 'PRINT',
}

export interface Token {
  type: TokenType;
  lexeme: string;
}
