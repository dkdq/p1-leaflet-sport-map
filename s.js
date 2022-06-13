for (each of data) {
  if (newdata.length == 0) {
    newdata.push(
      {
        station: each.station,
        no: [each.no]
      }
    )
  }
  else {
    let found = false
    for (item of newdata) {
      if (item.station == each.station) {
        item.no.push(each.no)
        found = true
      }
    }
    if (found == false) {
      newdata.push(
        {
          station: each.station,
          no: [each.no]
        }
      )
    }
  }

}
console.log(newdata)