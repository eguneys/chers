export type Maybe<T> = T | undefined

export type Either<A, B> = A | B

export type Triple<A> = [A, A, A]

export type Many<A> = A | Array<A>

export type OneMatcherType = |
  "none" |
  "equal" |
  "number" |
  "cbegin" |
  "cend" |
  "text" |
  "space" |
  "newline" |
  "headline" |
  "code" |
  "paragraph" |
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
  "longcastles" |
  "content"

export type OneMatcherValue = 
  string | 
  Many<OneMatcherNode>

export type OneMatcherNode = {
  tpe: OneMatcherType,
  value: OneMatcherValue
}

export type MatcherResult = {
  rest: string,
  acc: OneMatcherValue
}

export type Matcher = (rest: string) => Maybe<MatcherResult>
