# @monado/scripts

基于 webpack 的用于构建 react 应用的打包工具，支持 typescript、mdx、tailwindcss、postcss 等常用库

## usage

```shell
# 安装
npm install -D @monado/scripts

# 启动开发环境
npx monado-scripts start

# 启动打包
npx monado-scripts build
```

## 打包入口

monado-scripts 会从项目文件夹下的`src`目录中按照优先级读取以下文件之一作为打包入口

- index.tsx
- index.ts
- main.tsx
- main.ts
- index.jsx
- index.js
- main.jsx
- main.js

## 配置文件

在项目文件夹下创建 monado.config.json 作为配置文件，目前支持的配置如下

```json
{
	"publicPath": "/",
	"devServer": {
		"port": 4000,
		"proxy": {
			"/api": "http://localhost:9000"
		}
	},
	"alias": {
		"@": "src"
	},
	"plugins": {
		"bundleAnalyzer": false
	}
}
```

### 启用 mdx

安装@mdx-js/react 后 monado-scirpts 自动启用 mdx-loader

```shell
npm install @mdx-js/react
```

### 启用 scss

安装 sass 后 monado-scirpts 自动启用 sass-loader,并支持 css module

```shell
npm install sass
```

### 开发代理配置

@monado/scripts 的配置文件的开发服务代理使用与 webpack 开发代理一样的规则

```json
{
	"devServer": {
		"proxy": {
			"/api": {
				"target": "http://localhost:8000",
				"pathRewrite": {
					"^/api": ""
				}
			}
		}
	}
}
```

### 别名配置

在 monado.config.json 的 alias 字段下配置别名
以下为将`@`作为项目根目录下`src`目录别名的配置

```json
{
	"alias": {
		"@": "src"
	}
}
```
