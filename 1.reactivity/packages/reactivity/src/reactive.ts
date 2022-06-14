/*
 * @Author: jerrry23 dixiqi@163.com
 * @Date: 2022-06-13 23:08:38
 * @LastEditors: jerrry23 dixiqi@163.com
 * @LastEditTime: 2022-06-14 22:47:24
 * @FilePath: \1.reactivity\packages\reactivity\src\reactive.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { isObject } from "@vue/shared";

const reactiveMap = new WeakMap();// key必须是对象，弱引用

export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}

export function reactive(target){
    if(!isObject(target)){
        return target
    }

    if(target[ReactiveFlags.IS_REACTIVE]){
        return target
    }

    const existing = reactiveMap.get(target);

    if(existing) {
        return  existing
    }

    /**1.代理过的对象继续代理就会有点问题
     *  == 当对象被代理过就不要再次进行代理了 
     *  =====使用proxy 要搭配Reflect来使用  obj -> proxy
             下次传入的是proxy了，去这个对象上取值可以命中proxy的get方法 
     * 
     */

    const proxy = new Proxy(target,{
        get(target,key,receiver){
            console.log('这里可以记录这个属性使用了哪个effect')
            if(key === ReactiveFlags.IS_REACTIVE) {  // 代理过 返回 TRUE  ==>   target[ReactiveFlags.IS_REACTIVE]  ==> 返回 target  
                return  true 
            }
            // return target[key]
            return Reflect.get(target,key,receiver)
        },
        set(target,key,value,receiver){
            console.log('这里可以通知effect重新执行')
            
            target[key] = value 
            
            //return true; 

            return Reflect.set(target,key,value,receiver);
        }
    });

    reactiveMap.set(target,proxy)
    return  proxy
}

let person ={
    name:'zs',
    get alisaName() {
        return this.name+'ss'
    }
}
console.log(person.alisaName) // zsss
const proxy = new Proxy(person,{
    get(target,key,receiver){
        console.log('这里可以记录这个属性使用了哪个effect')

        return target[key]
        // return Reflect.get(target,key,receiver)
    },
    set(target,key,value,receiver){
        console.log('这里可以通知effect重新执行')
        target[key] = value 
        return true; 

        //return Reflect.set(target,key,value,receiver);
    }
});

console.log(proxy.name)
console.log(proxy.alisaName) 