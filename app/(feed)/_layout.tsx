import { View } from "tamagui";
import { Slot } from "one";
import { NewPostDialog } from "~/app/(feed)/new-post";

export default function FeedLayout() {
  return (
    <View flex={1} flexGrow={1}>
      <Slot />
    </View>
  );
}
