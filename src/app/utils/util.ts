// Created by Yanchao in 16/05/2018
export let urlParse = (url) => {
  const obj = {};
  const reg = /[?&][^?&]+=[^?&]+/g;
  const arr = url.match(reg);

  if (arr) {
    arr.forEach(function (item) {
      const tempArr = item.substring(1).split('=');
      const key = decodeURIComponent(tempArr[0]);
      const val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
  return obj;
};
export let getCookies = (token) => {
  if (token === null || token === undefined || token === 'undefined') {
    const strCookie = document.cookie;
    const arrCookie = strCookie.split(';');
    for (let i = 0; i < arrCookie.length; i++) {
      const arr = arrCookie[i].split('=');
      if (arr[0].trim() === 'token') {
        token = arr[1];
      }
    }
  }
};
export let getOpenId = () => {
  const url = window.location.href.toString();
  const arrUrl = url.split('?');
  let openId: string;
  if (arrUrl[1] !== undefined) {
    const firstArr = arrUrl[1].split('&')[1];
    openId =  firstArr.substring(firstArr.indexOf('=') + 1, firstArr.length);
  } else {
    openId = '';
  }
  return openId;
};
export let getVmCode = () => {
  const url = window.location.href.toString();
  const arrUrl = url.split('?');
  let vmCode: string;
  if (arrUrl[1] !== undefined) {
    const firstArr = arrUrl[1].split('&')[0];
    vmCode =  firstArr.substring(firstArr.indexOf('=') + 1, firstArr.length);
  } else {
    vmCode = '';
  }
  return vmCode;
};
export let checkPhone = (phone) => {
  return /^1[34578]\d{9}$/.test(phone);
};