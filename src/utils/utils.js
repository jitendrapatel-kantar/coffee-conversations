function formateDateTime(isoDate) {
  let formatedDate = isoDate.slice(0, isoDate.indexOf('T'))
  let formatedTime = isoDate.slice(isoDate.indexOf('T')+1, isoDate.lastIndexOf(':'))
  return {formatedDate, formatedTime}
}

export {formateDateTime}