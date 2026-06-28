# Wonder Crash Image Table

Put finished images in `assets/` with the exact file name in the table. Keep PNG format.

This file is only for images that still need to be made. When an image is finished and added to `assets/`, delete its row from this file instead of changing its status to `Exists`.

## Image Request Rules

- New image requests must be added to this file before generating art.
- Use the exact `File name` listed here when the image is ready.
- Put finished single images directly in `assets/`.
- After a requested image is finished, remove that request row from this file. Do not keep completed images here as `Exists`, because this file may be sent directly to an image AI.
- If you provide a combined sheet image, put it in `docs/`; after I cut it into final assets, I will delete the original sheet from `docs/`.
- Keep object/icon images as transparent PNG whenever possible.
- Use `512x512` for icons, weapons, enemies, and character/object sprites unless the table says otherwise.
- Use `950x1688` for vertical battle backgrounds.
- Use `1536x1024` or wider for large horizontal base/wall images.
- Use `Needed` for required images and `Optional` for future ideas that are okay to generate later.
- Keep prompts aligned with the shared style prompt so the game stays visually consistent.
- UI should prefer images/icons over text whenever possible.
- Main menu tabs, upgrade buttons, resources, equipment, character status, wall status, and settings actions should all have image entries here before final UI polish.
- New weapons must have an icon/projectile image entry in this table before they are added to the backpack system.
- Text labels are allowed as temporary fallback during prototyping, but final buttons should be understandable from icons first.
- If a UI element needs a new icon, add it to the table as `Needed` before asking for or generating the image.
- After a combined source sheet is processed, the source sheet should be removed from `docs/`; only final assets and documentation should remain.

## Shared Style Prompt

Use this style for all generated assets:

`cute 2D mobile game sprite, playful child-friendly school and household object theme, clean bold outline, soft rounded shapes, bright saturated colors, light cel shading, subtle soft shadow, front-facing readable silhouette, transparent background when it is a character/object/icon, vertical mobile game composition for backgrounds, consistent with a whimsical kids defense game`

## Pending Image Requests

| Need | File name | Used as | Size | Prompt |
| --- | --- | --- | --- | --- |
| Optional | `weapon-glue.png` | Future weapon icon/projectile | 512x512 | cute glue bottle weapon, readable silhouette, transparent background, same 2D mobile game style |
