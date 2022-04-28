# @monado/cli
创建react应用的脚手架
## usage
```js
npx @monado/cli create <projectName>
```

# @monado/scripts
基于 webpack 的用于构建 react 应用的打包工具，支持 typescript、mdx、tailwindcss、postcss 等常用库

## usage
~~~shell
# 安装
npm install -D @monado/scripts

# 启动开发环境
npx monado-scripts start

# 启动打包
npx monado-scripts build
~~~

## 配置相关
### 打包入口
monado-scripts 会从项目文件夹下的`src`目录中按照优先级读取以下文件之一作为打包入口
- index.tsx
- index.ts
- main.tsx
- main.ts
- index.jsx
- index.js
- main.jsx
- main.js

### 配置文件
在项目文件夹下创建monado.config.json作为配置文件，目前支持的配置如下
~~~json
// monado.config.json
{
  "server": {
    "port": 4000 // 开发服务器端口
  },
  "featrue": {
    "mdx": true, // 是否启用mdx
    "cssModule": true, //是否启用css module
    "scss": true // 是否启用scss
  },
  "plugins": {
    "bundleAnalyzer": false // 是否开启打包分析
  }
}
~~~

### 别名配置
直接在`tsconfig.json`文件中配置，语法与配置typescript文件配置别名相同，重启服务即可生效
~~~json
{
  "compilerOptions": {
    "paths":{
      	"@/*": ["src/*"]
    }
  }
}
~~~
