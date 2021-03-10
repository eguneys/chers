import { FFilter, Node, node, addChild, reduce, filter } from './node';
import * as tt from './types';

export function addOneMatcherToNode(root: Node<tt.OneMatcherValue>, 
                             mv: tt.OneMatcherValue): Node<tt.OneMatcherValue> {
  let nn = node(mv);
  if (Array.isArray(mv)) {
    mv.map(_ => addOneMatcherToNode(nn, _));
  } else if (typeof mv === 'string') {
  } else {
    addOneMatcherToNode(nn, mv.value);
  }
  addChild(root, nn);

  return root;
}

export function maybeOneMatcherNode(_: tt.OneMatcherValue): tt.Maybe<tt.OneMatcherNode> {
  if (typeof _ === 'string') {
  } else if (Array.isArray(_)) {
  } else {
    return _;
  }
}

export function fMatchNode(f: FFilter<tt.OneMatcherNode>): FFilter<tt.OneMatcherValue> {
  return (_: tt.OneMatcherValue): boolean => {
    let n = maybeOneMatcherNode(_);

    if (n) {
      return f(n);
    } else {
      return false;
    }
  };
}

export function fOfType(tpe: tt.OneMatcherType): FFilter<tt.OneMatcherNode> {
  return function(_: tt.OneMatcherNode): boolean {
    return _.tpe === tpe;
  }
}

export default function chers(mv: tt.OneMatcherValue) {
  return addOneMatcherToNode(node('root'), mv);
}
