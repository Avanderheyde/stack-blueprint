import { Composition } from "remotion";
import { StackBlueprintDemo } from "./StackBlueprintDemo";

export const FPS = 30;
export const DURATION_SECONDS = 164;

export const RemotionRoot = () => (
  <Composition
    id="StackBlueprintDemo"
    component={StackBlueprintDemo}
    durationInFrames={DURATION_SECONDS * FPS}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
