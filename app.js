/* ============================================
   TALKING DUCK 🦆 - APP LOGIC
   ============================================ */

var themeToggle = document.getElementById('themeToggle');
var historyBtn = document.getElementById('historyBtn');
var historyOverlay = document.getElementById('historyOverlay');
var historyPanel = document.getElementById('historyPanel');
var historyClose = document.getElementById('historyClose');
var historyList = document.getElementById('historyList');
var historyFooter = document.getElementById('historyFooter');
var historyClearBtn = document.getElementById('historyClearBtn');
var fluentBtn = document.getElementById('fluentBtn');
var fluentDropdown = document.getElementById('fluentDropdown');
var fluentOptions = document.getElementById('fluentOptions');
var fromLangDisplay = document.getElementById('fromLangDisplay');
var toLang = document.getElementById('toLang');
var inputText = document.getElementById('inputText');
var translateBtn = document.getElementById('translateBtn');
var translatingText = document.getElementById('translatingText');
var translatedText = document.getElementById('translatedText');
var translatingLangName = document.getElementById('translatingLangName');
var translatedLangName = document.getElementById('translatedLangName');
var panelSwapBtn = document.getElementById('panelSwapBtn');
var helpOverlay = document.getElementById('helpOverlay');
var helpClose = document.getElementById('helpClose');
var emailOverlay = document.getElementById('emailOverlay');
var emailForm = document.getElementById('emailForm');
var emailInput = document.getElementById('emailInput');
var emailSkip = document.getElementById('emailSkip');
var roadmapBtn = document.getElementById('roadmapBtn');
var roadmapOverlay = document.getElementById('roadmapOverlay');
var roadmapClose = document.getElementById('roadmapClose');
var translatingSettingsBtn = document.getElementById('translatingSettingsBtn');
var translatingSettingsDropdown = document.getElementById('translatingSettingsDropdown');
var translatingDropdownTitle = document.getElementById('translatingDropdownTitle');
var translatingJpSettings = document.getElementById('translatingJpSettings');
var translatingNoSettings = document.getElementById('translatingNoSettings');
var translatingMainStyle = document.getElementById('translatingMainStyle');
var translatingSecondaryMode = document.getElementById('translatingSecondaryMode');
var translatingSecondaryStyleSection = document.getElementById('translatingSecondaryStyleSection');
var translatingSecondaryStyle = document.getElementById('translatingSecondaryStyle');
var translatedSettingsBtn = document.getElementById('translatedSettingsBtn');
var translatedSettingsDropdown = document.getElementById('translatedSettingsDropdown');
var translatedDropdownTitle = document.getElementById('translatedDropdownTitle');
var translatedJpSettings = document.getElementById('translatedJpSettings');
var translatedNoSettings = document.getElementById('translatedNoSettings');
var translatedMainStyle = document.getElementById('translatedMainStyle');
var translatedSecondaryMode = document.getElementById('translatedSecondaryMode');
var translatedSecondaryStyleSection = document.getElementById('translatedSecondaryStyleSection');
var translatedSecondaryStyle = document.getElementById('translatedSecondaryStyle');
var charCounter = document.getElementById('charCounter');
var copyTranslatingBtn = document.getElementById('copyTranslatingBtn');
var copyTranslatedBtn = document.getElementById('copyTranslatedBtn');
var lyricsToggleBtn = document.getElementById('lyricsToggleBtn');
var lyricsSearchBox = document.getElementById('lyricsSearchBox');
var artistInput = document.getElementById('artistInput');
var songInput = document.getElementById('songInput');
var lyricsSearchBtn = document.getElementById('lyricsSearchBtn');
var lyricsStatus = document.getElementById('lyricsStatus');

/* ============================================
   CONSTANTS & STATE
   ============================================ */

var CHAR_LIMIT = 1000;

var langNames = { 'en': 'English', 'fr': 'French', 'ja': 'Japanese' };
var langFlags = { 'en': '🇬🇧', 'fr': '🇫🇷', 'ja': '🇯🇵' };
var allLanguages = ['en', 'fr', 'ja'];

var langCodeMap = {
    'en': 'en',
    'fr': 'fr',
    'ja': 'ja',
    'jp': 'ja'
};

var state = {
    fluentLang: 'en',
    learningLang: 'fr',
    panelsSwapped: false,
    jpMainStyle: 'kanji',
    jpSecondaryMode: 'off',
    jpSecondaryStyle: 'romaji',
    lastOriginal: '',
    lastTranslated: '',
    lastFromLang: '',
    lastToLang: ''
};

function getTranslatingLang() {
    return state.panelsSwapped ? state.learningLang : state.fluentLang;
}
function getTranslatedLang() {
    return state.panelsSwapped ? state.fluentLang : state.learningLang;
}

/* ============================================
   THEME
   ============================================ */

themeToggle.addEventListener('click', function() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
});

var savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
}

/* ============================================
   DROPDOWNS
   ============================================ */

function closeAllDropdowns() {
    fluentDropdown.classList.remove('open');
    translatingSettingsDropdown.classList.remove('open');
    translatedSettingsDropdown.classList.remove('open');
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.header-btn-wrapper') && !e.target.closest('.panel-settings-wrapper')) {
        closeAllDropdowns();
    }
});

fluentBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    var wasOpen = fluentDropdown.classList.contains('open');
    closeAllDropdowns();
    if (!wasOpen) fluentDropdown.classList.add('open');
});

fluentOptions.querySelectorAll('.style-option').forEach(function(btn) {
    btn.addEventListener('click', function() {
        fluentOptions.querySelectorAll('.style-option').forEach(function(b) {
            b.classList.remove('active');
        });
        btn.classList.add('active');
        state.fluentLang = btn.dataset.value;
        state.panelsSwapped = false;
        rebuildLanguageSelector();
        clearTranslation();
        updatePanelDisplay();
    });
});

/* ============================================
   LANGUAGE SELECTOR
   ============================================ */

function rebuildLanguageSelector() {
    fromLangDisplay.textContent = langNames[state.fluentLang];
    var avail = allLanguages.filter(function(l) { return l !== state.fluentLang; });
    toLang.innerHTML = '';
    avail.forEach(function(l) {
        var o = document.createElement('option');
        o.value = l;
        o.textContent = langNames[l];
        toLang.appendChild(o);
    });
    if (avail.includes(state.learningLang)) {
        toLang.value = state.learningLang;
    } else {
        state.learningLang = avail[0];
        toLang.value = state.learningLang;
    }
}

toLang.addEventListener('change', function() {
    state.learningLang = toLang.value;
    state.panelsSwapped = false;
    clearTranslation();
    updatePanelDisplay();
});

/* ============================================
   PANEL SWAP
   ============================================ */

panelSwapBtn.addEventListener('click', function() {
    state.panelsSwapped = !state.panelsSwapped;
    updatePanelDisplay();
    if (state.lastOriginal && state.lastTranslated) {
        reRenderTranslation();
    }
});

/* ============================================
   PANEL DISPLAY UPDATE
   ============================================ */

function updatePanelDisplay() {
    var tL = getTranslatingLang();
    var dL = getTranslatedLang();

    translatingLangName.textContent = langNames[tL];
    translatedLangName.textContent = langNames[dL];
    translatingSettingsBtn.textContent = langFlags[tL];
    translatedSettingsBtn.textContent = langFlags[dL];
    translatingDropdownTitle.textContent = langNames[tL] + ' Display Settings';
    translatedDropdownTitle.textContent = langNames[dL] + ' Display Settings';

    if (tL === 'ja') {
        translatingJpSettings.style.display = 'block';
        translatingNoSettings.style.display = 'none';
    } else {
        translatingJpSettings.style.display = 'none';
        translatingNoSettings.style.display = 'block';
    }

    if (dL === 'ja') {
        translatedJpSettings.style.display = 'block';
        translatedNoSettings.style.display = 'none';
    } else {
        translatedJpSettings.style.display = 'none';
        translatedNoSettings.style.display = 'block';
    }
}

/* ============================================
   PANEL SETTINGS DROPDOWNS
   ============================================ */

translatingSettingsBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    var wasOpen = translatingSettingsDropdown.classList.contains('open');
    closeAllDropdowns();
    if (!wasOpen) translatingSettingsDropdown.classList.add('open');
});

translatedSettingsBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    var wasOpen = translatedSettingsDropdown.classList.contains('open');
    closeAllDropdowns();
    if (!wasOpen) translatedSettingsDropdown.classList.add('open');
});

/* ============================================
   JAPANESE DISPLAY SETTINGS
   ============================================ */

function setupJpSettingsButtons(mainEl, secModeEl) {
    mainEl.querySelectorAll('.style-option').forEach(function(btn) {
        btn.addEventListener('click', function() {
            [translatingMainStyle, translatedMainStyle].forEach(function(el) {
                el.querySelectorAll('.style-option').forEach(function(b) {
                    b.classList.toggle('active', b.dataset.value === btn.dataset.value);
                });
            });
            state.jpMainStyle = btn.dataset.value;
            updateAllSecondaryStyleOptions();
            reRenderTranslation();
        });
    });

    secModeEl.querySelectorAll('.style-option').forEach(function(btn) {
        btn.addEventListener('click', function() {
            [translatingSecondaryMode, translatedSecondaryMode].forEach(function(el) {
                el.querySelectorAll('.style-option').forEach(function(b) {
                    b.classList.toggle('active', b.dataset.value === btn.dataset.value);
                });
            });
            state.jpSecondaryMode = btn.dataset.value;
            if (state.jpSecondaryMode === 'off') {
                translatingSecondaryStyleSection.style.display = 'none';
                translatedSecondaryStyleSection.style.display = 'none';
            } else {
                updateAllSecondaryStyleOptions();
            }
            reRenderTranslation();
        });
    });
}

setupJpSettingsButtons(translatingMainStyle, translatingSecondaryMode);
setupJpSettingsButtons(translatedMainStyle, translatedSecondaryMode);

function updateAllSecondaryStyleOptions() {
    updateSecondaryStyleOptions(translatingSecondaryStyleSection, translatingSecondaryStyle);
    updateSecondaryStyleOptions(translatedSecondaryStyleSection, translatedSecondaryStyle);
}

function updateSecondaryStyleOptions(secEl, optEl) {
    var opts = [];
    if (state.jpMainStyle === 'kanji') {
        opts = [{ value: 'romaji', label: 'Romaji' }];
    } else if (state.jpMainStyle === 'hiragana') {
        opts = [{ value: 'romaji', label: 'Romaji' }, { value: 'kanji-only', label: 'Kanji only' }];
    } else if (state.jpMainStyle === 'romaji') {
        opts = [{ value: 'kanji', label: 'Kanji + Hiragana' }, { value: 'hiragana', label: 'Hiragana only' }, { value: 'kanji-only', label: 'Kanji only' }];
    }

    optEl.innerHTML = '';
    var hasMatch = false;

    opts.forEach(function(o) {
        var b = document.createElement('button');
        var isActive = o.value === state.jpSecondaryStyle;
        b.className = 'style-option' + (isActive ? ' active' : '');
        if (isActive) hasMatch = true;
        b.dataset.value = o.value;
        b.textContent = o.label;
        b.addEventListener('click', function() {
            [translatingSecondaryStyle, translatedSecondaryStyle].forEach(function(el) {
                el.querySelectorAll('.style-option').forEach(function(x) {
                    x.classList.toggle('active', x.dataset.value === b.dataset.value);
                });
            });
            state.jpSecondaryStyle = b.dataset.value;
            reRenderTranslation();
        });
        optEl.appendChild(b);
    });

    if (!hasMatch && opts.length > 0) {
        state.jpSecondaryStyle = opts[0].value;
        optEl.querySelector('.style-option').classList.add('active');
    }

    if (state.jpSecondaryMode !== 'off') {
        secEl.style.display = 'block';
    } else {
        secEl.style.display = 'none';
    }
}

/* ============================================
   CHARACTER COUNTER
   ============================================ */

function updateCharCounter() {
    var len = inputText.value.length;
    charCounter.textContent = len + ' / ' + CHAR_LIMIT;
    charCounter.classList.remove('warn', 'danger');
    if (len >= CHAR_LIMIT) {
        charCounter.classList.add('danger');
    } else if (len >= CHAR_LIMIT * 0.85) {
        charCounter.classList.add('warn');
    }
}

inputText.addEventListener('input', function() {
    inputText.style.height = 'auto';
    inputText.style.height = Math.min(inputText.scrollHeight, 300) + 'px';
    updateCharCounter();
});

/* ============================================
   COPY BUTTONS
   ============================================ */

function getPlainTextFromPanel(panelEl) {
    var clone = panelEl.cloneNode(true);
    var brs = clone.querySelectorAll('br');
    brs.forEach(function(br) { br.replaceWith('\n'); });
    return clone.innerText || clone.textContent;
}

function flashCopied(btn) {
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(function() {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
    }, 2000);
}

copyTranslatingBtn.addEventListener('click', function() {
    var panel = document.getElementById('translatingText');
    if (panel.querySelector('.empty-state')) return;
    var text = getPlainTextFromPanel(panel);
    navigator.clipboard.writeText(text).then(function() {
        flashCopied(copyTranslatingBtn);
    }).catch(function() {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        flashCopied(copyTranslatingBtn);
    });
});

copyTranslatedBtn.addEventListener('click', function() {
    var panel = document.getElementById('translatedText');
    if (panel.querySelector('.empty-state')) return;
    var text = getPlainTextFromPanel(panel);
    navigator.clipboard.writeText(text).then(function() {
        flashCopied(copyTranslatedBtn);
    }).catch(function() {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        flashCopied(copyTranslatedBtn);
    });
});

/* ============================================
   TRANSLATION API
   ============================================ */

/* ============================================
   TRANSLATION API — CHUNKED
   Splits text into chunks under 500 chars,
   translates each, stitches results together
   ============================================ */

var API_CHUNK_LIMIT = 490; /* Stay safely under the 500 char API limit */

/*
   Split text into chunks that are each under the limit.
   We try to split at paragraph breaks, then sentence
   endings, then spaces — never mid-word.
*/
function splitIntoChunks(text, limit) {
    var chunks = [];

    /* If it fits in one chunk, no splitting needed */
    if (text.length <= limit) {
        chunks.push(text);
        return chunks;
    }

    var remaining = text;

    while (remaining.length > 0) {

        /* If what's left fits, add it and stop */
        if (remaining.length <= limit) {
            chunks.push(remaining);
            break;
        }

        /* Try to cut at a paragraph break (double newline) */
        var cut = -1;
        var paraBreak = remaining.lastIndexOf('\n\n', limit);
        if (paraBreak > limit * 0.4) {
            cut = paraBreak + 2; /* Include the newlines in the chunk */
        }

        /* Try to cut at a single newline */
        if (cut === -1) {
            var lineBreak = remaining.lastIndexOf('\n', limit);
            if (lineBreak > limit * 0.4) {
                cut = lineBreak + 1;
            }
        }

        /* Try to cut at a sentence end (. ! ?) */
        if (cut === -1) {
            var sentenceEnd = -1;
            var punctuation = ['. ', '! ', '? ', '.\n', '!\n', '?\n'];
            for (var p = 0; p < punctuation.length; p++) {
                var idx = remaining.lastIndexOf(punctuation[p], limit);
                if (idx > sentenceEnd && idx > limit * 0.4) {
                    sentenceEnd = idx + 1; /* Cut after the punctuation */
                }
            }
            if (sentenceEnd > -1) {
                cut = sentenceEnd + 1;
            }
        }

        /* Fall back to cutting at a space */
        if (cut === -1) {
            var spaceBreak = remaining.lastIndexOf(' ', limit);
            if (spaceBreak > limit * 0.4) {
                cut = spaceBreak + 1;
            }
        }

        /* Last resort — hard cut at the limit */
        if (cut === -1 || cut === 0) {
            cut = limit;
        }

        chunks.push(remaining.substring(0, cut));
        remaining = remaining.substring(cut);
    }

    return chunks;
}

/*
   Translate a single chunk via the MyMemory API
*/
function translateChunk(text, src, tgt) {
    var url = 'https://api.mymemory.translated.net/get?q='
        + encodeURIComponent(text)
        + '&langpair=' + src + '|' + tgt;

    return fetch(url)
        .then(function(r) { return r.json(); })
        .then(function(d) {
            if (d.responseStatus === 200) {
                return d.responseData.translatedText;
            } else {
                console.error('🦆 Chunk API error:', d.responseDetails);
                throw new Error('API error: ' + d.responseDetails);
            }
        });
}

/*
   Translate chunks one at a time (sequential, not parallel)
   so we don't hammer the API and trigger rate limiting.
   Returns a Promise that resolves to the full translated text.
*/
function translateChunksSequentially(chunks, src, tgt, index, results) {
    if (index >= chunks.length) {
        /* All done — join results */
        return Promise.resolve(results.join(' '));
    }

    console.log('🦆 Translating chunk ' + (index + 1) + ' of ' + chunks.length
        + ' (' + chunks[index].length + ' chars)');

    /* Update the button to show progress */
    translateBtn.textContent = 'Translating ' + (index + 1) + '/' + chunks.length + '... 🦆';

    return translateChunk(chunks[index], src, tgt)
        .then(function(translated) {
            results.push(translated);
            /* Small delay between chunks to be kind to the free API */
            return new Promise(function(resolve) {
                setTimeout(resolve, 300);
            });
        })
        .then(function() {
            return translateChunksSequentially(chunks, src, tgt, index + 1, results);
        })
        .catch(function(err) {
            console.error('🦆 Chunk ' + (index + 1) + ' failed:', err.message);
            /* Push empty string so other chunks still work */
            results.push('[translation error]');
            return translateChunksSequentially(chunks, src, tgt, index + 1, results);
        });
}

/*
   Main translate function — handles everything
*/
function translateText(text, src, tgt) {
    /* Safety check */
    if (src === tgt) {
        console.warn('🦆 Skipping — same language:', src);
        return Promise.resolve(null);
    }

    console.log('🦆 Translating: ' + src + ' → ' + tgt + ' (' + text.length + ' chars total)');

    var chunks = splitIntoChunks(text, API_CHUNK_LIMIT);
    console.log('🦆 Split into ' + chunks.length + ' chunk(s)');

    return translateChunksSequentially(chunks, src, tgt, 0, [])
        .catch(function(err) {
            console.error('🦆 Translation failed:', err.message);
            return null;
        });
}

/* ============================================
   LANGUAGE DETECTION
   ============================================ */

function detectLanguage(text) {
    var sample = text.substring(0, 200);
    var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q='
        + encodeURIComponent(sample);

    return fetch(url)
        .then(function(r) { return r.json(); })
        .then(function(d) {
            if (d && d[2]) {
                console.log('🦆 Detected language:', d[2]);
                return d[2];
            }
            return null;
        })
        .catch(function(err) {
            console.warn('🦆 Language detection failed:', err.message);
            return null;
        });
}

function setLanguagesFromDetected(detectedCode) {
    var mapped = langCodeMap[detectedCode];

    if (!mapped) {
        console.log('🦆 Detected language not supported:', detectedCode);
        return false;
    }

    console.log('🦆 Mapped detected language to:', mapped);

    if (mapped === state.fluentLang) {
        /*
           Song is in the user's fluent language
           Normal direction — no swap needed
        */
        state.panelsSwapped = false;
        rebuildLanguageSelector();
        updatePanelDisplay();
        return true;
    }

    if (allLanguages.includes(mapped)) {
        /*
           Song is in a supported language that isn't the
           fluent language — put it on the LEFT (translating side)
           and fluent language on the RIGHT (translated side)
        */
        if (mapped !== state.learningLang) {
            state.learningLang = mapped;
        }
        state.panelsSwapped = true;
        fluentOptions.querySelectorAll('.style-option').forEach(function(b) {
            b.classList.toggle('active', b.dataset.value === state.fluentLang);
        });
        rebuildLanguageSelector();
        updatePanelDisplay();
        return true;
    }

    return false;
}

/* ============================================
   WORD WRAPPING
   ============================================ */

function wrapWords(text, pid) {
    var words = text.split(/(\s+)/);
    var html = '';
    var wi = 0;
    words.forEach(function(w) {
        if (w.trim() === '') {
            html += w.replace(/\n/g, '<br>');
        } else {
            html += '<span class="word" data-panel="' + pid + '" data-index="' + wi + '">' + w + '</span>';
            wi++;
        }
    });
    return html;
}

function wrapJapaneseWords(text, pid) {
    var words = text.split(/(\s+)/);
    var html = '';
    var wi = 0;
    words.forEach(function(w) {
        if (w.trim() === '') {
            html += w.replace(/\n/g, '<br>');
        } else {
            var sc = getSecondaryClass();
            if (state.jpSecondaryMode === 'off') {
                html += '<span class="jp-word word" data-panel="' + pid + '" data-index="' + wi + '"><span class="main">' + w + '</span></span>';
            } else {
                html += '<span class="jp-word word" data-panel="' + pid + '" data-index="' + wi + '"><span class="secondary ' + sc + '">' + w + '</span><span class="main">' + w + '</span></span>';
            }
            wi++;
        }
    });
    return html;
}

function getSecondaryClass() {
    if (state.jpSecondaryMode === 'always') return '';
    if (state.jpSecondaryMode === 'click') return 'click-reveal';
    return 'hidden';
}

/* ============================================
   RENDER TRANSLATION
   ============================================ */

function renderTranslation(orig, trans, fLang, tLang) {
    var tContent, dContent, tL, dL;
    if (state.panelsSwapped) {
        tContent = trans; dContent = orig; tL = tLang; dL = fLang;
    } else {
        tContent = orig; dContent = trans; tL = fLang; dL = tLang;
    }
    if (tL === 'ja') {
        translatingText.innerHTML = wrapJapaneseWords(tContent, 'translating');
    } else {
        translatingText.innerHTML = wrapWords(tContent, 'translating');
    }
    if (dL === 'ja') {
        translatedText.innerHTML = wrapJapaneseWords(dContent, 'translated');
    } else {
        translatedText.innerHTML = wrapWords(dContent, 'translated');
    }
    setupHighlighting();
    setupClickReveal();
}

function reRenderTranslation() {
    if (state.lastOriginal && state.lastTranslated) {
        renderTranslation(state.lastOriginal, state.lastTranslated, state.lastFromLang, state.lastToLang);
    }
}

function clearTranslation() {
    translatingText.innerHTML = '<p class="empty-state">Your text will appear here...</p>';
    translatedText.innerHTML = '<p class="empty-state">Translation will appear here...</p>';
    state.lastOriginal = '';
    state.lastTranslated = '';
    state.lastFromLang = '';
    state.lastToLang = '';
}

/* ============================================
   WORD HIGHLIGHTING
   ============================================ */

function setupHighlighting() {
    var tW = document.querySelectorAll('.word[data-panel="translating"]');
    var dW = document.querySelectorAll('.word[data-panel="translated"]');

    function clearHighlights() {
        document.querySelectorAll('.word').forEach(function(w) {
            w.classList.remove('highlighted');
        });
    }

    tW.forEach(function(word) {
        word.addEventListener('mouseenter', function() {
            clearHighlights();
            var i = word.getAttribute('data-index');
            word.classList.add('highlighted');
            var match = document.querySelector('.word[data-panel="translated"][data-index="' + i + '"]');
            if (match) match.classList.add('highlighted');
        });
        word.addEventListener('mouseleave', function() {
            clearHighlights();
        });
    });

    dW.forEach(function(word) {
        word.addEventListener('mouseenter', function() {
            clearHighlights();
            var i = word.getAttribute('data-index');
            word.classList.add('highlighted');
            var match = document.querySelector('.word[data-panel="translating"][data-index="' + i + '"]');
            if (match) match.classList.add('highlighted');
        });
        word.addEventListener('mouseleave', function() {
            clearHighlights();
        });
    });
}

function setupClickReveal() {
    document.querySelectorAll('.jp-word').forEach(function(w) {
        w.addEventListener('click', function() {
            var s = w.querySelector('.secondary.click-reveal');
            if (s) s.classList.toggle('revealed');
        });
    });
}

/* ============================================
   TRANSLATE BUTTON
   ============================================ */

function runTranslation() {
    var text = inputText.value.trim();
    if (!text) {
        inputText.style.borderColor = '#ff3b30';
        setTimeout(function() { inputText.style.borderColor = ''; }, 2000);
        return;
    }
    if (text.length > CHAR_LIMIT) {
        inputText.style.borderColor = '#ff3b30';
        setTimeout(function() { inputText.style.borderColor = ''; }, 2000);
        return;
    }

    var from = getTranslatingLang();
    var to = getTranslatedLang();

    console.log('🦆 Running translation: from=' + from + ' to=' + to);

    if (from === to) {
        showLyricsStatus('⚠️ Both panels show the same language. Please check your language settings.', 'error');
        return;
    }

    translateBtn.textContent = 'Translating... 🦆';
    translateBtn.disabled = true;

    translateText(text, from, to).then(function(translated) {
        if (translated) {
            state.lastOriginal = text;
            state.lastTranslated = translated;
            state.lastFromLang = from;
            state.lastToLang = to;
            renderTranslation(text, translated, from, to);
            saveToHistory(text, translated, from, to);
        } else {
            showLyricsStatus('❌ Translation failed. The API may be rate-limited. Try again in a moment.', 'error');
        }
        translateBtn.textContent = 'Translate 🦆';
        translateBtn.disabled = false;
    });
}

translateBtn.addEventListener('click', function() {
    runTranslation();
});

/* ============================================
   HISTORY
   ============================================ */

function saveToHistory(orig, trans, from, to) {
    var h = JSON.parse(localStorage.getItem('duckHistory') || '[]');
    h.unshift({ original: orig, translated: trans, fromLang: from, toLang: to, date: new Date().toISOString() });
    if (h.length > 20) h = h.slice(0, 20);
    localStorage.setItem('duckHistory', JSON.stringify(h));
}

function getHistory() {
    return JSON.parse(localStorage.getItem('duckHistory') || '[]');
}

function clearHistoryData() {
    localStorage.removeItem('duckHistory');
    renderHistoryList();
}

function formatDate(iso) {
    var d = new Date(iso);
    var now = new Date();
    var ms = now - d;
    var mins = Math.floor(ms / 60000);
    var hrs = Math.floor(ms / 3600000);
    var days = Math.floor(ms / 86400000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return mins + ' min ago';
    if (hrs < 24) return hrs + ' hour' + (hrs > 1 ? 's' : '') + ' ago';
    if (days < 7) return days + ' day' + (days > 1 ? 's' : '') + ' ago';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function escapeHtml(t) {
    var d = document.createElement('div');
    d.textContent = t;
    return d.innerHTML;
}

function renderHistoryList() {
    var h = getHistory();
    if (h.length === 0) {
        historyList.innerHTML = '<div class="history-empty"><div class="history-empty-icon">🦆</div><p class="history-empty-text">No translations yet.<br>Start translating to build your history!</p></div>';
        historyFooter.style.display = 'none';
        return;
    }
    historyFooter.style.display = 'block';
    historyList.innerHTML = '';
    h.forEach(function(item) {
        var div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = '<div class="history-item-langs"><span class="history-lang-badge">'
            + (langNames[item.fromLang] || item.fromLang)
            + '</span><span class="history-arrow">→</span><span class="history-lang-badge">'
            + (langNames[item.toLang] || item.toLang)
            + '</span></div><div class="history-item-text">'
            + escapeHtml(item.original)
            + '</div><div class="history-item-translation">'
            + escapeHtml(item.translated)
            + '</div><div class="history-item-date">'
            + formatDate(item.date)
            + '</div>';
        div.addEventListener('click', function() { loadHistoryItem(item); });
        historyList.appendChild(div);
    });
}

function loadHistoryItem(item) {
    state.fluentLang = item.fromLang;
    state.learningLang = item.toLang;
    state.panelsSwapped = false;
    fluentOptions.querySelectorAll('.style-option').forEach(function(b) {
        b.classList.toggle('active', b.dataset.value === state.fluentLang);
    });
    rebuildLanguageSelector();
    for (var i = 0; i < toLang.options.length; i++) {
        if (toLang.options[i].value === item.toLang) {
            toLang.value = item.toLang;
            state.learningLang = item.toLang;
            break;
        }
    }
    updatePanelDisplay();
    inputText.value = item.original;
    inputText.style.height = 'auto';
    inputText.style.height = Math.min(inputText.scrollHeight, 300) + 'px';
    updateCharCounter();
    state.lastOriginal = item.original;
    state.lastTranslated = item.translated;
    state.lastFromLang = item.fromLang;
    state.lastToLang = item.toLang;
    renderTranslation(item.original, item.translated, item.fromLang, item.toLang);
    closeHistory();
}

function openHistory() {
    renderHistoryList();
    historyOverlay.classList.add('open');
}

function closeHistory() {
    historyOverlay.classList.remove('open');
}

historyBtn.addEventListener('click', function() { openHistory(); });
historyClose.addEventListener('click', function() { closeHistory(); });
historyOverlay.addEventListener('click', function(e) { if (e.target === historyOverlay) closeHistory(); });
historyClearBtn.addEventListener('click', function() { if (confirm('Clear all translation history?')) clearHistoryData(); });

/* ============================================
   EMAIL POPUP
   ============================================ */

function showEmailPopup() {
    if (!localStorage.getItem('duckEmailSeen')) {
        setTimeout(function() { emailOverlay.style.display = 'flex'; }, 1500);
    }
}

function closeEmailPopup() {
    emailOverlay.style.display = 'none';
    localStorage.setItem('duckEmailSeen', 'true');
}

function showEmailSuccess() {
    var p = document.querySelector('.email-popup');
    p.innerHTML = '<div class="email-success"><div class="email-success-icon">🎉</div><h2 class="email-title">You\'re on the list!</h2><p class="email-success-sub">We\'ll let you know when new languages and features drop.</p></div>';
    setTimeout(function() { closeEmailPopup(); }, 2500);
}

emailForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var email = emailInput.value.trim();
    if (email) {
        var emails = JSON.parse(localStorage.getItem('duckEmails') || '[]');
        emails.push({ email: email, date: new Date().toISOString() });
        localStorage.setItem('duckEmails', JSON.stringify(emails));
        localStorage.setItem('duckEmailSeen', 'true');
        showEmailSuccess();
    }
});

emailSkip.addEventListener('click', function() { closeEmailPopup(); });
emailOverlay.addEventListener('click', function(e) { if (e.target === emailOverlay) closeEmailPopup(); });

/* ============================================
   ROADMAP
   ============================================ */

roadmapBtn.addEventListener('click', function() { roadmapOverlay.style.display = 'flex'; });
roadmapClose.addEventListener('click', function() { roadmapOverlay.style.display = 'none'; });
roadmapOverlay.addEventListener('click', function(e) { if (e.target === roadmapOverlay) roadmapOverlay.style.display = 'none'; });

/* ============================================
   HELP / KEYBOARD SHORTCUTS
   ============================================ */

function toggleHelp() {
    if (helpOverlay.style.display === 'none' || helpOverlay.style.display === '') {
        helpOverlay.style.display = 'flex';
    } else {
        helpOverlay.style.display = 'none';
    }
}

helpClose.addEventListener('click', function() { helpOverlay.style.display = 'none'; });
helpOverlay.addEventListener('click', function(e) { if (e.target === helpOverlay) helpOverlay.style.display = 'none'; });

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        runTranslation();
        return;
    }
    if (document.activeElement === inputText) return;
    if (e.altKey && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        toggleHelp();
        return;
    }
    var hasJp = state.fluentLang === 'ja' || state.learningLang === 'ja';
    if (e.altKey && hasJp) {
        if (e.key === '1') { e.preventDefault(); cycleMainStyle(); return; }
        if (e.key === '2') { e.preventDefault(); cycleSecondaryMode(); return; }
        if (e.key === '3') { e.preventDefault(); toggleSecondaryOnOff(); return; }
    }
});

/* ============================================
   JAPANESE KEYBOARD SHORTCUTS
   ============================================ */

function cycleMainStyle() {
    var s = ['kanji', 'hiragana', 'romaji'];
    state.jpMainStyle = s[(s.indexOf(state.jpMainStyle) + 1) % s.length];
    [translatingMainStyle, translatedMainStyle].forEach(function(el) {
        el.querySelectorAll('.style-option').forEach(function(b) {
            b.classList.toggle('active', b.dataset.value === state.jpMainStyle);
        });
    });
    updateAllSecondaryStyleOptions();
    reRenderTranslation();
}

function cycleSecondaryMode() {
    var m = ['off', 'always', 'click'];
    state.jpSecondaryMode = m[(m.indexOf(state.jpSecondaryMode) + 1) % m.length];
    [translatingSecondaryMode, translatedSecondaryMode].forEach(function(el) {
        el.querySelectorAll('.style-option').forEach(function(b) {
            b.classList.toggle('active', b.dataset.value === state.jpSecondaryMode);
        });
    });
    if (state.jpSecondaryMode === 'off') {
        translatingSecondaryStyleSection.style.display = 'none';
        translatedSecondaryStyleSection.style.display = 'none';
    } else {
        updateAllSecondaryStyleOptions();
    }
    reRenderTranslation();
}

function toggleSecondaryOnOff() {
    state.jpSecondaryMode = state.jpSecondaryMode === 'off' ? 'always' : 'off';
    [translatingSecondaryMode, translatedSecondaryMode].forEach(function(el) {
        el.querySelectorAll('.style-option').forEach(function(b) {
            b.classList.toggle('active', b.dataset.value === state.jpSecondaryMode);
        });
    });
    if (state.jpSecondaryMode === 'off') {
        translatingSecondaryStyleSection.style.display = 'none';
        translatedSecondaryStyleSection.style.display = 'none';
    } else {
        updateAllSecondaryStyleOptions();
    }
    reRenderTranslation();
}

/* ============================================
   VERSION NUMBER
   ============================================ */

function getVersionFromSW() {
    if ('caches' in window) {
        caches.keys().then(function(names) {
            for (var i = 0; i < names.length; i++) {
                if (names[i].startsWith('talking-duck-v')) {
                    var version = names[i].replace('talking-duck-v', '');
                    var versionEl = document.querySelector('.version-number');
                    if (versionEl) versionEl.textContent = 'v' + version;
                    return;
                }
            }
        });
    }
}

/* ============================================
   LYRICS SEARCH
   ============================================ */

lyricsToggleBtn.addEventListener('click', function() {
    var isOpen = lyricsSearchBox.classList.contains('open');
    if (isOpen) {
        lyricsSearchBox.classList.remove('open');
        lyricsToggleBtn.classList.remove('active');
    } else {
        lyricsSearchBox.classList.add('open');
        lyricsToggleBtn.classList.add('active');
        artistInput.focus();
    }
});

artistInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); searchLyrics(); }
});

songInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); searchLyrics(); }
});

lyricsSearchBtn.addEventListener('click', function() {
    searchLyrics();
});

function showLyricsStatus(message, type) {
    lyricsStatus.textContent = message;
    lyricsStatus.className = 'lyrics-status ' + type;
    lyricsStatus.style.display = 'block';
}

function hideLyricsStatus() {
    lyricsStatus.style.display = 'none';
}

function cleanLyrics(text) {
    var lines = text.split('\n');
    var cleaned = [];
    var blankCount = 0;
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line === '') {
            blankCount++;
            if (blankCount <= 1) { cleaned.push(''); }
        } else {
            blankCount = 0;
            cleaned.push(line);
        }
    }
    while (cleaned.length > 0 && cleaned[0] === '') { cleaned.shift(); }
    while (cleaned.length > 0 && cleaned[cleaned.length - 1] === '') { cleaned.pop(); }
    return cleaned.join('\n');
}

function truncateLyrics(text, limit) {
    if (text.length <= limit) return text;
    var cut = text.lastIndexOf('\n', limit);
    if (cut < limit * 0.7) { cut = text.lastIndexOf(' ', limit); }
    if (cut < 1) cut = limit;
    return text.substring(0, cut);
}

function searchLyrics() {
    var artist = artistInput.value.trim();
    var song = songInput.value.trim();

    if (!artist) {
        artistInput.focus();
        artistInput.style.borderColor = '#ff3b30';
        setTimeout(function() { artistInput.style.borderColor = ''; }, 2000);
        showLyricsStatus('Please enter an artist name.', 'error');
        return;
    }
    if (!song) {
        songInput.focus();
        songInput.style.borderColor = '#ff3b30';
        setTimeout(function() { songInput.style.borderColor = ''; }, 2000);
        showLyricsStatus('Please enter a song title.', 'error');
        return;
    }

    lyricsSearchBtn.disabled = true;
    lyricsSearchBtn.textContent = 'Searching...';
    showLyricsStatus('🔍 Searching for "' + song + '" by ' + artist + '...', 'loading');

    var url = 'https://api.lyrics.ovh/v1/'
        + encodeURIComponent(artist) + '/'
        + encodeURIComponent(song);

    fetch(url)
        .then(function(response) {
            if (!response.ok) { throw new Error('not found'); }
            return response.json();
        })
        .then(function(data) {
            if (!data.lyrics || data.lyrics.trim() === '') {
                throw new Error('empty');
            }

            var lyrics = cleanLyrics(data.lyrics);
            var wasTruncated = lyrics.length > CHAR_LIMIT;
            if (wasTruncated) {
                lyrics = truncateLyrics(lyrics, CHAR_LIMIT);
            }

            /* Fill textarea */
            inputText.value = lyrics;
            inputText.style.height = 'auto';
            inputText.style.height = Math.min(inputText.scrollHeight, 300) + 'px';
            updateCharCounter();
            clearTranslation();

            showLyricsStatus('🔍 Detecting song language...', 'loading');

            /* Detect language then translate */
            detectLanguage(lyrics).then(function(detectedCode) {
                var detectedName = null;
                var languageWasSet = false;

                if (detectedCode) {
                    var mappedCode = langCodeMap[detectedCode];
                    if (mappedCode) {
                        detectedName = langNames[mappedCode];
                    }
                    languageWasSet = setLanguagesFromDetected(detectedCode);
                }

                /* Build status message */
                var msg = '';
                if (wasTruncated) {
                    msg += '✅ Lyrics loaded (truncated to ' + CHAR_LIMIT + ' chars). ';
                } else {
                    msg += '✅ "' + song + '" by ' + artist + ' loaded! ';
                }
                if (detectedName && languageWasSet) {
                    msg += 'Detected language: ' + detectedName + '. ';
                }
                msg += 'Translating now...';
                showLyricsStatus(msg, 'success');

                inputText.scrollIntoView({ behavior: 'smooth', block: 'center' });

                /*
                   Small delay to make sure state has fully
                   updated before running the translation
                */
                setTimeout(function() {
                    runTranslation();
                }, 300);
            });
        })
        .catch(function(err) {
            if (err.message === 'empty') {
                showLyricsStatus('⚠️ Song found but lyrics were empty. Try a different spelling.', 'error');
            } else {
                showLyricsStatus('❌ Lyrics not found. Check the spelling or try a different song.', 'error');
            }
        })
        .finally(function() {
            lyricsSearchBtn.disabled = false;
            lyricsSearchBtn.textContent = 'Search 🎵';
        });
}

/* ============================================
   INIT
   ============================================ */

function init() {
    rebuildLanguageSelector();
    updatePanelDisplay();
    updateAllSecondaryStyleOptions();
    updateCharCounter();
    showEmailPopup();
    getVersionFromSW();
    console.log('🦆 Talking Duck is ready! Quack quack!');
}

init();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(r) {
            console.log('🦆 SW registered:', r.scope);
            getVersionFromSW();
        }).catch(function(e) {
            console.log('🦆 SW failed:', e);
        });
    });
}