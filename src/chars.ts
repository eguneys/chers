type Maybe<T> = T | undefined

type OptionMatcher<M> = {
  tpe: "none"
} | M

type NoneMatcherNode = {
  tpe: "none"
}

type PlyMatcherNode = {
  tpe: "ply",
  ply: number
}

type SanMatcherNode = {
  tpe: "san",
  san: string
}

type ObserveGlyphsMatcherNode = {
  tpe: "oglyphs",
  value: string
}

type PositionalGlyphsMatcherNode = {
  tpe: "pglyphs",
  value: string
}

type MoveGlyphsMatcherNode = {
  tpe: "mglyphs",
  value: string
}

type MatcherNode = | {
  tpe: "text",
  value: string
} | {
  tpe: "fen",
  value: string
} | {
  tpe: "line",
  value: string
} | {
  tpe: "headline",
  value: MatcherNode
} | {
  tpe: "content",
  value: Array<MatcherNode>
} | {
  tpe: "code",
  value: MatcherNode
} | {
  tpe: "fenline",
  fen: MatcherNode,
  line: MatcherNode
} | {
  tpe: "move",
  ply: PlyMatcherNode,
  san: SanMatcherNode
} | {
  tpe: "double",
  first: MatcherNode,
  second: MatcherNode
} | PlyMatcherNode
  | SanMatcherNode
  | ObserveGlyphsMatcherNode
  | PositionalGlyphsMatcherNode
  | MoveGlyphsMatcherNode
  | NoneMatcherNode

type MatcherData = RegExp

interface MatcherResult {
  rest: string,
  acc: MatcherNode
}

type MatcherReduceOne = (m: string) => MatcherNode
type MatcherReduceS = (ms: Array<string>) => MatcherNode
type MatcherReduce = (ms: Array<MatcherNode>) => MatcherNode
type Matcher = (rest: string) => Maybe<MatcherResult>

let noneMatcherNode: NoneMatcherNode = {
  tpe: "none"
}

function mOpt(data: Matcher, defaultAcc: MatcherNode = noneMatcherNode): Matcher {
  return function(rest: string): Maybe<MatcherResult> {

    let _matcher = data;

    let _res = _matcher(rest);

    if (_res) {
      return _res;
    } else {
      return {
        rest,
        acc: defaultAcc
      };
    }
  }
}

function mor(data: Array<Matcher>): Matcher {
  return function(rest: string): Maybe<MatcherResult> {

    for (let _matcher of data) {
      let _res = _matcher(rest);

      if (_res) {
        return _res;
      }
    }
  };
}

function mstar(data: Matcher, reduce: MatcherReduce): Matcher {
  return function(rest: string): Maybe<MatcherResult> {
    let accs: Array<MatcherNode> = [];
    let _matcher = data;

    while (true) {
      let _res = _matcher(rest);

      if (!_res) {
        return undefined;
      }

      let { acc: _acc, rest: _rest } = _res;

      rest = _rest;
      accs.push(_acc);

      if (rest.length === 0) {
        break;
      }
    }

    return {
      rest,
      acc: reduce(accs)
    };
  }
};

function msecond(data: Array<Matcher>): Matcher {
  function secondReducer(nodes: Array<MatcherNode>): MatcherNode {
    return nodes[1];
  }

  return mseq(data, secondReducer);
}

function mseq(data: Array<Matcher>, reduce: MatcherReduce): Matcher {
  return function(rest: string): Maybe<MatcherResult> {

    let accs: Array<MatcherNode> = [];

    for (let _matcher of data) {
      let _res = _matcher(rest);
      if (!_res) {
        return undefined;
      }

      let { acc: _acc, rest: _rest } = _res;

      rest = _rest;

      accs.push(_acc);
    }

    return {
      rest,
      acc: reduce(accs)
    };
  }
}

function mrplus(data: RegExp, nbCapture: number, reduce: MatcherReduceS): Matcher {
  return function(rest: string): Maybe<MatcherResult> {
    let m = rest.match(data);

    if (m) {
      let [_, ..._rest] = m;

      let cgroups = _rest.slice(0, nbCapture),
      __rest = _rest[nbCapture];

      if (rest !== __rest) {

        return {
          rest: __rest,
          acc: reduce(cgroups)
        };
      }
    }
  };
};

function mr(data: RegExp, reducer: MatcherReduceOne = textReducer): Matcher {
  return function(rest: string): Maybe<MatcherResult> {
    let m = rest.match(data);

    if (m) {
      let [_, _acc, _rest] = m;

      if (rest !== _rest) {
        return {
          rest: _rest,
          acc: reducer(_acc)
        };
      }
    }
  };
};

function makeAReducer(tpe: string): (value: string) => MatcherNode {
  return function(value: string): MatcherNode {
    return {
      tpe,
      value
    };
  };
}

function textReducer(text: string): MatcherNode {
  return {
    tpe: "text",
    value: text
  };
}

function lineReducer(line: string): MatcherNode {
  return {
    tpe: "line",
    value: line
  };
}

function fenReducer(fen: string): MatcherNode {
  return {
    tpe: "fen",
    value: fen
  };
}

function headLineReducer(nodes: Array<MatcherNode>): MatcherNode {
  return {
    tpe: 'headline',
    value: nodes[1]
  };
}

function contentReducer(nodes: Array<MatcherNode>): MatcherNode {
  return {
    tpe: 'content',
    value: nodes
  }
}

function codeReducer(nodes: Array<MatcherNode>): MatcherNode {
  return {
    tpe: 'code',
    value: nodes[1]
  }
}

function fenLineReducer(nodes: Array<MatcherNode>): MatcherNode {
  return {
    tpe: 'fenline',
    line: nodes[0],
    fen: nodes[2]
  };
}

function plyReducer(groups: Array<string>): MatcherNode {
  let [turn, isBlack] = groups;

  // todo turn to play

  return {
    tpe: 'ply',
    ply: parseInt(turn)
  }
}

function onePlyMoveReducer(nodes: Array<MatcherNode>): MatcherNode {
  let [ply0, san0] = nodes as [PlyMatcherNode, SanMatcherNode];

  return {
    tpe: 'move',
    ply: ply0,
    san: san0
  }
}

function twoPlyMoveReducer(nodes: Array<MatcherNode>): MatcherNode {
  let [ply0, san0, san1] = nodes as [PlyMatcherNode, SanMatcherNode, SanMatcherNode];

  let ply1: PlyMatcherNode = {
    tpe: "ply",
    ply: ply0.ply + 1
  };

  return {
    tpe: 'double',
    first: {
      tpe: 'move',
      ply: ply0,
      san: san0
    },
    second: {
      tpe: 'move',
      ply: ply1,
      san: san1
    }
  };
}

function sanReducer(nodes: Array<string>): MatcherNode {
  return {
    tpe: "san",
    san: "alksfj"
  }
}

function sanWithGlyphReducer(nodes: Array<MatcherNode>): MatcherNode {

  let [san, moveG, posG, obsG] = nodes as [SanMatcherNode, 
                                           OptionMatcher<MoveGlyphsMatcherNode>,
                                           OptionMatcher<PositionalGlyphsMatcherNode>,
                                           OptionMatcher<ObserveGlyphsMatcherNode>];

  return moveG;
}

export const mText = 
  mr(/^([^<>#\n]*)(.*)/s);
export const mHeadline = 
  mseq([mr(/^(#)(.*)/s),
        mText,
        mr(/^(\n)(.*)/s)], headLineReducer);

export const mFen = mr(/^([^>]*\/[^>]*)(.*)/s, fenReducer);
export const mLine = mr(/^([a-z|A-Z|\d|\.]*)(.*)/s, lineReducer);
export const mSpace = mr(/^(\s)(.*)/s);

export const mTurn = mrplus(/^(\d*)\.(\.\.)?(.*)/s, 2, plyReducer);

// ^(N|B|R|Q|K|)([a-h]?)([1-8]?)(x?)([a-h][0-9])(=?[NBRQ]?)(\+?)(\#?)$
export const mSan = mrplus(/^(N|B|R|Q|K|)([a-h]?)([1-8]?)(x?)([a-h][0-9])(=?[NBRQ]?)(\+?)(\#?)(.*)$/s, 8, sanReducer);

export const mMoveGlyphs = mOpt(mr(/^(\?\?)(.*)/s));
export const mPositionalGlyphs = mOpt(mr(/^(\?\?)(.*)/s));
export const mObserveGlyphs = mOpt(mr(/^(\?\?)(.*)/s));

export const mSanWithGlyph = mseq([mSan, 
                                   mOpt(mMoveGlyphs),
                                   mOpt(msecond([mSpace,
                                                 mPositionalGlyphs])),
                                   mOpt(msecond([mSpace,
                                                 mObserveGlyphs]))], 
                                  sanWithGlyphReducer);

export const twoPlyMove = mseq([mTurn,
                                mSan,
                                mSan], twoPlyMoveReducer);

export const onePlyMove = mseq([mTurn,
                                mSan], onePlyMoveReducer);

export const mLineFen = mseq([
  mLine,
  mSpace,
  mFen
], fenLineReducer);


export const mCode = mseq([
  mr(/^(<)(.*)/s),
  mor([
    mLineFen
  ]),
  mr(/^(>)(.*)/s)
], codeReducer);

export const mParagraph = mor([mText,
                        mCode]);

export const mTextOrHeadline = mor([mParagraph, 
                             mHeadline]);

export const mContent = mstar(mTextOrHeadline, contentReducer);

export function view(node: MatcherNode): string {
  switch (node.tpe) {
    case "content":
      return node.value.map(view).join('\n');
      break;
    case "headline":
      return view(node.value).toUpperCase();
      break;
    case "text":
      return node.value;
      break;
    default: 
      return `[Unknown type: ${node.tpe}]`;
      break;
  }
}

export default function chars(content: string, matcher: Matcher): Maybe<MatcherResult> {
  return matcher(content);
}
