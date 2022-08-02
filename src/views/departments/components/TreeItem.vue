<template>
  <div style="width: 100%">
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      style="height: 40px; padding: 30px 140px; font-size: 14px width: 100%;"
    >
      >
      <el-col>
        <span>{{ node.data ? node.data.name : node.name }}</span>
      </el-col>
      <el-col :span="4">
        <el-row type="flex" justify="end">
          <!-- 两个内容 -->
          <el-col>{{ node.data ? node.data.manager : "负责人" }}</el-col>
          <el-col>
            <!-- 下拉菜单 element -->
            <el-dropdown @command="onCommend">
              <span> 操作<i class="el-icon-arrow-down" /> </span>
              <!-- 下拉菜单 -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">添加子部门</el-dropdown-item>
                <template v-if="node.data">
                  <el-dropdown-item command="b">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="c">删除部门</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!-- 添加部门 -->
    <el-dialog
      :title="title"
      :visible.sync="addDialogVisible"
      width="50%"
      @click.native.stop
      @close="handleAddClose"
    >
      <el-form
        ref="addFormRef"
        label-width="100px"
        :model="addDepartmentForm"
        :rules="rules"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="addDepartmentForm.name"
            placeholder="1-50字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input v-model="addDepartmentForm.code"></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <!-- <el-input v-model="addDepartmentForm.manager"></el-input> -->
          <el-select
            v-model="addDepartmentForm.manager"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            v-model="addDepartmentForm.introduce"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { delDepartment, getSimpleUserList, addDepartment, getDepartmentsList, editDepartment } from '@/api/departments'
export default {
  filters: {},
  components: {},
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data () {
    const validateName = async (rule, value, callback) => {
      const res = await getDepartmentsList()
      if (this.isEdit) {
        const pid = this.node.data.pid
        res.depts.filter(item => item.pid === pid && item.id !== this.node.data.id).some(item => item.name === value) ? callback(new Error('部门重复')) : callback()
      } else {
        const id = this.node.data ? this.node.data.id : ''
        console.log(id)
        res.depts.filters(item => item.pid).some(item => item.name === value) ? callback(new Error('部门重复')) : callback()
      }
    }
    return {
      addDialogVisible: false,
      addDepartmentForm: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ]
      },
      users: [],
      isEdit: false // 是否编辑
    }
  },
  computed: {
    title () {
      return this.isEdit ? '编辑部门' : '新增部门'
    }
  },
  watch: {},
  created () {
  },
  methods: {
    async onCommend (key) {
      if (this.users.length === 0) {
        this.getSimpleUserList()
      }
      if (key === 'a') {
        console.log('添加')
        this.isEdit = false
        this.addDialogVisible = true
        // this.getSimpleUserList()
      } else if (key === 'b') {
        this.isEdit = true
        this.addDialogVisible = true
        this.addDepartmentForm = { ...this.node.data }
        console.log('编辑')
      } else {
        try {
          await this.$confirm('确认删除吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          const res = await delDepartment(this.node.data.id)
          this.$message.success('删除成功')
          this.$emit('delDepartment')
          console.log(res)
        } catch (err) {
          this.$notify({
            message: '取消删除',
            duration: 1000
          })
        }
      }
    },
    async getSimpleUserList () {
      const res = await getSimpleUserList()
      console.log(res)
      console.log(111)
      this.users = res
    },
    handleAddClose () {
      this.$refs.addFormRef.resetFields()
    },
    async onSubmit () {
      if (this.isEdit) {
        await editDepartment(this.addDepartmentForm)
      } else {
        this.addDepartmentForm.pid = this.node.data ? this.node.data.id : ''
        await addDepartment(this.addDepartmentForm)
      }
      this.addDialogVisible = false
      this.$emit('delDepartment')
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
