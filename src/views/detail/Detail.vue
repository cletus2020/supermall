<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" :current-index="currentIndex" @titleClick="titleClick"/>
    <scroll class="content" ref="scroll">
      <detail-swiper :topImages="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detailInfo="detailInfo"/>
      <detail-param-info ref="params" :paramInfo="paramInfo"/>
      <detail-comment-info ref="comment" :commentInfo="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
      <!-- <detail-recommend-info ref="recommend" :recommendList="recommendList"/> -->
    </scroll>
  </div>  
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar.vue'
  import DetailSwiper from './childComps/DetailSwiper.vue'
  import DetailBaseInfo from './childComps/DetailBaseInfo.vue'
  import DetailShopInfo from './childComps/DetailShopInfo.vue'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue'
  import DetailParamInfo from './childComps/DetailParamInfo.vue'
  import DetailCommentInfo from './childComps/DetailCommentInfo.vue'
  import DetailRecommendInfo from './childComps/DetailRecommendInfo.vue'

  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'

  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from '../../network/detail'
  import {itemListenerMixin} from '../../common/mixin'
  import {debounce} from '../../common/utils'

  export default {
    name: "Detail",
    components: { 
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailRecommendInfo,

      Scroll,
      GoodsList,
    },
    mixins: [itemListenerMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0
      }
    },
    created() {
      // 保存传入的iid
      const iid = this.$route.params.iid
      this.iid = iid
      // 根据iid请求详细数据
      getDetail(iid).then(res => {
        // 获取顶部的图片轮播数据
        const data = res.result
        this.topImages = data.itemInfo.topImages
        // 获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
        // 创建店铺信息
        this.shop = new Shop(data.shopInfo)
        // 保存商品的详细数据
        this.detailInfo = data.detailInfo
        // 获取商品参数
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
        // 获取评论信息
        if(data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
        /*
        // 第一次获取
        // 值不对，this.$refs.params.$el压根没有渲染
        this.themeTopYs = []

        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        */
        // 第二次获取
        // 值不对，图片没有计算在内
        // this.$nextTick(() => {
        //   // 根据最新的数据，对应的DOM是已经被渲染出来
        //   // 但是图片依然是没有加载完(目前获取到offsetTop不包含其中的图片)
        //   // offsetTop值不对的时候，都是因为图片的问题
        //   this.themeTopYs = []

        //   this.themeTopYs.push(0)
        //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        // })
        
      })
      
      this._getRecommend()

      
    },
    updated() {
      this.$nextTick(() => {
          // 根据最新的数据，对应的DOM是已经被渲染出来
          // 但是图片依然是没有加载完(目前获取到offsetTop不包含其中的图片)
          // offsetTop值不对的时候，都是因为图片的问题
          this.themeTopYs = []

          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.params.$el.offsetTop)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        })
    },
    methods: {
      // _getOffsetTops() {
      //   this.themeTops = []
      //   this.themeTops.push(this.$refs.base.$el.offsetTop)
      //   this.themeTops.push(this.$refs.param.$el.offsetTop)
      //   this.themeTops.push(this.$refs.comment.$el.offsetTop)
      //   this.themeTops.push(this.$refs.recommend.$el.offsetTop)
      //   this.themeTops.push(Number.MAX_VALUE)
      // },
      contentScroll(position) {
		    // 1.监听backTop的显示
        this.showBackTop = position.y < -BACKTOP_DISTANCE
        // 2.监听滚动到哪一个主题
        this._listenScrollTheme(-position.y)
      },
      _listenScrollTheme(position) {
        let length = this.themeTops.length;
        for (let i = 0; i < length; i++) {
          let iPos = this.themeTops[i];
          /**
           * 判断的方案:
           *  方案一:
           *    条件: (i < (length-1) && currentPos >= iPos && currentPos < this.themeTops[i+1]) || (i === (length-1) && currentPos >= iPos),
           *    优点: 不需要引入其他的内容, 通过逻辑解决
           *    缺点: 判断条件过长, 并且不容易理解
           *  方案二:
           *    条件: 给themeTops最后添加一个很大的值, 用于和最后一个主题的top进行比较.
           *    优点: 简洁明了, 便于理解
           *    缺点: 需要引入一个较大的int数字
           * 疑惑: 在第一个判断中, 为什么不能直接判断(currentPos >= iPos)即可?
           * 解答: 比如在某一个currentPos大于第0个时, 就会break, 不会判断后面的i了.
           */
          if (position >= iPos && position < this.themeTops[i+1]) {
            if (this.currentIndex !== i) {
              this.currentIndex = i;
            }
            break;
          }
        }
      },
      titleClick(index) {
        console.log(index);
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index])
      },
      addToCart() {
        // 1.创建对象
        const obj = {}
        // 2.对象信息
        obj.iid = this.iid;
        obj.imgURL = this.topImages[0]
        obj.title = this.goods.title
        obj.desc = this.goods.desc;
        obj.newPrice = this.goods.nowPrice;
        // 3.添加到Store中
        this.$store.commit('addCart', obj)
      },
		  
      _getRecommend() {
        getRecommend().then((res, error) => {
          if (error) return
          this.recommendList = res.data.list
        })
      }
    },
    mounted() {
       
    },
    destroyed() {
      this.$bus.$off('itemImgLoad', this.itemImgListener)
    }
  }
</script>

<style scoped>
  #detail {
    height: 100vh;
    position: relative;
    z-index: 1;
    background-color: #fff;
    height: 100vh;
  }

  .content {
    height: calc(100% - 44px);
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  
</style>