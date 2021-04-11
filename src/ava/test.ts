import test from 'ava';
import * as m from '../matchers';

test('glyphs', t => {

  ['1. e4!',
   '1. e4!N',
   '1. Nf4 Nf4 2. e4',
   '1. e4!N Nf4'].forEach(_ =>
     t.is(m.mMoves(_)?.rest, ''));
               
  
});
