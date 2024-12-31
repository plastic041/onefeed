import { Button, styled } from "tamagui";
import { Pencil } from "@tamagui/lucide-icons";

export const WriteButton = styled(Button, {
  icon: Pencil,
  r: "$4",
  b: "$4",
  pos: "absolute",
  theme: "blue",
});
