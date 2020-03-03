<template>

  <div v-if="upload">
    <el-form label-position="left" label-width="100px" :model="form" class="form">
      <el-upload class="upload-demo" drag action="http://127.0.0.1:5001/pdf/upload" :multiple="false"
                 :headers="{ 'content-type': 'application/octet-stream' }" :on-success="uploadSuccess"
                 accept=".pdf" :with-credentials="true">
        <i class="el-icon-upload" style="color: #409EFF"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </el-form>
  </div>

  <div v-else>
    <div v-for="img in imageList" :key="img.uuid" class="images">
      <el-image :src="img.url" lazy fit="contain"
                :preview-src-list="previewList"/>
      <div class="image-mask" @click="translate(img)">
        <i class="el-icon-discover" style="padding-right: 5px"/> 转换
      </div>
    </div>

  </div>


</template>
<script>
  import {listImages} from '@/api/pdfApi';

  export default {
    data() {
      return {
        upload: true,
        imageList: [],
        previewList: [],
        form: {},
        temp: {}
      };
    },
    mounted() {
    },
    methods: {
      translate(picuuid) {
        console.log(picuuid)
      },
      change() {
        console.log(this.form);
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      uploadSuccess(e, f, g) {
        this.getImages(e.data);
      },
      handleExceed(files, fileList) {
        this.$message.warning(
          `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      async getImages(pdfuuid) {
        let res = await listImages(pdfuuid);
        if (res.data.data) {
          this.upload = false;
          for (let i in res.data.data) {
            this.previewList.push(res.data.data[i].url)
            this.imageList.push(res.data.data[i])
          }
        }
      },
    }
  };
</script>
<style>
  .form {
    text-align: center;
  }

  .images {
    float: left;
    width: 200px;
    height: 300px;
    position: relative;
    border: 1px solid #dddddd;
    margin: 5px;
  }

  .image-mask {
    position: absolute;
    bottom: 0;
    left: 0;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.1);
    width: 100%;
    color: #409EFF;
    padding: 4px 0;
    font-size: 14px;
    cursor: pointer;
  }

  el-image {
    width: 100%;
    height: 100%;
  }

</style>
