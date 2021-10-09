<template>
  <div id="tab-bar">
    <slot> </slot>
  </div>
</template>

<script>
export default {
  name: "TabBar",
};
</script>

<style scoped>
#tab-bar {
  display: flex;
  text-align: center;
  background-color: #f6f6f6;

  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  height: 49px;
  border-top: 1px solid #eee;
  box-shadow: 0px -3px 1px rgba(100, 100, 100, 0.1);
}
</style>