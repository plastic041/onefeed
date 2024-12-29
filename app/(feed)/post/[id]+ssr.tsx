import { eq } from "drizzle-orm";
import { useLoader, useNavigation, useParams } from "one";
import { useEffect } from "react";
import { db } from "~/code/db/connection";
import { usersTable, postsTable } from "~/code/db/schema";
import { FeedCard } from "~/code/feed/FeedCard";
import { PageContainer } from "~/code/ui/PageContainer";

export async function loader({ params }) {
  const id = params.id;

  if (!id) {
    throw new Error("Invalid post ID");
  }

  try {
    const post = await db
      .select({
        id: postsTable.id,
        content: postsTable.content,
        createdAt: postsTable.createdAt,
        username: usersTable.username,
      })
      .from(postsTable)
      .leftJoin(usersTable, eq(usersTable.id, postsTable.userId))
      .where(eq(postsTable.id, Number(id)))
      .limit(1);

    if (post.length === 0) {
      throw new Error("Post not found");
    }

    return {
      ...post[0],
    };
  } catch (error) {
    throw new Error(`Failed to fetch post: ${(error as Error).message}`);
  }
}

export function PostPage() {
  const data = useLoader(loader);

  const navigation = useNavigation();
  const params = useParams<any>();

  useEffect(() => {
    navigation.setOptions({ title: data?.content || `Post #${params.id}` });
  }, [navigation, data?.content, params.id]);

  if (!data) {
    return null;
  }

  return (
    <PageContainer>
      <FeedCard {...data} />
    </PageContainer>
  );
}
