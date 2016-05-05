(function(window) {
  function Txn(map) {
    this._map = map;
    this._ins = {};
    this._del = {};
  }

  Txn.prototype = {
    has: function(k) {
      return !(k in this._del) && (k in this._ins || k in this._map);
    },
    get: function(k) {
      if (k in this._del) return undefined;
      if (k in this._ins) return this._ins[k];
      return this._map[k];
    },
    set: function(k, v) {
      this._ins[k] = v;
      delete this._del[k];
    },
    delete: function(k) {
      delete this._ins[k];
      this._del[k] = null;
    },
    commit: function() {
      var k;
      for (k in this._ins) this._map[k] = this._ins[k];
      for (k in this._del) delete this._map[k];
    }
  };

  function TxnMap(obj) {
    this._map = obj || {};
  }

  TxnMap.prototype = {
    has: function(k) { return k in this._map; },
    get: function(k) { return this._map[k]; },
    mut: function(f) { f(new Txn(this._map)); }
  };

  var wrapper = window.txnmap = function(obj) {
    return new TxnMap(obj);
  };
  wrapper.TxnMap = TxnMap;
  wrapper.Txn = Txn;
})(this);
