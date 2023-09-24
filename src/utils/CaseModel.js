export async function createNewCase() {
  let newID = new Date().getTime();
  const data = {
    id: newID,
    createdTime: new Date(),
    licensePlate: '',
    progress: 0,
    source: '專員自行建立',
    name: '',
    contactName: '',
    contactPhone: '',
    specialCoating: {},
    paintFilm: {},
    toggleStatus: true,
    drivingLicense: {
      'photo1': [], // [{ path: 'base64data' }] passport image
      'photo2': [], // driving image
      'photo3': [], // 
      'photo4': [], // 
      'photo5': [], //
      'photo6': [], // 
      'photo7': [], // 
      'photo8': [], // 
      'photo9': [], //
      'photo10': [],
    },
    damagedPart: [],
    damagedAngle: [],
    assessment: {
      caseNumber: '',
      insuranceCompany: {},
      listData: [],
      insurance: false,
      self_pay: false,
      labour: 0,
      parts: 0,
      waste: 0,
    },
    componentsProcedure: [],
    listBase: [], // base data of componentsProcedure, use create SUB for api I01
    selectedBodyPaint: false,
    roofStatus: false,
    ups: false,
  };
  return data;
}

export function apiDataConfig() {
  return [
    [
      {
        COLOR: 'A',
        SPEC: '2',
        VDS: 'ZWE211',
        INSIDECD: '黑        ',
        OUTSIDECD: '040 ',
        SMEAR: 'C',
        PRODDT: '202204',
        CARMDL: 'ZWE211L-GEXVBR',
        WMI: '   ',
        PAINT: '',
        FRAN: 'T',
        SHAPE: '',
        CARSFX: 'REBV',
        VIN: '2ZRY848636',
        CARNM: 'ALTIS HV',
      },
    ],
    [
      {
        REGIONM: '引擎蓋',
        REGION: '01  ',
        PNC: '53301',
      },
      {
        REGIONM: '右前葉子板',
        REGION: '02  ',
        PNC: '53801',
      },
      {
        REGIONM: '左前葉子板',
        REGION: '03  ',
        PNC: '53802',
      },
      {
        REGIONM: '右前車門',
        REGION: '04  ',
        PNC: '67001',
      },
      {
        REGIONM: '左前車門',
        REGION: '05  ',
        PNC: '67002',
      },
      {
        REGIONM: '右後車門',
        REGION: '06  ',
        PNC: '67003',
      },
      {
        REGIONM: '左後車門',
        REGION: '07  ',
        PNC: '67004',
      },
      {
        REGIONM: '右後葉子板',
        REGION: '08  ',
        PNC: '61601B',
      },
      {
        REGIONM: '左後葉子板',
        REGION: '09  ',
        PNC: '61602C',
      },
      {
        REGIONM: '行李箱',
        REGION: '10  ',
        PNC: '64401',
      },
      {
        REGIONM: '車頂',
        REGION: '12  ',
        PNC: '63111',
      },
      {
        REGIONM: '後保險桿',
        REGION: '14  ',
        PNC: '52159',
      },
      {
        REGIONM: '前保險桿',
        REGION: '17  ',
        PNC: '52119A',
      },
    ],
    [
      {
        REFCD: '    ',
        REFCDNM: '',
      },
      {
        REFCD: '2   ',
        REFCDNM: '二層素色漆',
      },
      {
        REFCD: 'L   ',
        REFCDNM: '低遮蔽力',
      },
      {
        REFCD: 'N   ',
        REFCDNM: '耐擦傷',
      },
      {
        REFCD: 'T   ',
        REFCDNM: '二層素色漆+耐擦傷',
      },
      {
        REFCD: 'U   ',
        REFCDNM: '低遮蔽力+耐擦傷',
      },
    ],
    [
      {
        REFCD: 'C   ',
        REFCDNM: '素色漆',
      },
      {
        REFCD: 'S   ',
        REFCDNM: '銀粉漆',
      },
      {
        REFCD: 'U   ',
        REFCDNM: '二層珍珠',
      },
      {
        REFCD: 'V   ',
        REFCDNM: '三層珍珠',
      },
    ],
    [
      {
        REFCD: 'A   ',
        REFCDNM: '1',
      },
      {
        REFCD: 'AA  ',
        REFCDNM: '0',
      },
      {
        REFCD: 'B   ',
        REFCDNM: '2',
      },
      {
        REFCD: 'C   ',
        REFCDNM: '3',
      },
      {
        REFCD: 'D   ',
        REFCDNM: '4',
      },
      {
        REFCD: 'E   ',
        REFCDNM: '5~6',
      },
      {
        REFCD: 'F   ',
        REFCDNM: '7~8',
      },
      {
        REFCD: 'G   ',
        REFCDNM: '9~10',
      },
      {
        REFCD: 'H   ',
        REFCDNM: '11~14',
      },
      {
        REFCD: 'I   ',
        REFCDNM: '15~18',
      },
      {
        REFCD: 'J   ',
        REFCDNM: '19~22',
      },
      {
        REFCD: 'K   ',
        REFCDNM: '23~26',
      },
      {
        REFCD: 'L   ',
        REFCDNM: '27~30',
      },
      {
        REFCD: 'M   ',
        REFCDNM: '31~40',
      },
    ],
    [
      {
        REFCD: 'A   ',
        REFCDNM: 'A',
      },
      {
        REFCD: 'B   ',
        REFCDNM: 'B',
      },
      {
        REFCD: 'C   ',
        REFCDNM: 'C',
      },
    ],
    [
      {
        REFCD: 'X1  ',
        REFCDNM: '新鋼板單片',
      },
      {
        REFCD: 'X2  ',
        REFCDNM: '新鋼板多片',
      },
    ],
    [
      {
        REFCD: 'R2  ',
        REFCDNM: '補修1/1多片',
      },
      {
        REFCD: 'R4  ',
        REFCDNM: '補修1/2多片',
      },
    ],
    [
      {
        REFCD: '2   ',
        REFCDNM: '2K',
      },
    ],
    [
      {
        REFCD: 'A   ',
        REFCDNM: '一般外傷補修',
      },
      {
        REFCD: 'B   ',
        REFCDNM: '21公分以上外傷補修',
      },
      {
        REFCD: 'D   ',
        REFCDNM: '一般變形補修',
      },
      {
        REFCD: 'E   ',
        REFCDNM: '21公分以上變形補修',
      },
      {
        REFCD: 'X   ',
        REFCDNM: '新零件',
      },
    ],
    [
      {
        REFCD: 'A   ',
        REFCDNM: '單色',
      },
      {
        REFCD: 'B   ',
        REFCDNM: '黑色線條',
      },
      {
        REFCD: 'C   ',
        REFCDNM: '雙色',
      },
    ],
    [
      {
        WAGERT_C: 733,
        ATXWAGE_A: 690,
        ATXWAGE_C: 770,
        WAGERT_A: 657,
      },
    ],
    [
      {
        INSURNM: '航聯',
        INSURCD: 'CH00',
      },
      {
        INSURNM: '兆豐',
        INSURCD: 'CI00',
      },
      {
        INSURNM: '南山',
        INSURCD: 'CN00',
      },
      {
        INSURNM: '第一',
        INSURCD: 'DI00',
      },
      {
        INSURNM: '中信產',
        INSURCD: 'DR00',
      },
      {
        INSURNM: '國泰',
        INSURCD: 'DT00',
      },
      {
        INSURNM: '國華',
        INSURCD: 'GH00',
      },
      {
        INSURNM: '富邦',
        INSURCD: 'GT00',
      },
      {
        INSURNM: '和泰產險',
        INSURCD: 'HC00',
      },
      {
        INSURNM: '環球',
        INSURCD: 'HJ00',
      },
      {
        INSURNM: '宏泰',
        INSURCD: 'HU00',
      },
      {
        INSURNM: '聯邦',
        INSURCD: 'LB00',
      },
      {
        INSURNM: '明台',
        INSURCD: 'MT00',
      },
      {
        INSURNM: '新安東京',
        INSURCD: 'SA00',
      },
      {
        INSURNM: '新光',
        INSURCD: 'SK00',
      },
      {
        INSURNM: '商聯',
        INSURCD: 'SL00',
      },
      {
        INSURNM: '新安東京',
        INSURCD: 'TE00',
      },
      {
        INSURNM: '台灣',
        INSURCD: 'TI00',
      },
      {
        INSURNM: '泰安',
        INSURCD: 'TN00',
      },
      {
        INSURNM: '華山',
        INSURCD: 'TP00',
      },
      {
        INSURNM: '友聯',
        INSURCD: 'UL00',
      },
      {
        INSURNM: '華南',
        INSURCD: 'WN00',
      },
    ],
  ];
}
