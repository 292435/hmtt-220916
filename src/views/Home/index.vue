<template>
  <div>
    <van-nav-bar fixed>
      <template #right>
        <van-icon
          name="search"
          size="0.48rem"
          color="white"
          @click="toSearchFn"
        />
      </template>
      <template #left>
        <img src="@/assets/toutiao_logo.png" class="logo" alt="" srcset="" />
      </template>
    </van-nav-bar>

    <van-tabs v-model="active" animated sticky offset-top="1.226666rem">
      <van-tab :title="obj.name" v-for="obj in getUserChannel" :key="obj.id">
        <ArticleList :itemId="obj.id"></ArticleList>
      </van-tab>
    </van-tabs>
    <!-- 编辑频道图标 -->
    <van-icon
      name="plus"
      size="0.37333334rem"
      class="moreChannels"
      @click="showPopup"
    />
    <!-- 弹出层内容 -->
    <van-popup
      v-model="show"
      duration="0.05"
      :style="{ height: '100%', width: '100%' }"
    >
      <ChannelEdit
        :userList="getUserChannel"
        :moreList="unChooseChannelFn"
        @addChannelEv="addChannelFn"
        @delChannelEv="delChannelFn"
        @delpannelEv="show = false"
        @goChannelEv="goChannelFn"
      ></ChannelEdit>
    </van-popup>
  </div>
</template>

<script>
import {
  getUserChannelAPI,
  allChannelListAPI,
  updateUserChannelAPI,
  removeTheChannelAPI
} from '@/api'
import ArticleList from './components/ArticleList.vue'
import ChannelEdit from '@/views/Home/ChannelEdit.vue'
export default {
  data() {
    return {
      active: 0,
      getUserChannel: [], // 用户的频道
      allChannelList: [], // 所有的频道
      show: false
    }
  },
  methods: {
    goChannelFn(item) {
      console.log(item)
      this.active = item
      this.show = false
    },
    showPopup() {
      this.show = true
    },
    async addChannelFn(obj) {
      this.getUserChannel.push(obj)
      const newArrlist = this.getUserChannel.filter((obj) => obj.id !== 0)
      const newArr = newArrlist.map((obj, index) => {
        const Arr = { ...obj }
        delete Arr.name
        Arr.seq = index
        return Arr
      })
      const res = await updateUserChannelAPI(newArr)
      console.log(res)
    },
    async delChannelFn(obj) {
      const index = this.getUserChannel.findIndex((item) => item.id === obj.id)
      this.getUserChannel.splice(index, 1)
      const res = await removeTheChannelAPI(obj.id)
      console.log(res)
      const res1 = await updateUserChannelAPI(this.getUserChannel)
      console.log(res1)
    },
    toSearchFn() {
      this.$router.push('/search')
    }
  },
  async created() {
    const res1 = await getUserChannelAPI()
    const res2 = await allChannelListAPI()
    this.getUserChannel = res1.data.data.channels
    this.allChannelList = res2.data.data.channels
    console.log(this.getUserChannel)
    console.log(this.allChannelList)
    // console.log('getUserChannel', this.getUserChannel)
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  computed: {
    unChooseChannelFn() {
      const newArr = this.allChannelList.filter((bigObj) => {
        const index = this.getUserChannel.findIndex((smallObj) => {
          return smallObj.id == bigObj.id
        })
        if (index === -1) return true
        return false
      })
      return newArr
    }
  }
}
</script>

<style scoped lang="less">
.logo {
  width: 100px;
  height: 30px;
}
.van-tabs {
  padding-top: 46px;
}
// 设置 tabs 容器的样式
/deep/ .van-tabs__wrap {
  padding-right: 30px;
  background-color: #fff;
}

// 设置小图标的样式
.moreChannels {
  position: fixed;
  top: 62px;
  right: 8px;
  z-index: 999;
}
</style>
