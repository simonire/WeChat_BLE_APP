# 项目介绍

项目做的一个开源微信蓝牙BLE小程序，包括各种交互，方便学习。

![1](https://github.com/simonire/WeChat_BLE_APP/blob/master/pic/1.PNG)



小程序是一种新的开放能力，开发者可以快速地开发一个小程序。小程序可以在微信内被便捷地获取和传播，同时具有出色的使用体验。

# 目录结构

 

小程序包含一个描述整体程序的 `app` 和多个描述各自页面的 `page`。

一个小程序主体部分由三个文件组成，必须放在项目的根目录，如下：

 

| 文件                                                         | 必需 | 作用             |
| :----------------------------------------------------------- | :--- | :--------------- |
| [app.js](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/app.html) | 是   | 小程序逻辑       |
| [app.json](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html) | 是   | 小程序公共配置   |
| [app.wxss](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxss.html) | 否   | 小程序公共样式表 |

一个小程序页面由四个文件组成，分别是：

 

| 文件类型                                                     | 必需 | 作用       |
| :----------------------------------------------------------- | :--- | :--------- |
| [js](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/page.html) | 是   | 页面逻辑   |
| [wxml](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxml/) | 是   | 页面结构   |
| [json](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html#页面配置) | 否   | 页面配置   |
| [wxss](https://developers.weixin.qq.com/miniprogram/dev/framework/view/wxss.html) | 否   | 页面样式表 |

