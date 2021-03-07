import chars from './chars';
import * as cs from './chars';

function jss(o: any) {
  console.log(JSON.stringify(o));
}

export default function() {

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

  // jss(chars(textOnly));
  // jss(chars(headlineOnly));
  // jss(chars(recContent));
  // let res = chars(starContent)
  // if (res) {
  //   console.log(view(res.acc));
  // }


  const line = `initial`,
  fen = `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`,
  linefen = line + ' ' + fen,
  codeOnly = `<${linefen}>`;

  // const codeMix: string = [codeOnly, 
  //                          headlineOnly,
  //                          textOnly,
  //                          headlineOnly,
  //                          codeOnly,
  //                          textOnly].join('separator');
  // jss(chars(codeMix));
  // let res = chars(codeMix);
  // if (res) {
  //   console.log(view(res.acc));
  // }

  // const bTurnOnly = `1...`,
  // wTurnOnly = `12.`;

  // jss(chars(bTurnOnly));
  // jss(chars(wTurnOnly));


  // let blunder = `??`;
  // jss(chars(blunder, cs.mMoveGlyphs));


  let regularMove = `e4`,
  glyphMovePosition = `Bxd3?? ∞`,
  glypMove = `Ne7g6+?!`;

  jss(chars(regularMove, cs.mSan));
  jss(chars(glyphMovePosition, cs.mSanWithGlyph));
  

  
}
