<template>
  <!-- 一条文章单元格 -->

  <div>
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>{{ itemObj.title }}</span>
          <lazy-component>
            <img
              v-if="itemObj.cover.type === 1"
              class="thumb"
              v-lazy="itemObj.cover.images[0]"
              alt=""
            />
          </lazy-component>
        </div>
        <!-- 三张图片 -->
        <div v-if="itemObj.cover.type > 1" class="thumb-box">
          <lazy-component>
            <img
              class="thumb"
              v-for="(Img, ind) in itemObj.cover.images"
              v-lazy="Img"
              :key="ind"
            />
          </lazy-component>
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <div>
            <span>{{ itemObj.cover.type }}</span>
            <span>{{ itemObj.comm_count }}评论</span>
            <span>{{ formatTime(itemObj.pubdate) }}</span>
          </div>
          <!-- 反馈按钮 -->
          <van-icon name="cross" @click.stop="show = true" v-if="isShow" />
        </div>
      </template>
    </van-cell>
    <van-action-sheet
      v-model="show"
      :actions="actions"
      get-container="body"
      :cancel-text="buttonText"
      @select="onSelect"
      @cancel="onCancel"
      @close="clickOverlayFn"
    />
  </div>
</template>

<script>
import { timeAgo } from '@/utils/date'
import { firstActions, secondActions } from '@/api/report'
import { getToken } from '@/utils/token'

export default {
  props: {
    itemObj: {
      type: Object
    },
    isShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      show: false,
      actions: firstActions,
      buttonText: '取消'
    }
  },
  methods: {
    formatTime: timeAgo,
    onSelect(actions, item) {
      // 默认情况下点击选项时不会自动收起
      // 可以通过 close-on-click-action 属性开启自动收起
      console.log(actions)
      console.log(item)
      if (actions.name === '反馈垃圾内容') {
        this.actions = secondActions
        this.buttonText = '返回'
      } else if (actions.name === '不感兴趣') {
        // console.log(this.itemObj)
        console.log(getToken())
        this.$emit('dislikeEv', this.itemObj.art_id)
        this.show = false
      } else {
        this.$emit('reportsEv', this.itemObj.art_id, actions.value)
        this.show = false
      }
    },
    onCancel() {
      if (this.buttonText === '返回') {
        this.show = true
        this.buttonText = '取消'
        this.actions = firstActions
      }
    },
    clickOverlayFn() {
      if (this.buttonText === '返回') {
        this.show = false
        this.buttonText = '取消'
        this.actions = firstActions
      }
    }
  }
}
</script>
<style scoped lang="less">
/* 标题样式 */
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* label描述样式 */
.label-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 文章信息span */
.label-box span {
  margin: 0 3px;
  &:first-child {
    margin-left: 0;
  }
}
/* 图片的样式, 矩形黄金比例：0.618 */
.thumb {
  width: 113px;
  height: 70px;
  background-color: #f8f8f8;
  object-fit: cover;
}

/* 三图, 图片容器 */
.thumb-box {
  display: flex;
  justify-content: space-between;
}
</style>
