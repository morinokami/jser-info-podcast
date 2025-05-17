メモ

1. wav から mp3 に変換: `ffmpeg -i input.wav -c:a libmp3lame -b:a 192k 2025-05-11.mp3`
2. mp3 を public/audio に配置
3. `bun scripts/build-episode.ts -n 1 -i 2025-05-11` で episode を作成
4. description を追記
