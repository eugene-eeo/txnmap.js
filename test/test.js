describe('txnmap', function() {
  describe('.get', function() {
    it('returns value of the entry', function() {
      var map = txnmap({
        key: 'value'
      });
      assert.equal(map.get('key'), 'value');
      assert.equal(map.get('k'), undefined);
    });
  });

  describe('.mut', function() {
    it('exposes a txn instance', function(done) {
      var map = txnmap();
      map.mut(function(t) {
        assert(t instanceof txnmap.Txn);
        done();
      });
    });

    it('can be used to mutate the map', function() {
      var map = txnmap();
      map.mut(function(t) {
        t.set('a', '1');
        t.set('b', '2');
        t.delete('b');
        t.commit();
      });
      assert.equal(map.get('a'), '1');
      assert.equal(map.get('b'), undefined);
    });

    it('does not commit when there is an error', function() {
      var map = txnmap();
      try {
        map.mut(function(t) {
          t.set('a', 'b');
          throw new Error;
        });
      } catch(_) {
        assert(!map.has('a'));
        return;
      }
      assert(false);
    });
  });

  describe('.has', function() {
    it('returns whether the key is in the map', function() {
      var map = txnmap({exists: undefined});
      assert.ok(map.has('exists'));
      assert.notOk(map.has('key'));
    });
  });
});
