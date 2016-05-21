describe('Txn', function() {
  describe('.has', function() {
    var txn = new txnmap.Txn({k: 'v'});

    it('returns whether key is stored', function() {
      assert(txn.has('k'));
      assert(!txn.has('a'));
    });

    it('returns true for inserted keys', function() {
      txn.set('a', 'b');
      assert(txn.has('a'));
    });

    it('returns false for deleted keys', function() {
      txn.delete('a');
      assert(!txn.has('a'));
    });
  });

  describe('.get', function() {
    var txn = new txnmap.Txn({k: 'v'});

    it('can read from the original data', function() {
      assert.equal(txn.get('k'), 'v');
    });

    it('can read from inserted data', function() {
      txn.set('k', 'b');
      assert.equal(txn.get('k'), 'b');
    });

    it('ignores deleted data', function() {
      txn.delete('k');
      assert(!txn.has('k'));
    });
  });

  describe('.set', function() {
    var obj = {k: 1};
    var txn = new txnmap.Txn(obj);

    it('does not mutate the map', function() {
      txn.set('a', 'b');
      assert.deepEqual(obj, {k: 1});
    });

    it('overrides deletes', function() {
      txn.delete('k');
      txn.set('k', '2');
      assert.equal(txn.get('k'), '2');
      assert(txn.has('k'));
    });
  });

  describe('.delete', function() {
    var obj = {k: 1};
    var txn = new txnmap.Txn(obj);

    it('overrides inserts', function() {
      txn.set('a', 'b');
      txn.delete('a');
      assert(!txn.has('a'));
    });
  });

  describe('.commit', function() {
    it('applies the changes', function() {
      var obj = {};
      var txn = new txnmap.Txn(obj);

      txn.set('a', '1');
      txn.set('b', '2');
      txn.delete('b');
      txn.commit();

      assert.deepEqual(obj, {
        a: '1',
      });
    });
  });
});
