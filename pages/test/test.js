var fuc = require("../../utils/fuc.js");
var api = require("../../utils/api.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    exams:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let result =await fuc.request(api.getExamInfoByte_id,{te_id:19})
    let exams = result.data 
    this.setData({
      exams
    })
  },

})