<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img :src="$store.state.userPhoto" alt="" class="avatar" />
        </template>
        <template #title>
          <span class="username">{{ $store.state.userName }}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{ userObj.art_count }}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{ userObj.follow_count }}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{ userObj.fans_count }}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link to="/user_edit" />
      <van-cell icon="chat-o" title="小思同学" is-link @click="robotFn" />
      <van-cell icon="warning-o" title="退出登录" is-link @click="editFn" />
    </van-cell-group>
  </div>
</template>

<script>
import { userInfoAPI } from '@/api'
import { Dialog } from 'vant'
import { removeToken } from '@/utils/token'
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      userObj: {}
    }
  },
  async created() {
    const res = await userInfoAPI()
    this.userObj = res.data.data
    console.log(res)
    // this.$store.commit('USER_PHOTO', this.userObj.photo)
    this.USER_PHOTO(this.userObj.photo)
    // this.USER_NAME(this.userObj.name)
  },
  methods: {
    editFn() {
      Dialog.confirm({
        title: '  ',
        message: '确认退出登录？'
      })
        .then(() => {
          // on confirm
          removeToken()
          this.$router.replace('/login')
        })
        .catch(() => {
          // on cancel
        })
    },
    robotFn() {
      this.$router.push('/chat')
    },
    ...mapMutations(['USER_PHOTO'], ['USER_NAME'])
  }
}
</script>

<style scoped lang="less">
.user-container {
  .user-card {
    background-color: #007bff;
    color: white;
    padding-top: 20px;
    .van-cell {
      background: #007bff;
      color: white;
      &::after {
        display: none;
      }
      .avatar {
        width: 60px;
        height: 60px;
        background-color: #fff;
        border-radius: 50%;
        margin-right: 10px;
      }
      .username {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }
  .user-data {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    font-size: 14px;
    padding: 30px 0;
    .user-data-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 33.33%;
    }
  }
}
</style>
