<template>
  <div class="family-tree-container">
    <div class="add-member-form">
      <h3>添加家庭成员</h3>
      <input v-model="newMember.name" placeholder="姓名" />
      <select v-model="newMember.relation">
        <option value="父亲">父亲</option>
        <option value="母亲">母亲</option>
        <option value="儿子">儿子</option>
        <option value="女儿">女儿</option>
        <option value="祖父">祖父</option>
        <option value="祖母">祖母</option>
      </select>
      <button @click="addFamilyMember">添加</button>
    </div>

    <svg ref="familyTree" width="100%" height="600"></svg>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  data() {
    return {
      // 初始家族数据
      familyData: {
        name: "将维尘", // 这个是中心人物，可以根据需要调整
        parents: [
          { name: "将生煜", relation: "父亲" },
          { name: "王惠榕", relation: "母亲" }
        ],
        children: [
          { name: "将得明", relation: "儿子" },
          { name: "将得恩", relation: "女儿" }
        ],
        grandparents: [
          { name: "将学天", relation: "祖父" },
          { name: "将幸天", relation: "祖母" },
          { name: "王大山", relation: "外祖父" },
          { name: "王秀芳", relation: "外祖母" }
        ]
      },
      newMember: { name: '', relation: '父亲' }, // 新成员的数据
    };
  },
  methods: {
    // 添加家庭成员
    addFamilyMember() {
      if (!this.newMember.name) {
        alert("请输入成员的姓名");
        return;
      }
      
      // 根据关系，添加成员到适当的位置
      if (this.newMember.relation === '父亲' || this.newMember.relation === '母亲') {
        this.familyData.parents.push({ ...this.newMember });
      } else if (this.newMember.relation === '儿子' || this.newMember.relation === '女儿') {
        this.familyData.children.push({ ...this.newMember });
      } else if (this.newMember.relation === '祖父' || this.newMember.relation === '祖母') {
        this.familyData.grandparents.push({ ...this.newMember });
      }

      // 清空表单
      this.newMember.name = '';
      this.newMember.relation = '父亲';

      // 更新家族树
      this.renderFamilyTree();
    },

    // 渲染家族树
    renderFamilyTree() {
      const width = this.$refs.familyTree.clientWidth;
      const height = this.$refs.familyTree.clientHeight;

      const treeLayout = d3.tree().size([height, width - 100]);

      // 更新数据结构：将父母作为根节点，子女作为子节点
      const root = d3.hierarchy({
        name: "家族树",
        children: [
          { name: "将生煜", children: this.familyData.children }, // 父亲的子女
          { name: "王惠榕", children: this.familyData.children }, // 母亲的子女
        ]
      });

      const links = treeLayout(root).links();
      const nodes = root.descendants();

      const svg = d3.select(this.$refs.familyTree);
      svg.selectAll('*').remove(); // 清除之前的绘制内容

      // 绘制连接线
      svg
        .selectAll('.link')
        .data(links)
        .enter()
        .append('line')
        .attr('class', 'link')
        .attr('x1', (d) => d.source.y)
        .attr('y1', (d) => d.source.x)
        .attr('x2', (d) => d.target.y)
        .attr('y2', (d) => d.target.x)
        .attr('stroke', '#555')
        .attr('stroke-width', 2);

      // 绘制节点（家庭成员）
      svg
        .selectAll('.node')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('class', 'node')
        .attr('cx', (d) => d.y)
        .attr('cy', (d) => d.x)
        .attr('r', 10)
        .attr('fill', '#ffcc00');

      // 绘制节点的文字
      svg
        .selectAll('.text')
        .data(nodes)
        .enter()
        .append('text')
        .attr('class', 'text')
        .attr('x', (d) => d.y + 12)
        .attr('y', (d) => d.x + 5)
        .text((d) => d.data.name)
        .attr('font-size', '14px')
        .attr('fill', '#000');
    },
  },
  mounted() {
    this.renderFamilyTree();
  },
};
</script>

<style scoped>
.family-tree-container {
  margin: 20px;
  text-align: center;
}

.add-member-form {
  margin-bottom: 20px;
}

input, select {
  padding: 8px;
  margin-right: 10px;
}

button {
  padding: 8px 15px;
  background-color: #ff5733;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #ff3300;
}

.node {
  cursor: pointer;
}

.link {
  fill: none;
  stroke: #ccc;
  stroke-width: 2px;
}

.text {
  font-family: Arial, sans-serif;
}
</style>
