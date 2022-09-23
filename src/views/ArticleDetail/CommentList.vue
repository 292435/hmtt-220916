<template>
  <div>
    <!-- 评论列表 -->
    <div
      class="cmt-list"
      :class="{
        'art-cmt-container-1': isShowCmt,
        'art-cmt-container-2': !isShowCmt
      }"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="到底了~~"
        :immediate-check="false"
        @load="onLoad"
      >
        <!-- 评论的 Item 项 -->
        <div
          class="cmt-item"
          v-for="(obj, ind) in commentList"
          :key="obj.com_id"
        >
          <!-- 头部区域 -->
          <div class="cmt-header">
            <!-- 头部左侧 -->
            <div class="cmt-header-left">
              <img :src="obj.aut_photo" alt="" class="avatar" />
              <span class="uname">{{ obj.aut_name }}</span>
            </div>
            <!-- 头部右侧 -->
            <div class="cmt-header-right">
              <van-icon
                name="like"
                size="16"
                color="red"
                v-if="obj.is_liking === true"
                @click="loveCommentFn(true, ind)"
              />
              <van-icon
                name="like-o"
                size="16"
                color="gray"
                v-else
                @click="loveCommentFn(false, ind)"
              />
            </div>
          </div>
          <!-- 主体区域 -->
          <div class="cmt-body">
            {{ obj.content }}
          </div>
          <!-- 尾部区域 -->
          <div class="cmt-footer">{{ timeAgo(obj.pubdate) }}</div>
        </div>
      </van-list>
    </div>

    <!-- 底部添加评论区域 - 1 -->
    <div class="add-cmt-box van-hairline--top" v-if="isShowCmt === true">
      <van-icon name="arrow-left" size="0.48rem" @click="$router.back()" />
      <div class="ipt-cmt-div" @click="isShowCmt = false">发表评论</div>
      <div class="icon-box">
        <van-badge :content="totalCount > 0 ? totalCount : ''" max="99">
          <van-icon
            name="comment-o"
            size="0.53333334rem"
            @click="commendScrollFn"
          />
        </van-badge>
        <van-icon
          name="star-o"
          size="0.53333334rem"
          color="red"
          @click="collectionFn(true)"
          v-if="collectedState === true"
        />
        <van-icon
          name="star-o"
          size="0.53333334rem"
          @click="collectionFn(false)"
          v-else
        />
        <van-icon
          name="share-o"
          size="0.53333334rem"
          @click="showShare = true"
        />
        <!-- 分享面板 -->
        <van-share-sheet
          v-model="showShare"
          title="立即分享给好友"
          :options="options"
          @select="onSelect"
        />
      </div>
    </div>

    <!-- 底部添加评论区域 - 2 -->
    <div class="cmt-box van-hairline--top" v-else>
      <textarea
        placeholder="友善评论、理性发言、阳光心灵"
        v-focus
        @blur="blurFn"
        v-model.trim="comtext"
      ></textarea>
      <van-button
        type="default"
        :disabled="comtext.length === 0"
        @click="sendCommentFn"
        >发布</van-button
      >
    </div>
  </div>
</template>

<script>
import {
  commentsAPI,
  commentsLikeAPI,
  uncommentsLikeAPI,
  setCommentsAPI,
  collectionsAPI,
  detailAPI,
  unCollectionsAPI
} from '@/api'
import { timeAgo } from '@/utils/date'
import { Toast } from 'vant'
export default {
  data() {
    return {
      offset: null,
      commentList: [],
      isShowCmt: true,
      totalCount: '',
      comtext: '',
      loading: false,
      finished: false,
      lastId: null, // 评论列表最后一条数据id
      collectedState: false, // 文章是否被收藏
      showShare: false,
      options: [
        { name: '微信', icon: 'wechat' },
        { name: '微博', icon: 'weibo' },
        { name: '复制链接', icon: 'link' },
        { name: '分享海报', icon: 'poster' },
        { name: '二维码', icon: 'qrcode' }
      ]
    }
  },
  async created() {
    const res = await commentsAPI({
      id: this.$route.query.art_id,
      offset: this.offset
    })
    this.commentList = res.data.data.results
    this.totalCount = res.data.data.total_count
    this.lastId = res.data.data.last_id
    if (this.commentList.length == 0) {
      this.finished = true
    }
    // console.log('commentsAPI', res)
    const res2 = await detailAPI({ article_id: this.$route.query.art_id })
    this.collectedState = res2.data.data.is_collected
  },
  methods: {
    onSelect(option) {
      Toast(option.name)
      this.showShare = false
    },
    blurFn() {
      setTimeout(() => {
        return (this.isShowCmt = true)
      }, 0)
    },
    timeAgo,
    async loveCommentFn(bool, index) {
      if (bool === true) {
        const res = await uncommentsLikeAPI({
          target: this.commentList[index].com_id
        })
        console.log('不喜欢', res)
        this.commentList[index].is_liking = false
      } else {
        const res = await commentsLikeAPI({
          com_id: this.commentList[index].com_id
        })
        console.log('喜欢', res)
        this.commentList[index].is_liking = true
      }
    },
    // 评论列表滚动
    commendScrollFn() {
      const now = window.scrollY
      let dist = document.querySelector('.art-content').offsetHeight
      console.log(now, dist)
      console.dir(window)
      if (dist > document.documentElement.scrollHeight - window.innerHeight) {
        dist = document.documentElement.scrollHeight - window.innerHeight
      }
      const step = (dist - now) / 10
      console.log(step)
      setTimeout(() => {
        if (Math.abs(step) < 1) {
          // 判断是否滚动结束-步长值, 迈不动小于1停止 (step < 1 && step > 0)
          window.scrollTo(0, dist) // 动画停止了, 把文章高度设置为卷入值(精度对准)
          return
        }
        window.scrollTo(0, now + step)
        this.commendScrollFn()
      }, 10)
    },
    // 发表评论
    async sendCommentFn() {
      const res = await setCommentsAPI({
        target: this.$route.query.art_id,
        content: this.comtext
      })
      this.commentList.unshift(res.data.data.new_obj)
      console.log('send', res)
      this.comtext = ''
      this.totalCount = this.commentList.length
      this.commendScrollFn()
    },
    async onLoad() {
      if (this.commentList.length > 0) {
        const res = await commentsAPI({
          id: this.$route.query.art_id,
          offset: this.lastId
        })
        this.commentList = [...this.commentList, ...res.data.data.results]
        this.lastId = res.data.data.last_id
        if (res.data.data.last_id === null) {
          this.finished = true
        }
        this.loading = false
      } else {
        this.finished = true
        this.loading = false
      }
    },
    async collectionFn(bool) {
      if (bool === true) {
        const res = await unCollectionsAPI({ target: this.$route.query.art_id })
        this.collectedState = false
        console.log(res)
      } else {
        const res = await collectionsAPI({ target: this.$route.query.art_id })
        this.collectedState = true
        console.log(res)
      }
    }
  }
}
</script>

<style scoped lang="less">
.cmt-list {
  padding: 10px;
  padding-bottom: 46px;
  .cmt-item {
    padding: 15px 0;
    + .cmt-item {
      border-top: 1px solid #f8f8f8;
    }
    .cmt-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .cmt-header-left {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          background-color: #f8f8f8;
          border-radius: 50%;
          margin-right: 15px;
        }
        .uname {
          font-size: 12px;
        }
      }
    }
    .cmt-body {
      font-size: 14px;
      line-height: 28px;
      text-indent: 2em;
      margin-top: 6px;
      word-break: break-all;
    }
    .cmt-footer {
      font-size: 12px;
      color: gray;
      margin-top: 10px;
    }
  }
  /*美化 - 文章详情 - 底部的评论页面 */
  // 外层容器
  .art-cmt-container-1 {
    padding-bottom: 46px;
  }
  .art-cmt-container-2 {
    padding-bottom: 80px;
  }

  // 发布评论的盒子 - 1
  .add-cmt-box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 46px;
    line-height: 46px;
    padding-left: 10px;
    .ipt-cmt-div {
      flex: 1;
      border: 1px solid #efefef;
      border-radius: 15px;
      height: 30px;
      font-size: 12px;
      line-height: 30px;
      padding-left: 15px;
      margin-left: 10px;
      background-color: #f8f8f8;
    }
    .icon-box {
      width: 40%;
      display: flex;
      justify-content: space-evenly;
      line-height: 0;
    }
  }

  .child {
    width: 20px;
    height: 20px;
    background: #f2f3f5;
  }

  // 发布评论的盒子 - 2
  .cmt-box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    padding-left: 10px;
    box-sizing: border-box;
    background-color: white;
    textarea {
      flex: 1;
      height: 66%;
      border: 1px solid #efefef;
      background-color: #f8f8f8;
      resize: none;
      border-radius: 6px;
      padding: 5px;
    }
    .van-button {
      height: 100%;
      border: none;
    }
  }
}
/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
/*美化 - 文章详情 - 底部的评论页面 */
// 外层容器
.art-cmt-container-1 {
  padding-bottom: 46px;
}
.art-cmt-container-2 {
  padding-bottom: 80px;
}

// 发布评论的盒子 - 1
.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 46px;
  line-height: 46px;
  padding-left: 10px;
  .ipt-cmt-div {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 30px;
    font-size: 12px;
    line-height: 30px;
    padding-left: 15px;
    margin-left: 10px;
    background-color: #f8f8f8;
  }
  .icon-box {
    width: 40%;
    display: flex;
    justify-content: space-evenly;
    line-height: 0;
  }
}

.child {
  width: 20px;
  height: 20px;
  background: #f2f3f5;
}

// 发布评论的盒子 - 2
.cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 10px;
  box-sizing: border-box;
  background-color: white;
  textarea {
    flex: 1;
    height: 66%;
    border: 1px solid #efefef;
    background-color: #f8f8f8;
    resize: none;
    border-radius: 6px;
    padding: 5px;
  }
  .van-button {
    height: 100%;
    border: none;
  }
}
</style>
