// pages/wsDetail/wsDetail.js
const fuc = require('../../utils/fuc')
const api = require('../../utils/api')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sid:1,
    sub:{},
    answer:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let prbm_id = options.prbm_id
    fuc.request(api.getSubByid,{
      sid:app.globalData.userInfo.s_id,
      prbmid:prbm_id
    }).then(res => {
      let sub = res.data.sub[0]
      console.log(res.data)
      sub.question = app.towxml(sub.question, 'markdown')
      sub.optionA = app.towxml(sub.optionA, 'markdown')
      sub.optionB = app.towxml(sub.optionB, 'markdown')
      sub.optionC = app.towxml(sub.optionC, 'markdown')
      sub.optionD = app.towxml(sub.optionD, 'markdown')
      sub = fuc.addOptions(sub)
      console.log(res.data.answer)
      let answer = res.data.answer.map(item => item.answer).filter((item,i,self) => self.indexOf(item) === i)
      that.setData({
        sub,
        answer      
      })
    }).catch(err => {
      console.log(err)
    })
  }
})