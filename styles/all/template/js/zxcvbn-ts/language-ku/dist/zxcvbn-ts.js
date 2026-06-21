this.zxcvbnts = this.zxcvbnts || {};
this.zxcvbnts["language-ku"] = (function (exports) {
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

  var commonWords = decompress("AEzATuAEwBmAHûnAMinATeAWîBêAMeAWanAKîAÇiAKengêBudaAÇimaBawaAEvBwBrêANaBeASpasABaşAXatirxwestinAJiABerêAÇûyîAAhaAWanêABûnAKesADemaABerALiANêzADuhAÎroASibêAXwendekarAMamosteAHevalAMalAXaneABajarAGundAÇiyaBemADeryaABazaarAÇarşîABazAXezalAKêfARojAŞevASibehAFiravînADîrokAHewlAGavaAJiyanAMirinAPêşîBaşîBêABêAZêdeAPîrACiwanAZarokAMêrAJinABiraAXwişkADayikABavALawAKeçAStranAHunermendAXizmetARêADerîAÇavADestAPêASerAJiALiABinANavAJorAXwarinAVejînAÇûnAHatînABûnAXebitînARamanAFikirAZanînAFêhmAXwestinAHildanAVekirinAGirtinAXwarinCendinAGotinDarAŞopandinABişkAPirAKêmADuyemASêyemAÇarAPêncAŞeşAHeftCştANehADehAZehAHînAJîARûADilAHesinBêvîAXweAKêrAMalbatAŞînABilaAQetAHemanCrçîAKêmATêAWêAPîrozABavêAXezebAGovATengAPaqijAZorATiştABikêrARengAKişARabeABêkesAGirtîAAzadAKarABazAŞîvAReşASipîATevANavînAKurdistanARojavaABaşûrCkurARojhilatASêvATirşînAHawînAPayizAZivistanAÇepARastABelavAŞermokAXebatAÇavkanîARojhilatîADesthilatAGerîlaADestpêkAFermandarANexşeAKurteADirêjAŞerAAştiADestANavARonîATengavARêvebirAXiyalAHemûAKêfaADilABavêAKêcaAXelil");

  var firstnames = decompress("AAliBzadABaranBerfinBêrîvanAÇiyaADilovanBîlanAEmirBvinAFerhatAGulistanAHêvîBozanAJiyanAKawaALavinBeylaAMahmudBedyaChmetBiranANarînCzdarBewrozARojanDdaDînASerhatDxwebûnBînemAŞahinBîlanCrînATahirAViyanAXezalAZanaCraBîlanAAdarBlanBramCîBvanCînBylanABahozCzCwerBerxwedanACîhanBiwanADiyarClsozDşadAEylemAFîrazAHêlînBelînaCvîdarAJîndaAKendalBoçerALeylanBoqmanAMazlumANazeninDêBûrîAPêşengAReberBêzanBojînaCnahîBûbarCkenCmetASedaCvdaAŞiyarBoreşATekoşînAVedatAYektaAZêdoBerînDyaCynep");

  var lastnames = decompress("AAhmedBliBrslanBvcıABaranBozanAÇelikADemirBilovanBoğanBurmuşAEkinciBrdoğanCenBvîndarAGençBülCneşAKarabulutEtaşCyaBılıçBoçBurtAMehmetBiranAÖztürkAPolatARojîEdarASarıAŞahinBimşekATaşBoprakCrîBunçAUçarAYıldızDmazBusufAZanaAAdarBkgülCyolBrîBydınABaşaranCyramCzBekirCrxwedanBozACengizBihanADikmenBurakAErtaşAGezerBirayBülbaharCzelAHamitAKadirCrakayaEmanCvakCzimBoçerCrayBurbanAMazlumButluANarinCzDımBurAÖzcanCerAPekerARêberAŞimşirASüleymanATahaBekinAUlaşAÜnalAVuralAYektaAZerîCydanBoro");

  var wikipedia = decompress("AkuAdocAliAyeAjiAdeAbiAdiAhttpsAorgAidAwikiEpediaAtitleAurlAcuridAyaAanAxweAherêmaAserAveAfransayêAkomunekeAsalaAdepartmenaAyekAreAewAboAyênAbakurêCAgundekîAevAnavçeyaApiAberAwanAhatiyeAnavêAwekîAparêzgehaAbajarêAûrêAkirinAneAdikeAîranêAkirAaliyêAnavAkurdistanêAaredariyekeAdibeAgelekAbeAherAnavendaArojavayêAsaintAkurdAmezinAdinAgorîAdaBemaAkurdîAinAwekAalmanyayêAgirêdayîBundAherîAdestAleApaAîtalyayêAlaAduAkomunAhateArojhilataAbûnAhatApêkArojhilatêAaredariyênAzimanêAlandkreisAheneCtaAnavendîAtênAnavberaAkesAbûyeAnifûsaAbinAdikinAmirovAazerbaycanaAhatineAkomunênAhinAvanAdewletaAweAkiriyeAetAsurAkurdanAyekemAdemêAgrandAdijîArojavaAheyeArojhilatApirAerêAhêlaAsalênAcihAkoAdideAbikeAçendAtenêAhemanAgundêAhevAberêAyanAtirkAsalanAdibinAhejmaraAgiAavaAmeAtirkîAzêdeAestêAjiyanaAnavaAfrancheAdigireAbourgogneAhatinAgotinAtiAcîhanêAhemûBauteAsedsalaAnihaAwekeAandinAnexweAbajarekîAyekêAkarAbikinAcomtéAnavçeAjdbAgelArewAhautsAenAbikaranînBakurAnavînBouvelleAheyaAxaneyênAbajêrAerAçêkirinAbilindAsiyasîAherêmêAdîtinAloireAzanîngehaAdaneyênAcaranAmalbatAemApartiyaAtirkiyeyêArhôneAbavêAkmAangoAtêneAwirAtaybetîAdikeveAêrîAhinekAauvergneAbajarênAgelheAniAwelatêAaquitaineAberîAjêrAserdemaAkesênAwihaAmirovanAdawîAîroAserjimêriyaAbibeAgirîngAzanînAminAamaraAgirtinAdirêjAzimanAdepartementaAbavyeraAgorAkurdênAtinAkêmAhêzênAdewletênAyekbûyîAbûneAdîsaCrokaAerebîAalpesêAnavdarAgelemperîAdikareAkirineAteAserêAfermîAserekeAtaAhiAqasîAcihêAserokêAtreAhemAkomaraAartêAwereAçarAsalApiraniyaAtheAvirAxwedîAamedêArojaAsedemaAçiyayêAewropayêAkomaAlesAînglîzîAkerîAmînaAdikirCjînArêjeyaAdivêBuyemAgundênAastaAgelheyaAderbasAkurêAneteweyîAdiyarAmalbataAherêmênAêdîAelAdestêAkeAdestpêkaAavêAgelêAaxaAnavneteweyîAcudaAbajarAekAseineAavakirinAlîsteyaAdiyarkirinCbêjinAvalAgtAkanûnaAosmanîAnêzîkîAzimanênAalpesAltAmarneAdidinAîmperatoriyaAmoselleAderCwletêAmînakAçemêAiyaAherwihaAdihatBeryayaAxelataAoreAcivakîApeydaAwateyaArûniAkarêAsanAcôteAtaybetAawayekîAdawiyaAhemîAbiçûkAsaôneAxwînêAhejmarAtevîBuAmaritimeAdibistanaArheinlandAlèsAzêdetirAîngilîzîAxaneyêAfranceyêAelîBzAdîrokîAlombardiyayêAhatibûAdabeApfalzAwelatFênAderveAheAerdêAçiriyaAxebatênAhewlêrêAnavçeyênAhikûmetaAkaAmafênAendamênAandAmaAsorAgavaAamerîkîAnavkirinAdiçeCkarinAbandoraBerdewamAdibêjeAtirkiyêAdûrBîrokAiraqêAbadenAîdarîApirtûkAkomunêAlatînîAhwdAoksîtanyayêAberhemênAholêAbelavAaborîAyekîtiyaAwanêAderketBayikApirtûkaAkevnAdestpêkêAnaskirinAgundîArêyaAbikarAkurdistanAwisaAmêrdînêAorAyewnanîAgiravaAeslêAdarîAwekêAjinAdoraAtevlîAcaraAdestnîAnivîsandinAofAherêmîAxaneyaAmalaAwürttembergAdinyayêAhilweAgeAdamezrandinAtinaArastîAçînêAkiAcharenteAjiyanAtecihênAmirinaAînaAbegAherduAdeverênBihokêCgirinAîslamîAhêzaArûyêAcureyênApiranîAendamêArûsyayêAmihemedAgirêdayêAhebûnAxwediyêAloireyêApaytextaBeyvaAhezarAvorpommernAîranArojAnavênDçeyêAkurmancîAiyêAmuzîkêAraAxwedêAsûriyêAfamîleyaAxwendinaAyekemînArojêAbibinCdeAketAfransîApasAanînAparastinaAfarisîAsalîAçiyayênAstembolêAîneAcalaisAîslamêAahAosmaniyanArhinAbajarîAjêrînAçandaAwarêAherwisaAnivîskarAdanAfranceAbingehînAanîAcentreAkevneAdayeAhilbijartinAkomênAçandîAtîneAmirovênAbinavkirinAnêzîAhebûAvalakirinAnûjenAserîApîrozAalîkariyaAsalêAkesanAbingehaAzarokênAdengAgoAlêbelêAkesîAalBnaAmuzîkaAtêkiliyênAamerîkayêAmilyonAdimîneBawiyêAspîAalmanyaAgirêAderdoraDbarêAgotAemînAtevgeraAcîhanîAçêkirinaAkovaraAberfirehBrîtanîArolaAbajarokekîAdikirinAsîstemaAnasînAîraAmalbatênAqadaAhemaApirrAkeyaniyaAaisneAnasAdinêAprovenceAserhildanaAawayêAlomaAgirtAxuyaAzanistîApiçûkAaristanAkurtAarAderveyîAmecklenburgAsaliyaApêncAriyaAbehsaAserbixweAdemênAbelêAdigelAawayîAderbasîAxwarinAtirkiyeApeymanaAjorînAwelêtAcarAsinorêAnewAmuhemmedAalîApiemontêAdengêAîraqêAavakirinaAberiyaAherêmekeAxelkêAbilîAmetropolîtenAgulanaAherêmAîrênAgolaAmîrAazadAbikaranînaAavBdaraAkirinaAehmedAserokatiyaAwehaAalmanAdilAhekeAtemenêAhesibandinArastAcemAaristanaAnordAerebAgundistanaAhatîAzayînêAparêzgehêAtuneAseranserêAloirAdayînAarmancaAsainteAzarokanAdesthilatdariyaArêveberiyaAewropîAhînAkurdistanaAnayêAjinanAbadAcherAkevnarAhebûnaAbijîAermenîAhêdîAxweserAciwanAalmanîAwergirtAerdnîgarîAkeçaAgaronneAkarênAgiranAmisilmanAkomAxwepêAanêAdihatinBuyemînAhezîranaAbandorArêxistinaAgihîAdarAtîrmehaAîranîAcivakaArengêAstranênAamAfranceêAoksîtanyayaAderyayêAgelênAîlonaAanênAmeleAnorwêcêAkiribûAheftAîleAxebataAjorAderdikeveAtevahîBirAqonaxaApadîAmartinAbirayêBasAdemAjinaAsommeyaAiiAmeurtheAçalakAgirtiyeAbidinAxistEinAcihênAgiranîAbûnaAtîninAkerênAnavxweyîAdîrokêAnavîAxanAdyaAtvAamadeArûsîAmiyaneAhimAdoubsAsivîlAhelbestênAarnAgelekîAtvanênArihayêAderxistinAtirkanAhewlAalfabeyaAdemokratîkByayêBiyaBerêAjiyanêApirtûkênAindreAbalaAlixweArojnameyaAgelhenasîAdibîneAmafêAûnaAqebûlApergalaAaxêAmalêAfransaAtevahiyaAnormandiyayêAeureAwindaApyrénéesAmiAzêdetirîAnaAmelaAçandApirranîAxwezayîAkevinAerzîromêApuyAxanedanaAisèreAdilêAçîrokaAewropaAmeuseAdemekêAsilêmaniyêAnîsanaAdêraAkontrolaAatlantiquesAyonneAdaneAjuraAolîAkariyeraAcalvadosAhilbijartinênAadnAgotinaAencamaAsousApejirandinAtêkoAberhemAtebaxaAagiriyêAdesAandinaAdemekAwêjeyaAhemberAfîlmAçînaAketinaAlewraAsovyetêAûkraynayêAserjimariyaAdordogneAçawaAbadînanAgersAjînenîgarîAdêrsimêAragihandinAswêdêAhatinaAmalanAbawerCjaraAcîhanaAegerAçavkaniyênBiqasAbiryarAzayendîAalbûmaAbakuraBrAhautAmêrAjiboAadarêAparêzgehAencamêAmehaAhindistanêAsarAxurtAneteweyênAmirAaneyaBrdennesAekeAnîvêAdihateAxwarinêAjinênAdehAandanAlêkolînênAtêkAhanAdômeAbedirxanBarzanîBoisAankoAriwekênApêjgehaAdewlemendAzarokAgolekeAîlonêAûrmiyeyêAdevAmayeAsibataAgirêdanAxelatênAopîApartiyêAimAfîlmaAçîrokênAkanadayêArêzaBojanAperwerdeyaAankuAnormandiyaAdemekeAkerkûkêBanîAwezîrêAxaneAhesenAkereAaudeAkesêAeureyêAdeveraAromayêAdepartemetaAmirovîAlêkolînArengîAbretanyayêApeyAdixeAxeynîAkovarAseretayîAenerjiyaAwerinDgirtiyeAebûAçîrokBalakiyênAhevalênAînternetêAdestpêkirinAserdeAgiravênAholendayêAçerxaAhêjmaraAderketiyeAgerAlîstAqanûnaAdînîAçavkanîAamtAhezaranAasayîAjeanAkomeleyaBemalAçêdibeAazadiyaAvekirinAoiseAsêrtêAdigehêjeAgolêAxebitîAenqereyêAmîrêAparîsêAhikûmetêAtiyêAdijwarAgotinênAbûyerênAmîlyonAhemberîAmanAjohnAbrandenburgBaweriyaAcogaBihêrengAainAkampaniyayêAwelatanAstranaAtêkiliyaAxoyAstranAorneAdestpêAtgirîAdagirAselahedînAnîqaAtgiriyaAguhertinAnivîskarêAdewletAnivîsênAgermAdixwazeAketiyeArasterastAperwerdehiyaAirnexêAzewicîBanîngehêAseîdBtenbolêAbaneAneçarAgeliyêAhéraultAdîtAnavbeynkariyaAsêyemAkomkujiyaAahêAikAcûdaAînêAgardAnivîskarênBormandîyêAmalbatêAhunerîAvedigereAberdanAketinAbinêAfederalAdixebiteAmûsilêBirinAriwekanAçalakiyaAcîhAbêtirArojavayîAlîstikvanAewitandinAiyênAhelbestAkomêAenstîtuyaAbigireAdoAsoranîAmisirêAzerdeAvaAsînorêAmirîAcivakêBezayêAdamezrandinaAfîlmênAberhemaAnêzîkAgolAqiAcorseAfutbolêApierreAîninAiyanAhewayêAkeyAvosgesaAfranceyaAsûrîAbavAmehmetAligelAhebeAmîtolojiyaAromêAaquitaineyêAloAmeclîsaAsiyasetaAwezaretaAatpAdayikaApêxemberAtevgerênAmistefaAragihand");

  var wordSequences = {"cardinalNumbers-ku":["yek","du","se","cihar","penc","ses","hevt","hest","ne","deh","yanzdeh","duvazdeh","sêzdeh","cihardeh","panzdeh","sanzdeh","hevdeh","hezhdeh","nozdeh","bîst"],"ordinalNumbers-ku":["yekem","duyem","sêyem","ciharem","pencem","sesem","hevtem","hestem","neyem","dehem"],"daysOfWeek-ku":["şemî","yekşem","duşem","sêşem","çarşem","pêncşem","în"],"months-ku":["rêbendan","reşemî","adar","avrêl","gulan","pûşper","tîrmeh","tebax","îlon","cotmeh","mijdar","kanûn"],"seasons-ku":["bihar","havîn","payîz","zivistan"],"timePeriods-ku":["beyanî","nîvro","êvar","şev","nîvşev"],"rainbowColors-ku":["sor","porteqalî","zer","kesk","şîn","çîvî","mor"],"directions-ku":["bakur","başûr","rojhilat","rojava"],"intermediateDirections-ku":["bakurê-rojhilat","bakurê-rojava","başûrê-rojhilat","başûrê-rojava"],"sizeProgression-ku":["biçûk","navîn","mezin"],"militaryAlphabet-ku":["alpha","bravo","charlie","delta","echo","foxtrot","golf","hotel","india","juliet","kilo","lima","mike","november","oscar","papa","quebec","romeo","sierra","tango","uniform","victor","whiskey","xray","yankee","zulu"],"planets-ku":["merkur","venus","erd","merîx","jupiter","saturn","uranus","neptun","pluto"],"zodiacSigns-ku":["beran","گا","ducan","kevjal","şêr","simbil","terazî","dupişk","kevan","karik","siddik","masî"],"chineseZodiac-ku":["mişk","ga","piling","keroshk","ejdeha","mar","hesp","bizn","meymûn","dîk","seg","beraz"]};

  var translations = {
    warnings: {
      straightRow: 'Rêzên rast ên bişkokên li ser klavyeya we bi hêsanî têne texmîn kirin.',
      keyPattern: 'Nimûneyên klavyeyê yên kurt têne texmîn kirin.',
      simpleRepeat: 'Karakterên dubarekirî yên mîna "aaa" bi hêsanî têne texmîn kirin.',
      extendedRepeat: 'Nimûneyên karakterê yên dubarekirî yên mîna "abcabcabc" hêsan têne texmîn kirin.',
      sequences: 'Rêzên karakterên hevpar ên mîna "abc" bi hêsanî têne texmîn kirin.',
      recentYears: 'Salên dawî texmînkirin hêsan e.',
      dates: 'Dîrok hêsan têne texmîn kirin.',
      topTen: 'Ev şîfreyek pir tê bikar anîn.',
      topHundred: 'Ev şîfreyek pir caran tê bikaranîn e.',
      common: 'Ev şîfreyek bi gelemperî tê bikar anîn.',
      similarToCommon: 'Ev dişibe şîfreyek ku bi gelemperî tê bikar anîn.',
      wordByItself: 'Gotinên yekane hêsan têne texmîn kirin.',
      namesByThemselves: 'Nav an paşnavên yekane têne texmîn kirin.',
      commonNames: 'Nav û paşnavên hevpar bi hêsanî têne texmîn kirin.',
      userInputs: 'Pêdivî ye ku daneyên kesane an rûpelê têkildar tune.',
      pwned: 'Şîfreya we ji ber binpêkirina daneyan li ser Înternetê hate eşkere kirin.'
    },
    suggestions: {
      l33t: "Ji şûna tîpên pêşbînîkirî yên wekî '@' ji bo 'a' dûr bixin.",
      reverseWords: 'Xwe ji rastnivîsîna berevajî ya peyvên hevpar dûr bixin.',
      allUppercase: 'Hinekan, lê ne hemî tîpan, bi mezin bikin.',
      capitalization: 'Ji tîpa yekem bêtir bi sermayê binivîsin.',
      dates: 'Ji tarîx û salên ku bi we re têkildar in dûr bisekinin.',
      recentYears: 'Ji salên dawî dûr bixin.',
      associatedYears: 'Ji salên ku bi we re têkildar in dûr bikin.',
      sequences: 'Ji rêzikên karakterên hevpar dûr bixin.',
      repeated: 'Ji peyv û karakterên dubare dûr bikevin.',
      longerKeyboardPattern: 'Nimûneyên klavyeyê yên dirêjtir bikar bînin û rêça nivîsandinê gelek caran biguhezînin.',
      anotherWord: 'Peyvên ku kêm hevpar in zêde bikin.',
      useWords: 'Gelek peyvan bikar bînin, lê ji hevokên hevpar dûr bixin.',
      noNeed: 'Hûn dikarin şîfreyên bihêz bêyî karanîna sembol, hejmar an tîpên mezin biafirînin.',
      pwned: 'Heke hûn vê şîfreyê li cîhek din bikar bînin, divê hûn wê biguherînin.'
    },
    timeEstimation: {
      ltSecond: 'ji saniyeyekê kêmtir',
      second: '{base} second',
      seconds: '{base} saniyeyan',
      minute: '{base} deqqe',
      minutes: '{base} deqiqeyan',
      hour: '{base} seet',
      hours: '{base} seetan',
      day: '{base} roj',
      days: '{base} rojan',
      month: '{base} meh',
      months: '{base} mehan',
      year: '{base} sal',
      years: '{base} salan',
      centuries: 'sedsalan'
    }
  };

  // This file is auto generated by data-scripts/_helpers/runtime.ts
  const dictionary = {
    'commonWords-ku': commonWords,
    'firstnames-ku': firstnames,
    'lastnames-ku': lastnames,
    'wikipedia-ku': wikipedia,
    ...wordSequences
  };

  exports.dictionary = dictionary;
  exports.translations = translations;

  return exports;

})({});
//# sourceMappingURL=zxcvbn-ts.js.map
