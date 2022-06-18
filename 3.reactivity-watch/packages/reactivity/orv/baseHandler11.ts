/*
 * @Author: jerrry23 dixiqi@163.com
 * @Date: 2022-06-15 10:56:39
 * @LastEditors: jerrry23 dixiqi@163.com
 * @LastEditTime: 2022-06-15 20:52:35
 * @FilePath: \learn-vue3\2.reactivity\packages\reactivity\src\baseHandler.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { isObject } from "@vue/shared";
import { reactive } from "./reactive1";
import { track, trigger } from "./effect1";
export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive'
}
export const baseHandler  = {
    get(target,key,receiver){
        if(key === ReactiveFlags.IS_REACTIVE){
            return true
        }
        // 让当前的key 和 effect关联起来即可
        track(target,key);

        // lazy proxy  只有进行取值的时候才会处理  Vue 是一上来就会进行递归代理
        let res =  Reflect.get(target,key,receiver);

        if(isObject(res)){
            return reactive(res) 
        }
        return res
    },
    set(target,key,value,receiver){
        // 数据变化后，要根据属性找到对应的effect列表让其依次执行
        let oldValue = target[key]; // 获取目标的老值
        if(oldValue !== value ){// 更新
            let result = Reflect.set(target,key,value,receiver);;
            // 触发更新
            trigger(target,key,value);
            return result
        }
    }
}