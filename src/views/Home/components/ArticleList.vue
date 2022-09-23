<template>
  <div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :immediate-check="false"
        offset="50"
      >
        <ArticleItem
          v-for="obj in articleList"
          :key="obj.art_id"
          :itemObj="obj"
          @dislikeEv="dislikeApiFn"
          @reportsEv="reportsApiFn"
          @click.native="listClickFn(obj.art_id)"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from '../../../components/ArticleItem.vue'
import { getAllArticleAPI, dislikeArticleAPI, reportArticleAPI } from '@/api'
import { Toast } from 'vant'
import Notify from '@/ui/Notify'
export default {
  data() {
    return {
      articleList: [],
      loading: false,
      finished: false,
      moreTime: +new Date(),
      isLoading: false
    }
  },
  // activated() {
  //   window.addEventListener('scroll', this.scrollTopFn)
  //   document.documentElement.scrollTop = this.$route.meta.scrollT
  // },
  // deactivated() {
  //   window.removeEventListener('scroll', this.scrollTopFn)
  // },
  methods: {
    scrollTopFn() {
      this.$route.meta.scrollT = document.documentElement.scrollTop
    },
    async getArticleListFn() {
      const res = await getAllArticleAPI({
        channel_id: this.itemId, // 默认推荐频道(id为0)
        timestamp: this.moreTime
      })
      if (res.data.data.results.length === 0) {
        this.finished = true
        return
      }
      this.articleList = [...this.articleList, ...res.data.data.results]
      this.moreTime = res.data.data.pre_timestamp

      this.isLoading = false

      this.loading = false
    },
    async onRefresh() {
      // setTimeout(() => {
      this.articleList = []
      this.getArticleListFn()
      Toast('刷新成功')
    },
    async onLoad() {
      if (this.articleList.length === 0) {
        this.loading = false
        return
      }
      if (this.moreTime == null) {
        this.finished = true
        return
      }
      this.getArticleListFn()
    },
    async dislikeApiFn(id) {
      try {
        await dislikeArticleAPI({
          target: id
        })
        Notify({ type: 'success', message: '反馈成功' })
      } catch (err) {
        console.log(err)
        Notify({ type: 'warning', message: err.response.data.message })
      }
    },
    async reportsApiFn(id, type) {
      try {
        await reportArticleAPI({
          id,
          type
        })
        Notify({ type: 'success', message: '举报成功' })
      } catch (err) {
        Notify({ type: 'warning', message: err.response.data.message })
      }
    },
    listClickFn(id) {
      this.$router.push(`/article_detail/?art_id=${id}`)
    }
  },
  components: {
    ArticleItem
  },
  props: {
    // list: Array
    itemId: Number
  },
  async created() {
    this.getArticleListFn()
  }
}
</script>

<style></style>
