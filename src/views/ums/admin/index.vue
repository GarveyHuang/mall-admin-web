<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="list()"
          type="primary"
          size="small">
          查询结果
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="用户名/关键字"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="addAdmin()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="brandTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">{{scope.row.username}}</template>
        </el-table-column>
        <el-table-column label="邮箱" align="center">
          <template slot-scope="scope">{{scope.row.email}}</template>
        </el-table-column>
        <el-table-column label="昵称" align="center">
          <template slot-scope="scope">{{scope.row.nickName}}</template>
        </el-table-column>
        <el-table-column label="账号状态" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="相关" width="220" align="center">
          <template slot-scope="scope">
            <span>角色：</span>
            <el-button
              size="mini"
              type="text"
              @click="getRoleList(scope.$index, scope.row)">100
            </el-button>
            <span>权限：</span>
            <el-button
              size="mini"
              type="text"
              @click="getPermissionList(scope.$index, scope.row)">1000
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import {list, getUser, updateUser, deleteUser} from '@/api/admin'

export default {
  name: 'adminList',
  data() {
    return {
      operates: [
        {
          label: "启用用户",
          value: "enableUser"
        },
        {
          label: "禁用用户",
          value: "disableUser"
        }
      ],
      operateType: null,
      listQuery: {
        keyword: null,
        pageNum: 1,
        pageSize: 10
      },
      list: null,
      total: null,
      listLoading: true,
      multipleSelection: []
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      list(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
        this.totalPage = response.data.totalPage;
        this.pageSize = response.data.pageSize;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleUpdate(index, row) {
      this.$router.push({path: '/ums/updateAdmin', query: {id: row.id}})
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该用户', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(row.id).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          });
          this.getList();
        });
      });
    },
    getRoleList(index, row) {
      console.log(index, row);
    },
    getPermissionList(index, row) {
      console.log(index, row);
    },
    // handleFactoryStatusChange(index, row) {
    //   var data = new URLSearchParams();
    //   data.append("ids", row.id);
    //   data.append("factoryStatus", row.factoryStatus);
    //   updateFactoryStatus(data).then(response => {
    //     this.$message({
    //       message: '修改成功',
    //       type: 'success',
    //       duration: 1000
    //     });
    //   }).catch(error => {
    //     if (row.factoryStatus === 0) {
    //       row.factoryStatus = 1;
    //     } else {
    //       row.factoryStatus = 0;
    //     }
    //   });
    // },
    // handleShowStatusChange(index, row) {
    //   let data = new URLSearchParams();
    //   ;
    //   data.append("ids", row.id);
    //   data.append("showStatus", row.showStatus);
    //   updateShowStatus(data).then(response => {
    //     this.$message({
    //       message: '修改成功',
    //       type: 'success',
    //       duration: 1000
    //     });
    //   }).catch(error => {
    //     if (row.showStatus === 0) {
    //       row.showStatus = 1;
    //     } else {
    //       row.showStatus = 0;
    //     }
    //   });
    // },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    searchAdminList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    // handleBatchOperate() {
    //   console.log(this.multipleSelection);
    //   if (this.multipleSelection < 1) {
    //     this.$message({
    //       message: '请选择一条记录',
    //       type: 'warning',
    //       duration: 1000
    //     });
    //     return;
    //   }
    //   let showStatus = 0;
    //   if (this.operateType === 'showAdmin') {
    //     showStatus = 1;
    //   } else if (this.operateType === 'hideAdmin') {
    //     showStatus = 0;
    //   } else {
    //     this.$message({
    //       message: '请选择批量操作类型',
    //       type: 'warning',
    //       duration: 1000
    //     });
    //     return;
    //   }
    //   let ids = [];
    //   for (let i = 0; i < this.multipleSelection.length; i++) {
    //     ids.push(this.multipleSelection[i].id);
    //   }
    //   let data = new URLSearchParams();
    //   data.append("ids", ids);
    //   data.append("showStatus", showStatus);
    //   updateShowStatus(data).then(response => {
    //     this.getList();
    //     this.$message({
    //       message: '修改成功',
    //       type: 'success',
    //       duration: 1000
    //     });
    //   });
    // },
    addAdmin() {
      this.$router.push({path: '/ums/addAdmin'})
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
