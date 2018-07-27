// pages/movies/more-movie/more-movie.js
import { http, convertToStarsArray } from '../../../utils/util.js'

const app = getApp()
const { globalData } = app

Page({
  data: {
    movies: {},
    category: '',
    requestUrl: '',
    totalCount: 0,
    isEmpty: true
  },

  onLoad(options) {
    const category = options.category
    this.setData({ category })
    let requestUrl = ''
    switch (category) {
      case '正在热映':
        requestUrl = `${globalData.g_doubanBase}/v2/movie/in_theaters`
        break
      case '即将上映':
        requestUrl = `${globalData.g_doubanBase}/v2/movie/coming_soon`
        break
      case '豆瓣TOP250':
        requestUrl = `${globalData.g_doubanBase}/v2/movie/top250`
        break
    }
    this.setData({ requestUrl })
    http(requestUrl, this.processDoubanData)
  },

  onReady() {
    wx.setNavigationBarTitle({
      title: this.data.category
    })
  },

  processDoubanData(data) {
    let movies = []
    data.subjects.forEach(v => {
      let { title } = v
      if (title.length >= 6) {
        title = `${title.substring(0, 6)}...`
      }
      const temp = {
        title,
        average: v.rating.average,
        coverageUrl: v.images.large,
        movieId: v.id,
        stars: convertToStarsArray(v.rating.stars)
      }
      movies.push(temp)
    })
    let totalMovies = {}
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies)
    } else {
      totalMovies = movies
      this.data.isEmpty = false
    }
    this.setData({ movies: totalMovies })
    this.setData({
      totalCount: this.data.totalCount += 20
    })
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onReachBottom(e) {
    let nextUrl = `${this.data.requestUrl}?start=${this.data.totalCount}&count=20`
    http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },

  onPullDownRefresh(e) {
    let refreshUrl = `${this.data.requestUrl}?start=0&count=20`
    this.setData({
      movies: {},
      isEmpty: true,
      totalCount: 0
    })
    http(refreshUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },

  onMovieTap(e) {
    const movieId = e.currentTarget.dataset.movieid
    wx.navigateTo({
      url: `/pages/movies/movie-detail/movie-detail?id=${movieId}`
    })
  }
})