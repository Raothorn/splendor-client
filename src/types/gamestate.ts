export type Game = {
  _player: Player
  _tokenBank: TokenPiles
  _developmentDecks: [number[], number[]][]
};

export type Player = {
  tokens: TokenPiles
  developments: Development[]
}

export type TokenPiles = [string, number][]

type Development = {
  developmentId: DevelopmentId
  developmentGem: string
}

type DevelopmentId = number

export function lookupTokens(piles: TokenPiles, color: string) {
  let [_, amt] = piles.find((t) => t[0] == color) ?? [ "", 0, ];
  return amt;
}


export const tokenColors = [ "Black", "White", "Blue", "Green", "Red" ];
// TEMP