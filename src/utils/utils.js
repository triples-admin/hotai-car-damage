import {
  Appearance,
  Dimensions,
  PermissionsAndroid,
  Platform,
  StatusBar,
} from 'react-native';

import moment from 'moment';

export function getStatusBarHeight(skipAndroid = false) {
  if (Platform.OS === 'ios') {
    return isIphoneX() ? 44 : 24;
  }

  if (skipAndroid) {
    return 0;
  }

  return StatusBar.currentHeight;
}

export function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function formatCurrency(number) {
  if (!number) {
    return '$0';
  }
  number = number.toString().replace(',', ',');
  return (
    '$' + formatFloatWithDecimal(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  );
}

export function formatNumber(number) {
  if (!number) {
    return '0';
  }
  if (typeof number === 'string') {
    return number;
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function isEmptyValues(value) {
  return (
    value === undefined ||
    value === null ||
    value === NaN ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
}

export function formatFloatWithDecimal(number, decimal = 3, useComma = true) {
  if (number) {
    let result =
      Math.round(number * Math.pow(10, decimal)) / Math.pow(10, decimal);
    if (useComma) {
      result = result.toString().replace('.', ',');
    }
    return result;
  } else {
    return 0;
  }
}

export function isIphoneX() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 896 ||
      dimen.width === 896)
  );
}

// date input: "2022-11-18" 
// date output: "18/11/2022"
export const convertToNewString = (dateString: string, fromFormat: string, toFormat: string) => {
  if (!dateString || !fromFormat || !toFormat) {
    return '';
  }
  const momentDate = moment(dateString, fromFormat);
  const momentString = momentDate.format(toFormat);
  return momentString;
};

// date input: "2022-05-12T05:01:03.000000Z"
// date ouput: "12:01, 12/05/2022"
export const convertFromDateString = (dateString: string, toFormat: string) => {
  if (!dateString || !toFormat) {
    return '';
  }
  const sDate = new Date(dateString);
  const momentString = moment(sDate).format(toFormat);
  return momentString;
};

// date input: type DATE
// date ouput: "12:01, 12/05/2022"
export const convertFromDate = (date: Date, toFormat: string) => {
  if (!date || !toFormat) {
    return '';
  }
  const momentString = moment(date).format(toFormat);
  return momentString;
};

// date input: "2022-11-18"
// date output: type DATE
export const convertStringToDate = (dateString: string, fromFormat: string) => {
  if (!dateString || !fromFormat) {
    return '';
  }
  const newDate = moment(dateString, fromFormat).toDate();
  return newDate || '';
};
