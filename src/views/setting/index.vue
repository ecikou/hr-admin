<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first">
            <RoleManage></RoleManage>
          </el-tab-pane>

          <el-tab-pane label="公司信息" name="second">
            <Companyinfo></Companyinfo>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import RoleManage from './components/RoleManage.vue'
import Companyinfo from './components/Companyinfo.vue'
export default {
  filters: {},
  components: { RoleManage, Companyinfo },
  data () {
    return {
      activeName: 'first'
    }
  },
  computed: {

  },
  watch: {},
  created () {
  },
  methods: {
  }
}
</script>

<style scoped lang='scss'>
</style>
