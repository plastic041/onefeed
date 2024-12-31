import { X, Image } from "@tamagui/lucide-icons";
import { uploadFile } from "@uploadcare/upload-client";
import {
  Adapt,
  Button,
  Dialog,
  Fieldset,
  Sheet,
  TextArea,
  Unspaced,
  VisuallyHidden,
  XStack,
} from "tamagui";
import { WriteButton } from "./write-button";
import { useState } from "react";
import { useToastController } from "@tamagui/toast";

type NewPostDialogProps = {
  userId: number;
};
export function NewPostDialog({ userId }: NewPostDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <WriteButton />
      </Dialog.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet animation="medium" zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding="$4" gap="$4">
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="slow"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <DialogContent userId={userId} handleClose={() => setOpen(false)} />
      </Dialog.Portal>
    </Dialog>
  );
}

type DialogContentProps = {
  userId: number;
  handleClose: () => void;
};
export function DialogContent({ userId, handleClose }: DialogContentProps) {
  const toast = useToastController();

  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const imagePreview = file ? URL.createObjectURL(file) : "";

  async function onPost() {
    if (file === null) {
      throw new Error("File is `null` - unreachable");
    }

    const result = await uploadFile(file, {
      publicKey: "b038a00ca5884d2edac5",
      store: "auto",
    });

    await fetch("api/new-post", {
      method: "POST",
      body: JSON.stringify({ content, uuid: result.uuid, userId }),
    });

    toast.show("Posted!");
    handleClose();
  }

  return (
    <Dialog.Content
      bordered
      elevate
      key="content"
      animateOnly={["transform", "opacity"]}
      animation={[
        "quicker",
        {
          opacity: {
            overshootClamping: true,
          },
        },
      ]}
      enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
      exitStyle={{ x: 0, y: 0, opacity: 0, scale: 0.95 }}
      gap="$4"
      width={400}
    >
      <Dialog.Title>New post</Dialog.Title>
      <Fieldset>
        {file === null ? (
          <Button tag="label" icon={Image} h={200} htmlFor="file-input" />
        ) : (
          <img
            src={imagePreview}
            onLoad={() => {
              URL.revokeObjectURL(imagePreview);
            }}
          />
        )}
        <VisuallyHidden>
          <input
            type="file"
            id="file-input"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                setFile(e.target.files[0]);
              }
            }}
          />
        </VisuallyHidden>
      </Fieldset>
      <Fieldset>
        <TextArea placeholder="What's happening?" aria-label="post content" />
      </Fieldset>

      <XStack alignSelf="flex-end" gap="$4">
        <Dialog.Close displayWhenAdapted asChild>
          <Button
            theme="blue"
            aria-label="Make new post"
            disabled={file === null}
            onPress={onPost}
          >
            Post
          </Button>
        </Dialog.Close>
      </XStack>

      <Unspaced>
        <Dialog.Close asChild>
          <Button
            position="absolute"
            top="$3"
            right="$3"
            size="$2"
            circular
            icon={X}
          />
        </Dialog.Close>
      </Unspaced>
    </Dialog.Content>
  );
}
