/* ============================================================
   TRAVEL PERSONALITY QUIZ — APP LOGIC
   - All 16 questions
   - Personality scoring (last 5 questions)
   - Silently POST to Google Form (saves to Google Sheet)
   ============================================================ */

const FORM_URL = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSeqZjFkN8mrjTgvnZ0BMMPn8q9XERnnsONlU28Ek0Natwturw/formResponse";

// ── Questions ──────────────────────────────────────────────
const QUESTIONS = [
    {
        id: "entry.1850613361",
        text: "How old are you?",
        section: "About You",
        type: "text",
        placeholder: "Enter your age"
    },
    {
        id: "entry.1914495491",
        text: "What is your gender?",
        section: "About You",
        type: "radio",
        options: [
            { text: "Male" },
            { text: "Female" },
            { text: "Prefer not to say" }
        ]
    },
    {
        id: "entry.1409091719",
        text: "What is your current occupation?",
        section: "About You",
        type: "radio",
        options: [
            { text: "Student" },
            { text: "Self Employed" },
            { text: "Working professional" },
            { text: "Business owner" }
        ]
    },
    {
        id: "entry.1879978849",
        text: "What is your monthly income?",
        section: "About You",
        type: "radio",
        options: [
            { text: "No personal income" },
            { text: "Below ₹15,000" },
            { text: "₹15,000 - ₹30,000" },
            { text: "₹30,000 - ₹50,000" },
            { text: "₹50,000 - ₹1,00,000" },
            { text: "Above ₹1,00,000" }
        ]
    },
    {
        id: "entry.2122547714",
        text: "How often do you travel?",
        section: "Travel Habits",
        type: "radio",
        options: [
            { text: "2+ times a year" },
            { text: "Once a year" },
            { text: "Once every 2–3 years" },
            { text: "Rarely" }
        ]
    },
    {
        id: "entry.609325088",
        text: "What usually stops you from travelling more?",
        section: "Travel Habits",
        type: "radio",
        options: [
            { text: "High upfront cost" },
            { text: "Difficulty coordinating with friends" },
            { text: "Lack of time" },
            { text: "Visa / planning issues" },
            { text: "Nothing — I travel freely" }
        ]
    },
    {
        id: "entry.943620366",
        text: "Have you ever avoided or delayed a trip because of money?",
        section: "Travel Habits",
        type: "radio",
        options: [
            { text: "Yes" },
            { text: "No" },
            { text: "Maybe" }
        ]
    },
    {
        id: "entry.474492525",
        text: "When booking a trip, how do you prefer to pay?",
        section: "Payment Preferences",
        type: "radio",
        options: [
            { text: "Full payment at the time of booking" },
            { text: "Partial payment at booking and remaining amount later" },
            { text: "Payment in smaller amounts over a period of time" },
            { text: "Depends on trip cost" }
        ]
    },
    {
        id: "entry.345144969",
        text: "Would spreading the trip cost over multiple months make travel more affordable?",
        section: "Payment Preferences",
        type: "radio",
        options: [
            { text: "Yes" },
            { text: "No" },
            { text: "Maybe" }
        ]
    },
    {
        id: "entry.1706327373",
        text: "If you could pay part of the trip cost now and the rest later, how likely would you choose it?",
        section: "Payment Preferences",
        type: "radio",
        options: [
            { text: "Very likely" },
            { text: "Likely" },
            { text: "Neutral" },
            { text: "Unlikely" }
        ]
    },
    {
        id: "entry.531870487",
        text: "When travelling with friends, how do you usually split expenses?",
        section: "Payment Preferences",
        type: "radio",
        options: [
            { text: "One person pays, others pay later" },
            { text: "UPI transfers immediately" },
            { text: "Apps like Splitwise" }
        ]
    },
    // ── PERSONALITY QUESTIONS (scored) ────────────────────
    {
        id: "entry.2096875707",
        text: "Your ideal place to stay?",
        section: "Your Travel Style",
        type: "radio",
        options: [
            { text: "Luxury resort with full service",     trait: "velvet_voyager" },
            { text: "Remote campsite in nature",           trait: "wild_pathfinder" },
            { text: "Heritage homestay with local hosts",  trait: "culture_weaver" },
            { text: "Lively hostel with other travelers", trait: "tribe_connector" },
            { text: "Cheapest clean room you can find",    trait: "free_minimalist" }
        ]
    },
    {
        id: "entry.1206849812",
        text: "What excites you most during travel?",
        section: "Your Travel Style",
        type: "radio",
        options: [
            { text: "Relaxation, spa, and scenic comfort",     trait: "velvet_voyager" },
            { text: "Trekking, rafting, physical challenges",  trait: "wild_pathfinder" },
            { text: "Museums, food trails, local traditions",  trait: "culture_weaver" },
            { text: "Parties, events, meeting new people",     trait: "tribe_connector" },
            { text: "Freedom to wander without fixed plans",   trait: "free_minimalist" }
        ]
    },
    {
        id: "entry.1457754621",
        text: "How do you usually manage your travel budget?",
        section: "Your Travel Style",
        type: "radio",
        options: [
            { text: "Spend more for smooth comfort",               trait: "velvet_voyager" },
            { text: "Spend on thrilling experiences",              trait: "wild_pathfinder" },
            { text: "Spend on food and cultural entry tickets",    trait: "culture_weaver" },
            { text: "Share costs with friends for fun trips",      trait: "tribe_connector" },
            { text: "Minimize costs to travel longer",             trait: "free_minimalist" }
        ]
    },
    {
        id: "entry.1207669656",
        text: "Who do you prefer travelling with?",
        section: "Your Travel Style",
        type: "radio",
        options: [
            { text: "Partner or small private circle",    trait: "velvet_voyager" },
            { text: "Adventure-focused companions",       trait: "wild_pathfinder" },
            { text: "Solo while connecting with locals",  trait: "culture_weaver" },
            { text: "Big energetic friend group",         trait: "tribe_connector" },
            { text: "Mostly solo and independent",        trait: "free_minimalist" }
        ]
    },
    {
        id: "entry.1756740342",
        text: "How do you usually plan a trip?",
        section: "Your Travel Style",
        type: "radio",
        options: [
            { text: "Pre-planned premium itinerary",                      trait: "velvet_voyager" },
            { text: "Built around outdoor challenges",                    trait: "wild_pathfinder" },
            { text: "Research culture, food, and history deeply",         trait: "culture_weaver" },
            { text: "Follow group trends or friends’ ideas",              trait: "tribe_connector" },
            { text: "Flexible, cheapest plan, adjust on the go",          trait: "free_minimalist" }
        ]
    }
];

// ── Personalities ───────────────────────────────────────────
const PERSONALITIES = {
    velvet_voyager: {
        name: "Velvet Voyager",
        image: "velvet.png",
        traits: ["Luxury", "Comfort", "Fine Dining", "Seamless"],
        desc: "You believe travel is an experience to be savoured, not endured. You value high-end comfort, elegant accommodations, fine dining, and meticulous planning. Your trips are premium by design."
    },
    wild_pathfinder: {
        name: "Wild Pathfinder",
        image: "wild.png",
        traits: ["Adventure", "Nature", "Adrenaline", "Outdoors"],
        desc: "You are the ultimate thrill-seeker. Mountaintops, rapids, and remote trails are your playground. If it pushes your limits and gets the blood pumping, you are absolutely there."
    },
    culture_weaver: {
        name: "Culture Weaver",
        image: "culture.jpg",
        traits: ["History", "Local Cuisine", "Authenticity", "Connection"],
        desc: "You travel to understand humanity. Museums, ancient alleyways, local markets, and elders' stories are your guided tours. You bring a piece of every culture back home with you."
    },
    tribe_connector: {
        name: "Tribe Connector",
        image: "tribe.jpg",
        traits: ["Social", "Groups", "Parties", "Memories"],
        desc: "For you, a trip without a tribe is just a commute. You thrive on energy, laughter, group dynamics, and those wild stories that come from exploring the world with your people."
    },
    free_minimalist: {
        name: "Free Minimalist",
        image: "free.jpg",
        traits: ["Freedom", "Solo", "Budget", "Spontaneous"],
        desc: "Rigid plans are your nemesis. You pack light, spend smart, and let the road take you wherever it leads. A one-way ticket and a backpack are all you need to feel completely free."
    }
};

// ── State ────────────────────────────────────────────────────
let currentQ = 0;
let responses = {};
let scores = { velvet_voyager: 0, wild_pathfinder: 0, culture_weaver: 0, tribe_connector: 0, free_minimalist: 0 };

// ── DOM ──────────────────────────────────────────────────────
const panelImage     = document.getElementById('panel-image');
const personalityBadge = document.getElementById('personality-badge');
const badgeName      = document.getElementById('badge-name');

const screenWelcome  = document.getElementById('screen-welcome');
const screenQuiz     = document.getElementById('screen-quiz');
const screenResult   = document.getElementById('screen-result');

const btnStart       = document.getElementById('btn-start');
const btnRestart     = document.getElementById('btn-restart');

const qCounter       = document.getElementById('q-counter');
const qSection       = document.getElementById('q-section');
const progressFill   = document.getElementById('progress-fill');
const questionText   = document.getElementById('question-text');
const optionsList    = document.getElementById('options-list');

const resultName     = document.getElementById('result-name');
const resultImg      = document.getElementById('result-img');
const resultDesc     = document.getElementById('result-desc');
const resultTraits   = document.getElementById('result-traits');

// ── Screen Transitions ───────────────────────────────────────
function goTo(from, to) {
    from.classList.add('fade-out');
    setTimeout(() => {
        from.classList.remove('fade-out');
        from.classList.add('hidden');
        to.classList.remove('hidden');
    }, 350);
}

// ── Load Question ────────────────────────────────────────────
function loadQuestion() {
    const q = QUESTIONS[currentQ];
    const total = QUESTIONS.length;

    // Header
    qCounter.textContent = `${currentQ + 1} / ${total}`;
    qSection.textContent  = q.section || '';
    progressFill.style.width = `${((currentQ + 1) / total) * 100}%`;

    // Question text
    questionText.textContent = q.text;

    // Clear options
    optionsList.innerHTML = '';

    if (q.type === 'text') {
        // Text input (Age)
        const wrap  = document.createElement('div');
        wrap.className = 'text-input-wrap';

        const inp = document.createElement('input');
        inp.type = 'number';
        inp.className = 'text-input';
        inp.placeholder = q.placeholder || 'Type here...';
        inp.min = 1;
        inp.max = 100;

        const btn = document.createElement('button');
        btn.className = 'btn-primary';
        btn.textContent = 'Continue →';
        btn.style.marginTop = '0.5rem';

        const submit = () => {
            const val = inp.value.trim();
            if (!val) { inp.focus(); return; }
            responses[q.id] = val;
            advance();
        };

        btn.onclick = submit;
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });

        wrap.appendChild(inp);
        wrap.appendChild(btn);
        optionsList.appendChild(wrap);
        setTimeout(() => inp.focus(), 50);

    } else {
        // Radio options
        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `<span class="option-key">${String.fromCharCode(65 + i)}</span><span>${opt.text}</span>`;
            btn.addEventListener('click', () => {
                responses[q.id] = opt.text;
                if (opt.trait) scores[opt.trait]++;
                advance();
            });
            optionsList.appendChild(btn);
        });
    }
}

// ── Advance ──────────────────────────────────────────────────
function advance() {
    currentQ++;
    if (currentQ < QUESTIONS.length) {
        // Animate question change
        screenQuiz.classList.add('fade-out');
        setTimeout(() => {
            screenQuiz.classList.remove('fade-out');
            loadQuestion();
        }, 300);
    } else {
        submitToGoogle();
        showResult();
    }
}

// ── Submit to Google Form ─────────────────────────────────────
function submitToGoogle() {
    // ── Hidden iframe form submit (reliable cross-origin fallback) ─
    try {
        const uid = 'gf_' + Date.now();
        const iframe = Object.assign(document.createElement('iframe'), {
            name: uid, style: 'display:none;position:absolute;width:0;height:0;border:0;'
        });
        const form = document.createElement('form');
        Object.assign(form, { method: 'POST', action: FORM_URL, target: uid });
        form.style.display = 'none';
        for (const [k, v] of Object.entries(responses)) {
            const inp = Object.assign(document.createElement('input'), { type: 'hidden', name: k, value: v });
            form.appendChild(inp);
        }
        document.body.append(iframe, form);
        form.submit();
        console.log('✅ Response submitted to Google Sheet');
        setTimeout(() => { iframe.remove(); form.remove(); }, 6000);
    } catch (e) {
        console.warn('⚠️ Submission error:', e.message);
    }
}

// ── Show Result ──────────────────────────────────────────────
function showResult() {
    // Find the winner
    let winner = Object.keys(scores).reduce((a, b) => scores[a] >= scores[b] ? a : b);
    const p = PERSONALITIES[winner];

    // Populate result screen
    resultName.textContent = p.name;
    resultImg.src = p.image;
    resultImg.alt = p.name;
    resultDesc.textContent = p.desc;

    // Trait tags
    resultTraits.innerHTML = '';
    p.traits.forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'result-trait-tag';
        tag.textContent = t;
        resultTraits.appendChild(tag);
    });

    // Update left image panel
    panelImage.style.backgroundImage = `url('${p.image}')`;

    // Show personality badge on image
    badgeName.textContent = p.name;
    personalityBadge.style.display = 'block';

    // Transition screens
    goTo(screenQuiz, screenResult);
}

// ── Reset ────────────────────────────────────────────────────
function reset() {
    currentQ = 0;
    responses = {};
    for (const k in scores) scores[k] = 0;
    panelImage.style.backgroundImage = `url('bg.png')`;
    personalityBadge.style.display = 'none';
    progressFill.style.width = '0%';
    loadQuestion(); // pre-load q1 so it's ready
    goTo(screenResult, screenWelcome);
}

// ── Init ─────────────────────────────────────────────────────
btnStart.addEventListener('click', () => {
    loadQuestion();
    goTo(screenWelcome, screenQuiz);
});

btnRestart.addEventListener('click', reset);
