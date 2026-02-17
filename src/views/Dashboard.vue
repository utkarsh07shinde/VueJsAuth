<template>
  <div class="crowdstrike-dashboard light-theme">
    <!-- ENHANCED QUICK STATS BAR -->
    <div class="enhanced-stats-bar">
      <v-card class="stat-card" v-for="stat in enhancedStats" :key="stat.title" :class="stat.trend">
        <div class="stat-content">
          <div class="stat-icon">
            <v-icon :color="stat.color">{{ stat.icon }}</v-icon>
          </div>
          <div class="stat-data">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-title">{{ stat.title }}</div>
            <div class="stat-trend" :class="stat.trend">
              <v-icon small>{{ stat.trendIcon }}</v-icon>
              {{ stat.trendText }}
            </div>
          </div>
          <div class="stat-sparkline">
            <v-sparkline
              :model-value="stat.sparkline"
              :smooth="8"
              :padding="8"
              :line-width="2"
              :stroke-width="2"
              :gradient="stat.gradient"
              auto-draw
            ></v-sparkline>
          </div>
        </div>
      </v-card>
    </div>

    <!-- MAIN DASHBOARD CONTENT (2 COLUMNS) -->
    <div class="dashboard-content">
      
      <!-- LEFT COLUMN -->
      <div class="left-column">
        <!-- REAL-TIME THREAT MONITOR -->
        <v-card class="dashboard-card threat-monitor">
          <div class="card-header">
            <div class="header-content">
              <v-icon color="#e81123" class="card-icon">mdi-radar</v-icon>
              <div>
                <div class="card-title">REAL-TIME THREAT MONITOR</div>
                <div class="card-subtitle">Live security event tracking</div>
              </div>
              <v-chip color="#e81123" variant="flat" size="small" class="live-badge">
                <v-icon small class="mr-1">mdi-pulse</v-icon>
                LIVE FEED
              </v-chip>
            </div>
            <div class="card-actions">
              <v-btn variant="text" size="small" color="#605e5c">
                <v-icon small class="mr-1">mdi-filter</v-icon>
                FILTERS
              </v-btn>
            </div>
          </div>
          
          <div class="table-container">
            <v-data-table
              :headers="threatHeaders"
              :items="threatFeed"
              hide-default-footer
              class="threat-table"
              :items-per-page="5"
            >
              
            </v-data-table>
          </div>
        </v-card>

        <!-- SECURITY POSTURE & METRICS -->
        <div class="metrics-grid">
          <v-card class="dashboard-card posture-card">
            <div class="card-header">
              <div class="card-title-section">
                <v-icon color="#107c10" class="card-icon">mdi-shield-star</v-icon>
                <div>
                  <div class="card-title">SECURITY POSTURE</div>
                  <div class="card-subtitle">Overall protection status</div>
                </div>
              </div>
            </div>
            <div class="posture-content">
              <div class="main-score">
                <v-progress-circular
                  :model-value="87"
                  :size="120"
                  :width="12"
                  color="#107c10"
                  class="score-progress"
                >
                  <div class="score-content">
                    <div class="score-value">87</div>
                    <div class="score-label">SCORE</div>
                  </div>
                </v-progress-circular>
              </div>
              <div class="posture-details">
                <div v-for="metric in postureMetrics" :key="metric.category" class="posture-metric">
                  <div class="metric-info">
                    <span class="metric-category">{{ metric.category }}</span>
                    <span class="metric-score" :class="metric.trend">{{ metric.score }}%</span>
                  </div>
                  <v-progress-linear
                    :model-value="metric.score"
                    height="6"
                    :color="metric.color"
                    class="metric-progress"
                  ></v-progress-linear>
                  <div class="metric-trend" :class="metric.trend">
                    <v-icon x-small>{{ metric.trendIcon }}</v-icon>
                    {{ metric.trendValue }}
                  </div>
                </div>
              </div>
            </div>
          </v-card>

          <v-card class="dashboard-card incident-card">
            <div class="card-header">
              <div class="card-title-section">
                <v-icon color="#d83b01" class="card-icon">mdi-timeline-alert</v-icon>
                <div>
                  <div class="card-title">INCIDENT TIMELINE</div>
                  <div class="card-subtitle">Last 24 hours activity</div>
                </div>
              </div>
            </div>
            <div class="incident-content">
              <div class="timeline-visual">
                <div class="timeline-bars">
                  <div v-for="(hour, index) in timelineData" :key="index" class="timeline-bar-container">
                    <div 
                      class="timeline-bar" 
                      :style="{ height: hour.detections + '%' }" 
                      :class="hour.peak ? 'peak' : ''"
                    ></div>
                    <div class="timeline-label">{{ hour.time }}</div>
                  </div>
                </div>
              </div>
              <div class="timeline-stats">
                <div class="timeline-stat">
                  <div class="stat-number">247</div>
                  <div class="stat-label">Detections (24h)</div>
                </div>
                <div class="timeline-stat">
                  <div class="stat-number">94%</div>
                  <div class="stat-label">Prevented</div>
                </div>
                <div class="timeline-stat">
                  <div class="stat-number">12</div>
                  <div class="stat-label">Critical</div>
                </div>
              </div>
            </div>
          </v-card>
        </div>

        <!-- NEW CONTAINER: SECURITY ACTIVITY -->
        <v-card class="dashboard-card activity-card">
          <div class="card-header">
            <div class="card-title-section">
              <v-icon color="#0078d4" class="card-icon">mdi-history</v-icon>
              <div>
                <div class="card-title">RECENT SECURITY ACTIVITY</div>
                <div class="card-subtitle">Latest security events and actions</div>
              </div>
            </div>
            <div class="card-actions">
              <v-btn variant="text" size="small" color="#605e5c">
                <v-icon small class="mr-1">mdi-dots-vertical</v-icon>
              </v-btn>
            </div>
          </div>
          <div class="activity-content">
            <div class="activity-list">
              <div v-for="activity in securityActivities" :key="activity.id" class="activity-item">
                <div class="activity-icon" :class="activity.type">
                  <v-icon size="16">{{ activity.icon }}</v-icon>
                </div>
                <div class="activity-details">
                  <div class="activity-title">{{ activity.title }}</div>
                  <div class="activity-meta">
                    <span class="activity-time">{{ activity.time }}</span>
                    <span class="activity-user">{{ activity.user }}</span>
                  </div>
                </div>
                <v-chip :color="activity.statusColor" variant="flat" size="x-small">
                  {{ activity.status }}
                </v-chip>
              </div>
            </div>
          </div>
        </v-card>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="right-column">
        <!-- ENDPOINT OVERVIEW -->
        <v-card class="dashboard-card host-overview">
          <div class="card-header">
            <div class="card-title-section">
              <v-icon color="#0078d4" class="card-icon">mdi-server</v-icon>
              <div>
                <div class="card-title">ENDPOINT OVERVIEW</div>
                <div class="card-subtitle">Protected assets status</div>
              </div>
            </div>
          </div>
          <div class="host-content">
            <div class="host-stats-grid">
              <div class="host-stat" v-for="stat in hostStats" :key="stat.label">
                <div class="host-icon" :class="stat.status">
                  <v-icon>{{ stat.icon }}</v-icon>
                </div>
                <div class="host-data">
                  <div class="host-value">{{ stat.value }}</div>
                  <div class="host-label">{{ stat.label }}</div>
                </div>
              </div>
            </div>
            
            <v-divider class="my-4" />
            
            <div class="os-breakdown">
              <div class="breakdown-header">
                <span>OS DISTRIBUTION</span>
                <span class="total-hosts">2,847 Total</span>
              </div>
              <div class="distribution-visual">
                <div class="distribution-item" v-for="os in osDistribution" :key="os.name">
                  <div class="os-info">
                    <div class="os-icon" :class="os.name.toLowerCase()"></div>
                    <div class="os-details">
                      <div class="os-name">{{ os.name }}</div>
                      <div class="os-count">{{ os.count }} hosts</div>
                    </div>
                  </div>
                  <div class="os-percentage">
                    <v-progress-linear
                      :model-value="os.percentage"
                      height="6"
                      :color="os.color"
                      class="os-progress"
                    ></v-progress-linear>
                    <span class="percentage-value">{{ os.percentage }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-card>

        <!-- THREAT INTELLIGENCE -->
        <v-card class="dashboard-card intelligence-card">
          <div class="card-header">
            <div class="card-title-section">
              <v-icon color="#881798" class="card-icon">mdi-brain</v-icon>
              <div>
                <div class="card-title">THREAT INTELLIGENCE</div>
                <div class="card-subtitle">Latest indicators & patterns</div>
              </div>
            </div>
          </div>
          <div class="intelligence-content">
            <v-tabs v-model="intelligenceTab" color="#e81123" density="compact">
              <v-tab value="iocs" class="intel-tab">IOC INDICATORS</v-tab>
              <v-tab value="patterns" class="intel-tab">ATTACK PATTERNS</v-tab>
            </v-tabs>

            <v-window v-model="intelligenceTab">
              <v-window-item value="iocs">
                <div class="ioc-list">
                  <div v-for="ioc in iocIndicators" :key="ioc.id" class="ioc-item">
                    <div class="ioc-header">
                      <div class="ioc-type">{{ ioc.type }}</div>
                      <v-chip :color="getSeverityColor(ioc.severity)" variant="flat" size="x-small">
                        {{ ioc.severity }}
                      </v-chip>
                    </div>
                    <div class="ioc-value">{{ ioc.value }}</div>
                    <div class="ioc-meta">
                      <span class="ioc-source">{{ ioc.source }}</span>
                      <span class="ioc-time">{{ ioc.time }}</span>
                    </div>
                  </div>
                </div>
              </v-window-item>

              <v-window-item value="patterns">
                <div class="patterns-list">
                  <div v-for="pattern in attackPatterns" :key="pattern.id" class="pattern-item">
                    <div class="pattern-icon">
                      <v-icon :color="pattern.color">{{ pattern.icon }}</v-icon>
                    </div>
                    <div class="pattern-content">
                      <div class="pattern-title">{{ pattern.title }}</div>
                      <div class="pattern-description">{{ pattern.description }}</div>
                      <div class="pattern-stats">
                        <span class="stat">Detections: {{ pattern.detections }}</span>
                        <span class="stat">Success Rate: {{ pattern.successRate }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </v-window-item>
            </v-window>
          </div>
        </v-card>


        
      </div>
    </div>

    <!-- NEW SECTION: GLOBAL THREAT INSIGHTS -->
    <div class="bottom-insights">
      <v-container fluid class="pa-0">
        <v-row>
          <v-col cols="12">
            <v-card class="dashboard-card global-chart-card">
              <div class="card-header">
                <div class="card-title-section">
                  <v-icon color="#881798" class="card-icon">mdi-chart-pie</v-icon>
                  <div>
                    <div class="card-title">GEOGRAPHIC THREAT DISTRIBUTION</div>
                    <div class="card-subtitle">Breakdown of threat origin by region (Past 7 Days)</div>
                  </div>
                </div>
                <div class="card-actions">
                  <v-btn variant="text" size="small" color="#605e5c">
                    <v-icon small class="mr-1">mdi-map-marker-radius</v-icon>
                    VIEW INTERACTIVE MAP
                  </v-btn>
                </div>
              </div>

              <div class="chart-content">
                <div class="pie-chart-placeholder">
                  <div class="chart-placeholder-visual">
                    <!-- Placeholder for the chart visualization -->
                    <v-icon size="64" color="#edebe9">mdi-chart-donut</v-icon>
                    <div class="text-caption text-medium-emphasis mt-2">Chart Rendering Area</div>
                  </div>

                  <div class="chart-legend-grid">
                    <div v-for="item in pieChartData" :key="item.region" class="chart-legend-item">
                      <span :style="{ backgroundColor: item.color }" class="legend-dot"></span>
                      <span class="legend-label">{{ item.region }}</span>
                      <span class="legend-value">{{ item.value }}</span>
                      <span class="legend-percentage">{{ item.percentage }}%</span>
                      <v-progress-linear
                        :model-value="item.percentage"
                        :color="item.color"
                        height="6"
                        rounded
                        class="legend-progress"
                      ></v-progress-linear>
                    </div>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Enhanced Stats with red accents
const enhancedStats = ref([
  { 
    title: 'CRITICAL THREATS', 
    value: '24', 
    trend: 'critical',
    trendIcon: 'mdi-trending-up',
    trendText: '+8 today',
    icon: 'mdi-alert-octagon',
    color: '#e81123',
    sparkline: [5, 8, 12, 18, 15, 24, 20],
    gradient: ['#e81123', '#d83b01']
  },
  { 
    title: 'PREVENTED ATTACKS', 
    value: '1,247', 
    trend: 'positive',
    trendIcon: 'mdi-shield-check',
    trendText: '98.7% rate',
    icon: 'mdi-shield-lock',
    color: '#107c10',
    sparkline: [1200, 1150, 1247, 1180, 1220, 1190, 1247],
    gradient: ['#107c10', '#13a10e']
  },
  { 
    title: 'SECURITY SCORE', 
    value: '94%', 
    trend: 'positive',
    trendIcon: 'mdi-trending-up',
    trendText: '+2% improved',
    icon: 'mdi-chart-line',
    color: '#107c10',
    sparkline: [88, 90, 89, 92, 91, 93, 94],
    gradient: ['#107c10', '#13a10e']
  },
  { 
    title: 'ACTIVE INCIDENTS', 
    value: '12', 
    trend: 'warning',
    trendIcon: 'mdi-alert',
    trendText: '3 escalated',
    icon: 'mdi-alert-circle',
    color: '#d83b01',
    sparkline: [8, 10, 7, 12, 9, 11, 12],
    gradient: ['#d83b01', '#ff8c00']
  },
  { 
    title: 'ENDPOINTS PROTECTED', 
    value: '2,847', 
    trend: 'positive',
    trendIcon: 'mdi-laptop',
    trendText: '98.5% online',
    icon: 'mdi-desktop-tower',
    color: '#0078d4',
    sparkline: [2800, 2810, 2820, 2830, 2840, 2845, 2847],
    gradient: ['#0078d4', '#0099bc']
  },
  { 
    title: 'COMPLIANCE SCORE', 
    value: '96%', 
    trend: 'positive',
    trendIcon: 'mdi-check-circle',
    trendText: 'Fully compliant',
    icon: 'mdi-certificate',
    color: '#881798',
    sparkline: [92, 93, 94, 95, 95, 96, 96],
    gradient: ['#881798', '#b146c2']
  }
])

// Security Activities Data
const securityActivities = ref([
  {
    id: 1,
    title: 'Threat contained - Emotet detection',
    time: '2 min ago',
    user: 'System Auto',
    type: 'containment',
    icon: 'mdi-shield-plus',
    status: 'Contained',
    statusColor: '#107c10'
  },
  {
    id: 2,
    title: 'New vulnerability scan initiated',
    time: '15 min ago',
    user: 'Security Admin',
    type: 'scan',
    icon: 'mdi-radar',
    status: 'Running',
    statusColor: '#0078d4'
  },
  {
    id: 3,
    title: 'Firewall rule updated',
    time: '1 hour ago',
    user: 'Network Team',
    type: 'config',
    icon: 'mdi-firewall',
    status: 'Completed',
    statusColor: '#107c10'
  },
  {
    id: 4,
    title: 'Endpoint protection updated',
    time: '2 hours ago',
    user: 'System Auto',
    type: 'update',
    icon: 'mdi-update',
    status: 'Completed',
    statusColor: '#107c10'
  },
  {
    id: 5,
    title: 'User access review completed',
    time: '4 hours ago',
    user: 'Security Team',
    type: 'audit',
    icon: 'mdi-clipboard-check',
    status: 'Reviewed',
    statusColor: '#107c10'
  }
])

// Threat Table Headers & Data (Unchanged)
const threatHeaders = ref([
  { title: 'SEVERITY', key: 'severity', width: '100px' },
  { title: 'THREAT DESCRIPTION', key: 'title', sortable: false },
  { title: 'IOC', key: 'ioc', width: '200px' },
  { title: 'TIME', key: 'time', width: '100px' },
  { title: 'ACTIONS', key: 'actions', width: '120px', sortable: false }
])

const threatFeed = ref([
  {
    id: 1,
    title: 'SUSPICIOUS POWERSHELL EXECUTION - Emotet Pattern',
    ioc: 'SHA256: a1b2c3d4e5f6...',
    time: '2 min ago',
    severity: 'critical'
  },
  {
    id: 2,
    title: 'MEMORY INJECTION - Cobalt Strike Beacon',
    ioc: 'PID: 3847 → 4012',
    time: '15 min ago',
    severity: 'high'
  },
  {
    id: 3,
    title: 'DATA EXFILTRATION - Large Outbound Transfer',
    ioc: 'Domain: malicious-tracker.com',
    time: '1 hour ago',
    severity: 'high'
  },
  {
    id: 4,
    title: 'BRUTE FORCE ATTACK - RDP Login Attempts',
    ioc: 'IP: 10.0.23.45',
    time: '2 hours ago',
    severity: 'medium'
  },
  {
    id: 5,
    title: 'SUSPICIOUS REGISTRY MODIFICATION',
    ioc: 'HKLM\\Software\\Classes\\...',
    time: '3 hours ago',
    severity: 'medium'
  }
])

// Posture Metrics (Unchanged)
const postureMetrics = ref([
  { category: 'PREVENTION', score: 92, trend: 'positive', trendIcon: 'mdi-trending-up', trendValue: '+3%', color: '#107c10' },
  { category: 'DETECTION', score: 88, trend: 'positive', trendIcon: 'mdi-trending-up', trendValue: '+2%', color: '#0078d4' },
  { category: 'RESPONSE', score: 79, trend: 'negative', trendIcon: 'mdi-trending-down', trendValue: '-1%', color: '#d83b01' },
  { category: 'HARDENING', score: 85, trend: 'positive', trendIcon: 'mdi-trending-up', trendValue: '+4%', color: '#881798' }
])

// Timeline Data (Unchanged)
const timelineData = ref([
  { time: '00', detections: 15, peak: false },
  { time: '02', detections: 8, peak: false },
  { time: '04', detections: 5, peak: false },
  { time: '06', detections: 12, peak: false },
  { time: '08', detections: 45, peak: true },
  { time: '10', detections: 38, peak: false },
  { time: '12', detections: 52, peak: true },
  { time: '14', detections: 28, peak: false },
  { time: '16', detections: 35, peak: false },
  { time: '18', detections: 42, peak: false },
  { time: '20', detections: 25, peak: false },
  { time: '22', detections: 18, peak: false }
])

// Host Stats (Unchanged)
const hostStats = ref([
  { label: 'TOTAL HOSTS', value: '2,847', status: 'total', icon: 'mdi-server' },
  { label: 'ONLINE', value: '2,812', status: 'online', icon: 'mdi-lan-connect' },
  { label: 'PROTECTED', value: '2,805', status: 'protected', icon: 'mdi-shield-check' },
  { label: 'AT RISK', value: '42', status: 'risk', icon: 'mdi-alert' }
])

// OS Distribution (Unchanged)
const osDistribution = ref([
  { name: 'Windows', count: '1,842', percentage: 65, color: '#0078d4' },
  { name: 'Linux', count: '756', percentage: 27, color: '#d83b01' },
  { name: 'macOS', count: '249', percentage: 8, color: '#000000' }
])

// IOC Indicators (Unchanged)
const iocIndicators = ref([
  { id: 1, type: 'MD5', value: 'd41d8cd98f00b204e9800998ecf8427e', severity: 'high', source: 'Threat Intel', time: '2 hours ago' },
  { id: 2, type: 'SHA256', value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', severity: 'critical', source: 'CrowdStrike', time: '1 hour ago' },
  { id: 3, type: 'IP', value: '185.220.101.141', severity: 'medium', source: 'Firewall', time: '4 hours ago' },
  { id: 4, type: 'DOMAIN', value: 'tracking-malware.net', severity: 'high', source: 'DNS Filter', time: '6 hours ago' }
])

// Attack Patterns (Unchanged)
const attackPatterns = ref([
  { id: 1, title: 'Lateral Movement', description: 'SMB and RDP based movement detected', detections: '24', successRate: '92%', icon: 'mdi-arrow-decision', color: '#e81123' },
  { id: 2, title: 'Credential Dumping', description: 'LSASS memory dumping attempts', detections: '18', successRate: '95%', icon: 'mdi-key', color: '#d83b01' },
  { id: 3, title: 'Command & Control', description: 'Beaconing to C2 infrastructure', detections: '32', successRate: '88%', icon: 'mdi-transit-connection', color: '#0078d4' }
])

// Compliance Standards (Unchanged)
const complianceStandards = ref([
  { name: 'ISO 27001', score: 98, status: 'Compliant', statusColor: '#107c10', statusIcon: 'mdi-check-circle', lastAudit: '2 days ago' },
  { name: 'SOC 2', score: 92, status: 'Compliant', statusColor: '#107c10', statusIcon: 'mdi-check-circle', lastAudit: '1 week ago' },
  { name: 'GDPR', score: 96, status: 'Compliant', statusColor: '#107c10', statusIcon: 'mdi-check-circle', lastAudit: '1 month ago' },
  { name: 'HIPAA', score: 85, status: 'In Progress', statusColor: '#d83b01', statusIcon: 'mdi-clock', lastAudit: '3 months ago' }
])

const intelligenceTab = ref('iocs')

// NEW DATA: Pie Chart / Geographic Distribution Data
const pieChartData = ref([
  { region: 'North America', value: '1,560', percentage: 45, color: '#0078d4' },
  { region: 'Europe', value: '865', percentage: 25, color: '#e81123' },
  { region: 'Asia Pacific', value: '625', percentage: 18, color: '#d83b01' },
  { region: 'South America', value: '240', percentage: 7, color: '#107c10' },
  { region: 'Middle East', value: '175', percentage: 5, color: '#ffb900' },
  { region: 'Africa', value: '170', percentage: 5, color: '#881798' },
])

const getSeverityColor = (severity) => {
  const colors = {
    critical: '#e81123',
    high: '#d83b01',
    medium: '#ffb900',
    low: '#0078d4'
  }
  return colors[severity] || '#605e5c'
}
</script>

<style scoped>
.light-theme {
  background: #ffffff;
  min-height: 100vh;
  color: #323130;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* Enhanced Stats Bar */
.enhanced-stats-bar {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  padding: 24px;
  background: #faf9f8;
  border-bottom: 1px solid #edebe9;
}

.stat-card {
  background: #ffffff !important;
  border: 1px solid #edebe9 !important;
  border-radius: 8px !important;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(232, 17, 35, 0.15) !important;
  border-color: #e81123 !important;
}

.stat-card.critical:hover {
  box-shadow: 0 4px 12px rgba(232, 17, 35, 0.25) !important;
}

.stat-content {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: rgba(232, 17, 35, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-data {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 4px;
  color: #323130;
}

.stat-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #605e5c;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.stat-trend {
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
}

.stat-trend.positive {
  color: #107c10;
}

.stat-trend.critical {
  color: #e81123;
}

.stat-trend.warning {
  color: #d83b01;
}

.stat-sparkline {
  width: 80px;
  height: 40px;
}

/* Dashboard Content */
.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
  padding: 24px;
  max-width: 1800px;
  margin: 0 auto;
}

/* Card Styles */
.dashboard-card {
  background: #ffffff;
  border: 1px solid #edebe9 ;
  border-radius: 8px ;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #edebe9;
  background: #faf9f8;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-title-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon {
  font-size: 24px;
}

.card-title {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #323130;
  margin-bottom: 2px;
}

.card-subtitle {
  font-size: 12px;
  color: #605e5c;
  font-weight: 500;
}

.live-badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* PADDING */
.table-container {
  padding: 0 8px 8px 8px;
}

.posture-content {
  padding: 20px 24px;
  display: flex;
  gap: 24px;
  align-items: center;
}

.incident-content {
  padding: 20px 24px;
}

.host-content {
  padding: 20px 24px;
}

.intelligence-content {
  padding: 0;
}

.ioc-list, .patterns-list {
  padding: 16px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.compliance-content {
  padding: 20px 24px;
}

.activity-content {
  padding: 16px 20px 20px 20px;
}

/* Threat Table */
.threat-table {
  background: transparent !important;
}

.threat-table :deep(.v-table) {
  background: transparent !important;
}

.threat-table :deep(.v-table .v-table__wrapper > table > thead > tr > th) {
  background: #faf9f8 !important;
  color: #605e5c !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #edebe9 !important;
}

.threat-table :deep(.v-table .v-table__wrapper > table > tbody > tr > td) {
  background: transparent !important;
  color: #323130 !important;
  border-bottom: 1px solid #edebe9 !important;
  font-size: 13px;
  padding: 12px 16px;
}

.threat-table :deep(.v-table .v-table__wrapper > table > tbody > tr:hover > td) {
  background: rgba(232, 17, 35, 0.05) !important;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

/* Timeline Visualization */
.timeline-visual {
  margin-bottom: 20px;
}

.timeline-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 120px;
  gap: 8px;
}

.timeline-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.timeline-bar {
  width: 12px;
  background: linear-gradient(to top, #0078d4, #107c10);
  border-radius: 6px 6px 0 0;
  min-height: 4px;
  transition: all 0.3s ease;
}

.timeline-bar.peak {
  background: linear-gradient(to top, #e81123, #d83b01);
}

.timeline-label {
  font-size: 10px;
  color: #605e5c;
  margin-top: 8px;
}

.timeline-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #edebe9;
}

.timeline-stat {
  text-align: center;
}

.stat-number {
  font-size: 20px;
  font-weight: 700;
  color: #323130;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 11px;
  color: #605e5c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* NEW ACTIVITY CARD STYLES */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #faf9f8;
  border-radius: 6px;
  border: 1px solid #edebe9;
  transition: all 0.2s ease;
}

.activity-item:hover {
  border-color: #0078d4;
  background: #ffffff;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 120, 212, 0.1);
}

.activity-icon.containment {
  background: rgba(232, 17, 35, 0.1);
}

.activity-icon.scan {
  background: rgba(0, 120, 212, 0.1);
}

.activity-icon.config {
  background: rgba(214, 59, 1, 0.1);
}

.activity-icon.update {
  background: rgba(16, 124, 16, 0.1);
}

.activity-icon.audit {
  background: rgba(136, 23, 152, 0.1);
}

.activity-details {
  flex: 1;
}

.activity-title {
  font-size: 13px;
  font-weight: 600;
  color: #323130;
  margin-bottom: 2px;
}

.activity-meta {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: #605e5c;
}

.activity-time {
  font-weight: 500;
}

.activity-user {
  font-style: italic;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}


/* --- NEW BOTTOM --- */

.bottom-insights {
   padding: 0 24px 24px 24px; 
  max-width: 1800px;
  margin: 0 auto;
}

.global-chart-card {
  min-height: 250px;
  margin-bottom: 0; 
}

.chart-content {
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 40px;
}

.pie-chart-placeholder {
  display: flex;
  gap: 40px;
  width: 100%;
}

.chart-placeholder-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 200px;
  height: 200px;
  border: 2px dashed #edebe9;
  border-radius: 8px;
  flex-shrink: 0;
  margin-right: 20px;
}

.chart-legend-grid {
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px 30px;
}

.chart-legend-item {
  display: grid;
  grid-template-columns: 12px auto 60px 50px; 
  grid-template-rows: auto auto;
  align-items: center;
  column-gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f3f2f1;
}

.chart-legend-item:nth-last-child(-n + 2) {
  border-bottom: none;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  grid-row: 1 / 3;
}

.legend-label {
  font-weight: 600;
  color: #323130;
  font-size: 13px;
}

.legend-value {
  font-size: 13px;
  font-weight: 700;
  color: #0078d4;
  text-align: right;
}

.legend-percentage {
  font-size: 13px;
  font-weight: 700;
  color: #605e5c;
  text-align: right;
}

.legend-progress {
  grid-column: 2 / 5;
  margin-top: -3px; 
}

/* Responsive Design */
@media (max-width: 1400px) {
  .enhanced-stats-bar {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-legend-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1200px) {
  .dashboard-content {
    grid-template-columns: 1fr;
  }
  
  .enhanced-stats-bar {
    grid-template-columns: repeat(2, 1fr);
  }

  .pie-chart-placeholder {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  .chart-placeholder-visual {
    margin-right: 0;
  }
}

@media (max-width: 600px) {
  .enhanced-stats-bar {
    grid-template-columns: 1fr;
  }
}
</style>