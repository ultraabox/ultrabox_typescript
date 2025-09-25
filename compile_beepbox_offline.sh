#!/bin/bash
set -e

npm run deploy-files

# Compile editor/main.ts into build/editor/main.js and dependencies
npx tsc

# Combine build/editor/main.js and dependencies into to_deploy/beepbox_editor.min.js
npx rollup build/editor/main.js \
	--file to_deploy/beepbox_editor.min.js \
	--format iife \
	--output.name beepbox \
	--context exports \
	--plugin rollup-plugin-sourcemaps \
	--plugin @rollup/plugin-node-resolve

# Minify to_deploy/beepbox_editor.min.js into to_deploy/beepbox_editor.min.js
npx terser \
	to_deploy/beepbox_editor.min.js \
	-o to_deploy/beepbox_editor.min.js \
	--compress \
    --define OFFLINE=true \
	--mangle \
	--mangle-props regex="/^_.+/;"

# Compile player/main.ts into build/player/main.js and dependencies
npx tsc -p tsconfig_player.json

# Combine build/player/main.js and dependencies into to_deploy/player/beepbox_player.min..js
npx rollup build/player/main.js \
	--file to_deploy/player/beepbox_player.min.js \
	--format iife \
	--output.name beepbox \
	--context exports \
	--plugin rollup-plugin-sourcemaps \
	--plugin @rollup/plugin-node-resolve

# Minify to_deploy/player/beepbox_player.min.js into to_deploy/player/beepbox_player.min.js
npx terser \
	to_deploy/player/beepbox_player.min.js \
	-o to_deploy/player/beepbox_player.min.js \
	--compress \
    --define OFFLINE=true \
	--mangle \
	--mangle-props regex="/^_.+/;"

cp website/offline/icon.ico to_deploy/
cp website/offline/icon.png to_deploy/
cp website/offline/icon.ico to_deploy/
cp website/offline/main.js to_deploy/
cp website/offline/preload.js to_deploy/
cp website/offline/3JnySDDxiSz36j6yGQ.woff2 to_deploy/
cp website/offline/jquery-3.4.1.min.js to_deploy/
cp website/offline/select2.min.css to_deploy/
cp website/offline/select2.min.js to_deploy/
cp website/offline/index.html to_deploy/
cp package.json to_deploy/