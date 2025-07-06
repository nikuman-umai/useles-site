// --- 豆知識データ ---
// ここに「無駄知識」と「微益な豆知識」を記述します。
// 健全版として、より一般向けで安全な内容に調整しました。
const USELESS_TRIVIA = [
    "パンダの赤ちゃんは生まれてくる時、バターくらいの大きさしかない。",
    "世界で最も使われている名前は「ムハンマド」である。",
    "ハチドリは後ろ向きに飛ぶことができる唯一の鳥である。",
    "人間の体内で最も硬い部分はエナメル質（歯）である。",
    "キリンの舌はとても長く、約45センチメートルもある。自分の耳を掃除できるほどだ。",
    "レモンはイチゴよりも多くの糖分を含んでいる。",
    "オオカミの遠吠えは、群れの仲間とのコミュニケーションだけでなく、縄張りを主張するためにも行われる。",
    "ペンギンは膝を持っているが、分厚い羽毛と独特の歩き方のため普段は見えない。",
    "バナナは、木にぶら下がっている時は上向きに成長する。",
    "ブタは空を見上げることができない体の構造をしている。"
];

const SLIGHTLY_USEFUL_TRIVIA = [
    "スマートフォンの充電ケーブルをきれいにまとめるには、マジックテープやケーブルタイを使うと絡まりを防げる。",
    "玉ねぎを切る前に冷蔵庫で冷やすと、刺激成分の揮発が抑えられ、涙が出にくくなることがある。",
    "コーヒーや紅茶を飲む際に、カップの底に少しだけ塩を加えると、苦味が和らぎ、風味が引き立つことがある。",
    "靴の臭いが気になる場合、中に重曹を少量入れた布袋を一晩入れておくと、消臭効果が期待できる。",
    "災害時などで停電した際、スマートフォンのライトを水の入ったペットボトルに当てることで、簡易的なランタンとして部屋を明るくできる。",
    "古くなった歯ブラシは、細かい隙間やタイルの目地、シンク周りの掃除に再利用できる。",
    "電子レンジで温めた食べ物が熱すぎるときは、数分待つか、全体を軽くかき混ぜると均一に冷める。",
    "油性の汚れがついた衣類には、食器用洗剤を直接塗って軽く揉み、しばらく置いてから洗濯すると落ちやすくなる。",
    "スマートフォンで写真を撮る際、フラッシュを使うと光が強すぎて不自然になる場合があるため、自然光を最大限に活用するか、反射板を使うと良い。",
    "乾電池の残量が気になる時、低い高さから落としてみて、すぐに倒れずに立つものは残量が多い傾向がある。（※完全に正確な方法ではない）"
];

// 無駄:微益の比率 (例: 5:1なので、6回に1回が微益)
const USELESS_TO_SLIGHTLY_USEFUL_RATIO = 6;

// デバッグ用パスワード
const DEBUG_PASSWORD = "zz939721"; // あなたのパスワードを設定してください

// HTML要素の取得
const triviaDisplay = document.getElementById('trivia-display');
const getTriviaButton = document.getElementById('get-trivia-button');
const submitTriviaButton = document.getElementById('submit-trivia-button');

// --- デバッグ用パスワード入力要素の作成と追加 ---
const debugPasswordContainer = document.createElement('div');
debugPasswordContainer.id = 'debug-password-container';

const debugPasswordLabel = document.createElement('label');
debugPasswordLabel.textContent = 'Login:';
debugPasswordLabel.htmlFor = 'debug-password-input';

const debugPasswordInput = document.createElement('input');
debugPasswordInput.type = 'password';
debugPasswordInput.id = 'debug-password-input';
debugPasswordInput.placeholder = 'パスワード';

debugPasswordContainer.appendChild(debugPasswordLabel);
debugPasswordContainer.appendChild(debugPasswordInput);
document.body.appendChild(debugPasswordContainer);

// FromZ.ai のPC用とスマホ用フォームのURLを定義
const FORMZU_PC_URL = "https://ws.formzu.net/fgen/S493420122/";
const FORMZU_SP_URL = "https://ws.formzu.net/sfgen/S493420122/";

// 最終表示日をローカルストレージに保存
const LAST_SHOWN_DATE_KEY = 'lastShownDate';
const LAST_SHOWN_TRIVIA_KEY = 'lastShownTrivia'; // 表示された豆知識も保存

// デバッグモードの状態を保持するフラグ
let isDebugMode = false;

function getStoredData() {
    const lastShownDate = localStorage.getItem(LAST_SHOWN_DATE_KEY);
    const lastShownTrivia = localStorage.getItem(LAST_SHOWN_TRIVIA_KEY);
    return { lastShownDate, lastShownTrivia };
}

function updateStoredData(date, trivia) {
    localStorage.setItem(LAST_SHOWN_DATE_KEY, date);
    localStorage.setItem(LAST_SHOWN_TRIVIA_KEY, trivia);
}

// 豆知識の選択ロジック
function getRandomTrivia() {
    let triviaText;
    let triviaType;

    if (Math.floor(Math.random() * USELESS_TO_SLIGHTLY_USEFUL_RATIO) === 0) {
        triviaType = "微益";
        triviaText = SLIGHTLY_USEFUL_TRIVIA[Math.floor(Math.random() * SLIGHTLY_USEFUL_TRIVIA.length)];
    } else {
        triviaType = "無駄";
        triviaText = USELESS_TRIVIA[Math.floor(Math.random() * USELESS_TRIVIA.length)];
    }
    return { text: triviaText, type: triviaType };
}

// 豆知識の表示処理
function showDailyTrivia() {
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"形式
    const { lastShownDate, lastShownTrivia } = getStoredData();

    // デバッグモードが有効な場合、または今日の知識がまだ表示されていない場合
    if (isDebugMode || lastShownDate !== today) {
        const { text, type } = getRandomTrivia();
        triviaDisplay.textContent = `【今日の${type}知識】\n\n${text}`;
        getTriviaButton.textContent = "次の知識を解禁"; // デバッグモード中はボタンを「次の知識を解禁」に
        
        if (!isDebugMode) { // デバッグモードでない場合のみ、日付と知識を保存してボタンを無効化
            updateStoredData(today, text);
            getTriviaButton.disabled = true;
            getTriviaButton.textContent = "明日また来るのだ";
        }

    } else {
        // 今日の知識が既に表示されており、デバッグモードでない場合
        triviaDisplay.textContent = `今日の知識はすでに表示されました。\n明日またお越しください！\n\n【今日の知識】\n${lastShownTrivia}`;
        getTriviaButton.disabled = true;
        getTriviaButton.textContent = "明日に期待";
    }
}

// --- イベントリスナー ---

// 「知識を解禁する」ボタン
getTriviaButton.addEventListener('click', showDailyTrivia);

// 「豆知識を投稿する」ボタン
submitTriviaButton.addEventListener('click', () => {
    let targetFormUrl = FORMZU_PC_URL;

    const isMobile = /Android|webOS|iPhone|iPad|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        targetFormUrl = FORMZU_SP_URL;
    }

    window.open(targetFormUrl, '_blank');
});

// パスワード入力欄でのEnterキー押下イベント
debugPasswordInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        if (debugPasswordInput.value === DEBUG_PASSWORD) {
            isDebugMode = true; // デバッグモードを有効にする
            debugPasswordContainer.classList.remove('visible'); // コンテナを非表示にする
            debugPasswordContainer.style.pointerEvents = 'none'; // イベントも無効にする
            triviaDisplay.textContent = "デバッグモードが有効になりました！\n\n「知識を解禁する」ボタンで何度でも新しい豆知識を表示できます。";
            getTriviaButton.disabled = false; // ボタンを再度有効にする
            getTriviaButton.textContent = "知識を解禁する"; // ボタンのテキストを初期状態に戻す
            console.log("Debug mode activated!"); // コンソールにも表示
            alert("デバッグモードが有効になりました！\n「知識を解禁する」ボタンを何度でも押せます。"); // ユーザーに通知
        } else {
            alert("パスワードが間違っています。");
            debugPasswordInput.value = ''; // 入力値をクリア
        }
    }
});

// デバッグパスワード入力欄にフォーカスが当たったら表示
debugPasswordInput.addEventListener('focus', () => {
    debugPasswordContainer.classList.add('visible');
});

// ページロード時の初期チェック
window.onload = () => {
    const today = new Date().toISOString().slice(0, 10);
    const { lastShownDate, lastShownTrivia } = getStoredData();

    if (lastShownDate === today) {
        triviaDisplay.textContent = `今日の知識はすでに表示されました。\n明日またお越しください！\n\n【今日の知識】\n${lastShownTrivia}`;
        getTriviaButton.disabled = true;
        getTriviaButton.textContent = "明日に期待";
    }
};
