var radar = radar || {};
radar.scope = {};
radar.createTemplateTagFirstArg = function(a) {
  return a.raw = a;
};
radar.createTemplateTagFirstArgWithRaw = function(a, b) {
  a.raw = b;
  return a;
};
radar.ASSUME_ES5 = !1;
radar.ASSUME_NO_NATIVE_MAP = !1;
radar.ASSUME_NO_NATIVE_SET = !1;
radar.SIMPLE_FROUND_POLYFILL = !1;
radar.ISOLATE_POLYFILLS = !1;
radar.FORCE_POLYFILL_PROMISE = !1;
radar.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
radar.defineProperty = radar.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
  if (a == Array.prototype || a == Object.prototype) {
    return a;
  }
  a[b] = c.value;
  return a;
};
radar.getGlobal = function(a) {
  a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
  for (var b = 0; b < a.length; ++b) {
    var c = a[b];
    if (c && c.Math == Math) {
      return c;
    }
  }
  throw Error("Cannot find global object");
};
radar.global = radar.getGlobal(this);
radar.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof Symbol("x");
radar.TRUST_ES6_POLYFILLS = !radar.ISOLATE_POLYFILLS || radar.IS_SYMBOL_NATIVE;
radar.polyfills = {};
radar.propertyToPolyfillSymbol = {};
radar.POLYFILL_PREFIX = "$jscp$";
var radar$lookupPolyfilledValue = function(a, b, c) {
  if (!c || null != a) {
    c = radar.propertyToPolyfillSymbol[b];
    if (null == c) {
      return a[b];
    }
    c = a[c];
    return void 0 !== c ? c : a[b];
  }
};
radar.polyfill = function(a, b, c, d) {
  b && (radar.ISOLATE_POLYFILLS ? radar.polyfillIsolated(a, b, c, d) : radar.polyfillUnisolated(a, b, c, d));
};
radar.polyfillUnisolated = function(a, b, c, d) {
  c = radar.global;
  a = a.split(".");
  for (d = 0; d < a.length - 1; d++) {
    var e = a[d];
    if (!(e in c)) {
      return;
    }
    c = c[e];
  }
  a = a[a.length - 1];
  d = c[a];
  b = b(d);
  b != d && null != b && radar.defineProperty(c, a, {configurable:!0, writable:!0, value:b});
};
radar.polyfillIsolated = function(a, b, c, d) {
  var e = a.split(".");
  a = 1 === e.length;
  d = e[0];
  d = !a && d in radar.polyfills ? radar.polyfills : radar.global;
  for (var f = 0; f < e.length - 1; f++) {
    var g = e[f];
    if (!(g in d)) {
      return;
    }
    d = d[g];
  }
  e = e[e.length - 1];
  c = radar.IS_SYMBOL_NATIVE && "es6" === c ? d[e] : null;
  b = b(c);
  null != b && (a ? radar.defineProperty(radar.polyfills, e, {configurable:!0, writable:!0, value:b}) : b !== c && (void 0 === radar.propertyToPolyfillSymbol[e] && (c = 1E9 * Math.random() >>> 0, radar.propertyToPolyfillSymbol[e] = radar.IS_SYMBOL_NATIVE ? radar.global.Symbol(e) : radar.POLYFILL_PREFIX + c + "$" + e), radar.defineProperty(d, radar.propertyToPolyfillSymbol[e], {configurable:!0, writable:!0, value:b})));
};
radar.underscoreProtoCanBeSet = function() {
  var a = {a:!0}, b = {};
  try {
    return b.__proto__ = a, b.a;
  } catch (c) {
  }
  return !1;
};
radar.setPrototypeOf = radar.TRUST_ES6_POLYFILLS && "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : radar.underscoreProtoCanBeSet() ? function(a, b) {
  a.__proto__ = b;
  if (a.__proto__ !== b) {
    throw new TypeError(a + " is not extensible");
  }
  return a;
} : null;
radar.arrayIteratorImpl = function(a) {
  var b = 0;
  return function() {
    return b < a.length ? {done:!1, value:a[b++]} : {done:!0};
  };
};
radar.arrayIterator = function(a) {
  return {next:radar.arrayIteratorImpl(a)};
};
radar.makeIterator = function(a) {
  var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  if (b) {
    return b.call(a);
  }
  if ("number" == typeof a.length) {
    return radar.arrayIterator(a);
  }
  throw Error(String(a) + " is not an iterable or ArrayLike");
};
radar.generator = {};
radar.generator.ensureIteratorResultIsObject_ = function(a) {
  if (!(a instanceof Object)) {
    throw new TypeError("Iterator result " + a + " is not an object");
  }
};
radar.generator.Context = function() {
  this.isRunning_ = !1;
  this.yieldAllIterator_ = null;
  this.yieldResult = void 0;
  this.nextAddress = 1;
  this.finallyAddress_ = this.catchAddress_ = 0;
  this.finallyContexts_ = this.abruptCompletion_ = null;
};
radar.generator.Context.prototype.start_ = function() {
  if (this.isRunning_) {
    throw new TypeError("Generator is already running");
  }
  this.isRunning_ = !0;
};
radar.generator.Context.prototype.stop_ = function() {
  this.isRunning_ = !1;
};
radar.generator.Context.prototype.jumpToErrorHandler_ = function() {
  this.nextAddress = this.catchAddress_ || this.finallyAddress_;
};
radar.generator.Context.prototype.next_ = function(a) {
  this.yieldResult = a;
};
radar.generator.Context.prototype.throw_ = function(a) {
  this.abruptCompletion_ = {exception:a, isException:!0};
  this.jumpToErrorHandler_();
};
radar.generator.Context.prototype["return"] = function(a) {
  this.abruptCompletion_ = {"return":a};
  this.nextAddress = this.finallyAddress_;
};
radar.generator.Context.prototype.jumpThroughFinallyBlocks = function(a) {
  this.abruptCompletion_ = {jumpTo:a};
  this.nextAddress = this.finallyAddress_;
};
radar.generator.Context.prototype.yield = function(a, b) {
  this.nextAddress = b;
  return {value:a};
};
radar.generator.Context.prototype.yieldAll = function(a, b) {
  var c = radar.makeIterator(a), d = c.next();
  radar.generator.ensureIteratorResultIsObject_(d);
  if (d.done) {
    this.yieldResult = d.value, this.nextAddress = b;
  } else {
    return this.yieldAllIterator_ = c, this.yield(d.value, b);
  }
};
radar.generator.Context.prototype.jumpTo = function(a) {
  this.nextAddress = a;
};
radar.generator.Context.prototype.jumpToEnd = function() {
  this.nextAddress = 0;
};
radar.generator.Context.prototype.setCatchFinallyBlocks = function(a, b) {
  this.catchAddress_ = a;
  void 0 != b && (this.finallyAddress_ = b);
};
radar.generator.Context.prototype.setFinallyBlock = function(a) {
  this.catchAddress_ = 0;
  this.finallyAddress_ = a || 0;
};
radar.generator.Context.prototype.leaveTryBlock = function(a, b) {
  this.nextAddress = a;
  this.catchAddress_ = b || 0;
};
radar.generator.Context.prototype.enterCatchBlock = function(a) {
  this.catchAddress_ = a || 0;
  a = this.abruptCompletion_.exception;
  this.abruptCompletion_ = null;
  return a;
};
radar.generator.Context.prototype.enterFinallyBlock = function(a, b, c) {
  c ? this.finallyContexts_[c] = this.abruptCompletion_ : this.finallyContexts_ = [this.abruptCompletion_];
  this.catchAddress_ = a || 0;
  this.finallyAddress_ = b || 0;
};
radar.generator.Context.prototype.leaveFinallyBlock = function(a, b) {
  var c = this.finallyContexts_.splice(b || 0)[0];
  if (c = this.abruptCompletion_ = this.abruptCompletion_ || c) {
    if (c.isException) {
      return this.jumpToErrorHandler_();
    }
    void 0 != c.jumpTo && this.finallyAddress_ < c.jumpTo ? (this.nextAddress = c.jumpTo, this.abruptCompletion_ = null) : this.nextAddress = this.finallyAddress_;
  } else {
    this.nextAddress = a;
  }
};
radar.generator.Context.prototype.forIn = function(a) {
  return new radar.generator.Context.PropertyIterator(a);
};
radar.generator.Context.PropertyIterator = function(a) {
  this.object_ = a;
  this.properties_ = [];
  for (var b in a) {
    this.properties_.push(b);
  }
  this.properties_.reverse();
};
radar.generator.Context.PropertyIterator.prototype.getNext = function() {
  for (; 0 < this.properties_.length;) {
    var a = this.properties_.pop();
    if (a in this.object_) {
      return a;
    }
  }
  return null;
};
radar.generator.Engine_ = function(a) {
  this.context_ = new radar.generator.Context();
  this.program_ = a;
};
radar.generator.Engine_.prototype.next_ = function(a) {
  this.context_.start_();
  if (this.context_.yieldAllIterator_) {
    return this.yieldAllStep_(this.context_.yieldAllIterator_.next, a, this.context_.next_);
  }
  this.context_.next_(a);
  return this.nextStep_();
};
radar.generator.Engine_.prototype.return_ = function(a) {
  this.context_.start_();
  var b = this.context_.yieldAllIterator_;
  if (b) {
    return this.yieldAllStep_("return" in b ? b["return"] : function(c) {
      return {value:c, done:!0};
    }, a, this.context_["return"]);
  }
  this.context_["return"](a);
  return this.nextStep_();
};
radar.generator.Engine_.prototype.throw_ = function(a) {
  this.context_.start_();
  if (this.context_.yieldAllIterator_) {
    return this.yieldAllStep_(this.context_.yieldAllIterator_["throw"], a, this.context_.next_);
  }
  this.context_.throw_(a);
  return this.nextStep_();
};
radar.generator.Engine_.prototype.yieldAllStep_ = function(a, b, c) {
  try {
    var d = a.call(this.context_.yieldAllIterator_, b);
    radar.generator.ensureIteratorResultIsObject_(d);
    if (!d.done) {
      return this.context_.stop_(), d;
    }
    var e = d.value;
  } catch (f) {
    return this.context_.yieldAllIterator_ = null, this.context_.throw_(f), this.nextStep_();
  }
  this.context_.yieldAllIterator_ = null;
  c.call(this.context_, e);
  return this.nextStep_();
};
radar.generator.Engine_.prototype.nextStep_ = function() {
  for (; this.context_.nextAddress;) {
    try {
      var a = this.program_(this.context_);
      if (a) {
        return this.context_.stop_(), {value:a.value, done:!1};
      }
    } catch (b) {
      this.context_.yieldResult = void 0, this.context_.throw_(b);
    }
  }
  this.context_.stop_();
  if (this.context_.abruptCompletion_) {
    a = this.context_.abruptCompletion_;
    this.context_.abruptCompletion_ = null;
    if (a.isException) {
      throw a.exception;
    }
    return {value:a["return"], done:!0};
  }
  return {value:void 0, done:!0};
};
radar.generator.Generator_ = function(a) {
  this.next = function(b) {
    return a.next_(b);
  };
  this["throw"] = function(b) {
    return a.throw_(b);
  };
  this["return"] = function(b) {
    return a.return_(b);
  };
  this[Symbol.iterator] = function() {
    return this;
  };
};
radar.generator.createGenerator = function(a, b) {
  var c = new radar.generator.Generator_(new radar.generator.Engine_(b));
  radar.setPrototypeOf && a.prototype && radar.setPrototypeOf(c, a.prototype);
  return c;
};
radar.asyncExecutePromiseGenerator = function(a) {
  function b(d) {
    return a.next(d);
  }
  function c(d) {
    return a["throw"](d);
  }
  return new Promise(function(d, e) {
    function f(g) {
      g.done ? d(g.value) : Promise.resolve(g.value).then(b, c).then(f, e);
    }
    f(a.next());
  });
};
radar.asyncExecutePromiseGeneratorFunction = function(a) {
  return radar.asyncExecutePromiseGenerator(a());
};
radar.asyncExecutePromiseGeneratorProgram = function(a) {
  return radar.asyncExecutePromiseGenerator(new radar.generator.Generator_(new radar.generator.Engine_(a)));
};
var radar$destructuring$var0 = require("discord.js"), SlashCommandBuilder = radar$destructuring$var0.SlashCommandBuilder, EmbedBuilder = radar$destructuring$var0.EmbedBuilder, axios = require("axios"), log = require("../../logs.js"), config = require("../../config.json");
function search(a) {
  var b;
  return radar.asyncExecutePromiseGeneratorProgram(function(c) {
    if (1 == c.nextAddress) {
      return c.yield(axios.get("https://search.pixelmelt.dev/search/" + a), 2);
    }
    b = c.yieldResult;
    return c["return"](b.data);
  });
}
module.exports = {data:(new SlashCommandBuilder()).setName("search").setDescription("Search An Player").addStringOption(function(a) {
  return a.setName("keywords").setDescription("Keywords").setRequired(!0);
}), execute:function(a) {
  var b, c, d, e;
  return radar.asyncExecutePromiseGeneratorProgram(function(f) {
    if (1 == f.nextAddress) {
      return b = a.options.getString("keywords"), f.yield(search(b), 2);
    }
    c = f.yieldResult;
    d = null !== c["0"].custom ? "Yes" : "No";
    e = (new EmbedBuilder()).setAuthor({name:config.embeds.name, iconURL:config.embeds.logo}).setTitle("Search Result.").addFields({name:"Ingame Name :", value:"" + (c["0"].player_name || "No Name"), inline:!0}, {name:"ECP :", value:"" + (d || "No ECP"), inline:!0}, {name:"Score :", value:"" + (c["0"].score || "No Score"), inline:!0}, {name:"GameLink :", value:"" + (c["0"].gamelink || "No GameLink"), inline:!0}, 
    {name:"Id:", value:"" + (c["0"].id || "No ID"), inline:!0}).setThumbnail(config.embeds.logo).setColor("#f50000");
    a.reply({embeds:[e]});
    log("Command Search used by " + a.user.tag, "command");
    f.jumpToEnd();
  });
}};
