// Created by Yanchao in 16/05/2018
/**
 * 2019-02-16
 * @author YanChao
 * 获取url地址信息
 */
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
/**
 * 2019-02-16
 * @author YanChao
 * 获取OpenId
 */
export let getOpenId = () => {
  const url = window.location.href.toString();
  const arrUrl = url.split('?');
  console.log(arrUrl)
  let openId: string;
  if (arrUrl[1] !== undefined) {
    const firstArr = arrUrl[1].split('&')[1];
    openId =  firstArr.substring(firstArr.indexOf('=') + 1, firstArr.length);
  } else {
    openId = '';
  }
  return openId;
};
/**
 * 2019-02-16
 * @author YanChao
 * 获取机器编码
 */
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
/**
 * 2019-02-16
 * @author YanChao
 * 检测手机号码
 */
export let checkPhone = (phone) => {
  return /^1[0123456789]\d{9}$/.test(phone);
};
/**
 * 2019-02-16
 * @author YanChao
 * 获取coupon值
 */
export let getCoupon = () => {
  let coupon;
  const strCookie = document.cookie;
  const arrCookie = strCookie.split(';');
  for (let i = 0; i < arrCookie.length; i++) {
    const arr = arrCookie[i].split('=');
    if (arr[0].trim() === 'coupon') {
      coupon = arr[1];
    }
  }
  return coupon;
};
/**
 * 2019-02-16
 * @author YanChao
 * 获取newUser值
 */
export let getNewUser = () => {
  let newUser;
  const strCookie = document.cookie;
  const arrCookie = strCookie.split(';');
  for (let i = 0; i < arrCookie.length; i++) {
    const arr = arrCookie[i].split('=');
    if (arr[0].trim() === 'newUser') {
      newUser = arr[1];
    }
  }
  return newUser;
};
/**
 * 2019-02-16
 * @author YanChao
 * 活动id
 */
export let getActiveItemId = () => {
  return ['2194', '2975'];
};
/**
 * 2019-02-16
 * @author YanChao
 * 活动公司id
 */
export let getActiveCompanyId = () => {
  return ['76', '113', '114', '115', '116', '117', '119', '130', '113', '141', '142', '143', '144', '147', '148', '123'];
};
export let getZhuHaiCompanyId = () => {
  return ['83', '84', '118', '131'];
};
export let getVmCodes = () => {
  return ['1996000101', '1996000003'];
};
