import POST_DATA from '../../data/post-data.js'

Page({
  data: {

  },
  onLoad(options) {
    this.setData({
      posts_key: POST_DATA
    })
  },
  onPostTap(e) {
    const postId = e.currentTarget.dataset.postid
    wx.navigateTo({
      url: `./post-detail/post-detail?id=${postId}`
    })
  },
  onSwiperTap(e) {
    // target 和 currentTarget
    // target指的是当前点击的组件
    // currentTarget指的是事件捕获的组件
    // target这里指的是image，而currentTarget指的是swiper
    const postId = e.target.dataset.postid
    wx.navigateTo({
      url: `./post-detail/post-detail?id=${postId}`
    })
  }
})