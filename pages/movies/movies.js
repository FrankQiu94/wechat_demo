import { convertToStarsArray} from '../../utils/util.js'
const app = getApp()
const { globalData } = app
Page({
  data: {
    inTheaters: [],
    comingSoon: [],
    top250: [],
    searchResult: [],
    containerShow: true,
    searchPanelShow: false
  },

  onLoad(e) {
    const inTheatersUrl = `${globalData.g_doubanBase}/v2/movie/in_theaters?start=0&count=3`
    const comingSoon = `${globalData.g_doubanBase}/v2/movie/coming_soon?start=0&count=3`
    const top250Url = `${globalData.g_doubanBase}/v2/movie/top250?start=0&count=3`
    this.getMovieListData(inTheatersUrl, 'inTheaters', '正在热映')
    this.getMovieListData(comingSoon, 'comingSoon', '即将上映')
    this.getMovieListData(top250Url, 'top250', '豆瓣TOP250')
  },

  onMoreTap(e) {
    const category = e.currentTarget.dataset.category
    wx.navigateTo({
      url: `/pages/movies/more-movie/more-movie?category=${category}`
    })
  },

  onMovieTap(e) {
    const movieId = e.currentTarget.dataset.movieid
    wx.navigateTo({
      url: `./movie-detail/movie-detail?id=${movieId}`
    })
  },

  getMovieListData(url, settelKey, categoryTitle) {
    const _this = this
    wx.request({
      url,
      header: {
        'Content-Type': 'application/xml'
      },
      method: 'GET',
      success(res) {
        _this.processDoubanData(res.data, settelKey, categoryTitle)
      },
      fail(err) {
        console.log(err)
      }
    })
  },

  processDoubanData(moviesDouban, settelKey, categoryTitle) {
    let movies = []
    moviesDouban.subjects.forEach(v => {
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
    const readyData = {}
    readyData[settelKey] = {
      movies: movies,
      categoryTitle: categoryTitle
    }
    this.setData(readyData)
  },

  onBindFocus(e) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },

  onCancelImgTap (){
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: []
    })
  },

  onBindChange(e) {
    let text = e.detail.value
    let searchUrl = `${globalData.g_doubanBase}/v2/movie/search?q=${text}`
    this.getMovieListData(searchUrl, 'searchResult', '')
  }
})