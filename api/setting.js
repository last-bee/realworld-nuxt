import { request } from '@/plugins/request'


// get userInfo
export const getSettingInfo = () => {
  return request({
    method: 'GET',
    url: '/api/user',
  })
}

// update userInfo
export const submitSettingInfo = data => {
  return request({
    method: 'PUT',
    url: '/api/user',
    data,
  })
}