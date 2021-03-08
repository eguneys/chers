type Maybe<T> = T | undefined

type Either<A, B> = A | B

type Triple<A> = [A, A, A]

type Many<A> = A | Array<A>

type OneMatcherType = |
  "none" |
  "equal" |
  "number" |
  "cbegin" |
  "cend" |
  "text" |
  "space" |
  "newline" |
  "headline" |
  "line" |
  "fen" |
  "linefen" |
  "linemoves" |
  "linelinemoves" |
  "ply" |
  "mglyph" |
  "pglyph" |
  "oglyph" |
  "glyphs" |
  "san" |
  "move" |
  "onemove" |
  "twomove" |
  "cmove" |
  "zeroturn" |
  "oneturn" |
  "moves" |
  "board" |
  "shortcastles" |
  "longcastles"

type OneMatcherValue = 
  string | 
  Many<OneMatcherNode>

type OneMatcherNode = {
  tpe: OneMatcherType,
  value: OneMatcherValue
}

type MatcherResult = {
  rest: string,
  acc: OneMatcherValue
}

type Matcher = (rest: string) => Maybe<MatcherResult>
