
import { Player, Role, GameSettings, Winner } from '../types';

export const initializeGame = (settings: GameSettings): Player[] => {
  const { totalPlayers, spyCount, blankCount, wordPair } = settings;
  const civilianCount = totalPlayers - spyCount - blankCount;

  let roles: Role[] = [];
  
  for (let i = 0; i < spyCount; i++) roles.push(Role.SPY);
  for (let i = 0; i < blankCount; i++) roles.push(Role.BLANK);
  for (let i = 0; i < civilianCount; i++) roles.push(Role.CIVILIAN);

  // Fisher-Yates shuffle
  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [roles[i], roles[j]] = [roles[j], roles[i]];
  }

  return roles.map((role, index) => {
    let word = "";
    if (role === Role.CIVILIAN) word = wordPair.civilian;
    else if (role === Role.SPY) word = wordPair.spy;
    else word = ""; // Blank has empty string

    return {
      id: index + 1,
      role,
      word,
      isRevealed: false,
      isEliminated: false,
    };
  });
};

export const checkWinCondition = (players: Player[]): Winner => {
  const activePlayers = players.filter(p => !p.isEliminated);
  
  const spies = activePlayers.filter(p => p.role === Role.SPY).length;
  const blanks = activePlayers.filter(p => p.role === Role.BLANK).length;
  const civilians = activePlayers.filter(p => p.role === Role.CIVILIAN).length;

  // Rule 3: Spy Victory
  // If Spies have majority or parity against all others (Civ + Blank), they control the vote.
  // Note: In a 3-player game (1 Spy, 1 Civ, 1 Blank), Spies(1) < Others(2), so game continues (Rule 6).
  // In a 2-player game (1 Spy, 1 Civ), Spies(1) >= Others(1), Spy Wins.
  if (spies > 0 && spies >= (civilians + blanks)) {
    return Winner.SPY;
  }

  // Rule 2 & 4: Spies Eliminated
  if (spies === 0) {
    // Rule 4: Blank Victory Condition Check
    // Triggers ONLY if Spies are gone AND strictly 1 Blank vs 1 Civilian remains (Total 2).
    // This allows the "Whiteboard to the end" guessing phase.
    if (blanks > 0 && activePlayers.length <= 2) {
      return Winner.BLANK; // Signal to UI to start Guessing Phase
    }

    // Rule 2: Civilian Victory
    // If Spies are out and it's not the specific 1v1 Blank scenario, Civilians win immediately.
    // (e.g. 2 Civs + 1 Blank left => Civilians Win, Blank Fails).
    return Winner.CIVILIAN;
  }

  return Winner.NONE;
};
