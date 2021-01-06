var fuc = require("../../utils/fuc.js");
var api = require("../../utils/api.js");
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    subjects: [],
    subject: {},
    isLoading: true, // 判断是否尚在加载中
    abcd: app.globalData.abcd,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let subjects
    try{
      subjects = await this.getSubjects()
      console.log(subjects)
    }catch(e){
      console.log(`出错了`, e)
    }
    subjects = await this.formatSubjects(subjects)
    this.subjects = subjects
    let subject = await fuc.addOptions(subjects[2])
    await this.setData({
      subject,
      isLoading: false
    })
    console.log(subject)
  },
  // 获取题目
  async getSubjects() {
    let result
    let subjects
    try {
      result = await fuc.request(api.getLatexSubject)
    } catch (e) {
      console.log(`出错了`, e)
    }
    // console.log(result)
    if(result.data.code){
      subjects = result.data.data
      return subjects
    }
    throw new Error('no data') 
  },
  // 处理题目
  formatSubjects(subjects){
    let newSubjects
    newSubjects = fuc.latexToMarkdown(subjects);
    return newSubjects
  }
})