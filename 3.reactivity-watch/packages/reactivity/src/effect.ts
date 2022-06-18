/*
 * @Author: jerrry23 dixiqi@163.com
 * @Date: 2022-06-15 20:55:45
 * @LastEditors: jerrry23 dixiqi@163.com
 * @LastEditTime: 2022-06-15 23:48:41
 * @FilePath: \learn-vue3\3.reactivity\packages\reactivity\src\effect.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

// 传入的必须是一个对象 ，否则就提示


export let activeEffect = undefined;
// 依赖收集的原理是 借助js是单线程的特点， 默认调用effect的时候会去调用proxy的get，此时让属性记住

export function effect(fn, options = {} as any) {

    // 将用户传递的函数编程响应式的effect
    const _effect = new ReactiveEffect(fn);
    
    _effect.run()
  
    
}

export class ReactiveEffect {
    public active = true;
    public parent = null;
    public deps = []; // effect中用了哪些属性，后续清理的时候要使用
    constructor(public fn,public scheduler?) { } // 你传递的fn我会帮你放到this上
    // effectScope 可以来实现让所有的effect停止
    run() {
        // 依赖收集  让熟悉和effect 产生关联
        
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
        this.fn()
    }
    stop() {
        if (this.active) {
            this.active = false;
            cleanEffect(this);
        }
    }
}