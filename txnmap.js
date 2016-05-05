(function(window) {
  function Txn(map) {
    this._map = map;
    this._ins = {};
    this._del = {};
  }

  Txn.prototype = {
    has: function(key) {
      return !(key in this._del) && (key in this._ins ||
                                     key in this._map);
    },
    get: function(key) {
      if (key in this._del) return undefined;
      if (key in this._ins) return this._ins[key];
      return this._map[key];
    },
    set: function(key, value) {
      this._ins[key] = value;
      delete this._del[key];
    },
    delete: function(key) {
      delete this._ins[key];
      this._del[key] = null;
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
