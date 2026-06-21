this.zxcvbnts = this.zxcvbnts || {};
this.zxcvbnts["language-ar"] = (function (exports) {
  'use strict';

  function decompress(encodedString) {
    const decompressedArray = encodedString.split(/([A-Z])/g);
    const decompressedData = [];
    let last = "";
    let i;
    for (i = 1; i < decompressedArray.length; i += 2) {
      last = last.slice(0, decompressedArray[i].charCodeAt(0) - 65) + decompressedArray[i + 1];
      decompressedData.push(last);
    }
    return decompressedData;
  }

  var firstnames = decompress("AabanCbasDudCdul-alimJyyHzimJzGbariIsitGfattahGghaffarGhadiIfizIkamJimIlimImidIqqIsibGjabbarIlilGkarimHhaliqE'llahEl-latifGmajidIlikHu'izzIjibIta'alJtalibGnasirJserGqadirIhharHuddusGrafiIhimJmanIshidI'ufIzzaqGsaburIlamImadJiHhakurGtawwabGwadudIhhabJidCrahaBdelChamCnanBfifBhmadBkilCramBla'aDddinCiDmCtairBmeerCidDnCjadCmarCrBnbarCisCwarBrfanCifBsadEelChrafCimCwadBtaCifBwadBymanCyadDubBzaCeemCharCzamAbadrChaDirCrakahCshsharDilDsamBilalCshrBoulosBurhanDsuqCtrusAdabirC'udBharrCulBiyaBuqaqAemirBsamAfadiElChdCisalCkhirGiDihCridEqEsDrajDuqCthDinCwwazDziBerranBidaCrasBouadBudailAgamalBhalibDssanDziCiyathAhabibCdadDdadDiCjjajCkeemEmClimCmalDdanDidDzahCnaDbalDiEfCrithDounCsanDhimDsanCtimCythamBilalDelCshamBudDhayfahCmamCsainEmEynAibrahimBdrisBhsanBmadBsaDmChaqCma'ilCraBzzAjabbarDirCfarClalDilCmalDeelCwadDharBibrilChadBubairCmahAkadarDeenFrChilCliqCmalDeelCrdalDeefFmCseebFmCtebBhaldunEidFlDtibDyrFiCouryCuzaymahButaibaAlabibEdChabCtifBuqmanCtfiAmahdiDirDmudCimunCjidCkinClikC'munDnCnsurCridDzuqCsh'alDruqD'udCudadCzinBikaCsbahBohammedDsenBu'adhEwiyahEyyadCbarakCfidChammadDsinDtadiCjahidCkhtarCndhirDirDtasirCrtadiCsaD'adDlimDtafaCtaC'tasimFzzCtiCwaffaqAnabhanDilCdhirDimErC'ilCimCjiEbDjarDmCsihEmErDserCwafCzihEmBuhCmairC'manCrDiAomarBthmanAqadirCrajaCsimCysBudamahCtaibaDuzArabahDiCdiCfiEqCghibChmanC'idCisCkinCshadEidCtibCyhanBedaBidwanCyadAsabihErC'dCdaqatC'eedCfwanClahDehDimDmanCmehDiErDmanCqrCriyahCyyarEidBeifBhadiDfiqDkirDrifCihabBirajBofianBubhiChailEybClaimanC'udAtahirClalDibCmirDmamFnCrifEqCwfiqCymullahDsirDyibBhabitAubadahDidDyyBmarEahDyrBsamaBtbahChmanAwadiCfidEqChibEdC'ilCjihCkilCleedDliyullahCsimCzirAyahyahCmanC'qubCsarDinErCzidBunusCsefDhuaDufAzafarDirChidErCidDmCkiEyyBiyadBubairChair");

  var lastnames = decompress("AabadiCboudBlmasiBmariBntarDounBrianBsfourCgharCkerCwadBtiyehCtiaBwadAbabaCharCsaraCzBisharaCtarBotrosCulosDtrosAchamAdagherCherBeebAessaAfakhouryAganemDimBergesBhannamBuirguisAhadadDdadCikCjjarCkimiClabiCnaniaDdalCrbAisaCsaAkalbCnaanCssabEisCttanBhouriFyBouriEyAmaaloufCloofEufCrounCsihBifsudCkhailBoghadamCrcosAnaderChasCifehCjjarCserDsarCzariApaginationAquraishiDeshiArahalAsabbagGhCfarCidClibFaCmahaCrrafCyeghBeifBhadidDlhoubDmmasEonFonFunBleimanAtahanCnnousBomaCtahCumaBumaAwasemAzogby");

  var translations = {
    warnings: {
      straightRow: 'من السهل تخمين الصفوف المستقيمة من المفاتيح على لوحة المفاتيح.',
      keyPattern: 'من السهل تخمين أنماط لوحة المفاتيح القصيرة.',
      simpleRepeat: 'من السهل تخمين الأحرف المتكررة مثل "aaa".',
      extendedRepeat: 'من السهل تخمين أنماط الأحرف المتكررة مثل "abcabcabc".',
      sequences: 'من السهل تخمين تسلسلات الأحرف الشائعة مثل "abc".',
      recentYears: 'من السهل تخمين السنوات الأخيرة.',
      dates: 'من السهل تخمين التواريخ.',
      topTen: 'هذه كلمة مرور مستخدمة بكثرة.',
      topHundred: 'هذه كلمة مرور مستخدمة بشكل متكرر.',
      common: 'هذه كلمة مرور شائعة الاستخدام.',
      similarToCommon: 'هذه كلمة مرور مشابهة لكلمة مرور شائعة الاستخدام.',
      wordByItself: 'من السهل تخمين الكلمات المنفردة.',
      namesByThemselves: 'من السهل تخمين الأسماء المنفردة أو الألقاب.',
      commonNames: 'من السهل تخمين الأسماء والألقاب الشائعة.',
      userInputs: 'يجب ألا يكون هناك أي بيانات شخصية أو متعلقة بالصفحة.',
      pwned: 'تم الكشف عن كلمة المرور الخاصة بك عن طريق تسريب بيانات على الإنترنت.'
    },
    suggestions: {
      l33t: "تجنب الاستبدالات المتوقعة للأحرف مثل '@' بدل 'a'.",
      reverseWords: 'تجنب التهجئة المعكوسة للكلمات الشائعة.',
      allUppercase: 'قم بتكبير بعض الحروف ولكن ليس جميعها.',
      capitalization: 'قم بتكبير حروف أخرى وليس الحرف الأول فقط',
      dates: 'تجنب التواريخ والسنوات المرتبطة بك.',
      recentYears: 'تجنب السنوات الأخيرة.',
      associatedYears: 'تجنب السنوات المرتبطة بك.',
      sequences: 'تجنب تسلسل الأحرف الشائعة.',
      repeated: 'تجنب الكلمات والأحرف المتكررة.',
      longerKeyboardPattern: 'استخدم أنماط لوحة المفاتيح أطول وقم بتغيير اتجاه الكتابة عدة مرات.',
      anotherWord: 'أضف المزيد من الكلمات الأقل شيوعًا.',
      useWords: 'استخدم كلمات متعددة، ولكن تجنب العبارات الشائعة.',
      noNeed: 'يمكنك إنشاء كلمات مرور قوية دون استخدام الرموز أو الأرقام أو الأحرف الكبيرة.',
      pwned: 'إذا كنت تستخدم كلمة المرور هذه في مكان آخر، فيجب عليك تغييرها.'
    },
    timeEstimation: {
      ltSecond: 'أقل من ثانية',
      second: '{base} ثانية',
      seconds: '{base} ثوانٍ',
      minute: '{base} دقيقة',
      minutes: '{base} دقائق',
      hour: '{base} ساعة',
      hours: '{base} ساعات',
      day: '{base} يوم',
      days: '{base} أيام',
      month: '{base} شهر',
      months: '{base} شهور',
      year: '{base} سنة',
      years: '{base} سنين',
      centuries: 'قرون'
    }
  };

  // This file is auto generated by data-scripts/_helpers/runtime.ts
  const dictionary = {
    'firstnames-ar': firstnames,
    'lastnames-ar': lastnames
  };

  exports.dictionary = dictionary;
  exports.translations = translations;

  return exports;

})({});
//# sourceMappingURL=zxcvbn-ts.js.map
