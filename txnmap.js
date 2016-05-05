(function(window) {
  function Txn(map) {
    this._m = map;
    this._i = {};  // Insertions
    this._d = {};  // Deletions
  }

  Txn.prototype = {
    has: function(k) {
      return !(k in this._d) && (k in this._i || k in this._m);
    },
    get: function(k) {
      if (k in this._d) return undefined;
      if (k in this._i) return this._i[k];
      return this._m[k];
    },
    set: function(k, v) {
      this._i[k] = v;
      delete this._d[k];
    },
    delete: function(k) {
      delete this._i[k];
      this._d[k] = null;
    },
    commit: function() {
      var k;
      for (k in this._i) this._m[k] = this._i[k];
      for (k in this._d) delete this._m[k];
    }
  };

  function TxnMap(obj) {
    this._m = obj || {};
  }

  TxnMap.prototype = {
    has: function(k) { return k in this._m; },
    get: function(k) { return this._m[k]; },
    mut: function(f) { f(new Txn(this._m)); }
  };

  var wrapper = window.txnmap = function(obj) {
    return new TxnMap(obj);
  };
  wrapper.TxnMap = TxnMap;
  wrapper.Txn = Txn;
})(this);
