// components/SubjectShow/SubjectShow.js

Component({
    /**
     * 组件的生命周期
     */
    lifetimes: {
        detached: function() {
          // 清除数据监视，好像没得用
          observers:null
        },
      },
    /**
     * 组件的样式
     */
    options: {
        styleIsolation: 'apply-shared'
    },

    /**
     * 组件的属性列表
     */
    properties: {
        subject: {
            type: Object,
            value: {}
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        abcd: [{
            id: 0,
            name: "A",
            isSelected: false,
        }, {
            id: 1,
            name: "B",
            isSelected: false,
        }, {
            id: 2,
            name: "C",
            isSelected: false,
        }, {
            id: 3,
            name: "D",
            isSelected: false,
        }],
        yourAnswer: ""
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 切换选项
        selectFuc(e) {
            var id = e.currentTarget.dataset.id;
            var abcd = this.data.abcd;
            abcd.forEach((item, index) => {
                if (id === index) {
                    item.isSelected = true
                    this.data.yourAnswer = item.name
                    this.deliverAnwser()
                } else {
                    item.isSelected = false
                }
            })
            this.setData({
                abcd: abcd,
            });
        },
        // 触发父组件监听，向父组件传递答案
        deliverAnwser() {
            this.triggerEvent("getchooseanwser", { yourAnwser: this.data.yourAnswer })
        }
    },
    /**
     * 监听题目变化，清除选项颜色
     */
    observers: {
        'subject':function() {
            this.setData({
                abcd: [{
                    id: 0,
                    name: "A",
                    isSelected: false,
                }, {
                    id: 1,
                    name: "B",
                    isSelected: false,
                }, {
                    id: 2,
                    name: "C",
                    isSelected: false,
                }, {
                    id: 3,
                    name: "D",
                    isSelected: false,
                }]
            })
        }
    }
})
