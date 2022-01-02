
export function forEachValue(obj, cb) { //用来循环对象
    Object.keys(obj).forEach(key => {
        cb(key, obj[key])
    })
}

