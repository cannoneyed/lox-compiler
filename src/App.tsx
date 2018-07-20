import * as React from 'react';

import { ObjectInspector } from 'react-inspector';
import * as CodeMirror from 'react-codemirror';

import { compile, lex, parse, SyntaxTree, Token, TokenType } from './compiler';

import 'codemirror/lib/codemirror.css';
import './App.css';

export interface Props {}
export interface State {
  pendingCode: string;
  compiledCode: string;
  ast: SyntaxTree | null;
  tokens: Token[];
}

class App extends React.Component<Props, State> {
  state = {
    pendingCode: localStorage.getItem('pendingCode') || '',
    compiledCode: localStorage.getItem('pendingCode') || '',
    ast: null,
    tokens: [],
  };

  updateCode = (pendingCode: string) => {
    localStorage.setItem('pendingCode', pendingCode);
    this.setState({ pendingCode });
  };

  renderToken(token: Token, index: number) {
    const lexemeTokens = [TokenType.IDENTIFIER, TokenType.NUMBER, TokenType.STRING];
    const displayLexeme = lexemeTokens.indexOf(token.type) >= 0;

    return (
      <div className="token" key={`${token.type}-${index}`}>
        <span className="token-type">{token.type}</span>
        {displayLexeme && <span className="token-lexeme">{token.lexeme}</span>}
      </div>
    );
  }

  lex() {
    const code = this.state.pendingCode;
    const { tokens } = lex(code);
    this.setState({ compiledCode: code, tokens });
  }

  parse() {
    const code = this.state.pendingCode;
    const { ast, tokens } = parse(code);
    this.setState({ compiledCode: code, ast, tokens });
  }

  compile() {
    const code = this.state.pendingCode;
    const { ast, tokens } = compile(code);
    this.setState({ compiledCode: code, ast, tokens });
  }

  public render() {
    const { pendingCode, tokens, ast } = this.state;

    const options = { lineNumbers: true };
    return (
      <div className="app">
        <div className="top">
          <CodeMirror value={pendingCode} onChange={this.updateCode} options={options} />
          <div className="controls">
            <button onClick={() => this.lex()}>lex</button>
            <button onClick={() => this.parse()}>parse</button>
            <button onClick={() => this.compile()}>compile</button>
          </div>
        </div>
        <div className="bottom">
          <div className="tokens">
            <h4>tokens</h4>
            {tokens.map((token, index) => {
              return this.renderToken(token, index);
            })}
          </div>
          <div className="ast">
            <h4>ast</h4>
            <ObjectInspector data={ast} expandLevel={99} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
