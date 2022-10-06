import { createAxios } from '@/utils/api'
import {
  PageListParams
} from './FEModel'

export const fetchPageList = (restfulParam: PageListParams) => {
  return createAxios({
    apiUrl: 'common/pageList/{featureName}',
    method: 'GET',
    restfulParam
  })
}
