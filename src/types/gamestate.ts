export type Game = {
  tokenPiles: Map<TokenColor, number>;
};

export enum TokenColor {
  Black,
  White,
  Blue,
  Green,
  Red,
}

// TEMP
export function newGame(): Game {
  return {
    tokenPiles: new Map<TokenColor, number>([
      [TokenColor.Black, 10],
      [TokenColor.White, 10],
      [TokenColor.Blue, 10],
      [TokenColor.Green, 10],
      [TokenColor.Red, 10],
    ]),
  };
}
