<template>
  <el-popover width="350" trigger="hover">
    <el-table :data="cartProducts" size="mini">
      <el-table-column
        property="title"
        width="130"
        label="商品"
      ></el-table-column>
      <el-table-column
        property="price"
        label="价格"
      ></el-table-column>
      <el-table-column
        property="count"
        width="50"
        label="数量"
      ></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button
            @click="deleteFromCart(scope.row.id)"
            size="mini"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div>
      <p>
        共 {{ totalCount }} 件商品 共计¥{{ totalPrice }}
      </p>
      <el-button
        size="mini"
        type="danger"
        @click="$router.push({ name: 'cart' })"
      >
        去购物车
      </el-button>
    </div>
    <el-badge
      :value="totalCount"
      class="item"
      slot="reference"
    >
      <el-button type="primary">我的购物车</el-button>
    </el-badge>
  </el-popover>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
export default {
  name: 'PopCart',
  computed: {
    ...mapState('cart', ['cartProducts']),
    ...mapGetters('cart', ['totalCount', 'totalPrice'])
  },
  methods: {
    ...mapMutations('cart', ['deleteFromCart'])
  }
}
</script>

<style></style>
