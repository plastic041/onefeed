import { Paragraph, YStack } from "tamagui";
import { Card } from "../ui/Card";
import { Image } from "~/code/ui/Image";

type FeedItem = {
  id: number;
  content: string | null;
  createdAt: Date | null;
  username: string | null;
  imageuuid: string;
};

export const FeedCard = (props: FeedItem) => {
  if (!props.username) {
    return null;
  }

  return (
    <Card tag="a">
      <YStack f={1} gap="$2">
        <Image src={`https://ucarecdn.com/${props.imageuuid}/`} />

        <Paragraph size="$5" fow="bold">
          {props.username}
        </Paragraph>

        <Paragraph
          size="$4"
          whiteSpace="pre-wrap"
          $gtSm={{
            size: "$5",
          }}
        >
          {props.content}
        </Paragraph>
      </YStack>
    </Card>
  );
};
