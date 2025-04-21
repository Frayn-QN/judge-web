<template>
  <el-row class="section">
    <el-col :span="24">
      <h2 class="section-title">您的评测数据：</h2>
      <div class="data-container">
        <div class="chart-wrapper">
          <div ref="pieChart"
               class="pie-chart" />
        </div>

        <div class="stats-wrapper">
          <el-descriptions :column="1"
                           border>
            <el-descriptions-item label="总提交量">
              <span class="stat-value">{{ stats.total }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="平均得分">
              <span class="stat-value">{{ stats.average.toFixed(1) }}</span>
            </el-descriptions-item>
          </el-descriptions>

          <div class="safe-progress">
            <template v-if="hasSubmissions">
              <el-progress :percentage="passPercentage"
                           status="success"
                           :stroke-width="16" />
              <div class="progress-label">
                通过率: {{ passPercentage }}%
              </div>
            </template>
            <div v-else
                 class="no-data">
              <i class="el-icon-warning" />
              暂无提交记录
            </div>
          </div>

          <div class="status-distribution">
            <div v-for="(item, key) in statusItems"
                 :key="key"
                 class="status-item">
              <div class="status-label">
                <div :class="['status-color', item.color]" />
                {{ item.label }}
              </div>
              <span class="status-count">{{ stats[key] }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

  <script>
import * as echarts from 'echarts'
import { countByUser } from '@/api/task'

export default {
  name: 'Statistic',
  data () {
    return {
      stats: {
        total: 0,
        average: 0,
        AC: 0,
        WA: 0,
        ERR: 0
      },
      statusItems: {
        AC: { label: '通过', color: 'success' },
        WA: { label: '答案错误', color: 'warning' },
        ERR: { label: '系统错误', color: 'danger' }
      },
      pieChart: null
    }
  },
  computed: {
    hasSubmissions () {
      return Number(this.stats.total) > 0
    },
    passPercentage () {
      if (!this.hasSubmissions) return 0
      const percentage = (this.stats.AC / this.stats.total * 100) || 0
      return Number(percentage.toFixed(1))
    }
  },
  mounted () {
    this.initChart()
    this.loadStatistic()
  },
  beforeDestroy () {
    if (this.pieChart) {
      this.pieChart.dispose()
    }
  },
  methods: {
    initChart () {
      this.pieChart = echarts.init(this.$refs.pieChart)
      this.updateChart()
    },
    updateChart () {
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        series: [{
          type: 'pie',
          radius: ['40%', '65%'],
          color: ['#67C23A', '#E6A23C', '#F56C6C'],
          data: [
            { value: this.stats.AC, name: '通过' },
            { value: this.stats.WA, name: '答案错误' },
            { value: this.stats.ERR, name: '系统错误' }
          ],
          label: { show: false },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
      this.pieChart.setOption(option)
    },
    async loadStatistic () {
      try {
        const res = await countByUser()
        this.stats = res.data
        this.$nextTick(this.updateChart)
      } catch (error) {
        console.error('数据加载失败', error)
      }
    }
  }
}
  </script>

  <style lang="scss" scoped>
.data-container {
  display: flex;
  gap: 30px;
  margin-top: 20px;
}

.chart-wrapper {
  flex: 1;
  min-width: 300px;
}

.pie-chart {
  width: 100%;
  height: 300px;
}

.stats-wrapper {
  flex: 1;
  max-width: 400px;
}

.stat-value {
  font-size: 18px;
  color: #303133;
}

.safe-progress {
  margin: 20px 0;
}

.no-data {
  color: #909399;
  padding: 15px;
  text-align: center;
  border: 1px dashed #ebeef5;
}

.status-distribution {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.status-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;

  &.success {
    background: #67c23a;
  }
  &.warning {
    background: #e6a23c;
  }
  &.danger {
    background: #f56c6c;
  }
}

.status-count {
  font-weight: 500;
  color: #606266;
}
</style>
