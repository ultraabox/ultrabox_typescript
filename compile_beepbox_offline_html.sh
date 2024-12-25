#!/bin/bash
set -e

# Combine the html and js into a single file for the html version
sed \
	-e '/INSERT_BEEPBOX_SOURCE_HERE/{r website/beepbox_editor.min.js' -e 'd' -e '}' \
	-e '/INSERT_JQUERY_MIN_JS_HERE/{r website/offline/jquery-3.4.1.min.js' -e 'd' -e '}' \
	-e '/INSERT_SELECT2_MIN_JS_HERE/{r website/offline/select2.min.js' -e 'd' -e '}' \
	-e '/INSERT_SELECT2_CSS_HERE/{r website/offline/select2.min.css' -e 'd' -e '}' \
	-e '/INSERT_KIRBYSAMPLES_SCRIPT_HERE/{r website/kirby_samples.js' -e 'd' -e '}' \
	-e '/INSERT_SAMPLES_SCRIPT_HERE/{r website/samples.js' -e 'd' -e '}' \
	-e '/INSERT_SAMPLES2_SCRIPT_HERE/{r website/samples2.js' -e 'd' -e '}' \
	-e '/INSERT_SAMPLES3_SCRIPT_HERE/{r website/samples3.js' -e 'd' -e '}' \
	-e '/INSERT_WARIOSAMPLES_SCRIPT_HERE/{r website/wario_samples.js' -e 'd' -e '}' \
	-e '/INSERT_MARIOPAINTBOXSAMPLES_SCRIPT_HERE/{r website/mario_paintbox_samples.js' -e 'd' -e '}' \
	-e '/INSERT_NINTARIBOXSAMPLES_SCRIPT_HERE/{r website/nintaribox_samples.js' -e 'd' -e '}' \
	website/ultrabox_offline_template.html \
	> to_deploy/ultrabox_offline_HTML.html