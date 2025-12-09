// js/dashboards/mof.js

class MOFDashboard {
    constructor() {
        this.sortColumn = null;
        this.sortDirection = 'desc';
        this.data = [];
        this.charts = {
            funnel: null,
            leads: null
        };
    }

    async load(filters) {
        try {
            const response = await apiClient.fetchMOF(filters);
            this.data = response.campaigns || [];
            
            // Update KPIs
            this._updateKPIs();
            
            // Update table
            this._updateTable();
            
            // Update charts
            this._updateCharts();
            
        } catch (error) {
            console.error('Error loading MOF:', error);
            throw error;
        }
    }

    _updateKPIs() {
        const totals = this.data.reduce((acc, row) => {
            acc.landing_page_views += row.landing_page_views || 0;
            acc.add_to_cart += row.add_to_cart || 0;
            acc.leads += row.leads || 0;
            acc.spend += row.spend || 0;
            return acc;
        }, { landing_page_views: 0, add_to_cart: 0, leads: 0, spend: 0 });

        const avgCostLPV = this.data.reduce((sum, row) => sum + (row.cost_per_lpv || 0), 0) / (this.data.length || 1);
        const avgCostATC = this.data.reduce((sum, row) => sum + (row.cost_per_atc || 0), 0) / (this.data.length || 1);
        const avgCPL = this.data.reduce((sum, row) => sum + (row.cpl || 0), 0) / (this.data.length || 1);

        document.getElementById('mof-lpv').textContent = this._formatNumber(totals.landing_page_views);
        document.getElementById('mof-cost-lpv').textContent = `$${avgCostLPV.toFixed(2)}`;
        document.getElementById('mof-atc').textContent = this._formatNumber(totals.add_to_cart);
        document.getElementById('mof-cost-atc').textContent = `$${avgCostATC.toFixed(2)}`;
        document.getElementById('mof-leads').textContent = this._formatNumber(totals.leads);
        document.getElementById('mof-cpl').textContent = `$${avgCPL.toFixed(2)}`;
    }

    _updateTable() {
        const tbody = document.getElementById('mofCampaignsBody');
        tbody.innerHTML = '';

        const sortedData = this._getSortedData();

        sortedData.forEach(row => {
            const tr = tbody.insertRow();
            tr.innerHTML = `
                <td>${row.campaign_name}</td>
                <td>$${this._formatNumber(row.spend)}</td>
                <td>${this._formatNumber(row.landing_page_views)}</td>
                <td>$${row.cost_per_lpv.toFixed(2)}</td>
                <td>${this._formatNumber(row.add_to_cart)}</td>
                <td>$${row.cost_per_atc.toFixed(2)}</td>
                <td>${this._formatNumber(row.leads)}</td>
                <td>$${row.cpl.toFixed(2)}</td>
            `;
        });
    }

    _updateCharts() {
        // Funnel chart: ATC → Initiate Checkout → Purchases
        this._updateFunnelChart();
        
        // Leads over time (mock data for now - would need time series from API)
        this._updateLeadsChart();
    }

    _updateFunnelChart() {
        const totals = this.data.reduce((acc, row) => {
            acc.atc += row.add_to_cart || 0;
            acc.checkout += row.initiate_checkout || 0;
            return acc;
        }, { atc: 0, checkout: 0 });

        const ctx = document.getElementById('mofFunnelChart').getContext('2d');

        if (this.charts.funnel) {
            this.charts.funnel.destroy();
        }

        this.charts.funnel = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Add to Cart', 'Initiate Checkout'],
                datasets: [{
                    label: 'Count',
                    data: [totals.atc, totals.checkout],
                    backgroundColor: ['#1f77b4', '#2ca02c']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { 
                        ticks: { color: '#999' },
                        grid: { display: false }
                    },
                    y: { 
                        ticks: { color: '#999' },
                        grid: { color: '#333' }
                    }
                }
            }
        });
    }

    _updateLeadsChart() {
        // Mock time series data
        const dates = this._getLast7Days();
        const leadsData = dates.map(() => Math.floor(Math.random() * 100) + 50);

        const ctx = document.getElementById('mofLeadsChart').getContext('2d');

        if (this.charts.leads) {
            this.charts.leads.destroy();
        }

        this.charts.leads = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Leads',
                    data: leadsData,
                    borderColor: '#2ca02c',
                    backgroundColor: 'rgba(44, 160, 44, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { 
                        ticks: { color: '#999' },
                        grid: { color: '#333' }
                    },
                    y: { 
                        ticks: { color: '#999' },
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
        return num.toFixed(0);
    }
}

const mofDashboard = new MOFDashboard();