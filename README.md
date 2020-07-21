# 12.电商后台管理系统

## 使用技术：

- Vue全家桶（Vue、Vue-cli、Vue-Router）、
- Element UI、
- axios + CORS、
- Node.js + Express 、
- mongoose+MongoDB


## 项目安装、依赖配置和项目运行

```
npm install
```

```
npm run serve
```

```
npm run build
```



## 项目目录结构

```


├─public
│      favicon.ico
│      index.html
└─src
    │  App.vue                          //根组件、入口函数
    │  main.js                  
    ├─assets
    │ 		├─css						//全局css，初始样式
    │  		└─fonts					    
    ├─router                            //路由管理
    ├─components
    │  	 │  	├─Home.vue
    │ 	 │  	├─Login.vue             //登录功能模块
    │ 	 │  	└─Welcome.vue
    │  	 │
    │  	 ├─goods                        //后台商品可视化管理
    │ 	 │     	├─addgoods.vue
    │ 	 │      ├─categories.vue
    │  	 │      ├─goodslist.vue
    │  	 │      └─params.vue
    │    │
    │    ├─order                       //后台订单可视化管理
    │ 	 │     	 ├─citydata.js
    │ 	 │    	 └─orderlist.vue
    │ 	 │
    │	 ├─powers                      //管理员账号权限管理
    │	 │    	 ├─rights.vue
    │ 	 │    	 └─ roles.vue
    │ 	 │
    │ 	 ├─report                      //数据报表
    │  	 │      └─reports.vue
    │  	 │
    │  	 └─users                       //账号管理
    │         └─Users.vue
    │
    └─plugins                          
      		├─element.js               //Element UI组件按需导入
      		└─timeline
    
```


