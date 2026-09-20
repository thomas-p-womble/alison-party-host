/* Alison Party Host — party ASAP + in-app YouTube player */
(function () {
  'use strict';

  const STORAGE_KEY = 'alison-party-v1';

  /* youtubeId: prefer Official Audio / Topic / lyric audio (verified oEmbed 2026-09-20) */
  /* localKey: optional same-folder filename stem for purchased tracks */
  const PLAYLIST = [
    { id: 1, title: "Choosin' Texas", artist: 'Ella Langley', youtubeId: 'xukbqwRuN5w', localKey: '01-choosing-texas' },
    { id: 2, title: 'You Belong With Me', artist: 'Taylor Swift', youtubeId: 'uD8d1KrDQcY', localKey: '02-you-belong-with-me' },
    { id: 3, title: 'Sweet Caroline', artist: 'Neil Diamond', youtubeId: '4F_RCWVoL4s', localKey: '03-sweet-caroline' },
    { id: 4, title: 'Eye of the Tiger', artist: 'Survivor', youtubeId: 'S-LO6dctBms', localKey: '04-eye-of-the-tiger' },
    { id: 5, title: "Don't Stop Believin'", artist: 'Journey', youtubeId: '1k8craCGpgs', localKey: '05-dont-stop-believin' },
    { id: 6, title: '22', artist: 'Taylor Swift', youtubeId: 'xGWTv4IQ7vQ', localKey: '06-22' },
    { id: 7, title: 'Roar', artist: 'Katy Perry', youtubeId: '9VcDnWMOBtw', localKey: '07-roar' },
    { id: 8, title: 'Party in the USA', artist: 'Miley Cyrus', youtubeId: 'R1kOdTm9FBk', localKey: '08-party-in-the-usa' },
    { id: 9, title: 'Shake It Off', artist: 'Taylor Swift', youtubeId: 'H59xVMF4zxE', localKey: '09-shake-it-off' }
  ];

  /* Hot Potato / Prize Pass — separate tween playlist (NOT Music Game nine). Prefer Topic / Official Audio. */
  const POTATO_PLAYLIST = [
    { id: 'p1', title: 'Espresso', artist: 'Sabrina Carpenter', youtubeId: '51zjlMhdSTE', startBias: [20, 55] },
    { id: 'p2', title: 'HOT TO GO!', artist: 'Chappell Roan', youtubeId: 'GJAt8bqW00E', startBias: [15, 50] },
    { id: 'p3', title: 'APT.', artist: 'ROSÉ & Bruno Mars', youtubeId: '8Ebqe2Dbzls', startBias: [20, 55] },
    { id: 'p4', title: 'Birds of a Feather', artist: 'Billie Eilish', youtubeId: 'd5gf9dXbPi0', startBias: [25, 60] },
    { id: 'p5', title: 'Dance the Night', artist: 'Dua Lipa', youtubeId: 'OiC1rgCPmUQ', startBias: [20, 55] },
    { id: 'p6', title: 'Levitating', artist: 'Dua Lipa', youtubeId: 'OsfAnsMY21M', startBias: [25, 60] },
    { id: 'p7', title: 'Sunroof', artist: 'Nicky Youre / dazy', youtubeId: 'eZCWyFNV_ZM', startBias: [20, 50] },
    { id: 'p8', title: 'Dynamite', artist: 'BTS', youtubeId: 'NvK9APEhcdk', startBias: [15, 50] },
    { id: 'p9', title: 'As It Was', artist: 'Harry Styles', youtubeId: 'wa5gkHMqbls', startBias: [20, 55] },
    { id: 'p10', title: 'Cruel Summer', artist: 'Taylor Swift', youtubeId: 'ic8j13piAhQ', startBias: [25, 60] },
    { id: 'p11', title: 'Flowers', artist: 'Miley Cyrus', youtubeId: 'BkSSOGNeWTM', startBias: [20, 55] },
    { id: 'p12', title: 'What Makes You Beautiful', artist: 'One Direction', youtubeId: 'd57qSDCxVA4', startBias: [20, 50] }
  ];

  /* Freeze Dance — separate tween playlist (NOT Music Game nine, NOT potato twelve). Prefer Topic / Official Audio. */
  /* youtubeIds oEmbed-verified 2026-09-20 */
  const FREEZE_PLAYLIST = [
    { id: 'f1', title: 'Anti-Hero', artist: 'Taylor Swift', youtubeId: 'b1kbLwvqugk', startBias: [25, 55] },
    { id: 'f2', title: 'Blank Space', artist: 'Taylor Swift', youtubeId: 'e-ORhEE9VVg', startBias: [20, 50] },
    { id: 'f3', title: 'Style', artist: 'Taylor Swift', youtubeId: '-CmadmM5cOk', startBias: [20, 55] },
    { id: 'f4', title: 'Butter', artist: 'BTS', youtubeId: 'WMweEpGlu_U', startBias: [15, 45] },
    { id: 'f5', title: 'Uptown Funk', artist: 'Mark Ronson / Bruno Mars', youtubeId: 'OPf0YbXqDm0', startBias: [20, 50] },
    { id: 'f6', title: "Can't Stop the Feeling!", artist: 'Justin Timberlake', youtubeId: 'ru0K8uYEZWw', startBias: [15, 45] },
    { id: 'f7', title: 'Happy', artist: 'Pharrell Williams', youtubeId: 'ZbZSe6N_BXs', startBias: [20, 55] },
    { id: 'f8', title: 'Treasure', artist: 'Bruno Mars', youtubeId: 'nPvuNsRccVw', startBias: [20, 50] },
    { id: 'f9', title: 'Watermelon Sugar', artist: 'Harry Styles', youtubeId: 'E07s5ZYygMg', startBias: [15, 45] },
    { id: 'f10', title: 'good 4 u', artist: 'Olivia Rodrigo', youtubeId: 'gNi_6U5Pm_o', startBias: [15, 40] },
    { id: 'f11', title: 'September', artist: 'Earth, Wind & Fire', youtubeId: 'Gs069dndIYk', startBias: [20, 55] },
    { id: 'f12', title: 'Shut Up and Dance', artist: 'WALK THE MOON', youtubeId: 'nbcCG7PkI18', startBias: [15, 45] }
  ];

  /* Host timing cards only — NO full copyrighted lyrics */
  /* startAt/muteAt/unmuteAt = seconds; startAt 0 = from beginning; catchiest shout/title hook only (~3–8s) */
  const LYRIC_CUES = {
    1: {
      play: 'Play from the start (verse → chorus)',
      mute: 'MUTE “choosin’ Texas” shout hook',
      kids: 'Kids shout “choosin’ Texas!” (~6s)',
      startAt: 0, muteAt: 70, unmuteAt: 76
    },
    2: {
      play: 'Play from the start',
      mute: 'MUTE “you belong with me” hook',
      kids: 'Kids finish “you belong with me” (~5s)',
      startAt: 0, muteAt: 61, unmuteAt: 66
    },
    3: {
      play: 'Play from the start',
      mute: 'MUTE “Sweet Caroline” title hook',
      kids: 'Kids shout “Sweet Caroline!” (~5s)',
      startAt: 0, muteAt: 63, unmuteAt: 68
    },
    4: {
      play: 'Play from the start (riff in)',
      mute: 'MUTE title line hook',
      kids: 'Kids belt “Eye of the Tiger!” (~6s)',
      startAt: 0, muteAt: 83, unmuteAt: 89
    },
    5: {
      play: 'Play from the start (long build)',
      mute: 'MUTE “don’t stop believin’” hook',
      kids: 'Kids finish “don’t stop believin’!” (~6s)',
      startAt: 0, muteAt: 203, unmuteAt: 209
    },
    6: {
      play: 'Play from the start',
      mute: 'MUTE “feeling 22” hook',
      kids: 'Kids shout “feeling 22!” (~5s)',
      startAt: 0, muteAt: 44, unmuteAt: 49
    },
    7: {
      play: 'Play from the start',
      mute: 'MUTE “hear me roar” hook',
      kids: 'Kids ROAR “hear me roar!” (~5s)',
      startAt: 0, muteAt: 55, unmuteAt: 60
    },
    8: {
      play: 'Play from the start',
      mute: 'MUTE “party in the USA” hook',
      kids: 'Kids finish “party in the USA!” (~6s)',
      startAt: 0, muteAt: 58, unmuteAt: 64
    },
    9: {
      play: 'Play from the start',
      mute: 'MUTE “shake it off” hook',
      kids: 'Kids shout “shake it off!” (~5s)',
      startAt: 0, muteAt: 52, unmuteAt: 57
    }
  };


  /* How Well Do You Know Alison? — open-ended; host/Alison judges live (no answer key) */
  const QUIZ_QUESTIONS = [
    { q: "What is Alison’s absolute favorite food?" },
    { q: "If Alison could only listen to one song or artist on repeat for the rest of her life, who or what would it be?" },
    { q: "What is her favorite color?" },
    { q: "What does Alison want to be when she grows up?" },
    {
      q: "What is the name of her favorite movie or TV show right now?",
      choices: ["Super Girl", "Yes Day", "27 Dresses"]
    },
    { q: "If she had a completely free afternoon, what is her favorite hobby or thing to do for fun?" },
    {
      q: "What is her go-to flavor when she gets ice cream?",
      choices: ["Sea Salt Caramel", "Strawberry", "Chocolate"]
    },
    { q: "Which subject is her favorite in school?" },
    { q: "What is her favorite holiday or time of the year?" },
    { q: "If Alison could magically have any pet in the world (real or imaginary), what would she choose?" }
  ];

  const DEFAULT_STATE = {
    nttScores: { A: 0, B: 0, C: 0 },
    nttIndex: 0,
    triviaScores: { A: 0, B: 0, C: 0 },
    triviaIndex: 0,
    freezeCount: 12,
    lyricIndex: 0,
    qmRoster: ['Alison 👑', 'Guest 1', 'Guest 2', 'Guest 3', 'Guest 4'],
    qmIndex: 0,
    musicIndex: 0
  };

  let state = loadState();
  let nttBuzzed = null;
  let wipeTimer = null;
  let potatoTimer = null;
  let potatoDeadline = 0;
  let potatoTick = null;
  let potatoMode = false;
  let potatoSong = null;
  let potatoOrder = [];
  let potatoOrderIdx = 0;
  let potatoSavedMusicIndex = null;
  let potatoRoundActive = false;
  let freezeMode = false;
  let freezeSong = null;
  let freezeOrder = [];
  let freezeOrderIdx = 0;
  let freezeSavedMusicIndex = null;
  let freezeIndex = 0;
  let timerSec = 60;
  let timerLeft = 60;
  let timerId = null;
  let timerRunning = false;

  /* —— Audio dock (hidden YouTube + optional local HTML5) —— */
  let ytPlayer = null;
  let musicReady = false;
  let musicMuted = false;
  let musicPlaying = false;
  let pendingPlay = false;
  /** @type {HTMLAudioElement|null} */
  let htmlAudio = null;
  /** song.id -> { url, name, source: 'file'|'folder' } */
  const localTracks = {};
  let usingLocal = false;

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(DEFAULT_STATE);
      return { ...structuredClone(DEFAULT_STATE), ...JSON.parse(raw) };
    } catch {
      return structuredClone(DEFAULT_STATE);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        nttScores: state.nttScores,
        nttIndex: state.nttIndex,
        triviaScores: state.triviaScores,
        triviaIndex: state.triviaIndex,
        freezeCount: state.freezeCount,
        lyricIndex: state.lyricIndex,
        qmRoster: state.qmRoster,
        qmIndex: state.qmIndex,
        musicIndex: state.musicIndex
      }));
    } catch (_) { /* ignore quota */ }
  }

  function structuredClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.add('hidden'), 2200);
  }

  function currentSong() {
    const i = ((state.musicIndex % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length;
    state.musicIndex = i;
    return PLAYLIST[i];
  }

  function activePlaybackSong() {
    if (potatoMode && potatoSong) return potatoSong;
    if (freezeMode && freezeSong) return freezeSong;
    return currentSong();
  }

  /** Random energetic offset (seconds) for potato/freeze mid-song starts. */
  function energeticStartSeconds(song) {
    if (song && Array.isArray(song.startBias) && song.startBias.length >= 2) {
      const lo = Number(song.startBias[0]);
      const hi = Number(song.startBias[1]);
      if (Number.isFinite(lo) && Number.isFinite(hi) && hi > lo) {
        return Math.round(lo + Math.random() * (hi - lo));
      }
    }
    if (song && typeof song.startBias === 'number' && song.startBias > 0) {
      return Math.round(song.startBias);
    }
    // Default: ~15–45% of a typical ~3:20 tween hit → ~20–60s, varies each round
    return Math.round(20 + Math.random() * 40);
  }

  function songLabel(song, index) {
    return (index + 1) + '. ' + song.title + (song.artist ? ' — ' + song.artist : '');
  }

  function updateMiniUI() {
    const song = activePlaybackSong();
    const titleEl = document.getElementById('mini-song-title');
    if (titleEl) {
      if (potatoMode && potatoSong) {
        titleEl.textContent = '🥔 ' + potatoSong.title + (potatoSong.artist ? ' — ' + potatoSong.artist : '');
      } else if (freezeMode && freezeSong) {
        titleEl.textContent = '❄️ ' + freezeSong.title + (freezeSong.artist ? ' — ' + freezeSong.artist : '');
      } else {
        const src = hasLocal(song) ? ' · local' : '';
        titleEl.textContent = songLabel(song, state.musicIndex) + src;
      }
    }

    const playBtn = document.getElementById('mini-play');
    if (playBtn) playBtn.textContent = musicPlaying ? '⏸' : '▶';

    const muteBtn = document.getElementById('mini-mute');
    if (muteBtn) {
      muteBtn.textContent = musicMuted ? '🔇' : '🔊';
      muteBtn.setAttribute('aria-label', musicMuted ? 'Unmute' : 'Mute');
    }
    updateLyricMuteUI();

    const badge = document.getElementById('audio-source-badge');
    if (badge) {
      badge.textContent = hasLocal(song) ? 'Local audio' : 'YouTube audio';
      badge.classList.toggle('local', !!hasLocal(song));
    }

    document.querySelectorAll('.playlist li').forEach((li) => {
      const idx = Number(li.dataset.index);
      li.classList.toggle('playing', idx === state.musicIndex);
      const s = PLAYLIST[idx];
      li.classList.toggle('has-local', !!(s && hasLocal(s)));
    });

    const localStatus = document.getElementById('local-audio-status');
    if (localStatus) {
      const n = Object.keys(localTracks).length;
      localStatus.textContent = n
        ? n + ' local track' + (n === 1 ? '' : 's') + ' loaded — preferred over YouTube'
        : 'Optional: load purchased MP3/M4A files (named like 01-choosing-texas.mp3)';
    }
  }

  function hasLocal(song) {
    return !!(song && localTracks[song.id] && localTracks[song.id].url);
  }

  function ensureHtmlAudio() {
    if (htmlAudio) return htmlAudio;
    htmlAudio = new Audio();
    htmlAudio.preload = 'auto';
    htmlAudio.addEventListener('play', () => { musicPlaying = true; updateMiniUI(); });
    htmlAudio.addEventListener('pause', () => {
      if (!htmlAudio || htmlAudio.ended) return;
      musicPlaying = false;
      updateMiniUI();
    });
    htmlAudio.addEventListener('ended', () => {
      musicPlaying = false;
      loadTrack(state.musicIndex + 1, true);
      musicPlay();
    });
    htmlAudio.addEventListener('error', () => {
      toast('Local file failed — trying YouTube');
      const song = currentSong();
      delete localTracks[song.id];
      usingLocal = false;
      updateMiniUI();
      if (musicReady && ytPlayer) musicPlay();
    });
    return htmlAudio;
  }

  function pauseHtmlAudio() {
    if (!htmlAudio) return;
    try { htmlAudio.pause(); } catch (_) {}
  }

  function pauseYouTube() {
    if (!ytPlayer || !musicReady) return;
    try { ytPlayer.pauseVideo(); } catch (_) {}
  }

  function stopAllForSwitch() {
    pauseHtmlAudio();
    pauseYouTube();
  }

  function matchLocalFile(fileName) {
    const base = String(fileName).replace(/\.[^.]+$/, '').toLowerCase();
    const num = base.match(/^0?(\d{1,2})/);
    if (num) {
      const n = Number(num[1]);
      if (n >= 1 && n <= PLAYLIST.length) return PLAYLIST[n - 1];
    }
    const slug = base.replace(/[^a-z0-9]+/g, '');
    for (const s of PLAYLIST) {
      const key = (s.localKey || '').replace(/[^a-z0-9]+/g, '');
      const titleSlug = s.title.toLowerCase().replace(/[^a-z0-9]+/g, '');
      if (slug.includes(key) || slug.includes(titleSlug) || key.includes(slug)) return s;
    }
    return null;
  }

  function setLocalTrack(song, url, name, source) {
    const prev = localTracks[song.id];
    if (prev && prev.url && prev.source === 'file' && prev.url.indexOf('blob:') === 0) {
      try { URL.revokeObjectURL(prev.url); } catch (_) {}
    }
    localTracks[song.id] = { url: url, name: name, source: source };
  }

  function handleLocalFiles(fileList) {
    const files = Array.from(fileList || []).filter((f) =>
      /\.(mp3|m4a|aac|wav|ogg|flac)$/i.test(f.name) || (f.type && f.type.indexOf('audio/') === 0)
    );
    if (!files.length) {
      toast('No audio files found');
      return;
    }
    let matched = 0;
    files.forEach((f) => {
      const song = matchLocalFile(f.name);
      if (!song) return;
      setLocalTrack(song, URL.createObjectURL(f), f.name, 'file');
      matched += 1;
    });
    updateMiniUI();
    renderPlaylist();
    toast(matched ? ('Loaded ' + matched + ' local track' + (matched === 1 ? '' : 's')) : 'Could not match filenames — use 01-choosing-texas.mp3 style');
  }

  function probeFolderLocals() {
    if (location.protocol === 'file:') return;
    PLAYLIST.forEach((song) => {
      if (hasLocal(song) || !song.localKey) return;
      const exts = ['.mp3', '.m4a', '.aac'];
      (function tryNext(i) {
        if (i >= exts.length || hasLocal(song)) return;
        const path = './' + song.localKey + exts[i];
        fetch(path, { method: 'HEAD' }).then((r) => {
          if (r.ok) {
            setLocalTrack(song, path, song.localKey + exts[i], 'folder');
            updateMiniUI();
            renderPlaylist();
          } else tryNext(i + 1);
        }).catch(() => tryNext(i + 1));
      })(0);
    });
  }

  function ensurePlayer(thenPlay) {
    const song = currentSong();
    if (hasLocal(song)) return true;
    if (!musicReady || !ytPlayer) {
      if (thenPlay) pendingPlay = true;
      toast('Loading audio… tap Play again in a sec');
      return false;
    }
    return true;
  }

  function loadTrack(index, autoplay) {
    state.musicIndex = ((index % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length;
    saveState();
    updateMiniUI();
    const song = currentSong();

    if (hasLocal(song)) {
      usingLocal = true;
      pauseYouTube();
      const a = ensureHtmlAudio();
      a.src = localTracks[song.id].url;
      a.muted = musicMuted;
      a.currentTime = 0;
      if (autoplay) {
        pendingPlay = true;
        a.play().then(() => {
          musicPlaying = true;
          pendingPlay = false;
          updateMiniUI();
        }).catch(() => toast('Tap ▶ to play local audio'));
      } else {
        musicPlaying = false;
      }
      return;
    }

    usingLocal = false;
    pauseHtmlAudio();
    if (!musicReady || !ytPlayer) {
      if (autoplay) pendingPlay = true;
      return;
    }
    try {
      if (autoplay) {
        ytPlayer.loadVideoById({ videoId: song.youtubeId, startSeconds: 0 });
        pendingPlay = true;
      } else {
        ytPlayer.cueVideoById({ videoId: song.youtubeId, startSeconds: 0 });
      }
    } catch (e) {
      toast('Could not load track');
    }
  }

  function musicPlay() {
    const song = activePlaybackSong();
    if (!potatoMode && hasLocal(song)) {
      usingLocal = true;
      pauseYouTube();
      const a = ensureHtmlAudio();
      if (!a.src || a.src.indexOf(localTracks[song.id].url) === -1) {
        a.src = localTracks[song.id].url;
      }
      a.muted = musicMuted;
      a.play().then(() => {
        musicPlaying = true;
        updateMiniUI();
      }).catch(() => toast('Tap ▶ again to play'));
      return;
    }

    if (!musicReady || !ytPlayer) {
      pendingPlay = true;
      toast('Loading audio… tap Play again in a sec');
      return;
    }
    usingLocal = false;
    pauseHtmlAudio();
    try {
      const st = ytPlayer.getPlayerState();
      if (st === 0 || st === 5 || st === -1 || st === undefined) {
        ytPlayer.loadVideoById({ videoId: song.youtubeId, startSeconds: 0 });
      }
      ytPlayer.playVideo();
      if (musicMuted) ytPlayer.mute();
      else ytPlayer.unMute();
      musicPlaying = true;
      updateMiniUI();
    } catch (e) {
      toast('Play blocked — tap ▶ again');
    }
  }

  function musicPause() {
    pauseHtmlAudio();
    pauseYouTube();
    musicPlaying = false;
    updateMiniUI();
  }

  function musicTogglePlay() {
    if (musicPlaying) musicPause();
    else musicPlay();
  }

  function musicMute() {
    musicMuted = true;
    if (htmlAudio) {
      htmlAudio.muted = true;
      htmlAudio.volume = 0;
    }
    if (ytPlayer && musicReady) {
      try { ytPlayer.mute(); } catch (_) {}
      try {
        if (typeof ytPlayer.setVolume === 'function') ytPlayer.setVolume(0);
      } catch (_) {}
    }
    updateMiniUI();
  }

  function musicUnmute() {
    musicMuted = false;
    if (htmlAudio) {
      htmlAudio.muted = false;
      htmlAudio.volume = 1;
    }
    if (ytPlayer && musicReady) {
      try { ytPlayer.unMute(); } catch (_) {}
      try {
        if (typeof ytPlayer.setVolume === 'function') ytPlayer.setVolume(100);
      } catch (_) {}
    }
    updateMiniUI();
  }

  function musicToggleMute() {
    if (musicMuted) musicUnmute();
    else musicMute();
  }

  function updateLyricMuteUI() {
    const btn = document.getElementById('lyric-mute-toggle');
    const status = document.getElementById('lyric-mute-status');
    if (btn) {
      if (musicMuted) {
        btn.textContent = '🔊 UNMUTE';
        btn.classList.remove('is-unmuted');
        btn.classList.add('is-muted');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.textContent = '🔇 MUTE';
        btn.classList.remove('is-muted');
        btn.classList.add('is-unmuted');
        btn.setAttribute('aria-pressed', 'false');
      }
    }
    if (status) {
      status.textContent = musicMuted ? 'Muted — kids sing' : 'Playing';
      status.classList.toggle('is-muted', musicMuted);
    }
  }

  function lyricToggleMute() {
    if (musicMuted) {
      musicUnmute();
      updateLyricMuteUI();
      setCueHighlight('done');
      tryVibrate(30);
    } else {
      musicMute();
      updateLyricMuteUI();
      setCueHighlight('muted');
      tryVibrate(40);
    }
  }

  /** Instant press (pointerdown) — mute on DOWN, swallow follow-up click. */
  function bindInstantPress(el, handler) {
    if (!el) return;
    let suppressClick = false;
    const fire = (e) => {
      if (e.type === 'pointerdown' && e.button != null && e.button !== 0) return;
      e.preventDefault();
      if (typeof e.pointerId === 'number') {
        try { el.setPointerCapture(e.pointerId); } catch (_) {}
      }
      suppressClick = true;
      handler(e);
    };
    el.addEventListener('pointerdown', fire);
    // touchstart fallback when Pointer Events unavailable
    el.addEventListener('touchstart', (e) => {
      if (window.PointerEvent) return;
      e.preventDefault();
      suppressClick = true;
      handler(e);
    }, { passive: false });
    el.addEventListener('click', (e) => {
      if (suppressClick) {
        e.preventDefault();
        e.stopImmediatePropagation();
        suppressClick = false;
        return;
      }
      // keyboard / accessibility activation
      handler(e);
    });
  }

  function setCueHighlight(phase) {
    const steps = document.getElementById('lyric-steps');
    if (!steps) return;
    steps.querySelectorAll('.cue-step').forEach((el) => {
      el.classList.remove('active', 'flash');
    });
    let sel = null;
    if (phase === 'playing') sel = '.cue-step.play';
    else if (phase === 'muted') sel = '.cue-step.mute';
    else if (phase === 'done') sel = '.cue-step.kids';
    if (sel) {
      const el = steps.querySelector(sel);
      if (el) el.classList.add('active', 'flash');
    }
  }

  function musicNext(autoplay) {
    loadTrack(state.musicIndex + 1, autoplay !== false ? musicPlaying || autoplay === true : false);
    if (autoplay === true || musicPlaying) musicPlay();
  }

  function musicPrev(autoplay) {
    loadTrack(state.musicIndex - 1, autoplay !== false ? musicPlaying || autoplay === true : false);
    if (autoplay === true || musicPlaying) musicPlay();
  }

  function onPlayerReady() {
    musicReady = true;
    const song = currentSong();
    if (!hasLocal(song)) {
      try {
        ytPlayer.cueVideoById({ videoId: song.youtubeId });
        if (musicMuted) ytPlayer.mute();
      } catch (_) {}
    }
    updateMiniUI();
    if (pendingPlay) {
      pendingPlay = false;
      musicPlay();
    }
    const note = document.getElementById('yt-note');
    if (note) note.classList.add('hidden');
  }

  function onPlayerStateChange(ev) {
    if (usingLocal || hasLocal(currentSong())) return;
    const s = ev.data;
    musicPlaying = s === 1 || s === 3;
    updateMiniUI();
    if (s === 0) {
      loadTrack(state.musicIndex + 1, true);
      musicPlay();
    }
  }

  function onPlayerError() {
    toast('This track blocked — skip to next');
    setTimeout(() => {
      loadTrack(state.musicIndex + 1, true);
      musicPlay();
    }, 400);
  }

  function initYouTube() {
    if (location.protocol === 'file:') {
      const note = document.getElementById('yt-note');
      if (note) {
        note.classList.remove('hidden');
        note.textContent = '⚠️ YouTube audio needs HTTP — run a tiny local server (see README), or load your own song files below.';
      }
    }

    window.onYouTubeIframeAPIReady = function () {
      ytPlayer = new YT.Player('yt-player', {
        width: '1',
        height: '1',
        videoId: currentSong().youtubeId,
        playerVars: {
          playsinline: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          fs: 0,
          disablekb: 1,
          iv_load_policy: 3,
          origin: location.origin === 'null' ? undefined : location.origin
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
          onError: onPlayerError
        }
      });
    };

    if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady();
      return;
    }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    document.head.appendChild(tag);
  }

  function showView(id) {
    const leavingPotato = id !== 'potato' && potatoMode;
    if (leavingPotato) leavePotatoView();
    const leavingFreeze = id !== 'freeze' && freezeMode;
    if (leavingFreeze) leaveFreezeView();
    document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
    const view = document.getElementById('view-' + id);
    if (view) view.classList.add('active');
    window.scrollTo(0, 0);
    if (id === 'name-tune') renderNTT();
    if (id === 'lyrics') renderLyrics();
    if (id === 'freeze') {
      enterFreezeMode();
      renderFreeze();
    }
    if (id === 'quizmaster') renderQM();
    if (id === 'trivia') renderTrivia();
    if (id === 'timers') renderTimer();
    if (id === 'potato') {
      updatePotatoSongLabel();
      updatePotatoStartLabel();
    }
  }

  /* —— Home playlist —— */
  function renderPlaylist() {
    const ol = document.getElementById('playlist');
    ol.innerHTML = PLAYLIST.map((s, i) =>
      '<li data-index="' + i + '" class="' + (i === state.musicIndex ? 'playing' : '') + '">' +
      '<button type="button" class="playlist-play" data-index="' + i + '" aria-label="Play ' + escapeHtml(s.title) + '">▶</button>' +
      '<div class="playlist-text">' +
      '<span class="playlist-title">' + escapeHtml(s.title) + (hasLocal(s) ? ' <em class="local-tag">local</em>' : '') + '</span>' +
      '<span class="artist">' + escapeHtml(s.artist) + '</span>' +
      '</div></li>'
    ).join('');
    ol.querySelectorAll('.playlist-play, li').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = Number(el.dataset.index);
        if (Number.isNaN(idx)) return;
        const same = idx === state.musicIndex && musicPlaying;
        if (same) {
          musicPause();
        } else {
          loadTrack(idx, true);
          musicPlay();
        }
      });
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* —— Name That Tune —— */
  function renderNTT() {
    const song = PLAYLIST[state.nttIndex] || PLAYLIST[0];
    document.getElementById('ntt-song').textContent =
      (state.nttIndex + 1) + '. ' + song.title + (song.artist ? ' — ' + song.artist : '');
    const teams = document.getElementById('ntt-teams');
    teams.innerHTML = ['A', 'B', 'C'].map((t) => teamRowHTML('ntt', t, state.nttScores[t])).join('');
    bindTeamButtons('ntt', state.nttScores, () => {
      saveState();
      renderNTT();
    });
    if (nttBuzzed) {
      const br = document.getElementById('ntt-buzzed');
      br.textContent = 'Team ' + nttBuzzed + ' buzzed!';
      br.classList.remove('hidden');
    }
  }

  function teamRowHTML(prefix, team, score) {
    return (
      '<div class="team-row" data-team="' + team + '">' +
      '<span class="team-name">Team ' + team + '</span>' +
      '<button type="button" class="btn circle" data-act="minus" data-team="' + team + '" aria-label="Minus">−</button>' +
      '<span class="team-score">' + score + '</span>' +
      '<button type="button" class="btn circle" data-act="plus" data-team="' + team + '" aria-label="Plus">+</button>' +
      '</div>'
    );
  }

  function bindTeamButtons(prefix, scoresObj, onChange) {
    const root = document.getElementById(prefix === 'ntt' ? 'ntt-teams' : 'trivia-teams');
    root.querySelectorAll('[data-act]').forEach((btn) => {
      btn.onclick = () => {
        const t = btn.getAttribute('data-team');
        const act = btn.getAttribute('data-act');
        if (act === 'plus') scoresObj[t] = (scoresObj[t] || 0) + 1;
        else scoresObj[t] = Math.max(0, (scoresObj[t] || 0) - 1);
        onChange();
      };
    });
  }

  /* —— Lyrics cues —— */
  function renderLyrics() {
    const song = PLAYLIST[state.lyricIndex] || PLAYLIST[0];
    const cue = LYRIC_CUES[song.id] || LYRIC_CUES[1];
    document.getElementById('lyric-song').textContent =
      (state.lyricIndex + 1) + '. ' + song.title + (song.artist ? ' — ' + song.artist : '');
    document.getElementById('lyric-steps').innerHTML =
      '<div class="cue-step play"><span class="step-num">1</span>PLAY — ' + escapeHtml(cue.play) + '</div>' +
      '<div class="cue-step mute"><span class="step-num">2</span>MUTE — ' + escapeHtml(cue.mute) + '</div>' +
      '<div class="cue-step kids"><span class="step-num">3</span>KIDS FINISH — ' + escapeHtml(cue.kids) + '</div>';
    updateLyricMuteUI();
  }

  /* —— Freeze Dance (separate tween playlist) —— */
  function shuffleFreezeOrder() {
    freezeOrder = FREEZE_PLAYLIST.map((_, i) => i);
    for (let i = freezeOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = freezeOrder[i];
      freezeOrder[i] = freezeOrder[j];
      freezeOrder[j] = tmp;
    }
    freezeOrderIdx = 0;
  }

  function nextFreezeSong() {
    if (!freezeOrder.length || freezeOrderIdx >= freezeOrder.length) {
      shuffleFreezeOrder();
    }
    const song = FREEZE_PLAYLIST[freezeOrder[freezeOrderIdx]];
    freezeOrderIdx += 1;
    freezeIndex = freezeOrder[freezeOrderIdx - 1];
    return song;
  }

  function enterFreezeMode() {
    if (!freezeMode) {
      freezeSavedMusicIndex = state.musicIndex;
      freezeMode = true;
      if (!freezeOrder.length) shuffleFreezeOrder();
    }
  }

  function loadFreezeVideo(song, autoplay, startSeconds) {
    freezeSong = song;
    usingLocal = false;
    pauseHtmlAudio();
    updateMiniUI();
    const startAt = typeof startSeconds === 'number' ? startSeconds : energeticStartSeconds(song);
    if (!musicReady || !ytPlayer) {
      if (autoplay) pendingPlay = true;
      toast('Loading audio… tap PLAY again in a sec');
      return false;
    }
    try {
      if (autoplay) {
        ytPlayer.loadVideoById({ videoId: song.youtubeId, startSeconds: startAt });
        pendingPlay = true;
      } else {
        ytPlayer.cueVideoById({ videoId: song.youtubeId, startSeconds: startAt });
      }
      return true;
    } catch (e) {
      toast('Could not load freeze track');
      return false;
    }
  }

  function leaveFreezeView() {
    const wasMode = freezeMode;
    freezeMode = false;
    freezeSong = null;
    musicPause();
    if (wasMode && freezeSavedMusicIndex != null) {
      loadTrack(freezeSavedMusicIndex, false);
    }
    freezeSavedMusicIndex = null;
    updateMiniUI();
  }

  function renderFreeze() {
    document.getElementById('freeze-count').textContent = state.freezeCount;
    const links = document.getElementById('freeze-links');
    if (links) {
      links.innerHTML = FREEZE_PLAYLIST.map((s, i) =>
        '<button type="button" class="music-link" data-freeze-index="' + i + '">' + escapeHtml(s.title) + '</button>'
      ).join('');
      links.querySelectorAll('[data-freeze-index]').forEach((btn) => {
        btn.onclick = () => {
          enterFreezeMode();
          const idx = Number(btn.dataset.freezeIndex);
          const song = FREEZE_PLAYLIST[idx];
          if (!song) return;
          freezeIndex = idx;
          const startAt = energeticStartSeconds(song);
          loadFreezeVideo(song, true, startAt);
          musicUnmute();
          try {
            if (ytPlayer && musicReady) {
              ytPlayer.playVideo();
              ytPlayer.unMute();
              musicPlaying = true;
              updateMiniUI();
            } else {
              musicPlay();
            }
          } catch (_) {
            musicPlay();
          }
          const el = document.getElementById('freeze-status');
          if (el) {
            el.textContent = '💃 DANCE!';
            el.classList.remove('frozen');
          }
        };
      });
    }
  }

  function setFreezeMode(mode) {
    const el = document.getElementById('freeze-status');
    el.classList.remove('frozen', 'pulse');
    void el.offsetWidth;
    el.classList.add('pulse');
    if (mode === 'dance') {
      el.textContent = '💃 DANCE!';
      el.classList.remove('frozen');
      enterFreezeMode();
      const song = nextFreezeSong();
      const startAt = energeticStartSeconds(song);
      loadFreezeVideo(song, true, startAt);
      musicUnmute();
      try {
        if (ytPlayer && musicReady) {
          ytPlayer.playVideo();
          ytPlayer.unMute();
          musicPlaying = true;
          updateMiniUI();
        } else {
          musicPlay();
        }
      } catch (_) {
        musicPlay();
      }
    } else {
      el.textContent = '❄️ FREEZE!';
      el.classList.add('frozen');
      musicPause();
      tryVibrate(80);
    }
  }

  /* —— Quizmaster —— */
  function renderQM() {
    const roster = state.qmRoster.length ? state.qmRoster : DEFAULT_STATE.qmRoster;
    if (state.qmIndex >= roster.length) state.qmIndex = 0;
    document.getElementById('qm-name').textContent = roster[state.qmIndex] || 'Alison 👑';
    document.getElementById('qm-roster').value = roster.join('\n');
  }

  /* —— Alison Quiz (open-ended trivia) —— */
  function renderTrivia() {
    if (typeof state.triviaIndex !== 'number' || state.triviaIndex < 0) state.triviaIndex = 0;
    if (state.triviaIndex >= QUIZ_QUESTIONS.length) state.triviaIndex = QUIZ_QUESTIONS.length - 1;

    const idx = state.triviaIndex;
    const item = QUIZ_QUESTIONS[idx];
    const total = QUIZ_QUESTIONS.length;

    document.getElementById('trivia-progress').textContent =
      'Question ' + (idx + 1) + ' of ' + total;
    document.getElementById('trivia-question').textContent = item.q;

    const choicesEl = document.getElementById('trivia-choices');
    if (item.choices && item.choices.length) {
      choicesEl.classList.remove('hidden');
      choicesEl.innerHTML = item.choices.map((c) =>
        '<span class="quiz-chip">' + escapeHtml(c) + '</span>'
      ).join('');
    } else {
      choicesEl.classList.add('hidden');
      choicesEl.innerHTML = '';
    }

    const prevBtn = document.getElementById('trivia-prev');
    const nextBtn = document.getElementById('trivia-next');
    if (prevBtn) prevBtn.disabled = idx <= 0;
    if (nextBtn) nextBtn.disabled = idx >= total - 1;

    const teams = document.getElementById('trivia-teams');
    teams.innerHTML = ['A', 'B', 'C'].map((t) => teamRowHTML('trivia', t, state.triviaScores[t])).join('');
    bindTeamButtons('trivia', state.triviaScores, () => {
      saveState();
      renderTrivia();
    });
  }

  /* —— Timers —— */
  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m + ':' + String(s).padStart(2, '0');
  }

  function renderTimer() {
    document.getElementById('timer-display').textContent = formatTime(timerLeft);
    document.querySelectorAll('.timer-preset').forEach((b) => {
      b.classList.toggle('active', Number(b.dataset.sec) === timerSec);
    });
  }

  function stopTimerInterval() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    timerRunning = false;
  }

  function tryVibrate(ms) {
    try {
      if (navigator.vibrate) navigator.vibrate(ms);
    } catch (_) {}
  }

  /* —— Wipe countdown —— */
  function runWipe() {
    const el = document.getElementById('wipe-display');
    clearTimeout(wipeTimer);
    const steps = ['3', '2', '1', 'SHOW! 🎉'];
    let i = 0;
    function tick() {
      el.textContent = steps[i];
      el.classList.remove('pulse');
      void el.offsetWidth;
      el.classList.add('pulse');
      tryVibrate(i === 3 ? [40, 40, 80] : 40);
      i += 1;
      if (i < steps.length) wipeTimer = setTimeout(tick, 900);
    }
    tick();
  }

  /* —— Hot potato (auto music, separate tween playlist) —— */
  function shufflePotatoOrder() {
    potatoOrder = POTATO_PLAYLIST.map((_, i) => i);
    for (let i = potatoOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = potatoOrder[i];
      potatoOrder[i] = potatoOrder[j];
      potatoOrder[j] = tmp;
    }
    potatoOrderIdx = 0;
  }

  function nextPotatoSong() {
    if (!potatoOrder.length || potatoOrderIdx >= potatoOrder.length) {
      shufflePotatoOrder();
    }
    const song = POTATO_PLAYLIST[potatoOrder[potatoOrderIdx]];
    potatoOrderIdx += 1;
    return song;
  }

  function enterPotatoMode() {
    if (!potatoMode) {
      potatoSavedMusicIndex = state.musicIndex;
      potatoMode = true;
      if (!potatoOrder.length) shufflePotatoOrder();
    }
  }

  function loadPotatoVideo(song, autoplay, startSeconds) {
    potatoSong = song;
    usingLocal = false;
    pauseHtmlAudio();
    updateMiniUI();
    updatePotatoSongLabel();
    const startAt = typeof startSeconds === 'number' ? startSeconds : energeticStartSeconds(song);
    if (!musicReady || !ytPlayer) {
      if (autoplay) pendingPlay = true;
      toast('Loading audio… tap Start Round again in a sec');
      return false;
    }
    try {
      if (autoplay) {
        ytPlayer.loadVideoById({ videoId: song.youtubeId, startSeconds: startAt });
        pendingPlay = true;
      } else {
        ytPlayer.cueVideoById({ videoId: song.youtubeId, startSeconds: startAt });
      }
      return true;
    } catch (e) {
      toast('Could not load potato track');
      return false;
    }
  }

  function updatePotatoSongLabel() {
    const el = document.getElementById('potato-song');
    if (!el) return;
    if (potatoSong) {
      el.textContent = potatoSong.title + (potatoSong.artist ? ' — ' + potatoSong.artist : '');
    } else {
      el.textContent = '—';
    }
  }

  function setPotatoProgress(secs, running) {
    const bar = document.getElementById('potato-progress');
    const wrap = document.getElementById('potato-progress-wrap');
    if (!bar || !wrap) return;
    bar.style.transition = 'none';
    bar.style.width = '0%';
    if (!running) {
      wrap.classList.add('hidden');
      return;
    }
    wrap.classList.remove('hidden');
    void bar.offsetWidth;
    bar.style.transition = 'width ' + secs + 's linear';
    bar.style.width = '100%';
  }

  function updatePotatoStartLabel() {
    const btn = document.getElementById('potato-start');
    if (!btn) return;
    if (potatoRoundActive) {
      btn.textContent = '▶ Passing…';
      btn.disabled = true;
    } else if (potatoSong && document.getElementById('potato-status') &&
               document.getElementById('potato-status').classList.contains('stopped')) {
      btn.textContent = '▶ Next Round';
      btn.disabled = false;
    } else {
      btn.textContent = '▶ Start Round';
      btn.disabled = false;
    }
  }

  function startPotato() {
    clearPotatoTimers();
    enterPotatoMode();
    const song = nextPotatoSong();
    const secs = 15 + Math.floor(Math.random() * 6); // 15–20
    const startAt = energeticStartSeconds(song);
    potatoDeadline = Date.now() + secs * 1000;
    potatoRoundActive = true;

    const status = document.getElementById('potato-status');
    status.textContent = '🥔 Passing…';
    status.classList.remove('stopped');
    status.classList.add('passing');

    const timerEl = document.getElementById('potato-timer');
    timerEl.textContent = 'Music on — stop is secret';
    timerEl.classList.remove('flash-stop');

    loadPotatoVideo(song, true, startAt);
    musicUnmute();
    // Ensure play after load
    try {
      if (ytPlayer && musicReady) {
        ytPlayer.playVideo();
        ytPlayer.unMute();
        musicPlaying = true;
        updateMiniUI();
      } else {
        musicPlay();
      }
    } catch (_) {
      musicPlay();
    }

    setPotatoProgress(secs, true);
    updatePotatoStartLabel();
    potatoTimer = setTimeout(stopPotato, secs * 1000);
  }

  function stopPotato() {
    clearPotatoTimers();
    potatoRoundActive = false;
    const status = document.getElementById('potato-status');
    status.textContent = '🛑 STOP — who’s holding it?';
    status.classList.remove('passing');
    status.classList.add('stopped', 'pulse');
    const timerEl = document.getElementById('potato-timer');
    timerEl.textContent = 'Music paused — eliminate, then Next Round';
    timerEl.classList.add('flash-stop');
    setPotatoProgress(0, false);
    musicPause();
    tryVibrate([100, 50, 100, 50, 200]);
    updatePotatoStartLabel();
  }

  function clearPotatoTimers() {
    clearTimeout(potatoTimer);
    clearInterval(potatoTick);
    potatoTimer = null;
    potatoTick = null;
  }

  function clearPotato() {
    clearPotatoTimers();
    potatoRoundActive = false;
    setPotatoProgress(0, false);
  }

  function resetPotato() {
    clearPotato();
    potatoSong = null;
    const status = document.getElementById('potato-status');
    status.textContent = '🥔 Ready';
    status.classList.remove('stopped', 'passing', 'pulse');
    const timerEl = document.getElementById('potato-timer');
    timerEl.textContent = 'Tap Start Round';
    timerEl.classList.remove('flash-stop');
    updatePotatoSongLabel();
    updatePotatoStartLabel();
    musicPause();
  }

  function leavePotatoView() {
    clearPotato();
    const wasMode = potatoMode;
    potatoMode = false;
    potatoRoundActive = false;
    potatoSong = null;
    const status = document.getElementById('potato-status');
    if (status) {
      status.textContent = '🥔 Ready';
      status.classList.remove('stopped', 'passing', 'pulse');
    }
    const timerEl = document.getElementById('potato-timer');
    if (timerEl) {
      timerEl.textContent = 'Tap Start Round';
      timerEl.classList.remove('flash-stop');
    }
    updatePotatoSongLabel();
    updatePotatoStartLabel();
    if (wasMode && potatoSavedMusicIndex != null) {
      loadTrack(potatoSavedMusicIndex, false);
    }
    potatoSavedMusicIndex = null;
    updateMiniUI();
  }

  /* —— Wire events —— */
  function bind() {
    document.querySelectorAll('[data-view]').forEach((el) => {
      el.addEventListener('click', () => showView(el.getAttribute('data-view')));
    });

    document.getElementById('btn-reset-scores').addEventListener('click', () => {
      if (!confirm('Reset all scores and counts?')) return;
      const keepMusic = state.musicIndex;
      state = structuredClone(DEFAULT_STATE);
      state.musicIndex = keepMusic;
      saveState();
      nttBuzzed = null;
      toast('Scores reset');
      renderPlaylist();
      updateMiniUI();
    });

    /* Mini player */
    document.getElementById('mini-play').addEventListener('click', musicTogglePlay);
    bindInstantPress(document.getElementById('mini-mute'), () => {
      musicToggleMute();
    });
    document.getElementById('mini-prev').addEventListener('click', () => {
      loadTrack(state.musicIndex - 1, true);
      musicPlay();
    });
    document.getElementById('mini-next').addEventListener('click', () => {
      loadTrack(state.musicIndex + 1, true);
      musicPlay();
    });

    const localInput = document.getElementById('local-audio-input');
    if (localInput) {
      localInput.addEventListener('change', () => {
        handleLocalFiles(localInput.files);
        localInput.value = '';
      });
    }

    /* NTT */
    function setBuzz(t) {
      if (nttBuzzed) {
        toast('Already buzzed — clear first');
        return;
      }
      nttBuzzed = t;
      document.getElementById('ntt-buzzed').textContent = 'Team ' + t + ' buzzed!';
      document.getElementById('ntt-buzzed').classList.remove('hidden');
      document.querySelectorAll('#ntt-teams .team-row').forEach((row) => {
        row.classList.toggle('winner', row.getAttribute('data-team') === t);
      });
      document.querySelectorAll('.team-buzz').forEach((b) => {
        b.disabled = true;
      });
      tryVibrate(60);
    }

    document.querySelectorAll('.team-buzz').forEach((btn) => {
      btn.addEventListener('click', () => setBuzz(btn.getAttribute('data-team')));
    });

    document.getElementById('ntt-clear-buzz').addEventListener('click', () => {
      nttBuzzed = null;
      document.getElementById('ntt-buzzed').classList.add('hidden');
      document.querySelectorAll('#ntt-teams .team-row').forEach((r) => r.classList.remove('winner'));
      document.querySelectorAll('.team-buzz').forEach((b) => { b.disabled = false; });
    });

    function clearBuzzUI() {
      nttBuzzed = null;
      document.getElementById('ntt-buzzed').classList.add('hidden');
      document.querySelectorAll('#ntt-teams .team-row').forEach((r) => r.classList.remove('winner'));
      document.querySelectorAll('.team-buzz').forEach((b) => { b.disabled = false; });
    }

    document.getElementById('ntt-next').addEventListener('click', () => {
      state.nttIndex = (state.nttIndex + 1) % PLAYLIST.length;
      clearBuzzUI();
      saveState();
      renderNTT();
      loadTrack(state.nttIndex, true);
      musicPlay();
    });
    document.getElementById('ntt-prev').addEventListener('click', () => {
      state.nttIndex = (state.nttIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
      clearBuzzUI();
      saveState();
      renderNTT();
      loadTrack(state.nttIndex, true);
      musicPlay();
    });
    document.getElementById('ntt-play').addEventListener('click', () => {
      loadTrack(state.nttIndex, true);
      musicUnmute();
      musicPlay();
    });
    document.getElementById('ntt-pause').addEventListener('click', () => {
      musicPause();
    });

    /* Wipe */
    document.getElementById('wipe-go').addEventListener('click', runWipe);
    document.getElementById('wipe-reset').addEventListener('click', () => {
      clearTimeout(wipeTimer);
      document.getElementById('wipe-display').textContent = 'Ready';
    });

    /* Lyrics — instant mute on pointerdown (not click/release) */
    bindInstantPress(document.getElementById('lyric-mute-toggle'), () => {
      lyricToggleMute();
    });
    document.getElementById('lyric-next').addEventListener('click', () => {
      state.lyricIndex = (state.lyricIndex + 1) % PLAYLIST.length;
      saveState();
      renderLyrics();
      loadTrack(state.lyricIndex, true);
      musicUnmute();
      musicPlay();
      setCueHighlight('playing');
    });
    document.getElementById('lyric-prev').addEventListener('click', () => {
      state.lyricIndex = (state.lyricIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
      saveState();
      renderLyrics();
      loadTrack(state.lyricIndex, true);
      musicUnmute();
      musicPlay();
      setCueHighlight('playing');
    });
    document.getElementById('lyric-play').addEventListener('click', () => {
      loadTrack(state.lyricIndex, true);
      musicUnmute();
      musicPlay();
      setCueHighlight('playing');
    });

    /* Freeze */
    document.getElementById('freeze-play').addEventListener('click', () => setFreezeMode('dance'));
    document.getElementById('freeze-pause').addEventListener('click', () => setFreezeMode('freeze'));
    document.getElementById('freeze-plus').addEventListener('click', () => {
      state.freezeCount += 1;
      saveState();
      renderFreeze();
    });
    document.getElementById('freeze-minus').addEventListener('click', () => {
      state.freezeCount = Math.max(0, state.freezeCount - 1);
      saveState();
      renderFreeze();
    });
    document.getElementById('freeze-elim').addEventListener('click', () => {
      state.freezeCount = Math.max(0, state.freezeCount - 1);
      saveState();
      renderFreeze();
      toast('Eliminated! Still in: ' + state.freezeCount);
      tryVibrate(40);
    });
    document.getElementById('freeze-reset-count').addEventListener('click', () => {
      state.freezeCount = 12;
      saveState();
      renderFreeze();
    });

    /* Potato */
    document.getElementById('potato-start').addEventListener('click', startPotato);
    document.getElementById('potato-stop').addEventListener('click', stopPotato);
    document.getElementById('potato-reset').addEventListener('click', resetPotato);

    /* Quizmaster */
    document.getElementById('qm-next').addEventListener('click', () => {
      const roster = state.qmRoster.length ? state.qmRoster : DEFAULT_STATE.qmRoster;
      state.qmIndex = (state.qmIndex + 1) % roster.length;
      saveState();
      renderQM();
      tryVibrate(30);
    });
    document.getElementById('qm-save').addEventListener('click', () => {
      const lines = document.getElementById('qm-roster').value
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);
      if (!lines.length) {
        toast('Add at least one name');
        return;
      }
      state.qmRoster = lines;
      state.qmIndex = 0;
      saveState();
      renderQM();
      toast('Roster saved');
    });

    /* Alison Quiz */
    document.getElementById('trivia-prev').addEventListener('click', () => {
      if (state.triviaIndex > 0) {
        state.triviaIndex -= 1;
        saveState();
        renderTrivia();
        tryVibrate(20);
      }
    });
    document.getElementById('trivia-next').addEventListener('click', () => {
      if (state.triviaIndex < QUIZ_QUESTIONS.length - 1) {
        state.triviaIndex += 1;
        saveState();
        renderTrivia();
        tryVibrate(20);
      }
    });
    document.getElementById('trivia-reset').addEventListener('click', () => {
      state.triviaScores = { A: 0, B: 0, C: 0 };
      state.triviaIndex = 0;
      saveState();
      renderTrivia();
      toast('Quiz scores cleared');
    });

    /* Timers */
    document.querySelectorAll('.timer-preset').forEach((btn) => {
      btn.addEventListener('click', () => {
        stopTimerInterval();
        timerSec = Number(btn.dataset.sec);
        timerLeft = timerSec;
        document.getElementById('timer-done').classList.add('hidden');
        renderTimer();
      });
    });
    document.getElementById('timer-start').addEventListener('click', () => {
      if (timerRunning) return;
      if (timerLeft <= 0) timerLeft = timerSec;
      document.getElementById('timer-done').classList.add('hidden');
      timerRunning = true;
      timerId = setInterval(() => {
        timerLeft -= 1;
        renderTimer();
        if (timerLeft <= 0) {
          stopTimerInterval();
          timerLeft = 0;
          renderTimer();
          document.getElementById('timer-done').classList.remove('hidden');
          tryVibrate([200, 100, 200]);
          toast("Time's up!");
        }
      }, 1000);
    });
    document.getElementById('timer-pause').addEventListener('click', () => {
      stopTimerInterval();
    });
    document.getElementById('timer-reset').addEventListener('click', () => {
      stopTimerInterval();
      timerLeft = timerSec;
      document.getElementById('timer-done').classList.add('hidden');
      renderTimer();
    });
  }

  /* Service worker */
  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol === 'file:') return;
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  /* Init */
  renderPlaylist();
  updateMiniUI();
  bind();
  initYouTube();
  probeFolderLocals();
  registerSW();
})();
