import axios from 'axios'
import router from '../router'

interface CreateAxiosParams {
  apiUrl: string
  method: string
  restfulParam?: any
  params?: any
  isAdmin?: boolean
}

interface AxiosResponse {
  res?: any
  err?: any
}

export const createAxios = ({
  method,
  ...config
}: CreateAxiosParams) => {
  // url
  const restfulParam = config.restfulParam || {}
  let tempUrl = config.apiUrl
  Object.keys(restfulParam).forEach((key) => {
    tempUrl = tempUrl?.replace(`{${key}}`, restfulParam[key])
  })
  const baseUrl = process.env.VUE_APP_XLC_API
  const url = baseUrl + tempUrl

  // params
  let params = undefined as any
  let data = undefined as any
  if(method === 'GET') {
    params = config.params
  } else {
    data = config.params
  }
  
  // Authorization
  const token = localStorage.getItem('token') || ''
  const Authorization = config.isAdmin ? `Bearer ${token}` : ''
  
  return new Promise ((resolve, reject) => {
    axios({
      method,
      url,
      params,
      data,
      headers: {
        Authorization
      }
    })
    .then((res: any) => {
      resolve({
        res: res.data
      })
    })
    .catch((err: any) => {
      if(err.response.status === 401) {
        router.push({name: 'Login'})
      }
      resolve({
        err: err.response
      })
    })
  }) as AxiosResponse
}
