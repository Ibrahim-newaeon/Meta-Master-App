// js/dashboards/audience.js

class AudienceDashboard {
    constructor() {
        this.charts = {
            ageRoas: null,
            genderRoas: null,
            locationSpend: null,
            deviceSpend: null,
            deviceRoas: null,
            platformPlacement: null
        };
    }

    async loadDemographics(filters) {
        try {
            const response = await apiClient.fetchAudienceDemographics(filters);
            const data = response.data || [];
            
            // Update charts
            this._updateAgeRoasChart(data);
            this._updateGenderRoasChart(data);
            
            // Update table
            this._updateDemographicsTable(data);
            
        } catch (error) {
            console.error('Error loading demographics:', error);
            throw error;
        }
    }

    async loadLocation(filters) {
        try {
            const response = await apiClient.fetchAudienceLocation(filters);
            const data = response.data || [];
            
            // Update chart
            this._updateLocationSpendChart(data);
            
            // Update table
            this._updateLocationTable(data);
            
        } catch (error) {
            console.error('Error loading location data:', error);
            throw error;
        }
    }

    async loadDevice(filters) {
        try {
            const response = await apiClient.fetchAudienceDevice(filters);
            const data = response.data || [];
            
            // Update charts
            this._updateDeviceSpendChart(data);
            this._updateDeviceRoasChart(data);
            
            // Update table
            this._updateDeviceTable(data);
            
        } catch (error) {
            console.error('Error loading device data:', error);
            throw error;
        }
    }

    async loadPlatform(filters) {
        try {
            const response = await apiClient.fetchAudiencePlatform(filters);
            const data = response.data || [];
            
            // Update chart
            this._updatePlatformPlacementChart(data);
            
            // Update table
            this._updatePlatformTable(data);
            
        } catch (error) {
            console.error('Error loading platform data:', error);
            throw error;
        }
    }

    // Demographics Methods
    _updateAgeRoasChart(data) {
        // Aggregate by age
        const ageGroups = {};
        data.forEach(row => {
            if (!ageGroups[row.age]) {
                ageGroups[row.age] = { spend: 0, revenue: 0 };
            }
            ageGroups[row.age].spend += row.spend;
            ageGroups[row.age].revenue += row.revenue;
        });

        const ages = Object.keys(ageGroups).sort();
        const roas = ages.map(age => {
            const group = ageGroups[age];
            return group.spend > 0 ? group.revenue / group.spend : 0;
        });

        const ctx = document.getElementById('ageRoasChart').getContext('2d');

        if (this.charts.ageRoas) {
            this.charts.ageRoas.destroy();
        }

        this.charts.ageRoas = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ages,
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

    _updateGenderRoasChart(data) {
        // Aggregate by gender
        const genderGroups = {};
        data.forEach(row => {
            if (!genderGroups[row.gender]) {
                genderGroups[row.gender] = { spend: 0, revenue: 0 };
            }
            genderGroups[row.gender].spend += row.spend;
            genderGroups[row.gender].revenue += row.revenue;
        });

        const genders = Object.keys(genderGroups);
        const roas = genders.map(gender => {
            const group = genderGroups[gender];
            return group.spend > 0 ? group.revenue / group.spend : 0;
        });

        const ctx = document.getElementById('genderRoasChart').getContext('2d');

        if (this.charts.genderRoas) {
            this.charts.genderRoas.destroy();
        }

        this.charts.genderRoas = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: genders,
                datasets: [{
                    label: 'ROAS',
                    data: roas,
                    backgroundColor: ['#1f77b4', '#ff7f0e', '#2ca02c']
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

    _updateDemographicsTable(data) {
        const tbody = document.getElementById('demographicsBody');
        tbody.innerHTML = '';

        // Sort by ROAS descending
        const sortedData = [...data].sort((a, b) => b.roas - a.roas);

        sortedData.forEach(row => {
            const tr = tbody.insertRow();
            const roasColor = row.roas >= 2.5 ? '#2ca02c' : row.roas >= 2.0 ? '#ff7f0e' : '#d62728';
            
            tr.innerHTML = `
                <td>${row.age}</td>
                <td>${row.gender}</td>
                <td>$${this._formatNumber(row.spend)}</td>
                <td>${this._formatNumber(row.impressions)}</td>
                <td>${row.ctr.toFixed(2)}%</td>
                <td>$${row.cpc.toFixed(2)}</td>
                <td>${this._formatNumber(row.conversions)}</td>
                <td>$${row.cpa.toFixed(2)}</td>
                <td>$${this._formatNumber(row.revenue)}</td>
                <td style="color: ${roasColor}; font-weight: bold;">
                    ${row.roas.toFixed(2)}x
                </td>
            `;
        });
    }

    // Location Methods
    _updateLocationSpendChart(data) {
        // Top 10 locations by spend
        const top10 = [...data]
            .sort((a, b) => b.spend - a.spend)
            .slice(0, 10);

        const ctx = document.getElementById('locationSpendChart').getContext('2d');

        if (this.charts.locationSpend) {
            this.charts.locationSpend.destroy();
        }

        this.charts.locationSpend = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: top10.map(l => l.city || l.location),
                datasets: [{
                    label: 'Spend',
                    data: top10.map(l => l.spend),
                    backgroundColor: '#1f77b4'
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { 
                        ticks: { 
                            color: '#999',
                            callback: (value) => `$${this._formatNumber(value)}`
                        },
                        grid: { color: '#333' }
                    },
                    y: { 
                        ticks: { color: '#999' },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    _updateLocationTable(data) {
        const tbody = document.getElementById('locationBody');
        tbody.innerHTML = '';

        const sortedData = [...data].sort((a, b) => b.spend - a.spend);

        sortedData.forEach(row => {
            const tr = tbody.insertRow();
            const roasColor = row.roas >= 2.5 ? '#2ca02c' : row.roas >= 2.0 ? '#ff7f0e' : '#d62728';
            
            tr.innerHTML = `
                <td>${row.location}</td>
                <td>${row.city || '-'}</td>
                <td>$${this._formatNumber(row.spend)}</td>
                <td>${this._formatNumber(row.impressions)}</td>
                <td>${row.ctr.toFixed(2)}%</td>
                <td>$${row.cpc.toFixed(2)}</td>
                <td>${this._formatNumber(row.conversions)}</td>
                <td>$${row.cpa.toFixed(2)}</td>
                <td>$${this._formatNumber(row.revenue)}</td>
                <td style="color: ${roasColor}; font-weight: bold;">
                    ${row.roas.toFixed(2)}x
                </td>
            `;
        });
    }

    // Device Methods
    _updateDeviceSpendChart(data) {
        // Aggregate by device platform
        const platforms = {};
        data.forEach(row => {
            if (!platforms[row.device_platform]) {
                platforms[row.device_platform] = 0;
            }
            platforms[row.device_platform] += row.spend;
        });

        const ctx = document.getElementById('deviceSpendChart').getContext('2d');

        if (this.charts.deviceSpend) {
            this.charts.deviceSpend.destroy();
        }

        this.charts.deviceSpend = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(platforms),
                datasets: [{
                    data: Object.values(platforms),
                    backgroundColor: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#fafafa' }
                    }
                }
            }
        });
    }

    _updateDeviceRoasChart(data) {
        // Aggregate by device platform
        const platforms = {};
        data.forEach(row => {
            if (!platforms[row.device_platform]) {
                platforms[row.device_platform] = { spend: 0, revenue: 0 };
            }
            platforms[row.device_platform].spend += row.spend;
            platforms[row.device_platform].revenue += row.revenue;
        });

        const labels = Object.keys(platforms);
        const roas = labels.map(platform => {
            const p = platforms[platform];
            return p.spend > 0 ? p.revenue / p.spend : 0;
        });

        const ctx = document.getElementById('deviceRoasChart').getContext('2d');

        if (this.charts.deviceRoas) {
            this.charts.deviceRoas.destroy();
        }

        this.charts.deviceRoas = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
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
                    legend: { display: false }
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

    _updateDeviceTable(data) {
        const tbody = document.getElementById('deviceBody');
        tbody.innerHTML = '';

        const sortedData = [...data].sort((a, b) => b.spend - a.spend);

        sortedData.forEach(row => {
            const tr = tbody.insertRow();
            const roasColor = row.roas >= 2.5 ? '#2ca02c' : row.roas >= 2.0 ? '#ff7f0e' : '#d62728';
            
            tr.innerHTML = `
                <td>${row.device_platform}</td>
                <td>${row.impression_device || '-'}</td>
                <td>$${this._formatNumber(row.spend)}</td>
                <td>${this._formatNumber(row.impressions)}</td>
                <td>${row.ctr.toFixed(2)}%</td>
                <td>$${row.cpc.toFixed(2)}</td>
                <td>${this._formatNumber(row.conversions)}</td>
                <td>$${row.cpa.toFixed(2)}</td>
                <td>$${this._formatNumber(row.revenue)}</td>
                <td style="color: ${roasColor}; font-weight: bold;">
                    ${row.roas.toFixed(2)}x
                </td>
            `;
        });
    }

    // Platform Methods
    _updatePlatformPlacementChart(data) {
        // Create labels like "Facebook - Feed", "Instagram - Stories"
        const labels = data.map(row => `${row.publisher_platform} - ${row.platform_position}`);
        const spend = data.map(row => row.spend);

        const ctx = document.getElementById('platformPlacementChart').getContext('2d');

        if (this.charts.platformPlacement) {
            this.charts.platformPlacement.destroy();
        }

        this.charts.platformPlacement = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Spend',
                    data: spend,
                    backgroundColor: '#1f77b4'
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { 
                        ticks: { 
                            color: '#999',
                            callback: (value) => `$${this._formatNumber(value)}`
                        },
                        grid: { color: '#333' }
                    },
                    y: { 
                        ticks: { color: '#999', font: { size: 10 } },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    _updatePlatformTable(data) {
        const tbody = document.getElementById('platformBody');
        tbody.innerHTML = '';

        const sortedData = [...data].sort((a, b) => b.spend - a.spend);

        sortedData.forEach(row => {
            const tr = tbody.insertRow();
            const roasColor = row.roas >= 2.5 ? '#2ca02c' : row.roas >= 2.0 ? '#ff7f0e' : '#d62728';
            
            tr.innerHTML = `
                <td>${row.publisher_platform}</td>
                <td>${row.platform_position}</td>
                <td>$${this._formatNumber(row.spend)}</td>
                <td>${this._formatNumber(row.impressions)}</td>
                <td>${row.ctr.toFixed(2)}%</td>
                <td>$${row.cpc.toFixed(2)}</td>
                <td>${this._formatNumber(row.conversions)}</td>
                <td>$${row.cpa.toFixed(2)}</td>
                <td>$${this._formatNumber(row.revenue)}</td>
                <td style="color: ${roasColor}; font-weight: bold;">
                    ${row.roas.toFixed(2)}x
                </td>
            `;
        });
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

const audienceDashboard = new AudienceDashboard();