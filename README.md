メモ

1. wav から mp3 に変換: `ffmpeg -i 2025-05-11.wav -ar 44100 -ac 2 -b:a 160k -id3v2_version 3 2025-05-11.mp3`
2. mp3 を public/audio に配置
3. `bun scripts/build-episode.ts -n 1 -i 2025-05-11` で episode を作成
4. description を追記
