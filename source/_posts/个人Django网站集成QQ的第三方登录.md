---
title: 个人Django网站集成QQ的第三方登录
index_img: /posts/2205c935/images.jpg
abbrlink: 2205c935
date: 2020-12-14 20:38:43
tags: Django
---
**体验地址**: https://www.aigisss.com/view/#/login

<div class="note note-warning">特别注意的是,当前文章的Django版本是3.1.4</div>

## 使用social-auth-app-django

```bat
pip install social-auth-app-django
```

## settings中配置

```python
INSTALLED_APPS = (
    ...
    'social_django',
    ...
)

AUTHENTICATION_BACKENDS = (
    'social_core.backends.weibo.WeiboOAuth2',
    'social_core.backends.qq.QQOAuth2',
    'social_core.backends.weixin.WeixinOAuth2',
    'users.views.CustomBackend',
    'django.contrib.auth.backends.ModelBackend',
)

SOCIAL_AUTH_POSTGRES_JSONFIELD = True # postgreSQL的配置
SOCIAL_AUTH_URL_NAMESPACE = 'social' # 新增
SOCIAL_AUTH_QQ_KEY = '123456'
SOCIAL_AUTH_QQ_SECRET = 'd34c96123456789'
SOCIAL_AUTH_QQ_USE_OPENID_AS_USERNAME = True
SOCIAL_AUTH_LOGIN_REDIRECT_URL = '/'  # 登陆成功之后的路由
SOCIAL_AUTH_SANITIZE_REDIRECTS = True 
SOCIAL_AUTH_REDIRECT_IS_HTTPS = True # https时的配置

TEMPLATES = [
    {
        ...
        'OPTIONS': {
            ...
            'context_processors': [
                ...
                'social_django.context_processors.backends',
                'social_django.context_processors.login_redirect',
                ...
            ]
        }
    }
]
```

## urls配置

```python
url('^accounts/', include('social_django.urls', namespace='social')),
```

## QQ的配置

qq比较特别,其余的按照网上说明配置即可成功,下面着重说明QQ的一些配置.

**[先申请QQ互联地址](https://connect.qq.com/index.html)->注册认证开发者->创建应用等待审核**

![image-20201215093905706](%E4%B8%AA%E4%BA%BADjango%E7%BD%91%E7%AB%99%E9%9B%86%E6%88%90QQ%E7%9A%84%E7%AC%AC%E4%B8%89%E6%96%B9%E7%99%BB%E5%BD%95/image-20201215093905706.png)

### 特别注意

**填写回调的时候需要注意**

![image-20201215094152264](%E4%B8%AA%E4%BA%BADjango%E7%BD%91%E7%AB%99%E9%9B%86%E6%88%90QQ%E7%9A%84%E7%AC%AC%E4%B8%89%E6%96%B9%E7%99%BB%E5%BD%95/image-20201215094152264.png)

需要填写一个不带斜杠的地址,不然通过不了,说是`回调地址不合法：须为http或https开头的子目录。如http://qq.com/mycb`

>特别感谢[子钦加油](https://www.cnblogs.com/zmdComeOn/)
>
>https://www.cnblogs.com/zmdComeOn/p/12667228.html
>
>https://blog.csdn.net/weixin_39944891/article/details/94739204

