import * as rr from './reducers';

export function fId<A>(_: A): A {
  return _;
}

export function fSecond<B>(_: Array<B>): B {
  return _[1];
}

export function oneMatcherNode(tpe: OneMatcherType):
(value: OneMatcherValue) => OneMatcherNode {
  return function(value: OneMatcherValue) {
    return {
      tpe,
      value
    }
  }
}

export const noneMatcherNode = oneMatcherNode("none")("");

export const mpass = function(rest: string): Maybe<MatcherResult> {
  return {
    rest,
    acc: noneMatcherNode
  };
}

export function mOpt(data: Matcher): Matcher {
  return function(rest: string): Maybe<MatcherResult> {
    let _matcher = data;

    let _res = _matcher(rest);

    if (_res) {
      return _res;
    } else {
      return {
        rest,
        acc: noneMatcherNode
      };
    }
  }
  
}

export function mstar(data: Matcher): Matcher {
  return function(rest: string): Maybe<MatcherResult> {

    let accs: Array<OneMatcherValue> = [];
    let _matcher = data;

    while (true) {
      let _res = _matcher(rest);

      if (!_res) {
        break;
      }

      let { acc: _acc, rest: _rest } = _res;

      rest = _rest;
      accs.push(_acc);

      if (rest.length === 0) {
        break;
      }
    }

    let acc: Array<OneMatcherNode> = [];

    accs.forEach(_ => {
      if (typeof _ !== 'string') {
        acc = acc.concat(_);
      }
    });

    if (accs.length === 0) {
      return undefined;
    } else {
      return {
        rest,
        acc
      };
    }

  }
}

export function meither(data: Array<Matcher>): Matcher {
  return function(rest: string): Maybe<MatcherResult> {
    for (let _matcher of data) {
      let _res = _matcher(rest);

      if (_res) {
        return _res;
      }
    }
  }
}


export function msecond(data: Triple<Matcher>): Matcher {
  return mseq3(data, rr.fReduceSecond);
}

export function mseq3Separator(separator: Matcher,
                               data: Triple<Matcher>,
                               fA: rr.SequenceReducer): Matcher {
  let [_0, _1, _2] = data;

  return mseq3([msecond([mpass, _0, separator]),
                msecond([mpass, _1, separator]),
                _2], fA);
}

export function mseq3(data: Triple<Matcher>, 
                      fA: rr.SequenceReducer) : Matcher {
  return function(rest: string): Maybe<MatcherResult> {
    let accs: Array<OneMatcherValue> = [];

    for (let _matcher of data) {
      let _res = _matcher(rest);
      if (!_res) {
        return undefined;
      }

      let { acc: _acc, rest: _rest } = _res;

      rest = _rest;

      accs.push(_acc);
    }

    if (accs.length === 3) {
      return {
        rest,
        acc: fA(accs as Triple<OneMatcherNode>)
      };
    }
  };
}

export function mr(data: RegExp,
                   tpe: OneMatcherType): Matcher {
  let reducer = oneMatcherNode(tpe);

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


export function mrplus<A>(data: RegExp,
                          nbCapture: number, 
                          reducer: (_: Array<string>) => OneMatcherValue): Matcher {

  return function(rest: string): Maybe<MatcherResult> {
    let m = rest.match(data);

    if (m) {
      let [_, ..._rest] = m;

      let cgroups = _rest.slice(0, nbCapture),
      __rest = _rest[nbCapture];

      if (rest !== __rest) {
        return {
          rest: __rest,
          acc: reducer(cgroups)
        };
      }
    }
  };
};

export function mmap(data: Array<string>,
                     tpe: OneMatcherType): Matcher {

  let reducer = oneMatcherNode(tpe);

  return function(rest: string): Maybe<MatcherResult> {

    let m = data.find(_ => rest.startsWith(_));

    if (m) {
      let _rest = rest.slice(m.length);

      return {
        rest: _rest,
        acc: reducer(m)
      }
    }

  }
  
}

