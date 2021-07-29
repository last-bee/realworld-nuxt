export const compact = (data) => {
  let result = {}
  if(Array.isArray(data)) {
    data.forEach(key => {

    })
  } else if(typeof data === 'object') {
    Object.keys(data).forEach(key => {
      result[key] = compact(data[key])
    })
  } else if(typeof data === 'string') {
    return 
  }
}