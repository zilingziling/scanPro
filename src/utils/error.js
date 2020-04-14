
export const logError = (name, action, info) => {
  if (!info) {
    info = 'empty'
  }
  try {
    var device = JSON.stringify(deviceInfo)
  } catch (e) {
    console.error('请求出错')
  }
  // if (typeof action !== 'object') {
  // fundebug.notify(name, action, info)
  // }
  // fundebug.notifyError(info, { name, action, device, time })
  if (typeof info === 'object') {
    info = JSON.stringify(info)
  }
}
