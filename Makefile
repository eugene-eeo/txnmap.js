debug: build stats clean

build:
	cat txnmap.js     | uglifyjs -mc > txnmap.min.js
	cat txnmap.min.js | gzip > txnmap.min.js.gz

stats:
	cat txnmap.min.js    | wc -c
	cat txnmap.min.js.gz | wc -c

clean:
	rm txnmap.min.js
	rm txnmap.min.js.gz
