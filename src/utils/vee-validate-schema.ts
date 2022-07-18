export default {
  name(value: string) {
    if(!value || !value.length) return '請輸入姓名'
    return true
  },
  email(value: string) {
    //eslint-disable-next-line
    const regex = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
    if (!value || !value.length) return '請輸入 Email'
    if (!regex.test(value)) {
      return 'Email 格式錯誤';
    }
    return true;
  },
  password(value: string) {
    const regex = /^[A-Za-z0-9]{8,12}$/
    if (!value || !value.length) return '請輸入密碼'
    if (!regex.test(value)) {
      return '密碼格式錯誤，限 8 ~ 12 英數字';
    }
    return true;
  },
  confirmPassword(value: string) {
    const regex = /^[A-Za-z0-9]{8,12}$/
    if (!value || !value.length) return '請再次輸入密碼'
    if (!regex.test(value)) {
      return '密碼格式錯誤，限 8 ~ 12 英數字';
    }
    return true;
  },
  loginEmail(value: string) {
    if(!value || !value.length) return '請輸入 Email'
    return true
  },
  loginPassword(value: string) {
    if(!value || !value.length) return '請輸入密碼'
    return true
  },
  productName(value: string) {
    if(!value || !value.length) return '請輸入商品名稱'
    return true
  },
  productType(value: string) {
    if(!value || !value.length) return '請選擇商品類型'
    return true
  },
  productOptionName(value: string) {
    if(!value || !value.length) return '請輸入品項名稱'
    return true
  },
  productOptionPrice(value: number) {
    if(!value || value < 0) return '請輸入價格'
    return true
  },
  productOptionDiscountPrice(value: number) {
    if(!value || value < 0) return '請輸入折扣價格'
    return true
  },
  productOptionCount(value: number) {
    if(!value || value < 0) return '請輸入數量'
    return true
  },
}