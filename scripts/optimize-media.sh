#!/bin/bash
# Optimizes the media actually referenced by src/ into web-production sizes.
# Originals are preserved in media-source/ (gitignored, never deployed).
#
#   posters : 1920x1080 PNG (~6 MB)  -> WebP q82        (~90 KB)
#   scrubbed: 1080p ~15 Mbps         -> 720p CRF 30     (~2.5 MB)
#             dense GOP (-g 12) so scroll-seeking lands on a keyframe
#   autoplay: hero clip is played, not seeked, so it gets a normal GOP
set -euo pipefail
cd "$(dirname "$0")/.."

SRC=media-source
mkdir -p "$SRC/posters" "$SRC/videos"

# Referenced by src/ and styles.css. Everything else is dropped from the bundle.
POSTERS=(chapter-01 chapter-02 chapter-04 \
         journey-02-03 journey-03-04 journey-04-05 \
         journey-05-06 journey-06-07 journey-07-08)
SCRUBBED=(journey-02-03 journey-03-04 journey-04-05 \
          journey-05-06 journey-06-07 journey-07-08)
AUTOPLAY=(chapter-01-reveal)

# Stash originals once; reruns then read from the stash.
for n in "${POSTERS[@]}"; do
  [ -f "public/posters/$n.png" ] && mv "public/posters/$n.png" "$SRC/posters/" || true
done
for n in "${SCRUBBED[@]}" "${AUTOPLAY[@]}"; do
  [ -f "public/videos/$n.mp4" ] && mv "public/videos/$n.mp4" "$SRC/videos/" || true
done

echo "== posters -> webp =="
for n in "${POSTERS[@]}"; do
  ffmpeg -y -v error -i "$SRC/posters/$n.png" \
    -c:v libwebp -quality 82 -compression_level 6 \
    "public/posters/$n.webp"
  printf '  %-16s %6.0f KB\n' "$n.webp" "$(($(stat -c%s "public/posters/$n.webp")/1024))"
done

echo "== logo -> 256px webp =="
mkdir -p public/logo
[ -f public/logo/bidx_coin_logo.png ] && mv public/logo/bidx_coin_logo.png "$SRC/" || true
ffmpeg -y -v error -i "$SRC/bidx_coin_logo.png" \
  -vf "scale=256:256:flags=lanczos" -c:v libwebp -quality 88 \
  public/logo/bidx_coin_logo.webp
# 64px PNG kept for favicon breadth
ffmpeg -y -v error -i "$SRC/bidx_coin_logo.png" \
  -vf "scale=64:64:flags=lanczos" public/logo/favicon.png
printf '  logo.webp %.0f KB / favicon.png %.0f KB\n' \
  "$(($(stat -c%s public/logo/bidx_coin_logo.webp)/1024))" \
  "$(($(stat -c%s public/logo/favicon.png)/1024))"

echo "== scrubbed videos -> 720p dense-GOP =="
for n in "${SCRUBBED[@]}"; do
  ffmpeg -y -v error -i "$SRC/videos/$n.mp4" -an \
    -vf "scale=1280:720:flags=lanczos" \
    -c:v libx264 -preset slow -crf 30 \
    -g 12 -keyint_min 12 -sc_threshold 0 \
    -pix_fmt yuv420p -movflags +faststart \
    "public/videos/$n.mp4"
  printf '  %-22s %5.2f MB\n' "$n.mp4" \
    "$(awk "BEGIN{printf \"%.2f\", $(stat -c%s "public/videos/$n.mp4")/1048576}")"
done

echo "== autoplay hero -> 720p normal GOP =="
for n in "${AUTOPLAY[@]}"; do
  ffmpeg -y -v error -i "$SRC/videos/$n.mp4" -an \
    -vf "scale=1280:720:flags=lanczos,fps=24" \
    -c:v libx264 -preset slow -crf 30 \
    -g 48 -pix_fmt yuv420p -movflags +faststart \
    "public/videos/$n.mp4"
  printf '  %-22s %5.2f MB\n' "$n.mp4" \
    "$(awk "BEGIN{printf \"%.2f\", $(stat -c%s "public/videos/$n.mp4")/1048576}")"
done

# Media the code never references: retire it out of public/ so it stops
# shipping, but keep it on disk rather than deleting.
mkdir -p "$SRC/unused"
[ -d public/videos/_original ] && mv public/videos/_original "$SRC/unused/" || true
for f in public/videos/5.mp4 public/videos/chapter-02-roots.mp4 \
         public/videos/chapter-03-impact.mp4 public/videos/chapter-04-lockup.mp4 \
         public/posters/chapter-03.png; do
  [ -f "$f" ] && mv "$f" "$SRC/unused/" || true
done

echo
echo "public/ total: $(du -sh public | cut -f1)"
