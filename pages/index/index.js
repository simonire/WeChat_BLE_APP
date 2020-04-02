//index.js
const app = getApp()
Page
({
    /**
     * 页面的初始数据
     */
    data: {

    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        var that = this;　　 // 设置菜单中的转发按钮触发转发事件时的转发内容　
        var shareObj = 
        {
            title: "LUMINODE", // 默认是小程序的名称(可以写slogan等)
            //path: '/pages/share/share', // 默认是当前页面，必须是以‘/’开头的完整路径
            imageUrl: '/images/azikaban.jpg', 
            //自定义图片路径
        };　　 // 来自页面内的按钮的转发
        　　
        return shareObj;
    }
})