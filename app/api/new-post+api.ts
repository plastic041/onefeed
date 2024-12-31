import { db } from "~/code/db/connection";
import { postsTable } from "~/code/db/schema";

export async function POST(request: Request) {
  const { content, uuid, userId } = await request.json();

  await db.insert(postsTable).values({ content, imageuuid: uuid, userId });

  return new Response("Post created", {
    status: 201,
  });
}
