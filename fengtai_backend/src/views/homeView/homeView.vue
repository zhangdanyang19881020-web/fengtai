<template>
  <div>
    <!-- Search Form -->
    <div>
      <select v-model="selectedCity">
        <option value="奉化市">奉化市</option>
        <option value="其他市">其他市</option>
      </select>
      <select v-model="selectedRoad">
        <option value="武陵西路">武陵西路</option>
        <option value="其他路">其他路</option>
      </select>
      <button @click="search">搜索</button>
    </div>

    <!-- Table -->
    <table>
      <thead>
        <tr>
          <th>图片</th>
          <th>名称</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td><img :src="item.imageUrl" alt="Image" width="50" height="50" /></td>
          <td>{{ item.name }}</td>
          <td>
            <button @click="editItem(index)">编辑</button>
            <button @click="deleteItem(index)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div>
      <span>共 {{ total }} 条</span>
      <button @click="prevPage" :disabled="currentPage === 1">前一页</button>
      <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
    </div>

    <!-- Add Button -->
    <button @click="addItem">添加</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedCity: '奉化市',
      selectedRoad: '武陵西路',
      currentPage: 1,
      pageSize: 5,
      total: 206, // Total items
      data: [], // The data for the table
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.total / this.pageSize);
    },
  },
  methods: {
    search() {
      // Implement search functionality
      console.log('Searching with city:', this.selectedCity, 'and road:', this.selectedRoad);
      this.fetchData();
    },
    fetchData() {
      // Simulating fetching data for the current page
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.data = Array.from({ length: this.pageSize }, (_, index) => ({
        imageUrl: 'https://via.placeholder.com/50',
        name: `将氏故居 ${startIndex + index + 1}`,
      }));
    },
    editItem(index) {
      console.log('Editing item at index:', index);
    },
    deleteItem(index) {
      console.log('Deleting item at index:', index);
      this.data.splice(index, 1);
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchData();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchData();
      }
    },
    addItem() {
      console.log('Adding new item');
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

table th, table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

button {
  margin: 5px;
  padding: 5px 10px;
}

button:disabled {
  background-color: #f1f1f1;
  cursor: not-allowed;
}
</style>
