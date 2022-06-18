

export let activeEffect = undefined;
// 依赖收集的原理是 借助js是单线程的特点， 默认调用effect的时候会去调用proxy的get，此时让属性记住
// 依赖的effect，同理也让effect记住对应的属性
// 靠的是数据结构 weakMap : {map:{key:new Set()}}
// 稍后数据变化的时候 找到对应的map 通过属性出发set中effect
function cleanEffect(effect) {
    // 需要清理effect中存入属性中的set中 的effect 
    // 每次执行前都需要将effect只对应属性的set集合都清理掉  避免 对同一个effect即删除又添加
    // 属性中的set 依然存放effect
    let deps = effect.deps
    for (let i = 0; i < deps.length; i++) {
        deps[i].delete(effect)
    }
    effect.deps.length = 0;


}
export class ReactiveEffect {
    public active = true;
    public parent = null;
    public deps = []; // effect中用了哪些属性，后续清理的时候要使用
    constructor(public fn,public scheduler?) { } // 你传递的fn我会帮你放到this上
    // effectScope 可以来实现让所有的effect停止
    run() {
        // 依赖收集  让熟悉和effect 产生关联
        if (!this.active) {
            return this.fn();
        } else {
            try {
                this.parent = activeEffect
                activeEffect = this;
                cleanEffect(this); // vue2 和 vue3中都是要清理的 
                return this.fn(); // 去proxy对象上取值, 取之的时候 我要让这个熟悉 和当前的effect函数关联起来，稍后数据变化了 ，可以重新执行effect函数
            } finally {
                // 取消当前正在运行的effect
                activeEffect = this.parent;
                this.parent = null;
            }
        }
    }
    stop() {
        if (this.active) {
            this.active = false;
            cleanEffect(this);
        }
    }
}
// 哪个对象中的那个属性 对应的哪个effect  一个属性可以对应多个effect
// 外层用一个map {object: {name:[effect,effect],age:[effect,effect]}}
const targetMap = new WeakMap();
export function trigger(target, key, value) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        return; // 属性没有依赖任何的effect
    }
    let effects = depsMap.get(key)
    triggerEffects(effects)
}
export function triggerEffects(effects){
    if (effects) {
        effects = new Set(effects)// 避免对effect既添加又删除，所以先拷贝一份 ，然后删除
        effects.forEach(effect => {
            // 
            if (effect !== activeEffect) { // 保证要执行的effect不是当前的effect
                if(effect.scheduler){
                    effect.scheduler(); // 可以提供一个调度函数，用户实现自己的逻辑
                }else{
                    effect.run(); // 数据变化了，找到对应的effect 重新执行，
                }
            }
        });
    }
}
// 哪个属性对应哪个effct ,一个属性对应多个effct 

// 利用map结构进行存储  {object,{name:[effct1,effct2],age:[effct2,effct3]}}
export function track(target, key) {

    // 只有当activeEffect有值的时候，才会收集依赖   就是不需要进行响应式处理的不需要收集
    if (activeEffect) {
        // 这里进行依赖收集
        let depsMap = targetMap.get(target);
        if (!depsMap) {  

            // 存储外层依赖关系 ，利用set添加
            targetMap.set(target, (depsMap = new Map()))
        }
        let deps = depsMap.get(key);
        if (!deps) {
            depsMap.set(key, (deps = new Set()))
        }
        trackEffects(deps)
    }
    // 让属性记录所用到的effect是谁， 
    // TODO:哪个effect对应了哪些属性  ,与Vue2中，属性记住effct 同时effct 也必须记住属性
}

export function trackEffects(deps){
    let shouldTrack = !deps.has(activeEffect);
    if (shouldTrack) {
        deps.add(activeEffect);
        // 等等 deps 的作用就是让effect 记录用到了哪些属性
        activeEffect.deps.push(deps); // 放的是set   // effct 记住 属性
    }
}

export function effect(fn, options = {} as any) {

    // 将用户传递的函数编程响应式的effect
    const _effect = new ReactiveEffect(fn,options.scheduler);
    
    _effect.run()
    // 更改runner中的this
    const runner = _effect.run.bind(_effect); // 将当前的this绑定为当前的effect
    runner.effect = _effect; // 暴露effect的实例
    return runner// 用户可以手动调用runner重新执行
}




// activeEffect = e2;
// effect(()=>{ // e1  e1.parent = null
//     state.name;  // name = e1
//     effect(()=>{ // e2  e2.parent = e1;
//         state.age; // age = e2
//     })
//     // activeeffect = e2.parent
//     state.address; // address = e1
// })


