# CharFilter-DEMO-WEB
#### 这是一个游戏账号筛选系统的功能页面之一  
采用响应式设计，页面自适应移动端至PC端的分辨率  
&nbsp;入口页面 [index.html](https://github.com/MonoKmm/CharFilter-DEMO-WEB/blob/master/index.html)  

Chrome 版本 56.0.2924.87 (64-bit) 测试通过  

Safari 版本 10.0.3 (12602.4.8) 测试中  

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
     
