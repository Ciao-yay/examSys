// pages/examDes/examDes.js
var app = getApp()
var api = require('../../utils/api.js')
var fuc = require('../../utils/fuc.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exam: {},
    replyDetail:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let exam,replyDetail
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      exam = data.exam
    })
    try{
      let res = await fuc.request(api.getReplyDetail,{tst_id:exam.tst_id})
      if(res.data.code){
        replyDetail = res.data.data
        replyDetail = this.parseLatex(replyDetail)
        console.log(replyDetail)
        this.setData({
          exam,
          replyDetail
        })
      }else{
        console.log("获取失败")
      }
    }catch(e){
      console.log(e)
    }
    console.log(exam)
  },
    /**
   * 跳转到详情
   */
  toDetail(e) {
    // console.log(e)
    let prbm_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../wsDetail/wsDetail?prbm_id=' + prbm_id,
    })
  },
  // 解析公式
  parseLatex(arr){
    return arr.map(item=>{
      item.question = app.towxml(item.question, 'markdown')
      return item
    })
  }
})