import * as tt from './types';

export type ZeroTurn = {
  zeroturn: string
}

export type OneTurn = {
  oneturn: string
}

export type MoveGlyph =
  | '??'
  | '!!'

export type PosGlyph =
  | '∞'

export type ObsGlyph = 
| 'o'

export type MPOGlyphs = {
  moveGlyph?: MoveGlyph,
  posGlyph?: PosGlyph,
  obsGlyph?: ObsGlyph
}

export type San = {
  san: string
}

export type ShortCastles = "o-o"

export type LongCastles = "o-o-o"

export type SanWithCastles = 
  | LongCastles
  | ShortCastles
  | San

export type Move = {
  move: [SanWithCastles, MPOGlyphs]
}

export type ContinueMove = {
  cmove: [OneTurn, Move]
}

export type OneMove = {
  omove: [ZeroTurn, Move]
}

export type TwoMove = {
  tmove: [OneMove, Move]
}

export type Moves = {
  continueMove?: ContinueMove,
  twoMoves?: Array<TwoMove>,
  oneMove?: OneMove
}

export type LineAndMoves = {
  lineAndMoves: [Line, Moves]
}

export type LineLineMoves = {
  linelineMoves: [Line, Line, Moves]
}

export type Line = {
  line: string
}

export type Fen = {
  fen: string
}

export type LineAndFen = {
  lineAndFen: [Line, Fen]
}

export type Code =
  | LineAndFen
  | LineLineMoves
  | LineAndMoves

export type Text2 = {
  text: string
}

export type TextOrCode = 
  | Text2
  | Code

export type Paragraph = {
  paragraph: Array<TextOrCode>
}

export type HLine = {
  hline: string
}

export type NewLine = {
  newline: string
}

export type NewLineHeadLineOrParagraph =
  | NewLine
  | HLine
  | Paragraph

export type Content = {
  content: Array<NewLineHeadLineOrParagraph>
}

export type ModelRef = any

type LeafType = 
  | ZeroTurn
  | OneTurn
  | MoveGlyph
  | PosGlyph
  | ObsGlyph
  | San
  | ShortCastles
  | LongCastles
  | Line
  | Fen
  | Text2
  | HLine
  | NewLine


type BranchType = 
  | MPOGlyphs
  | Move
  | ContinueMove
  | OneMove
  | TwoMove
  | Moves
  | LineAndMoves
  | LineLineMoves
  | LineAndFen
  | Paragraph
  | Content

type LeafRef = (_: string) => LeafType
type BranchRef = (_: Array<ModelRef>) => BranchType

type LeafMatcherMap = {
  [k in tt.LeafMatcherType]: LeafRef
}

type BranchMatcherMap = {
  [k in tt.BranchMatcherType]: BranchRef
}


export let branchRefs: BranchMatcherMap = {
  "code": wrapSingleBranch,
  "paragraph": wrapBranch('paragraph'),
  "linefen": wrapBranch('lineAndFen'),
  "linemoves": wrapBranch('lineAndMoves'),
  "linelinemoves": wrapBranch('linelineMoves'),
  "glyphs": makeGlyphs,
  "move": wrapBranch('move'),
  "onemove": wrapBranch('omove'),
  "twomove": wrapBranch('tmove'),
  "cmove": wrapBranch('cmove'),
  "moves": makeMoves,
  "content": wrapBranch('content')
};

export let leafRefs: LeafMatcherMap = {
  "none": makeId,
  "equal": makeId,
  "number": makeId,
  "cbegin": makeId,
  "cend": makeId,
  "text": wrapLeaf('text'),
  "space": makeId,
  "newline": wrapLeaf('newline'),
  "headline": wrapLeaf('hline'),
  "line": wrapLeaf('line'),
  "fen": wrapLeaf('fen'),
  "ply": makeId,
  "mglyph": makeId,
  "pglyph": makeId,
  "oglyph": makeId,
  "san": wrapLeaf('san'),
  "board": wrapLeaf('board'),
  "zeroturn": wrapLeaf('zeroturn'),
  "oneturn": wrapLeaf('oneturn'),
  "shortcastles": makeId,
  "longcastles": makeId,
}

function wrapLeaf(prop: string): LeafRef {
  return (_: string): LeafType => {
    return {
      [prop]: _
    } as LeafType;
  };
}

function makeId(_: string): LeafType {
  return _ as LeafType;
}

function makeGlyphs(_: Array<ModelRef>): MPOGlyphs {
  if (_.length === 0) {
    return {};
  } else if (_.length === 1) {
    return {};
  } else {
    return {};
  }
}

function makeMoves(_: Array<ModelRef>): Moves {
  let omoves = _.filter(isOneMove),
  cmoves = _.filter(isCMove),
  twoMoves = _.filter(isTwoMove);

  let continueMove = cmoves[0],
  oneMove = omoves[0];

  return {
    continueMove,
    twoMoves,
    oneMove
  }
}

function wrapSingleBranch(_: Array<ModelRef>): BranchType {
  return _[0];
}

function wrapBranch(prop: string): BranchRef {
  return (_: Array<ModelRef>): BranchType => {
    return {
      [prop]: _ as BranchType
    };
  }
}

export const isNewline = makeNarrower<any, NewLine>('newline');
export const isHLine = makeNarrower<any, HLine>('hline');
export const isParagraph = makeNarrower<any, Paragraph>('paragraph');
export const isText = makeNarrower<any, Text2>('text');
export const isLineAndFen = makeNarrower<any, LineAndFen>('lineAndFen');
export const isFen = makeNarrower<any, Fen>('fen');
export const isLine = makeNarrower<any, Line>('line');
export const isLineLineMoves = makeNarrower<any, LineLineMoves>('linelineMoves');
export const isLineAndMoves = makeNarrower<any, LineAndMoves>('lineAndMoves');
export const isCMove = makeNarrower<any, ContinueMove>('cmove');
export const isTwoMove = makeNarrower<any, TwoMove>('tmove');
export const isOneMove = makeNarrower<any, OneMove>('omove');

export const isMove = makeNarrower<any, Move>('move');
export const isSan = makeNarrower<any, San>('san');
export const isOneTurn = makeNarrower<any, OneTurn>('oneturn');
export const isZeroTurn = makeNarrower<any, ZeroTurn>('zeroturn');


export function makeNarrower<A, B extends A>(property: string) {
  return (_: A): _ is B => {
    return (property in _)
  };
}
