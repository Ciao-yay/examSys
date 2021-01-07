var fuc = require("../../utils/fuc.js");
var api = require("../../utils/api.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    subjects: [],
    subject: {},
    i:0
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
    this.data.subjects = subjects
    let subject = await fuc.addOptions(subjects[0])
    await this.setData({
      subject,
    })
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
  },
  // 切换题目
  nextSubject(){
    const subjects = this.data.subjects
    let i = this.data.i===12?0:(this.data.i+1)
    const subject = fuc.addOptions(subjects[i])
    this.data.i = i
    this.setData({
      subject:{},
    })
    this.setData({
      subject,
    })
    // console.log(this.getChooseAnwser())
  },
  // 监听子组件，获取选择的答案
  getChooseAnwser(e){
    return e?e.detail.yourAnwser:0
  }
})