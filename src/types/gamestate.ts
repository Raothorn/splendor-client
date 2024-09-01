export type Game = {
  _player: Player
  _tokenPiles: TokenPiles
};

export type Player = {
  _playerTokens: TokenPiles
}

export type TokenPiles = [string, number][]

export function lookupTokens(piles: TokenPiles, color: string) {
  let [_, amt] = piles.find((t) => t[0] == color) ?? [ "", 0, ];
  return amt;
}

export const tokenColors = [ "Black", "White", "Blue", "Green", "Red" ];
// TEMP