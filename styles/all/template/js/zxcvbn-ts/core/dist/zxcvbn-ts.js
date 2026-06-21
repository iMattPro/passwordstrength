this.zxcvbnts = this.zxcvbnts || {};
this.zxcvbnts.core = (function (exports) {
    'use strict';

    const extend = (listToExtend, list) =>
    // eslint-disable-next-line prefer-spread
    listToExtend.push.apply(listToExtend, list);
    // sort on i primary, j secondary
    const sorted = matches => matches.sort((m1, m2) => m1.i - m2.i || m1.j - m2.j);
    const buildRankedDictionary = orderedList => {
      const result = {};
      let counter = 1; // rank starts at 1, not 0
      orderedList.forEach(word => {
        result[word] = counter;
        counter += 1;
      });
      return result;
    };

    var dateSplits = {
      4: [
      // for length-4 strings, eg 1191 or 9111, two ways to split:
      [1, 2],
      // 1 1 91 (2nd split starts at index 1, 3rd at index 2)
      [2, 3] // 91 1 1
      ],
      5: [[1, 3],
      // 1 11 91
      [2, 3],
      // 11 1 91
      //  [2, 3], // 91 1 11    <- duplicate previous one
      [2, 4] // 91 11 1    <- New and must be added as bug fix
      ],
      6: [[1, 2],
      // 1 1 1991
      [2, 4],
      // 11 11 91
      [4, 5] // 1991 1 1
      ],
      //  1111991
      7: [[1, 3],
      // 1 11 1991
      [2, 3],
      // 11 1 1991
      [4, 5],
      // 1991 1 11
      [4, 6] // 1991 11 1
      ],
      8: [[2, 4],
      // 11 11 1991
      [4, 6] // 1991 11 11
      ]
    };

    const DATE_MAX_YEAR = 2050;
    const DATE_MIN_YEAR = 1000;
    const DATE_SPLITS = dateSplits;
    const BRUTEFORCE_CARDINALITY = 10;
    const MIN_GUESSES_BEFORE_GROWING_SEQUENCE = 10000;
    const MIN_SUBMATCH_GUESSES_SINGLE_CHAR = 10;
    const MIN_SUBMATCH_GUESSES_MULTI_CHAR = 50;
    const MIN_YEAR_SPACE = 21;
    // \xbf-\xdf is a range for almost all special uppercase letter like Ä and so on
    const START_UPPER = /^[A-Z\xbf-\xdf][^A-Z\xbf-\xdf]+$/;
    const END_UPPER = /^[^A-Z\xbf-\xdf]+[A-Z\xbf-\xdf]$/;
    // \xdf-\xff is a range for almost all special lowercase letter like ä and so on
    const ALL_UPPER = /^[A-Z\xbf-\xdf]+$/;
    const ALL_UPPER_INVERTED = /^[^a-z\xdf-\xff]+$/;
    const ALL_LOWER = /^[a-z\xdf-\xff]+$/;
    const ALL_LOWER_INVERTED = /^[^A-Z\xbf-\xdf]+$/;
    const ONE_LOWER = /[a-z\xdf-\xff]/;
    const ONE_UPPER = /[A-Z\xbf-\xdf]/;
    const ALPHA_INVERTED = /[^A-Za-z\xbf-\xdf]/gi;
    const ALL_DIGIT = /^\d+$/;
    const REFERENCE_YEAR = new Date().getFullYear();
    const REGEXEN = {
      recentYear: /19\d\d|200\d|201\d|202\d/g
    };
    /* Separators */
    const SEPERATOR_CHARS = [' ', ',', ';', ':', '|', '/', '\\', '_', '.', '-'];
    const SEPERATOR_CHAR_COUNT = SEPERATOR_CHARS.length;

    class MatcherBaseClass {
      constructor(options) {
        this.options = options;
      }
    }

    /*
     * -------------------------------------------------------------------------------
     *  date matching ----------------------------------------------------------------
     * -------------------------------------------------------------------------------
     */
    class MatchDate extends MatcherBaseClass {
      /*
       * a "date" is recognized as:
       *   any 3-tuple that starts or ends with a 2- or 4-digit year,
       *   with 2 or 0 separator chars (1.1.91 or 1191),
       *   maybe zero-padded (01-01-91 vs 1-1-91),
       *   a month between 1 and 12,
       *   a day between 1 and 31.
       *
       * note: this isn't true date parsing in that "feb 31st" is allowed,
       * this doesn't check for leap years, etc.
       *
       * recipe:
       * start with regex to find maybe-dates, then attempt to map the integers
       * onto month-day-year to filter the maybe-dates into dates.
       * finally, remove matches that are substrings of other matches to reduce noise.
       *
       * note: instead of using a lazy or greedy regex to find many dates over the full string,
       * this uses a ^...$ regex against every substring of the password -- less performant but leads
       * to every possible date match.
       */
      match({
        password
      }) {
        const matches = [...this.getMatchesWithoutSeparator(password), ...this.getMatchesWithSeparator(password)];
        const filteredMatches = this.filterNoise(matches);
        return sorted(filteredMatches);
      }
      getMatchesWithSeparator(password) {
        const matches = [];
        const maybeDateWithSeparator = /^(\d{1,4})([\s/\\_.-])(\d{1,2})\2(\d{1,4})$/;
        // # dates with separators are between length 6 '1/1/91' and 10 '11/11/1991'
        for (let i = 0; i <= Math.abs(password.length - 6); i += 1) {
          for (let j = i + 5; j <= i + 9; j += 1) {
            if (j >= password.length) {
              break;
            }
            const token = password.slice(i, j + 1 || 9e9);
            const regexMatch = maybeDateWithSeparator.exec(token);
            if (regexMatch != null) {
              const dmy = this.mapIntegersToDayMonthYear([parseInt(regexMatch[1], 10), parseInt(regexMatch[3], 10), parseInt(regexMatch[4], 10)]);
              if (dmy != null) {
                matches.push({
                  pattern: 'date',
                  token,
                  i,
                  j,
                  separator: regexMatch[2],
                  year: dmy.year,
                  month: dmy.month,
                  day: dmy.day
                });
              }
            }
          }
        }
        return matches;
      }
      // eslint-disable-next-line max-statements
      getMatchesWithoutSeparator(password) {
        const matches = [];
        const maybeDateNoSeparator = /^\d{4,8}$/;
        const metric = candidate => Math.abs(candidate.year - REFERENCE_YEAR);
        // # dates without separators are between length 4 '1191' and 8 '11111991'
        for (let i = 0; i <= Math.abs(password.length - 4); i += 1) {
          for (let j = i + 3; j <= i + 7; j += 1) {
            if (j >= password.length) {
              break;
            }
            const token = password.slice(i, j + 1 || 9e9);
            if (maybeDateNoSeparator.exec(token)) {
              const candidates = [];
              const index = token.length;
              const splittedDates = DATE_SPLITS[index];
              splittedDates.forEach(([k, l]) => {
                const dmy = this.mapIntegersToDayMonthYear([parseInt(token.slice(0, k), 10), parseInt(token.slice(k, l), 10), parseInt(token.slice(l), 10)]);
                if (dmy != null) {
                  candidates.push(dmy);
                }
              });
              if (candidates.length > 0) {
                /*
                 * at this point: different possible dmy mappings for the same i,j substring.
                 * match the candidate date that likely takes the fewest guesses: a year closest
                 * to 2000.
                 * (scoring.REFERENCE_YEAR).
                 *
                 * ie, considering '111504', prefer 11-15-04 to 1-1-1504
                 * (interpreting '04' as 2004)
                 */
                let bestCandidate = candidates[0];
                let minDistance = metric(candidates[0]);
                candidates.slice(1).forEach(candidate => {
                  const distance = metric(candidate);
                  if (distance < minDistance) {
                    bestCandidate = candidate;
                    minDistance = distance;
                  }
                });
                matches.push({
                  pattern: 'date',
                  token,
                  i,
                  j,
                  separator: '',
                  year: bestCandidate.year,
                  month: bestCandidate.month,
                  day: bestCandidate.day
                });
              }
            }
          }
        }
        return matches;
      }
      /*
       * matches now contains all valid date strings in a way that is tricky to capture
       * with regexes only. while thorough, it will contain some unintuitive noise:
       *
       * '2015_06_04', in addition to matching 2015_06_04, will also contain
       * 5(!) other date matches: 15_06_04, 5_06_04, ..., even 2015 (matched as 5/1/2020)
       *
       * to reduce noise, remove date matches that are strict substrings of others
       */
      filterNoise(matches) {
        return matches.filter(match => {
          let isSubmatch = false;
          const matchesLength = matches.length;
          for (let o = 0; o < matchesLength; o += 1) {
            const otherMatch = matches[o];
            if (match !== otherMatch) {
              if (otherMatch.i <= match.i && otherMatch.j >= match.j) {
                isSubmatch = true;
                break;
              }
            }
          }
          return !isSubmatch;
        });
      }
      /*
       * given a 3-tuple, discard if:
       *   middle int is over 31 (for all dmy formats, years are never allowed in the middle)
       *   middle int is zero
       *   any int is over the max allowable year
       *   any int is over two digits but under the min allowable year
       *   2 integers are over 31, the max allowable day
       *   2 integers are zero
       *   all integers are over 12, the max allowable month
       */
      // eslint-disable-next-line complexity, max-statements
      mapIntegersToDayMonthYear(integers) {
        if (integers[1] > 31 || integers[1] <= 0) {
          return null;
        }
        let over12 = 0;
        let over31 = 0;
        let under1 = 0;
        for (let o = 0, len1 = integers.length; o < len1; o += 1) {
          const int = integers[o];
          if (int > 99 && int < DATE_MIN_YEAR || int > DATE_MAX_YEAR) {
            return null;
          }
          if (int > 31) {
            over31 += 1;
          }
          if (int > 12) {
            over12 += 1;
          }
          if (int <= 0) {
            under1 += 1;
          }
        }
        if (over31 >= 2 || over12 === 3 || under1 >= 2) {
          return null;
        }
        return this.getDayMonth(integers);
      }
      // eslint-disable-next-line max-statements
      getDayMonth(integers) {
        // first look for a four digit year: yyyy + daymonth or daymonth + yyyy
        const possibleYearSplits = [[integers[2], integers.slice(0, 2)],
        // year last
        [integers[0], integers.slice(1, 3)] // year first
        ];
        const possibleYearSplitsLength = possibleYearSplits.length;
        for (let j = 0; j < possibleYearSplitsLength; j += 1) {
          const [y, rest] = possibleYearSplits[j];
          if (DATE_MIN_YEAR <= y && y <= DATE_MAX_YEAR) {
            const dm = this.mapIntegersToDayMonth(rest);
            if (dm != null) {
              return {
                year: y,
                month: dm.month,
                day: dm.day
              };
            }
            /*
             * for a candidate that includes a four-digit year,
             * when the remaining integers don't match to a day and month,
             * it is not a date.
             */
            return null;
          }
        }
        // given no four-digit year, two digit years are the most flexible int to match, so
        // try to parse a day-month out of integers[0..1] or integers[1..0]
        for (let k = 0; k < possibleYearSplitsLength; k += 1) {
          const [y, rest] = possibleYearSplits[k];
          const dm = this.mapIntegersToDayMonth(rest);
          if (dm != null) {
            return {
              year: this.twoToFourDigitYear(y),
              month: dm.month,
              day: dm.day
            };
          }
        }
        return null;
      }
      mapIntegersToDayMonth(integers) {
        const temp = [integers, integers.slice().reverse()];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < temp.length; i += 1) {
          const data = temp[i];
          const day = data[0];
          const month = data[1];
          if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
            return {
              day,
              month
            };
          }
        }
        return null;
      }
      twoToFourDigitYear(year) {
        if (year > 99) {
          return year;
        }
        if (year > 50) {
          // 87 -> 1987
          return year + 1900;
        }
        // 15 -> 2015
        return year + 2000;
      }
    }

    const peq = new Uint32Array(0x10000);
    const myers_32 = (a, b) => {
        const n = a.length;
        const m = b.length;
        const lst = 1 << (n - 1);
        let pv = -1;
        let mv = 0;
        let sc = n;
        let i = n;
        while (i--) {
            peq[a.charCodeAt(i)] |= 1 << i;
        }
        for (i = 0; i < m; i++) {
            let eq = peq[b.charCodeAt(i)];
            const xv = eq | mv;
            eq |= ((eq & pv) + pv) ^ pv;
            mv |= ~(eq | pv);
            pv &= eq;
            if (mv & lst) {
                sc++;
            }
            if (pv & lst) {
                sc--;
            }
            mv = (mv << 1) | 1;
            pv = (pv << 1) | ~(xv | mv);
            mv &= xv;
        }
        i = n;
        while (i--) {
            peq[a.charCodeAt(i)] = 0;
        }
        return sc;
    };
    const myers_x = (b, a) => {
        const n = a.length;
        const m = b.length;
        const mhc = [];
        const phc = [];
        const hsize = Math.ceil(n / 32);
        const vsize = Math.ceil(m / 32);
        for (let i = 0; i < hsize; i++) {
            phc[i] = -1;
            mhc[i] = 0;
        }
        let j = 0;
        for (; j < vsize - 1; j++) {
            let mv = 0;
            let pv = -1;
            const start = j * 32;
            const vlen = Math.min(32, m) + start;
            for (let k = start; k < vlen; k++) {
                peq[b.charCodeAt(k)] |= 1 << k;
            }
            for (let i = 0; i < n; i++) {
                const eq = peq[a.charCodeAt(i)];
                const pb = (phc[(i / 32) | 0] >>> i) & 1;
                const mb = (mhc[(i / 32) | 0] >>> i) & 1;
                const xv = eq | mv;
                const xh = ((((eq | mb) & pv) + pv) ^ pv) | eq | mb;
                let ph = mv | ~(xh | pv);
                let mh = pv & xh;
                if ((ph >>> 31) ^ pb) {
                    phc[(i / 32) | 0] ^= 1 << i;
                }
                if ((mh >>> 31) ^ mb) {
                    mhc[(i / 32) | 0] ^= 1 << i;
                }
                ph = (ph << 1) | pb;
                mh = (mh << 1) | mb;
                pv = mh | ~(xv | ph);
                mv = ph & xv;
            }
            for (let k = start; k < vlen; k++) {
                peq[b.charCodeAt(k)] = 0;
            }
        }
        let mv = 0;
        let pv = -1;
        const start = j * 32;
        const vlen = Math.min(32, m - start) + start;
        for (let k = start; k < vlen; k++) {
            peq[b.charCodeAt(k)] |= 1 << k;
        }
        let score = m;
        for (let i = 0; i < n; i++) {
            const eq = peq[a.charCodeAt(i)];
            const pb = (phc[(i / 32) | 0] >>> i) & 1;
            const mb = (mhc[(i / 32) | 0] >>> i) & 1;
            const xv = eq | mv;
            const xh = ((((eq | mb) & pv) + pv) ^ pv) | eq | mb;
            let ph = mv | ~(xh | pv);
            let mh = pv & xh;
            score += (ph >>> (m - 1)) & 1;
            score -= (mh >>> (m - 1)) & 1;
            if ((ph >>> 31) ^ pb) {
                phc[(i / 32) | 0] ^= 1 << i;
            }
            if ((mh >>> 31) ^ mb) {
                mhc[(i / 32) | 0] ^= 1 << i;
            }
            ph = (ph << 1) | pb;
            mh = (mh << 1) | mb;
            pv = mh | ~(xv | ph);
            mv = ph & xv;
        }
        for (let k = start; k < vlen; k++) {
            peq[b.charCodeAt(k)] = 0;
        }
        return score;
    };
    const distance = (a, b) => {
        if (a.length < b.length) {
            const tmp = b;
            b = a;
            a = tmp;
        }
        if (b.length === 0) {
            return a.length;
        }
        if (a.length <= 32) {
            return myers_32(a, b);
        }
        return myers_x(a, b);
    };

    const getUsedThreshold = (password, entry, threshold) => {
      const isPasswordToShort = password.length <= entry.length;
      const isThresholdLongerThanPassword = password.length <= threshold;
      const shouldUsePasswordLength = isPasswordToShort || isThresholdLongerThanPassword;
      // if password is too small use the password length divided by 4 while the threshold needs to be at least 1
      return shouldUsePasswordLength ? Math.ceil(password.length / 4) : threshold;
    };
    const findLevenshteinDistance = (password, rankedDictionary, threshold) => {
      let foundDistance = 0;
      const found = Object.keys(rankedDictionary).find(entry => {
        const usedThreshold = getUsedThreshold(password, entry, threshold);
        if (Math.abs(password.length - entry.length) > usedThreshold) {
          return false;
        }
        const foundEntryDistance = distance(password, entry);
        const isInThreshold = foundEntryDistance <= usedThreshold;
        if (isInThreshold) {
          foundDistance = foundEntryDistance;
        }
        return isInThreshold;
      });
      if (found) {
        return {
          levenshteinDistance: foundDistance,
          levenshteinDistanceEntry: found
        };
      }
      return {};
    };

    var mergeUserInputDictionary = (optionsRankedDictionaries, optionsRankedDictionariesMaxWordSize, userInputsOptions) => {
      if (!userInputsOptions) {
        return {
          rankedDictionaries: optionsRankedDictionaries,
          rankedDictionariesMaxWordSize: optionsRankedDictionariesMaxWordSize
        };
      }
      const rankedDictionaries = {
        ...optionsRankedDictionaries
      };
      const rankedDictionariesMaxWordSize = {
        ...optionsRankedDictionariesMaxWordSize
      };
      rankedDictionaries.userInputs = {
        ...(rankedDictionaries.userInputs || {}),
        ...userInputsOptions.rankedDictionary
      };
      rankedDictionariesMaxWordSize.userInputs = Math.max(userInputsOptions.rankedDictionaryMaxWordSize, rankedDictionariesMaxWordSize.userInputs || 0);
      return {
        rankedDictionaries,
        rankedDictionariesMaxWordSize
      };
    };

    class MatchDictionary extends MatcherBaseClass {
      constructor(options, wordSequenceCheck) {
        super(options);
        this.wordSequenceCheck = wordSequenceCheck;
      }
      getRangedDictionaries(userInputsOptions) {
        if (this.wordSequenceCheck) {
          const rankedDictionaries = {};
          const rankedDictionariesMaxWordSize = {};
          Object.keys(this.options.rankedDictionaries).forEach(key => {
            if (this.options.isWordSequence(key)) {
              rankedDictionaries[key] = this.options.rankedDictionaries[key];
              rankedDictionariesMaxWordSize[key] = this.options.rankedDictionariesMaxWordSize[key];
            }
          });
          return {
            rankedDictionaries,
            rankedDictionariesMaxWordSize
          };
        }
        return mergeUserInputDictionary(this.options.rankedDictionaries, this.options.rankedDictionariesMaxWordSize, userInputsOptions);
      }
      match({
        password,
        userInputsOptions,
        useLevenshtein = true
      }) {
        const matches = [];
        const passwordLength = password.length;
        const passwordLower = password.toLowerCase();
        const {
          rankedDictionaries,
          rankedDictionariesMaxWordSize
        } = this.getRangedDictionaries(userInputsOptions);
        // eslint-disable-next-line complexity,max-statements
        Object.keys(rankedDictionaries).forEach(dictionaryName => {
          const rankedDict = rankedDictionaries[dictionaryName];
          const longestDictionaryWordSize = rankedDictionariesMaxWordSize[dictionaryName];
          const searchWidth = Math.min(longestDictionaryWordSize, passwordLength);
          for (let i = 0; i < passwordLength; i += 1) {
            const searchEnd = Math.min(i + searchWidth, passwordLength);
            for (let j = i; j < searchEnd; j += 1) {
              const usedPassword = passwordLower.slice(i, j + 1 || 9e9);
              const isInDictionary = usedPassword in rankedDict;
              let foundLevenshteinDistance = {};
              // only use levenshtein distance on full password to minimize the performance drop
              // and because otherwise there would be to many false positives
              const isFullPassword = i === 0 && j === passwordLength - 1;
              if (this.options.useLevenshteinDistance && isFullPassword && !isInDictionary && useLevenshtein) {
                foundLevenshteinDistance = findLevenshteinDistance(usedPassword, rankedDict, this.options.levenshteinThreshold);
              }
              const isLevenshteinMatch = Object.keys(foundLevenshteinDistance).length !== 0;
              if (isInDictionary || isLevenshteinMatch) {
                const usedRankPassword = isLevenshteinMatch ? foundLevenshteinDistance.levenshteinDistanceEntry : usedPassword;
                const rank = rankedDict[usedRankPassword];
                matches.push({
                  pattern: 'dictionary',
                  i,
                  j,
                  token: password.slice(i, j + 1 || 9e9),
                  matchedWord: usedPassword,
                  rank,
                  dictionaryName: dictionaryName,
                  reversed: false,
                  l33t: false,
                  ...foundLevenshteinDistance
                });
              }
            }
          }
        });
        return matches;
      }
    }

    class CleanPasswords {
      constructor({
        substr,
        limit,
        trieRoot
      }) {
        this.buffer = [];
        this.finalPasswords = [];
        this.substr = substr;
        this.limit = limit;
        this.trieRoot = trieRoot;
      }
      getAllPossibleSubsAtIndex(index) {
        const nodes = [];
        let cur = this.trieRoot;
        for (let i = index; i < this.substr.length; i += 1) {
          const character = this.substr.charAt(i);
          cur = cur.getChild(character);
          if (!cur) {
            break;
          }
          nodes.push(cur);
        }
        return nodes;
      }
      // eslint-disable-next-line complexity,max-statements
      helper({
        onlyFullSub,
        isFullSub,
        index,
        subIndex,
        changes,
        lastSubLetter,
        consecutiveSubCount
      }) {
        if (this.finalPasswords.length >= this.limit) {
          return;
        }
        if (index === this.substr.length) {
          if (onlyFullSub === isFullSub) {
            this.finalPasswords.push({
              password: this.buffer.join(''),
              changes,
              isFullSubstitution: onlyFullSub
            });
          }
          return;
        }
        // first, exhaust all possible substitutions at this index
        const nodes = [...this.getAllPossibleSubsAtIndex(index)];
        let hasSubs = false;
        // iterate backward to get wider substitutions first
        for (let i = index + nodes.length - 1; i >= index; i -= 1) {
          const cur = nodes[i - index];
          const sub = cur.parents.join('');
          if (cur.isTerminal()) {
            // Skip if this would be a 4th or more consecutive substitution of the same letter
            // this should work in all language as there shouldn't be the same letter more than four times in a row
            // So we can ignore the rest to save calculation time
            if (lastSubLetter === sub && consecutiveSubCount >= 3) {
              continue;
            }
            hasSubs = true;
            const letters = cur.subs;
            for (const letter of letters) {
              this.buffer.push(letter);
              const newSubs = changes.concat({
                i: subIndex,
                letter,
                substitution: sub
              });
              // recursively build the rest of the string
              this.helper({
                onlyFullSub,
                isFullSub,
                index: index + sub.length,
                subIndex: subIndex + letter.length,
                changes: newSubs,
                lastSubLetter: sub,
                consecutiveSubCount: lastSubLetter === sub ? consecutiveSubCount + 1 : 1
              });
              // backtrack by ignoring the added postfix
              this.buffer.pop();
              if (this.finalPasswords.length >= this.limit) {
                return;
              }
            }
          }
        }
        // next, generate all combos without doing a substitution at this index
        // if a partial substitution is requested or there are no substitutions at this index
        if (!onlyFullSub || !hasSubs) {
          const firstChar = this.substr.charAt(index);
          this.buffer.push(firstChar);
          this.helper({
            onlyFullSub,
            isFullSub: isFullSub && !hasSubs,
            index: index + 1,
            subIndex: subIndex + 1,
            changes,
            lastSubLetter,
            consecutiveSubCount
          });
          this.buffer.pop();
        }
      }
      getAll() {
        // only full substitution
        this.helper({
          onlyFullSub: true,
          isFullSub: true,
          index: 0,
          subIndex: 0,
          changes: [],
          lastSubLetter: undefined,
          consecutiveSubCount: 0
        });
        // only partial substitution
        this.helper({
          onlyFullSub: false,
          isFullSub: true,
          index: 0,
          subIndex: 0,
          changes: [],
          lastSubLetter: undefined,
          consecutiveSubCount: 0
        });
        return this.finalPasswords;
      }
    }
    const getCleanPasswords = (password, limit, trieRoot) => {
      const helper = new CleanPasswords({
        substr: password,
        limit,
        trieRoot
      });
      return helper.getAll();
    };

    const getExtras = (passwordWithSubs, i, j) => {
      const previousChanges = passwordWithSubs.changes.filter(changes => {
        return changes.i < i;
      });
      const iUnsubbed = previousChanges.reduce((value, change) => {
        return value - change.letter.length + change.substitution.length;
      }, i);
      const usedChanges = passwordWithSubs.changes.filter(changes => {
        return changes.i >= i && changes.i <= j;
      });
      const jUnsubbed = usedChanges.reduce((value, change) => {
        return value - change.letter.length + change.substitution.length;
      }, j - i + iUnsubbed);
      const filtered = [];
      const subDisplay = [];
      usedChanges.forEach(value => {
        const existingIndex = filtered.findIndex(t => {
          return t.letter === value.letter && t.substitution === value.substitution;
        });
        if (existingIndex < 0) {
          filtered.push({
            letter: value.letter,
            substitution: value.substitution
          });
          subDisplay.push(`${value.substitution} -> ${value.letter}`);
        }
      });
      return {
        i: iUnsubbed,
        j: jUnsubbed,
        subs: filtered,
        subDisplay: subDisplay.join(', ')
      };
    };
    /*
     * -------------------------------------------------------------------------------
     *  Dictionary l33t matching -----------------------------------------------------
     * -------------------------------------------------------------------------------
     */
    class MatchL33t extends MatchDictionary {
      isAlreadyIncluded(matches, newMatch) {
        return matches.some(l33tMatch => {
          return Object.entries(l33tMatch).every(([key, value]) => {
            return key === 'subs' || value === newMatch[key];
          });
        });
      }
      match(matchOptions) {
        const matches = [];
        const subbedPasswords = getCleanPasswords(matchOptions.password, this.options.l33tMaxSubstitutions, this.options.trieNodeRoot);
        let hasFullMatch = false;
        subbedPasswords.forEach(subbedPassword => {
          if (hasFullMatch) {
            return;
          }
          const matchedDictionary = super.match({
            ...matchOptions,
            password: subbedPassword.password,
            useLevenshtein: subbedPassword.isFullSubstitution
          });
          matchedDictionary.forEach(match => {
            if (!hasFullMatch) {
              hasFullMatch = match.i === 0 && match.j === matchOptions.password.length - 1;
            }
            const extras = getExtras(subbedPassword, match.i, match.j);
            const token = matchOptions.password.slice(extras.i, extras.j + 1 || 9e9);
            const newMatch = {
              ...match,
              l33t: true,
              token,
              ...extras
            };
            const alreadyIncluded = this.isAlreadyIncluded(matches, newMatch);
            // only return the matches that contain an actual substitution
            if (token.toLowerCase() !== match.matchedWord && !alreadyIncluded) {
              matches.push(newMatch);
            }
          });
        });
        // filter single-character l33t matches to reduce noise.
        // otherwise '1' matches 'i', '4' matches 'a', both very common English words
        // with low dictionary rank.
        return matches.filter(match => match.token.length > 1);
      }
    }

    /*
     * -------------------------------------------------------------------------------
     *  Dictionary reverse matching --------------------------------------------------
     * -------------------------------------------------------------------------------
     */
    class MatchReverse extends MatchDictionary {
      match(matchOptions) {
        const passwordReversed = matchOptions.password.split('').reverse().join('');
        return super.match({
          ...matchOptions,
          password: passwordReversed
        }).map(match => ({
          ...match,
          token: match.token.split('').reverse().join(''),
          // reverse back
          reversed: true,
          // map coordinates back to original string
          i: matchOptions.password.length - 1 - match.j,
          j: matchOptions.password.length - 1 - match.i
        }));
      }
    }

    /*
     * -------------------------------------------------------------------------------
     *  regex matching ---------------------------------------------------------------
     * -------------------------------------------------------------------------------
     */
    class MatchRegex extends MatcherBaseClass {
      match({
        password
      }) {
        const matches = [];
        Object.keys(REGEXEN).forEach(name => {
          const regex = REGEXEN[name];
          regex.lastIndex = 0; // keeps regexMatch stateless
          let regexMatch;
          while (regexMatch = regex.exec(password)) {
            if (regexMatch) {
              const token = regexMatch[0];
              matches.push({
                pattern: 'regex',
                token,
                i: regexMatch.index,
                j: regexMatch.index + regexMatch[0].length - 1,
                regexName: name,
                regexMatch
              });
            }
          }
        });
        return sorted(matches);
      }
    }

    const LOG10 = Math.log(10);
    const LOG2 = Math.log(2);
    var utils = {
      // binomial coefficients
      // src: http://blog.plover.com/math/choose.html
      nCk(n, k) {
        let count = n;
        if (k > count) {
          return 0;
        }
        if (k === 0) {
          return 1;
        }
        let coEff = 1;
        for (let i = 1; i <= k; i += 1) {
          coEff *= count;
          coEff /= i;
          count -= 1;
        }
        return coEff;
      },
      log10(n) {
        if (n === 0) return 0;
        return Math.log(n) / LOG10; // IE doesn't support Math.log10 :(
      },
      log2(n) {
        return Math.log(n) / LOG2;
      },
      factorial(num) {
        let rval = 1;
        for (let i = 2; i <= num; i += 1) rval *= i;
        return rval;
      }
    };

    var bruteforceMatcher$1 = ({
      token
    }) => {
      let guesses = BRUTEFORCE_CARDINALITY ** token.length;
      if (guesses === Number.POSITIVE_INFINITY) {
        guesses = Number.MAX_VALUE;
      }
      let minGuesses;
      // small detail: make bruteforce matches at minimum one guess bigger than smallest allowed
      // submatch guesses, such that non-bruteforce submatches over the same [i..j] take precedence.
      if (token.length === 1) {
        minGuesses = MIN_SUBMATCH_GUESSES_SINGLE_CHAR + 1;
      } else {
        minGuesses = MIN_SUBMATCH_GUESSES_MULTI_CHAR + 1;
      }
      return Math.max(guesses, minGuesses);
    };

    var dateMatcher$1 = ({
      year,
      separator
    }) => {
      // base guesses: (year distance from REFERENCE_YEAR) * num_days * num_years
      const yearSpace = Math.max(Math.abs(year - REFERENCE_YEAR), MIN_YEAR_SPACE);
      let guesses = yearSpace * 365;
      // add factor of 4 for separator selection (one of ~4 choices)
      if (separator) {
        guesses *= 4;
      }
      return guesses;
    };

    const getVariations = cleanedWord => {
      const wordArray = cleanedWord.split('');
      const upperCaseCount = wordArray.filter(char => char.match(ONE_UPPER)).length;
      const lowerCaseCount = wordArray.filter(char => char.match(ONE_LOWER)).length;
      let variations = 0;
      const variationLength = Math.min(upperCaseCount, lowerCaseCount);
      for (let i = 1; i <= variationLength; i += 1) {
        variations += utils.nCk(upperCaseCount + lowerCaseCount, i);
      }
      return variations;
    };
    var uppercaseVariant = word => {
      // clean words of non alpha characters to remove the reward effekt to capitalize the first letter https://github.com/dropbox/zxcvbn/issues/232
      const cleanedWord = word.replace(ALPHA_INVERTED, '');
      if (cleanedWord.match(ALL_LOWER_INVERTED) || cleanedWord.toLowerCase() === cleanedWord) {
        return 1;
      }
      // a capitalized word is the most common capitalization scheme,
      // so it only doubles the search space (uncapitalized + capitalized).
      // all caps and end-capitalized are common enough too, underestimate as 2x factor to be safe.
      const commonCases = [START_UPPER, END_UPPER, ALL_UPPER_INVERTED];
      const commonCasesLength = commonCases.length;
      for (let i = 0; i < commonCasesLength; i += 1) {
        const regex = commonCases[i];
        if (cleanedWord.match(regex)) {
          return 2;
        }
      }
      // otherwise calculate the number of ways to capitalize U+L uppercase+lowercase letters
      // with U uppercase letters or less. or, if there's more uppercase than lower (for eg. PASSwORD),
      // the number of ways to lowercase U+L letters with L lowercase letters or less.
      return getVariations(cleanedWord);
    };

    const countSubstring = (string, substring) => {
      let count = 0;
      let pos = string.indexOf(substring);
      while (pos >= 0) {
        count += 1;
        pos = string.indexOf(substring, pos + substring.length);
      }
      return count;
    };
    const getCounts = ({
      sub,
      token
    }) => {
      // lower-case match.token before calculating: capitalization shouldn't affect l33t calc.
      const tokenLower = token.toLowerCase();
      // num of subbed chars
      const subbedCount = countSubstring(tokenLower, sub.substitution);
      // num of unsubbed chars
      const unsubbedCount = countSubstring(tokenLower, sub.letter);
      return {
        subbedCount,
        unsubbedCount
      };
    };
    var l33tVariant = ({
      l33t,
      subs,
      token
    }) => {
      if (!l33t) {
        return 1;
      }
      let variations = 1;
      subs.forEach(sub => {
        const {
          subbedCount,
          unsubbedCount
        } = getCounts({
          sub,
          token
        });
        if (subbedCount === 0 || unsubbedCount === 0) {
          // for this sub, password is either fully subbed (444) or fully unsubbed (aaa)
          // treat that as doubling the space (attacker needs to try fully subbed chars in addition to
          // unsubbed.)
          variations *= 2;
        } else {
          // this case is similar to capitalization:
          // with aa44a, U = 3, S = 2, attacker needs to try unsubbed + one sub + two subs
          const p = Math.min(unsubbedCount, subbedCount);
          let possibilities = 0;
          for (let i = 1; i <= p; i += 1) {
            possibilities += utils.nCk(unsubbedCount + subbedCount, i);
          }
          variations *= possibilities;
        }
      });
      return variations;
    };

    var dictionaryMatcher$1 = ({
      rank,
      reversed,
      l33t,
      subs,
      token,
      dictionaryName
    }) => {
      const baseGuesses = rank; // keep these as properties for display purposes
      const uppercaseVariations = uppercaseVariant(token);
      const l33tVariations = l33tVariant({
        l33t,
        subs,
        token
      });
      const reversedVariations = reversed && 2 || 1;
      let calculation;
      if (dictionaryName === 'diceware') {
        // diceware dictionaries are special, so we get a simple scoring of 1/2 of 6^5 (6 digits on 5 dice)
        // to get fix entropy of ~12.9 bits for every entry https://en.wikipedia.org/wiki/Diceware#:~:text=The%20level%20of,bits
        calculation = 6 ** 5 / 2;
      } else {
        calculation = baseGuesses * uppercaseVariations * l33tVariations * reversedVariations;
      }
      return {
        baseGuesses,
        uppercaseVariations,
        l33tVariations,
        calculation
      };
    };

    var regexMatcher$1 = ({
      regexName,
      regexMatch,
      token
    }) => {
      const charClassBases = {
        alphaLower: 26,
        alphaUpper: 26,
        alpha: 52,
        alphanumeric: 62,
        digits: 10,
        symbols: 33
      };
      if (regexName in charClassBases) {
        return charClassBases[regexName] ** token.length;
      }
      // TODO add more regex types for example special dates like 09.11
      switch (regexName) {
        case 'recentYear':
          // conservative estimate of year space: num years from REFERENCE_YEAR.
          // if year is close to REFERENCE_YEAR, estimate a year space of MIN_YEAR_SPACE.
          return Math.max(Math.abs(parseInt(regexMatch[0], 10) - REFERENCE_YEAR), MIN_YEAR_SPACE);
      }
      return 0;
    };

    var repeatMatcher$1 = ({
      baseGuesses,
      repeatCount
    }) => baseGuesses * repeatCount;

    var sequenceMatcher$1 = ({
      token,
      ascending
    }) => {
      const firstChr = token.charAt(0);
      let baseGuesses;
      const startingPoints = ['a', 'A', 'z', 'Z', '0', '1', '9'];
      // lower guesses for obvious starting points
      if (startingPoints.includes(firstChr)) {
        baseGuesses = 4;
      } else if (/\d/.exec(firstChr)) {
        baseGuesses = 10; // digits
      } else {
        // could give a higher base for uppercase,
        // assigning 26 to both upper and lower sequences is more conservative.
        baseGuesses = 26;
      }
      // need to try a descending sequence in addition to every ascending sequence ->
      // 2x guesses
      if (!ascending) {
        baseGuesses *= 2;
      }
      return baseGuesses * token.length;
    };

    const calcAverageDegree = graph => {
      let average = 0;
      Object.keys(graph).forEach(key => {
        const neighbors = graph[key];
        average += neighbors.filter(entry => !!entry).length;
      });
      average /= Object.entries(graph).length;
      return average;
    };
    const estimatePossiblePatterns = (graphEntry, {
      token,
      turns
    }) => {
      const startingPosition = Object.keys(graphEntry).length;
      const averageDegree = calcAverageDegree(graphEntry);
      let guesses = 0;
      const tokenLength = token.length;
      // # estimate the number of possible patterns w/ tokenLength or less with turns or less.
      for (let i = 2; i <= tokenLength; i += 1) {
        const possibleTurns = Math.min(turns, i - 1);
        for (let j = 1; j <= possibleTurns; j += 1) {
          guesses += utils.nCk(i - 1, j - 1) * startingPosition * averageDegree ** j;
        }
      }
      return guesses;
    };
    var spatialMatcher$1 = ({
      graph,
      token,
      shiftedCount,
      turns
    }, options) => {
      let guesses = estimatePossiblePatterns(options.graphs[graph], {
        token,
        turns
      });
      // add extra guesses for shifted keys. (% instead of 5, A instead of a.)
      // math is similar to extra guesses of l33t substitutions in dictionary matches.
      if (shiftedCount) {
        const unShiftedCount = token.length - shiftedCount;
        if (shiftedCount === 0 || unShiftedCount === 0) {
          guesses *= 2;
        } else {
          let shiftedVariations = 0;
          for (let i = 1; i <= Math.min(shiftedCount, unShiftedCount); i += 1) {
            shiftedVariations += utils.nCk(shiftedCount + unShiftedCount, i);
          }
          guesses *= shiftedVariations;
        }
      }
      return Math.round(guesses);
    };

    var separatorMatcher$1 = () => {
      return SEPERATOR_CHAR_COUNT;
    };

    function factorial(n) {
      if (n <= 1) return 1;
      return n * factorial(n - 1);
    }
    var wordSequenceMatcher$1 = match => {
      if (match.pattern !== 'wordSequence') {
        return 0;
      }
      // Base guesses: factorial of word count (number of ways to order the words)
      const baseGuesses = factorial(match.wordCount);
      // Additional penalty for longer sequences
      const lengthPenalty = 2 ** (match.wordCount - 2);
      return baseGuesses * lengthPenalty;
    };

    const getMinGuesses = (match, password) => {
      let minGuesses = 1;
      if (match.token.length < password.length) {
        if (match.token.length === 1) {
          minGuesses = MIN_SUBMATCH_GUESSES_SINGLE_CHAR;
        } else {
          minGuesses = MIN_SUBMATCH_GUESSES_MULTI_CHAR;
        }
      }
      return minGuesses;
    };
    const matchers = {
      bruteforce: bruteforceMatcher$1,
      date: dateMatcher$1,
      dictionary: dictionaryMatcher$1,
      regex: regexMatcher$1,
      repeat: repeatMatcher$1,
      sequence: sequenceMatcher$1,
      spatial: spatialMatcher$1,
      separator: separatorMatcher$1,
      wordSequence: wordSequenceMatcher$1
    };
    const getScoring = (options, name, match) => {
      if (matchers[name]) {
        return matchers[name](match, options);
      }
      if (options.matchers[name] && 'scoring' in options.matchers[name]) {
        return options.matchers[name].scoring(match, options);
      }
      return 0;
    };
    // ------------------------------------------------------------------------------
    // guess estimation -- one function per match pattern ---------------------------
    // ------------------------------------------------------------------------------
    var estimateGuesses = (options, match, password) => {
      const extraData = {};
      // a match's guess estimate doesn't change. cache it.
      if ('guesses' in match && match.guesses != null) {
        return match;
      }
      const minGuesses = getMinGuesses(match, password);
      const estimationResult = getScoring(options, match.pattern, match);
      let guesses = 0;
      if (typeof estimationResult === 'number') {
        guesses = estimationResult;
      } else if (match.pattern === 'dictionary') {
        guesses = estimationResult.calculation;
        extraData.baseGuesses = estimationResult.baseGuesses;
        extraData.uppercaseVariations = estimationResult.uppercaseVariations;
        extraData.l33tVariations = estimationResult.l33tVariations;
      }
      const matchGuesses = Math.max(guesses, minGuesses);
      return {
        ...match,
        ...extraData,
        guesses: matchGuesses,
        guessesLog10: utils.log10(matchGuesses)
      };
    };

    class Scoring {
      constructor(options) {
        this.options = options;
        this.password = '';
        this.optimal = {};
        this.excludeAdditive = false;
      }
      fillArray(size, valueType) {
        const result = [];
        for (let i = 0; i < size; i += 1) {
          let value = [];
          if (valueType === 'object') {
            value = {};
          }
          result.push(value);
        }
        return result;
      }
      // helper: make bruteforce match objects spanning i to j, inclusive.
      makeBruteforceMatch(i, j) {
        return {
          pattern: 'bruteforce',
          token: this.password.slice(i, j + 1 || 9e9),
          i,
          j
        };
      }
      // helper: considers whether a length-sequenceLength
      // sequence ending at match bestMatches is better (fewer guesses)
      // than previously encountered sequences, updating state if so.
      // eslint-disable-next-line max-statements
      update(match, sequenceLength) {
        const k = match.j;
        const estimatedMatch = estimateGuesses(this.options, match, this.password);
        let pi = estimatedMatch.guesses;
        if (sequenceLength > 1) {
          // we're considering a length-sequenceLength sequence ending with match bestMatches:
          // obtain the product term in the minimization function by multiplying bestMatches's guesses
          // by the product of the length-(sequenceLength-1)
          // sequence ending just before bestMatches, at bestMatches.i - 1.
          pi *= this.optimal.guessesProduct[estimatedMatch.i - 1][sequenceLength - 1];
        }
        // calculate the minimization func
        let g = utils.factorial(sequenceLength) * pi;
        if (!this.excludeAdditive) {
          g += MIN_GUESSES_BEFORE_GROWING_SEQUENCE ** (sequenceLength - 1);
        }
        // update state if new best.
        // first see if any competing sequences covering this prefix,
        // with sequenceLength or fewer matches,
        // fare better than this sequence. if so, skip it and return.
        let shouldSkip = false;
        const competingG = this.optimal.totalGuesses[k];
        Object.keys(competingG).forEach(competingPatternLengthStr => {
          const competingPatternLength = parseInt(competingPatternLengthStr, 10);
          const competingMetricMatch = competingG[competingPatternLength];
          if (competingPatternLength <= sequenceLength) {
            if (competingMetricMatch <= g) {
              shouldSkip = true;
            }
          }
        });
        if (!shouldSkip) {
          // this sequence might be part of the final optimal sequence.
          this.optimal.totalGuesses[k][sequenceLength] = g;
          this.optimal.bestMatches[k][sequenceLength] = estimatedMatch;
          this.optimal.guessesProduct[k][sequenceLength] = pi;
        }
      }
      // helper: evaluate bruteforce matches ending at passwordCharIndex.
      bruteforceUpdate(passwordCharIndex) {
        // see if a single bruteforce match spanning the passwordCharIndex-prefix is optimal.
        let match = this.makeBruteforceMatch(0, passwordCharIndex);
        this.update(match, 1);
        for (let i = 1; i <= passwordCharIndex; i += 1) {
          // generate passwordCharIndex bruteforce matches, spanning from (i=1, j=passwordCharIndex) up to (i=passwordCharIndex, j=passwordCharIndex).
          // see if adding these new matches to any of the sequences in optimal[i-1]
          // leads to new bests.
          match = this.makeBruteforceMatch(i, passwordCharIndex);
          const tmp = this.optimal.bestMatches[i - 1];
          Object.keys(tmp).forEach(sequenceLengthStr => {
            const sequenceLength = parseInt(sequenceLengthStr, 10);
            const lastMatch = tmp[sequenceLength];
            // corner: an optimal sequence will never have two adjacent bruteforce matches.
            // it is strictly better to have a single bruteforce match spanning the same region:
            // same contribution to the guess product with a lower length.
            // --> safe to skip those cases.
            if (lastMatch.pattern !== 'bruteforce') {
              // try adding bestMatches to this length-sequenceLength sequence.
              this.update(match, sequenceLength + 1);
            }
          });
        }
      }
      // helper: step backwards through optimal.bestMatches starting at the end,
      // constructing the final optimal match sequence.
      unwind(passwordLength) {
        const optimalMatchSequence = [];
        let k = passwordLength - 1;
        // find the final best sequence length and score
        let sequenceLength = 0;
        // eslint-disable-next-line no-loss-of-precision
        let g = 2e308;
        const temp = this.optimal.totalGuesses[k];
        // safety check for empty passwords
        if (temp) {
          Object.keys(temp).forEach(candidateSequenceLengthStr => {
            const candidateSequenceLength = parseInt(candidateSequenceLengthStr, 10);
            const candidateMetricMatch = temp[candidateSequenceLength];
            if (candidateMetricMatch < g) {
              sequenceLength = candidateSequenceLength;
              g = candidateMetricMatch;
            }
          });
        }
        while (k >= 0) {
          const match = this.optimal.bestMatches[k][sequenceLength];
          optimalMatchSequence.unshift(match);
          k = match.i - 1;
          sequenceLength -= 1;
        }
        return optimalMatchSequence;
      }
      // ------------------------------------------------------------------------------
      // search --- most guessable match sequence -------------------------------------
      // ------------------------------------------------------------------------------
      //
      // takes a sequence of overlapping matches, returns the non-overlapping sequence with
      // minimum guesses. the following is a O(l_max * (n + m)) dynamic programming algorithm
      // for a length-n password with m candidate matches. l_max is the maximum optimal
      // sequence length spanning each prefix of the password. In practice it rarely exceeds 5 and the
      // search terminates rapidly.
      //
      // the optimal "minimum guesses" sequence is here defined to be the sequence that
      // minimizes the following function:
      //
      //    totalGuesses = sequenceLength! * Product(m.guesses for m in sequence) + D^(sequenceLength - 1)
      //
      // where sequenceLength is the length of the sequence.
      //
      // the factorial term is the number of ways to order sequenceLength patterns.
      //
      // the D^(sequenceLength-1) term is another length penalty, roughly capturing the idea that an
      // attacker will try lower-length sequences first before trying length-sequenceLength sequences.
      //
      // for example, consider a sequence that is date-repeat-dictionary.
      //  - an attacker would need to try other date-repeat-dictionary combinations,
      //    hence the product term.
      //  - an attacker would need to try repeat-date-dictionary, dictionary-repeat-date,
      //    ..., hence the factorial term.
      //  - an attacker would also likely try length-1 (dictionary) and length-2 (dictionary-date)
      //    sequences before length-3. assuming at minimum D guesses per pattern type,
      //    D^(sequenceLength-1) approximates Sum(D^i for i in [1..sequenceLength-1]
      //
      // ------------------------------------------------------------------------------
      mostGuessableMatchSequence(password, matches, excludeAdditive = false) {
        this.password = password;
        this.excludeAdditive = excludeAdditive;
        const passwordLength = password.length;
        // partition matches into sublists according to ending index j
        let matchesByCoordinateJ = this.fillArray(passwordLength, 'array');
        matches.forEach(match => {
          matchesByCoordinateJ[match.j].push(match);
        });
        // small detail: for deterministic output, sort each sublist by i.
        matchesByCoordinateJ = matchesByCoordinateJ.map(match => match.sort((m1, m2) => m1.i - m2.i));
        this.optimal = {
          // optimal.bestMatches[k][sequenceLength] holds final match in the best length-sequenceLength
          // match sequence covering the
          // password prefix up to k, inclusive.
          // if there is no length-sequenceLength sequence that scores better (fewer guesses) than
          // a shorter match sequence spanning the same prefix,
          // optimal.bestMatches[k][sequenceLength] is undefined.
          bestMatches: this.fillArray(passwordLength, 'object'),
          // same structure as optimal.bestMatches -- holds the product term Prod(bestMatches.guesses for bestMatches in sequence).
          // optimal.guessesProduct allows for fast (non-looping) updates to the minimization function.
          guessesProduct: this.fillArray(passwordLength, 'object'),
          // same structure as optimal.bestMatches -- holds the overall metric.
          totalGuesses: this.fillArray(passwordLength, 'object')
        };
        for (let k = 0; k < passwordLength; k += 1) {
          matchesByCoordinateJ[k].forEach(match => {
            if (match.i > 0) {
              const prevM = this.optimal.bestMatches[match.i - 1];
              Object.keys(prevM).forEach(sequenceLengthStr => {
                const sequenceLength = parseInt(sequenceLengthStr, 10);
                this.update(match, sequenceLength + 1);
              });
            } else {
              this.update(match, 1);
            }
          });
          this.bruteforceUpdate(k);
        }
        const optimalMatchSequence = this.unwind(passwordLength);
        const optimalSequenceLength = optimalMatchSequence.length;
        const guesses = this.getGuesses(password, optimalSequenceLength);
        return {
          password,
          guesses,
          guessesLog10: utils.log10(guesses),
          sequence: optimalMatchSequence
        };
      }
      getGuesses(password, optimalSequenceLength) {
        const passwordLength = password.length;
        if (password.length === 0) {
          return 1;
        } else {
          return this.optimal.totalGuesses[passwordLength - 1][optimalSequenceLength];
        }
      }
    }

    /*
     *-------------------------------------------------------------------------------
     * repeats (aaa, abcabcabc) ------------------------------
     *-------------------------------------------------------------------------------
     */
    class MatchRepeat extends MatcherBaseClass {
      constructor(options) {
        super(options);
        this.scoring = new Scoring(options);
      }
      // eslint-disable-next-line max-statements
      match({
        password,
        omniMatch
      }) {
        const matches = [];
        let lastIndex = 0;
        while (lastIndex < password.length) {
          const greedyMatch = this.getGreedyMatch(password, lastIndex);
          const lazyMatch = this.getLazyMatch(password, lastIndex);
          if (greedyMatch == null) {
            break;
          }
          const {
            match,
            baseToken
          } = this.setMatchToken(greedyMatch, lazyMatch);
          if (match) {
            const j = match.index + match[0].length - 1;
            const baseGuesses = this.getBaseGuesses(baseToken, omniMatch);
            matches.push(this.normalizeMatch(baseToken, j, match, baseGuesses));
            lastIndex = j + 1;
          }
        }
        const hasPromises = matches.some(match => {
          return match instanceof Promise;
        });
        if (hasPromises) {
          // eslint-disable-next-line @typescript-eslint/await-thenable
          return Promise.all(matches);
        }
        return matches;
      }
      // eslint-disable-next-line max-params
      normalizeMatch(baseToken, j, match, baseGuesses) {
        const baseMatch = {
          pattern: 'repeat',
          i: match.index,
          j,
          token: match[0],
          baseToken,
          baseGuesses: 0,
          repeatCount: match[0].length / baseToken.length
        };
        if (baseGuesses instanceof Promise) {
          return baseGuesses.then(resolvedBaseGuesses => {
            return {
              ...baseMatch,
              baseGuesses: resolvedBaseGuesses
            };
          });
        }
        return {
          ...baseMatch,
          baseGuesses
        };
      }
      getGreedyMatch(password, lastIndex) {
        const greedy = /(.+)\1+/g;
        greedy.lastIndex = lastIndex;
        return greedy.exec(password);
      }
      getLazyMatch(password, lastIndex) {
        const lazy = /(.+?)\1+/g;
        lazy.lastIndex = lastIndex;
        return lazy.exec(password);
      }
      setMatchToken(greedyMatch, lazyMatch) {
        const lazyAnchored = /^(.+?)\1+$/;
        let match;
        let baseToken = '';
        if (lazyMatch && greedyMatch[0].length > lazyMatch[0].length) {
          // greedy beats lazy for 'aabaab'
          // greedy: [aabaab, aab]
          // lazy:   [aa,     a]
          match = greedyMatch;
          // greedy's repeated string might itself be repeated, eg.
          // aabaab in aabaabaabaab.
          // run an anchored lazy match on greedy's repeated string
          // to find the shortest repeated string
          const temp = lazyAnchored.exec(match[0]);
          if (temp) {
            baseToken = temp[1];
          }
        } else {
          // lazy beats greedy for 'aaaaa'
          // greedy: [aaaa,  aa]
          // lazy:   [aaaaa, a]
          match = lazyMatch;
          if (match) {
            baseToken = match[1];
          }
        }
        return {
          match,
          baseToken
        };
      }
      getBaseGuesses(baseToken, omniMatch) {
        const matches = omniMatch.match(baseToken);
        if (matches instanceof Promise) {
          return matches.then(resolvedMatches => {
            const baseAnalysis = this.scoring.mostGuessableMatchSequence(baseToken, resolvedMatches);
            return baseAnalysis.guesses;
          });
        }
        const baseAnalysis = this.scoring.mostGuessableMatchSequence(baseToken, matches);
        return baseAnalysis.guesses;
      }
    }

    /*
     *-------------------------------------------------------------------------------
     * sequences (abcdef) ------------------------------
     *-------------------------------------------------------------------------------
     */
    class MatchSequence extends MatcherBaseClass {
      constructor() {
        super(...arguments);
        this.MAX_DELTA = 5;
      }
      // eslint-disable-next-line max-statements
      match({
        password
      }) {
        /*
         * Identifies sequences by looking for repeated differences in unicode codepoint.
         * this allows skipping, such as 9753, and also matches some extended unicode sequences
         * such as Greek and Cyrillic alphabets.
         *
         * for example, consider the input 'abcdb975zy'
         *
         * password: a   b   c   d   b    9   7   5   z   y
         * index:    0   1   2   3   4    5   6   7   8   9
         * delta:      1   1   1  -2  -41  -2  -2  69   1
         *
         * expected result:
         * [(i, j, delta), ...] = [(0, 3, 1), (5, 7, -2), (8, 9, 1)]
         */
        const result = [];
        if (password.length === 1) {
          return [];
        }
        let i = 0;
        let lastDelta = null;
        const passwordLength = password.length;
        for (let k = 1; k < passwordLength; k += 1) {
          const delta = password.charCodeAt(k) - password.charCodeAt(k - 1);
          if (lastDelta === null) {
            lastDelta = delta;
          }
          if (delta !== lastDelta) {
            const j = k - 1;
            this.update({
              i,
              j,
              delta: lastDelta,
              password,
              result
            });
            i = j;
            lastDelta = delta;
          }
        }
        this.update({
          i,
          j: passwordLength - 1,
          delta: lastDelta,
          password,
          result
        });
        return result;
      }
      update({
        i,
        j,
        delta,
        password,
        result
      }) {
        if (j - i > 1 || Math.abs(delta) === 1) {
          const absoluteDelta = Math.abs(delta);
          if (absoluteDelta > 0 && absoluteDelta <= this.MAX_DELTA) {
            const token = password.slice(i, j + 1 || 9e9);
            const {
              sequenceName,
              sequenceSpace
            } = this.getSequence(token);
            return result.push({
              pattern: 'sequence',
              i,
              j,
              token: password.slice(i, j + 1 || 9e9),
              sequenceName,
              sequenceSpace,
              ascending: delta > 0
            });
          }
        }
        return null;
      }
      getSequence(token) {
        // TODO conservatively stick with roman alphabet size.
        //  (this could be improved)
        let sequenceName = 'unicode';
        let sequenceSpace = 26;
        if (ALL_LOWER.test(token)) {
          sequenceName = 'lower';
          sequenceSpace = 26;
        } else if (ALL_UPPER.test(token)) {
          sequenceName = 'upper';
          sequenceSpace = 26;
        } else if (ALL_DIGIT.test(token)) {
          sequenceName = 'digits';
          sequenceSpace = 10;
        }
        return {
          sequenceName,
          sequenceSpace
        };
      }
    }

    /*
     * ------------------------------------------------------------------------------
     * spatial match (qwerty/dvorak/keypad and so on) -----------------------------------------
     * ------------------------------------------------------------------------------
     */
    class MatchSpatial extends MatcherBaseClass {
      constructor() {
        super(...arguments);
        this.SHIFTED_RX = /[~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:"ZXCVBNM<>?]/;
      }
      match({
        password
      }) {
        const matches = [];
        Object.keys(this.options.graphs).forEach(graphName => {
          const graph = this.options.graphs[graphName];
          extend(matches, this.helper(password, graph, graphName));
        });
        return sorted(matches);
      }
      checkIfShifted(graphName, password, index) {
        if (!graphName.includes('keypad') &&
        // initial character is shifted
        this.SHIFTED_RX.test(password.charAt(index))) {
          return 1;
        }
        return 0;
      }
      // eslint-disable-next-line complexity, max-statements
      helper(password, graph, graphName) {
        let shiftedCount;
        const matches = [];
        let i = 0;
        const passwordLength = password.length;
        while (i < passwordLength - 1) {
          let j = i + 1;
          let lastDirection = null;
          let turns = 0;
          shiftedCount = this.checkIfShifted(graphName, password, i);
          while (true) {
            const prevChar = password.charAt(j - 1);
            const adjacents = graph[prevChar] || [];
            let found = false;
            let curDirection = -1;
            // consider growing pattern by one character if j hasn't gone over the edge.
            if (j < passwordLength) {
              const curChar = password.charAt(j);
              const adjacentsLength = adjacents.length;
              for (let k = 0; k < adjacentsLength; k += 1) {
                const adjacent = adjacents[k];
                curDirection += 1;
                // eslint-disable-next-line max-depth
                if (adjacent) {
                  const adjacentIndex = adjacent.indexOf(curChar);
                  // eslint-disable-next-line max-depth
                  if (adjacentIndex !== -1) {
                    found = true;
                    // eslint-disable-next-line max-depth
                    if (adjacentIndex === 1) {
                      // # index 1 in the adjacency means the key is shifted,
                      // # 0 means unshifted: A vs a, % vs 5, etc.
                      // # for example, 'q' is adjacent to the entry '2@'.
                      // # @ is shifted w/ index 1, 2 is unshifted.
                      shiftedCount += 1;
                    }
                    const foundDirection = curDirection;
                    // eslint-disable-next-line max-depth
                    if (lastDirection !== foundDirection) {
                      // # adding a turn is correct even in the initial
                      // case when last_direction is null:
                      // # every spatial pattern starts with a turn.
                      turns += 1;
                      lastDirection = foundDirection;
                    }
                    break;
                  }
                }
              }
            }
            // if the current pattern continued, extend j and try to grow again
            if (found) {
              j += 1;
              // otherwise push the pattern discovered so far, if any...
            } else {
              // don't consider length 1 or 2 chains.
              if (j - i > 2) {
                matches.push({
                  pattern: 'spatial',
                  i,
                  j: j - 1,
                  token: password.slice(i, j),
                  graph: graphName,
                  turns,
                  shiftedCount
                });
              }
              // ...and then start a new search for the rest of the password.
              i = j;
              break;
            }
          }
        }
        return matches;
      }
    }

    const separatorRegex = new RegExp(`[${SEPERATOR_CHARS.join('')}]`);
    /*
     *-------------------------------------------------------------------------------
     * separators (any semi-repeated special character) -----------------------------
     *-------------------------------------------------------------------------------
     */
    class MatchSeparator extends MatcherBaseClass {
      static getMostUsedSeparatorChar(password) {
        const mostUsedSeperators = [...password.split('').filter(c => separatorRegex.test(c)).reduce((memo, c) => {
          const m = memo.get(c);
          if (m) {
            memo.set(c, parseInt(m, 10) + 1);
          } else {
            memo.set(c, 1);
          }
          return memo;
        }, new Map()).entries()].sort(([_a, a], [_b, b]) => b - a);
        if (!mostUsedSeperators.length) return undefined;
        const match = mostUsedSeperators[0];
        // If the special character is only used once, don't treat it like a separator
        if (match[1] < 2) return undefined;
        return match[0];
      }
      static getSeparatorRegex(separator) {
        return new RegExp(`([^${separator}\n])(${separator})(?!${separator})`, 'g');
        // negative lookbehind can be added again in a few years when it is more supported by the browsers (currently 2023)
        // https://github.com/zxcvbn-ts/zxcvbn/issues/202
        // return new RegExp(`(?<!${separator})(${separator})(?!${separator})`, 'g')
      }
      match({
        password
      }) {
        const result = [];
        if (password.length === 0) return result;
        const mostUsedSpecial = MatchSeparator.getMostUsedSeparatorChar(password);
        if (mostUsedSpecial === undefined) return result;
        const isSeparator = MatchSeparator.getSeparatorRegex(mostUsedSpecial);
        for (const match of password.matchAll(isSeparator)) {
          if (match.index === undefined) continue;
          // add one to the index because we changed the regex from negative lookbehind to something simple.
          // this simple approach uses the first character before the separater too but we only need the index of the separater
          // https://github.com/zxcvbn-ts/zxcvbn/issues/202
          const i = match.index + 1;
          result.push({
            pattern: 'separator',
            token: mostUsedSpecial,
            i,
            j: i
          });
        }
        return result;
      }
    }

    /*
     *-------------------------------------------------------------------------------
     * word sequences (oneTwoThree, fourFiveSix) ------------------------------
     *-------------------------------------------------------------------------------
     */
    class MatchWordSequence extends MatcherBaseClass {
      constructor(options) {
        super(options);
        this.dictionary = new MatchDictionary(this.options, true);
        this.dictionaryL33t = new MatchL33t(this.options, true);
        this.dictionaryReverse = new MatchReverse(this.options, true);
      }
      match(matchOptions) {
        const {
          password
        } = matchOptions;
        // Get all dictionary matches first
        const dictionaryMatches = this.dictionary.match(matchOptions);
        const dictionaryL33tMatches = this.dictionaryL33t.match(matchOptions);
        const dictionaryReverseMatches = this.dictionaryReverse.match(matchOptions);
        const filteredDictionaryMatches = this.filterDictionaryMatches([...dictionaryMatches, ...dictionaryL33tMatches, ...dictionaryReverseMatches]);
        // Convert dictionary matches to our internal format
        const wordMatches = this.convertToWordMatches(filteredDictionaryMatches);
        // Find sequences of consecutive words
        return this.findWordSequences(wordMatches, password);
      }
      filterDictionaryMatches(matches) {
        // sort by start index, then by end index
        return [...matches].sort((a, b) => {
          if (a.i !== b.i) return a.i - b.i;
          if (a.j !== b.j) return a.j - b.j;
          // prefer forward over reversed
          if (a.reversed !== b.reversed) return a.reversed ? 1 : -1;
          // prefer non-l33t
          if (a.l33t !== b.l33t) return a.l33t ? 1 : -1;
          // prefer better rank
          return a.rank - b.rank;
        })
        // Keep only non-overlapping matches, favoring earlier ones
        .reduce((acc, match) => {
          const last = acc[acc.length - 1];
          if (!last || match.i > last.j) {
            acc.push(match);
          }
          return acc;
        }, []);
      }
      convertToWordMatches(dictionaryMatches) {
        return dictionaryMatches.map(match => ({
          word: match.matchedWord,
          i: match.i,
          j: match.j,
          rank: match.rank,
          dictionaryName: match.dictionaryName
        }));
      }
      findWordSequences(wordMatches, password) {
        const sequences = [];
        if (wordMatches.length === 0) {
          return sequences;
        }
        // Sort matches by start position
        const sortedMatches = [...wordMatches].sort((a, b) => a.i - b.i);
        // Find all possible sequences
        for (let startIdx = 0; startIdx < sortedMatches.length; startIdx += 1) {
          const sequencesFromStart = this.findSequencesFromStart(sortedMatches, startIdx, password);
          sequences.push(...sequencesFromStart);
        }
        return sequences;
      }
      // eslint-disable-next-line max-statements
      findSequencesFromStart(sortedMatches, startIdx, password) {
        const sequences = [];
        const startMatch = sortedMatches[startIdx];
        // Start with single word sequence
        let currentSequence = [startMatch];
        let currentEnd = startMatch.j;
        // Try to extend the sequence
        for (let nextIdx = startIdx + 1; nextIdx < sortedMatches.length; nextIdx += 1) {
          const nextMatch = sortedMatches[nextIdx];
          // Only extend if the next word can form a valid sequence
          if (this.isValidWordSequence(currentSequence, nextMatch, password)) {
            currentSequence.push(nextMatch);
            currentEnd = nextMatch.j;
          } else if (nextMatch.i > currentEnd) {
            // Gap found, save current sequence and start new one
            if (currentSequence.length > 1) {
              sequences.push(this.createWordSequenceMatch(currentSequence, password));
            }
            currentSequence = [nextMatch];
            currentEnd = nextMatch.j;
          }
          // If nextMatch.i <= currentEnd, it overlaps, so we skip it
        }
        // Don't forget the last sequence
        if (currentSequence.length > 1) {
          sequences.push(this.createWordSequenceMatch(currentSequence, password));
        }
        return sequences;
      }
      isValidWordSequence(currentSequence, nextMatch, password) {
        // Get the text between the last word and the next word
        const lastWord = currentSequence[currentSequence.length - 1];
        const textBetween = password.slice(lastWord.j + 1, nextMatch.i);
        // Check for common word separators
        const separators = ['', ' ', '-', '_', '.', ''];
        // For simple concatenation (no separator)
        const isSimpleConcat = textBetween === '';
        // For snake_case or kebab-case, check for separators
        const hasValidSeparator = separators.some(sep => textBetween === sep);
        // For camelCase, we need to check if the next word starts with uppercase
        // and there's no separator (or just a single character that could be uppercase)
        const isCamelCase = textBetween.length === 1 && textBetween === textBetween.toUpperCase() && textBetween !== textBetween.toLowerCase();
        return hasValidSeparator || isSimpleConcat || isCamelCase;
      }
      createWordSequenceMatch(sequence, password) {
        const firstMatch = sequence[0];
        const lastMatch = sequence[sequence.length - 1];
        const words = sequence.map(match => match.word);
        // Determine if sequence is ascending (by rank)
        const ranks = sequence.map(match => match.rank);
        const ascending = ranks.every((rank, i) => i === 0 || rank >= ranks[i - 1]);
        // Use the most common dictionary name, or the first one
        const dictionaryNames = sequence.map(match => match.dictionaryName);
        const dictionaryName = this.getMostCommon(dictionaryNames) || firstMatch.dictionaryName;
        return {
          pattern: 'wordSequence',
          i: firstMatch.i,
          j: lastMatch.j,
          token: password.slice(firstMatch.i, lastMatch.j + 1),
          words,
          wordCount: words.length,
          dictionaryName,
          ascending
        };
      }
      getMostCommon(array) {
        if (array.length === 0) return null;
        const counts = new Map();
        let maxCount = 0;
        let mostCommon = null;
        array.forEach(item => {
          const count = (counts.get(item) || 0) + 1;
          counts.set(item, count);
          if (count > maxCount) {
            maxCount = count;
            mostCommon = item;
          }
        });
        return mostCommon;
      }
    }

    /*
     * -------------------------------------------------------------------------------
     *  Omnimatch combine matchers ---------------------------------------------------------------
     * -------------------------------------------------------------------------------
     */
    class Matching {
      constructor(options) {
        this.options = options;
        this.matchers = {};
        this.matchers = {
          date: new MatchDate(this.options),
          dictionary: new MatchDictionary(this.options),
          dictionaryL33t: new MatchL33t(this.options),
          dictionaryReverse: new MatchReverse(this.options),
          regex: new MatchRegex(this.options),
          repeat: new MatchRepeat(this.options),
          sequence: new MatchSequence(this.options),
          spatial: new MatchSpatial(this.options),
          separator: new MatchSeparator(this.options),
          wordSequence: new MatchWordSequence(this.options)
        };
        Object.entries(this.options.matchers).forEach(([key, Matcher]) => {
          this.matchers[key] = new Matcher.Matching(this.options);
        });
      }
      processResult(matches, promises, result) {
        if (result instanceof Promise) {
          const wrappedPromise = result.then(response => {
            extend(matches, response);
            return response;
          });
          promises.push(wrappedPromise);
        } else {
          extend(matches, result);
        }
      }
      handlePromises(matches, promises) {
        if (promises.length > 0) {
          return new Promise((resolve, reject) => {
            Promise.all(promises).then(() => {
              resolve(sorted(matches));
            }).catch(error => {
              // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
              reject(error);
            });
          });
        }
        return sorted(matches);
      }
      match(password, userInputsOptions) {
        const matches = [];
        const promises = [];
        Object.values(this.matchers).forEach(matcher => {
          const result = matcher.match({
            password,
            omniMatch: this,
            userInputsOptions
          });
          // extends matches and promises by references
          this.processResult(matches, promises, result);
        });
        return this.handlePromises(matches, promises);
      }
    }

    const SECOND = 1;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;
    const MONTH = DAY * 31;
    const YEAR = MONTH * 12;
    const CENTURY = YEAR * 100;
    const times = {
      second: SECOND,
      minute: MINUTE,
      hour: HOUR,
      day: DAY,
      month: MONTH,
      year: YEAR,
      century: CENTURY
    };
    const timeEstimationValuesDefaults = {
      scoring: {
        0: 1e3,
        1: 1e6,
        2: 1e8,
        3: 1e10
      },
      attackTime: {
        onlineThrottlingXPerHour: 100,
        onlineNoThrottlingXPerSecond: 10,
        offlineSlowHashingXPerSecond: 1e4,
        offlineFastHashingXPerSecond: 1e10
      }
    };
    const checkTimeEstimationValues = timeEstimationValues => {
      Object.entries(timeEstimationValues).forEach(([key, data]) => {
        Object.entries(data).forEach(([subKey, value]) => {
          // @ts-expect-error for testing purposes
          if (value < timeEstimationValuesDefaults[key][subKey]) {
            throw new Error('Time estimation values are not to be allowed to be less than default');
          }
        });
      });
    };
    /*
     * -------------------------------------------------------------------------------
     *  Estimates time for an attacker ---------------------------------------------------------------
     * -------------------------------------------------------------------------------
     */
    class TimeEstimates {
      constructor(options) {
        this.options = options;
      }
      estimateAttackTimes(guesses) {
        const crackTimesSeconds = this.calculateCrackTimesSeconds(guesses);
        const crackTimes = {};
        Object.keys(crackTimesSeconds).forEach(crackTime => {
          const usedScenario = crackTime;
          const seconds = crackTimesSeconds[usedScenario];
          const {
            base,
            displayStr
          } = this.displayTime(seconds);
          crackTimes[usedScenario] = {
            base,
            seconds,
            display: this.translate(displayStr, base)
          };
        });
        return {
          crackTimes,
          score: this.guessesToScore(guesses)
        };
      }
      calculateCrackTimesSeconds(guesses) {
        const attackTimesOptions = this.options.timeEstimationValues.attackTime;
        return {
          onlineThrottlingXPerHour: guesses / (attackTimesOptions.onlineThrottlingXPerHour / 3600),
          onlineNoThrottlingXPerSecond: guesses / attackTimesOptions.onlineNoThrottlingXPerSecond,
          offlineSlowHashingXPerSecond: guesses / attackTimesOptions.offlineSlowHashingXPerSecond,
          offlineFastHashingXPerSecond: guesses / attackTimesOptions.offlineFastHashingXPerSecond
        };
      }
      guessesToScore(guesses) {
        const scoringOptions = this.options.timeEstimationValues.scoring;
        const DELTA = 5;
        if (guesses < scoringOptions[0] + DELTA) {
          // risky password: "too guessable"
          return 0;
        }
        if (guesses < scoringOptions[1] + DELTA) {
          // modest protection from throttled online attacks: "very guessable"
          return 1;
        }
        if (guesses < scoringOptions[2] + DELTA) {
          // modest protection from unthrottled online attacks: "somewhat guessable"
          return 2;
        }
        if (guesses < scoringOptions[3] + DELTA) {
          // modest protection from offline attacks: "safely unguessable"
          // assuming a salted, slow hash function like bcrypt, scrypt, PBKDF2, argon, etc
          return 3;
        }
        // strong protection from offline attacks under same scenario: "very unguessable"
        return 4;
      }
      displayTime(seconds) {
        let displayStr = 'centuries';
        let base = null;
        const timeKeys = Object.keys(times);
        const foundIndex = timeKeys.findIndex(time => seconds < times[time]);
        if (foundIndex > -1) {
          displayStr = timeKeys[foundIndex - 1];
          if (foundIndex !== 0) {
            base = Math.round(seconds / times[displayStr]);
          } else {
            displayStr = 'ltSecond';
          }
        }
        return {
          base,
          displayStr
        };
      }
      translate(displayStr, value) {
        let key = displayStr;
        if (value !== null && value !== 1) {
          key += 's';
        }
        const {
          timeEstimation
        } = this.options.translations;
        const translation = timeEstimation[key];
        if (typeof translation === 'function') {
          return translation(value);
        }
        return translation.replace('{base}', `${value}`);
      }
    }

    var bruteforceMatcher = () => {
      return null;
    };

    var dateMatcher = options => {
      return {
        warning: options.translations.warnings.dates,
        suggestions: [options.translations.suggestions.dates]
      };
    };

    const getDictionaryWarningPassword = (options, match, isSoleMatch) => {
      let warning = null;
      if (isSoleMatch && !match.l33t && !match.reversed) {
        if (match.rank <= 10) {
          warning = options.translations.warnings.topTen;
        } else if (match.rank <= 100) {
          warning = options.translations.warnings.topHundred;
        } else {
          warning = options.translations.warnings.common;
        }
      } else if (match.guessesLog10 <= 4) {
        warning = options.translations.warnings.similarToCommon;
      }
      return warning;
    };
    const getDictionaryWarningWikipedia = (options, match, isSoleMatch) => {
      let warning = null;
      if (isSoleMatch) {
        warning = options.translations.warnings.wordByItself;
      }
      return warning;
    };
    const getDictionaryWarningNames = (options, match, isSoleMatch) => {
      if (isSoleMatch) {
        return options.translations.warnings.namesByThemselves;
      }
      return options.translations.warnings.commonNames;
    };
    const getDictionaryWarning = (options, match, isSoleMatch) => {
      const dictName = match.dictionaryName;
      const isAName = dictName.toLowerCase().includes('lastnames') || dictName.toLowerCase().includes('firstnames') || dictName.toLowerCase().includes('names');
      if (dictName.includes('passwords')) {
        return getDictionaryWarningPassword(options, match, isSoleMatch);
      }
      if (dictName.includes('wikipedia')) {
        return getDictionaryWarningWikipedia(options, match, isSoleMatch);
      }
      if (isAName) {
        return getDictionaryWarningNames(options, match, isSoleMatch);
      }
      if (dictName.includes('userInputs')) {
        return options.translations.warnings.userInputs;
      }
      return null;
    };
    var dictionaryMatcher = (options, match, isSoleMatch) => {
      const warning = getDictionaryWarning(options, match, isSoleMatch);
      const suggestions = [];
      const word = match.token;
      if (word.match(START_UPPER)) {
        suggestions.push(options.translations.suggestions.capitalization);
      } else if (word.match(ALL_UPPER_INVERTED) && word.toLowerCase() !== word) {
        suggestions.push(options.translations.suggestions.allUppercase);
      }
      if (match.reversed && match.token.length >= 4) {
        suggestions.push(options.translations.suggestions.reverseWords);
      }
      if (match.l33t) {
        suggestions.push(options.translations.suggestions.l33t);
      }
      return {
        warning,
        suggestions
      };
    };

    var regexMatcher = (options, match) => {
      if (match.regexName === 'recentYear') {
        return {
          warning: options.translations.warnings.recentYears,
          suggestions: [options.translations.suggestions.recentYears, options.translations.suggestions.associatedYears]
        };
      }
      return {
        warning: null,
        suggestions: []
      };
    };

    var repeatMatcher = (options, match) => {
      let warning = options.translations.warnings.extendedRepeat;
      if (match.baseToken.length === 1) {
        warning = options.translations.warnings.simpleRepeat;
      }
      return {
        warning,
        suggestions: [options.translations.suggestions.repeated]
      };
    };

    var sequenceMatcher = options => {
      return {
        warning: options.translations.warnings.sequences,
        suggestions: [options.translations.suggestions.sequences]
      };
    };

    var spatialMatcher = (options, match) => {
      let warning = options.translations.warnings.keyPattern;
      if (match.turns === 1) {
        warning = options.translations.warnings.straightRow;
      }
      return {
        warning,
        suggestions: [options.translations.suggestions.longerKeyboardPattern]
      };
    };

    var separatorMatcher = () => {
      // no suggestions
      return null;
    };

    var wordSequenceMatcher = (options, match) => {
      if (match.pattern !== 'wordSequence') {
        return null;
      }
      let warning = null;
      const suggestions = [];
      // Warning for common word sequences
      if (match.wordCount >= 3) {
        warning = options.translations.warnings.sequences;
      }
      // Suggestions based on sequence characteristics
      if (match.ascending) {
        suggestions.push(options.translations.suggestions.sequences);
      } else {
        suggestions.push(options.translations.suggestions.anotherWord);
      }
      if (match.wordCount > 2) {
        suggestions.push(options.translations.suggestions.useWords);
      }
      return {
        warning,
        suggestions
      };
    };

    const defaultFeedback = {
      warning: null,
      suggestions: []
    };
    /*
     * -------------------------------------------------------------------------------
     *  Generate feedback ---------------------------------------------------------------
     * -------------------------------------------------------------------------------
     */
    class Feedback {
      constructor(options) {
        this.options = options;
        this.matchers = {};
        this.defaultFeedback = {
          warning: null,
          suggestions: []
        };
        this.setDefaultSuggestions();
        this.matchers = {
          bruteforce: bruteforceMatcher,
          date: dateMatcher,
          dictionary: dictionaryMatcher,
          regex: regexMatcher,
          repeat: repeatMatcher,
          sequence: sequenceMatcher,
          spatial: spatialMatcher,
          separator: separatorMatcher,
          wordSequence: wordSequenceMatcher
        };
        Object.entries(this.options.matchers).forEach(([key, matcher]) => {
          if (matcher.feedback) {
            this.matchers[key] = matcher.feedback;
          }
        });
      }
      setDefaultSuggestions() {
        this.defaultFeedback.suggestions.push(this.options.translations.suggestions.useWords, this.options.translations.suggestions.noNeed);
      }
      getFeedback(score, sequence) {
        if (sequence.length === 0) {
          return this.defaultFeedback;
        }
        if (score > 2) {
          return defaultFeedback;
        }
        const extraFeedback = this.options.translations.suggestions.anotherWord;
        const longestMatch = this.getLongestMatch(sequence);
        let feedback = this.getMatchFeedback(longestMatch, sequence.length === 1);
        if (feedback !== null && feedback !== undefined) {
          feedback.suggestions.unshift(extraFeedback);
        } else {
          feedback = {
            warning: null,
            suggestions: [extraFeedback]
          };
        }
        return feedback;
      }
      getLongestMatch(sequence) {
        let longestMatch = sequence[0];
        // ignore first entry
        for (let i = 1; i < sequence.length; i += 1) {
          const match = sequence[i];
          if (match.token.length > longestMatch.token.length) {
            longestMatch = match;
          }
        }
        return longestMatch;
      }
      getMatchFeedback(match, isSoleMatch) {
        if (this.matchers[match.pattern]) {
          return this.matchers[match.pattern](this.options, match, isSoleMatch);
        }
        return defaultFeedback;
      }
    }

    var l33tTable = {
      a: ['4', '@'],
      b: ['8'],
      c: ['(', '{', '[', '<'],
      d: ['6', '|)'],
      e: ['3'],
      f: ['#'],
      g: ['6', '9', '&'],
      h: ['#', '|-|'],
      i: ['1', '!', '|'],
      k: ['<', '|<'],
      l: ['!', '1', '|', '7'],
      m: ['^^', 'nn', '2n', '/\\\\/\\\\'],
      n: ['//'],
      o: ['0', '()'],
      q: ['9'],
      u: ['|_|'],
      s: ['$', '5'],
      t: ['+', '7'],
      v: ['<', '>', '/'],
      w: ['^/', 'uu', 'vv', '2u', '2v', '\\\\/\\\\/'],
      x: ['%', '><'],
      z: ['2']
    };

    var translationKeys = {
      warnings: {
        straightRow: 'straightRow',
        keyPattern: 'keyPattern',
        simpleRepeat: 'simpleRepeat',
        extendedRepeat: 'extendedRepeat',
        sequences: 'sequences',
        recentYears: 'recentYears',
        dates: 'dates',
        topTen: 'topTen',
        topHundred: 'topHundred',
        common: 'common',
        similarToCommon: 'similarToCommon',
        wordByItself: 'wordByItself',
        namesByThemselves: 'namesByThemselves',
        commonNames: 'commonNames',
        userInputs: 'userInputs',
        pwned: 'pwned'
      },
      suggestions: {
        l33t: 'l33t',
        reverseWords: 'reverseWords',
        allUppercase: 'allUppercase',
        capitalization: 'capitalization',
        dates: 'dates',
        recentYears: 'recentYears',
        associatedYears: 'associatedYears',
        sequences: 'sequences',
        repeated: 'repeated',
        longerKeyboardPattern: 'longerKeyboardPattern',
        anotherWord: 'anotherWord',
        useWords: 'useWords',
        noNeed: 'noNeed',
        pwned: 'pwned'
      },
      timeEstimation: {
        ltSecond: 'ltSecond',
        second: 'second',
        seconds: 'seconds',
        minute: 'minute',
        minutes: 'minutes',
        hour: 'hour',
        hours: 'hours',
        day: 'day',
        days: 'days',
        month: 'month',
        months: 'months',
        year: 'year',
        years: 'years',
        centuries: 'centuries'
      }
    };

    class TrieNode {
      constructor(parents = []) {
        this.parents = parents;
        this.children = new Map();
      }
      addSub(key, ...subs) {
        const firstChar = key.charAt(0);
        if (!this.children.has(firstChar)) {
          this.children.set(firstChar, new TrieNode([...this.parents, firstChar]));
        }
        let cur = this.children.get(firstChar);
        for (let i = 1; i < key.length; i += 1) {
          const c = key.charAt(i);
          if (!cur.hasChild(c)) {
            cur.addChild(c);
          }
          cur = cur.getChild(c);
        }
        cur.subs = (cur.subs || []).concat(subs);
        return this;
      }
      getChild(child) {
        return this.children.get(child);
      }
      isTerminal() {
        return !!this.subs;
      }
      addChild(child) {
        if (!this.hasChild(child)) {
          this.children.set(child, new TrieNode([...this.parents, child]));
        }
      }
      hasChild(child) {
        return this.children.has(child);
      }
    }

    var l33tTableToTrieNode = (l33tTable, triNode) => {
      Object.entries(l33tTable).forEach(([letter, substitutions]) => {
        substitutions.forEach(substitution => {
          triNode.addSub(substitution, letter);
        });
      });
      return triNode;
    };

    class Options {
      constructor(options = {}, customMatchers = {}) {
        this.matchers = {};
        this.l33tTable = l33tTable;
        this.trieNodeRoot = l33tTableToTrieNode(l33tTable, new TrieNode());
        this.dictionary = {
          userInputs: []
        };
        this.rankedDictionaries = {};
        this.rankedDictionariesMaxWordSize = {};
        this.translations = translationKeys;
        this.graphs = {};
        this.useLevenshteinDistance = false;
        this.levenshteinThreshold = 2;
        this.l33tMaxSubstitutions = 100;
        this.maxLength = 256;
        this.wordSequenceNames = ['cardinalNumbers', 'ordinalNumbers', 'daysOfWeek', 'months', 'seasons', 'timePeriods', 'rainbowColors', 'directions', 'intermediateDirections', 'sizeProgression', 'militaryAlphabet', 'planets', 'zodiacSigns', 'chineseZodiac'];
        this.timeEstimationValues = {
          scoring: {
            ...timeEstimationValuesDefaults.scoring
          },
          attackTime: {
            ...timeEstimationValuesDefaults.attackTime
          }
        };
        this.setOptions(options);
        Object.entries(customMatchers).forEach(([name, matcher]) => {
          this.addMatcher(name, matcher);
        });
      }
      isWordSequence(key) {
        return this.wordSequenceNames.some(name => key === name || key.startsWith(`${name}-`));
      }
      // eslint-disable-next-line max-statements,complexity
      setOptions(options = {}) {
        if (options.l33tTable) {
          this.l33tTable = options.l33tTable;
          this.trieNodeRoot = l33tTableToTrieNode(options.l33tTable, new TrieNode());
        }
        if (options.dictionary) {
          this.dictionary = options.dictionary;
          this.setRankedDictionaries();
        }
        if (options.translations) {
          this.setTranslations(options.translations);
        }
        if (options.graphs) {
          this.graphs = options.graphs;
        }
        if (options.useLevenshteinDistance !== undefined) {
          this.useLevenshteinDistance = options.useLevenshteinDistance;
        }
        if (options.levenshteinThreshold !== undefined) {
          this.levenshteinThreshold = options.levenshteinThreshold;
        }
        if (options.l33tMaxSubstitutions !== undefined) {
          this.l33tMaxSubstitutions = options.l33tMaxSubstitutions;
        }
        if (options.maxLength !== undefined) {
          this.maxLength = options.maxLength;
        }
        if (options.timeEstimationValues !== undefined) {
          checkTimeEstimationValues(options.timeEstimationValues);
          this.timeEstimationValues = {
            scoring: {
              ...options.timeEstimationValues.scoring
            },
            attackTime: {
              ...options.timeEstimationValues.attackTime
            }
          };
        }
      }
      setTranslations(translations) {
        if (this.checkCustomTranslations(translations)) {
          this.translations = translations;
        } else {
          throw new Error('Invalid translations object fallback to keys');
        }
      }
      checkCustomTranslations(translations) {
        let valid = true;
        Object.keys(translationKeys).forEach(type => {
          if (type in translations) {
            const translationType = type;
            Object.keys(translationKeys[translationType]).forEach(key => {
              if (!(key in translations[translationType])) {
                valid = false;
              }
              const translation = translations[translationType][key];
              if (typeof translation !== 'string' && typeof translation !== 'function') {
                valid = false;
              }
            });
          } else {
            valid = false;
          }
        });
        return valid;
      }
      setRankedDictionaries() {
        const rankedDictionaries = {};
        const rankedDictionariesMaxWorkSize = {};
        Object.keys(this.dictionary).forEach(name => {
          rankedDictionaries[name] = buildRankedDictionary(this.dictionary[name]);
          rankedDictionariesMaxWorkSize[name] = this.getRankedDictionariesMaxWordSize(this.dictionary[name]);
        });
        this.rankedDictionaries = rankedDictionaries;
        this.rankedDictionariesMaxWordSize = rankedDictionariesMaxWorkSize;
      }
      getRankedDictionariesMaxWordSize(list) {
        const data = list.map(el => {
          if (typeof el !== 'string') {
            return el.toString().length;
          }
          return el.length;
        });
        // do not use Math.max(...data) because it can result in max stack size error because every entry will be used as an argument
        if (data.length === 0) {
          return 0;
        }
        return data.reduce((a, b) => Math.max(a, b), -Infinity);
      }
      buildSanitizedRankedDictionary(list) {
        const sanitizedInputs = [];
        list.forEach(input => {
          const inputType = typeof input;
          if (inputType === 'string' || inputType === 'number' || inputType === 'boolean') {
            sanitizedInputs.push(input.toString().toLowerCase());
          }
        });
        return buildRankedDictionary(sanitizedInputs);
      }
      getUserInputsOptions(dictionary) {
        let rankedDictionary = {};
        let rankedDictionaryMaxWordSize = 0;
        if (dictionary) {
          rankedDictionary = this.buildSanitizedRankedDictionary(dictionary);
          rankedDictionaryMaxWordSize = this.getRankedDictionariesMaxWordSize(dictionary);
        }
        return {
          rankedDictionary,
          rankedDictionaryMaxWordSize
        };
      }
      addMatcher(name, matcher) {
        if (this.matchers[name]) {
          console.info(`Matcher ${name} already exists`);
        } else {
          this.matchers[name] = matcher;
        }
      }
    }

    /**
     * @link https://davidwalsh.name/javascript-debounce-function
     * @param func needs to implement a function which is debounced
     * @param wait how long do you want to wait till the previous declared function is executed
     * @param isImmediate defines if you want to execute the function on the first execution or the last execution inside the time window. `true` for first and `false` for last.
     */
    var debounce = (func, wait, isImmediate) => {
      let timeout;
      return function debounce(...args) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const context = this;
        const later = () => {
          timeout = undefined;
          if (!isImmediate) {
            func.apply(context, args);
          }
        };
        const shouldCallNow = isImmediate && !timeout;
        if (timeout !== undefined) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
        if (shouldCallNow) {
          func.apply(context, args);
          return;
        }
        return undefined;
      };
    };

    const time = () => new Date().getTime();
    class ZxcvbnFactory {
      constructor(options = {}, customMatchers = {}) {
        this.options = new Options(options, customMatchers);
        this.scoring = new Scoring(this.options);
        this.matching = new Matching(this.options);
        this.feedback = new Feedback(this.options);
        this.timeEstimates = new TimeEstimates(this.options);
      }
      estimateAttackTimes(guesses) {
        return this.timeEstimates.estimateAttackTimes(guesses);
      }
      getFeedback(score, sequence) {
        return this.feedback.getFeedback(score, sequence);
      }
      createReturnValue(resolvedMatches, password, start) {
        const matchSequence = this.scoring.mostGuessableMatchSequence(password, resolvedMatches);
        const calcTime = time() - start;
        const attackTimes = this.estimateAttackTimes(matchSequence.guesses);
        return {
          calcTime,
          ...matchSequence,
          ...attackTimes,
          feedback: this.getFeedback(attackTimes.score, matchSequence.sequence)
        };
      }
      main(password, userInputs) {
        const userInputsOptions = this.options.getUserInputsOptions(userInputs);
        return this.matching.match(password, userInputsOptions);
      }
      check(password, userInputs) {
        const reducedPassword = password.substring(0, this.options.maxLength);
        const start = time();
        const matches = this.main(reducedPassword, userInputs);
        if (matches instanceof Promise) {
          throw new Error('You are using a Promised matcher, please use `zxcvbnAsync` for it.');
        }
        return this.createReturnValue(matches, reducedPassword, start);
      }
      async checkAsync(password, userInputs) {
        const reducedPassword = password.substring(0, this.options.maxLength);
        const start = time();
        const matches = await this.main(reducedPassword, userInputs);
        return this.createReturnValue(matches, reducedPassword, start);
      }
    }

    exports.MatcherBaseClass = MatcherBaseClass;
    exports.Options = Options;
    exports.ZxcvbnFactory = ZxcvbnFactory;
    exports.debounce = debounce;

    return exports;

})({});
//# sourceMappingURL=zxcvbn-ts.js.map
