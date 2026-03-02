// 获取云存储文件的临时链接
export const getCloudFileUrl = (fileID) => {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    wx.cloud.getTempFileURL({
      fileList: [fileID],
      success: (res) => {
        if (res.fileList && res.fileList.length > 0) {
          resolve(res.fileList[0].tempFileURL);
        } else {
          reject('获取链接失败');
        }
      },
      fail: reject
    });
    // #endif
  });
};

// 播放云存储中的音频
export const playCloudAudio = (fileID) => {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    wx.cloud.downloadFile({
      fileID: fileID,
      success: (res) => {
        const audioContext = wx.createInnerAudioContext();
        audioContext.src = res.tempFilePath;
        audioContext.play();
        resolve(audioContext);
      },
      fail: reject
    });
    // #endif
  });
};