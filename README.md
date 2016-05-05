# txnmap.js

Transactional 'map' datastructure for JS. Basically ensures the
integrity of your data and allows you to 'rollback' changes,
and write code that doesn't worry about integrity.

```js
var map = txnmap();
map.mut(function(txn) {
    txn.set('key', 'value');
    assert(txn.get('key') === 'value');
    assert(!map.get('key'));
    txn.commit();
});
assert(map.get('key') === 'value');
```
