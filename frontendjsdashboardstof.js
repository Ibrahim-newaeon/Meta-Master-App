// js/dashboards/tof.js

class TOFDashboard {
    constructor() {
        this.sortColumn = null;
        this.sortDirection = 'desc';
        this.data = [];
    }

    async load(filters) {
        try {
            const response = await apiClient.fetchTOF(filters);
            this.data = response.campaigns || [];
            
            // Calculate and update KPIs
            this._updateKPIs();
            
            // Update campaigns table
            this._updateTable();
            
        } catch (error) {
            console.error('Error loading TOF:', error);
            throw error;
        }
    }

    _updateKPIs() {
        const totals = this.data.reduce((acc, row) => {
            acc.reach += row.reach || 0;
            acc.impressions += row.impressions || 0;
            acc.spend += row.spend || 0;
            acc.video_views += row.video_views || 0;
            acc.clicks += row.clicks || 0;
            return acc;
        }, { reach: 0, impressions: 0, spend: 0, video_views: 0, clicks: 0 });

        const avgFrequency = this.data.reduce((sum, row) => sum + (row.frequency || 0), 0) / (this.data.length || 1);
        const avgCPM = this.data.reduce((sum, row) => sum + (row.cpm || 0), 0) / (this.data.length || 1);
        const avgCTR = this.data.reduce((sum, row) => sum + (row.ctr || 0), 0) / (this.data.length || 1);

        document.getElementById('tof-reach').textContent = this._formatNumber(totals.reach);
        document.getElementById('tof-impressions').textContent = this._formatNumber(totals.impressions);
        document.getElementById('tof-frequency').textContent = avgFrequency.toFixed(2);
        document.getElementById('tof-cpm').textContent = `$${avgCPM.toFixed(2)}`;
        document.getElementById('tof-ctr').textContent = `${avgCTR.toFixed(2)}%`;
        document.getElementById('tof-video-views').textContent = this._formatNumber(totals.video_views);
    }

    _updateTable() {
        const tbody = document.getElementById('tofCampaignsBody');
        tbody.innerHTML = '';

        // Sort data if needed
        const sortedData = this._getSortedData();

        sortedData.forEach(row => {
            const tr = tbody.insertRow();
            tr.innerHTML = `
                <td>${row.campaign_name}</td>
                <td>$${this._formatNumber(row.spend)}</td>
                <td>${this._formatNumber(row.impressions)}</td>
                <td>${this._formatNumber(row.reach)}</td>
                <td>$${row.cpm.toFixed(2)}</td>
                <td>${row.ctr.toFixed(2)}%</td>
                <td>${this._formatNumber(row.landing_page_views)}</td>
                <td>${this._formatNumber(row.thruplays)}</td>
            `;
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

    _formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(2) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toFixed(0);
    }
}

const tofDashboard = new TOFDashboard();

// Sorting function
function sortTable(dashboard, column) {
    if (dashboard === 'tof') {
        tofDashboard.sort(column);
    }
}