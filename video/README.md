# Stack Blueprint demo video

The Remotion project renders the public demo in `video/out/`. That directory is intentionally ignored because rendered media should not be committed to the source repository.

## Required local assets

Place these files in `video/public/` before rendering:

- `voiceover.m4a`: the cleaned complete narration
- `captions.json`: caption objects using the Remotion `Caption` shape

Brand marks and any additional visual assets also belong in `video/public/` and should be referenced with `staticFile()`.

## Render

```bash
cd video
npm install
npm run typecheck
npx remotion render src/index.ts StackBlueprintDemo out/stack-blueprint-demo.mp4 --codec=h264 --crf=18
```

The final submission must remain under three minutes. Verify the rendered MP4 with `ffprobe`, a full decode, loudness analysis, black-frame detection, and a visual contact sheet before uploading it.
