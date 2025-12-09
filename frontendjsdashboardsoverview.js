// js/dashboards/overview.js

class OverviewDashboard {
    constructor() {
        this.charts = {
            funnelSpend: null,
            funnelRoas: null
        };
    }

    async load(filters) {
        try {
            const data = await apiClient.fetchOverview(filters);
            
            // Update KPIs
            this._updateKPIs(data.kpis);
            
            // Update funnel summary
            this._updateFunnelSummary(data.funnelSummary);
            
            // Update country comparison (if applicable)
            if (filters.country === 'All' && data.countryComparison) {
                this._showCountryComparison(data.countryComparison);
            } else {
                this._hideCountryComparison();
            }
            
        } catch (error) {
            console.error('Error loading overview:', error);
            throw error;
        }
    }

    _updateKPIs(kpis) {
        // Update values
        document.getElementById('kpi-spend').textContent = `$${this._formatNumber(kpis.total_spend)}`;
        document.getElementById('kpi-revenue').textContent = `$${this._formatNumber(kpis.total_revenue)}`;
        document.getElementById('kpi-roas').textContent = `${kpis.roas.toFixed(2)}x`;
        document.getElementById('kpi-conversions').textContent = this._formatNumber(kpis.total_conversions);
        document.getElementById('kpi-cpa').textContent = `$${kpis.cpa.toFixed(2)}`;
        document.getElementById('kpi-ctr').textContent = `${kpis.ctr.toFixed(2)}%`;
        document.getElementById('kpi-impressions').textContent = this._formatNumber(kpis.total_impressions);
        document.getElementById('kpi-reach').textContent = this._formatNumber(kpis.total_reach);
        
        // Update deltas (if available)
        // For now, showing static deltas - can be enhanced with historical comparison
    }

    _updateFunnelSummary(funnelData) {
        if (!funnelData || funnelData.length === 0) {
            return;
        }

        // Prepare data for charts
        const stages = funnelData.map(f => f.funnel_stage);
        const spend = funnelData.map(f => parseFloat(f.spend) || 0);
        const revenue = funnelData.map(f => parseFloat(f.revenue) || 0);
        const roas = spend.map((s, i) => s > 0 ? revenue[i] / s : 0);

        // Update Funnel Spend Chart
        this._updateFunnelSpendChart(stages, spend);

        // Update Funnel ROAS Chart
        this._updateFunnelRoasChart(stages, roas);
    }

    _updateFunnelSpendChart(stages, spend) {
        const ctx = document.getElementById('funnelSpendChart').getContext('2d');

        if (this.charts.funnelSpend) {
            this.charts.funnelSpend.destroy();
        }

        this.charts.funnelSpend = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: stages,
                datasets: [{
                    label: 'Spend',
                    data: spend,
                    backgroundColor: ['#1f77b4', '#ff7f0e', '#2ca02c']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `$${this._formatNumber(context.parsed.y)}`
                        }
                    }
                },
                scales: {
                    x: { 
                        ticks: { color: '#999' },
                        grid: { display: false }
                    },
                    y: { 
                        ticks: { 
                            color: '#999',
                            callback: (value) => `$${this._formatNumber(value)}`
                        },
                        grid: { color: '#333' }
                    }
                }
            }
        });
    }

    _updateFunnelRoasChart(stages, roas) {
        const ctx = document.getElementById('funnelRoasChart').getContext('2d');

        if (this.charts.funnelRoas) {
            this.charts.funnelRoas.destroy();
        }

        this.charts.funnelRoas = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: stages,
                datasets: [{
                    label: 'ROAS',
                    data: roas,
                    backgroundColor: roas.map(r => r >= 2.5 ? '#2ca02c' : r >= 2.0 ? '#ff7f0e' : '#d62728')
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.parsed.y.toFixed(2)}x`
                        }
                    }
                },
                scales: {
                    x: { 
                        ticks: { color: '#999' },
                        grid: { display: false }
                    },
                    y: { 
                        ticks: { 
                            color: '#999',
                            callback: (value) => `${value.toFixed(1)}x`
                        },
                        grid: { color: '#333' }
                    }
                }
            }
        });
    }

    _showCountryComparison(data) {
        document.getElementById('countryComparisonSection').style.display = 'block';
        
        const tbody = document.getElementById('countryComparisonBody');
        tbody.innerHTML = '';

        data.forEach(row => {
            const tr = tbody.insertRow();
            tr.innerHTML = `
                <td>${row.country}</td>
                <td>$${this._formatNumber(row.spend)}</td>
                <td>$${this._formatNumber(row.revenue)}</td>
                <td style="color: ${row.roas >= 2.5 ? '#2ca02c' : '#d62728'}; font-weight: bold;">
                    ${parseFloat(row.roas).toFixed(2)}x
                </td>
                <td>$${parseFloat(row.cpa).toFixed(2)}</td>
                <td>${this._formatNumber(row.conversions)}</td>
            `;
        });
    }

    _hideCountryComparison() {
        document.getElementById('countryComparisonSection').style.display = 'none';
    }

    _formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(2) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toFixed(2);
    }
}

const overviewDashboard = new OverviewDashboard();