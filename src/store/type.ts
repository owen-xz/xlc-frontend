interface PageList {
  [key: string]: {
    [key: string]: {
      id: number
      name: string
    }[] 
  }
}

export interface RootState {
  isLoading: boolean
  isSidebarCollapse: boolean
  pageList: PageList
}
