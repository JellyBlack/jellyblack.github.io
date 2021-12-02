---
title: 用Python脚本实现疫情自动填报
tags:
  - 自动化
  - 抓包
  - Web前端
date: 2021-10-11 23:42:37
categories: [GitHub项目, Python]
---

# 项目起源

两次忘了疫情填报，去辅导员办公室喝了两次茶，立志决定改掉爱忘事的坏习惯，~~即写一个懒人脚本，彻底忘掉填报这事~~。以下文章我将侧重于抓包与分析的过程。如你是西工大校友，可直接拿去用：https://github.com/JellyBlack/NPU-pandemic-auto-fill-in

（**低调使用！不要张扬！**）

# 抓包与分析

首先准备好我们的Fiddler抓包工具。第一次使用，需配置HTTPS证书，否则不能抓用SSL加密的流量。

<!--more-->

{% asset_img Fiddler主页.png %}

为了简便，以下我只保留了*.nwpu.edu.cn的请求。在浏览器访问yqtb.nwpu.edu.cn，然后我们发现Fiddler抓到了如下几个包：

{% asset_img 抓包1.png %}

注意：当我们第一次请求时，响应报文中设置了`JSESSIONID`这个Cookie。这个Cookie用于标记会话，因此在Python脚本中需要记录这个Cookie。以下是相应的Python代码片段。

```python
# 请求疫情填报页面
response1 = session.get(yqtb_url)
yqtb_cookie = session.cookies["JSESSIONID"] # 疫情填报的会话id
```

继续分析，一路重定向下去。注意#5这个请求，该请求重定向到了uis.nwpu.edu.cn。

{% asset_img 重定向.png %}

由于我登录了翱翔门户，所以直接重定向回来了。这次我退出翱翔门户，再次访问，这次浏览器跳转到了登录页面。

让我们填好表单，尝试登录：

{% asset_img 登录.png %}

哈！成功抓到登录表单。只要简单实现就可以用脚本登录了。但仔细观察，登录时客户端提交了一个Cookie：

{% asset_img Headers.png %}

看来我们要保留这个Cookie，以在登录时使用。以下是登录的脚本。

```python
uis_cookie = response1.cookies["SESSION"] # 登录翱翔门户的会话id
# 登录翱翔门户post的数据
loginData = {
    "username" : studentId,
    "password" : password,
    "currentMenu" : 1,
    "execution" : "e1s1",
    "_eventId" : "submit",
    "geolocation" : "",
    "submit" : "稍等片刻……"
}
# 登录翱翔门户所用的cookie
loginHeader = {
    "Cookie" : "SESSION=" + uis_cookie
}
# 请求登录
response2 = session.post(uis_login_url, data = loginData, headers = loginHeader)
```

继续观察，登录完成后重定向到了一个URL，并且该URL携带登录口令。看来访问该URL，服务器就会认为我们完成了登录，并允许当前会话的操作。

回到浏览器，登录完成后到了疫情填报页面。这时我完成填报并提交，抓到了提交的包：

{% asset_img 抓包2.png %}

把这些表单数据复制到脚本，然后发一个Post请求就完了。以下是代码。

```python
# 提交填报信息post的数据
fillinData = {
    "sfczbcqca" : "",
    "czbcqcasjd" : "",
    "sfczbcfhyy" : "",
    "czbcfhyysjd" : "",
    "actionType" : "addRbxx",
    "userLoginId" : studentId,
    "userName" : name,
    "szcsbm" : 1,
    "szcsmc" : "在学校",
    "sfjt" : 0,
    "sfjtsm" : "",
    "sfjcry" : 0,
    "sfjcrysm" : "",
    "sfjcqz" : 0,
    "sfyzz" : 0,
    "sfqz" : 0,
    "ycqksm" : "",
    "glqk" : 0,
    "glksrq" : "",
    "gljsrq" : "",
    "tbly" : "sso",
    "glyy" : "",
    "qtqksm" : "",
    "sfjcqzsm" : "",
    "sfjkqk" : 0,
    "jkqksm" : "",
    "sfmtbg" : "",
    "userType" : 2,
    "qrlxzt" : ""
}
# 填报所需要的header
fillinHeader = {
    "Host" : "yqtb.nwpu.edu.cn",
    "Proxy-Connection" : "keep-alive",
    "Accept" : "application/json, text/javascript, */*; q=0.01",
    "X-Requested-With" : "XMLHttpRequest",
    "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36",
    "Content-Type" : "application/x-www-form-urlencoded",
    "Origin" : yqtb_url,
    "Referer" : yqtb_referer_url,
    "Accept-Encoding" : "gzip, deflate",
    "Accept-Language" : "zh-CN,zh;q=0.9,en;q=0.8",
    "Cookie" : "JSESSIONID=" + yqtb_cookie
}
# 提交填报信息
response3 = session.post(yqtb_fillin_url, data = fillinData, headers = fillinHeader)
```

基本的操作到此结束。但为了让我们的脚本更完善，我们不禁想到：

**如果填报失败了怎么办？**

Internet这事，处处都得有个异常处理。如果填报失败，我们自然要通知用户，让他马上修复脚本。为此，我接入了钉钉的机器人通知API。这样填报情况会自动通过钉钉发送给用户。以下是代码。

```python
# 发送钉钉通知
if len(webhook) != 0:
    message = "【疫情自动填报】"
    if flag:
        message += "填报成功"
    elif filled:
        message += "填报失败\n错误码：" + str(state) + "\n错误信息：" + error
    else:
        message += "填报失败"
    if filled and len(yqtb_cookie) != 0:
        message += "\n会话ID：" + yqtb_cookie
    # 要发送的数据
    data = {
        "msgtype" : "text",
        "text" : {
            "content" : message
        },
        "at" : {
            "isAtAll" : not flag
        }
    }
    response = requests.post(webhook, data = json.dumps(data), headers = {"Content-Type": "application/json"})
```

以下是消息示例。

{% asset_img 钉钉.png %}

完成！现在我们只需要写一个yml脚本，放到GitHub，然后就可以每天自动执行了。

```yaml
name: NPW-pandemic-auto-fill-in
on:
  push:
    branches: [ main ]
  schedule:
    - cron: '34 1,21 * * *'
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Set up Python 3.9
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install requests
    - name: Run task
      run: python NPU_pandemic_auto_fill_in.py ${{ secrets.NAME }} ${{ secrets.STUDENTID }} ${{ secrets.PASSWORD }} ${{ secrets.WEBHOOK }}
```

以上便是我抓包与分析的大致思路。当然，其中撞过不少墙，比如弄不懂重定向若干次后，Cookie怎么用Python读取；登录不上，一直报错；请求被服务器拦截……

抓包并不总是一帆风顺的。如果网站自建一套密钥系统，把密码加密；或者表单混乱至极；再或者有一道验证码，那么恐怕脚本就没这么简单了。

# 总结

我以前没学过Python，现学现用，折腾半天，总算把自动填报搞定了。妈妈再也不用担心我的学习~

查看完整项目代码请前往GitHub仓库：https://github.com/JellyBlack/NPU-pandemic-auto-fill-in

该项目仅用于学习测试。疫情管理本意是好的，只不过每天填报对于懒人不友好（所以这就是你折腾脚本的原因？）。在此处记录一下抓包分析的思路，便于以后借鉴。如果你要使用，拿去就好了，配置可参考README文档。**低调使用！**
