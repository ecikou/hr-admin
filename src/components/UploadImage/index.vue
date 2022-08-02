<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      accept="image/jpg,image/png,image/jpeg,image/gif"
      :limit="limit"
      :on-change="handleChange"
      :class="{ hidden: filesList.length === limit }"
      :file-list="filesList"
      :http-request="handleRequest"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" title="预览">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <el-progress :percentage="percent"></el-progress>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
var cos = new COS({
  SecretId: 'AKIDKXIq8Bzc2C7nDOJPGrCH9nCLEsHQr42s',
  SecretKey: 'qbJ2kJ7iBTYQ5WifNpIciaEckdIjwue9'

})
export default {
  props: {
    limit: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      filesList: [],
      percent: 0
    }
  },
  methods: {
    handleRemove (file) {
      this.filesList = this.filesList.filter(item => item.uid !== file.uid)
      console.log(file)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload (file) {
      console.log(file)
    },
    handleChange (file, fileList) {
      this.filesList = fileList
    },
    handleRequest (obj) {
      var that = this
      console.log('111')
      cos.putObject({
        Bucket: 'ithhh-1313062348', // 存储桶
        Region: 'ap-shanghai', // 地域
        Key: Date.now() + obj.file.name, // 文件名
        Body: obj.file, // 要上传的文件对象
        StorageClass: 'STANDARD', // 上传的模式类型 直接默认
        onProgress: function (progressData) {
          console.log(JSON.stringify(progressData))
          that.percent = Math.floor(progressData.loaded / progressData.total * 100)
        }
      }, (err, data) => {
        console.log(err || data)
        this.src = data.Location
      }
      )
    }
  }
}
</script>

<style scoped lang='scss'>
// 原理：hidden类名是动态绑定
.hidden ::v-deep .el-upload--picture-card {
  display: none;
}
</style>
