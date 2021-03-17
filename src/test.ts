import * as m from './matchers';
import { oneMatcherNode } from './matchmakers';
import chers from './chers';
import * as cs from './chers';
import * as fs from './fixtures';
import * as tt from './types';

import * as n from './node';
import { reducer } from './nodetomodel';
import * as mt from './model';


function css(o: tt.Maybe<tt.MatcherResult>) {
  if (o) {
    // console.log(chars(o.acc));
  }
}

function jss(o: any) {
  console.log(JSON.stringify(o));
}

function cryif(cond: boolean, msg: string) {
  if (cond) {
    cry(msg);
  }
}

function cry(msg: string): void {
  console.log(`❌ ${msg}`);
}

function objEqual(o: any, b: any): boolean {
  for (let key in o) {
    if (b[key] !== o[key]) {
      return false;
    }
  }
  for (let key in b) {
    if (b[key] !== o[key]) {
      return false;
    }
  }
  return true;
}

function nacc(msg: string, o: tt.Maybe<tt.MatcherResult>, value?: tt.OneMatcherNode): void {
  function cr(ms: any): void {
    cry(msg + ' ' + JSON.stringify(ms));
  }
  if (!o) {
    cr(`!${o}`);
  } else if (o.rest !== '') {
    cr('rest' + o.rest);
  } else if (!!value && !objEqual(o.acc, value)) {
    cr(o.acc);
  }
}

const mtText = oneMatcherNode("text");
const mtHeadline = oneMatcherNode("headline");

function parseTest() {

  // const text = `lkja sdf@#$ ^234 890..la\< ns>k\ndfl.`;
  // console.log(chars(text));

  const headlineOnly: string = `# aheadline\n`;
  const textOnly: string = `atext`;

  const starContent: string = [headlineOnly,
                               textOnly,
                               textOnly,
                               headlineOnly,
                               textOnly,
                               headlineOnly].join('separator');

  //nacc(textOnly, m.mText(textOnly), mtText(textOnly));
  //nacc(headlineOnly, m.mHeadline(headlineOnly), mtHeadline(' aheadline'));
  // jss(m.mText(textOnly));
  // jss(m.mHeadline(headlineOnly)); 
 // jss(m.mTextOrHeadline(starContent));
  //jss(m.mContent(starContent));
  // css(m.mContent(starContent));

  const line = `initial`,
  fen = `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`,
  linefen = line + ' ' + fen,
  codeOnly = `<${linefen}>`;

  const codeText: string = [codeOnly, 
                            textOnly,
                            codeOnly,
                            textOnly].join('separator');

  const codeMix: string = [headlineOnly,
                           codeText,
                           headlineOnly,
                           codeText].join('separator');

  //jss(m.mCode(codeOnly));
  //jss(m.mCode(codeMix));
  // jss(m.mParagraph(codeText));
  //jss(m.mContent(codeMix));

  const bTurnOnly = `1...`,
  wTurnOnly = `12.`;

  // jss(m.mTurn(bTurnOnly));
  // jss(m.mTurn(wTurnOnly));


  let blunder = `??`,
  brilliantUnclear = `!! ∞`;
  // jss(m.mMoveGlyph(blunder));
  // jss(m.mMPOGlyphs(brilliantUnclear));


  let regularMove = `e4`,
  glyphMovePosition = `Bxd3?? ∞`,
  glypMove = `Ne7g6+?!`;

  //jss(m.mSan(regularMove));
  //jss(m.mSan(spacedMove));
  //jss(m.mMove(glyphMovePosition));
  

  const oneMove = `1. e4`,
  continueMove = `2... e4`,
  twoMove = `1. e4 e5`;

  // jss(m.mOneMove(oneMove));
  // jss(m.mContinueMove(continueMove));
  // jss(m.mTwoMove(twoMove));
  
  const continueTwoMove = `2... e4 3. Nf3`,
  threeMove = `1. e4 e5 2. Nf3`,
  fourMove = `1. e4 e5 2. Nf3 Nf6`,
  manyMoves = `1. e4 e5 2. Nf3 Nf6 3. c3 c5 4. Nf3`;

  const badMove = `1. e4 e5 e6`,
  badMove2 = `2... e4 e5`;

  let validMoves = [oneMove,
                    continueMove,
                    continueTwoMove,
                    threeMove,
                    fourMove,
                    manyMoves];

  // validMoves.forEach(_ => nacc(_, m.mMoves(_)));

  // jss(m.mMoves(oneMove));
  // jss(m.mMoves(continueMove));
  // jss(m.mMoves(continueTwoMove));
  // jss(m.mMoves(threeMove));
  // jss(m.mMoves(fourMove));
  // jss(m.mMoves(badMove));
  // jss(m.mMoves(badMove2));

  let codeLineMoves = `<${line} ${manyMoves}>`;

  // jss(m.mCode(codeLineMoves));

  let codeLineLineMoves = `<${line} ${line} ${manyMoves}>`;

  // jss(m.mLineAndMoves(`${line} ${line} ${manyMoves}`));
  //jss(m.mCode(codeLineLineMoves));


  let showBoard = `=${line} 19`
  // jss(m.mBoard(showBoard));


  // jss(m.mContent(fs.debug));
  //nacc("content", m.mContent(fs.content));

  fs.kingsgambit.forEach((_, i) => {
    // nacc("kg" + i, m.mContent(_))
  });

}

function chersTest() {
  
  let res = m.mContent(fs.debug);

  if (res) {
    //jss(res);
    let node = chers(res.acc);
    //jss(node);
    if (node) {
      let c = n.reducePlus(node,
                           'rootroot',
                           reducer);
      jss(c.content
        .flatMap((_: any) => {
          if (mt.isParagraph(_)) {
            return _.paragraph;
          }
          return [];
        }))
    }
    // console.log(
    //   n.filter(node,
    //            cs.fMatchNode(cs.fOfType("glyphs"))));

  }

}

function boardTest() {

  const embed: string = `=line 10`;

  console.log(m.mBoard(embed));
  
}

export default function() {
  boardTest();
  //chersTest();
  //parseTest();
}
