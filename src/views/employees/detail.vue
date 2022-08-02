<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="登录账户设置" name="first">
          <el-form
            ref="userInfoForm"
            :model="userInfo"
            :rules="userInfoRules"
            label-width="80px"
            style="width: 400px; margin-left: 200px; margin-top: 50px"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="userInfo.username">{{
                userInfo.username
              }}</el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="password">
              <el-input v-model="userInfo.password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="info">取消</el-button>
              <el-button type="primary" @click="save">跟新</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情" name="second">
          <Userinfo :id="id"></Userinfo>
        </el-tab-pane>
        <el-tab-pane label="岗位信息" name="third">
          <Jobinfo></Jobinfo>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import Jobinfo from './components/jobinfo.vue'
import Userinfo from './components/userinfo.vue'
import { getUserDetailById } from '@/api/user'
import { saveEmployee } from '@/api/employee.js'
export default {

  filters: {},
  components: { Userinfo, Jobinfo },
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      activeName: 'first',
      userInfo: {
        username: '',
        password: ''
      },
      userInfoRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById () {
      const res = await getUserDetailById(this.id)
      res.password = null
      this.userInfo = res
    },
    save () {
      this.$refs.userInfoForm.validate(async (valid) => {
        if (!valid) return this.$message.error('验证失败')
        const res = await saveEmployee(this.id, this.userInfo)
        this.$message.success('跟新成功')
        console.log(res)
      })
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
