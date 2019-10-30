/**
 * 1 页面加载的时候
 *  1 从缓存中获取购物车数据 渲染到页面中
 *     这些数据 checked = true
 * 2 微信支付
 *  1 哪些人 哪些账号 可以实现微信支付
 *    1 企业账号 (个人账号无权限，无法测试)
 *    2 企业账号的小程序后台中 必须给开发者添加上白名单
 *      1 一个appid可以同时绑定多个开发者
 *      2 这些开发者公用这个appid和开发权限
 * 3 支付按钮
 *  1 先判断缓存有无token
 *  2 没有 跳到授权页面 获取token
 *  3 有token
 *  4 创建订单 获取订单编号
 *  5 已经完成微信支付
 *  6 手动删除缓存中 已经被选中了的商品
 *  7 删除后的购物车数据 填充回缓存中
 *  8 跳转页面
 */
import { getSetting,chooseAddress,openSetting,showModal,showToast, requestPayment} from "../../utils/asyncWx.js";
import regeneratorRuntime from "../../lib/runtime/runtime";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    // 总价格
    totalPrice:0,
    // 总数量
    totalNum:0
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync('address');
    // 2 获取缓存中的购物车数据
    let cart = wx.getStorageSync('cart')||[];
    // 过滤后的购物车数组
    cart = cart.filter(v=>v.checked);
    this.setData({address});

    // 1 总价格 总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      totalPrice+=v.num*v.goods_price;
      totalNum+=v.num;
    })
    // 5 6把购物车数据重新设置回data中 和缓存中
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },

  // 点击 支付
  async handleOrderPay(){
    try {
      // 1 判断缓存有无token
      const token=wx.getStorageSync('token');
      // 2 判断
      if(!token){
        wx.navigateTo({
          url: '/pages/auth/auth'
        });
        return;
      }
      // 3 创建订单
      // 3.1 准备请求头参数
      // const header={Authorization:token};
      // 3.2 准备请求体参数
      const order_price =this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods=[];
      cart.forEach(v=>goods.push({
        goods_id:v.goods_id,
        goods_number:v.num,
        goods_price:v.goods_price
      }))
      const orderParams={order_price,consignee_addr,goods}
      // 4 准备发送请求创建订单  获取订单编号
      const {order_number} = await request({url:"/my/orders/create",method:"POST",data:orderParams});
      // 5 准备发起预支付接口
      const {pay} = await request({url:"/my/orders/req_unifiedorder",method:"POST",data:{order_number}});
      // 6 发起微信支付
      await requestPayment(pay);
      // 7 查询后台 订单状态
      const res = await request({url:"/orders/chkOrder",method:"POST",data:{order_number}});
      
      await showToast({title:"支付成功"});
      // 8 手动删除缓存中 已经支付了的商品
      let newCart = wx.getStorageSync('cart');
      newCart=newCart.filter(v=>!v.checked);
      wx.setStorageSync('cart', newCart);
      // 9 支付成功跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/order'
      });
    } catch (error) {
      await showToast({title:"支付失败"});
      console.log(error);
    } 
  }
})