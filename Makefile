# Automatic variables (https://www.gnu.org/software/make/manual/html_node/Automatic-Variables.html)
# $@     Target  (e.g. dist/assets/css/main.css)
# $<     First prerequisite  (e.g. src/assets/scss/main.scss)
# $^     All prerequisites  (e.g. src/assets/scss/main.scss src/assets/scss/_module.scss ...)
# $(@D)  The directory part of the target  (e.g. src/assets/scss)

BIN = node_modules/.bin

dist: dist/index.html \
	dist/assets/js/index.js \
	dist/assets/css/leaflet.css \
	dist/assets/css/skeleton.css \
	dist/assets/css/normalize.css

dist/%.html: src/%.html
	mkdir -p $(@D)
	cp $< $@

dist/assets/js/%.js: src/assets/js/%.jsx
	mkdir -p $(@D)
	$(BIN)/webpack -p

dist/assets/css/%.css: src/assets/css/%.css
	mkdir -p $(@D)
	cp $< $@

setup:
	npm install

.PHONY: setup
