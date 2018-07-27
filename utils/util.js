function convertToStarsArray(stars) {
  const num = parseFloat(stars) / 10
  const floatNum = parseFloat(num.toString().split('.')[1]) || 0
  let halfDone = false
  let array = []
  for (let i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(2)
    } else {
      if (floatNum != 0 && !halfDone) {
        array.push(1)
        halfDone = true
        continue
      }
      array.push(0)
    }
  }
  return array
}

function http(url, callback) {
  wx.request({
    url,
    header: {
      'Content-Type': 'application/xml'
    },
    method: 'GET',
    success(res) {
      callback(res.data)
    },
    fail(err) {
      console.log(err)
    }
  })
}

function convertToCastString(casts) {
  let castsjoin = ''
  for (let idx in casts) {
    castsjoin = `${castsjoin}${casts[idx].name} / `
  }
  return castsjoin.substring(0, castsjoin.length - 2)
}

function convertToCastInfos(casts) {
  const castsArray = []
  for (let idx in casts) {
    let cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name
    }
    castsArray.push(cast)
  }
  return castsArray
}

export { convertToStarsArray, http, convertToCastString, convertToCastInfos }