function gerarData(data) {
    var dataSql = data.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    return dataSql;
  }
  exports.gerarData = gerarData;