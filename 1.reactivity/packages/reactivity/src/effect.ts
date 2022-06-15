/*
 * @Author: jerrry23 dixiqi@163.com
 * @Date: 2022-06-13 23:08:18
 * @LastEditors: jerrry23 dixiqi@163.com
 * @LastEditTime: 2022-06-15 10:48:42
 * @FilePath: \1.reactivity\packages\reactivity\src\effect.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

export let activeEffect = undefined;
export function effect(fn, options = {} as any) {
    const _effect = new ReactiveEffect(fn)
    _effect.run()
}

export class ReactiveEffect {
    public active  = true ;
    public parent = null;
    constructor(public fn){} 
    // public fn 相当于将fn 放到this上
    
    run() {

        try {
            this.parent =  activeEffect
            activeEffect=this
           
            // 进行依赖收集 ，让属性与effect 进行关联 
            this.fn()// 去对应的proxy上面取值？ 咋关联呢 ？  属性与当前的effect进行关联   
            
        }finally{
            activeEffect=  this.parent  
            this.parent =  null
        }
       
    }

}

export function track(target, key) {
    // if (activeEffect) {
    //     // 这里搞依赖收集
        
    // }
}


