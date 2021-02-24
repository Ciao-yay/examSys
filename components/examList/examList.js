// components/examList/examList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    exams:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    checkExam(e){
      console.log(e.currentTarget.dataset)
      this.setData({ show: true });
    },

    onClose() {
      this.setData({ show: false });
    },
  }
})
