function getMimeTypeFromDataURI(dataURI) {
  return dataURI.split(",")[0] + ",";
}

module.exports = { getMimeTypeFromDataURI };
