#!/bin/bash
set -e

# Compile editor/main.ts into build/editor/main.js and dependencies
npx tsc

# Combine build/editor/main.js and dependencies into offline/beepbox_editor.min.js
npx rollup build/editor/main.js \
	--file offline/beepbox_editor.min.js \
	--format iife \
	--output.name beepbox \
	--context exports \
	--plugin rollup-plugin-sourcemaps \
	--plugin @rollup/plugin-node-resolve

# Minify offline/beepbox_editor.min.js into offline/beepbox_editor.min.js
npx terser \
	offline/beepbox_editor.min.js \
	-o offline/beepbox_editor.min.js \
	--compress \
    --define OFFLINE=true \
	--mangle \
	--mangle-props regex="/^_.+/;"
    
# echo "WARNING: This file assumes you have already ran npm run build!"

# Compile player/main.ts into build/player/main.js and dependencies
npx tsc -p tsconfig_player.json

# Combine build/player/main.js and dependencies into offline/player/beepbox_player.min..js
npx rollup build/player/main.js \
	--file offline/player/beepbox_player.min.js \
	--format iife \
	--output.name beepbox \
	--context exports \
	--plugin rollup-plugin-sourcemaps \
	--plugin @rollup/plugin-node-resolve

# Minify offline/player/beepbox_player.min.js into offline/player/beepbox_player.min.js
npx terser \
	offline/player/beepbox_player.min.js \
	-o offline/player/beepbox_player.min.js \
	--compress \
    --define OFFLINE=true \
	--mangle \
	--mangle-props regex="/^_.+/;"


# TODO: Is there a cleaner way to do this?
cp website/samples.js offline/
cp website/samples2.js offline/
cp website/samples3.js offline/
cp website/drumsamples.js offline/
cp website/kirby_samples.js offline/
cp website/wario_samples.js offline/
cp website/mario_paintbox_samples.js offline/
cp website/nintaribox_samples.js offline/

# cp website/404.html offline/
# cp website/credits.html offline/

cp website/theme_resources/ offline/ -r

cp website/samples.js offline/player
cp website/samples2.js offline/player
cp website/samples3.js offline/player
cp website/drumsamples.js offline/player
cp website/kirby_samples.js offline/player
cp website/wario_samples.js offline/player
cp website/mario_paintbox_samples.js offline/player
cp website/nintaribox_samples.js offline/player



# cd offline

# mkdir samples -p