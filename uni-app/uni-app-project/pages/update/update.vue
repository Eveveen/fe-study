<template>
  <view>
    <button @click="checkNewVersion">检查更新</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentVersion: "1.1",
      latestVersion: "1.2",
    };
  },
  methods: {
    checkNewVersion() {
      let that = this;
      // 安卓
      if (uni.getSystemInfoSync().platform === "android") {
        // 当前版本小于最新版本 = 有新版本
        if (this.currentVersion < this.latestVersion) {
          uni.showModal({
            title: "检查更新",
            content: `当前版本v${this.currentVersion},发现新版本v${this.latestVersion},是否升级？`,
            success(res) {
              if (res.confirm) {
                uni.showToast({
                  icon: "none",
                  title: "正在下载",
                });
                // 想要下载的apk的地址
                let downloadUrl =
                  "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-hello-uniapp/f07650a0-4381-11eb-bc56-c9cea619f663.apk";
                that.download(downloadUrl);
              }
            },
            complete(res) {
              console.log("===res,", res);
            },
          });
        }
        // 已是最新版本
        else {
          uni.showToast({
            icon: "none",
            title: `当前已是最新版本v${this.currentVersion}`,
          });
        }
      }
    },
    // 通过链接下载apk
    download(url) {
      uni.downloadFile({
        url: url,
        success: (res) => {
          if (res.statusCode === 200) {
            // 安装
            plus.runtime.install(res.tempFilePath, {}, {}, function (error) {
              uni.showToast({
                title: "安装失败",
                mask: false,
                duration: 1500,
              });
            });
          }
        },
      });
    },
  },
};
</script>

<style>
</style>
