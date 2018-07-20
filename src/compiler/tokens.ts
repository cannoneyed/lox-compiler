export const enum TokenType {
  AND = 'AND',
  DIVIDE = 'DIVIDE',
  ELSE = 'ELSE',
  EQUAL = 'EQUAL',
  EQUAL_EQUAL = 'EQUAL_EQUAL',
  FALSE = 'FALSE',
  GT = 'GT',
  GT_EQUAL = 'GT_EQUAL',
  IDENTIFIER = 'IDENTIFIER',
  IF = 'IF',
  LEFT_BRACE = 'LEFT_BRACE',
  LEFT_PAREN = 'LEFT_PAREN',
  LT = 'LT',
  LT_EQUAL = 'LT_EQUAL',
  MINUS = 'MINUS',
  MULTIPLY = 'MULTIPLY',
  NIL = 'NIL',
  NOT = 'NOT',
  NOT_EQUAL = 'NOT_EQUAL',
  NUMBER = 'NUMBER',
  OR = 'OR',
  PLUS = 'PLUS',
  POWER = 'POWER',
  PRINT = 'PRINT',
  RIGHT_BRACE = 'RIGHT_BRACE',
  RIGHT_PAREN = 'RIGHT_PAREN',
  SEMICOLON = 'SEMICOLON',
  STRING = 'STRING',
  TRUE = 'TRUE',
  WHILE = 'WHILE',
  VAR = 'VAR',
}

export interface Token {
  type: TokenType;
  lexeme: string;
}
