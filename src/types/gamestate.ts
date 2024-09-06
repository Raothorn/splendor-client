export type GameState = {
  players: Map<string, Player>,
  tokenBank: TokenPiles
  decks: [number[], number[]][]
  currentPlayer: string
}

export type LobbyState = {
  lobbyPlayers: string[]
}

export type Player = {
  tokens: TokenPiles
  gold: number
  ownedDevelopments: DevelopmentId[]
  reservedDevelopments: DevelopmentId[]
  victoryPoints: number
  turnOrder: number
  username: string
}

export type Guid = string

export type TokenPiles = [string, number][]

type DevelopmentId = number

export function lookupTokens(piles: TokenPiles, color: string) {
  let [_, amt] = piles.find((t) => t[0] == color) ?? [ "", 0, ];
  return amt;
}

export const tokenColors = [ "Black", "White", "Blue", "Green", "Red" ];