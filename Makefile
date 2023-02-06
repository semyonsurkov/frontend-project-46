gendiff:
	node src/index.js
install: 
	npm ci
publish: 
	npm publish --dry-run
lint: 
	npx eslint .
test:
	npx -n --experimental-vm-modules jest
test-coverage:
	npm test -- --coverage --coverageProvider=v8