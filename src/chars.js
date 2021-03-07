function makeMatcher(fMatch) {
  return (data, name) => ({
    fMatch,
    data,
    name
  });
}

const mr = makeMatcher((data, rest) => {
  let m = rest.match(data);

  if (m && m[1] !== '') {
    return [m[1], m[2]];
  } else {
    return null;
  }
});
const mstar = makeMatcher((data, rest) => {
  let acc = [];

  while (true) {
    let _res = doMatcher(rest, data);

    if (!_res) {
      return null;
    }

    let [name, res] = _res;

    acc.push([name, res[0]]);
    rest = res[1];
    if (rest.length === 0) {
      break;
    }
  }
  return [acc, rest];
});
const mseq = makeMatcher((data, rest) => {
  let acc = [];
  
  for (let _matcher of data) {
    let _res = doMatcher(rest, _matcher);

    if (!_res) {
      return null;
    }

    let [name, res] = _res;

    acc.push([name, res[0]]);
    rest = res[1];
  }

  return [acc, rest];
});
const mor = makeMatcher((data, rest) => {
  return data.reduce((res, _matcher) => {
    if (res) {
      return res;
    }

    let _res = doMatcher(rest, _matcher);

    if (!_res) {
      return null;
    } else {
      return _res;
    }
  }, null);
});



const rText = mr(/^([^<>#\n]*)(.*)/s, 'text');
const rHeadline = mseq([mr(/^(#)(.*)/s,'punc'),
                        rText,
                        mr(/^(\n)(.*)/s, 'punc')], 'headline');

const rTextOrHeadline = mor([rText, rHeadline], 'textOrHeadline');

const rContent = mstar(rTextOrHeadline, 'content');

function doMatcher(content, matcher) {
  let { fMatch, data, name } = matcher;

  let res = fMatch(data, content);

  if (res) {
    return [name, res];
  } else {
    return null;
  }
}

export default function chars(content) {
  return doMatcher(content, rHeadline);
}
