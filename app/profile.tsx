import { ScrollView } from "tamagui";
import { getURL, type LoaderProps, useLoader } from "one";
import { FeedCard } from "~/code/feed/FeedCard";
import { PageContainer } from "~/code/ui/PageContainer";
import { db } from "~/code/db/connection";
import { usersTable, postsTable } from "~/code/db/schema";
import { eq, sql } from "drizzle-orm";

export async function loader({ path }: LoaderProps) {
  try {
    // Fetch a random user from the database
    const randomUserQuery = db
      .select({
        id: usersTable.id,
        name: usersTable.username,
      })
      .from(usersTable)
      .orderBy(sql`RANDOM()`)
      .limit(1);

    const randomUser = await randomUserQuery;

    if (randomUser.length === 0) {
      throw new Error("No usersTableTable found in the database");
    }

    const USER_ID = randomUser[0].id;

    const url = new URL(getURL() + path);
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    const postsTableQuery = db
      .select({
        id: postsTable.id,
        content: postsTable.content,
        imageuuid: postsTable.imageuuid,
        createdAt: sql<Date>`${postsTable.createdAt} as created_at`,
        username: usersTable.username,
      })
      .from(postsTable)
      .leftJoin(usersTable, eq(usersTable.id, postsTable.userId))
      .where(eq(postsTable.userId, USER_ID))
      .limit(limit)
      .offset(offset);

    const feed = await postsTableQuery;

    return { profileFeed: feed, userData: randomUser[0] };
  } catch (error) {
    console.error(error);
    throw new Error(
      `Failed to fetch profile feed: ${(error as Error).message}`
    );
  }
}

export default function ProfilePage() {
  const { profileFeed } = useLoader(loader);

  return (
    <PageContainer>
      <ScrollView>
        {profileFeed.map((post) => (
          <FeedCard key={post.id} {...post} />
        ))}
      </ScrollView>
    </PageContainer>
  );
}
