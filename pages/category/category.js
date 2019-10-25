// 0 引入用来发送请求的方法 一定要把路径补全
import { request } from "../../request/index.js";
// 引入es7的async
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧菜单数据
    categoryList:[],
    //右侧菜单数据
    rightContent:[],
    //被点击的左侧菜单
    currentIndex:0,
    //右侧内容的滚动条距离顶部的距离
    scrollTop:0
  },
  Cates:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
      0 web与小程序存储区别
        1 代码方式不一样
          web: localStorage.setItem("key","value")存值
               localStorage.getItem("key")获取值 
          小程序:
          wx.setStorageSync('key','value');存值
          wx.getStorageSync('key');获取值
        2 存的时候有没有做类型转换
          web:不管存入什么类型的数据,最终都会先调用toString(),把数据变成字符串再存
          小程序:不存在类型转换的操作，存什么获取什么类型
      1 先判断一下本地存储中有没有旧数据
      {time:Date.now(),data:[...]
      2 没有旧数据 直接发送请求
      3 有旧的数据 同事 旧的数据也没有过期 就使用 本地存储中的旧数据即可
    */
    // 1 获取本地存储中的数据 (小程序中也存在本地存储技术)
    const Cates = wx.getStorageSync('cates');
    // 2 判断
    if(!Cates){
      // 不存在 发送请求获取数据
      // 调用方法
      this.getCates();
    }else{
      // 有旧的数据 定义过期时间 
      if(Date.now()-Cates.time>1000*60*5){
        // 重新发送请求
        // 调用方法
        this.getCates();
      }else{
        // 可以使用旧的数据
        this.Cates=Cates.data;
        //构造左侧大菜单数据
        let categoryList = this.Cates.map(v=>v.cat_name);
        //构造右侧商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
          categoryList,
          rightContent
        })
      }
    }
  },

  //获取分类数据
  async getCates() {
    // 获取数据，因为用到es7的async注释掉以下代码
    // 但是es7因为不适用一些老机型 老机型上还是需要以下代码
    // request({ 
    //   url: "/categories"})
    //   .then(result => {
    //   this.Cates = result.data.message;

    //   // 把接口数据存入到本地存储中
    //   wx.setStorageSync('cates',{time:Date.now(),data:this.Cates});

    //   //构造左侧大菜单数据
    //     let categoryList = this.Cates.map(v=>v.cat_name);
    //   //构造右侧商品数据
    //     let rightContent = this.Cates[0].children;

    //     this.setData({
    //       categoryList,
    //       rightContent
    //     })
    // });

    // 1 使用es7的async await发送请求
    const result = await request({url:"/categories"})
    this.Cates = result;

    // 把接口数据存入到本地存储中
    wx.setStorageSync('cates',{time:Date.now(),data:this.Cates});

    //构造左侧大菜单数据
      let categoryList = this.Cates.map(v=>v.cat_name);
    //构造右侧商品数据
      let rightContent = this.Cates[0].children;

      this.setData({
        categoryList,
        rightContent
      })
  },
  //左侧菜单的点击事件
  handleItemTap(e){
    // 1 获取被点击的标题索引
    const {index} = e.currentTarget.dataset;
    // 重置rightContent数组的数据
    let rightContent = this.Cates[index].children;
    // 2 给data中的currentIndex，rightContent赋值
    // 3 根据不同的索引来渲染后侧内容
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置 右侧内容的scroll-view标签距离顶部的距离
      scrollTop:0
    })
  }

})