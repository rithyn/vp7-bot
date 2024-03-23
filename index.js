var merce = merce || {};
merce.scope = {};
merce.createTemplateTagFirstArg = function(a) {
  return a.raw = a;
};
merce.createTemplateTagFirstArgWithRaw = function(a, b) {
  a.raw = b;
  return a;
};
merce.arrayIteratorImpl = function(a) {
  var b = 0;
  return function() {
    return b < a.length ? {done:!1, value:a[b++]} : {done:!0};
  };
};
merce.arrayIterator = function(a) {
  return {next:merce.arrayIteratorImpl(a)};
};
merce.makeIterator = function(a) {
  var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  if (b) {
    return b.call(a);
  }
  if ("number" == typeof a.length) {
    return merce.arrayIterator(a);
  }
  throw Error(String(a) + " is not an iterable or ArrayLike");
};
merce.ASSUME_ES5 = !1;
merce.ASSUME_NO_NATIVE_MAP = !1;
merce.ASSUME_NO_NATIVE_SET = !1;
merce.SIMPLE_FROUND_POLYFILL = !1;
merce.ISOLATE_POLYFILLS = !1;
merce.FORCE_POLYFILL_PROMISE = !1;
merce.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
merce.defineProperty = merce.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
  if (a == Array.prototype || a == Object.prototype) {
    return a;
  }
  a[b] = c.value;
  return a;
};
merce.getGlobal = function(a) {
  a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
  for (var b = 0; b < a.length; ++b) {
    var c = a[b];
    if (c && c.Math == Math) {
      return c;
    }
  }
  throw Error("Cannot find global object");
};
merce.global = merce.getGlobal(this);
merce.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof Symbol("x");
merce.TRUST_ES6_POLYFILLS = !merce.ISOLATE_POLYFILLS || merce.IS_SYMBOL_NATIVE;
merce.polyfills = {};
merce.propertyToPolyfillSymbol = {};
merce.POLYFILL_PREFIX = "$jscp$";
var merce$lookupPolyfilledValue = function(a, b, c) {
  if (!c || null != a) {
    c = merce.propertyToPolyfillSymbol[b];
    if (null == c) {
      return a[b];
    }
    c = a[c];
    return void 0 !== c ? c : a[b];
  }
};
merce.polyfill = function(a, b, c, d) {
  b && (merce.ISOLATE_POLYFILLS ? merce.polyfillIsolated(a, b, c, d) : merce.polyfillUnisolated(a, b, c, d));
};
merce.polyfillUnisolated = function(a, b, c, d) {
  c = merce.global;
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
  b != d && null != b && merce.defineProperty(c, a, {configurable:!0, writable:!0, value:b});
};
merce.polyfillIsolated = function(a, b, c, d) {
  var e = a.split(".");
  a = 1 === e.length;
  d = e[0];
  d = !a && d in merce.polyfills ? merce.polyfills : merce.global;
  for (var f = 0; f < e.length - 1; f++) {
    var h = e[f];
    if (!(h in d)) {
      return;
    }
    d = d[h];
  }
  e = e[e.length - 1];
  c = merce.IS_SYMBOL_NATIVE && "es6" === c ? d[e] : null;
  b = b(c);
  null != b && (a ? merce.defineProperty(merce.polyfills, e, {configurable:!0, writable:!0, value:b}) : b !== c && (void 0 === merce.propertyToPolyfillSymbol[e] && (c = 1E9 * Math.random() >>> 0, merce.propertyToPolyfillSymbol[e] = merce.IS_SYMBOL_NATIVE ? merce.global.Symbol(e) : merce.POLYFILL_PREFIX + c + "$" + e), merce.defineProperty(d, merce.propertyToPolyfillSymbol[e], {configurable:!0, writable:!0, value:b})));
};
merce.underscoreProtoCanBeSet = function() {
  var a = {a:!0}, b = {};
  try {
    return b.__proto__ = a, b.a;
  } catch (c) {
  }
  return !1;
};
merce.setPrototypeOf = merce.TRUST_ES6_POLYFILLS && "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : merce.underscoreProtoCanBeSet() ? function(a, b) {
  a.__proto__ = b;
  if (a.__proto__ !== b) {
    throw new TypeError(a + " is not extensible");
  }
  return a;
} : null;
merce.generator = {};
merce.generator.ensureIteratorResultIsObject_ = function(a) {
  if (!(a instanceof Object)) {
    throw new TypeError("Iterator result " + a + " is not an object");
  }
};
merce.generator.Context = function() {
  this.isRunning_ = !1;
  this.yieldAllIterator_ = null;
  this.yieldResult = void 0;
  this.nextAddress = 1;
  this.finallyAddress_ = this.catchAddress_ = 0;
  this.finallyContexts_ = this.abruptCompletion_ = null;
};
merce.generator.Context.prototype.start_ = function() {
  if (this.isRunning_) {
    throw new TypeError("Generator is already running");
  }
  this.isRunning_ = !0;
};
merce.generator.Context.prototype.stop_ = function() {
  this.isRunning_ = !1;
};
merce.generator.Context.prototype.jumpToErrorHandler_ = function() {
  this.nextAddress = this.catchAddress_ || this.finallyAddress_;
};
merce.generator.Context.prototype.next_ = function(a) {
  this.yieldResult = a;
};
merce.generator.Context.prototype.throw_ = function(a) {
  this.abruptCompletion_ = {exception:a, isException:!0};
  this.jumpToErrorHandler_();
};
merce.generator.Context.prototype["return"] = function(a) {
  this.abruptCompletion_ = {"return":a};
  this.nextAddress = this.finallyAddress_;
};
merce.generator.Context.prototype.jumpThroughFinallyBlocks = function(a) {
  this.abruptCompletion_ = {jumpTo:a};
  this.nextAddress = this.finallyAddress_;
};
merce.generator.Context.prototype.yield = function(a, b) {
  this.nextAddress = b;
  return {value:a};
};
merce.generator.Context.prototype.yieldAll = function(a, b) {
  var c = merce.makeIterator(a), d = c.next();
  merce.generator.ensureIteratorResultIsObject_(d);
  if (d.done) {
    this.yieldResult = d.value, this.nextAddress = b;
  } else {
    return this.yieldAllIterator_ = c, this.yield(d.value, b);
  }
};
merce.generator.Context.prototype.jumpTo = function(a) {
  this.nextAddress = a;
};
merce.generator.Context.prototype.jumpToEnd = function() {
  this.nextAddress = 0;
};
merce.generator.Context.prototype.setCatchFinallyBlocks = function(a, b) {
  this.catchAddress_ = a;
  void 0 != b && (this.finallyAddress_ = b);
};
merce.generator.Context.prototype.setFinallyBlock = function(a) {
  this.catchAddress_ = 0;
  this.finallyAddress_ = a || 0;
};
merce.generator.Context.prototype.leaveTryBlock = function(a, b) {
  this.nextAddress = a;
  this.catchAddress_ = b || 0;
};
merce.generator.Context.prototype.enterCatchBlock = function(a) {
  this.catchAddress_ = a || 0;
  a = this.abruptCompletion_.exception;
  this.abruptCompletion_ = null;
  return a;
};
merce.generator.Context.prototype.enterFinallyBlock = function(a, b, c) {
  c ? this.finallyContexts_[c] = this.abruptCompletion_ : this.finallyContexts_ = [this.abruptCompletion_];
  this.catchAddress_ = a || 0;
  this.finallyAddress_ = b || 0;
};
merce.generator.Context.prototype.leaveFinallyBlock = function(a, b) {
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
merce.generator.Context.prototype.forIn = function(a) {
  return new merce.generator.Context.PropertyIterator(a);
};
merce.generator.Context.PropertyIterator = function(a) {
  this.object_ = a;
  this.properties_ = [];
  for (var b in a) {
    this.properties_.push(b);
  }
  this.properties_.reverse();
};
merce.generator.Context.PropertyIterator.prototype.getNext = function() {
  for (; 0 < this.properties_.length;) {
    var a = this.properties_.pop();
    if (a in this.object_) {
      return a;
    }
  }
  return null;
};
merce.generator.Engine_ = function(a) {
  this.context_ = new merce.generator.Context();
  this.program_ = a;
};
merce.generator.Engine_.prototype.next_ = function(a) {
  this.context_.start_();
  if (this.context_.yieldAllIterator_) {
    return this.yieldAllStep_(this.context_.yieldAllIterator_.next, a, this.context_.next_);
  }
  this.context_.next_(a);
  return this.nextStep_();
};
merce.generator.Engine_.prototype.return_ = function(a) {
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
merce.generator.Engine_.prototype.throw_ = function(a) {
  this.context_.start_();
  if (this.context_.yieldAllIterator_) {
    return this.yieldAllStep_(this.context_.yieldAllIterator_["throw"], a, this.context_.next_);
  }
  this.context_.throw_(a);
  return this.nextStep_();
};
merce.generator.Engine_.prototype.yieldAllStep_ = function(a, b, c) {
  try {
    var d = a.call(this.context_.yieldAllIterator_, b);
    merce.generator.ensureIteratorResultIsObject_(d);
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
merce.generator.Engine_.prototype.nextStep_ = function() {
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
merce.generator.Generator_ = function(a) {
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
merce.generator.createGenerator = function(a, b) {
  var c = new merce.generator.Generator_(new merce.generator.Engine_(b));
  merce.setPrototypeOf && a.prototype && merce.setPrototypeOf(c, a.prototype);
  return c;
};
merce.asyncExecutePromiseGenerator = function(a) {
  function b(d) {
    return a.next(d);
  }
  function c(d) {
    return a["throw"](d);
  }
  return new Promise(function(d, e) {
    function f(h) {
      h.done ? d(h.value) : Promise.resolve(h.value).then(b, c).then(f, e);
    }
    f(a.next());
  });
};
merce.asyncExecutePromiseGeneratorFunction = function(a) {
  return merce.asyncExecutePromiseGenerator(a());
};
merce.asyncExecutePromiseGeneratorProgram = function(a) {
  return merce.asyncExecutePromiseGenerator(new merce.generator.Generator_(new merce.generator.Engine_(a)));
};
console.log("\u001b[30m", "[" + (new Date()).toLocaleString() + "] \u01acD\u042f\u219dBOT | \u00a9\ufe0f 2023 - 2024 - \u20ae\u2c67\u0246 \u0110\u0246V\u0141\u2c60\u2019\u20b4 \u2c64\u0246J\u0246\u20b5\u20ae\u20b4");
var fs = require("node:fs"), path = require("node:path"), merce$destructuring$var0 = require("discord.js"), Client = merce$destructuring$var0.Client, Collection = merce$destructuring$var0.Collection, Events = merce$destructuring$var0.Events, GatewayIntentBits = merce$destructuring$var0.GatewayIntentBits, ActivityType = merce$destructuring$var0.ActivityType, Activity = merce$destructuring$var0.Activity, RichPresenceAssets = merce$destructuring$var0.RichPresenceAssets, merce$destructuring$var1 = 
require("./config.json"), token = merce$destructuring$var1.token, logs = require("./logs.js"), config = require('./config.json');
function log(a, b) {
  "error" == b && console.error("\u001b[31m", "[" + (new Date()).toLocaleString() + "] [ERROR] " + a);
  "warn" == b && console.warn("\u001b[33m", "[" + (new Date()).toLocaleString() + "] [WARN] " + a);
  "info" == b && console.info("\u001b[32m", "[" + (new Date()).toLocaleString() + "] [INFO] " + a);
  "log" == b && console.log("\u001b[34m", "[" + (new Date()).toLocaleString() + "] [LOG] " + a);
}
var client = new Client({intents:[GatewayIntentBits.Guilds]});
log("Please Wait ...", "log");
client.cooldowns = new Collection();
client.commands = new Collection();
for (var foldersPath = path.join(__dirname, "commands"), commandFolders = fs.readdirSync(foldersPath), merce$iter$2 = merce.makeIterator(commandFolders), merce$key$folder = merce$iter$2.next(); !merce$key$folder.done; merce$key$folder = merce$iter$2.next()) {
  for (var folder = merce$key$folder.value, commandsPath = path.join(foldersPath, folder), commandFiles = fs.readdirSync(commandsPath).filter(function(a) {
    return a.endsWith(".js");
  }), merce$iter$1 = merce.makeIterator(commandFiles), merce$key$file = merce$iter$1.next(); !merce$key$file.done; merce$key$file = merce$iter$1.next()) {
    var filemerce$1 = merce$key$file.value, filePath = path.join(commandsPath, filemerce$1), command = require(filePath);
    "data" in command && "execute" in command ? client.commands.set(command.data.name, command) : log("The command at " + filePath + ' is missing a required "data" or "execute" property.', "warn");
  }
}
client.once(Events.ClientReady, function(a) {
  log("Ready! Logged in as " + a.user.tag, "log");
  log("Client ID: " + a.user.id, "info");
  log("Client Version: " + a.version, "info");
  log("Client Ping: " + a.ws.ping + "ms", "info");
  log("Client Guilds: " + a.guilds.cache.size, "info");
  log("Client Channels: " + a.channels.cache.size, "info");
  log("Client Users: " + a.users.cache.size, "info");
  client.user.setPresence({activities:[{name:config.presence.name, type:ActivityType.Streaming, url:config.presence.url}]});
  log("Presence sucessfully started !", "log");
});
client.on(Events.InteractionCreate, function(a) {
  var b, c, d, e, f, h, l, m, n, k;
  return merce.asyncExecutePromiseGeneratorProgram(function(g) {
    switch(g.nextAddress) {
      case 1:
        if (!a.isChatInputCommand()) {
          return g["return"]();
        }
        b = client.commands.get(a.commandName);
        if (!b) {
          return console.error("No command matching " + a.commandName + " was found."), g["return"]();
        }
        c = a.client;
        d = c.cooldowns;
        d.has(b.data.name) || d.set(b.data.name, new Collection());
        e = Date.now();
        f = d.get(b.data.name);
        l = 1000 * (null != (h = b.cooldown) ? h : 3);
        if (f.has(a.user.id) && (m = f.get(a.user.id) + l, e < m)) {
          return n = Math.round(m / 1000), g["return"](a.reply({content:"Please wait, you are on a cooldown for `" + b.data.name + "`. You can use it again <t:" + n + ":R>.", ephemeral:!0}));
        }
        f.set(a.user.id, e);
        setTimeout(function() {
          return f["delete"](a.user.id);
        }, l);
        g.setCatchFinallyBlocks(2);
        return g.yield(b.execute(a), 4);
      case 4:
        g.leaveTryBlock(0);
        break;
      case 2:
        k = g.enterCatchBlock();
        if ("TypeError: Cannot read properties of undefined (reading 'custom')" != k) {
          g.jumpTo(5);
          break;
        }
        return g.yield(a.reply({content:"There was an error while executing this command!\nError : `StarblastAPI : Player not found.`", ephemeral: false}), 6);
      case 6:
        return g["return"]();
      case 5:
        return log(k, "error"), console.error(k), a.replied || a.deferred ? g.yield(a.followUp({content:"There was an error while executing this command!\nError : `" + k + "`", ephemeral:!0}), 0) : g.yield(a.reply({content:"There was an error while executing this command!\nError : `" + k + "`", ephemeral:!0}), 0);
    }
  });
});
client.login(token);
