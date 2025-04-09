import React, { useState, useEffect } from 'react';
import GenericIcon from '../assets/crypto-icons/generic.png';

const coreIcons = {
  BTC: require('../assets/crypto-icons/btc.png'),
  ETH: require('../assets/crypto-icons/eth.png'),
  DOGE: require('../assets/crypto-icons/doge.png'),
  SOL: require('../assets/crypto-icons/sol.png'),
  XRP: require('../assets/crypto-icons/xrp.png'),
  LTC: require('../assets/crypto-icons/ltc.png'),
  BCH: require('../assets/crypto-icons/bch.png'),
  ADA: require('../assets/crypto-icons/ada.png'),
  DOT: require('../assets/crypto-icons/dot.png'),
  TRX: require('../assets/crypto-icons/trx.png'),
  SHIB: require('../assets/crypto-icons/shib.png'),
  AVAX: require('../assets/crypto-icons/avax.png'),
  UNI: require('../assets/crypto-icons/uni.png'),
  LINK: require('../assets/crypto-icons/link.png'),
};

const dynamicIconImports = {
  FLOKI: () => import('../assets/crypto-icons/floki.png'),
  GRT: () => import('../assets/crypto-icons/grt.png'),
  IMX: () => import('../assets/crypto-icons/imx.png'),
  JUP: () => import('../assets/crypto-icons/jup.png'),
  ETC: () => import('../assets/crypto-icons/etc.svg'),
  ACH: () => import('../assets/crypto-icons/ach.png'),
  ANKR: () => import('../assets/crypto-icons/ankr.png'),
  APE: () => import('../assets/crypto-icons/ape.png'),
  APT: () => import('../assets/crypto-icons/apt.png'),
  AR: () => import('../assets/crypto-icons/ar.png'),
  ARB: () => import('../assets/crypto-icons/arb.png'),
  ATOM: () => import('../assets/crypto-icons/atom.png'),
  AXS: () => import('../assets/crypto-icons/axs.png'),
  BABYDOGE: () => import('../assets/crypto-icons/babydoge.png'),
  BICO: () => import('../assets/crypto-icons/bico.png'),
  BONK: () => import('../assets/crypto-icons/bonk.png'),
  EOS: () => import('../assets/crypto-icons/eos.png'),
  ONDO: () => import('../assets/crypto-icons/ondo.png'),
  STRK: () => import('../assets/crypto-icons/strk.png'),
  TIA: () => import('../assets/crypto-icons/tia.png'),
  WIF: () => import('../assets/crypto-icons/wif.png'),
  XLM: () => import('../assets/crypto-icons/xlm.svg'),
  COMP: () => import('../assets/crypto-icons/comp.svg'),
  AAVE: () => import('../assets/crypto-icons/aave.svg'),
  XTZ: () => import('../assets/crypto-icons/xtz.svg'),
  PEPE: () => import('../assets/crypto-icons/pepe.svg'),
  FIL: () => import('../assets/crypto-icons/fil.svg'),
  ZRX: () => import('../assets/crypto-icons/zrx.svg'),
  SAND: () => import('../assets/crypto-icons/sand.svg'),
  MANA: () => import('../assets/crypto-icons/mana.svg'),
  BAT: () => import('../assets/crypto-icons/bat.svg'),
  CHZ: () => import('../assets/crypto-icons/chz.svg'),
  LDO: () => import('../assets/crypto-icons/ldo.svg'),
  ALGO: () => import('../assets/crypto-icons/algo.svg'),
  HBAR: () => import('../assets/crypto-icons/hbar.svg'),
  NEAR: () => import('../assets/crypto-icons/near.svg'),
  ONE: () => import('../assets/crypto-icons/one.svg'),
  SUSHI: () => import('../assets/crypto-icons/sushi.svg'),
  CRV: () => import('../assets/crypto-icons/crv.svg'),
  YFI: () => import('../assets/crypto-icons/yfi.svg'),
};

export default React.memo(function CryptoIcon({ symbol, className, size = 24 }) {
  const [iconSrc, setIconSrc] = useState(GenericIcon);
  const baseSymbol = symbol.replace('USDT', '').split(/[\/-]/)[0];

  useEffect(() => {
    const loadIcon = async () => {
      try {
        if (coreIcons[baseSymbol]) {
          setIconSrc(coreIcons[baseSymbol]);
        } else if (dynamicIconImports[baseSymbol]) {
          const module = await dynamicIconImports[baseSymbol]();
          setIconSrc(module.default);
        } else {
          setIconSrc(GenericIcon);
        }
      } catch (error) {
        console.warn(`Icon load error for ${baseSymbol}:`, error);
        setIconSrc(GenericIcon);
      }
    };

    loadIcon();
  }, [baseSymbol]);

  return (
    <img
      src={iconSrc}
      alt={`${baseSymbol} icon`}
      className={`crypto-icon ${className || ''}`}
      style={{ 
        width: size, 
        height: size,
        minWidth: size,
        minHeight: size
      }}
      loading="lazy"
      decoding="async"
    />
  );
});