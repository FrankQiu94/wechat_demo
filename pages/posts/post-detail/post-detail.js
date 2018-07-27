import POST_DATA from '../../../data/post-data.js'
const app = getApp()
const { globalData } = app

Page({
  data: {
    collected: false,
    isPlayingMusic: false
  },
  onLoad(options) {
    // 获取用户点击的卡片，获取相应的详情数据，渲染详情页
    const postId = options.id
    this.setData({
      currentPostId: postId
    });
    const postData = POST_DATA.find(v => {
      return v.postId.toString() === postId.toString()
    });
    this.setData({ postData })

    // 判断用户该文章是否收藏  storage中的posts_collected.typeof === array
    // posts_collected = [
    //   {
    //      postId: postId,
    //      ifCollected: false
    //   },{},{}...
    // ]
    const postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      let collected = postsCollected.find(v => {
        if (v.postId.toString() === postId.toString()) {
          return v
        }
      })
      collected = collected ? collected.ifCollected : false
      this.setData({
        collected: collected
      })
    } else {
      const postsCollectedObj = []
      postsCollectedObj.push({ postId, ifCollected: false })
      wx.setStorageSync('posts_collected', postsCollectedObj)
    }
    if (globalData.g_isPlayingMusic && globalData.g_currentMusicPostId === postId) {
      this.setData({
        isPlayingMusic: true
      })
    }
    this.setAudioMonitor()
  },
  setAudioMonitor() {
    // 监听音乐
    wx.onBackgroundAudioPlay(() => {
      this.setData({
        isPlayingMusic: true
      })
      globalData.g_isPlayingMusic = true
      globalData.g_currentMusicPostId = this.data.currentPostId
    })
    wx.onBackgroundAudioPause(() => {
      this.setData({
        isPlayingMusic: false
      })
      globalData.g_isPlayingMusic = false
      globalData.g_currentMusicPostId = null      
    })
    wx.onBackgroundAudioStop(() => {
      this.setData({
        isPlayingMusic: false
      })
      globalData.g_isPlayingMusic = false
      globalData.g_currentMusicPostId = null
    })
  },
  onCollectionTap() {
    this.getPostsCollectedSyc()
  },
  // 同步的方法
  getPostsCollectedSyc() {
    // 获取storage里所有的收藏状态 Array
    const postsCollected = wx.getStorageSync('posts_collected') || new Array()
    const postId = this.data.currentPostId
    let currentId = 0
    let collected = postsCollected.find((v, i) => {
      if (v.postId.toString() === postId.toString()) {
        currentId = i
        return v
      }
    });
    if (collected != null) {
      collected = !collected.ifCollected
      postsCollected[currentId].ifCollected = collected
    } else {
      collected = true;
      postsCollected.push({ postId, ifCollected: collected })
    }
    this.showToast(postsCollected, collected)
  },
  // 异步的方法
  getPostsCollectedAsyc() {
    const _this = this
    wx.getStorage({
      key: 'posts_collected',
      success: function (res) {
        const postsCollected = res.data || new Array()
        const postId = _this.data.currentPostId
        let currentId = 0
        let collected = postsCollected.find((v, i) => {
          if (v.postId.toString() === postId.toString()) {
            currentId = i
            return v
          }
        })
        if (collected != null) {
          collected = !collected.ifCollected
          postsCollected[currentId].ifCollected = collected
        } else {
          collected = true;
          postsCollected.push({ postId, ifCollected: collected })
        }
        _this.showToast(postsCollected, collected)
      }
    })
  },
  showToast(postsCollected, collected) {
    wx.setStorageSync('posts_collected', postsCollected)
    this.setData({
      collected: collected
    })
    wx.showToast({
      title: collected ? '收藏成功' : '取消成功',
      duration: 1000
    })
  },
  showModal(postsCollected, collected) {
    const _this = this
    wx.showModal({
      title: '收藏',
      content: collected ? "收藏该文章？" : "取消收藏该文章？",
      confirmText: '确认',
      confirmColor: '#405f80',
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync('posts_collected', postsCollected)
          _this.setData({
            collected: collected
          })
        }
      }
    })
  },
  onShare() {
    const itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function (res) {
        wx.showModal({
          title: `用户 ${itemList[res.tapIndex]}`,
          content: `用户是否取消？${res.cancel}现在无法实现分享功能，什么时候能支持呢`
        })
      }
    })
  },
  onMusicTap(e) {
    let isPlayingMusic = this.data.isPlayingMusic
    const currentIndex = POST_DATA.findIndex(v => {
      return v.postId.toString() === this.data.currentPostId.toString()
    })
    const postMusic = POST_DATA[currentIndex].music
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio()
      this.setData({
        isPlayingMusic: false
      })
      globalData.g_isPlayingMusic = false
    } else {
      wx.playBackgroundAudio({
        dataUrl: postMusic.url,
        title: postMusic.title,
        coverImgUrl: postMusic.coverImg
      })
      this.setData({
        isPlayingMusic: true
      })
      globalData.g_isPlayingMusic = true
      globalData.g_currentMusicPostId = this.data.currentPostId      
    }
  }
})