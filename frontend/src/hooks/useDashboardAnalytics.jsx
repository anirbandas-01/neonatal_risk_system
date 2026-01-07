// frontend/src/hooks/useDashboardAnalytics.jsx
import { useMemo } from 'react';

export const useDashboardAnalytics = (babies) => {
  return useMemo(() => {
    if (!babies || babies.length === 0) {
      return {
        urgentAttention: [],
        followUpToday: [],
        recentAssessments: [],
        deteriorating: [],
        stable: [],
        improving: [],
        stats: {
          todayCount: 0,
          thisWeekCount: 0,
          criticalCount: 0,
          highRiskCount: 0
        }
      };
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Calculate urgent attention patients
    const urgentAttention = babies.filter(baby => {
      const daysSinceLastVisit = Math.floor(
        (now - new Date(baby.lastVisitDate)) / (1000 * 60 * 60 * 24)
      );

      // High risk and not seen in 2+ days
      if (baby.currentRiskLevel === 'High Risk' && daysSinceLastVisit >= 2) {
        return true;
      }

      // Medium risk not seen in 5+ days
      if (baby.currentRiskLevel === 'Medium Risk' && daysSinceLastVisit >= 5) {
        return true;
      }

      // Check if last assessment had critical flags
      if (baby.assessments && baby.assessments.length > 0) {
        const lastAssessment = baby.assessments[baby.assessments.length - 1];
        const flags = lastAssessment.riskAssessment?.clinicalFlags || [];
        const hasCriticalFlag = flags.some(f => f.severity === 'high');
        
        if (hasCriticalFlag && daysSinceLastVisit >= 1) {
          return true;
        }
      }

      return false;
    });

    // Sort urgent by priority (High Risk first, then days since visit)
    urgentAttention.sort((a, b) => {
      const riskPriority = { 'High Risk': 3, 'Medium Risk': 2, 'Low Risk': 1 };
      const aPriority = riskPriority[a.currentRiskLevel] || 0;
      const bPriority = riskPriority[b.currentRiskLevel] || 0;
      
      if (aPriority !== bPriority) return bPriority - aPriority;
      
      // If same risk, sort by days since last visit
      const aDays = Math.floor((now - new Date(a.lastVisitDate)) / (1000 * 60 * 60 * 24));
      const bDays = Math.floor((now - new Date(b.lastVisitDate)) / (1000 * 60 * 60 * 24));
      return bDays - aDays;
    });

    // Calculate follow-ups needed today (based on last visit + recommended interval)
    const followUpToday = babies.filter(baby => {
      const daysSinceLastVisit = Math.floor(
        (now - new Date(baby.lastVisitDate)) / (1000 * 60 * 60 * 24)
      );

      // High risk: every 1-2 days
      if (baby.currentRiskLevel === 'High Risk' && daysSinceLastVisit >= 1) {
        return true;
      }

      // Medium risk: every 3-4 days
      if (baby.currentRiskLevel === 'Medium Risk' && daysSinceLastVisit >= 3) {
        return true;
      }

      // Low risk: weekly
      if (baby.currentRiskLevel === 'Low Risk' && daysSinceLastVisit >= 7) {
        return true;
      }

      return false;
    });

    // Recent assessments (last 24 hours)
    const recentAssessments = babies
      .filter(baby => {
        const hoursSinceLastVisit = (now - new Date(baby.lastVisitDate)) / (1000 * 60 * 60);
        return hoursSinceLastVisit <= 24;
      })
      .sort((a, b) => new Date(b.lastVisitDate) - new Date(a.lastVisitDate));

    // Detect deteriorating patients (risk increased in last visit)
    const deteriorating = babies.filter(baby => {
      if (!baby.assessments || baby.assessments.length < 2) return false;

      const assessments = [...baby.assessments].sort(
        (a, b) => new Date(a.assessmentDate) - new Date(b.assessmentDate)
      );

      const latest = assessments[assessments.length - 1];
      const previous = assessments[assessments.length - 2];

      const riskValues = { 'Low Risk': 1, 'Medium Risk': 2, 'High Risk': 3 };
      const latestRisk = riskValues[latest.riskAssessment?.finalRisk] || 0;
      const previousRisk = riskValues[previous.riskAssessment?.finalRisk] || 0;

      return latestRisk > previousRisk;
    });

    // Detect improving patients (risk decreased)
    const improving = babies.filter(baby => {
      if (!baby.assessments || baby.assessments.length < 2) return false;

      const assessments = [...baby.assessments].sort(
        (a, b) => new Date(a.assessmentDate) - new Date(b.assessmentDate)
      );

      const latest = assessments[assessments.length - 1];
      const previous = assessments[assessments.length - 2];

      const riskValues = { 'Low Risk': 1, 'Medium Risk': 2, 'High Risk': 3 };
      const latestRisk = riskValues[latest.riskAssessment?.finalRisk] || 0;
      const previousRisk = riskValues[previous.riskAssessment?.finalRisk] || 0;

      return latestRisk < previousRisk;
    });

    // Stable patients (no change in last 2 visits)
    const stable = babies.filter(baby => {
      if (!baby.assessments || baby.assessments.length < 2) return false;

      const assessments = [...baby.assessments].sort(
        (a, b) => new Date(a.assessmentDate) - new Date(b.assessmentDate)
      );

      const latest = assessments[assessments.length - 1];
      const previous = assessments[assessments.length - 2];

      return latest.riskAssessment?.finalRisk === previous.riskAssessment?.finalRisk;
    });

    // Calculate statistics
    const todayCount = babies.filter(baby => {
      const visitDate = new Date(baby.lastVisitDate);
      return visitDate >= today;
    }).length;

    const thisWeekCount = babies.filter(baby => {
      const visitDate = new Date(baby.lastVisitDate);
      return visitDate >= weekAgo;
    }).length;

    const criticalCount = urgentAttention.filter(
      baby => baby.currentRiskLevel === 'High Risk'
    ).length;

    const highRiskCount = babies.filter(
      baby => baby.currentRiskLevel === 'High Risk'
    ).length;

    return {
      urgentAttention,
      followUpToday,
      recentAssessments,
      deteriorating,
      stable,
      improving,
      stats: {
        todayCount,
        thisWeekCount,
        criticalCount,
        highRiskCount
      }
    };
  }, [babies]);
};