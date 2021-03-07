type Matchmaker = (data: MatcherData, name: MatcherName) => Matcher

type MatcherName = string | undefined

type MatcherData = RegExp | 
  Array<Matcher>

type MaybeMatcherNode = MatcherNode | undefined

type MatcherChildren = string |
  Array<MatcherNode>

interface MatcherNode {
  name: MatcherName,
  rest: string,
  children: MatcherChildren,
}

interface Matcher {
  fMatch: (data: MatcherData, rest: string) => MaybeMatcherNode,
  data: MatcherData,
  name: MatcherName
}

function makeMatchmaker(fMatch: (data: MatcherData, rest: string) => MaybeMatcherNode): Matchmaker {
  return function(data: MatcherData, name: MatcherName): Matcher {
    return {
      fMatch,
      data,
      name
    };
  };
}

function applyMatcher(m: Matcher, content: string): MaybeMatcherNode {
  let maybeNode = m.fMatch(m.data, content);

  if (maybeNode) {

    let { rest, children } = maybeNode;

    if (rest !== content) {
      return {
        name: m.name,
        rest,
        children
      };
    }
  }
}

const mor = makeMatchmaker((data: MatcherData, rest: string): MaybeMatcherNode => {
  if (!Array.isArray(data)) {
    return undefined;
  }

  return data.reduce((_res, _matcher) => {
    if (_res) {
      return _res;
    }

    return applyMatcher(_matcher, rest);
  }, undefined as MaybeMatcherNode);  
});

const mstar = makeMatchmaker((data: MatcherData, rest: string): MaybeMatcherNode => {
  if (!Array.isArray(data)) {
    return undefined;
  }

  let [_matcher] = data;

  let name,
  children = [];

  while (true) {
    let _res = applyMatcher(_matcher, rest);

    if (!_res) {
      return undefined;
    }

    let { name: _name, rest: _rest, children: _children } = _res;

    children.push({
      name: _name,
      rest: '',
      children: _children
    })
    rest = _rest;

    if (rest.length === 0) {
      break;
    }
  }

  return {
    name,
    rest,
    children
  }  
});

const mseq = makeMatchmaker((data: MatcherData, rest: string): MaybeMatcherNode => {
  if (!Array.isArray(data)) {
    return undefined;
  }

  let name,
  children = [];

  for (let _matcher of data) {
    let _res = applyMatcher(_matcher, rest);

    if (!_res) {
      return undefined;
    }

    let { name: _name, rest: _rest, children: _children } = _res;

    children.push({
      name: _name,
      rest: '',
      children: _children
    })

    rest = _rest;
  }

  return {
    name,
    rest,
    children
  };
});

const mr = makeMatchmaker((data: MatcherData, rest: string): MaybeMatcherNode  => {

  if (Array.isArray(data)) {
    return undefined;
  }

  let m = rest.match(data);

  if (m) {
    let [_, acc, rest] = m;
    let name;

    return {
      name,
      rest,
      children: acc
    };
  }
});

const mText = mr(/^([^<>#\n]*)(.*)/s, 'text');
const mHeadline = mseq([mr(/^(#)(.*)/s,'punc'),
                        mText,
                        mr(/^(\n)(.*)/s, 'punc')], 'headline');

const mTextOrHeadline = mor([mText, mHeadline], 'textOrHeadline');

const mContent = mstar([mTextOrHeadline], 'content');

export default function chars(content: string): MaybeMatcherNode {
  return applyMatcher(mContent, content);
}
