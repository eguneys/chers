
// // ^(N|B|R|Q|K|)([a-h]?)([1-8]?)(x?)([a-h][0-9])(=?[NBRQ]?)(\+?)(\#?)$
// export const mSan = mrplus(/^(N|B|R|Q|K|)([a-h]?)([1-8]?)(x?)([a-h][0-9])(=?[NBRQ]?)(\+?)(\#?)(.*)$/s, 8, sanReducer);

// export const mMoveGlyphs = mOpt(mr(/^(\?\?)(.*)/s));
// export const mPositionalGlyphs = mOpt(mr(/^(\?\?)(.*)/s));
// export const mObserveGlyphs = mOpt(mr(/^(\?\?)(.*)/s));

// export const mSanWithGlyph = mseq([mSan, 
//                                    mOpt(mMoveGlyphs),
//                                    mOpt(msecond([mSpace,
//                                                  mPositionalGlyphs])),
//                                    mOpt(msecond([mSpace,
//                                                  mObserveGlyphs]))], 
//                                   sanWithGlyphReducer);

// export const twoPlyMove = mseq([mTurn,
//                                 mSan,
//                                 mSan], twoPlyMoveReducer);

// export const onePlyMove = mseq([mTurn,
//                                 mSan], onePlyMoveReducer);

export default function chars(node: OneMatcherValue): string {
  let res = charsMany(node);
  if (typeof res === 'string') {
    return res;
  } else {
    return res.join('\n');
  }
}

function charsMany(node: OneMatcherValue): Many<string> {
  if (typeof node === 'string') {
    return node;
  } else {
    if (Array.isArray(node)) {
      return node.map(viewHelper);
    } else {
      return viewHelper(node);
    }
  }
}

function viewHelper(node: OneMatcherNode): string {
  switch (node.tpe) {
    case "headline":
      return (node.value as string).toUpperCase();
      break;
    case "text":
      return node.value as string;
      break;
    default: 
      return `[Unknown type: ${node.tpe}]`;
      break;
  }
}
