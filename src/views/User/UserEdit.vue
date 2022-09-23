<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
      fixed
    />
    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image
            round
            class="avatar"
            :src="profilesObj.photo"
            @click="selectImgFn"
          />
          <!-- file 选择框 -->
          <input
            type="file"
            ref="iptFile"
            v-show="false"
            accept="image/*"
            @change="onFileChange"
          />
        </template>
      </van-cell>
      <van-cell
        title="名称"
        is-link
        :value="profilesObj.name"
        @click="changeNameFn"
      />
      <!-- 名称弹出框 -->
      <van-dialog
        v-model="show"
        title="标题"
        show-cancel-button
        :before-close="beforeCloseFn"
      >
        <input type="text" v-focus v-model="nameValue" />
      </van-dialog>
      <van-cell
        title="生日"
        is-link
        :value="profilesObj.birthday"
        @click="birthdayClickFn"
      />
    </van-cell-group>
    <van-popup
      v-model="timePickerShow"
      position="bottom"
      :style="{ height: '50%' }"
      round
    >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="closeDatePickerFn"
        @confirm="confirmDatePickerFn"
      />
    </van-popup>
  </div>
</template>

<script>
import { profilesAPI, updatePhotoAPI, profileAPI } from '@/api'
import Notify from '@/ui/Notify'
import { formatDate } from '@/utils/date'
import { mapMutations } from 'vuex'
export default {
  data() {
    return {
      profilesObj: {},
      show: false,
      timePickerShow: false,
      nameValue: '',
      minDate: new Date(1920, 0, 1),
      maxDate: new Date(),
      currentDate: new Date()
    }
  },
  methods: {
    ...mapMutations(['USER_PHOTO', 'USER_NAME']),
    async beforeCloseFn(action, done) {
      if (action === 'confirm') {
        const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,7}$/
        if (reg.test(this.nameValue) === true) {
          Notify({ type: 'success', message: '更新名称成功' })
          const res = await profileAPI({
            name: this.nameValue,
            gender: this.profilesObj.gender,
            birthday: this.profilesObj.birthday,
            real_name: this.profilesObj.name,
            intro: '很帅'
          })
          this.profilesObj.name = this.nameValue
          this.USER_NAME(this.nameValue)
          console.log(res)
          done()
        } else {
          Notify({ type: 'warning', message: '请输入1-7位中英文字符' })
          done(false)
        }
      } else {
        console.log(action)
        done()
      }
    },
    async changeNameFn() {
      this.show = true
      this.nameValue = this.profilesObj.name
    },
    async onFileChange(e) {
      console.log(e.target.files[0])
      if (e.target.files[0] == undefined) {
        return
      }
      // console.log(e.target.files[0])
      const theImg = new FormData()
      theImg.append('photo', e.target.files[0])
      const res = await updatePhotoAPI(theImg)
      // console.log(res)
      this.profilesObj.photo = res.data.data.photo
      this.USER_PHOTO(res.data.data.photo)
    },
    selectImgFn() {
      this.$refs.iptFile.click()
    },
    birthdayClickFn() {
      this.timePickerShow = true
      // console.log(this.profilesObj.birthday)
      this.currentDate = new Date(this.profilesObj.birthday)
    },
    closeDatePickerFn() {
      this.timePickerShow = false
    },
    async confirmDatePickerFn() {
      await profileAPI({
        birthday: formatDate(this.currentDate)
      })
      this.profilesObj.birthday = formatDate(this.currentDate)
      this.timePickerShow = false
    }
  },
  async created() {
    const res = await profilesAPI()
    this.profilesObj = res.data.data
  }
}
</script>

<style lang="less" scoped>
.user-edit-container {
  padding-top: 46px;
  .avatar {
    width: 50px;
    height: 50px;
  }
}
/deep/.van-dialog__content {
  text-align: center;
  input {
    text-align: center;
    border: 0;
    padding: 0;
  }
}
</style>
