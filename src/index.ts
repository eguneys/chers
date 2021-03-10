import chers from './chers';
import * as m from './matchers';
import * as tt from './types';
import * as mt from './model';
import { Node, reducePlus } from './node';
import { reducer } from './nodetomodel';

export * from './chers';
export * from './node';

export * as tt from './types';
export * as mt from './model';

export default function mm(str: string): tt.Maybe<mt.Content> {
  let met = m.mContent(str);

  if (met) {
    let n = chers(met.acc);

    return reducePlus(n, 'rootroot', reducer);
  }
}
