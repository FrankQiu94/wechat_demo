Page({
  data: {
    nickName: '',
    avatar: ''
  },
  onTap() {
    wx.switchTab({
      url: "/pages/posts/post"
    })
  },
  getUserInfo() {
    const _this = this;
    wx.getUserInfo({
      success (res) {
        const {userInfo} = res
        _this.setData({
          nickName: userInfo.nickName,
          avatar: userInfo.avatarUrl
        })
      },
      fail (res) {
        console.log(res)
      }
    })
  }
})
///img/avatar.jpg