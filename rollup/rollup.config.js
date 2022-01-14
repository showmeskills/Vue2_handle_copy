import path from "path";
import babel from "@babel/core";
import pluginutils from "rollup-pluginutils";
import { execSync } from "child_process"
import fs from "fs";
//import autoInstall from "@rollup/plugin-auto-install"
//1.构建的钩子 需要讲代码进行转化的一系列方法 await rollup(inputOptions)
//2.生成的钩子 写真实的文件，添加文件的内容，整理打包的资源，bundle.generate(outputOptions)
//3.关闭



function buildHooks(userOptions = {}){
    const { include, exclude } = userOptions
    const filter = pluginutils.createFilter(include, exclude)
    let input;
    const alias = Object.keys(userOptions?.alias || {});

    return {
        name:"rollup-plugin-build", //rollup 要求你需要配置一个名字 用来提示错误信息
        options(inputOptions){ // 用户配置的rollupconfig
            //这个钩子内 可以获取整个rollup的配置,但是我无法拿到整个所有插件执行完毕的配置信息
            //console.log(inputOptions)
            //这个钩子中可以做一些初始化工作
            //return{ }如果你返回是一个对象那么则就会替换调这个inputOptions
        },
        // 所有的插件的options执行完毕后 会调用buildStart, 这里通常做的事情是保留配置到插件自身
        buildStart(inputOptions){
            input = inputOptions.input;
            //rollup 重新打包 要求文件变化,而且是依赖的文件比那花了才会重新打包,可以添加某个文件 并且监听它的变化
            //this.addWatchFile("./src/sum.js")
        },
        resolveId(importee,importer){ // 引入的资源, alias 插件
            // console.log(importee)
            // console.log(importer)
            const char = importee.split('/')[0];
            if(alias.includes(char)){
                return importee.replace(char,userOptions?.alias[char])
            }
            // 如果你返回的路径不是 带 ./或者没 有. non-external
            // return false;如果resolveId的钩子中返回了false代码就不回向下执行了
        },
        resolveFileUrl({filename}){// 用的很少进行import.meta.url的替换
            return JSON.stringify(new URL('a/xx.html','http://www.zhufeng.com').href);
        },
        //非外部模块
        load(importee){ // 根据你给我的路径 可以返回文件中的内容/替换文件内容
            //例如我们引入的是xxx.jpg, xxx.svg 将内容生成到dist目录下 返回一个引入路径即可

            //根据路径返回对应的内容
            //统计功能 我们计算一共大了多少个文件..
            // let referenceId = this.emitFile({
            //     //html-webpack-plugin
            //     type:'asset',
            //     source:"<div></div>",
            //     fileName:"xx.html"
            // })
            if(importee.endsWith('index.js')){
                let referenceId = this.emitFile({
                    id: path.resolve(__dirname,"src/minus.js"),
                    type:'chunk'
                })
                //import.meta.ROLLUP_FILE_URL_id 是发射文件的路径
                return `export default import.meta.ROLLUP_FILE_URL_${referenceId}`
                //return "abc"
            }
        },
        async transform(code,filename){// 90% 的插件就靠这个东西 将代码进行转化rollup-plugin-label rollup-plugin-ts
            if(!filter(filename)) return;
            //将es6 转化成es5 代码 需要rollup配合babel来使用
            //@babel/core @babel/preset-env
            const config = babel.loadPartialConfig({filename});
            const transformOptions = config.options; // 获取到转化的选项
            let result =  await babel.transformSync(code,{
                ...transformOptions,
                caller:{
                    name:"@rollup/plugin-babel",
                    supportsStaticESM:true, // 不需要解析es模块，解析成require也没法用

                }
            });
            //内部将es6 转成 es5 -> babel.transform(@bable/preset-env)
            return result;
        },
        moduleParsed(moduleInfo){// ast语法树, 可以去修改
            //console.log(moduleInfo.ast)
        },
        resolveDynamicImport(id){ // 主要用来动态导入的, 动态模块的路径修改可以在此方法中进行

        },
        buildEnd(err){ //构建过程中出现异常会执行此函数，将错误信息传入

        }
    }
}

function autoInstall(){
    const commands = {
        npm:'npm install',
        yarn:'yarn add',
    }
    const manager = fs.existsSync("package-lock.json") ? 'npm' : 'yarn';
    const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname,'package.json'),'utf-8'))
    const cmd = commands[manager];
    const installed = Object.keys(pkg.dependencies || {});
    return {
        name:'auto-install',
        resolveId(importee,importer){
            if(!importer) return;
            if(importee[0] !== '.' && path.isAbsolute(importee)){// 第三方
                return
            }
            if(!installed.has(importee)){
                execSync(`${cmd} ${importee}`)
            }
        }
    }
}

export default {
    input:"./src/index.js",
    output:{
        //file:"dist/bundle.js"
        dir:path.resolve(__dirname,'dist')
    },
    plugins:[
        //1. 先写一个构建的插件，主要的核心就是转义代码 build hooks
        // build hooks
        buildHooks({
            alias:{
                '@':'./src'
            },
            include:/\*.js/g,
            exclude:/\*.txt/g
        }),//基本上所有的插件都是函数,rollup插件本质是一个对象
        //output generations
        autoInstall()
    ]
}
