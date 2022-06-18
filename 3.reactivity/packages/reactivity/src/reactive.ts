/*
 * @Author: jerrry23 dixiqi@163.com
 * @Date: 2022-06-15 20:54:14
 * @LastEditors: jerrry23 dixiqi@163.com
 * @LastEditTime: 2022-06-15 22:17:41
 * @FilePath: \learn-vue3\3.reactivity\packages\reactivity\src\reactive.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}
import { isObject } from "@vue/shared";
const reactiveMap = new WeakMap();// key必须是对象，弱引用
export function reactive(target){

    if(!isObject(target)) {
        // 只能操作对象 
        return false ;
    }
   
    if(target[ReactiveFlags.IS_REACTIVE]) {  // 这里执行的时候，还是会走 proxy的道理方法 
        // 传入的是代理过的对象 proxy  
        return  target
    }
    const existing = reactiveMap.get(target);
    console.log(existing)
    if(existing){
        console.log("===============")
        return existing
    }
    // 进行代理  并返回代理后的数据 
    const  proxy =  new Proxy(target,{
        get(target,key ,receiver) {
            console.log("代理key:" , key ,  "代理的对象是：" + target)
            if(key === ReactiveFlags.IS_REACTIVE){
                return true
            }
            return Reflect.get(target,key,receiver)
        },

        set(target,key ,value,receiver) {
            console.log("设置key :"  ,key  ,"代理的对象是：" +target)
            target[key] = value
            return Reflect.set(target,key ,value,receiver)
        } 
    })
    reactiveMap.set(target,proxy)
    return proxy;
}


