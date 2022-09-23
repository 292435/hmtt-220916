<template>
  <div>
    <!-- 搜索结果页-头部导航 -->
    <div class="search-result-container">
      <!-- 点击实现后退效果 -->
      <van-nav-bar
        title="搜索结果"
        left-arrow
        @click-left="$router.go(-1)"
        fixed
      />
    </div>

    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
    >
      <ArticleItem
        v-for="obj in articleList"
        :key="obj.art_id"
        :itemObj="obj"
        :isShow="false"
        @click.native="articleItemFn(obj.art_id)"
      ></ArticleItem>
    </van-list>
  </div>
</template>

<script>
import { searchResultAPI } from '@/api'
import ArticleItem from '@/components/ArticleItem.vue'
export default {
  name: 'search_result',
  data() {
    return {
      page: 1,
      articleList: [],
      loading: false,
      finished: false
    }
  },
  methods: {
    async onLoad() {
      if (this.articleList.length > 0) {
        this.page++
        const res = await searchResultAPI({
          page: this.page,
          q: this.$route.params.kw
        })
        if (res.data.data.results.length === 0) {
          this.finished = true
          return
        }
        this.articleList = [...this.articleList, ...res.data.data.results]
        console.log('res2', res)
        this.loading = false
      }
    },
    articleItemFn(id) {
      this.$router.push(`/article_detail/?art_id=${id}`)
    }
  },
  async created() {
    const res = await searchResultAPI({
      page: this.page,
      q: this.$route.params.kw
    })
    this.articleList = res.data.data.results
    console.log('res', res)
  },
  components: {
    ArticleItem
  }
}
</script>

<style lang="less" scoped>
.search-result-container {
  padding-top: 46px;
}
</style>
