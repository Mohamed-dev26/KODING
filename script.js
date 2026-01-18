document.addEventListener("DOMContentLoaded", function () {
  var navLinks = document.querySelectorAll(".nav-link");
  var sections = [];
  navLinks.forEach(function (link) {
    var target = document.querySelector(link.getAttribute("href"));
    if (target) {
      sections.push({ id: link.getAttribute("href"), el: target, link: link });
    }
  });
  function onScroll() {
    var scrollPos = window.scrollY + 100;
    var current = null;
    sections.forEach(function (s) {
      var rect = s.el.getBoundingClientRect();
      var top = rect.top + window.scrollY;
      if (scrollPos >= top) {
        current = s;
      }
    });
    if (current) {
      navLinks.forEach(function (link) {
        link.classList.remove("active");
      });
      current.link.classList.add("active");
    }
  }
  window.addEventListener("scroll", onScroll);
  onScroll();
  function smoothScrollTo(targetId) {
    var target = document.querySelector(targetId);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        smoothScrollTo(href);
      }
    });
  });
  var stepList = document.getElementById("lesson-steps-list");
  var exampleContainer = document.getElementById("lesson-example");
  var courseTabs = document.querySelectorAll(".course-tab");
  var videoLabel = document.getElementById("lesson-video-label");
  var videoTitle = document.getElementById("lesson-video-title");
  var videoIframe = document.getElementById("lesson-video-iframe");
  var goalTitle = document.getElementById("lesson-goal-title");
  var goalText = document.getElementById("lesson-goal-text");
  var prevBtn = document.getElementById("prev-step");
  var nextBtn = document.getElementById("next-step");
  var lessonProgressLabel = document.getElementById("lesson-course-progress");
  var quizList = document.getElementById("quiz-questions-list");
  var quizSubmit = document.getElementById("quiz-submit");
  var quizResult = document.getElementById("quiz-result");
  var quizTimerLabel = document.getElementById("quiz-timer");
  var quizPassed = false;
  var quizTimerId = null;
  var quizSeconds = 600;
  var currentIndex = 0;
  var currentCourseKey = "scratch";
  var lessonConfigs = {
    scratch: {
      videoLabel: "فيديو تمهيدي من دورة Scratch",
      videoTitle: "اجعل الشخصية تتحرك عند النقر على العلم الأخضر",
      videoSrc: "https://www.youtube.com/embed/4juyNYarlwQ",
      goalTitle: "هدف الدرس",
      goalText:
        "في هذا الدرس ستتعلم كيف تجعل شخصية اللعبة تتحرك عندما تضغط على العلم الأخضر باستخدام لبنات Scratch.",
      steps: [
        'اسحب لبنة "عند النقر على العلم الأخضر" إلى منطقة السكربت.',
        'أضف لبنة "تحرك ١٠ خطوات" تحتها مباشرة.',
        "اضغط على العلم الأخضر وشاهد الشخصية تتحرك."
      ],
      exampleHtml:
        '<div class="scratch-header">بيئة تفاعلية شبيهة بـ Scratch</div>' +
        '<div class="scratch-body">' +
        '<div class="scratch-column blocks-column">' +
        '<div class="scratch-block">عند النقر على العلم الأخضر</div>' +
        '<div class="scratch-block">تحرك ١٠ خطوات</div>' +
        '<div class="scratch-block muted">كرر ١٠ مرات</div>' +
        "</div>" +
        '<div class="scratch-column stage-column">' +
        '<div class="scratch-stage" id="scratch-stage">' +
        '<div class="sprite" id="scratch-sprite"></div>' +
        '<div class="flag">🏳️‍🌈</div>' +
        "</div>" +
        '<button class="btn secondary-btn full-width" id="scratch-run">تشغيل المشروع</button>' +
        "</div>" +
        "</div>"
    },
    python: {
      videoLabel: "مقتطف من دورة بايثون للمبتدئين",
      videoTitle: "اكتب أول برنامج لك بلغة بايثون",
      videoSrc: "https://www.youtube.com/embed/ij6qQQlGKtE",
      goalTitle: "هدف الدرس",
      goalText:
        "في هذا المثال ستتعلم كيف تطبع رسالة بسيطة للمستخدم، وتستقبل منه إدخالًا، ثم تعرض النتيجة.",
      steps: [
        "افتح محرر الكود واكتب السطر الذي يطبع رسالة ترحيب.",
        "أضف سطرًا يستقبل اسم المستخدم من لوحة المفاتيح.",
        "استخدم الاسم لطباعة رسالة شخصية للمستخدم."
      ],
      exampleHtml:
        '<div class="scratch-header">مثال كود بايثون</div>' +
        '<div class="code-block"><code>' +
        'name = input("ما اسمك؟ ")\\n' +
        'print("مرحبًا، " + name + "!")\\n' +
        'age = int(input("كم عمرك؟ "))\\n' +
        'print("بعد 5 سنوات سيكون عمرك", age + 5)' +
        "</code></div>"
    },
    web: {
      videoLabel: "مقتطف من دورة تطوير الويب",
      videoTitle: "إنشاء زر يغير لون الخلفية",
      videoSrc: "https://www.youtube.com/embed/VzAxCThj_5k",
      goalTitle: "هدف الدرس",
      goalText:
        "في هذا المثال ستتعلم كيف تربط زرًا في صفحة HTML بكود JavaScript بسيط يغير لون الخلفية.",
      steps: [
        "أنشئ صفحة HTML تحتوي على زر واحد داخل <body>.",
        "أضف ملف JavaScript أو وسم <script> في نهاية الصفحة.",
        "اكتب كودًا يلتقط حدث النقر على الزر ويغير لون الخلفية."
      ],
      exampleHtml:
        '<div class="scratch-header">مثال HTML/CSS/JS مبسط</div>' +
        '<div class="code-block"><code>' +
        '&lt;button id="magic-btn"&gt;غيّر لون الخلفية&lt;/button&gt;\\n\\n' +
        "&lt;script&gt;\\n" +
        "  const btn = document.getElementById('magic-btn');\\n" +
        "  btn.addEventListener('click', function () {\\n" +
        "    document.body.style.backgroundColor = '#020617';\\n" +
        "  });\\n" +
        "&lt;/script&gt;" +
        "</code></div>"
    }
  };
  var courseNames = { scratch: "Scratch", python: "بايثون", web: "HTML/CSS/JS" };
  function formatTime(total) {
    var m = Math.floor(total / 60);
    var s = total % 60;
    var mm = m < 10 ? "0" + m : String(m);
    var ss = s < 10 ? "0" + s : String(s);
    return mm + ":" + ss;
  }
  function stopQuizTimer() {
    if (quizTimerId) {
      clearInterval(quizTimerId);
      quizTimerId = null;
    }
  }
  function startQuizTimer() {
    stopQuizTimer();
    quizSeconds = 600;
    if (quizTimerLabel) {
      quizTimerLabel.textContent = formatTime(quizSeconds);
    }
    quizTimerId = setInterval(function () {
      quizSeconds -= 1;
      if (quizTimerLabel) {
        quizTimerLabel.textContent = formatTime(Math.max(0, quizSeconds));
      }
      if (quizSeconds <= 0) {
        stopQuizTimer();
        if (quizSubmit) {
          quizSubmit.disabled = true;
        }
        if (quizResult) {
          quizResult.textContent = "انتهى الوقت. أعد المحاولة بعد اختيار تمرين آخر أو إعادة التمرين.";
        }
      }
    }, 1000);
  }
  function buildQuizQuestions(courseKey, lessonIndex, config) {
    var techOptions = ["Scratch", "بايثون", "HTML/CSS/JS"];
    var correctTechIndex = techOptions.indexOf(courseNames[courseKey]);
    var goalShort = (config.goalText || "").length > 60 ? (config.goalText || "").slice(0, 57) + "..." : (config.goalText || "");
    var base = [];
    base.push({
      text: "أي تقنية يتعلق بها هذا التمرين؟",
      options: techOptions,
      correctIndex: correctTechIndex >= 0 ? correctTechIndex : 0
    });
    var videoBank = {
      scratch: [
        { text: "ما اللبنة التي تبدأ التنفيذ عند العلم؟", options: ["عند النقر على العلم الأخضر", "عند الضغط على مفتاح المسافة", "عند بدء البرنامج"], correctIndex: 0 }
      ],
      python: [
        { text: "ما الدالة التي تطبع نصًا؟", options: ["print", "input", "len"], correctIndex: 0 }
      ],
      web: [
        { text: "ما العنصر الذي يرتبط بحدث النقر؟", options: ["زر بآيدي magic-btn", "div رئيسي", "وسم head"], correctIndex: 0 }
      ]
    };
    var videoQ = videoBank[courseKey] && videoBank[courseKey][0] ? videoBank[courseKey][0] : null;
    if (videoQ) {
      base.push(videoQ);
    } else {
      base.push({
        text: "ما عنوان الفيديو لهذا التمرين؟",
        options: [config.videoTitle, "مقدمة عامة", "تجربة مختلفة"],
        correctIndex: 0
      });
    }
    var stepFirst = (config.steps && config.steps.length) ? config.steps[0] : "ابدأ بقراءة الهدف";
    var stepSecond = (config.steps && config.steps.length > 1) ? config.steps[1] : "اكتب الكود";
    var stepThird = (config.steps && config.steps.length > 2) ? config.steps[2] : "اختبر النتيجة";
    base.push({
      text: "ما هي أول خطوة صحيحة في هذا التمرين؟",
      options: [stepFirst, stepSecond, stepThird],
      correctIndex: 0
    });
    if (config.quizMeta && config.quizMeta.type === "blocksCount") {
      var v = config.quizMeta.value;
      base.push({
        text: "كم عدد اللبنات الظاهرة في المثال؟",
        options: [String(v), String(v - 1), String(v + 1)],
        correctIndex: 0
      });
    } else if (config.quizMeta && config.quizMeta.type === "codeLength") {
      var lv = config.quizMeta.value;
      base.push({
        text: "أي طول تقريبي للكود في المثال؟",
        options: [String(lv), String(lv + 5), String(lv - 5)],
        correctIndex: 0
      });
    } else if (config.quizMeta && config.quizMeta.type === "tagCount") {
      var tv = config.quizMeta.value;
      base.push({
        text: "كم عدد الوسوم/العناصر في المثال؟",
        options: [String(tv), String(tv - 1), String(tv + 2)],
        correctIndex: 0
      });
    } else {
      base.push({
        text: "ما الهدف لهذا التمرين؟",
        options: [goalShort || "تعزيز الفهم", "لا هدف محدد", "الترفيه فقط"],
        correctIndex: 0
      });
    }
    var combos = [
      [0, 1, 2],
      [1, 2, 3],
      [2, 3, 0],
      [3, 0, 1]
    ];
    var pick = combos[lessonIndex % combos.length];
    var out = [];
    for (var i = 0; i < pick.length && i < base.length; i++) {
      out.push(base[pick[i]]);
    }
    return out;
  }
  function renderQuiz(courseKey, lessonIndex, config) {
    quizPassed = false;
    if (quizResult) {
      quizResult.textContent = "";
    }
    if (!quizList) return;
    var qs = buildQuizQuestions(courseKey, lessonIndex, config);
    quizList.innerHTML = "";
    qs.forEach(function (q, qi) {
      var li = document.createElement("li");
      var title = document.createElement("div");
      title.textContent = q.text;
      li.appendChild(title);
      q.options.forEach(function (opt, oi) {
        var label = document.createElement("label");
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "q" + qi;
        input.value = String(oi);
        label.appendChild(input);
        var span = document.createElement("span");
        span.textContent = " " + opt;
        label.appendChild(span);
        li.appendChild(label);
      });
      quizList.appendChild(li);
    });
    if (quizSubmit) {
      quizSubmit.disabled = false;
    }
    startQuizTimer();
  }
  function computeCodeLength(s) {
    return (s || "").length;
  }
  function computeTagCount(s) {
    var c = 0;
    if (!s) return 0;
    for (var i = 0; i < s.length; i++) {
      if (s[i] === "<") c++;
    }
    return c;
  }
  function generateScratchTrack(base) {
    var topics = [
      "تحريك قطتين في نفس الوقت",
      "تدوير الشخصية 15 درجة",
      "القفز عند النقر",
      "تغيير الأزياء عند الحدث",
      "إضافة صوت عند الاصطدام",
      "تتبع النقاط",
      "التحكم بلوحة المفاتيح",
      "حركة عشوائية",
      "تغيير الحجم تدريجيًا",
      "إخفاء وإظهار الشخصية",
      "استخدام المتغيرات",
      "مؤقت اللعبة",
      "تكرار بشرط",
      "التصادم مع الحدود",
      "مستويات اللعبة",
      "سرعة متزايدة",
      "مزامنة الأصوات",
      "إعادة التعيين",
      "قائمة اختيارات",
      "نقاط الفوز",
      "الخسارة عند الخطأ",
      "التنقل بين المشاهد",
      "توليد نسخ",
      "ذكاء الخصم البسيط"
    ];
    var list = [];
    list.push({
      videoLabel: base.videoLabel,
      videoTitle: base.videoTitle,
      videoSrc: base.videoSrc,
      goalTitle: base.goalTitle,
      goalText: base.goalText,
      steps: base.steps,
      exampleHtml: base.exampleHtml,
      quizMeta: { type: "blocksCount", value: 3 }
    });
    for (var i = 0; i < topics.length; i++) {
      var blocks = 3 + ((i % 4) + 1);
      var blocksHtml = "";
      for (var b = 0; b < blocks; b++) {
        blocksHtml += '<div class="scratch-block' + (b % 3 === 2 ? " muted" : "") + '">لبنة ' + (b + 1) + "</div>";
      }
      var ex =
        '<div class="scratch-header">بيئة تمرين: ' +
        topics[i] +
        "</div><div class=\"scratch-body\"><div class=\"scratch-column blocks-column\">" +
        blocksHtml +
        "</div><div class=\"scratch-column stage-column\"><div class=\"scratch-stage\"><div class=\"sprite\"></div><div class=\"flag\">🏁</div></div><button class=\"btn secondary-btn full-width\">تشغيل المشروع</button></div></div>";
      list.push({
        videoLabel: base.videoLabel,
        videoTitle: "تمرين: " + topics[i],
        videoSrc: base.videoSrc,
        goalTitle: "هدف الدرس",
        goalText: "طبّق فكرة: " + topics[i] + " باستخدام اللبنات المناسبة",
        steps: ["اقرأ هدف التمرين", "رتّب اللبنات لتحقيق الهدف", "اختبر وراجع النتيجة"],
        exampleHtml: ex,
        quizMeta: { type: "blocksCount", value: blocks }
      });
    }
    return list;
  }
  function generatePythonTrack(base) {
    var list = [];
    var baseCode =
      'name = input("ما اسمك؟ ")\\n' +
      'print("مرحبًا، " + name + "!")\\n' +
      'age = int(input("كم عمرك؟ "))\\n' +
      'print("بعد 5 سنوات سيكون عمرك", age + 5)';
    list.push({
      videoLabel: base.videoLabel,
      videoTitle: base.videoTitle,
      videoSrc: base.videoSrc,
      goalTitle: base.goalTitle,
      goalText: base.goalText,
      steps: base.steps,
      exampleHtml: '<div class="scratch-header">مثال كود بايثون</div><div class="code-block"><code>' + baseCode + "</code></div>",
      codeSample: baseCode,
      quizMeta: { type: "codeLength", value: computeCodeLength(baseCode) }
    });
    for (var i = 2; i <= 25; i++) {
      var v = i * 3;
      var t = i % 5;
      var code = "";
      var title = "";
      var goal = "";
      if (t === 0) {
        title = "حساب طول نص";
        goal = "احسب طول النص وأعرض النتيجة";
        code = 's = "تمرين_' + i + '"\\nprint(len(s))';
      } else if (t === 1) {
        title = "جمع أرقام بمُدخلات";
        goal = "اجمع رقمين من المستخدم واعرض الناتج";
        code = "a = int(input())\\nb = int(input())\\nprint(a + b)";
      } else if (t === 2) {
        title = "التكرار وحساب مجموع";
        goal = "احسب مجموع الأعداد من 1 إلى " + v;
        code = "s = 0\\nfor x in range(1, " + (v + 1) + ")\\n    s += x\\nprint(s)";
        code = code.replace("\\n    ", "\\n    ");
      } else if (t === 3) {
        title = "شرط وطباعة نتيجة";
        goal = "اطبع إن كان الرقم زوجيًا أو فرديًا";
        code = "n = int(input())\\nprint('زوجي' if n % 2 == 0 else 'فردي')";
      } else {
        title = "تعريف دالة بسيطة";
        goal = "اكتب دالة تُرجع مربع العدد";
        code = "def sq(x):\\n    return x * x\\nprint(sq(" + v + "))";
      }
      var example = '<div class="scratch-header">كود بايثون</div><div class="code-block"><code>' + code + "</code></div>";
      list.push({
        videoLabel: base.videoLabel,
        videoTitle: "تمرين: " + title,
        videoSrc: base.videoSrc,
        goalTitle: "هدف الدرس",
        goalText: goal,
        steps: ["اقرأ الهدف", "اكتب الكود المطلوب", "نفّذ وتحقّق من النتيجة"],
        exampleHtml: example,
        codeSample: code,
        quizMeta: { type: "codeLength", value: computeCodeLength(code) }
      });
    }
    return list;
  }
  function generateWebTrack(base) {
    var list = [];
    var baseCode = `<button id="magic-btn">غيّر لون الخلفية</button>\n\n<script>\n  const btn = document.getElementById('magic-btn');\n  btn.addEventListener('click', function () {\n    document.body.style.backgroundColor = '#020617';\n  });\n</script>`;
    list.push({
      videoLabel: base.videoLabel,
      videoTitle: base.videoTitle,
      videoSrc: base.videoSrc,
      goalTitle: base.goalTitle,
      goalText: base.goalText,
      steps: base.steps,
      exampleHtml: '<div class="scratch-header">مثال HTML/CSS/JS مبسط</div><div class="code-block"><code>' + baseCode + "</code></div>",
      codeSample: baseCode,
      quizMeta: { type: "tagCount", value: computeTagCount(baseCode) }
    });
    for (var i = 2; i <= 25; i++) {
      var btns = (i % 3) + 1;
      var title = "أحداث على " + btns + " زر";
      var goal = "أنشئ " + btns + " زر وربط كل زر بحدث يغيّر نصًا مختلفًا";
      var html = "";
      for (var b = 1; b <= btns; b++) {
        html += '<button id="btn' + b + '">زر ' + b + "</button>\\n";
      }
      var js = "";
      for (var b2 = 1; b2 <= btns; b2++) {
        js += "document.getElementById('btn" + b2 + "').addEventListener('click', function(){ document.title = 'تم الضغط على " + b2 + "'; });\\n";
      }
      var code = html + "\\n<script>\\n" + js + "</script>";
      var example = '<div class="scratch-header">مثال واجهة تفاعلية</div><div class="code-block"><code>' + code + "</code></div>";
      list.push({
        videoLabel: base.videoLabel,
        videoTitle: "تمرين: " + title,
        videoSrc: base.videoSrc,
        goalTitle: "هدف الدرس",
        goalText: goal,
        steps: ["أضف العناصر", "اربط الأحداث", "اختبر النتيجة"],
        exampleHtml: example,
        codeSample: code,
        quizMeta: { type: "tagCount", value: computeTagCount(code) }
      });
    }
    return list;
  }
  var courseTracks = {
    scratch: generateScratchTrack(lessonConfigs.scratch),
    python: generatePythonTrack(lessonConfigs.python),
    web: generateWebTrack(lessonConfigs.web)
  };
  function getProgressKey(courseKey) {
    return "rp_course_progress_" + courseKey;
  }
  function getProgress(courseKey) {
    var v = window.localStorage.getItem(getProgressKey(courseKey));
    var n = v ? parseInt(v, 10) : 0;
    if (isNaN(n) || n < 0) n = 0;
    if (n > 24) n = 24;
    return n;
  }
  function setProgress(courseKey, index) {
    var idx = index;
    if (idx < 0) idx = 0;
    if (idx > 24) idx = 24;
    window.localStorage.setItem(getProgressKey(courseKey), String(idx));
  }
  function renderLesson(courseKey, lessonIndex) {
    var track = courseTracks[courseKey];
    if (!track || !stepList || !exampleContainer) return;
    currentCourseKey = courseKey;
    var idx = typeof lessonIndex === "number" ? lessonIndex : getProgress(courseKey);
    var config = track[idx];
    stepList.innerHTML = "";
    config.steps.forEach(function (text, index) {
      var li = document.createElement("li");
      li.textContent = text;
      if (index === 0) {
        li.classList.add("active-step");
      }
      stepList.appendChild(li);
    });
    currentIndex = 0;
    if (prevBtn) {
      prevBtn.disabled = true;
    }
    if (nextBtn) {
      nextBtn.disabled = false;
    }
    exampleContainer.innerHTML = config.exampleHtml;
    if (courseKey === "scratch") {
      var runBtn = exampleContainer.querySelector("#scratch-run");
      var sprite = exampleContainer.querySelector("#scratch-sprite");
      var stage = exampleContainer.querySelector("#scratch-stage");
      if (runBtn && sprite && stage) {
        runBtn.addEventListener("click", function () {
          var w = stage.clientWidth;
          var step = Math.max(10, Math.floor(w / 12));
          var left = 10;
          var id = setInterval(function () {
            left += step;
            sprite.style.transform = "translateX(" + left + "px)";
            if (left >= w - 60) {
              clearInterval(id);
              sprite.style.transform = "translateX(0)";
            }
          }, 80);
        });
      }
    }
    if (videoLabel) {
      videoLabel.textContent = config.videoLabel;
    }
    if (videoTitle) {
      videoTitle.textContent = config.videoTitle;
    }
    if (goalTitle) {
      goalTitle.textContent = config.goalTitle;
    }
    if (goalText) {
      goalText.textContent = config.goalText;
    }
    if (videoIframe && config.videoSrc) {
      videoIframe.src = config.videoSrc;
    }
    if (lessonProgressLabel) {
      lessonProgressLabel.textContent = "التمرين " + (idx + 1) + " من 25 في دورة " + courseNames[courseKey];
    }
    renderQuiz(courseKey, idx, config);
    courseTabs.forEach(function (tab) {
      var key = tab.getAttribute("data-course");
      if (key === courseKey) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });
  }
  if (quizSubmit && quizList) {
    quizSubmit.addEventListener("click", function () {
      var qs = quizList.querySelectorAll("li");
      var total = qs.length;
      var score = 0;
      var idx = getProgress(currentCourseKey);
      var cfg = courseTracks[currentCourseKey][idx];
      var answers = buildQuizQuestions(currentCourseKey, idx, cfg).map(function (q) {
        return q.correctIndex;
      });
      qs.forEach(function (li, qi) {
        var selected = li.querySelector("input[type=radio]:checked");
        var val = selected ? parseInt(selected.value, 10) : -1;
        if (val === answers[qi]) {
          score += 1;
        }
      });
      if (quizResult) {
        quizResult.textContent = "نتيجتك: " + score + " من " + total;
      }
      if (score >= Math.ceil(total * 0.66)) {
        quizPassed = true;
        stopQuizTimer();
        if (quizResult) {
          quizResult.textContent += " تم اجتياز الاختبار، يمكنك الانتقال للتمرين التالي.";
        }
      } else {
        quizPassed = false;
        if (quizResult) {
          quizResult.textContent += " لم تجتز الاختبار، حاول مرة أخرى.";
        }
      }
    });
  }
  if (stepList && prevBtn && nextBtn && exampleContainer) {
    prevBtn.addEventListener("click", function () {
      var idx = getProgress(currentCourseKey);
      var config = courseTracks[currentCourseKey][idx];
      if (!config) return;
      if (currentIndex > 0) {
        currentIndex -= 1;
        var items = stepList.querySelectorAll("li");
        items.forEach(function (li, index) {
          if (index === currentIndex) {
            li.classList.add("active-step");
          } else {
            li.classList.remove("active-step");
          }
        });
        prevBtn.disabled = currentIndex === 0;
        if (nextBtn) {
          nextBtn.disabled = false;
        }
      }
    });
    nextBtn.addEventListener("click", function () {
      var idx = getProgress(currentCourseKey);
      var config = courseTracks[currentCourseKey][idx];
      if (!config) return;
      var items = stepList.querySelectorAll("li");
      if (currentIndex < items.length - 1) {
        currentIndex += 1;
        items.forEach(function (li, index) {
          if (index === currentIndex) {
            li.classList.add("active-step");
          } else {
            li.classList.remove("active-step");
          }
        });
        prevBtn.disabled = currentIndex === 0;
      } else {
        if (quizPassed) {
          var nextLesson = idx + 1;
          if (nextLesson <= 24) {
            setProgress(currentCourseKey, nextLesson);
            renderLesson(currentCourseKey, nextLesson);
          } else {
            setProgress(currentCourseKey, 24);
            renderLesson(currentCourseKey, 24);
          }
        } else {
          if (quizResult) {
            quizResult.textContent = "أكمل واجتز الاختبار قبل الانتقال للتمرين التالي.";
          }
        }
      }
    });
    courseTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        var key = tab.getAttribute("data-course");
        if (key && courseTracks[key]) {
          renderLesson(key, getProgress(key));
        }
      });
    });
    renderLesson("scratch", getProgress("scratch"));
  }
  var loginButton = document.getElementById("login-button");
  var startButton = document.getElementById("start-button");
  var loginModal = document.getElementById("login-modal");
  var loginClose = document.getElementById("login-close");
  var loginCancel = document.getElementById("login-cancel");
  var loginSubmit = document.getElementById("login-submit");
  var loginName = document.getElementById("login-name");
  var loginEmail = document.getElementById("login-email");
  var loginPassword = document.getElementById("login-password");
  var loginError = document.getElementById("login-error");
  var userPill = document.getElementById("user-pill");
  var userNameSpan = document.getElementById("user-name");
  function openLoginModal() {
    if (loginModal) {
      loginModal.classList.add("visible");
      loginError.classList.remove("visible");
    }
  }
  function closeLoginModal() {
    if (loginModal) {
      loginModal.classList.remove("visible");
    }
  }
  function applyUserSession(name) {
    if (userPill && userNameSpan && loginButton) {
      userNameSpan.textContent = name;
      userPill.hidden = false;
      loginButton.textContent = "تسجيل الخروج";
    }
  }
  var storedName = window.localStorage.getItem("rp_user_name");
  if (storedName) {
    applyUserSession(storedName);
  }
  if (loginButton) {
    loginButton.addEventListener("click", function () {
      var loggedIn = !!window.localStorage.getItem("rp_user_name");
      if (loggedIn) {
        window.localStorage.removeItem("rp_user_name");
        if (userPill) {
          userPill.hidden = true;
        }
        loginButton.textContent = "تسجيل الدخول";
      } else {
        openLoginModal();
      }
    });
  }
  if (startButton) {
    startButton.addEventListener("click", function (e) {
      e.preventDefault();
      smoothScrollTo("#scratch-course");
    });
  }
  if (loginClose) {
    loginClose.addEventListener("click", closeLoginModal);
  }
  if (loginCancel) {
    loginCancel.addEventListener("click", closeLoginModal);
  }
  if (loginModal) {
    loginModal.addEventListener("click", function (e) {
      if (e.target === loginModal) {
        closeLoginModal();
      }
    });
  }
  if (loginSubmit) {
    loginSubmit.addEventListener("click", function () {
      var name = loginName ? loginName.value.trim() : "";
      var email = loginEmail ? loginEmail.value.trim() : "";
      var password = loginPassword ? loginPassword.value.trim() : "";
      var valid = name.length >= 2 && email.indexOf("@") > 0 && password.length >= 6;
      if (!valid) {
        if (loginError) {
          loginError.classList.add("visible");
        }
        return;
      }
      window.localStorage.setItem("rp_user_name", name);
      applyUserSession(name);
      closeLoginModal();
    });
  }
  var heroBrowseButton = document.querySelector(".hero-actions .secondary-btn");
  var musicAudio = document.getElementById("bg-music");
  var musicToggle = document.getElementById("music-toggle");
  if (heroBrowseButton) {
    heroBrowseButton.addEventListener("click", function () {
      smoothScrollTo("#courses");
    });
  }
  var audioAvailable = !!(musicAudio && musicAudio.getAttribute("src"));
  var ambientCtx = null;
  var ambientNodes = [];
  var ambientPlaying = false;
  function startAmbient() {
    if (!ambientCtx) {
      ambientCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    var gain = ambientCtx.createGain();
    gain.gain.value = 0.05;
    gain.connect(ambientCtx.destination);
    function osc(freq, type) {
      var o = ambientCtx.createOscillator();
      o.type = type || "sine";
      o.frequency.value = freq;
      o.connect(gain);
      o.start();
      ambientNodes.push(o);
    }
    osc(220, "sine");
    osc(330, "sine");
    osc(440, "triangle");
    ambientPlaying = true;
  }
  function stopAmbient() {
    ambientNodes.forEach(function (o) {
      try {
        o.stop();
      } catch (e) {}
    });
    ambientNodes = [];
    ambientPlaying = false;
  }
  if (musicToggle) {
    if (musicAudio) {
      musicAudio.addEventListener("error", function () {
        audioAvailable = false;
      });
    }
    musicToggle.addEventListener("click", function () {
      if (audioAvailable && musicAudio) {
        if (musicAudio.paused) {
          var playPromise = musicAudio.play();
          if (playPromise && typeof playPromise.then === "function") {
            playPromise.catch(function () {});
          }
          musicToggle.textContent = "إيقاف الموسيقى";
        } else {
          musicAudio.pause();
          musicToggle.textContent = "تشغيل موسيقى هادئة";
        }
      } else {
        if (!ambientPlaying) {
          startAmbient();
          musicToggle.textContent = "إيقاف الموسيقى";
        } else {
          stopAmbient();
          musicToggle.textContent = "تشغيل موسيقى هادئة";
        }
      }
    });
  }
  var courseViewLinks = document.querySelectorAll(".course-view");
  courseViewLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        smoothScrollTo(href);
      }
    });
  });
  var startCourseButtons = document.querySelectorAll(".start-course-btn");
  startCourseButtons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var courseKey = btn.getAttribute("data-course");
      if (courseKey && courseTracks[courseKey]) {
        renderLesson(courseKey, getProgress(courseKey));
        smoothScrollTo("#lesson-player");
      } else {
        smoothScrollTo("#lesson-player");
      }
    });
  });
});
