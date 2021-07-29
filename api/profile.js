import { request } from '@/plugins/request'

export const getProfilesByName = (name) => {
  return request({
    method: 'GET',
    url: `/api/profiles/${name}`,
  })
}


export const getMyArticles = (author, offset, limit = 5) => {
  return request({
    method: 'GET',
    url: '/api/articles',
    params: {
      author,
      offset,
      limit
    }
  })
}
// /api/articles?favorited=lastbee&limit=5&offset=0

export const getFavoritedArticles = (favorited, offset, limit = 5) => {
  return request({
    method: 'GET',
    url: '/api/articles',
    params: {
      favorited,
      limit,
      offset
    }
  })
}
//
export const changeFavorite = (method, id) => {
  return request({
    method,
    url: `/api/articles/${ id }/favorite`
  })
}