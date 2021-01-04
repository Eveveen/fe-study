<template>
  <view class="content">
    <uni-list class="uni-list">
      <uni-list-item
        title="更新版本"
        :clickable="true"
        @click="toUpdate"
      ></uni-list-item>
    </uni-list>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: "Hello",
    };
  },
  onLoad() {},
  methods: {
    toUpdate() {
      uni.navigateTo({
        url: "/pages/update/update",
      });
    },
  },
};
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.uni-list {
  width: 100%;
  margin-top: 10px;
}
</style>
