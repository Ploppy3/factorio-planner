export function isString(obj: any) {
  if (typeof obj === 'string') { return true; }
  return false;
}
export function isNumber(obj: any) {
  if (typeof obj === 'number') { return true; }
  return false;
}
export function isBoolean(obj: any) {
  if (typeof obj === 'boolean') { return true; }
  return false;
}
export function isArray(obj: any) {
  if (Array.isArray(obj)) { return true; }
  return false;
}
export function isObject(obj: any) {
  if (typeof obj === 'object') { return true; }
  return false;
}
export function isNullOrUndefined(obj: any) {
  if (obj === undefined || obj === null) { return true; }
  return false;
}

export function downloadUrl(url: string, fileName: string) {
  // console.log('downloading', fileName);
  const a: any = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.style = 'display: none';
  a.click();
  a.remove();
}

export function openUrl(url: string, reuseTab: boolean) {
  const a: any = document.createElement('a');
  a.href = url;
  a.target = reuseTab ? 'blank' : '_blanc';
  document.body.appendChild(a);
  a.style = 'display: none';
  a.click();
  a.remove();
}
/** @deprecated
 * Use [cdkCopyToClipboard] instead
 */
export function copyToClipboard(value: string) {
  const ta = document.createElement('textarea');
  ta.value = value;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  // const clipboardKey = 'clipboard';
  // return navigator[clipboardKey].writeText(value);
}
