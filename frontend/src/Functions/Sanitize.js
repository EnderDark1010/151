//Note: MySQL library automatically prevents Injection
//https://github.com/mysqljs/mysql#escaping-query-values

export function sanitizeXSS(stringToSanitize) {
  const lt = /</g;
  const  gt = />/g;
  const  ap = /'/g;
  const ic = /"/g;

  return stringToSanitize
    .toString()
    .replace(lt, "&lt;")
    .replace(gt, "&gt;")
    .replace(ap, "&#39;")
    .replace(ic, "&#34;");
}
