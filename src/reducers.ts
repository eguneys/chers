import * as mm from './matchmakers';
import * as tt from './types';

export type SequenceReducer = (_: tt.Triple<tt.OneMatcherValue>) => tt.OneMatcherValue
export type StringReducer = (_: Array<string>) => tt.OneMatcherNode

export function fReduceTurn(tpe: tt.OneMatcherType, nb: number): StringReducer {
  let reducer = mm.oneMatcherNode(tpe);
  return function (_: Array<string>): tt.OneMatcherNode {
    let [turn] = _;
    let dTurn = parseInt(turn);
    let dPly = dTurn * 2 + nb;
    return reducer(dPly + '');
  }
}

export function fReduceSan(_: Array<string>): tt.OneMatcherNode {
  let [role,file,rank,capture,to,promotion,check,mate] = _;

  return mm.oneMatcherNode("san")([role,file,rank,capture,to,promotion,check,mate].join(' '));
}

export function fReduceMPOGlyphs(_: tt.Triple<tt.OneMatcherValue>): tt.OneMatcherValue {
  return mm.oneMatcherNode("glyphs")(_.filter(_ => _ !== mm.noneMatcherNode) as Array<tt.OneMatcherNode>);
  
}

export function fReduceMoves(_: tt.Triple<tt.OneMatcherValue>): tt.OneMatcherValue {
  let [s, ms, e] = _;

  let res: Array<tt.OneMatcherNode> = [];

  if (ms !== mm.noneMatcherNode) {
    res = res.concat(ms as Array<tt.OneMatcherNode>);    
  }
  if (s !== mm.noneMatcherNode) {
    res.push(s as tt.OneMatcherNode);
  }
  if (e !== mm.noneMatcherNode) {
    res.push(e as tt.OneMatcherNode);
  }

  return mm.oneMatcherNode("moves")(res);  

}

export const fReduceMove = fSliceTriple("move", 0, 2);

export const fFirstTwo = (tpe: tt.OneMatcherType): SequenceReducer => {
  return fSliceTriple(tpe, 0, 2);
}

export const fAll = (tpe: tt.OneMatcherType): SequenceReducer => {
  return fSliceTriple(tpe, 0, 3);
}

export function fSliceTriple(tpe: tt.OneMatcherType, s: number, e: number): SequenceReducer {
  return function fReduceMove(_: tt.Triple<tt.OneMatcherValue>): tt.OneMatcherValue {
    return mm.oneMatcherNode(tpe)(_.slice(s,e) as tt.Triple<tt.OneMatcherNode>);
  }
}

export const fReduceLineAndFen = fReduceOneAndThree("linefen");
export const fOneAndThree = fReduceOneAndThree;

export function fReduceOneAndThree(tpe: tt.OneMatcherType): SequenceReducer {
  return function (_: tt.Triple<tt.OneMatcherValue>): tt.OneMatcherValue {
    let [line, __, fen] = _ as tt.Triple<tt.OneMatcherNode>;

    return mm.oneMatcherNode(tpe)([line, fen]);
  }
}

export function fSecond(tpe: tt.OneMatcherType): SequenceReducer {
  return function (_: tt.Triple<tt.OneMatcherValue>): tt.OneMatcherValue {
    let [__, second, ___] = _ as tt.Triple<tt.OneMatcherNode>;

    return mm.oneMatcherNode(tpe)(second);
  }
}

