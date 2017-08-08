# CharFilter-DEMO-WEB
![head](https://github.com/MonoKmm/Images-folder/blob/master/CharFilter/head.jpg)
#### 这是一个游戏账号筛选系统的功能页面之一  
## 想看看筛选功能 访问这里： [预览效果](https://monokmm.github.io/CharFilter-DEMO-WEB/)  
## 对筛选插件CharFilter感兴趣 访问这里：[插件项目](https://github.com/MonoKmm/CharFliter/blob/master/README.md)  

采用响应式设计，页面自适应移动端至PC端的分辨率  

Chrome (Mac)版本 56.0.2924.87 (64-bit) 测试通过  
Safari (Mac)版本 10.0.3 (12602.4.8)    测试中  
Safari (iPhone)版本 IOS 10             测试通过  
  
### 页面分为三部分:
#### 1.货架 shelf  
     点击货架内的角色添加至购物车
#### 2.购物车 cart  
     点击购物车内角色从购物车中移除  
     [清空按钮] 可清空购物车内所有角色  
     [撤销按钮] 可以恢复上述的两种操作5次
     [检索按钮] 根据购物车内的角色对数据库[charlist.json]进行筛选
#### 3.筛选结果列表 result 
     输出筛选列表，以表格(table)方式呈现结果。
     CharFilter内置API dataFilter(Boolearn,mode)   
     方法内的 mode 默认为 'script' 模式：  
     将复数角色数量计入筛选条件中(如包含3个相同角色的账号)。  
     
