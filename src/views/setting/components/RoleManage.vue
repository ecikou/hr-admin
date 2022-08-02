<template>
  <div>
    <el-button
      type="primary"
      size="mini"
      form="{}"
      @click="
        roleDialogVisible = true;
        isEdit = false;
      "
    >
      新增角色
    </el-button>
    <el-table :data="roleList" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="name" label="角色" width="160"> </el-table-column>
      <el-table-column prop="description" label="描述"> </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="text" @click="showRightVisible(scope.row.id)">
            分配权限
          </el-button>
          <el-button type="text" @click="showRoleVisible(scope.row)">
            修改
          </el-button>
          <el-button type="text" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <el-pagination
        :current-page="paramsObj.page"
        :page-sizes="[2, 3, 4, 5, 6]"
        :page-size="paramsObj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-row>
    <!-- 分配权限页面 -->
    <el-dialog title="分配权限" :visible.sync="rightVisible" width="30%">
      <el-tree
        v-if="rightVisible"
        ref="myTree"
        :data="premissions"
        show-checkbox
        default-expand-all=""
        :props="{ label: 'name' }"
        node-key="id"
        :default-checked-keys="selectionsid"
      >
      </el-tree>
      <template #footer>
        <el-button type="primary" @click="save">确认</el-button>
        <el-button @click="rightVisible = false">取消</el-button>
      </template>
    </el-dialog>
    <!-- 新增和编辑的对话框 -->
    <el-dialog
      :title="isEdit ? '编辑' : '新增'"
      :visible.sync="roleDialogVisible"
      @close="reset"
    >
      <el-form ref="myForm" label-width="80px" :rules="rules" :model="form">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="onClick">确认</el-button>
        <el-button @click="roleDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, delRole, addRole, editRole } from '@/api/setting'
import { getPermissions, getPermissionsById, assignPermission } from '@/api/permission'
import { tranferListToTree } from '@/utils'
export default {
  filters: {},
  components: {},
  data () {
    return {
      activeName: 'first',
      paramsObj: {
        page: 1,
        pagesize: 4
      },
      roleList: [],
      total: 0,
      rightVisible: false,
      premissions: [],
      selectionsid: [],
      id: null,
      roleDialogVisible: false,
      form: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      isEdit: false
    }
  },
  computed: {

  },
  watch: {},
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const res = await getRoleList(this.paramsObj)
      this.roleList = res.rows
      this.total = res.total
      console.log(res)
    },
    handleSizeChange (newval) {
      this.paramsObj.pagesize = newval
      this.getRoleList()
    },
    handleCurrentChange (newval) {
      this.paramsObj.page = newval
      this.getRoleList()
    },
    del (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delRole(id)
        if (this.roleList.length === 1 && this.paramsObj.page > 1) {
          this.paramsObj.page--
        }
        this.getRoleList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async showRightVisible (id) {
      this.id = id
      this.rightVisible = true
      // 获取所有权限点
      const res = await getPermissions(id)
      console.log(res)
      this.premissions = tranferListToTree(res, '0')
      // 获取当前角色已经分配的权限点
      const res1 = await getPermissionsById(id)
      this.selectionsid = res1.permIds
      console.log(res1)
    },
    async save () {
      await assignPermission(this.id, this.$refs.myTree.getCheckedKeys())
      this.rightVisible = false
      // console.log(this.$refs.myTree.getCheckedKeys())
    },
    onClick () {
      this.$refs.myForm.validate(async bool => {
        if (!bool) return this.$message.error('数据不合理')
        if (this.isEdit) {
          await editRole(this.form)
        } else {
          await addRole(this.form)
        }
        this.getRoleList()
        this.roleDialogVisible = false
      })
    },
    reset () {
      this.$refs.myForm.resetFields()
    },
    showRoleVisible (row) {
      this.isEdit = true
      this.roleDialogVisible = true
      // 浅拷贝
      this.form = { ...row }
    }
  }
}
</script>

<style scoped lang='scss'>
.el-table {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
