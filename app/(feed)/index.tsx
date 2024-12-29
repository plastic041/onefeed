import { desc, eq, sql } from "drizzle-orm";
import { getURL, Stack, useLoader, type LoaderProps } from "one";
import { RefreshControl } from "react-native";
import { ScrollView } from "tamagui";
import { db } from "~/code/db/connection";
import { postsTable, usersTable } from "~/code/db/schema";
import { FeedCard } from "~/code/feed/FeedCard";
import { PageContainer } from "~/code/ui/PageContainer";

export async function loader({ path }: LoaderProps) {
  try {
    const url = new URL(getURL() + path);
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    const feed = await db
      .select({
        id: postsTable.id,
        content: postsTable.content,
        createdAt: postsTable.createdAt,
        imageuuid: postsTable.imageuuid,
        username: usersTable.username,
      })
      .from(postsTable)
      .leftJoin(usersTable, eq(usersTable.id, postsTable.userId))
      .orderBy(desc(postsTable.createdAt))
      .limit(limit)
      .offset(offset);

    return { feed };
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to fetch feed: ${(error as Error).message}`);
  }
}

export function FeedPage() {
  const { feed } = useLoader(loader);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Feed",
        }}
      />

      <PageContainer>
        <ScrollView maxHeight="100%">
          <RefreshControl refreshing={false} />
          {feed.map((item) => (
            <FeedCard key={item.id} {...item} />
          ))}
        </ScrollView>
      </PageContainer>
    </>
  );
}
