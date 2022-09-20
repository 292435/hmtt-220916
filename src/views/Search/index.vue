<template>
  <div>
    <!-- 搜索页面头部 -->
    <div class="search-header">
      <!-- 后退按钮 -->
      <van-icon
        name="arrow-left"
        color="white"
        size="0.48rem"
        class="goback"
        @click="$router.back()"
      />
      <!-- 搜索组件 -->
      <van-search
        v-focus
        placeholder="请输入搜索关键词"
        background="#007BFF"
        shape="round"
        v-model="kw"
        @input="inputFn"
        @search="searchFn"
      />
    </div>
    <!-- 搜索建议列表 -->
    <div class="sugg-list" v-if="kw.length > 0">
      <div
        class="sugg-item"
        v-for="(obj, ind) in suggestList"
        :key="ind"
        v-html="linghtFn(obj, kw)"
        @click="suggestFn(obj)"
      ></div>
    </div>
    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="clearFn" />
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span
          class="history-item"
          v-for="(obj, index) in history"
          :key="index"
          @click="historyFn(obj)"
          >{{ obj }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { suggestionAPI } from '@/api'
export default {
  data() {
    return {
      kw: '', // 搜索关键字,
      timer: null,
      suggestList: [],
      history: JSON.parse(localStorage.getItem('his')) || [] // 搜索历史
    }
  },
  methods: {
    inputFn() {
      clearTimeout(this.timer)
      this.timer = setTimeout(async () => {
        if (this.kw.length == 0) {
          this.suggestList = []
          return
        }
        const res = await suggestionAPI({
          value: this.kw
        })
        console.log(res)
        this.suggestList = res.data.data.options
      }, 300)
    },
    linghtFn(str, keyWord) {
      const reg = new RegExp(keyWord, 'ig')
      return str.replace(reg, (match) => {
        return `<span style="color:red;">${match}</span>`
      })
    },
    // 搜索
    searchFn() {
      if (this.kw.length <= 0) {
        return
      }
      this.moreFn(this.kw)
      this.history.push(this.kw)
    },
    // 搜索建议
    suggestFn(obj) {
      if (this.kw.length <= 0) {
        return
      }
      this.moreFn(obj)
      this.history.push(obj)
    },
    // 搜索记录
    historyFn(obj) {
      this.kw = obj
      this.moreFn(obj)
    },
    moreFn(str) {
      if (this.kw.length <= 0) {
        return
      }
      setTimeout(() => {
        this.$router.push({
          path: `/search_result/${str}`
        })
      }, 0)
    },
    clearFn() {
      this.history = []
    }
  },
  watch: {
    history: {
      deep: true,
      handler() {
        const set = new Set(this.history)
        const arr = Array.from(set)
        localStorage.setItem('his', JSON.stringify(arr))
      }
    }
  }
}
</script>

<style scoped lang="less">
.search-header {
  height: 46px;
  display: flex;
  align-items: center;
  background-color: #007bff;
  overflow: hidden;
  /*后退按钮*/
  .goback {
    padding-left: 14px;
  }
  /*搜索组件*/
  .van-search {
    flex: 1;
  }
  /*搜索建议列表样式 */
  .sugg-list .sugg-item {
    padding: 0 15px;
    border-bottom: 1px solid #f8f8f8;
    font-size: 14px;
    line-height: 50px;
    // 实现省略号的三行代码
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
/**搜索历史 */
.search-icon {
  font-size: 16px;
  line-height: inherit;
}

.history-list {
  padding: 0 10px;
  .history-item {
    display: inline-block;
    font-size: 12px;
    padding: 8px 14px;
    background-color: #efefef;
    margin: 10px 8px 0px 8px;
    border-radius: 10px;
  }
}
</style>
