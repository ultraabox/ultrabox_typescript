mkdir to_deploy -p
mkdir to_deploy/player -p
mkdir to_deploy/theme_resources -p

cp website/beepbox_editor.min.js to_deploy/
# TODO: see if something can be done about the bugs the service worker causes
# cp website/service_worker.js to_deploy/

cp website/drumsamples.js to_deploy/
cp website/kirby_samples.js to_deploy/
cp website/samples.js to_deploy/
cp website/samples2.js to_deploy/
cp website/samples3.js to_deploy/
cp website/wario_samples.js to_deploy/
cp website/mario_paintbox_samples.js to_deploy/
cp website/nintaribox_samples.js to_deploy/

cp website/drumsamples.js to_deploy/player
cp website/kirby_samples.js to_deploy/player
cp website/samples.js to_deploy/player
cp website/samples2.js to_deploy/player
cp website/samples3.js to_deploy/player
cp website/wario_samples.js to_deploy/player
cp website/mario_paintbox_samples.js to_deploy/player
cp website/nintaribox_samples.js to_deploy/player

cp website/index.html to_deploy/
cp website/favicon.ico to_deploy/
cp website/icon_32.png to_deploy/
cp website/icon_maskable_192.png to_deploy/
cp website/404.html to_deploy/
cp website/404.html to_deploy/player/
cp website/credits.html to_deploy/
cp website/patch_notes.html to_deploy/
cp website/faq.html to_deploy/
cp website/sample_extractor.html to_deploy/
cp website/beepbox_synth.min.js to_deploy/
cp website/synth_example.html to_deploy/

cp website/player/* to_deploy/player/ -r
cp website/theme_resources/* to_deploy/theme_resources/ -r