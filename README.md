# 微信小程序-前端 [开发版]
> `文档更新： 2018-12-23`
> `体验版本： v0.7.0 [Alpha]`
> `本来是公司的项目，但因某些原因项目终止，所以才可以开源`
### 内部原创组件说明
>`Toast` 组件: [查看 说明/源码](https://gitee.com/slm47888/wechat_applet__component_toast)
### 部分截图预览：
<div>
<img width="200" align="left" src="https://slmblog.com/git/home.jpg" alt="SLM-BLOG LOGO"/>
<img width="200" align="left" src="https://slmblog.com/git/card.jpg" alt="SLM-BLOG LOGO"/>
<img width="200" align="left" src="https://slmblog.com/git/dc.jpg" alt="SLM-BLOG LOGO"/>
<img width="200" align="left" src="https://slmblog.com/git/msg.jpg" alt="SLM-BLOG LOGO"/>
<img width="200" align="left" src="https://slmblog.com/git/msg2.jpg" alt="SLM-BLOG LOGO"/>
<img width="200" align="left" src="https://slmblog.com/git/msg3.jpg" alt="SLM-BLOG LOGO"/>
<img width="200" align="left" src="https://slmblog.com/git/register.jpg" alt="SLM-BLOG LOGO"/>
<img width="200" src="https://slmblog.com/img/git-img/wxxcxqd/user.jpg" alt="SLM-BLOG LOGO"/>
</div>

### 修改接口[开源设定]：
修改 [app.js](https://github.com/shi-lai-mu/hospital-wxapp/blob/master/miniprogram/app.js) 文件内的URL即可，接口传回数据参考下方的后端文档

### 进度浏览：
`删除线代表未完成`
>##### `页面/布局:`
>>- 首页
>>- 我的账号
>>- 绑定小程序
>>- 注册账号[用户]
>>- 注册账号[医生]
>>- 科室搜索
>>- 我的家庭
>>- 短信验证
>>- 身份证上传
>>- 短信验证[注册页]
>>- 医生信息页
>>- 全部咨询记录页面
>>- 发消息页面
>>
>>- ~~我的药店~~
>##### `搜索机制:`
>>- 子部门搜索
>>- 姓名搜索
>>- 筛选搜索 
>>- 搜索节流
>>- 搜索绑定
>>- 专家咨询
>>
>>- ~~快速咨询~~
>##### `我的家庭:`
>>- 家庭列表
>>- 添加成员
>>- 删除成员
>##### `账号机制:`
>>- openId登录
>>- openId注册
>>- openId绑定 
>>- 身份证识别
>>- 主账号注册[用户]
>##### `咨询机制:`
>>- 全部咨询进行权重排序 已回复 > 待回复 > 已结束
>>- 历史消息无动画，发消息包含动态
>>- 底部工具栏

### 本地存储调用说明：
##### `主要起到提高体验度、减轻服务器压力`
| 数据 | 调用页 | 函数名 | 存储条件 | 有效时间 |
| :--------| :-------- | :-------- | :--------| :------: |
| 用户数据[账号/token/主账号] | account | settingAccount | 无数据/数据过期 | 3天 |
| 部门信息[主部门/子部门/科室] | app | onLaunch | 无数据/数据过期 | 1小时 |
| 专家列表[专家信息] | search | onLoad | 专家咨询 | 1小时 |


```javascript
// 以下为小程序页面目录注释[方便快速查找]
/*
+---cloud [云函数]
|   \---getOpenId [获取openId]
|
+---miniprogram [主目录]
|   +---component [组件]
|   |   \---Toast [Toast 消息组件]
|   |
|   +---images [图片库]
|   |   \---tagbar [底部选项卡]
|   |
|   \---pages       [页面]
|       +---account [账号]
|       |   +---family     [我的家庭]
|       |   +---answer     [咨询界面]
|       |   +---docAskList [咨询历史]
|       |   +---login      [登录]
|       |   \---register   [注册]
|       |
|       +---doctor  [医生]
|       |   \---consulting [待定]
|       |
|       +---index   [首页]
|       +---search  [搜索]
|       \---upload  [上传]
|           +---idCard     [身份证]
|           \---page       [空白页]

*/
```

