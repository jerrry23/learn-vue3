/*
 * @Author: jerrry23 dixiqi@163.com
 * @Date: 2022-06-13 22:28:29
 * @LastEditors: jerrry23 dixiqi@163.com
 * @LastEditTime: 2022-06-13 22:45:53
 * @FilePath: \1.reactivity\script\dev.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

//  // minimist 可以解析命令行参数
const args = require('minimist')(process.argv.slice(2)); // minimist 可以解析命令行参数，非常好用，功能简单不复杂
const path = require('path')


const target = args._[0] || 'reactivity';

const format = args.f || 'global';
const entry = path.resolve(__dirname,`../packages/${target}/src/index.ts`);
const globalName = require(path.resolve(__dirname,`../packages/${target}/package.json`)).buildOptions?.name;
// iife 自执行函数 global  (function(){})()  增加一个全局变量
// cjs  commonjs 规范
// esm es6Module


// 输出的文件 

const outputFormat =  format.startsWith('global') ? 'iife': format === 'cjs' ? 'cjs': 'esm'

// 输出结果路径 
const outfile = path.resolve(__dirname,`../packages/${target}/dist/${target}.${format}.js`);

const {build} = require('esbuild');

build({
    entryPoints: [entry],
    outfile,
    bundle: true,
    sourcemap: true,
    format: outputFormat,
    globalName,
    platform: format === 'cjs' ? 'node' : 'browser',
    watch: { // 监控文件变化
        onRebuild(error) {
            if (!error) console.log(`rebuilt~~~~`)
        }
    }
}).then(() => {
    console.log('watching~~~')
})