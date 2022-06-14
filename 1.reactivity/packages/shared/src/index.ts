/*
 * @Author: jerrry23 dixiqi@163.com
 * @Date: 2022-06-13 21:41:14
 * @LastEditors: jerrry23 dixiqi@163.com
 * @LastEditTime: 2022-06-13 23:13:39
 * @FilePath: \1.reactivity\packages\shared\src\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const isObject = (value) =>{
    return typeof value === 'object' && value !== null
}
export const isFunction= (value) =>{
    return typeof value === 'function'
}