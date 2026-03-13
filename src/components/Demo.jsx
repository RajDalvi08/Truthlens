"use client"
import React, { useState, useMemo } from "react"
import Navigation from "./Navigation"

// ==================== DATA ====================

const stats = [
  {
    label: "Articles Analyzed",
    value: "12,847",
    change: "+12.5%",
    changeType: "positive",
    description: "vs last period",
    sparkline: [40, 45, 38, 52, 48, 60, 55, 70, 65, 72, 68, 78],
  },
  {
    label: "Bias Detected",
    value: "2,841",
    change: "+8.2%",
    changeType: "negative",
    description: "vs last period",
    sparkline: [30, 35, 42, 38, 45, 40, 48, 52, 50, 55, 58, 62],
  },
  {
    label: "Neutral Content",
    value: "8,423",
    change: "+15.3%",
    changeType: "positive",
    description: "vs last period",
    sparkline: [50, 55, 52, 60, 58, 65, 62, 70, 68, 75, 72, 80],
  },
  {
    label: "Accuracy Score",
    value: "94.7%",
    change: "+2.1%",
    changeType: "positive",
    description: "model confidence",
    sparkline: [88, 89, 90, 89, 91, 92, 91, 93, 92, 94, 93, 95],
  },
]

const trendData = [
  { date: "Jan 1", left: 120, center: 280, right: 100 },
  { date: "Jan 8", left: 140, center: 300, right: 110 },
  { date: "Jan 15", left: 100, center: 320, right: 130 },
  { date: "Jan 22", left: 160, center: 290, right: 90 },
  { date: "Jan 29", left: 130, center: 340, right: 120 },
  { date: "Feb 5", left: 110, center: 360, right: 100 },
  { date: "Feb 12", left: 150, center: 380, right: 110 },
  { date: "Feb 19", left: 135, center: 395, right: 105 },
  { date: "Feb 26", left: 145, center: 410, right: 115 },
  { date: "Mar 5", left: 125, center: 420, right: 108 },
]

const distributionData = [
  { source: "Wire Services", left: 120, center: 580, right: 100 },
  { source: "Broadcast", left: 220, center: 340, right: 180 },
  { source: "Print", left: 180, center: 420, right: 160 },
  { source: "Digital Native", left: 280, center: 310, right: 240 },
  { source: "Aggregators", left: 90, center: 620, right: 70 },
]

const credibilityData = [
  { name: "Highly Reliable", value: 45, color: "#22c55e" },
  { name: "Generally Reliable", value: 30, color: "#3b82f6" },
  { name: "Mixed Reliability", value: 18, color: "#a855f7" },
  { name: "Low Reliability", value: 7, color: "#ef4444" },
]

const articles = [
  {
    id: 1,
    title: "Economic Policy Changes Impact Global Market Trends",
    source: "Reuters",
    sourceIcon: "R",
    bias: "Center",
    confidence: 92,
    date: "Mar 10, 2026",
    status: "verified",
  },
  {
    id: 2,
    title: "Climate Summit Reaches Historic International Agreement",
    source: "BBC News",
    sourceIcon: "B",
    bias: "Center-Left",
    confidence: 87,
    date: "Mar 10, 2026",
    status: "verified",
  },
  {
    id: 3,
    title: "Tech Giants Face New Regulatory Challenges in EU",
    source: "Fox News",
    sourceIcon: "F",
    bias: "Right",
    confidence: 78,
    date: "Mar 9, 2026",
    status: "review",
  },
  {
    id: 4,
    title: "Healthcare Reform Bill Passes Senate Vote Today",
    source: "CNN",
    sourceIcon: "C",
    bias: "Left",
    confidence: 84,
    date: "Mar 9, 2026",
    status: "verified",
  },
  {
    id: 5,
    title: "International Trade Relations Show Significant Improvement",
    source: "AP News",
    sourceIcon: "A",
    bias: "Center",
    confidence: 95,
    date: "Mar 8, 2026",
    status: "verified",
  },
  {
    id: 6,
    title: "Energy Sector Accelerates Shift to Renewable Sources",
    source: "The Guardian",
    sourceIcon: "G",
    bias: "Center-Left",
    confidence: 81,
    date: "Mar 8, 2026",
    status: "verified",
  },
]

const markers = [
  { name: "New York", coordinates: [-74.006, 40.7128], articles: 2847 },
  { name: "London", coordinates: [-0.1276, 51.5074], articles: 2156 },
  { name: "Tokyo", coordinates: [139.6917, 35.6895], articles: 1823 },
  { name: "Sydney", coordinates: [151.2093, -33.8688], articles: 892 },
  { name: "Berlin", coordinates: [13.405, 52.52], articles: 1245 },
  { name: "Sao Paulo", coordinates: [-46.6333, -23.5505], articles: 678 },
  { name: "Mumbai", coordinates: [72.8777, 19.076], articles: 1102 },
  { name: "Dubai", coordinates: [55.2708, 25.2048], articles: 534 },
  { name: "Toronto", coordinates: [-79.3832, 43.6532], articles: 945 },
  { name: "Singapore", coordinates: [103.8198, 1.3521], articles: 756 },
]

const regionStats = [
  { region: "North America", articles: 3792, change: "+12%" },
  { region: "Europe", articles: 3401, change: "+8%" },
  { region: "Asia Pacific", articles: 4573, change: "+18%" },
  { region: "Latin America", articles: 678, change: "+5%" },
]

// ==================== HELPER FUNCTIONS ====================

function cn(...classes) {
  return classes.filter(Boolean).join(" ")
}

function getBiasColor(bias) {
  switch (bias) {
    case "Left":
      return { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" }
    case "Center-Left":
      return { bg: "bg-blue-500/10", text: "text-blue-300", border: "border-blue-500/20" }
    case "Center":
      return { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" }
    case "Center-Right":
      return { bg: "bg-orange-500/10", text: "text-orange-300", border: "border-orange-500/20" }
    case "Right":
      return { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30" }
    default:
      return { bg: "bg-gray-500/20", text: "text-gray-400", border: "border-gray-500/30" }
  }
}

function getConfidenceColor(value) {
  if (value >= 90) return "bg-emerald-500"
  if (value >= 80) return "bg-blue-500"
  return "bg-orange-500"
}

// ==================== INLINE SVG ICONS ====================

function FileTextIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
      <path d="M10 9H8"/>
      <path d="M16 13H8"/>
      <path d="M16 17H8"/>
    </svg>
  )
}

function AlertTriangleIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
      <path d="M12 9v4"/>
      <path d="M12 17h.01"/>
    </svg>
  )
}

function CheckCircleIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  )
}

function GaugeIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 14 4-4"/>
      <path d="M3.34 19a10 10 0 1 1 17.32 0"/>
    </svg>
  )
}

function TrendingUpIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
      <polyline points="16 7 22 7 22 13"/>
    </svg>
  )
}

function TrendingDownIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/>
      <polyline points="16 17 22 17 22 11"/>
    </svg>
  )
}

function SearchIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.3-4.3"/>
    </svg>
  )
}

function BellIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </svg>
  )
}

function ChevronDownIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  )
}

function ChevronLeftIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  )
}

function ChevronRightIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  )
}

function PlusIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/>
      <path d="M12 5v14"/>
    </svg>
  )
}

function HelpCircleIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <path d="M12 17h.01"/>
    </svg>
  )
}

function DownloadIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" x2="12" y1="15" y2="3"/>
    </svg>
  )
}

function Maximize2Icon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 3 21 3 21 9"/>
      <polyline points="9 21 3 21 3 15"/>
      <line x1="21" x2="14" y1="3" y2="10"/>
      <line x1="3" x2="10" y1="21" y2="14"/>
    </svg>
  )
}

function MoreHorizontalIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1"/>
      <circle cx="19" cy="12" r="1"/>
      <circle cx="5" cy="12" r="1"/>
    </svg>
  )
}

function FilterIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  )
}

function ExternalLinkIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6"/>
      <path d="M10 14 21 3"/>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    </svg>
  )
}

function GlobeIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
      <path d="M2 12h20"/>
    </svg>
  )
}

const statIcons = [FileTextIcon, AlertTriangleIcon, CheckCircleIcon, GaugeIcon]

// ==================== MINI SPARKLINE ====================

function MiniSparkline({ data, positive }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 80
  const height = 24

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((value - min) / range) * height
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "#22c55e" : "#ef4444"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ==================== SIMPLE BAR CHART ====================

function SimpleBarChart({ data }) {
  const maxValue = Math.max(...data.map((d) => d.left + d.center + d.right))

  return (
    <div className="flex flex-col gap-3">
      {data.map((item, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <span className="text-xs text-gray-400 w-24 truncate">{item.source}</span>
          <div className="flex-1 flex h-6 rounded-md overflow-hidden bg-gray-800">
            <div
              className="bg-blue-500 h-full"
              style={{ width: `${(item.left / maxValue) * 100}%` }}
            />
            <div
              className="bg-emerald-500 h-full"
              style={{ width: `${(item.center / maxValue) * 100}%` }}
            />
            <div
              className="bg-orange-500 h-full"
              style={{ width: `${(item.right / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// ==================== SIMPLE AREA CHART ====================

function SimpleAreaChart({ data }) {
  const allValues = data.flatMap((d) => [d.left, d.center, d.right])
  const maxValue = Math.max(...allValues)
  const width = 600
  const height = 200
  const padding = 40

  const getX = (i) => padding + (i / (data.length - 1)) * (width - padding * 2)
  const getY = (val) => height - padding - (val / maxValue) * (height - padding * 2)

  const createPath = (key) => {
    return data.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d[key])}`).join(" ")
  }

  const createAreaPath = (key) => {
    const linePath = createPath(key)
    return `${linePath} L ${getX(data.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64">
      <defs>
        <linearGradient id="centerGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="leftGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="rightGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={padding}
          y1={padding + (i * (height - padding * 2)) / 4}
          x2={width - padding}
          y2={padding + (i * (height - padding * 2)) / 4}
          stroke="#374151"
          strokeDasharray="4 4"
        />
      ))}

      {/* Areas */}
      <path d={createAreaPath("center")} fill="url(#centerGrad)" />
      <path d={createAreaPath("left")} fill="url(#leftGrad)" />
      <path d={createAreaPath("right")} fill="url(#rightGrad)" />

      {/* Lines */}
      <path d={createPath("center")} fill="none" stroke="#22c55e" strokeWidth="2" />
      <path d={createPath("left")} fill="none" stroke="#3b82f6" strokeWidth="2" />
      <path d={createPath("right")} fill="none" stroke="#f97316" strokeWidth="2" />

      {/* X-axis labels */}
      {data.map((d, i) => (
        <text
          key={i}
          x={getX(i)}
          y={height - 10}
          textAnchor="middle"
          fill="#9ca3af"
          fontSize="10"
        >
          {d.date}
        </text>
      ))}
    </svg>
  )
}

// ==================== SIMPLE PIE CHART ====================

function SimplePieChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  let currentAngle = -90

  const paths = []
  for (const item of data) {
    const angle = (item.value / total) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle = endAngle

    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180

    const x1 = 100 + 70 * Math.cos(startRad)
    const y1 = 100 + 70 * Math.sin(startRad)
    const x2 = 100 + 70 * Math.cos(endRad)
    const y2 = 100 + 70 * Math.sin(endRad)

    const largeArc = angle > 180 ? 1 : 0

    paths.push({
      path: `M 100 100 L ${x1} ${y1} A 70 70 0 ${largeArc} 1 ${x2} ${y2} Z`,
      color: item.color,
      name: item.name,
      value: item.value,
    })
  }

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 200 200" className="w-48 h-48">
        {paths.map((p, i) => (
          <path key={i} d={p.path} fill={p.color} className="hover:opacity-80 transition-opacity" />
        ))}
        <circle cx="100" cy="100" r="40" fill="#1f2937" />
        <text x="100" y="95" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">
          {total}%
        </text>
        <text x="100" y="112" textAnchor="middle" fill="#9ca3af" fontSize="10">
          Total
        </text>
      </svg>
      <div className="flex flex-col gap-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-gray-400">{item.name}</span>
            <span className="text-xs font-medium text-white ml-auto">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==================== SIMPLE WORLD MAP ====================

function SimpleWorldMap({ markers }) {
  // Simplified world map using basic shapes
  const mapWidth = 800
  const mapHeight = 400

  const toX = (lng) => ((lng + 180) / 360) * mapWidth
  const toY = (lat) => ((90 - lat) / 180) * mapHeight

  return (
    <svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="w-full h-64">
      {/* Background */}
      <rect width={mapWidth} height={mapHeight} fill="#111827" />

      {/* Simplified continent outlines */}
      <ellipse cx={150} cy={180} rx={100} ry={80} fill="#1f2937" /> {/* North America */}
      <ellipse cx={180} cy={300} rx={60} ry={70} fill="#1f2937" /> {/* South America */}
      <ellipse cx={420} cy={180} rx={80} ry={100} fill="#1f2937" /> {/* Europe/Africa */}
      <ellipse cx={600} cy={200} rx={120} ry={80} fill="#1f2937" /> {/* Asia */}
      <ellipse cx={680} cy={320} rx={50} ry={40} fill="#1f2937" /> {/* Australia */}

      {/* Markers */}
      {markers.map((marker, i) => {
        const x = toX(marker.coordinates[0])
        const y = toY(marker.coordinates[1])
        const size = Math.min(12, 4 + (marker.articles / 500))

        return (
          <g key={i}>
            <circle cx={x} cy={y} r={size + 4} fill="#3b82f6" opacity="0.2">
              <animate
                attributeName="r"
                from={size + 4}
                to={size + 10}
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                from="0.3"
                to="0"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx={x} cy={y} r={size} fill="#3b82f6" className="cursor-pointer hover:fill-blue-400" />
            <title>{`${marker.name}: ${marker.articles.toLocaleString()} articles`}</title>
          </g>
        )
      })}
    </svg>
  )
}

// ==================== MAIN DEMO COMPONENT ====================

function Demo() {

  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage] = useState(1)
  const [selectedBias] = useState("All")

  const pageSize = 6

  // FILTER ARTICLES
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {

      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.source.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesBias =
        selectedBias === "All" || article.bias === selectedBias

      return matchesSearch && matchesBias

    })
  }, [searchQuery, selectedBias])

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredArticles.slice(start, start + pageSize)
  }, [filteredArticles, currentPage])


  // SIMULATE NEW ANALYSIS
  function handleNewAnalysis() {

    const biases = ["Left","Center","Center-Left","Right"]

    const newArticle = {
      id: Date.now(),
      title: "AI Generated News Analysis",
      source: "AI Engine",
      sourceIcon: "AI",
      bias: biases[Math.floor(Math.random() * biases.length)],
      confidence: Math.floor(Math.random() * 20) + 75,
      date: new Date().toDateString(),
      status: "verified",
    }

    articles.unshift(newArticle)
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[#FDEBD0]">
      {/* Sidebar */}
      <Navigation />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-800 bg-[var(--bg-primary)] backdrop-blur px-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Dashboard</span>
              <span className="text-gray-600">/</span>
              <span className="font-medium text-white">Overview</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-md border border-gray-800 bg-[var(--bg-primary)] px-2.5 py-1.5 text-xs">
              <span className="text-gray-500">Last</span>
              <button className="flex items-center gap-1 font-medium text-white hover:text-blue-400 transition-colors">
                24 hours
                <ChevronDownIcon className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
              <input
                 type="search"
                 placeholder="Search articles, sources..."
                 value={searchQuery}
                 onChange={(e)=>setSearchQuery(e.target.value)}
                className="h-8 w-56 pl-8 pr-10 text-xs bg-[var(--bg-primary)] border border-gray-800 rounded-md text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-gray-700 bg-gray-800 px-1.5 font-mono text-[10px] font-medium text-gray-500">
                <span className="text-[10px]">&#8984;</span>K
              </kbd>
            </div>

            <button
  onClick={handleNewAnalysis}
  className="h-8 px-3 flex items-center gap-1.5 text-xs font-medium bg-[#A89A84] hover:bg-[#ddcbae] text-white rounded-md transition-colors">
              <PlusIcon className="h-3.5 w-3.5" />
              New Analysis
            </button>

            <button className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-800 transition-colors">
              <HelpCircleIcon className="h-4 w-4 text-gray-500" />
            </button>

            <button className="relative h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-800 transition-colors">
              <BellIcon className="h-4 w-4 text-gray-500" />
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
            </button>

            <div className="h-6 w-px bg-gray-800" />

            <button className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-800 transition-colors">
              <div className="h-7 w-7 rounded-full bg-blue-600/20 flex items-center justify-center">
                <span className="text-blue-400 text-xs font-medium">JD</span>
              </div>
              <div className="hidden lg:flex flex-col items-start">
                <span className="text-xs font-medium text-white">John Doe</span>
                <span className="text-[10px] text-gray-500">Pro Plan</span>
              </div>
              <ChevronDownIcon className="h-3 w-3 text-gray-500 hidden lg:block" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 space-y-6 overflow-auto">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const IconComponent = statIcons[index]
              return (
                <div
                  key={stat.label}
                  className="bg-[var(--bg-primary)] border-gray-800 rounded-lg overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 mb-1">{stat.label}</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-2xl font-semibold tracking-tight text-white">
                            {stat.value}
                          </p>
                          <span
                            className={cn(
                              "inline-flex items-center gap-0.5 text-xs font-medium",
                              stat.changeType === "positive" ? "text-emerald-400" : "text-red-400"
                            )}
                          >
                            {stat.changeType === "positive" ? (
                              <TrendingUpIcon className="h-3 w-3" />
                            ) : (
                              <TrendingDownIcon className="h-3 w-3" />
                            )}
                            {stat.change}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-0.5">{stat.description}</p>
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600/10">
                        <IconComponent className="h-4 w-4 text-blue-400" />
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-800">
                      <MiniSparkline
                        data={stat.sparkline}
                        positive={stat.changeType === "positive"}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Charts Row */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Area Chart */}
            <div className="lg:col-span-2 bg-[var(--bg-primary)] border border-gray-800 rounded-lg">
              <div className="flex items-center justify-between p-4 pb-2">
                <div>
                  <h3 className="text-sm font-medium text-white">Bias Detection Trends</h3>
                  <p className="text-xs text-gray-500">Article classification over time</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="h-7 w-7 flex items-center justify-center rounded hover:bg-gray-800">
                    <DownloadIcon className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                  <button className="h-7 w-7 flex items-center justify-center rounded hover:bg-gray-800">
                    <Maximize2Icon className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                  <button className="h-7 w-7 flex items-center justify-center rounded hover:bg-gray-800">
                    <MoreHorizontalIcon className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="p-4 pt-0">
                <SimpleAreaChart data={trendData} />
                <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-gray-800">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs text-gray-500">Center</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    <span className="text-xs text-gray-500">Left Bias</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                    <span className="text-xs text-gray-500">Right Bias</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-[var(--bg-primary)] border border-gray-800 rounded-lg">
              <div className="flex items-center justify-between p-4 pb-2">
                <div>
                  <h3 className="text-sm font-medium text-white">Source Credibility</h3>
                  <p className="text-xs text-gray-500">Distribution by reliability</p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="h-7 w-7 flex items-center justify-center rounded hover:bg-gray-800">
                    <MoreHorizontalIcon className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="p-4 pt-0">
                <SimplePieChart data={credibilityData} />
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-[var(--bg-primary)] border border-gray-800 rounded-lg">
            <div className="flex items-center justify-between p-4 pb-2">
              <div>
                <h3 className="text-sm font-medium text-white">Bias by Source Type</h3>
                <p className="text-xs text-gray-500">Distribution across media categories</p>
              </div>
              <div className="flex items-center gap-1">
                <button className="h-7 w-7 flex items-center justify-center rounded hover:bg-gray-800">
                  <DownloadIcon className="h-3.5 w-3.5 text-gray-500" />
                </button>
                <button className="h-7 w-7 flex items-center justify-center rounded hover:bg-gray-800">
                  <MoreHorizontalIcon className="h-3.5 w-3.5 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-4 pt-0">
              <SimpleBarChart data={distributionData} />
              <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-gray-800">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <span className="text-xs text-gray-500">Left</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-gray-500">Center</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                  <span className="text-xs text-gray-500">Right</span>
                </div>
              </div>
            </div>
          </div>

          {/* Articles Table */}
          <div className="bg-[var(--bg-primary)] border border-gray-800 rounded-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <div>
                <h3 className="text-sm font-medium text-white">Recent Articles</h3>
                <p className="text-xs text-gray-500">Latest analyzed news articles</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="h-8 px-3 flex items-center gap-1.5 text-xs font-medium border border-gray-700 hover:bg-gray-800 text-gray-300 rounded-md transition-colors">
                  <FilterIcon className="h-3.5 w-3.5" />
                  Filters
                </button>
                <button className="h-8 px-3 flex items-center gap-1.5 text-xs font-medium border border-gray-700 hover:bg-gray-800 text-gray-300 rounded-md transition-colors">
                  <DownloadIcon className="h-3.5 w-3.5" />
                  Export
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">
                      Article
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">
                      Source
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">
                      Bias
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">
                      Confidence
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Date</th>
                    <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
        {paginatedArticles.map((article) => {
  const biasColors = getBiasColor(article.bias)

  return (
    <tr
      key={article.id}
      className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-medium",
              article.status === "verified"
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-amber-500/10 text-amber-400"
            )}
          >
            {article.sourceIcon}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate max-w-[300px]">
              {article.title}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <span className="text-sm text-gray-400">{article.source}</span>
      </td>

      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
            biasColors.bg,
            biasColors.text,
            biasColors.border
          )}
        >
          {article.bias}
        </span>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-gray-800 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full",
                getConfidenceColor(article.confidence)
              )}
              style={{ width: `${article.confidence}%` }}
            />
          </div>

          <span className="text-xs font-mono text-gray-500 w-8">
            {article.confidence}%
          </span>
        </div>
      </td>

      <td className="px-4 py-3">
        <span className="text-sm text-gray-500">{article.date}</span>
      </td>

      <td className="px-4 py-3 text-right">
        <button className="h-7 w-7 inline-flex items-center justify-center rounded hover:bg-gray-700 transition-colors">
          <ExternalLinkIcon className="h-3.5 w-3.5 text-gray-500" />
        </button>
      </td>
    </tr>
  )
})}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
              <p className="text-xs text-gray-500">Showing 1-6 of 2,847 articles</p>
              <div className="flex items-center gap-1">
                <button className="h-7 w-7 flex items-center justify-center rounded border border-gray-700 hover:bg-gray-800 disabled:opacity-50 transition-colors">
                  <ChevronLeftIcon className="h-3.5 w-3.5 text-gray-500" />
                </button>
                <button className="h-7 px-2.5 flex items-center justify-center rounded bg-blue-600 text-xs font-medium text-white">
                  1
                </button>
                <button className="h-7 px-2.5 flex items-center justify-center rounded border border-gray-700 hover:bg-gray-800 text-xs text-gray-400 transition-colors">
                  2
                </button>
                <button className="h-7 px-2.5 flex items-center justify-center rounded border border-gray-700 hover:bg-gray-800 text-xs text-gray-400 transition-colors">
                  3
                </button>
                <button className="h-7 w-7 flex items-center justify-center rounded border border-gray-700 hover:bg-gray-800 transition-colors">
                  <ChevronRightIcon className="h-3.5 w-3.5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* World Map */}
          <div className="grid gap-4 lg:grid-cols-4">
            <div className="lg:col-span-3 bg-[var(--bg-primary)] border border-gray-800 rounded-lg">
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600/10">
                    <GlobeIcon className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">Global Coverage</h3>
                    <p className="text-xs text-gray-500">News sources by location</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="h-7 w-7 flex items-center justify-center rounded hover:bg-gray-800">
                    <Maximize2Icon className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                  <button className="h-7 w-7 flex items-center justify-center rounded hover:bg-gray-800">
                    <MoreHorizontalIcon className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <SimpleWorldMap markers={markers} />
              </div>
            </div>

            {/* Region Stats */}
            <div className="bg-[var(--bg-primary)] border border-gray-800 rounded-lg">
              <div className="p-4 border-b border-gray-800">
                <h3 className="text-sm font-medium text-white">Regional Breakdown</h3>
                <p className="text-xs text-gray-500 mt-0.5">Articles by region</p>
              </div>
              <div className="p-4 space-y-3">
                {regionStats.map((region) => (
                  <div
                    key={region.region}
                    className="flex items-center justify-between p-3 rounded-md bg-gray-800/50 hover:bg-gray-800 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{region.region}</p>
                      <p className="text-xs text-gray-500">
                        {region.articles.toLocaleString()} articles
                      </p>
                    </div>
                    <span className="text-xs font-medium text-emerald-400">{region.change}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Demo
