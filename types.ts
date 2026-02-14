
export enum GameMode {
  BOOT = 'BOOT',
  LOGIN = 'LOGIN',
  MENU = 'MENU',
  TUTORIAL = 'TUTORIAL',
  LISTEN_PICK = 'LISTEN_PICK',
  SHOW_SAY = 'SHOW_SAY',
  READ_ALOUD = 'READ_ALOUD',
  STAR_CATCHER = 'STAR_CATCHER',
  NEON_PAINTER = 'NEON_PAINTER',
  LOGIC_BLOCKS = 'LOGIC_BLOCKS'
}

export interface GameItem {
  name: string;
  emoji: string;
  image: string;
}

export interface HandData {
  x: number;
  y: number;
  isFist: boolean;
}

export const GAME_ITEMS: GameItem[] = [
  { name: 'Apple', emoji: '🍎', image: 'https://picsum.photos/seed/apple/300/300' },
  { name: 'Banana', emoji: '🍌', image: 'https://picsum.photos/seed/banana/300/300' },
  { name: 'Car', emoji: '🚗', image: 'https://picsum.photos/seed/car/300/300' },
  { name: 'Dog', emoji: '🐶', image: 'https://picsum.photos/seed/dog/300/300' },
  { name: 'Ball', emoji: '⚽', image: 'https://picsum.photos/seed/ball/300/300' },
  { name: 'Elephant', emoji: '🐘', image: 'https://picsum.photos/seed/elephant/300/300' },
  { name: 'Fish', emoji: '🐟', image: 'https://picsum.photos/seed/fish/300/300' },
  { name: 'Hat', emoji: '🎩', image: 'https://picsum.photos/seed/hat/300/300' },
  { name: 'Cat', emoji: '🐱', image: 'https://picsum.photos/seed/cat/300/300' },
  { name: 'Bird', emoji: '🐦', image: 'https://picsum.photos/seed/bird/300/300' }
];
