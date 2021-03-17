export type Maybe<T> = T | undefined

export type Either<A, B> = A | B

export type Triple<A> = [A, A, A]

export type Many<A> = A | Array<A>

export type LeafMatcherType =
  | "none"
  | "equal"
  | "number"
  | "cbegin"
  | "cend"
  | "text"
  | "space"
  | "newline"
  | "headline"
  | "line"
  | "fen"
  | "ply"
  | "mglyph"
  | "pglyph"
  | "oglyph"
  | "san"
  | "zeroturn"
  | "oneturn"
  | "shortcastles"
  | "longcastles"

export type BranchMatcherType =
  | "code"
  | "board"
  |"paragraph"
  | "linefen"
  | "linemoves"
  | "linelinemoves"
  | "glyphs"
  | "move"
  | "onemove"
  | "twomove"
  | "cmove"
  | "moves"
  | "content"

export type OneMatcherType = 
  | LeafMatcherType
  | BranchMatcherType

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
