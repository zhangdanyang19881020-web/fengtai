<template>
  <div class="form-container">
    <el-form :model="form" label-width="100px">
      <!-- 头像 -->
      <el-form-item label="头像" required>
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
        >
          <img v-if="form.avatar" :src="form.avatar" class="avatar" />
          <el-icon v-else><Picture /></el-icon>
          <el-button type="primary">上传</el-button>
        </el-upload>
      </el-form-item>

      <!-- 姓名 -->
      <el-form-item label="名字" required>
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>

      <!-- 籍贯 -->
      <el-form-item label="籍贯" required>
        <el-select v-model="form.province" placeholder="请选择省份" style="width: 150px;">
          <el-option label="奉化市" value="奉化市" />
        </el-select>
        <el-select v-model="form.city" placeholder="请选择街道" style="width: 150px; margin-left: 10px;">
          <el-option label="锦屏街道" value="锦屏街道" />
        </el-select>
        <el-select v-model="form.community" placeholder="请选择社区" style="width: 150px; margin-left: 10px;">
          <el-option label="奉中社区" value="奉中社区" />
        </el-select>
      </el-form-item>

      <!-- 个人信息 -->
      <el-form-item label="个人信息" required>
        <el-input type="textarea" v-model="form.info" placeholder="请输入内容" />
      </el-form-item>

      <!-- 到访年份 -->
      <el-form-item label="到访年份" required>
        <el-tag
          v-for="(year, index) in form.visitYears"
          :key="index"
          closable
          @close="removeYear(index)"
        >
          {{ year }}
        </el-tag>
        <el-input
          v-model="yearInput"
          placeholder="请输入1949-2025之间的年份数字"
          style="width: 250px; margin-left: 10px;"
          @keyup.enter="addYear"
        />
        <el-button type="success" @click="addYear" style="margin-left: 10px;">添加到访年份</el-button>
      </el-form-item>

      <!-- 家族关系 -->
      <el-form-item label="家族关系" required>
        <el-table :data="form.family" border style="width: 500px;">
          <el-table-column prop="relation" label="关系" width="120" />
          <el-table-column prop="name" label="名字" width="180" />
          <el-table-column label="操作" width="80">
            <template #default="{ $index }">
              <el-button
                type="danger"
                circle
                icon="Close"
                @click="removeFamily($index)"
              />
            </template>
          </el-table-column>
        </el-table>

        <div style="margin-top: 10px;">
          <el-select v-model="familyRelation" placeholder="关系" style="width: 120px;">
            <el-option label="爷爷" value="爷爷" />
            <el-option label="父亲" value="父亲" />
            <el-option label="母亲" value="母亲" />
            <el-option label="姐姐" value="姐姐" />
          </el-select>
          <el-input v-model="familyName" placeholder="请输入姓名" style="width: 180px; margin-left: 10px;" />
          <el-button type="success" @click="addFamily" style="margin-left: 10px;">添加</el-button>
        </div>
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" size="large">添加台胞</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { Picture, Close } from "@element-plus/icons-vue"

const form = ref({
  avatar: "",
  name: "",
  province: "",
  city: "",
  community: "",
  info: "",
  visitYears: ["2008", "2021"],
  family: [
    { relation: "爷爷", name: "蒋生挺" },
    { relation: "父亲", name: "蒋孝天" },
    { relation: "母亲", name: "王慧菊" },
    { relation: "姐姐", name: "蒋音甄" },
  ],
})

const yearInput = ref("")
const familyRelation = ref("")
const familyName = ref("")

const handleAvatarSuccess = (res, file) => {
  form.value.avatar = URL.createObjectURL(file.raw)
}

const addYear = () => {
  const year = yearInput.value.trim()
  if (year && /^\d{4}$/.test(year)) {
    form.value.visitYears.push(year)
    yearInput.value = ""
  }
}

const removeYear = (index) => {
  form.value.visitYears.splice(index, 1)
}

const addFamily = () => {
  if (familyRelation.value && familyName.value) {
    form.value.family.push({
      relation: familyRelation.value,
      name: familyName.value,
    })
    familyRelation.value = ""
    familyName.value = ""
  }
}

const removeFamily = (index) => {
  form.value.family.splice(index, 1)
}
</script>

<style scoped>
.form-container {
  padding: 20px;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>
