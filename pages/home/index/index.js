const http = require("./../../../utils/http.js");
const app = getApp();

// 在页面中定义插屏广告
let interstitialAd = null;

Page({
  data: {
    pageSize: 10,
    pageNumber: 1,
    initPageNumber: 1,
    list:[],
    province:[],
    city:[],
    provinceName:[],
    selectCity:"全国",
    city:"",
    showData:true
  },
  onLoad: function (options) {
    console.log(options)
    if (options.city != undefined) {
      if(options.tab==2){
        wx.switchTab({
          url: '/pages/home/mall/index'
        })
      }else{
        this.setData({ city: options.city })
      }
    }

    wx.showLoading({
      title: '加载中',
      icon: "none"
    })
    this.list();

    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-2f60ccb8964f222a'
      })
      app.globalData.ad = interstitialAd;
      interstitialAd.onLoad(() => { })
      interstitialAd.onError((err) => { })
      interstitialAd.onClose(() => { })
    }
  },

  onReady:function(){
    console.log("ready")
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
  },

  openImag:function(e){
    wx.previewImage({
      current: e.currentTarget.dataset.attachment, 
      urls: [e.currentTarget.dataset.attachment] 
    })
  },

  copy:function(e){
    console.log(e)
    wx.setClipboardData({
      data: e.currentTarget.dataset.url,
      success: function (res) {
        wx.getClipboardData({
          success: function(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },

  bindRegionChange: function (e) {
    this.setData({
      selectCity: e.detail.value[1],
      city: e.detail.value[1],
      list:[],
      pageNumber: 1,
    })
    this.list();
  },

  list:function(){
    http.get(`/mask?page_size=${this.data.pageSize}&page_number=${this.data.pageNumber}&city=${this.data.city}&region=1`, {}, res => {
      wx.hideLoading();
      this.setData({ showGeMoreLoadin: false });
      let resData = res.data;
      if (resData.code == 0) {
        let listData = resData.data.page_data;
        if (listData) {
          let listMap = this.data.list;
          listData.map(item => {
            listMap.push(item);
          })
          var arr = Object.keys(resData.data.page_data)
          console.log(arr.length)
          console.log(this.data.pageNumber)
          this.setData({
            showData: arr.length <= 0 && this.data.pageNumber <= 1 ? false : true,
            list: listMap,
            pageNumber: this.data.pageNumber + 1,
            notDataTips: listMap.length >= 0 ? true : false,
          })
        }
      }
    });
  },

  /**
 * 上拉加载更多
 */
  onReachBottom: function () {
    this.setData({
      showGeMoreLoadin: true
    });
    this.list();
  },

  /**
 * 分享
 */
  onShareAppMessage: function (res) {
    //timg.jfif
    return {
      title: res.target.dataset.content + "【" + res.target.dataset.id + "口罩预约攻略"+"】",
      path: '/pages/home/index/index?tab=1&city='+res.target.dataset.id,
      imageUrl:"/images/timg.jpg",
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

})