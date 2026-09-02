# Stack Blueprint demo video

The Remotion project renders the public demo in `video/out/`. That directory is intentionally ignored because rendered media should not be committed to the source repository.

## Included assets

The repository includes the assets needed to render the final cut:

- `voiceover.m4a`: the cleaned complete narration
- `captions.json`: caption objects using the Remotion `Caption` shape
- `ambient-bed.wav`: the quiet background bed
- `live-webmcp-*.png`: captures from the deployed application

Brand marks and any additional visual assets also belong in `video/public/` and should be referenced with `staticFile()`.

The `live-webmcp-*.png` frames were captured from the deployed application in Codex's in-app browser while its registered WebMCP tools built, inspected, and revised the visible blueprint. The dark tool-call receipts beside those frames are editorial Remotion overlays that label the real calls; they are not browser chrome.

## Render

```bash
cd video
npm install
npm run typecheck
npx remotion render src/index.ts StackBlueprintDemo out/stack-blueprint-demo.mp4 --codec=h264 --crf=18
```

The final submission must remain under three minutes. Verify the rendered MP4 with `ffprobe`, a full decode, loudness analysis, black-frame detection, and a visual contact sheet before uploading it.
