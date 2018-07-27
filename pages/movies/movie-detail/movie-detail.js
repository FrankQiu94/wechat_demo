import { http, convertToStarsArray, convertToCastString, convertToCastInfos } from '../../../utils/util.js'
const app = getApp()
const { globalData } = app
Page({
  data: {
    movie: {}
  },

  onLoad(options) {
    const movieId = options.id
    const url = `${globalData.g_doubanBase}/v2/movie/subject/${movieId}`
    http(url, this.processDoubanData)
  },

  processDoubanData(data) {
    if (!data) {
      return
    }
    const director = {
      avatar: "",
      name: "",
      id: ""
    }
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name
      director.id = data.directors[0].id
    }
    const movie = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      generes: data.genres.join("、"),
      stars: convertToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: convertToCastString(data.casts),
      castsInfo: convertToCastInfos(data.casts),
      summary: data.summary
    }
    this.setData({ movie })
  },

  viewMoviePostImg(e) {
    const src = e.currentTarget.dataset.src
    console.log(e)
    wx.previewImage({
      current: src,
      urls: [src]
    })
  }
})