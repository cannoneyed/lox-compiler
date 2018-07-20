declare module 'react-inspector' {
  import * as React from 'react';

  type sortFn = (a: string, b: string) => number;

  export interface ObjectInspectorProps {
    expandLevel?: number;
    expandPaths?: string | string[];
    name?: string;
    data: any;
    theme?: string | {};
    showNonenumerable?: boolean;
    sortObjectKeys?: boolean | sortFn;
    nodeRenderer?: (node: any) => any;
  }

  export class ObjectInspector extends React.Component<ObjectInspectorProps, any> {}
}
