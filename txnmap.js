(function(window) {
  function Txn(map) {
    this._map = map;
    this._ins = {};
    this._del = {};
  }

  Txn.prototype = {
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
      delete this._ins[key]
      this._del[key] = null;
    },
    commit: function() {
      for (var k in this._ins) this._map[k] = this._ins[k];
      for (var k in this._del) delete this._map[k];
    }
  };

  function TxnMap(obj) {
    this._map = obj || {};
  }

  TxnMap.prototype = {
    get: function(s) { return this._map[s]; },
    mut: function(f) { f(new Txn(this._map)); }
  };

  var wrapper = window.txnmap = function(obj) {
    return new TxnMap(obj);
  }
  wrapper.TxnMap = TxnMap;
  wrapper.Txn = Txn;
})(this);
