<style lang="scss" scoped>
  .dgt-resize-view{
    height: 400px;
    display: flex;
  }
  .column-1{
    flex-basis: 70%;
    min-width: 300px;
  }
  .column-2{
    flex-grow: 1;
    min-width: 400px;
    background: #d1d1d1;
  }
</style>

<template>
  <section class="dgt-resize-view">
    <dgt-layout class="column-1" :horizontal-resizable="true">
        Coluna 1
    </dgt-layout>
    <div class="column-2">
        Coluna 2
    </div>
  </section>
</template>

<script>
  import dgtLayout from '../components/dgt-layout.vue';

  export default {
      name: 'dgtLayoutView',
      components: {
          dgtLayout
      }
  };
</script>
