<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <button class="btn btn-sm btn-outline-secondary action-btn" @click="$router.push('/settings')">
              <i class="ion-plus-round"></i>
              &nbsp;
              Edit Profile Settings
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">

        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a class="nav-link" :class="{ active: !article }" @click="changeArticle()">My Articles</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{ active: article === 'favorites' }" @click="changeArticle('favorites')">Favorited Articles</a>
              </li>
            </ul>
          </div>
          <div v-if="!article">
            <div class="article-preview" v-for="art in articles" :key="art.slug" @click="onClickArticle(art)">
              <div class="article-meta">
                <a><img :src="art.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'" /></a>
                <div class="info">
                  <nuxt-link class="author" :to="{ path: '/profile', params: { username: art.author.username } }">{{ art.author.username }}</nuxt-link>
                  <!-- <a @click="toAuthor"></a> -->
                  <span class="date">January 20th</span>
                </div>
                <button @click="onClickFavorited(art)" class="btn btn-sm pull-xs-right" :disabled="art.disabled" :class="art.favorited? 'btn-primary': 'btn-outline-primary'">
                  <i class="ion-heart"></i> {{ art.favoritesCount }}
                </button>
              </div>
              <a class="preview-link">
                <h1>{{ art.title }}</h1>
                <p>{{ art.description }}</p>
                <span>Read more...</span>
                <ul class="tag-list">
                  <li class="tag-default tag-pill tag-outline" v-for="tag in art.tagList" :key="art.slug + tag">
                    {{ tag }}
                  </li>
                </ul>
              </a>
            </div>
            <div class="article-preview" v-show="!articles.length">No articles are here... yet.</div>
          </div>
          <div v-if="article === 'favorites'">
            <div class="article-preview" v-for="art in favoritedArticles" :key="art.slug" @click="onClickArticle(art)">
              <div class="article-meta">
                <a href=""><img :src="art.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'" /></a>
                <div class="info">
                  <nuxt-link class="author" :to="{ name: 'profile', params: { username: art.author.username } }">{{ art.author.username }}</nuxt-link>
                  <span class="date">January 20th</span>
                </div>
                <button @click="onClickFavorited(art)" class="btn btn-sm pull-xs-right" :disabled="art.disabled" :class="art.favorited? 'btn-primary': 'btn-outline-primary'">
                  <i class="ion-heart"></i> {{ art.favoritesCount }}
                </button>
              </div>
              <a class="preview-link">
                <h1>{{ art.title }}</h1>
                <p>{{ art.description }}</p>
                <span>Read more...</span>
                <ul class="tag-list">
                  <li class="tag-default tag-pill tag-outline" v-for="tag in art.tagList" :key="art.slug + tag">
                    {{ tag }}
                  </li>
                </ul>
              </a>
            </div>
            <div class="article-preview" v-show="!favoritedArticles.length">No articles are here... yet.</div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { getProfilesByName, getMyArticles, getFavoritedArticles, changeFavorite } from '@/api/profile'
export default {
  middleware: 'authenticated',
  name: 'UserProfile',
  data() {
    return {
      profile: {},
      articlesCount: 0,
      articles: [],
      limit: 5,
      article: '',
      favoritedArticles: [],
      favoritedCount: 0,
    }
  },
  mounted() {
    // this.init()
  },
  methods: {
    async init(username, article) {
      this.article = article || ''
      this.username = username
      
      const { profile } = await getProfilesByName(this.$route.params.username)
      this.profile = profile
      console.log(this.article)
      if(!this.article) {
        this.getMyArticles()
      } else {
        this.getFavoritedArticles()
      }
    },
    async getMyArticles() {
      const offset = 0//Math.ceil(this.articles.length / this.limit)
      const { articlesCount, articles } = await getMyArticles(this.username, offset)
      this.articlesCount = articlesCount
      this.articles = articles//this.articles.concat(articles)
    },
    changeArticle(article) {
      this.article = article || ''
      let query = {}
      if(this.article) {
        query.article = this.article
      }
      this.$router.push({
        name: 'profile',
        params: { username: this.username },
        query
      })
    },
    async getFavoritedArticles() {
      const offset = 0//Math.ceil(this.favoritedArticles.length / this.limit)
      const { articlesCount: favoritedCount, articles: favoritedArticles } = await getFavoritedArticles(this.username, offset)
      this.favoritedCount = favoritedCount
      this.favoritedArticles = favoritedArticles//this.favoritedArticles.concat(favoritedArticles)
    },
    async onClickFavorited(data) {
      data.disabled = true
      const { article } = await changeFavorite(data.favorited?'DELETE': 'POST',data.slug)
      data.favoritesCount = article.favoritesCount
      data.favorited = !data.favorited
      data.disabled = false
    },
    onClickArticle({ slug }) {
      this.$router.push(`/article/${ slug }`)
    }
  },
  watch: {
    $route: {
      // console.log(route)
      // this.init()
      handler({ params, query }) {
        console.log(params, query)
        this.init(params.username, query.article)
      },
      immediate: true
    }
  }
}
</script>

<style>

</style>
