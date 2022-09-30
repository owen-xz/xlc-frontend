import axios from 'axios'
import router from '../router'
import { ElMessage } from 'element-plus'

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
        ElMessage.error(err.response.data.message)
        router.push({name: 'Login'})
      } else if (err.response.status === 403) {
        ElMessage.error(err.response.data.message)
        router.back()
      }
      resolve({
        err: err.response
      })
    })
  }) as AxiosResponse
}
