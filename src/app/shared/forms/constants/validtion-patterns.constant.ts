export const ValidationPatterns = {
  password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/,
  userName: /^[a-z][a-z0-9._-]{1,24}$/i,
  email: /^[\w][\w\-.]+?@[\w][\w\-]+\.[\w\-]{2,4}$$/,
  string: /[a-zA-Z\u0621-\u064A0]+/u,
  phone: /^[0-9]{10,12}/,
  postalCode: /^[1-9][0-9]{1,5}/,
  onlyNumber: /^[0-9]*$/,
  onlyNumberWithDot: /^[0-9]*\.?[0-9]*$/,
  onlyNumberWithPresentage: /^[0-9]{1,100}/,
  onlyEnglishCharacters: /^[A-Za-z\s]+$/,
  onlyArabicCharacters: /^[\u0600-\u06FF\s]+$/
}
