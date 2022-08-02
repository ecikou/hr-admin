<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTool title="共一条记录">
        <template #right>
          <el-button
            size="mini"
            type="danger"
            @click="exportExcel"
          >普通excel导出
          </el-button>
          <el-button
            size="mini"
            type="info"
            @click="exportExcel1"
          >复杂表头exce导出
          </el-button>
          <el-button
            size="mini"
            type="success"
            @click="$router.push('/import?type=user')"
          >excel导入</el-button
          >
          <!-- <Adduser :show-dialog.sync="showDialog"></Adduser> -->
          <el-button
            size="mini"
            type="primary"
            @click="addEmployeeVisible = true"
          >新增员工
          </el-button>
        </template>
      </PageTool>
      <el-card style="margin-top: 14px">
        <el-table border :data="employss">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column
            label="姓名"
            sortable
            prop="username"
          ></el-table-column>
          <el-table-column label="头像" prop="staffPhoto">
            <template v-slot="scope">
              <img
                v-imgerror
                :src="scope.row.staffPhoto"
                style="width: 50px"
                @click="showQrDialog(scope.row.staffPhoto)"
              />
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile"></el-table-column>
          <el-table-column label="工号" prop="workNumber"></el-table-column>
          <!-- <el-table-column
            label="聘用形式"
            prop="formOfEmployment"
            :formatter="formatterFormOfEmploy"
          ></el-table-column> -->
          <!-- 第二种 -->
          <!-- <el-table-column label="聘用形式" prop="formOfEmployment">
            <template v-slot="scope">
              {{ scope.row.formOfEmployment | formaFormType }}
            </template>
          </el-table-column> -->
          <el-table-column label="部门" prop="departmentName"></el-table-column>
          <el-table-column label="入职时间" prop="timeOfEntry">
            <template slot-scope="scope">
              <span>{{ scope.row.timeOfEntry | dateformat }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="enableState">
            <template v-slot="scope">
              <el-switch :value="scope.row.enableState"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="350px">
            <template v-slot="scope">
              <el-button type="text" @click="$router.push('/employee/detail/' + scope.row.id)">查看</el-button>
              <el-button type="text">转正</el-button>
              <el-button type="text">调岗</el-button>
              <el-button type="text">离职</el-button>
              <el-button
                type="text"
                @click="shouwRoleDialog(scope.row.id)"
              >角色</el-button
              >
              <el-button
                type="text"
                @click="deluser(scope.row.id)"
              >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <el-dialog title="分配角色" :visible.sync="roleVisible">
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <el-button type="primary" @click="assignRoles">确定</el-button>
        <el-button type="primary" @click="roleVisible = false">
          取消
        </el-button>
      </template>
    </el-dialog>
    <!-- 新增 -->
    <el-dialog
      title="新增员工"
      :visible.sync="addEmployeeVisible"
      @close="handleClose"
    >
      <el-form
        ref="employeeRef"
        label-width="80px"
        :model="employeeForm"
        :rules="employeeFormRules"
      >
        <el-form-item label="姓名" prop="username">
          <el-input v-model="employeeForm.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="employeeForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker
            v-model="employeeForm.timeOfEntry"
            type="date"
            placeholder="选择日期"
            clearable
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <el-select v-model="employeeForm.formOfEmployment">
            <el-option
              v-for="item in hireType"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input v-model="employeeForm.workNumber"></el-input>
        </el-form-item>
        <el-form-item label="组织名称" prop="departmentName">
          <el-input
            v-model="employeeForm.departmentName"
            @focus="getDepartmentsList"
          >
          </el-input>
          <el-tree
            v-if="treeData.length > 0"
            :data="treeData"
            default-expand-all
            :props="{ label: 'name' }"
            @node-click="handleNodeClick"
          ></el-tree>
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker
            v-model="employeeForm.correctionTime"
            type="date"
            placeholder="选择日期"
            clearable
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary">确定</el-button>
        <el-button type="primary" @click="addEmployeeVisible = false">
          取消
        </el-button>
      </template>
    </el-dialog>
    <!-- 二维码 -->
    <el-dialog title="二维码" :visible.sync="qrcodeVisible">
      <el-row type="flex" justify="center">
        <canvas ref="canvas"></canvas>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import employees from '@/constant/employees'
import { assignRoles } from '@/api/employee'
import { getRoleList } from '@/api/setting'
import { getEmployee, delusers } from '@/api/employee'
import { getUserDetailById } from '@/api/user'
import { getDepartmentsList } from '@/api/departments'
import QRCode from 'qrcode'
// import Adduser from './components/adduser.vue'
export default {
  filters: {
    formaFormType (id) {
      return employees.hireType.find(item => item.id === id).value
    }
  },
  components: {},
  data () {
    return {
      parmsObj: {
        page: 1,
        size: 4
      },
      employss: [],
      total: null,
      value: true,
      showDialog: false, // 添加用户
      roleVisible: false, // 角色按钮
      checkList: ['选中且禁用', '复选框 A'],
      roleList: [],
      id: null,
      addEmployeeVisible: false,
      treeData: [], // 定义数组接收树形数据
      employeeForm: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }, // 新增员工
      employeeFormRules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '组织名称不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      hireType: employees.hireType,
      qrcodeVisible: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getEmployee()
  },
  methods: {
    async getEmployee () {
      const res = await getEmployee(this.parmsObj)
      console.log(res)
      this.employss = res.rows
      this.total = res.total
    },
    formatterFormOfEmploy (row, column, cellValue, index) {
      // row 就是这一行的数据
      // column 就是这一列的数据
      // cellValue 就是这一列单元的值
      // index 就是这一行的索引
      var obj = employees.hireType.find(item => item.id === cellValue - 0)
      if (obj) {
        return employees.hireType.find(item => item.id === cellValue - 0).value
      } else {
        return '未知'
      }
    },
    async exportExcel () {
      // 先获取所以列表
      const { rows } = await getEmployee({ page: 1, size: 9999 })
      console.log(rows)
      rows.forEach(item => {
        delete item.password
        delete item.staffPhoto
      })
      var data = []
      rows.forEach(item => {
        data.push(Object.values(item))
      })
      const headers = {
        'id': '编号',
        'username': '姓名',
        'mobile': '手机',
        'timeOfEntry': '入职日期',
        'formOfEmployment': '聘用形式',
        'correctionTime': '转正日期',
        'workNumber': '工号',
        'departmentName': '部门'
      }
      var tHeader = Object.keys(rows[0]).map(item => (headers[item]))
      // 把列表 数据进行处理 边成二维数组
      import('@/vendor/Export2Excel').then(excel => {
        // const tHeader = ['编号', '姓名']
        // const data = [[1, '张三'], [2, '里斯']]
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填 那去便利店买
        })
      })
    },
    exportExcel1 () {
      const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      const tHeader = ['姓名', '手机号', '入职日期', '聘用形式', '转正日期', '工号', '部门']
      const data = [
        ['张三', '13000000', '2019-1-1', '正式', '2019-1-2', '110', 'java部门'],
        ['李四', '13000000', '2019-1-1', '正式', '2019-1-2', '111', 'java部门']
      ]

      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          multiHeader, // 第一行表头 复杂表头
          data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx', // 非必填
          merges // 设置合并规则
        })
      })
    },
    async deluser (id) {
      try {
        const res = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        console.log(res) // confirm
      } catch (err) {
        console.log(err) // cancel
        if (err === 'cancel') {
          return this.$message.info('已取消删除')
        }
        return err
        // 删除用户
      }
      try {
        const res1 = await delusers(id)
        console.log(res1)
        this.$message.success('删除用户成功')
        this.getEmployee()
      } catch (err) {
        console.log(err)
      }
    },
    // 角色按钮
    async shouwRoleDialog (id) {
      this.roleVisible = true
      this.id = id
      const res = await getRoleList({ page: 1, size: 9999 })
      console.log(res)
      this.roleList = res.rows
      const { roleIds } = await getUserDetailById(id)
      this.checkList = roleIds
    },
    // 提交角色多选框
    async assignRoles () {
      const res = await assignRoles({ id: this.id, roleIds: this.checkList })
      console.log(res)
      this.roleVisible = false
    },
    async getDepartmentsList () {
      const res = await getDepartmentsList()
      // 我们的数据不能直接使用，而是先加工处理一下才能使用 递归在写的时候慢慢就意识到了 层次不确定
      function tranferListToTree (list, pid) {
        var list1 = []
        list.forEach(item => {
          if (item.pid === pid) {
            list1.push(item)
            item.children = tranferListToTree(list, item.id)
          }
        })
        return list1
      }
      this.treeData = tranferListToTree(res.depts, '')
    },
    handleClose () {
      this.$refs.employeeRef.resetFields()
      this.treeData = []
    },
    handleNodeClick (obj) {
      this.employeeForm.departmentName = obj.name
      this.treeData = []
    },
    // 二维码弹出层
    showQrDialog (src) {
      this.qrcodeVisible = true
      this.$nextTick(() => {
        QRCode.toCanvas(this.$refs.canvas, src, function (error) {
          if (error) console.error(error)
          console.log('success!')
        })
      })
    }
  }

}
</script>

<style scoped lang='scss'>
.el-alert {
  display: inline;
  width: unset;
}
</style>
