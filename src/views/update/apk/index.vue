<template>
  <div class="app-container">
    <!--<el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="版本" prop="version">
        <el-input
          v-model="queryParams.version"
          placeholder="请输入版本"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="构建版本" prop="build">
        <el-input
          v-model="queryParams.build"
          placeholder="请输入构建版本"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>-->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['update:apk:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['update:apk:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['update:apk:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['update:apk:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-picture-outline-round"
          size="mini"
          @click="showJSON"
          v-hasPermi="['update:apk:add']"
        >获取最新包</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="apkList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" type="index" align="center" />
      <el-table-column label="应用名称" align="center" prop="appName" />

      <el-table-column label="版本" align="center" prop="version" />
      <el-table-column label="构建版本" align="center" prop="build" />
      <el-table-column label="更新内容" align="center" prop="description" />
      <el-table-column label="更新机制" align="center" prop="updateStatus" :formatter="updateStatusFormat" />
      <el-table-column label="状态" align="center" prop="status" >
        <template slot-scope="scope">
          <el-switch :value="!!Number(scope.row.status)" @change="updateRowStatus(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180"></el-table-column>
      <el-table-column label="下载次数" align="center" prop="downloadCount" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['update:apk:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['update:apk:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改apk管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-form-item prop="file">
          <el-upload :before-upload="beforeUpload"
                     :on-change="uploadChange"
                     name="file"
                     :auto-upload="false"
                     :show-file-list="false"
                     :http-request="uploadFile"
                     ref="upload"
                     drag
                     action="https://jsonplaceholder.typicode.com/posts/" >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传.apk文件</em></div>
            <div class="el-upload__tip file-info" slot="tip">
              <span class="file-name">{{fileName}}</span>
              <span class="file-size">{{fileSize}}</span>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="更新内容" prop="description">
          <el-input v-model="form.description" placeholder="请输入更新内容" />
        </el-form-item>
        <el-form-item label="更新机制" prop="updateStatus">
          <el-select v-model="form.updateStatus" placeholder="请选择更新机制">
            <el-option
              v-for="dict in updateStatusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <!--返回的json高粱显示-->
    <el-dialog title="请求结果" :visible.sync="show" width="1024px" append-to-body>
      <div class="code-box">
        <span>{{checkApkPath}}</span>
      </div>
      <json-viewer
        :value="apkResult"
        :expand-depth=5
        copyable
        sort></json-viewer>
    </el-dialog>

  </div>
</template>

<script>
import { listApk, getApk, delApk, addApk, updateApk,checkUpdateApk, exportApk,genUpdateApkPath } from "@/api/update/apk";
import {updateApplication} from "@/api/update/application";

export default {
  name: "Apk",
  data() {
    return {
      checkApkPath: '',
      apkResult: {},
      show:false,
      fileName:"",
      fileSize: '',
      file: null,

      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // apk管理表格数据
      apkList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态字典
      statusOptions: [],
      // 更新机制字典
      updateStatusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: null,
        version: null,
        build: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    const appKey = this.$route.query.appKey;
    this.checkApkPath = genUpdateApkPath(appKey);
    this.getList();
    this.getDicts("sys_common_state").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("apk_update_mode").then(response => {
      this.updateStatusOptions = response.data;
    });
  },
  computed:{
    appId(){
      return this.$route.query.appId ;
    }
  },
  methods: {
    /** 查询apk管理列表 */
    getList() {
      this.loading = true;
      const appId = this.appId;
      listApk({ appId }).then(response => {
        this.apkList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 更新机制字典翻译
    updateStatusFormat(row, column) {
      return this.selectDictLabel(this.updateStatusOptions, row.updateStatus);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        appId: null,
        androidDownloadUrl: null,
        status: null,
        version: null,
        build: null,
        description: null,
        iosDownUrl: null,
        userId: null,
        updateStatus: null,
        downloadCount: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加apk管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getApk(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改apk管理";
      });
    },
    showJSON(){
      this.apkResult = {};
      this.show = true ;
      const appKey = this.$route.query.appKey
      checkUpdateApk(appKey).then(data => {
        this.apkResult = data;
      })
    },
    /** 提交按钮 */
    submitForm() {
      if(this.file) {
        this.$refs.upload.submit();
      }else {
        this.createOrUpdate(null);
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除apk管理编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delApk(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有apk管理数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportApk(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },

    /**
     * 上传apk之前的校验
     * @param file
     */
    beforeUpload(file){
      const isPass = file.name.lastIndexOf(".apk") !== -1  ;
      return isPass ;
    },
    uploadChange(file){
      this.file = file ;
      if(file.status === "ready") { // 文件选择成功
        this.fileName = file.name ;
        this.fileSize = `${parseInt(file.size/1024/1024)}MB`
      }else if(file.status === "success") { // 文件上传成功 提交表单数据

      }
    },
    // 更新数据装态
    updateRowStatus(row){
      if(row.status == 1){
        row.status = 0
      }else {
        row.status = 1
      }
      let formData = new FormData();

      formData.append('data', JSON.stringify(row)) ; // 后端通过vo接受不到
      updateApk(formData).then(response => {
        if (response.code === 200) {
          this.msgSuccess("状态更新成功");
          this.getList();
        }
      });
    },
    /**
     * 自定义文件上传
     */
    uploadFile (option) {
      this.createOrUpdate(option.file);
    },
    createOrUpdate(file) {
      let formData = new FormData();
      if(file) {
        formData.append('file',file) ;
      }
      formData.append('data', JSON.stringify({ ...this.form,appId: this.appId })) ; // 后端通过vo接受不到
      addApk(formData).then(response => {
        if (response.code === 200) {
          this.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        }
      });
    }

  }
};
</script>
<style scoped lang="scss">
  .file-info{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .file-name,.file-size {
      font-size: 14px;
      font-weight: bold;
      color: #333;
    }
    .file-size {
      color: #f50;
      padding-right: 20px;
    }
  }
  .code-box {
    padding: 8px 16px;
    border-radius: 4px;
    background-color:#000;
    color: #fff;
    font-size: 14px;
  }
</style>
