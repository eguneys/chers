import * as mm from './matchmakers';

export type SequenceReducer = (_: Triple<OneMatcherNode>) => OneMatcherValue
export type StringReducer = (_: Array<string>) => OneMatcherNode

export function fReduceTurn(tpe: OneMatcherType, nb: number): StringReducer {
  let reducer = mm.oneMatcherNode(tpe);
  return function (_: Array<string>): OneMatcherNode {
    let [turn] = _;
    let dTurn = parseInt(turn);
    let dPly = dTurn * 2 + nb;
    return reducer(dPly + '');
  }
}

export function fReduceSan(_: Array<string>): OneMatcherNode {
  let [role,file,rank,capture,to,promotion,check,mate] = _;

  return mm.oneMatcherNode("san")([role,file,rank,capture,to,promotion,check,mate].join(' '));
}

export function fReduceSecond(_: Triple<OneMatcherNode>): OneMatcherNode {
  return _[1];
}

export function fReduceMPOGlyphs(_: Triple<OneMatcherNode>): OneMatcherNode {
  return mm.oneMatcherNode("glyphs")(_.filter(_ => _ !== mm.noneMatcherNode));
  
}

export const fReduceMove = fSliceTriple("move", 0, 2);

export const fFirstTwo = (tpe: OneMatcherType): SequenceReducer => {
  return fSliceTriple(tpe, 0, 2);
}

export const fAll = (tpe: OneMatcherType): SequenceReducer => {
  return fSliceTriple(tpe, 0, 3);
}

export function fSliceTriple(tpe: OneMatcherType, s: number, e: number): SequenceReducer {
  return function fReduceMove(_: Triple<OneMatcherNode>): OneMatcherNode {
    return mm.oneMatcherNode(tpe)(_.slice(s,e));
  }
}

export const fReduceLineAndFen = fReduceOneAndThree("linefen");
export const fOneAndThree = fReduceOneAndThree;

export function fReduceOneAndThree(tpe: OneMatcherType): SequenceReducer {
  return function (_: Triple<OneMatcherNode>): OneMatcherNode {
    let [line, __, fen] = _;

    return mm.oneMatcherNode(tpe)([line, fen]);
  }
}
