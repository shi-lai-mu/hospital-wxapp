# 微信小程序-前端 [开发版]
> `文档更新： 2018-12-23`
> `体验版本： v0.7.0 [Alpha]`
> `本来是公司的项目，但因某些原因项目终止，所以才可以开源`
### 内部原创组件说明
>`Toast` 组件: [查看 说明/源码](https://gitee.com/slm47888/wechat_applet__component_toast)
### 部分截图预览：
<div>
<img width="200" align="left" src="http://res.mczyzy.cn/img/git-img/wxxcxqd/home.jpg" alt="SLM-BLOG LOGO"/>
<img width="200" align="left" src="http://res.mczyzy.cn/img/git-img/wxxcxqd/card.jpg" alt="SLM-BLOG LOGO"/>
<img width="200" align="left" src="http://res.mczyzy.cn/img/git-img/wxxcxqd/dc.jpg" alt="SLM-BLOG LOGO"/>
<img width="200" align="left" src="http://res.mczyzy.cn/img/git-img/wxxcxqd/msg.jpg" alt="SLM-BLOG LOGO"/>
<img width="200" align="left" src="http://res.mczyzy.cn/img/git-img/wxxcxqd/msg2.jpg" alt="SLM-BLOG LOGO"/>
<img width="200" align="left" src="http://res.mczyzy.cn/img/git-img/wxxcxqd/msg3.jpg" alt="SLM-BLOG LOGO"/>
<img width="200" align="left" src="http://res.mczyzy.cn/img/git-img/wxxcxqd/register.jpg" alt="SLM-BLOG LOGO"/>
<img width="200" src="http://res.mczyzy.cn/img/git-img/wxxcxqd/user.jpg" alt="SLM-BLOG LOGO"/>
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

### 后端接口
更新时间：2019-01-04 13:57

[TOC]



------

# 部署
部署前请务必运行 `composer install`

系统需要包括但不限于sqlite相关/xml相关的PHP插件库

# API接口

*说明：在开始阅读之前请理解小程序后台的逻辑，小程序是依附于咨询平台的附属系统，我们的数据会直接从咨询平台取得，接下来我们会称咨询平台为“主系统”。由于一些原因我们不能随意的修改主系统的数据库，但是小程序获取到的openid和主系统的不能通用，所以我们引入了一个sqlite数据库，用于存储小程序的用户信息，每个小程序用户均可以绑定主系统id到小程序平台上。*

**所以如果我说的是xcxid,那这个id表示的是小程序用户ID，于主系统ID并不一样。如果说的是MainSystemID即主系统ID，那就表示是主系统的ID。**

**PS: 2018-11-21 如果没有特殊说明，所有的API默认方法都为get请求**

PS：以下2个账号仅供测试：

| xcxid | openid | 类型                               |
| ----- | ------ | ---------------------------------- |
| 1     | test   | 患者类型，绑定到主系统用户ID：4559 |
| 2     | test2  | 医生类型，绑定到主系统用户ID：98   |

注意事项2: 如果api中有标明/?token=XXX，则表示需要传入token，不然会提示：`{"403": "Permission denied, no token"}`或者`{"403": "Permission denied, token wrong"}`。**token过期时间为3天**


### 登陆

`/api/login/:openid` GET，登陆，openid为微信的openid，返回json格式

成功：`{"status":"ok","xcxid":"1","token":"b6c14bdc6db5e53a007233e584c4c503-1-1542872028"}` xcxid为小程序账户id, token为以后所有操作需要传入的值

失败：`{"error":"user not exist"}` 

### 注册（暂定）

`/api/register/:openid` GET，注册用户，openid为微信小程序openid，返回json格式

成功：`{"xcxid":"2"}` xcxid为小程序账户id,需要保存下来，用于获取用户信息

失败：`{"error":"insert error, user exist"}`

### 获取用户信息

`/api/getUserDetail/?token=XXX`  GET，获取用户信息，token为通信令牌，返回下列json格式

如果已经绑定了账号，则会显示下面的json信息

```json
{
  "xcx_id": "1",
  "openid": "test",
  "sql_db_id": "4559",
  "is_doctor": "0",//这个是小程序的用户类型，0表示患者（默认），1表示医生
  "bind_account": {//这里是mysql数据库里提供的信息
    "id": 4559,
    "zxyy_id": "183589",
    "token": "ynxx14737******",
    "wecha_id": "oW*****************************Kuw",
    "medical_No": "3303*************34",
    "patientname": "姓名01",
    "lxfs": "133*******5",
    "csrq": "2000-00-00",
    "l_sex": "男",
    "is_temp": 0,
    "is_default": "1",
    "isLord": "1",
    "nickname": "史莱姆",
    "headimgurl": "http://thirdwx.qlogo.cn/mmopen/8bK2rPsBY4lWc6Y4CTJKUibEo5utI1IOcI4yMUXvUedqbViaxg7licov60TZjhf8v2gVvgeFTxttXkaCzy8XTNNnugKODJpWLX7/132"
  }
}
```

如果没有绑定，则会显示
```json
{
  "xcx_id": "1",
  "openid": "test",
  "sql_db_id": "",//如果没绑定这里可能会是null或者""
  "is_doctor": "0",
  "bind_account": null//如果没绑定这里可能会是null或者[]
}
```

如果失败则显示`{"error":"user not exist"}`

### 绑定到主系统

#### 绑定到主系统已经注册的手机号

**第一步：**

`/api/bindExistAccount/:phone/?token=XXX` , phone为已经在主系统上注册的手机号。请求成功后会发送一条验证码短信到用户手机上，记得提醒用户接收。

成功：`{"mssion_id":"13"}` 返回mssion_id，需要记住这个missionID，接下来要用

失败：`{"error":"省略。。。。"}` 会返回以error开头到错误信息，只要看到error字段就是有问题了。

**第二步：**

`finishBind/:mssion_id/:code`，mssion_id是上一步获得的missionID，code是发送的手机验证码。

成功返回`{"status":"ok"}`

失败：`{"error":"省略。。。。"}` 会返回以error开头到错误信息

#### 绑定到主系统未注册的手机号

**第零步：**

先通过上面的API（*绑定到主系统已经注册的手机号 #第一步*）绑定一下试试看，是否会返回用户不存在的error，如果返回该错误则现实注册界面，让用户输入信息（这里的信息医生和病人不一样）。

**第一步：**

**病人注册**主系统账户： `/api/bindAndRegMainSysAccountPat/?token=XXX` 传输方法**POST**,传输参数json

```json
{
	"phone":"17**875****",
	"name":"姓名03",
	"sex":"男",
	"csrq":"1999-01-19"
}
```

Phone 为手机号， name为真实姓名， sex 为性别，csrq为出生日期-注意日期格式

成功返回mission ID，`{"mssion_id": "6"}`，missionID保存好，下一步要用

失败`{"error":"省略。。。。"}` 会返回以error开头到错误信息

**医生注册**主系统账号：`/api/bindAndRegMainSysAccountDoc/?token=XXX`,传输方法**POST**,传输参数json

```json
{
    "name":"姓名03",
    "phone":"17**875****",
    "ysdm":"YTU0510",
    "hospital_id":"",
    "dept_id":"6",
    "sub_dept_id":"30",
    "ksdm":"K18"
}
```

name为真实姓名，phone为手机号，ysdm为医生代码，hospital_id为医院ID-目前为空，dept_id部门ID，sub_dept_id子部门ID，ksdm科室代码

> 请注意，dept_id/sub_dept_id/ksdm到时候会提供API去获取，获取到时候需要渲染到类似于下拉框里面，让医生注册的时候选择。部门信息列表请查看下面的API。

成功返回mission ID，`{"mssion_id": "6"}`，missionID保存好，下一步要用

失败`{"error":"省略。。。。"}` 会返回以error开头到错误信息

**第二步：**

`finishBindAndRegMssion/:mssion_id/:code?token=XXX`，mssion_id是上一步获得的missionID，code是发送的手机验证码。

成功返回`{"status":"ok"}`

失败：`{"error":"省略。。。。"}` 会返回以error开头到错误信息



### 修改小程序用户类型

`/api/setXcxUserType/:type/?token=XXX` 小程序用户有2种类型，医生和患者，默认为患者。type表示要修改的用户类型，0表示患者（默认），1表示医生。

成功：`{"status":"ok"}` 

失败：`{"error":"user not exist"}`

### 获取主部门列表

`/api/getDeptList` 获取医院主部门的列表，成功返回json数据

```json
[
  {
    "name": "儿科", //部门名称
    "ksdm": "K01", //科室代码
    "sorts": 0, 
    "pic": "uploads/y/ynxx14737******/20181031/1e9a30b76104df1d14ba813cec8a1915.png",//图标
    "is_recommend": 0,
    "token": "ynxx14737******",
    "id": 1, //部门ID
    "fid": 0 //忽略
  },
  {
    "name": "耳鼻咽喉科",
    "ksdm": "K02",
    "sorts": 0,
    "pic": "uploads/y/ynxx14737******/20181031/32b99db21086ca5089f82ee31099194e.png",
    "is_recommend": 1,
    "token": "ynxx14737******",
    "id": 2,
    "fid": 0
  },
  .....
]
```

注意这里的id字段，接下来获取子部门列表的时候需要传入。

失败：`{"error":"省略。。。。"}` 会返回以error开头到错误信息

### 获取子部门列表

`/api/getSubDeptList/:depId`根据部门ID获取子部门列表，部门ID通过上个接口获取。返回json类型。

距离，当传入ID为1时（儿科），返回如下数据

```json
[
  {
    "name": "儿科专",
    "ksdm": "34",
    "sorts": 0,
    "pic": "",
    "is_recommend": 0,
    "token": "ynxx14737******",
    "id": 13, //部门ID
    "fid": 1 //主部门ID
  },
  {
    "name": "儿科",
    "ksdm": "37",
    "sorts": 0,
    "pic": "",
    "is_recommend": 0,
    "token": "ynxx14737******",
    "id": 14,
    "fid": 1
  }
]
```

失败：`{"error":"省略。。。。"}` 会返回以error开头到错误信息

### 获取所有部门列表

`/api/getAllDept` 获取全部的部门列表，避免多次请求网络。返回json数据

成功返回如下数据

```json
{
  "1": {//主部门ID
    "name": "儿科",//主部门名称
    "ksdm": "K01",//科室代码
    "sorts": 0,
    "pic": "XXX/1e9a30b76104df1d14ba813cec8a1915.png",
    "is_recommend": 0,
    "token": "XXX",
    "subDept": [//子部门列表 数组
      {
        "id": 13,//子部门ID
        "fid": 1,
        "name": "儿科专",//子部门名称
        "ksdm": "34",
        "sorts": 0,
        "pic": "",
        "is_recommend": 0,
        "token": "XXX"
      },
      {
        "id": 14,
        "fid": 1,
        "name": "儿科",
        "ksdm": "37",
        "sorts": 0,
        "pic": "",
        "is_recommend": 0,
        "token": "XXX"
      }
    ]
  },
  "11": {
    "name": "眼科",
    "ksdm": "K11",
    "sorts": 0,
    "pic": "XXX/6db2fb87afbbb6c7df8f7812b0e346bc.png",
    "is_recommend": 0,
    "token": "XXX",
    "subDept": [
      {
        "id": 54,
        "fid": 11,
        "name": "眼科",
        "ksdm": "09",
        "sorts": 0,
        "pic": "",
        "is_recommend": 0,
        "token": "XXX"
      },
      {
        "id": 55,
        "fid": 11,
        "name": "眼科专",
        "ksdm": "38",
        "sorts": 0,
        "pic": "",
        "is_recommend": 0,
        "token": "XXX"
      }
    ]
  },
]
```

失败:`{"error":"省略。。。。"}` 会返回以error开头到错误信息

### 搜索医生

`/api/searchDoctor`该API允许用户搜索医生。传输方法`POST`传输参数JSON，如下

```json
{
    "doc_name":"",
    "depId":-1,
    "subdepId":-1
}
```

depId为部门ID，subdepId为子部门ID，**当参数为-1时表示不限制部门和子部门检索**

doc_name表示医生名称，当为“”的时候，表示不限制医生姓名

成功返回JSON字符串

失败返回error开头到错误信息`{"error":"省略。。。。"}` 



例子：

当为希望检索医生名称为“陈”的时候，需要如下json

```json
{
    "doc_name":"陈",
    "depId":-1,
    "subdepId":-1
}
```

会返回

```json
[{"id":103,"token":"ynxx14737******","wecha_id":"cb","username":null,"phone":"17**875****","password":null,"name":"姓名03","hospital_id":0,"dept_id":6,"sub_dept_id":30,"price":null,"ldesc":null,"mzsj":null,"photo":null,"level_id":null,"lxfs":null,"qrcode":null,"email":null,"l_sex":null,"is_community":0,"wxh":null,"csrq":null,"status":0,"active_index":0,"follow_num":0,"ysdm":"YTU0510","ksdm":"K18","is_online":1,"zhengshu_no":null,"dp_count":1,"dp_score":5,"rounds":-1,"is_recommended":0,"good_num":0,"normal_num":0,"bad_num":0,"total_num":0,"create_time":null,"is_expert":null,"MatchDegree":"0.5000"},{"id":101,"token":"ynxx14737******","wecha_id":"oWq********chS0femg","username":null,"phone":"1876782****5519****","password":"","name":"陈**杰","hospital_id":null,"dept_id":1,"sub_dept_id":13,"price":null,"ldesc":null,"mzsj":null,"photo":null,"level_id":115,"lxfs":null,"qrcode":null,"email":null,"l_sex":"男","is_community":0,"wxh":null,"csrq":null,"status":1,"active_index":0,"follow_num":0,"ysdm":"yux","ksdm":"34","is_online":1,"zhengshu_no":null,"dp_count":1,"dp_score":5,"rounds":-1,"is_recommended":0,"good_num":0,"normal_num":0,"bad_num":0,"total_num":0,"create_time":null,"is_expert":null,"MatchDegree":"0.3333"}]
```

限于篇幅有限，不便展开json，可以自己复制到json查看器中观看。

其中尾部的`MatchDegree`表示匹配度，越大匹配度越高。**请注意，匹配度仅在姓名搜索中会显示**

例子2：

如果希望检索子部门subdepId为30的医生，可以构造如下json

```json
{
    "doc_name":"",
    "depId":-1,
    "subdepId":30
}
```

会返回

```json
[{"id":103,"token":"ynxx14737******","wecha_id":"cb","username":null,"phone":"17**875****","password":null,"name":"姓名03","hospital_id":0,"dept_id":6,"sub_dept_id":30,"price":null,"ldesc":null,"mzsj":null,"photo":null,"level_id":null,"lxfs":null,"qrcode":null,"email":null,"l_sex":null,"is_community":0,"wxh":null,"csrq":null,"status":0,"active_index":0,"follow_num":0,"ysdm":"YTU0510","ksdm":"K18","is_online":1,"zhengshu_no":null,"dp_count":1,"dp_score":5,"rounds":-1,"is_recommended":0,"good_num":0,"normal_num":0,"bad_num":0,"total_num":0,"create_time":null,"is_expert":null,"MatchDegree":"0.0000"}]
```

### 上传身份证

`/api/SetIDCard?token=XXX`，上传身份证**正面照**并获取医院返回的病人号(brid)。

接口方法：**POST** 

图片post上传协议为常见的FormData，就是我们平常用表单上传文件的协议。

图片上传参数名称为：idcard

返回json格式

成功返回：`['status':'ok']`

失败返回:`['error':'错误信息'] `请注意查看返回的错误信息，比如 图片未上传/身份证不是正面/用户未绑定主系统账号/上传的图片不是身份证/身份证号码识别不出来/ 等等都会返回错误。

以下只是个别错误信息(一行一个)：

```
not a patient account
Unbound main system account
no image file upload
file move error
recognize error
Image type error
please upload face side
card number is empty
....
```

为了便于理解，这里展示js上传身份证照片到本接口的例子：

```javascript
var form = new FormData();
form.append("idcard", "sfz1.jpg");

var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://localhost:8080/api/SetIDCard?token=cbcb7707bbe2e88a6a3ad40f6258f60d-3-1543816164",
  "method": "POST",
  "headers": {
    "cache-control": "no-cache"
  },
  "processData": false,
  "contentType": false,
  "mimeType": "multipart/form-data",
  "data": form
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
```

### 获取专家医生列表

`/api/getExpertDoc`获取专家列表，返回json数组数据。

如果专家列表为空则，返回的是空json格式数组。

### 获取家庭成员列表

`/api/getFamilyList?token=XXX`获取家庭成员的列表，返回json数组。账号本身就是一个家庭成员

成功返回如下：

```json
[{"id":4559,"zxyy_id":"183589","medical_No":"3303*************34","patientname":"姓名01","phone":"1334******","csrq":"2000-00-00","isLord":"1"},{"id":4*72,"zxyy_id":"179756","medical_No":"230***************6","patientname":"姓名02","phone":"17**875****","csrq":"1986-02-23","isLord":"0"}]
```

这边的medical_No是身份证，zxyy_id是医院ID，isLord是标志位，用于标明是否是否为主主家庭成员。比如账号本身是由姓名01申请的，那他就是主家庭成员。如果他添加了几个家庭成员到账号里来，那他添加的那些账号就是非主家庭成员，用isLord=0来标志。

### 添加家庭成员

#### 第一步

`/api/addFamilyUserStep1?token=XXX` 协议**POST** 

上传信息：身份证 图片，身份证上传参数：idcard

上传方法请看“上传身份证”那个API

家庭账户不允许重复，重复会返回错误信息：Duplicate family account

家庭账号也不允许超过8个，不然会返回错误信息：Family account limit 8

失败：返回error数组

成功：返回json格式：`{"mssion_id":"22","code":"600540"}`，这里的mission id和code需要保存，下一步需要用的。

#### 第二步

`/api/addFamilyUserStep2/:mssion_id/:code/:phone?token=XXX`，传输协议为GET。

这里的:mssion_id，:code为上一步返回的信息。:phone是家庭成员的手机号码，需要用来接收验证码。

家庭成员的手机号码应该是可以和主账号一样的。

成功返回json`["mssion_id":"23"]`然后手机号应该会收到一个验证码。

错误返回error字符串。

#### 第三步

`/api/addFamilyUserStep3/:mssion_id/:code?token=XXX`，传输协议为GET。

这里的:mssion_id为上一步返回的信息。:code是手机收到验证码。

添加成功，会返回json数据：`{"status":"ok"}`，然后你叫可以通过“读取家庭成员列表”读取数据了。

失败返回error数组。

### 删除家庭成员

`/api/deleteFamilyUser/:idcardNum?token=XXX`,用于当前账户下的单家庭成员删除功能。

idcardNum为家庭成员的身份证号码。

成功返回json`['status':'ok']`

请注意，这里无论是否真的删除成功，一律返回`['status':'ok']`。即使该家庭成员不是该账户下的，也都会返回成功状态。不过不用担心，后台并不会真的删除非该账户下的家庭成员。

### 获取医生信息

`/api/getDoctorInfo/:id`ID为医生的ID，成功返回json数据，失败返回error数据

小提示，医生简介在数据库中并没有对应的字段，所以公众号里的数据应该是自己构造的。比如（XX医生是我院XX的主任医师，技术精湛……）。

不过我估计后期会加入医生简介字段，的时候直接在json里读取就好了。

小提示2，医生的个人数据在搜索医生接口里面已经都有了，可以直接把搜索里得到的医生数据渲染出来就好了。这个接口只为不时之需。

------

## 医生咨询

### 逻辑部分

系统将这个分为2个表：ask表和QA表。所以的首次咨询写在ask表里。后面无论是医生的回复还是病人的追问都是添加到QA表中，一条消息一个QA记录，QA表中会标注改QA记录属于哪一个askid。*题外话：QA = Question and Answer*

首先添加一个医生咨询内容，会返回咨询ID。用户首次提出的咨询是保存在该咨询ID里面的。

然后会推送消息到医生手机（未做）

医生打开能看到咨询内容，然后医生就可以添加回复。

每添加一条回复都会插入一个新的QA记录，返回QA ID

读取消息的时候分为2块，一块是历史消息，一块是未读消息。实现读取历史消息，并显示到界面上，然后读取历史消息，再显示在界面上。显示成功以后，需要通过接口标记未读消息为已读。

假设：历史消息的QA ID列表为[1,2,3,4,5], 未读消息的QA ID列表为[6,7,8,9,10]

如果我们将6标记为已读，那么历史消息的QA ID就会变成[1,2,3,4,5,6], 未读消息的QA ID列表就会变为[7,8,9,10]

如果我们将9标记为已读，后台就会默认9之前所有的消息都已经读过了，那么历史消息的QA ID就会变成[1,2,3,4,5,6,7,8,9,], 未读消息的QA ID列表就会变为[10]

以此类推

### 添加医生咨询

`/api/addDoctorAsk?token=XXX` 方法**POST**传输JSON数据

消息内容如下，patient_id必须是属于该家庭账户内的，doctor_id是需要咨询的医生，content是内容，**必须大于4个字**

```json
{
	"patient_id":"4559",
	"doctor_id":"103",
	"content":"发送一条消息试试看"
}
```

成功返回ask_id

```json
{
    "ask_id": "648"
}
```

失败返回error数组

### 医生发送聊天：回复

`/api/docAddAnswer?token=XXX` 方法**POST**，医生发送回复的接口

ask_id是对应的咨询ID，如果该咨询ID不是这个用户所拥有的，就会返回错误

```json
{
	"ask_id":"648",
	"content":"我发送了一条回复"
}
```

成功返回json

```json
{
    "status": "ok"
}
```

失败返回error数组

### 获取咨询信息

`/api/getAskDoctorDetail/:ask_id?token=XXX` 方法GET

获取咨询的细节，需要在聊天界面上显示，如果用户没有权限读取或者该askid不存在则会返回空json对象

成功返回JSON

```json
{"id":648,//askID
 "token":"ynxx14737******",
 "wecha_id":"oW*****************************Kuw",
 "patient_id":4559,//病人ID
 "zxyy_account_id":187977,//病人医院ID
 "patient_name":"姓名01",//病人名称
 "doctor_id":103,//医生ID
 "doctor_name":"姓名03",//医生姓名
 "age":"18",//病人年龄
 "content":"发送一条消息试试看",//咨询内容
 "help":null,"l_sex":"男",
 "ill":null,
 "condition":"姓名01的提问",//标题
 "exp":null,"ask_type":0,"question_type":0,"hospital":null,"jzjl":null,"chufang":null,"photo":null,"dept_name":null,"dp_status":0,"status":-1,
 "create_day":"2018-12-20",
 "create_time":"2018-12-20 16:40:30",//创建时间
 "kyqx":"","cflx":null,"jblx":null,"cyts":null,"yfid":null}
```

失败返回error数组

### 获取未读的聊天信息

`/api/getUnreadQA/:ask_id?token=XXX` 方法GET

成功返回JSON，其中id为QA ID，在标记为已读的时候需要使用

```json
[
    {
        "id": 1633,
        "l_content": "我发送了一条回复",
        "is_question": 0,//医生回复返回0，病人问题返回1
        "create_time": "2018-12-20 18:09:00"
    },
    {
        "id": 1634,
        "l_content": "222我又发送了一条回复",
        "is_question": 0,
        "create_time": "2018-12-20 18:34:42"
    }
]
```

失败返回error数组

### 标记聊天消息为已读

`/api/QAMarkAsRead/:ask_id/:qa_id?token=XXX` 方法GET，标记某个消息以及该消息之前的消息为已读

成功返回json数据

```json
{
    "status": "ok"
}
```

失败返回error数组

### 获取历史聊天记录

`/api/getHistoryQA/:ask_id?token=XXX`方法GET

历史记录表示已经读过的数据

成功返回json数据

```json
[
    {
        "id": 1633,
        "l_content": "我发送了一条回复",
        "is_question": 0,//医生回复返回0，病人问题返回1
        "create_time": "2018-12-20 18:09:00"
    }
]
```

失败返回error数组

### 病人发送聊天：咨询

`/api/patAddAnswer?token=XXX` 方法**POST**，医生发送回复的接口

ask_id是对应的咨询ID，如果该咨询ID不是这个用户所拥有的，就会返回错误

```json
{
	"ask_id":"648",
	"content":"我发送了一条回复"
}
```

成功返回json

```json
{
    "status": "ok"
}
```

失败返回error数组

### 病人账户下的咨询记录

#### 活跃的咨询列表

`/api/getDocAskListByPatAlive?token=XXX` 方法GET，获取咨询列表

返回JSON格式

status表示当前问题状态（-1为待医生回复，0为医生已经回复，1表示问题结束）

24小时后问题就自动结束 

```json
[{"id":635,"token":"ynxx14737******","wecha_id":"oW*****************************Kuw","patient_id":4559,"zxyy_account_id":null,"patient_name":"姓名01","doctor_id":98,"doctor_name":"蔡**","age":"18","content":"测试测试测试测试测试测试测试测试测试","help":null,"l_sex":"男","ill":null,"condition":"姓名01的提问","exp":null,"ask_type":0,"question_type":0,"hospital":null,"jzjl":null,"chufang":null,"photo":null,"dept_name":null,"dp_status":0,"status":1,"create_day":"2018-11-01","create_time":"2018-11-01 16:14:30","kyqx":null,"cflx":null,"jblx":null,"cyts":null,"yfid":null},
 
 {"id":648,"token":"ynxx14737******","wecha_id":"oW*****************************Kuw","patient_id":4559,"zxyy_account_id":187977,"patient_name":"姓名01","doctor_id":103,"doctor_name":"姓名03","age":"18","content":"发送一条消息试试看","help":null,"l_sex":"男","ill":null,"condition":"姓名01的提问","exp":null,"ask_type":0,"question_type":0,"hospital":null,"jzjl":null,"chufang":null,"photo":null,"dept_name":null,"dp_status":0,"status":-1,"create_day":"2018-12-20","create_time":"2018-12-20 16:40:30","kyqx":"","cflx":null,"jblx":null,"cyts":null,"yfid":null}]
```

失败返回error数组

#### 关闭的咨询列表

`/api/getDocAskListByPatClose?token=XXX` 方法GET，获取咨询列表

返回JSON格式

同上

### 医生账户下的咨询记录

#### 活跃的咨询列表

`/api/getDocAskListByDocAlive?token=XXX` 方法GET，获取咨询列表

方法和返回值同上

#### 关闭的咨询列表

`/api/getDocAskListByDocClose?token=XXX` 方法GET，获取咨询列表

方法和返回值同上
