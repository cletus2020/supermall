<template>
  <tab-bar>
      <tab-bar-item path="/home" avtiveColor="blue">
        <img slot="item-icon" src="~assets/img/tabbar/home.png" alt="">
        <img slot="item-icon-active" src="~assets/img/tabbar/home-active.png" alt="">
        <div slot="item-text">首页</div>
      </tab-bar-item>
      <tab-bar-item path="/category" avtiveColor="blue">
        <img slot="item-icon" src="~assets/img/tabbar/category.png" alt="">
        <img slot="item-icon-active" src="~assets/img/tabbar/category-active.png" alt="">
        <div slot="item-text">类别</div>
      </tab-bar-item>
      <tab-bar-item path="/shopcart" avtiveColor="blue">
        <img slot="item-icon" src="~assets/img/tabbar/shopcart.png" alt="">
        <img slot="item-icon-active" src="~assets/img/tabbar/shopcart-active.png" alt="">
        <div slot="item-text">购物车</div>
      </tab-bar-item>
      <tab-bar-item path="/profile" avtiveColor="blue">
        <img slot="item-icon" src="~assets/img/tabbar/profile.png" alt="">
        <img slot="item-icon-active" src="~assets/img/tabbar/profile-active.png" alt="">
        <div slot="item-text">我的</div>
      </tab-bar-item>
    </tab-bar>
</template>

<script>
  import TabBar from '../../common/tabbar/TabBar'
  import TabBarItem from '../../common/tabbar/TabBarItem'
  export default {
    name: "MainTabBar",
    components: {
      TabBar,
      TabBarItem
    }
  }
</script>


<style>

</style>