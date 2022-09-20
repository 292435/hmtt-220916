<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar
      fixed
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 文章信息区域 -->
    <div class="article-container">
      <!-- 文章标题 -->
      <h1 class="art-title">{{ artObj.title }}</h1>

      <!-- 用户信息 -->
      <van-cell
        center
        :title="artObj.aut_name"
        :label="formatFn(artObj.pubdate)"
      >
        <template #icon>
          <img :src="artObj.aut_photo" alt="" class="avatar" />
        </template>
        <template #default>
          <div>
            <van-button
              @click="flowClickFn(true)"
              type="info"
              size="mini"
              v-if="artObj.is_followed === true"
              >已关注</van-button
            >
            <van-button
              icon="plus"
              type="info"
              size="mini"
              plain
              v-else
              @click="flowClickFn(false)"
              >关注</van-button
            >
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="artObj.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <!-- attitude 用户对文章的态度, -1: 无态度，0-不喜欢，1-点赞 -->
      <div class="like-box">
        <van-button
          icon="good-job"
          type="danger"
          size="small"
          v-if="artObj.attitude === 1"
          @click="loveFn(true)"
          >已点赞</van-button
        >
        <van-button
          v-else
          icon="good-job-o"
          type="danger"
          plain
          size="small"
          @click="loveFn(false)"
          >点赞</van-button
        >
      </div>
      <!-- 评论列表  -->
      <commentList></commentList>
    </div>
  </div>
</template>

<script>
import {
  detailAPI,
  followingsAPI,
  unFollowingAPI,
  likeAPI,
  unLikeAPI
} from '@/api'
import { timeAgo } from '@/utils/date.js'
import commentList from '@/views/ArticleDetail/CommentList.vue'
export default {
  async created() {
    const id = this.$route.query.art_id
    const res = await detailAPI({
      article_id: id
    })
    // console.log('ress', res)
    this.artObj = res.data.data
  },
  data() {
    return {
      artObj: {}
    }
  },
  methods: {
    formatFn(time) {
      return timeAgo(time)
    },
    async flowClickFn(bool) {
      if (bool === true) {
        const res = await unFollowingAPI({
          target: this.artObj.aut_id
        })
        this.artObj.is_followed = false
        console.log('unfl', res)
      } else {
        const res = await followingsAPI({
          id: this.artObj.aut_id
        })
        this.artObj.is_followed = true
        console.log('fl', res)
      }
    },
    async loveFn(bool) {
      if (bool === true) {
        this.artObj.attitude = 0
        const res = await unLikeAPI({
          target: this.artObj.art_id
        })
        console.log(res)
      } else {
        this.artObj.attitude = 1
        const res = await likeAPI({
          target: this.artObj.art_id
        })
        console.log(res)
      }
    }
  },
  components: {
    commentList
  }
}
</script>

<style scoped lang="less">
.article-container {
  padding: 10px;
  margin-top: 46px;
}
.art-title {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.art-content {
  font-size: 12px;
  line-height: 24px;
  width: 100%;
  overflow-x: scroll;
  word-break: break-all;
  /deep/ img {
    width: 100%;
  }
  /deep/ pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}

.van-cell {
  padding: 5px 0;
  &::after {
    display: none;
  }
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #f8f8f8;
  margin-right: 5px;
  border: none;
}

.like-box {
  display: flex;
  justify-content: center;
}
</style>
