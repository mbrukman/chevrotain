import { has, isString, isUndefined } from "../utils/utils"
import { Lexer } from "./lexer_public"
import { augmentTokenTypes, tokenStructuredMatcher } from "./tokens"
import { IToken, ITokenConfig, TokenType } from "../../api"

export function tokenLabel(tokType: TokenType): string {
  if (hasTokenLabel(tokType)) {
    return tokType.LABEL
  } else {
    return tokType.name
  }
}

export function tokenName(tokType: TokenType): string {
  return tokType.name
}

export function hasTokenLabel(obj: TokenType): boolean {
  return isString((<any>obj).LABEL) && (<any>obj).LABEL !== ""
}

const PARENT = "parent"
const CATEGORIES = "categories"
const LABEL = "label"
const GROUP = "group"
const PUSH_MODE = "push_mode"
const POP_MODE = "pop_mode"
const LONGER_ALT = "longer_alt"
const LINE_BREAKS = "line_breaks"
const START_CHARS_HINT = "start_chars_hint"

export function createToken(config: ITokenConfig): TokenType {
  return createTokenInternal(config)
}

function createTokenInternal(config: ITokenConfig): TokenType {
  let pattern = config.pattern

  let tokenType: TokenType = <any>{}
  tokenType.name = config.name

  if (!isUndefined(pattern)) {
    tokenType.PATTERN = pattern
  }

  if (has(config, PARENT)) {
    throw "The parent property is no longer supported.\n" +
      "See: https://github.com/SAP/chevrotain/issues/564#issuecomment-349062346 for details."
  }

  if (has(config, CATEGORIES)) {
    // casting to ANY as this will be fixed inside `augmentTokenTypes``
    tokenType.CATEGORIES = <any>config[CATEGORIES]
  }

  augmentTokenTypes([tokenType])

  if (has(config, LABEL)) {
    tokenType.LABEL = config[LABEL]
  }

  if (has(config, GROUP)) {
    tokenType.GROUP = config[GROUP]
  }

  if (has(config, POP_MODE)) {
    tokenType.POP_MODE = config[POP_MODE]
  }

  if (has(config, PUSH_MODE)) {
    tokenType.PUSH_MODE = config[PUSH_MODE]
  }

  if (has(config, LONGER_ALT)) {
    tokenType.LONGER_ALT = config[LONGER_ALT]
  }

  if (has(config, LINE_BREAKS)) {
    tokenType.LINE_BREAKS = config[LINE_BREAKS]
  }

  if (has(config, START_CHARS_HINT)) {
    tokenType.START_CHARS_HINT = config[START_CHARS_HINT]
  }

  Object.defineProperty(tokenType, "tokenName", {
    get() {
      throw Error(
        "TokenName property has been deprecated, use the `name` property instead."
      )
    },
    set(newVal) {
      throw Error(
        "TokenName property has been deprecated, use the `name` property instead."
      )
    },
    enumerable: false,
    configurable: false
  })

  return tokenType
}

export const EOF = createToken({ name: "EOF", pattern: Lexer.NA })
augmentTokenTypes([EOF])

export function createTokenInstance(
  tokType: TokenType,
  image: string,
  startOffset: number,
  endOffset: number,
  startLine: number,
  endLine: number,
  startColumn: number,
  endColumn: number
): IToken {
  return {
    image,
    startOffset,
    endOffset,
    startLine,
    endLine,
    startColumn,
    endColumn,
    tokenTypeIdx: (<any>tokType).tokenTypeIdx,
    tokenType: tokType
  }
}

export function tokenMatcher(token: IToken, tokType: TokenType): boolean {
  return tokenStructuredMatcher(token, tokType)
}
