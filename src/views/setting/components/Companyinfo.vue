<template>
  <el-form label-width="80px">
    <el-form-item label="企业名称">
      <el-input disabled :value="info.name"></el-input>
    </el-form-item>
    <el-form-item label="公司地址">
      <el-input disabled :value="info.companyAddress"></el-input>
    </el-form-item>
    <el-form-item label="公司电话">
      <el-input disabled :value="info.companyPhone"></el-input>
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input disabled :value="info.mailbox"></el-input>
    </el-form-item>
    <el-form-item label="备注">
      <el-input disabled :value="info.remarks"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { getCompanyInfo } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  filters: {},
  components: {},
  data () {
    return {
      info: {}
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  watch: {},
  async created () {
    const res = await getCompanyInfo(this.companyId)
    this.info = res
    console.log(res)
  },
  methods: {}
}
</script>

<style scoped lang='scss'>
</style>
