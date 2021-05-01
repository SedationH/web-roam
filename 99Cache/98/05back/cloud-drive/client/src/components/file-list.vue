<template>
  <div>
    <el-table
      :data="tableData"
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="{ 'text-align': 'center' }"
      style="width: 100%"
    >
      <el-table-column type="index"> </el-table-column>
      <el-table-column prop="file_name" label="文件名" width="180px">
      </el-table-column>
      <el-table-column
        prop="size"
        label="文件大小"
        width="180px"
        :formatter="dealSize"
      >
      </el-table-column>
      <el-table-column
        prop="upload_time"
        label="上传时间"
        width="180px"
        :formatter="dealTime"
      >
      </el-table-column>
      <el-table-column prop="download" label="下载次数" width="180px">
      </el-table-column>
      <el-table-column prop="type" label="类型" width="180px">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a :href="getFile(scope.row)">
            <el-button size="mini" type="info" @click="handleDownload"
              >下载</el-button
            >
          </a>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    handleDelete(index, row) {
      this.$http
        .delete(`/file/delete/${row.hash_name}/${row.id}`)
        .then(res => {
          this.$message.success(res.data.msg);
          this.refreshFileList();
        })
        .catch(err => {
          console.log("Error=>", err);
        });
    },
    handleDownload() {
      setTimeout(() => {
        this.refreshFileList();
      }, 1000);
    },
    refreshFileList() {
      this.getFileList();
    },
    getFileList() {
      let params = {
        uid: sessionStorage.getItem("uid")
      };
      this.$http
        .post("/file/list", params)
        .then(res => {
          if (res.data.code === 0) {
            this.$message.error(res.data.msg);
          } else {
            this.tableData = res.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getFile(data) {
      let url = `http://localhost:8081/file/download/${data.hash_name}/${data.id}`;
      return url;
    },
    dealSize(row, column) {
      let fileSize = (row.size / 1024).toFixed(2);
      return `${fileSize}kb`;
    },
    dealTime(row, column) {
      return this.formatTime(row.upload_time);
    },
    formatTime(value) {
      var date = new Date(value);
      var Y = date.getFullYear();
      var M =
        date.getMonth() + 1 < 10
          ? `0${date.getMonth() + 1}`
          : date.getMonth() + 1;
      var D = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
      var h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
      var m =
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
      var s =
        date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
      return `${Y}-${M}-${D} ${h}:${m}:${s}`;
    }
  },
  mounted() {
    this.getFileList();
  }
};
</script>
