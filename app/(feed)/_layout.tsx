import { View } from "tamagui";
import { Slot } from "one";
import { WriteButton } from "~/app/(feed)/write-button";

export default function FeedLayout() {
  return (
    <View flex={1} flexGrow={1}>
      <Slot />

      <WriteButton />
    </View>
  );
}
