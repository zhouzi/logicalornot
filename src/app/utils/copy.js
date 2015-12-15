function copy (obj) {
  let c

  if (obj instanceof Array) {
    c = []

    for (let i = 0, len = obj.length; i < len; i++) {
      c.push(copy(obj[i]))
    }
  } else if (typeof obj === 'object') {
    c = {}

    for (let key in obj) {
      if (!obj.hasOwnProperty(key)) continue
      c[key] = obj[key]
    }
  }

  return c
}

export default copy
