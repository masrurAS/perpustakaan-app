import moment, { Moment } from "moment";
import config from '@config/app'

export function serialize(data: Record<string, any>) {
  const exclude = ['validation_errors', 'validator'];
  const obj: {[key: string]: any} = data;
  let str = [];
  for (var p in obj)
    if (!exclude.includes(p) && obj.hasOwnProperty(p) && !['function', 'undefined'].includes(typeof obj[p])) {
      const value = obj[p];
      if (value instanceof Array) {
        for (const k in value) {
          str.push(`${p}[${k}]=${encodeURIComponent(value[k])}`);
        }
      } else if (typeof value == 'boolean') {
        str.push(encodeURIComponent(p) + "=" + (value ? 1 : 0));
      } else {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(value));
      }
    }
  return str.join("&");
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function ellipsis(text: string, max: number) {
  return (text.length > max) ? `${text.substring(0, max-3)}...` : text;
}

export function callname(fullname: string) {
  let ignores: string[] = [];
  let split = (fullname ?? '').split(' ');
  let callname = '';
  for (const call of split) {
    if (ignores.includes(call.toLowerCase())) {
      continue;
    }
    callname = call;
    break;
  }

  return callname;
}

export function formatWithNow(date: Moment) {
  const now = moment();
  if (now.isSame(date, 'day')) return date.format('HH:mm');
  else if (now.subtract(1, 'day').format('DD/MM/yyyy') == date.format('DD/MM/yyyy')) return `Yesterday - ${date.format('HH:mm')}`;
  else if (now.isSame(date, 'week')) return date.format('dddd - HH:mm');
  else if (now.isSame(date, 'year')) return date.format('dddd, DD MMMM - HH:mm');
  else return date.format('DD MMMM, yyyy - HH:mm');
}

export function formatWithNowLess(date: Moment) {
  const now = moment();
  if (now.isSame(date, 'hour')) return date.fromNow();
  else if (now.isSame(date, 'day')) return date.format('HH:mm');
  else if (now.subtract(1, 'day').format('DD/MM/yyyy') == date.format('DD/MM/yyyy')) return 'Yesterday';
  else if (now.isSame(date, 'week')) return date.fromNow();
  else return date.format('DD/MM/yyyy');
}

export function genUrlStorage(path: string, isprofile: boolean = false) {
  return `${config.server.base_url}${isprofile ? '/storage/images/' : ''}${path}`
}