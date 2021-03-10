import chers from './chers';
import * as m from './matchers';
import * as tt from './types';
import { Node } from './node';

export * from './chers';
export * from './node';

export * as ct from './types';

export default function mm(str: string): tt.Maybe<Node<tt.OneMatcherValue>> {
  let met = m.mContent(str);

  if (met) {
    return chers(met.acc);
  }
}
