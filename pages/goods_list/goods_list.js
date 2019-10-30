// 0 引入用来发送请求的方法 一定要把路径补全
import { request } from "../../request/index.js";
// 引入es7的async
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({

  /**
   * 页面的初始数据
   */
  data: {
      tabs:[
        {
          id:0,
          value:"综合",
          isActive:true
        }, {
          id: 1,
          value: "销量",
          isActive: false
        }, {
          id: 2,
          value: "价格",
          isActive: false
        }
      ],
      goodsList:[]
  },

  // 接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cid||"";
    this.QueryParams.query=options.query||"";
    this.getGoodsList();
  },

  // 总页数
  totalPages:1,

  // 获取商品列表数据
  async getGoodsList(){
    const res = await request({url:"/goods/search",data:this.QueryParams});
    // 获取总条数
    const total = res.total;
    // 计算总页数
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
    this.setData({
      // 拼接数组
      goodsList:[...this.data.goodsList,...res.goods]
    })

    // 关闭下拉刷新的窗口 如果没有调用下拉刷新窗口  直接关闭也不会报错
    wx.stopPullDownRefresh();
  },

  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e){
    // console.log(e); 
    // 1 获取被点击标题索引
    const {index} = e.detail;
    // 2 修改原数组
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 3 赋值到data中
    this.setData({
      tabs
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   * 下拉刷新页面
   */
  /*
    1 触发下拉刷新事件 需要在json文件开启一个配置项
      找到事件 添加逻辑
    2 重置数组
    3 重置页码 设置为1
    4 重新发送请求
    5 数据请求回来 手动关闭等待效果
  */
  onPullDownRefresh: function () {
    // 1 重置数组
    this.setData({
      goodsList:[]
    })
    // 重置页码
    this.QueryParams.pagenum=1;
    // 3 发送请求
    this.getGoodsList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  /*
  1 用户上滑页面 滚动条触底 开始加载下一页数据
    1 找到滚动条触底事件 微信小程序官方文档查找
    2 判断还有没有下一项数据
      1 获取到总页数  = Math.ceil(总条数 total/ 页容量 pagesize)
                     = Math.ceil(23/10)= 3 页
      2 获取到当前页码 pagenum
      3 判断一下 当前的页码是否大于等于 总页数
        表示没有下一页数据

    3 假如没有下一页数据弹出提示框
    4 假如还有下一页数据 加载下一页数据
      1 当前页码++
      2 重新发送请求
      3 数据请求回来 要对data中的数组进行拼接而不是全部替换！！
*/
  onReachBottom: function () {
    // 判断还有没有下一页数据
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据
      wx.showToast({ title: '没有下一页数据了' });
    } else {
      // 还有下一页数据
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})