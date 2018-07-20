import * as React from 'react';

import { ObjectInspector } from 'react-inspector';
import * as CodeMirror from 'react-codemirror';

import { compile, SyntaxTree, Token, TokenType } from './compiler';

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
    pendingCode: 'var x = 1;',
    compiledCode: 'var x = 1;',
    ast: null,
    tokens: [],
  };

  updateCode = (pendingCode: string) => {
    this.setState({ pendingCode });
  };

  renderToken(token: Token, index: number) {
    const lexemeTokens = [TokenType.IDENTIFIER, TokenType.NUMBER];
    const displayLexeme = lexemeTokens.indexOf(token.type) >= 0;

    return (
      <div className="token" key={`${token.type}-${index}`}>
        <span className="token-type">{token.type}</span>
        {displayLexeme && <span className="token-lexeme">{token.lexeme}</span>}
      </div>
    );
  }

  compile() {
    const code = this.state.pendingCode;
    const { ast, tokens } = compile(code);
    this.setState({ compiledCode: code, ast, tokens });
  }

  public render() {
    const { compiledCode, pendingCode, tokens, ast } = this.state;
    const compileDisabled = compiledCode === pendingCode && ast !== null;
    const options = { lineNumbers: true };
    return (
      <div className="app">
        <div className="top">
          <CodeMirror value={pendingCode} onChange={this.updateCode} options={options} />
          <button disabled={compileDisabled} onClick={() => this.compile()}>
            compile
          </button>
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
