// js/dashboards/bof.js

class BOFDashboard {
    constructor() {
        this.sortColumn = null;
        this.sortDirection = 'desc';
        this.data = [];
        this.charts = {
            spendRevenue: null,
            roas: null
        };
    }

    async load(filters) {
        try {
            const response = await apiClient.fetchBOF(filters);
            this.data = response.campaigns || [];
            
            // Update KPIs
            this._updateKPIs();
            
            // Update table
            this._updateTable();
            
            // Update charts
            this._updateCharts();
            
        } catch (error) {
            console.error('Error loading BOF:', error);
            throw error;
        }
    }

    _updateKPIs() {
        const totals = this.data.reduce((acc, row) => {
            acc.purchases += row.purchases || 0;
            acc.revenue += row.revenue || 0;
            acc.spend += row.spend || 0;
            acc.conversions += row.conversions || 0;
            acc.initiate_checkout += row.initiate_checkout || 0;
            return acc;
        }, { purchases: 0, revenue: 0, spend: 0, conversions: 0, initiate_checkout: 0 });

        const roas = totals.spend > 0 ? totals.revenue / totals.spend : 0;
        const cpa = totals.conversions > 0 ? totals.spend / totals.conversions : 0;
        const aov = totals.purchases > 0 ? totals.revenue / totals.purchases : 0;

        document.getElementById('bof-purchases').textContent = this._formatNumber(totals.purchases);
        document.getElementById('bof-revenue').textContent = `$${this._formatNumber(totals.revenue)}`;
        document.getElementById('bof-roas').textContent = `${roas.toFixed(2)}x`;
        document.getElementById('bof-cpa').textContent = `$${cpa.toFixed(2)}`;
        document.getElementById('bof-aov').textContent = `$${aov.toFixed(2)}`;
        document.getElementById('bof-checkout').textContent = this._formatNumber(totals.initiate_checkout);
    }

    _updateTable() {
        const tbody = document.getElementById('bofCampaignsBody');
        tbody.innerHTML = '';

        const sortedData = this._getSortedData();

        sortedData.forEach(row => {
            const tr = tbody.insertRow();
            const roasColor = row.roas >= 2.5 ? '#2ca02c' : row.roas >= 2.0 ? '#ff7f0e' : '#d62728';
            
            tr.innerHTML = `
                <td>${row.campaign_name}</td>
                <td>$${this._formatNumber(row.spend)}</td>
                <td>$${this._formatNumber(row.revenue)}</td>
                <td style="color: ${roasColor}; font-weight: bold;">
                    ${row.roas.toFixed(2)}x
                </td>
                <td>${this._formatNumber(row.purchases)}</td>
                <td>$${row.cpa.toFixed(2)}</td>
                <td>$${row.aov.toFixed(2)}</td>
            `;
        });
    }

    _updateCharts() {
        this._updateSpendRevenueChart();
        this._updateRoasChart();
    }

    _updateSpendRevenueChart() {
        // Top 10 campaigns by spend
        const top10 = [...this.data]
            .sort((a, b) => b.spend - a.spend)
            .slice(0, 10);

        const ctx = document.getElementById('bofSpendRevenueChart').getContext('2d');

        if (this.charts.spendRevenue) {
            this.charts.spendRevenue.destroy();
        }

        this.charts.spendRevenue = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: top10.map(c => this._truncateName(c.campaign_name)),
                datasets: [
                    {
                        label: 'Spend',
                        data: top10.map(c => c.spend),
                        backgroundColor: '#1f77b4'
                    },
                    {
                        label: 'Revenue',
                        data: top10.map(c => c.revenue),
                        backgroundColor: '#2ca02c'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        display: true,
                        labels: { color: '#fafafa' }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.dataset.label}: $${this._formatNumber(context.parsed.y)}`
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

    _updateRoasChart() {
        // Mock time series - would come from API
        const dates = this._getLast7Days();
        const roasData = dates.map(() => (Math.random() * 2 + 1.5).toFixed(2));

        const ctx = document.getElementById('bofRoasChart').getContext('2d');

        if (this.charts.roas) {
            this.charts.roas.destroy();
        }

        this.charts.roas = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'ROAS',
                    data: roasData,
                    borderColor: '#2ca02c',
                    backgroundColor: 'rgba(44, 160, 44, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.parsed.y}x`
                        }
                    }
                },
                scales: {
                    x: { 
                        ticks: { color: '#999' },
                        grid: { color: '#333' }
                    },
                    y: { 
                        ticks: { 
                            color: '#999',
                            callback: (value) => `${value}x`
                        },
                        grid: { color: '#333' }
                    }
                }
            }
        });
    }

    _getSortedData() {
        if (!this.sortColumn) {
            return this.data;
        }

        return [...this.data].sort((a, b) => {
            let valA = a[this.sortColumn];
            let valB = b[this.sortColumn];

            if (typeof valA === 'string') {
                return this.sortDirection === 'asc' 
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            }

            return this.sortDirection === 'asc' 
                ? valA - valB
                : valB - valA;
        });
    }

    sort(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'desc';
        }
        this._updateTable();
    }

    _truncateName(name) {
        return name.length > 30 ? name.substring(0, 30) + '...' : name;
    }

    _getLast7Days() {
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
        return dates;
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

const bofDashboard = new BOFDashboard();