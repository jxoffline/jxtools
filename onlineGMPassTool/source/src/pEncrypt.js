
const PG_MAXBUFFER = 64;
const PG_MAXPASSWORDLEN = 20;
const PG_RESULTLENSTD = 32;

const PG_MINPKEYLEN = PG_RESULTLENSTD - PG_MAXPASSWORDLEN - 2;
const PG_MAXPKEYLEN = PG_RESULTLENSTD - 2;
const PG_PKEYMASK = 151;
const PG_PKEYOFF = 7;
const PG_ENOFF = 5;
const PG_MINCHAR = 0x20;
const PG_MAXCHAR = 0x7E;
const PG_CHARCOUNT = PG_MAXCHAR - PG_MINCHAR + 1;

function PG_VALIDCHAR(c) {
  return (
    (c >= 'a' && c <= 'z') ||
    (c >= 'A' && c <= 'Z') ||
    c === '_' ||
    (c >= '0' && c <= '9')
  );
}

function PG_INVALIDCHAR(c) {
  return !PG_VALIDCHAR(c);
}

function pgChar2Int(b) {
  let i = 0;
  let al = b.charCodeAt(0);
  al ^= PG_PKEYMASK;
  al = (al << PG_PKEYOFF) | (al >>> (8 - PG_PKEYOFF));
  i = al & 0x1f;
  return i;
}

function pgInt2Char(i, dwTickCount = 0) {
  let b;
  if (i < 0 || i > PG_RESULTLENSTD - 2) {
    throw new Error('Invalid input');
  }
  for (
    let index = dwTickCount % PG_CHARCOUNT, nSize = index + PG_CHARCOUNT;
    index < nSize;
    index++
  ) {
    b = String.fromCharCode((index % PG_CHARCOUNT) + PG_MINCHAR);
    if (pgChar2Int(b) === i && PG_VALIDCHAR(b)) {
      return b;
    }
  }
  for (
    let index = dwTickCount % PG_CHARCOUNT, nSize = index + PG_CHARCOUNT;
    index < nSize;
    index++
  ) {
    b = String.fromCharCode((index % PG_CHARCOUNT) + PG_MINCHAR);
    if (pgChar2Int(b) === i) {
      return b;
    }
  }
  throw new Error('Invalid input');
}
 
function pgSwapChars(sz) {
  let c;
  function PG_SWAP(n1, n2) {
    c = sz[n1];
    sz[n1] = sz[n2];
    sz[n2] = c;
  }
  PG_SWAP(0, 13);
  PG_SWAP(31, 25);
  PG_SWAP(12, 30);
  PG_SWAP(7, 19);
  PG_SWAP(3, 21);
  PG_SWAP(9, 20);
  PG_SWAP(15, 18);
}

function pgEncrypt(szKey, nKeyLen, szBuffer, szPass, nStrLen) {
  for (let i = 0; i < nStrLen; i++) {
    let cc = szKey[i % nKeyLen];
    let c = szPass[i];
    c = String.fromCharCode((((c.charCodeAt(0) - PG_MINCHAR) + (cc.charCodeAt(0) - PG_MINCHAR)) % PG_CHARCOUNT) + PG_MINCHAR);
    if (PG_INVALIDCHAR(c)) {
      let nDead = 0;
      do {
        c = c.charCodeAt(0)+1;
        if (c > PG_MAXCHAR) {
          c = PG_MINCHAR;
        }
        cc = cc.charCodeAt(0)+1;
        if (cc > PG_MAXCHAR) {
          cc = PG_MINCHAR;
        }
        
        c = String.fromCharCode(c);
        cc = String.fromCharCode(cc);

        szKey[i % nKeyLen] = cc;
        if (nDead++ > 255) {
          return 0;
        }
      } while (PG_INVALIDCHAR(cc) || PG_INVALIDCHAR(c));
    }
    szBuffer[i] = c;
  }
  return 1;
}

function pgDecrypt(szKey, nKeyLen, szBuffer, szEnc, nStrLen) {
  for (let i = 0; i < nStrLen; i++) {
    const cc = szKey[i % nKeyLen];
    const c = szEnc[i];
    szBuffer[i] = String.fromCharCode(((PG_CHARCOUNT + (c.charCodeAt(0) - PG_MINCHAR) - (cc.charCodeAt(0) - PG_MINCHAR)) % PG_CHARCOUNT) + PG_MINCHAR);
  }
  szBuffer[nStrLen] = '\0';
}

function pgSameString(s1, s2) {
  for (let i = 0; s1[i] && s2[i]; i++) {
    if (s1[i] !== s2[i]) {
      return 0;
    }
  }
  if (s1[i] || s2[i]) {
    return 0;
  }
  return 1;
}

function SimplyDecryptPassword(szPass, szEncrypted) {
  const nLen = szEncrypted.length;
  let nPKLen = 0;
  if (nLen !== PG_RESULTLENSTD) {
    return 0;
  }
  const szBuffer = new Array(PG_RESULTLENSTD + 1);
  for (let i = 0; i < PG_RESULTLENSTD; i++) {
    szBuffer[i] = szEncrypted[i];
  }
  szBuffer[PG_RESULTLENSTD] = '\0';
  pgSwapChars(szBuffer);
  nPKLen = pgChar2Int(szBuffer[0]);
  if (nPKLen < PG_MINPKEYLEN || nPKLen > PG_MAXPKEYLEN) {
    return 0;
  }
  const nLen2 = pgChar2Int(szBuffer[nPKLen + 1]);
  if (nLen2 < 0 || nLen2 > PG_MAXPASSWORDLEN) {
    return 0;
  }
  pgDecrypt(szBuffer.slice(1), nPKLen, szPass, szBuffer.slice(nPKLen + 2), nLen2);
  return 1;
}

function pgEncryptPassword(szResult, szPass, dwTickCount, nLevel) {
  nLevel++;
  if (nLevel > 32) {
    return 0;
  }
  const nPrimeNumberList = [
    1153, 1789, 2797, 3023, 3491, 3617, 4519, 4547,
    5261, 5939, 6449, 7307, 8053, 9221, 9719, 9851,
    313, 659, 1229, 1847, 2459, 3121, 3793, 4483,
    5179, 6121, 6833, 7333, 7829, 8353, 9323, 9829,
  ];
  const nLen = szPass.length;
  let nPKeyLen = 0;
  let nFlagEncryptOK = 0;
  if (nLen > PG_MAXPASSWORDLEN) {
    return 0;
  }
  for (let i = 0; i < nLen; i++) {
    if (szPass[i].charCodeAt(0) < PG_MINCHAR || szPass[i].charCodeAt(0) > PG_MAXCHAR) {
      return 0;
    }
  }
  nPKeyLen = PG_RESULTLENSTD - nLen - 2;
  if (nPKeyLen > PG_MINPKEYLEN) {
    nPKeyLen = (dwTickCount + 10237) % (nPKeyLen - PG_MINPKEYLEN) + PG_MINPKEYLEN;
  }
  szResult[0] = pgInt2Char(nPKeyLen, dwTickCount);

  let keyArr = [];

  for (let i = 0; i < nPKeyLen; i++) {
    const dwRandom = dwTickCount + nPrimeNumberList[i];
    let c = String.fromCharCode((dwRandom % PG_CHARCOUNT) + PG_MINCHAR);
    if (PG_INVALIDCHAR(c)) {
      c = String.fromCharCode((dwRandom & 1) ? 'a'.charCodeAt(0) + (dwRandom % 26) : 'A'.charCodeAt(0) + (dwRandom % 26));
    }
    keyArr.push(c);
  }
  
  
  let encrypedPassArr = new Array(nLen);
  nFlagEncryptOK = pgEncrypt(keyArr, nPKeyLen, encrypedPassArr, szPass, nLen);
  
  for(let j=0; j<keyArr.length;j++){
    szResult[j + 1] = keyArr[j];
  }

  szResult[nPKeyLen + 1] = pgInt2Char(nLen, dwTickCount);
  for(let j=0; j<encrypedPassArr.length;j++){
    szResult[nPKeyLen + 2 + j] = encrypedPassArr[j];
  }
  
  for (let i = 0; i < PG_RESULTLENSTD - 2 - nPKeyLen - nLen; i++) {
    const dwRandom = dwTickCount + nPrimeNumberList[PG_RESULTLENSTD - i - 1];
    let c = String.fromCharCode((dwRandom % PG_CHARCOUNT) + PG_MINCHAR);
    if (PG_INVALIDCHAR(c)) {
      c = String.fromCharCode((dwRandom & 1) ? 'a'.charCodeAt(0) + (dwRandom % 26) : 'A'.charCodeAt(0) + (dwRandom % 26));
    }
    szResult[PG_RESULTLENSTD - i - 1] = c;
  }
  pgSwapChars(szResult);

  let szPassCheck = new Array(PG_RESULTLENSTD);
  let output = szResult.slice();
  output.pop();
  let outputszPass = szPass.slice();
  outputszPass.pop();
  

  szResult[PG_RESULTLENSTD] = '\0';
  
  let nFlagDecryptOK = 0;
  let nDead = 0;

  if (nFlagEncryptOK) {
    nFlagDecryptOK = SimplyDecryptPassword(szPassCheck, output);
    szPassCheck = getStr(szPassCheck);
  }
  if (!nFlagEncryptOK || !nFlagDecryptOK || szPassCheck !== szPass.join("")) {
    return pgEncryptPassword(szResult, szPass, dwTickCount + 9929, nLevel);
  }
  
  return 1;
}

function SimplyEncryptPassword(szResult, szPass) {
  let dwTickCount = Date.now();
  let nLevel = 0;
  return pgEncryptPassword(szResult, szPass, dwTickCount, nLevel);
}

function getStr(inp){
  let all = "";
  let len = inp.length;
  if (len > 32) len = 32;
  for(i=0;i<len;i++){
    if (inp[i] === '\x00') break;
    all += (inp[i] || "");
  }
  return all;
}

module.exports = {
    encrypt: (pass) => {
        let d = new Array(32);
        SimplyEncryptPassword(d, pass.split(""));
        return getStr(d);
    },
    decrypt: (pass) =>{
        let c = new Array(20);
        SimplyDecryptPassword(c, pass.split(""));
        return getStr(c);
    }
};