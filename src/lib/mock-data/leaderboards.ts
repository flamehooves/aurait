import type { LeaderboardEntry } from "@/types";
import { DEMO_USERS, MOCK_FRIENDS } from "./users";

const maya = DEMO_USERS.maya;
const [riya, noah, samira, leo, hana, ishan, amara, eli, sofia, kabir, priya, james] = MOCK_FRIENDS;

export const LEADERBOARD_FRIENDS: LeaderboardEntry[] = [
  { rank: 1, user: amara, auraGained: 4800, streak: 19, movement: 1, isCurrentUser: false, percentile: 2 },
  { rank: 2, user: hana, auraGained: 3600, streak: 16, movement: -1, isCurrentUser: false, percentile: 4 },
  { rank: 3, user: maya, auraGained: 2340, streak: 7, movement: 2, isCurrentUser: true, percentile: 8 },
  { rank: 4, user: riya, auraGained: 2800, streak: 9, movement: -1, isCurrentUser: false, percentile: 6 },
  { rank: 5, user: noah, auraGained: 4100, streak: 14, movement: 0, isCurrentUser: false, percentile: 3 },
  { rank: 6, user: leo, auraGained: 2200, streak: 8, movement: 1, isCurrentUser: false, percentile: 10 },
  { rank: 7, user: sofia, auraGained: 2600, streak: 10, movement: -2, isCurrentUser: false, percentile: 7 },
  { rank: 8, user: kabir, auraGained: 2050, streak: 7, movement: 0, isCurrentUser: false, percentile: 11 },
  { rank: 9, user: eli, auraGained: 1500, streak: 6, movement: 1, isCurrentUser: false, percentile: 16 },
  { rank: 10, user: samira, auraGained: 1900, streak: 5, movement: -1, isCurrentUser: false, percentile: 13 },
  { rank: 11, user: ishan, auraGained: 980, streak: 3, movement: 2, isCurrentUser: false, percentile: 22 },
  { rank: 12, user: priya, auraGained: 1100, streak: 4, movement: -1, isCurrentUser: false, percentile: 19 },
];

export const LEADERBOARD_CITY: LeaderboardEntry[] = [
  { rank: 1, user: james, auraGained: 8200, streak: 22, movement: 0, isCurrentUser: false, percentile: 1 },
  { rank: 2, user: amara, auraGained: 4800, streak: 19, movement: 1, isCurrentUser: false, percentile: 2 },
  { rank: 3, user: noah, auraGained: 4100, streak: 14, movement: -1, isCurrentUser: false, percentile: 3 },
  { rank: 4, user: hana, auraGained: 3600, streak: 16, movement: 2, isCurrentUser: false, percentile: 4 },
  { rank: 5, user: riya, auraGained: 2800, streak: 9, movement: -1, isCurrentUser: false, percentile: 5 },
  { rank: 6, user: sofia, auraGained: 2600, streak: 10, movement: 0, isCurrentUser: false, percentile: 6 },
  { rank: 7, user: maya, auraGained: 2340, streak: 7, movement: 2, isCurrentUser: true, percentile: 8 },
  { rank: 8, user: leo, auraGained: 2200, streak: 8, movement: -1, isCurrentUser: false, percentile: 9 },
  { rank: 9, user: kabir, auraGained: 2050, streak: 7, movement: 1, isCurrentUser: false, percentile: 10 },
  { rank: 10, user: samira, auraGained: 1900, streak: 5, movement: 0, isCurrentUser: false, percentile: 12 },
];
