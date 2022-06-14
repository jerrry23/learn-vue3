var VueReactivity = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/reactivity/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    effect: () => effect,
    reactive: () => reactive
  });

  // packages/reactivity/src/effect.ts
  function effect(fn, options = {}) {
  }

  // packages/shared/src/index.ts
  var isObject = (value) => {
    return typeof value === "object" && value !== null;
  };

  // packages/reactivity/src/reactive.ts
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  function reactive(target) {
    if (!isObject(target)) {
      return target;
    }
    if (target["__v_isReactive" /* IS_REACTIVE */]) {
      return target;
    }
    const existing = reactiveMap.get(target);
    if (existing) {
      return existing;
    }
    const proxy2 = new Proxy(target, {
      get(target2, key, receiver) {
        console.log("\u8FD9\u91CC\u53EF\u4EE5\u8BB0\u5F55\u8FD9\u4E2A\u5C5E\u6027\u4F7F\u7528\u4E86\u54EA\u4E2Aeffect");
        if (key === "__v_isReactive" /* IS_REACTIVE */) {
          return true;
        }
        return Reflect.get(target2, key, receiver);
      },
      set(target2, key, value, receiver) {
        console.log("\u8FD9\u91CC\u53EF\u4EE5\u901A\u77E5effect\u91CD\u65B0\u6267\u884C");
        target2[key] = value;
        return Reflect.set(target2, key, value, receiver);
      }
    });
    reactiveMap.set(target, proxy2);
    return proxy2;
  }
  var person = {
    name: "zs",
    get alisaName() {
      return this.name + "ss";
    }
  };
  console.log(person.alisaName);
  var proxy = new Proxy(person, {
    get(target, key, receiver) {
      console.log("\u8FD9\u91CC\u53EF\u4EE5\u8BB0\u5F55\u8FD9\u4E2A\u5C5E\u6027\u4F7F\u7528\u4E86\u54EA\u4E2Aeffect");
      return target[key];
    },
    set(target, key, value, receiver) {
      console.log("\u8FD9\u91CC\u53EF\u4EE5\u901A\u77E5effect\u91CD\u65B0\u6267\u884C");
      target[key] = value;
      return true;
    }
  });
  console.log(proxy.name);
  console.log(proxy.alisaName);
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=reactivity.global.js.map
