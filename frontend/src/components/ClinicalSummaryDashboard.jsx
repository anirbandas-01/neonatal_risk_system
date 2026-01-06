// frontend/src/components/ClinicalSummaryDashboard.jsx
import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle,
  Calendar,
  Activity,
  Thermometer,
  Heart,
  Droplet,
  Baby
} from 'lucide-react';
import MobileChartWrapper from './MobileChartWrapper';

const ClinicalSummaryDashboard = ({ baby, assessments }) => {
  // Process assessments data for charts
  const chartData = useMemo(() => {
    if (!assessments || assessments.length === 0) return [];

    // Sort by date (oldest first for timeline)
    const sorted = [...assessments].sort(
      (a, b) => new Date(a.assessmentDate) - new Date(b.assessmentDate)
    );

    return sorted.map((assessment, index) => {
      const params = assessment.healthParameters;
      const date = new Date(assessment.assessmentDate);
      const dayLabel = `Day ${index + 1}`;
      const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      return {
        name: dayLabel,
        date: dateLabel,
        fullDate: assessment.assessmentDate,
        
        // Weight data
        weight: params.weightKg || params.weight || 0,
        
        // Length data
        length: params.lengthCm || params.length || 0,
        
        // Vital signs
        temperature: params.temperatureC || params.temperature || 0,
        heartRate: params.heartRateBpm || params.heartRate || 0,
        respiratoryRate: params.respiratoryRateBpm || params.respiratoryRate || 0,
        oxygenSaturation: params.oxygenSaturation || params.spO2 || 0,
        
        // Other parameters
        jaundice: params.jaundiceLevelMgDl || params.jaundiceLevel || 0,
        
        // Risk level
        riskLevel: assessment.riskAssessment?.finalRisk || 'Unknown'
      };
    });
  }, [assessments]);

  // Calculate trends
  const trends = useMemo(() => {
    if (chartData.length < 2) return null;

    const latest = chartData[chartData.length - 1];
    const previous = chartData[chartData.length - 2];

    const calculateTrend = (current, prev) => {
      if (!current || !prev) return { value: 0, direction: 'stable' };
      const diff = current - prev;
      const direction = diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable';
      return { value: diff, direction };
    };

    return {
      weight: calculateTrend(latest.weight, previous.weight),
      length: calculateTrend(latest.length, previous.length),
      temperature: calculateTrend(latest.temperature, previous.temperature),
      heartRate: calculateTrend(latest.heartRate, previous.heartRate),
      o2: calculateTrend(latest.oxygenSaturation, previous.oxygenSaturation)
    };
  }, [chartData]);

  // Find critical alerts across all assessments
  const criticalAlerts = useMemo(() => {
    const alerts = [];

    assessments.forEach((assessment, index) => {
      const params = assessment.healthParameters;
      const dayNum = index + 1;
      const date = new Date(assessment.assessmentDate).toLocaleDateString();

      // Check for critical values
      if (params.oxygenSaturation < 95) {
        alerts.push({
          day: dayNum,
          date,
          type: 'oxygen',
          message: `Low O₂ Saturation (${params.oxygenSaturation}%)`,
          severity: params.oxygenSaturation < 90 ? 'critical' : 'warning',
          resolved: false
        });
      }

      if (params.jaundiceLevelMgDl > 12) {
        alerts.push({
          day: dayNum,
          date,
          type: 'jaundice',
          message: `High Jaundice Level (${params.jaundiceLevelMgDl} mg/dL)`,
          severity: params.jaundiceLevelMgDl > 15 ? 'critical' : 'warning',
          resolved: false
        });
      }

      if (params.temperatureC > 37.5 || params.temperatureC < 36.5) {
        alerts.push({
          day: dayNum,
          date,
          type: 'temperature',
          message: params.temperatureC > 37.5 
            ? `Fever (${params.temperatureC}°C)` 
            : `Hypothermia (${params.temperatureC}°C)`,
          severity: 'warning',
          resolved: false
        });
      }

      if (params.heartRateBpm < 100 || params.heartRateBpm > 180) {
        alerts.push({
          day: dayNum,
          date,
          type: 'heart',
          message: params.heartRateBpm > 180
            ? `Tachycardia (${params.heartRateBpm} bpm)`
            : `Bradycardia (${params.heartRateBpm} bpm)`,
          severity: 'warning',
          resolved: false
        });
      }
    });

    // Check if alerts were resolved in subsequent visits
    alerts.forEach(alert => {
      const alertIndex = alert.day - 1;
      const laterAssessments = assessments.slice(alertIndex + 1);
      
      laterAssessments.some(laterAssessment => {
        const params = laterAssessment.healthParameters;
        let resolved = false;

        switch (alert.type) {
          case 'oxygen':
            resolved = params.oxygenSaturation >= 95;
            break;
          case 'jaundice':
            resolved = params.jaundiceLevelMgDl <= 12;
            break;
          case 'temperature':
            resolved = params.temperatureC >= 36.5 && params.temperatureC <= 37.5;
            break;
          case 'heart':
            resolved = params.heartRateBpm >= 100 && params.heartRateBpm <= 180;
            break;
        }

        if (resolved) {
          alert.resolved = true;
          alert.resolvedDay = assessments.indexOf(laterAssessment) + 1;
          return true;
        }
        return false;
      });
    });

    return alerts;
  }, [assessments]);

  // Risk progression
  const riskProgression = useMemo(() => {
    return chartData.map(d => d.riskLevel);
  }, [chartData]);

  // Get trend icon
  const getTrendIcon = (trend) => {
    if (!trend) return <Minus className="w-4 h-4" />;
    switch (trend.direction) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  // Get trend color
  const getTrendColor = (trend, isPositiveGood = true) => {
    if (!trend) return 'text-gray-600';
    const isPositive = trend.direction === 'up';
    if (isPositiveGood) {
      return isPositive ? 'text-green-600' : trend.direction === 'down' ? 'text-red-600' : 'text-gray-600';
    } else {
      return isPositive ? 'text-red-600' : trend.direction === 'down' ? 'text-green-600' : 'text-gray-600';
    }
  };

  if (!assessments || assessments.length === 0) {
    return (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 text-center">
        <Activity className="w-16 h-16 text-blue-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">No assessment data available yet</p>
      </div>
    );
  }

  const latestData = chartData[chartData.length - 1];

  return (
    <div className="space-y-6">
      
      {/* Header Stats */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Activity className="w-7 h-7 mr-3" />
          Clinical Summary Dashboard
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Total Assessments */}
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-blue-500 text-sm mb-1">Total Assessments</p>
            <p className="text-3xl text-blue-500 font-bold">{assessments.length}</p>
          </div>

          {/* Current Age */}
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-blue-500 text-sm mb-1">Current Age</p>
            <p className="text-3xl font-bold text-blue-500">
              {Math.floor((Date.now() - new Date(baby.babyInfo.dateOfBirth)) / (1000 * 60 * 60 * 24))}d
            </p>
          </div>

          {/* Current Risk */}
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-blue-500 text-sm mb-1">Current Status</p>
            <p className={`text-lg font-bold ${
              baby.currentRiskLevel === 'Low Risk' ? 'text-green-500' :
              baby.currentRiskLevel === 'Medium Risk' ? 'text-yellow-500' :
              'text-red-500'
            }`}>
              {baby.currentRiskLevel}
            </p>
          </div>

          {/* Active Alerts */}
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-blue-500 text-sm mb-1">Active Alerts</p>
            <p className="text-3xl text-green-500 font-bold">
              {criticalAlerts.filter(a => !a.resolved).length}
            </p>
          </div>

        </div>
      </div>

      {/* Growth Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Weight Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Baby className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Weight</h3>
            </div>
            {trends && getTrendIcon(trends.weight)}
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {latestData.weight} kg
          </p>
          {trends && (
            <p className={`text-sm font-semibold ${getTrendColor(trends.weight, true)}`}>
              {trends.weight.value > 0 ? '+' : ''}{trends.weight.value.toFixed(2)} kg from last visit
            </p>
          )}
        </div>

        {/* Length Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Length</h3>
            </div>
            {trends && getTrendIcon(trends.length)}
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {latestData.length} cm
          </p>
          {trends && (
            <p className={`text-sm font-semibold ${getTrendColor(trends.length, true)}`}>
              {trends.length.value > 0 ? '+' : ''}{trends.length.value.toFixed(1)} cm from last visit
            </p>
          )}
        </div>

        {/* Temperature Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <Thermometer className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Temperature</h3>
            </div>
            {trends && getTrendIcon(trends.temperature)}
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {latestData.temperature} °C
          </p>
          <p className={`text-sm font-semibold ${
            latestData.temperature >= 36.5 && latestData.temperature <= 37.5
              ? 'text-green-600'
              : 'text-red-600'
          }`}>
            {latestData.temperature >= 36.5 && latestData.temperature <= 37.5
              ? 'Normal range ✓'
              : 'Outside normal range ⚠'}
          </p>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weight Trend Chart */}
        <MobileChartWrapper 
          title="Weight Progression" 
          icon={<Baby className="w-5 h-5 text-green-600" />}
        >
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
                domain={['dataMin - 0.5', 'dataMax + 0.5']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '2px solid #10b981',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value} kg`, 'Weight']}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return `${label} (${payload[0].payload.date})`;
                  }
                  return label;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="weight" 
                stroke="#10b981" 
                strokeWidth={3}
                fill="url(#weightGradient)"
                dot={{ fill: '#10b981', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </MobileChartWrapper>

        {/* Vital Signs Chart */}
        <MobileChartWrapper 
          title="Vital Signs Trends" 
          icon={<Heart className="w-5 h-5 text-red-600" />}
        >
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '2px solid #3b82f6',
                  borderRadius: '8px'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="line"
              />
              <Line 
                type="monotone" 
                dataKey="heartRate" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Heart Rate (bpm)"
                dot={{ fill: '#ef4444', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="oxygenSaturation" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="O₂ Saturation (%)"
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </MobileChartWrapper>

      </div>

      {/* Additional Charts - You can add more if needed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Temperature Chart */}
        <MobileChartWrapper 
          title="Temperature Trend" 
          icon={<Thermometer className="w-5 h-5 text-orange-600" />}
        >
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '2px solid #f97316',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value} °C`, 'Temperature']}
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#f97316" 
                strokeWidth={3}
                dot={{ fill: '#f97316', r: 5 }}
                activeDot={{ r: 7 }}
              />
              {/* Reference lines for normal range */}
              <Line 
                type="monotone" 
                dataKey={() => 37.5} 
                stroke="#ef4444" 
                strokeWidth={1}
                strokeDasharray="5 5"
                name="Upper Limit"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey={() => 36.5} 
                stroke="#ef4444" 
                strokeWidth={1}
                strokeDasharray="5 5"
                name="Lower Limit"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </MobileChartWrapper>

        {/* Jaundice Level Chart */}
        <MobileChartWrapper 
          title="Jaundice Level" 
          icon={<Droplet className="w-5 h-5 text-yellow-600" />}
        >
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="jaundiceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="#6b7280"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '2px solid #eab308',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value} mg/dL`, 'Jaundice']}
              />
              <Area 
                type="monotone" 
                dataKey="jaundice" 
                stroke="#eab308" 
                strokeWidth={3}
                fill="url(#jaundiceGradient)"
                dot={{ fill: '#eab308', r: 5 }}
                activeDot={{ r: 7 }}
              />
              {/* Reference line for critical level */}
              <Line 
                type="monotone" 
                dataKey={() => 12} 
                stroke="#ef4444" 
                strokeWidth={1}
                strokeDasharray="5 5"
                name="Critical Level"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </MobileChartWrapper>

      </div>

      {/* Critical Alerts Section */}
      {criticalAlerts.length > 0 && (
        <MobileChartWrapper 
          title="Clinical Alerts Timeline" 
          icon={<AlertCircle className="w-5 h-5 text-orange-600" />}
        >
          <div className="space-y-3">
            {criticalAlerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  alert.resolved
                    ? 'bg-green-50 border-green-300'
                    : alert.severity === 'critical'
                    ? 'bg-red-50 border-red-300'
                    : 'bg-yellow-50 border-yellow-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {alert.resolved ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className={`w-5 h-5 ${
                          alert.severity === 'critical' ? 'text-red-600' : 'text-yellow-600'
                        }`} />
                      )}
                      <p className="font-semibold text-gray-900">
                        Day {alert.day} ({alert.date})
                      </p>
                    </div>
                    <p className="text-gray-700 ml-7">{alert.message}</p>
                    {alert.resolved && (
                      <p className="text-sm text-green-700 ml-7 mt-1 font-medium">
                        ✓ Resolved by Day {alert.resolvedDay}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    alert.resolved
                      ? 'bg-green-200 text-green-800'
                      : alert.severity === 'critical'
                      ? 'bg-red-200 text-red-800'
                      : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {alert.resolved ? 'Resolved' : alert.severity === 'critical' ? 'Critical' : 'Warning'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </MobileChartWrapper>
      )}

      {/* Risk Progression */}
      <MobileChartWrapper 
        title="Risk Level Progression" 
        icon={<TrendingUp className="w-5 h-5 text-purple-600" />}
      >
        <div className="flex items-center gap-2 flex-wrap">
          {riskProgression.map((risk, index) => (
            <React.Fragment key={index}>
              <div
                className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                  risk === 'Low Risk'
                    ? 'bg-green-100 text-green-800 border-2 border-green-300'
                    : risk === 'Medium Risk'
                    ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                    : 'bg-red-100 text-red-800 border-2 border-red-300'
                }`}
              >
                Day {index + 1}: {risk}
              </div>
              {index < riskProgression.length - 1 && (
                <span className="text-gray-400">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Overall trend message */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-gray-800">
            <strong>Overall Trend:</strong> {getRiskTrendMessage(riskProgression)}
          </p>
        </div>
      </MobileChartWrapper>

    </div>
  );
};

// Helper function to get risk trend message
const getRiskTrendMessage = (progression) => {
  if (progression.length < 2) return 'Insufficient data for trend analysis';

  const riskValues = {
    'Low Risk': 1,
    'Medium Risk': 2,
    'High Risk': 3
  };

  const first = riskValues[progression[0]] || 2;
  const last = riskValues[progression[progression.length - 1]] || 2;

  if (last < first) {
    return '📈 Improving - Risk level has decreased over time ✓';
  } else if (last > first) {
    return '📉 Deteriorating - Risk level has increased, requires attention ⚠';
  } else {
    return '➡️ Stable - Risk level has remained consistent';
  }
};

export default ClinicalSummaryDashboard;