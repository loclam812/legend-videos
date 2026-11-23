---
description: Bước 3/4 — kiểm tra mọi lớp ảnh đã sinh (kích thước + xem tranh), ghi trạng thái đạt/lỗi
argument-hint: (không đối số)
---

Step 3 of the staged video workflow: read `content.json` at the repo root and check
EVERY generated layer of its story folder — first the cheap facts, then your own
eyes. The output is a per-image pass/fail status the user reviews before `/quay`.
Everything you say to the user is Vietnamese. No arguments.

1. **Guard.** `content.json` must exist and `status.preparedAt` be set; otherwise
   refuse: "chưa chuẩn bị ảnh, chạy /chuanbi trước". Never infer state from disk.

2. **Programmatic pre-pass.** From the repo root run
   `node giay/soat.js <folder> --json` (needs no `.env`): per layer it reports
   `exists`, `actual` vs `expected` pixel size, and `mtime`. Exit 2 means `anh.js`
   itself is broken — fix that first (it is a code error, not an image problem).

3. **Visual pass — look at every picture.** `Read` each
   `<folder>/anh/<name>.<ext>` and judge it against its prompt in `anh.js` plus the
   known failure modes (CLAUDE.md):
   - a sky plate come back as "a sheet of paper with a pale border";
   - a slim standing puppet far taller than wide ones at the same width;
   - a prehistoric animal on two legs when it should have four;
   - text or extra objects the prompt excluded;
   - a magenta background that is not flat (texture, gradient, shadow) — it will key
     badly;
   - a figure cropped at the frame edges (head or feet cut off).

4. **Facing vs the `LEFT` table.** Read `<folder>/canh.js`: `LEFT` keys are short
   camelCase names, not layer names — map each `pg-<x>` layer to its key. For every
   puppet/prop whose facing matters in a scene, check the picture against the table
   and fix `LEFT` in place where wrong (`node --check canh.js` after). A `LEFT` fix
   does not invalidate the image checks.

5. **Report + status.** A Vietnamese table `lớp | đạt/lỗi | vấn đề` covering both
   passes. Then write `content.json`: for EVERY layer a `status.images` entry
   `{ ok, note: "<ngắn gọn tiếng Việt>", seed: <7 unless it was regenerated>, mtime:
   <from soat.js> , checkedAt: <ISO> }`, plus `status.checkedAt = <ISO>`,
   `status.step = "soatanh"`, `updatedAt` (read it back, change only these fields).

6. **Offer regeneration.** For each failed layer, offer
   `set -a; . ./.env; set +a; node giay/sinh.js <folder> <name>:<seed + 1>` — one at
   a time, as the only heavy job. After each regeneration: rerun
   `node giay/soat.js <folder> --json`, visually re-Read just that file, update its
   `status.images` entry and `checkedAt`. Iterate until the user stops or all pass.
   End with "bước tiếp theo: /quay".
