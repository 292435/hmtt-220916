<template>
  <div>
    <van-nav-bar title="黑马头条-登录" />
    <van-form @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        name="mobile"
        label="手机号"
        placeholder="请输入11位手机号"
        required
        :rules="[
          {
            pattern: RegExp(
              /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
            ),
            required: true,
            message: '请输入11位手机号'
          }
        ]"
      />
      <van-field
        v-model="user.code"
        type="password"
        name="code"
        label="密码"
        placeholder="请输入6位密码"
        required
        :rules="[
          {
            pattern: /^([0-9]){6}$/,
            required: true,
            message: '请输入6位密码'
          }
        ]"
      />
      <div style="margin: 16px">
        <van-button
          :loading="lod"
          :disabled="lod"
          :loading-text="loginState"
          round
          block
          type="info"
          native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { loginAPI } from '@/api/index.js'
import Notify from '@/ui/Notify'
import { setToken } from '@/utils/token'
import { setStorage } from '@/utils/storage'
export default {
  comments: {
    Notify
  },
  data() {
    return {
      user: {
        mobile: '14778683851',
        code: '246810'
      },
      loginState: '登录',
      lod: false
    }
  },
  methods: {
    async onSubmit(values) {
      this.loginState = '登录中...'
      this.lod = true
      try {
        const res = await loginAPI(this.user)
        Notify({ type: 'success', message: '登录成功' })
        setToken(res.data.data.token)
        setStorage('refresh_token', res.data.data.refresh_token)
        this.$router.replace({
          path: this.$route.query.path || '/layout/home'
        })
      } catch (err) {
        console.dir('login', err)
        if (err?.response?.status === 403) {
          Notify({ type: 'danger', message: '账号或密码错误！' })
        } else {
          Notify({ type: 'danger', message: '服务器错误' })
        }
      }
      this.loginState = '登录'
      this.lod = false
    }
  }
}
</script>

<style lang="less" scoped>
// .van-nav-bar {
//   background-color: #0077ff;
// }
// /deep/.van-nav-bar__title {
//   color: white;
// }
</style>
