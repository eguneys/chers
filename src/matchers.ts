import * as mm from './matchmakers';
import * as rr from './reducers';

export const mNumber = 
  mm.mr(/^([1-9]\d*)(.*)/s, "number");

export const mText = 
  mm.mr(/^([^<>#\n]*)(.*)/s, "text");

export const mHeadline =
  mm.mseq3([mm.mr(/^(#)(.*)/s, "text"),
            mm.mr(/^([^<>#\n]*)(.*)/s, "headline"),
            mm.mr(/^(\n)(.*)/s, "text")], mm.fSecond);

export const mTextOrHeadline = 
  mm.meither([mText, mHeadline])

export const mTextOrHeadlineStar =
  mm.mstar(mTextOrHeadline);

export const mSpace = mm.mr(/^(\s)(.*)/s, "space");
export const mNewline = mm.mr(/^(\n)(.*)/s, "newline");
export const mEqual = mm.mr(/^(=)(.*)/s, "equal");

export const mLine =
  mm.mr(/(^[a-zA-Z][a-zA-Z0-9\.\-]*)(.*)$/s, "line");

export const mBoard = mm.mseq3([
  mEqual,
  mm.msecond([mm.mpass, mLine, mSpace]),
  mNumber
], rr.fAll("board"));

export const mFen =
  mm.mr(/^([^>]*\/[^>]*)(.*)/s, "fen");

export const mZeroTurn = mm.mrplus(/^([1-9]\d*)\.([^\.].*)/s, 
                                   1, rr.fReduceTurn("zeroturn", 0));

export const mOneTurn = mm.mrplus(/^([1-9]\d*)\.\.\.(.*)/s, 
                                  1, rr.fReduceTurn("oneturn", 1));


export const mMoveGlyph = mm.mmap(['??', '!!'],
                                  'mglyph');

export const mPosGlyph = mm.mmap(['∞'], 
                                 'pglyph');

export const mObsGlyph = mm.mmap(['o'], 
                                 'oglyph');

export const mMPOGlyphs = mm.mseq3([
  mm.mOpt(mMoveGlyph),
  
  mm.mOpt(mm.msecond([mSpace, mPosGlyph, mm.mpass])),
  mm.mOpt(mm.msecond([mSpace, mObsGlyph, mm.mpass])),
], rr.fReduceMPOGlyphs);

export const mSan = mm.mrplus(/^(N|B|R|Q|K|)([a-h]?)([1-8]?)(x?)([a-h][0-9])(=?[NBRQ]?)(\+?)(\#?)(.*)$/s, 
                              8, rr.fReduceSan);

export const mShortCastles = mm.mmap(['o-o', 'O-O', '0-0'], 'shortcastles');
export const mLongCastles = mm.mmap(['o-o-o', 'O-O-O', '0-0-0'], 'longcastles');

export const mSanWithCastles = mm.meither([
  mLongCastles,
  mShortCastles,
  mSan
]);

export const mMove = mm.mseq3([
  mSanWithCastles,
  mMPOGlyphs,
  mm.mpass
], rr.fReduceMove);


export const mOneMove = mm.mseq3([
  mZeroTurn,
  mm.mOpt(mSpace),
  mMove,
], rr.fOneAndThree("onemove"));

export const mContinueMove = mm.mseq3([
  mOneTurn,
  mm.mOpt(mSpace),
  mMove  
], rr.fOneAndThree("cmove"));

export const mTwoMove = mm.mseq3([
  mOneMove,
  mSpace,
  mMove,
], rr.fOneAndThree("twomove"));

export const mMoves = mm.mseq3([
  mm.mOpt(mm.msecond([mm.mpass, mContinueMove, mm.mOpt(mSpace)])),
  mm.mOpt(mm.mstar(mm.msecond([mm.mpass, mTwoMove, mm.mOpt(mSpace)]))),
  mm.mOpt(mOneMove)
], rr.fAll("moves"));

export const mLineAndFen = mm.mseq3([
  mLine,
  mSpace,
  mFen
], rr.fReduceLineAndFen);

export const mLineAndMoves = mm.mseq3([
  mLine,
  mSpace,
  mMoves
], rr.fOneAndThree("linemoves"));

export const mLineLineMoves = mm.mseq3([
  mm.msecond([mm.mpass, mLine, mSpace]),
  mm.msecond([mm.mpass, mLine, mSpace]),
  mMoves
], rr.fOneAndThree("linelinemoves"));

export const mCode =
  mm.mseq3([mm.mr(/^(<)(.*)$/s, "cbegin"),
            mm.meither([mLineAndFen,
                        mLineLineMoves,
                        mLineAndMoves]),
            mm.mr(/^(>)(.*)$/s, "cend")], mm.fSecond);

export const mA__ = mm.meither([mLineAndFen,
                                mLineLineMoves,
                                mLineAndMoves]);

export const mTextOrCode =
  mm.meither([mText, mCode]);

export const mParagraph =
  mm.mstar(mTextOrCode);

export const mContent =
  mm.mstar(
    mm.meither([mNewline, mHeadline, mParagraph])
  )
