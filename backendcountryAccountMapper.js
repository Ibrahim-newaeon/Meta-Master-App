// countryAccountMapper.js

class CountryAccountMapper {
  constructor() {
    // Parse META_ACCOUNTS_CONFIG from .env
    this.accounts = JSON.parse(process.env.META_ACCOUNTS_CONFIG || '[]');
    this.countryMap = this._buildCountryMap();
  }

  _buildCountryMap() {
    const map = {};
    this.accounts.forEach(account => {
      if (!map[account.country]) {
        map[account.country] = [];
      }
      map[account.country].push(account);
    });
    return map;
  }

  getAccountsByCountry(country) {
    if (country === 'All') {
      return this.accounts;
    }
    return this.countryMap[country] || [];
  }

  getAccountById(accountId) {
    return this.accounts.find(acc => acc.account_id === accountId);
  }

  getCountryByAccountId(accountId) {
    const account = this.getAccountById(accountId);
    return account ? account.country : null;
  }

  getAllCountries() {
    return Object.keys(this.countryMap);
  }

  getConfigForFrontend() {
    const countries = this.getAllCountries();
    const groupedAccounts = {};
    
    countries.forEach(country => {
      groupedAccounts[country] = this.getAccountsByCountry(country);
    });

    return {
      countries: ['All', ...countries],
      accounts: groupedAccounts,
      allAccounts: this.accounts
    };
  }
}

module.exports = new CountryAccountMapper();