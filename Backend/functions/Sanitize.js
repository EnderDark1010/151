//Note: MySQL library automatically prevents Injection
//https://github.com/mysqljs/mysql#escaping-query-values

function sanitizeXSS(stringToSanitize) {
  const lt = /</g;
  const gt = />/g;
  const ap = /'/g;
  const ic = /"/g;
  const st= /-/g;
  const eq= /=/g;

  if (
    typeof stringToSanitize === "string" ||
    stringToSanitize instanceof String
  ) {
    return stringToSanitize
      .toString()
      .replace(lt, "&lt;")
      .replace(gt, "&gt;")
      .replace(ap, "&#39;")
      .replace(ic, "&#34;")
      .replace(eq,"")
      .replace(st,"");
  } else {
    return stringToSanitize;
  }
}


module.exports={sanitizeXSS}