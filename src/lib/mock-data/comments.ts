import type { Comment } from "@/types";
import { MOCK_FRIENDS } from "./users";

const [riya, noah, samira, leo, hana, ishan, amara, eli, sofia, kabir] = MOCK_FRIENDS;

export const MOCK_COMMENTS: Comment[] = [
  {
    id: "comment-1",
    momentId: "moment-1",
    authorId: noah.id,
    author: noah,
    text: "This is actually so sweet.",
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: "comment-2",
    momentId: "moment-1",
    authorId: hana.id,
    author: hana,
    text: "W Aura.",
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: "comment-3",
    momentId: "moment-1",
    authorId: amara.id,
    author: amara,
    text: "You inspired me to do this tomorrow.",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: "comment-4",
    momentId: "moment-2",
    authorId: riya.id,
    author: riya,
    text: "Quiet Aura > everything.",
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
  },
  {
    id: "comment-5",
    momentId: "moment-2",
    authorId: sofia.id,
    author: sofia,
    text: "Need more of this energy.",
    createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
  },
  {
    id: "comment-6",
    momentId: "moment-3",
    authorId: eli.id,
    author: eli,
    text: "47 minutes is beautiful lol",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: "comment-7",
    momentId: "moment-3",
    authorId: kabir.id,
    author: kabir,
    text: "My grandma would be so happy if I did this.",
    createdAt: new Date(Date.now() - 1000 * 60 * 115).toISOString(),
  },
  {
    id: "comment-8",
    momentId: "moment-7",
    authorId: leo.id,
    author: leo,
    text: "This is community in its purest form.",
    createdAt: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
  },
  {
    id: "comment-9",
    momentId: "moment-12",
    authorId: riya.id,
    author: riya,
    text: "Main character moment for real.",
    createdAt: new Date(Date.now() - 1000 * 60 * 940).toISOString(),
  },
  {
    id: "comment-10",
    momentId: "moment-12",
    authorId: samira.id,
    author: samira,
    text: "This makes me want to do the same.",
    createdAt: new Date(Date.now() - 1000 * 60 * 935).toISOString(),
  },
];
