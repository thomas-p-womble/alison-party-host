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

  /* Host timing cards only — NO full copyrighted lyrics */
  /* startAt/muteAt/unmuteAt = seconds; startAt 0 = from beginning; short hook mute (~8–12s) */
  const LYRIC_CUES = {
    1: {
      play: 'Play from the start (verse → chorus)',
      mute: 'MUTE short “choosin’ Texas” hook',
      kids: 'Kids shout the Texas hook (~10s)',
      startAt: 0, muteAt: 68, unmuteAt: 78
    },
    2: {
      play: 'Play from the start',
      mute: 'MUTE short “you belong with me” hook',
      kids: 'Kids finish the hook line (~11s)',
      startAt: 0, muteAt: 61, unmuteAt: 72
    },
    3: {
      play: 'Play from the start',
      mute: 'MUTE “Sweet Caroline” + bahs',
      kids: 'Kids sing the bahs + title (~12s)',
      startAt: 0, muteAt: 63, unmuteAt: 75
    },
    4: {
      play: 'Play from the start (riff in)',
      mute: 'MUTE short title hook',
      kids: 'Kids belt “Eye of the Tiger!” (~12s)',
      startAt: 0, muteAt: 83, unmuteAt: 95
    },
    5: {
      play: 'Play from the start (long build)',
      mute: 'MUTE short “don’t stop believin’” hook',
      kids: 'Kids finish the title hook (~11s)',
      startAt: 0, muteAt: 203, unmuteAt: 214
    },
    6: {
      play: 'Play from the start',
      mute: 'MUTE short “feeling 22” hook',
      kids: 'Kids shout “22!” (~12s)',
      startAt: 0, muteAt: 42, unmuteAt: 54
    },
    7: {
      play: 'Play from the start',
      mute: 'MUTE short “hear me roar” hook',
      kids: 'Kids ROAR the hook (~12s)',
      startAt: 0, muteAt: 52, unmuteAt: 64
    },
    8: {
      play: 'Play from the start',
      mute: 'MUTE short “party in the USA” hook',
      kids: 'Kids finish the title hook (~12s)',
      startAt: 0, muteAt: 56, unmuteAt: 68
    },
    9: {
      play: 'Play from the start',
      mute: 'MUTE short “shake it off” hook',
      kids: 'Kids shake + finish the hook (~12s)',
      startAt: 0, muteAt: 48, unmuteAt: 60
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
  let autoSingTimer = null;
  let autoSingPhase = 'idle'; /* idle | seeking | playing | muted | done */
  let autoSingSongId = null;
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

  function songLabel(song, index) {
    return (index + 1) + '. ' + song.title + (song.artist ? ' — ' + song.artist : '');
  }

  function updateMiniUI() {
    const song = currentSong();
    const titleEl = document.getElementById('mini-song-title');
    if (titleEl) {
      const src = hasLocal(song) ? ' · local' : '';
      titleEl.textContent = songLabel(song, state.musicIndex) + src;
    }

    const playBtn = document.getElementById('mini-play');
    if (playBtn) playBtn.textContent = musicPlaying ? '⏸' : '▶';

    const muteBtn = document.getElementById('mini-mute');
    if (muteBtn) {
      muteBtn.textContent = musicMuted ? '🔇' : '🔊';
      muteBtn.setAttribute('aria-label', musicMuted ? 'Unmute' : 'Mute');
    }

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
    const song = currentSong();
    if (hasLocal(song)) {
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

    if (!ensurePlayer(true)) return;
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
    if (htmlAudio) htmlAudio.muted = true;
    if (ytPlayer && musicReady) {
      try { ytPlayer.mute(); } catch (_) {}
    }
    updateMiniUI();
  }

  function musicUnmute() {
    musicMuted = false;
    if (htmlAudio) htmlAudio.muted = false;
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

  function getMusicTime() {
    try {
      if (usingLocal && htmlAudio) {
        return Number(htmlAudio.currentTime) || 0;
      }
      if (ytPlayer && musicReady && typeof ytPlayer.getCurrentTime === 'function') {
        return Number(ytPlayer.getCurrentTime()) || 0;
      }
    } catch (_) {}
    return 0;
  }

  function musicSeek(seconds) {
    const t = Math.max(0, Number(seconds) || 0);
    try {
      if (usingLocal && htmlAudio) {
        htmlAudio.currentTime = t;
        return true;
      }
      if (ytPlayer && musicReady) {
        ytPlayer.seekTo(t, true);
        return true;
      }
    } catch (_) {}
    return false;
  }


  function formatMmSs(sec) {
    const s = Math.max(0, Math.floor(Number(sec) || 0));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return m + ':' + String(r).padStart(2, '0');
  }

  function stopAutoSing() {
    if (autoSingTimer) {
      clearInterval(autoSingTimer);
      autoSingTimer = null;
    }
    autoSingPhase = 'idle';
    autoSingSongId = null;
    const cd = document.getElementById('lyric-countdown');
    if (cd) {
      cd.textContent = '';
      cd.className = 'lyric-countdown';
    }
    document.querySelectorAll('#lyric-steps .cue-step').forEach((el) => {
      el.classList.remove('active', 'flash');
    });
    const btn = document.getElementById('lyric-auto');
    if (btn) btn.classList.remove('running');
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
      if (el) {
        el.classList.add('active', 'flash');
      }
    }
  }

  function updateAutoSingCountdown(cue, t) {
    const cd = document.getElementById('lyric-countdown');
    if (!cd) return;
    if (autoSingPhase === 'seeking') {
      cd.textContent = 'Seeking…';
      cd.className = 'lyric-countdown waiting';
    } else if (autoSingPhase === 'playing') {
      const left = Math.max(0, Math.ceil(cue.muteAt - t));
      cd.textContent = 'Mute in ' + left + 's';
      cd.className = 'lyric-countdown waiting';
    } else if (autoSingPhase === 'muted') {
      const left = Math.max(0, Math.ceil(cue.unmuteAt - t));
      cd.textContent = 'Hook mute ' + formatMmSs(cue.muteAt) + '–' + formatMmSs(cue.unmuteAt) +
        ' · kids sing (' + left + 's)';
      cd.className = 'lyric-countdown muted-now';
    } else if (autoSingPhase === 'done') {
      cd.textContent = 'Unmuted — playing continues';
      cd.className = 'lyric-countdown unmuted';
    }
  }

  function startAutoSing() {
    stopAutoSing();
    const song = PLAYLIST[state.lyricIndex] || PLAYLIST[0];
    const cue = LYRIC_CUES[song.id] || LYRIC_CUES[1];
    if (cue.startAt == null || cue.muteAt == null || cue.unmuteAt == null) {
      toast('No auto timings for this song');
      return;
    }

    /* Keep dock track in sync with lyric song */
    if (state.musicIndex !== state.lyricIndex) {
      loadTrack(state.lyricIndex, false);
    }

    autoSingSongId = song.id;
    autoSingPhase = 'seeking';
    const btn = document.getElementById('lyric-auto');
    if (btn) btn.classList.add('running');

    musicUnmute();
    musicSeek(cue.startAt);
    musicPlay();
    setCueHighlight('playing');
    updateAutoSingCountdown(cue, cue.startAt);
    toast('Auto Sing — seeking to ' + formatMmSs(cue.startAt));
    tryVibrate(30);

    const startAt = cue.startAt;
    const SEEK_TOLERANCE = 8; /* player time within this of startAt = confirmed */
    const SEEK_RETRY_MS = 400;
    const SEEK_GIVE_UP_MS = 5000;
    const seekBegunAt = Date.now();
    let lastSeekAt = 0;
    let seekConfirmed = false;
    let confirmedWallStart = 0;
    let didMute = false;
    let didUnmute = false;

    function forceUnmuteAndPlay() {
      musicUnmute();
      try {
        if (ytPlayer && musicReady && typeof ytPlayer.setVolume === 'function') {
          ytPlayer.setVolume(100);
        }
      } catch (_) {}
      musicPlay();
    }

    function effectiveTime() {
      const playerTime = getMusicTime();
      if (!seekConfirmed) return playerTime;
      const wall = startAt + (Date.now() - confirmedWallStart) / 1000;
      /* Stalled YT getCurrentTime must never block unmute */
      return Math.max(playerTime, wall);
    }

    function isSeekLanded(raw) {
      return raw >= startAt - SEEK_TOLERANCE && raw <= startAt + SEEK_TOLERANCE;
    }

    autoSingTimer = setInterval(() => {
      if (autoSingSongId !== song.id) {
        stopAutoSing();
        return;
      }

      const now = Date.now();
      const raw = getMusicTime();

      /* —— Phase: seeking (no mute until seek confirmed) —— */
      if (!seekConfirmed) {
        if (isSeekLanded(raw)) {
          seekConfirmed = true;
          confirmedWallStart = Date.now();
          autoSingPhase = 'playing';
          setCueHighlight('playing');
          updateAutoSingCountdown(cue, raw);
          toast('Auto Sing — ready at ' + formatMmSs(Math.floor(raw)));
          return;
        }

        if (now - seekBegunAt >= SEEK_GIVE_UP_MS) {
          toast('Seek failed — music keeps playing unmuted');
          forceUnmuteAndPlay();
          stopAutoSing();
          return;
        }

        if (now - lastSeekAt >= SEEK_RETRY_MS) {
          lastSeekAt = now;
          musicSeek(startAt);
          musicPlay();
        }
        autoSingPhase = 'seeking';
        updateAutoSingCountdown(cue, raw);
        return;
      }

      /* —— Phase: running after confirmed seek —— */
      const t = effectiveTime();
      if (!didMute && t >= cue.muteAt) {
        didMute = true;
        autoSingPhase = 'muted';
        musicMute();
        setCueHighlight('muted');
        toast('MUTED — kids finish the line!');
        tryVibrate(50);
      }
      if (didMute && !didUnmute && t >= cue.unmuteAt) {
        didUnmute = true;
        autoSingPhase = 'done';
        forceUnmuteAndPlay();
        setCueHighlight('done');
        toast('Unmuted — music continues!');
        tryVibrate(30);
        updateAutoSingCountdown(cue, t);
        clearInterval(autoSingTimer);
        autoSingTimer = null;
        if (btn) btn.classList.remove('running');
        return;
      }
      updateAutoSingCountdown(cue, t);
    }, 150);
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
    if (id !== 'lyrics') stopAutoSing();
    document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
    const view = document.getElementById('view-' + id);
    if (view) view.classList.add('active');
    window.scrollTo(0, 0);
    if (id === 'name-tune') renderNTT();
    if (id === 'lyrics') renderLyrics();
    if (id === 'freeze') renderFreeze();
    if (id === 'quizmaster') renderQM();
    if (id === 'trivia') renderTrivia();
    if (id === 'timers') renderTimer();
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
    const timingHint = (cue.startAt != null)
      ? '<p class="cue-timing">Hook mute ' + formatMmSs(cue.muteAt) + '–' + formatMmSs(cue.unmuteAt) +
        (cue.startAt === 0 ? ' · from start' : ' · seek ' + formatMmSs(cue.startAt)) + '</p>'
      : '';
    document.getElementById('lyric-steps').innerHTML =
      timingHint +
      '<div class="cue-step play"><span class="step-num">1</span>PLAY — ' + escapeHtml(cue.play) + '</div>' +
      '<div class="cue-step mute"><span class="step-num">2</span>MUTE NOW — ' + escapeHtml(cue.mute) + '</div>' +
      '<div class="cue-step kids"><span class="step-num">3</span>KIDS FINISH — ' + escapeHtml(cue.kids) + '</div>';
    const cd = document.getElementById('lyric-countdown');
    if (cd && autoSingPhase === 'idle') {
      cd.textContent = '';
      cd.className = 'lyric-countdown';
    }
  }

  /* —— Freeze —— */
  function renderFreeze() {
    document.getElementById('freeze-count').textContent = state.freezeCount;
    const links = document.getElementById('freeze-links');
    if (links) {
      links.innerHTML = PLAYLIST.slice(0, 4).map((s, i) =>
        '<button type="button" class="music-link" data-index="' + i + '">' + escapeHtml(s.title) + '</button>'
      ).join('');
      links.querySelectorAll('[data-index]').forEach((btn) => {
        btn.onclick = () => {
          loadTrack(Number(btn.dataset.index), true);
          musicPlay();
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
      musicUnmute();
      musicPlay();
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

  /* —— Hot potato —— */
  function startPotato() {
    clearPotato();
    const secs = 8 + Math.floor(Math.random() * 18); // 8–25
    potatoDeadline = Date.now() + secs * 1000;
    const status = document.getElementById('potato-status');
    status.textContent = '🥔 Pass it!';
    status.classList.remove('stopped');
    document.getElementById('potato-timer').textContent = 'Music on (~' + secs + 's)';
    musicUnmute();
    musicPlay();
    potatoTick = setInterval(updatePotatoClock, 200);
    potatoTimer = setTimeout(stopPotato, secs * 1000);
  }

  function updatePotatoClock() {
    const left = Math.max(0, Math.ceil((potatoDeadline - Date.now()) / 1000));
    document.getElementById('potato-timer').textContent = left + 's left (secret-ish)';
  }

  function stopPotato() {
    clearInterval(potatoTick);
    potatoTick = null;
    clearTimeout(potatoTimer);
    potatoTimer = null;
    const status = document.getElementById('potato-status');
    status.textContent = '🛑 STOP! Winner / Out!';
    status.classList.add('stopped', 'pulse');
    document.getElementById('potato-timer').textContent = 'Music paused — who’s holding it?';
    musicPause();
    tryVibrate([100, 50, 100, 50, 200]);
  }

  function clearPotato() {
    clearTimeout(potatoTimer);
    clearInterval(potatoTick);
    potatoTimer = null;
    potatoTick = null;
  }

  function resetPotato() {
    clearPotato();
    const status = document.getElementById('potato-status');
    status.textContent = '🥔 Pass it!';
    status.classList.remove('stopped');
    document.getElementById('potato-timer').textContent = '—';
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
    document.getElementById('mini-mute').addEventListener('click', musicToggleMute);
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

    /* Lyrics */
    document.getElementById('lyric-auto').addEventListener('click', () => {
      startAutoSing();
    });
    document.getElementById('lyric-next').addEventListener('click', () => {
      stopAutoSing();
      state.lyricIndex = (state.lyricIndex + 1) % PLAYLIST.length;
      saveState();
      renderLyrics();
      loadTrack(state.lyricIndex, true);
      musicUnmute();
      musicPlay();
    });
    document.getElementById('lyric-prev').addEventListener('click', () => {
      stopAutoSing();
      state.lyricIndex = (state.lyricIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
      saveState();
      renderLyrics();
      loadTrack(state.lyricIndex, false);
    });
    document.getElementById('lyric-play').addEventListener('click', () => {
      stopAutoSing();
      loadTrack(state.lyricIndex, true);
      musicUnmute();
      musicPlay();
    });
    document.getElementById('lyric-mute').addEventListener('click', () => {
      /* Manual override — keep auto runner if running so unmute can still fire */
      musicMute();
      setCueHighlight('muted');
      const cd = document.getElementById('lyric-countdown');
      if (cd && autoSingPhase === 'playing') {
        autoSingPhase = 'muted';
      }
      toast('MUTED — kids finish the line!');
      tryVibrate(50);
    });
    document.getElementById('lyric-unmute').addEventListener('click', () => {
      musicUnmute();
      setCueHighlight('done');
      const cd = document.getElementById('lyric-countdown');
      if (cd) {
        cd.textContent = 'Unmuted';
        cd.className = 'lyric-countdown unmuted';
      }
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
