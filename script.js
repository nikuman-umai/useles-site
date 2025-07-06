// --- 豆知識データ ---
const USELESS_TRIVIA = [
    "人間の鼻の穴は、常に片方ずつ交互に優位に呼吸している。約3〜4時間ごとに切り替わるが、ほとんどの人は気づかない。",
    "もし地球上の全ての砂粒を数えようとすると、一人で数え続けても約3000年以上かかる計算になる。",
    "月の光は、地球に届くまでに約1.3秒かかる。そのため、私たちが見ている月は常に1.3秒前の姿である。",
    "コアラは一日に20時間近く眠るが、その理由の多くはユーカリの葉の栄養価が低すぎて、エネルギーを節約するためである。",
    "世界で最も大きな雪の結晶は、1887年にアメリカのモンタナ州で観測されたもので、直径約38センチメートルだったと記録されている。",
    "一般的なシャープペンシルの芯1本で、約50kmの線を書くことができる。ただし、途中で折れたり、紙との摩擦で消耗するため、実際にそこまで書き続けることは不可能である。",
    "もし地球上の全ての昆虫を数えようとすると、一秒に1匹数えても数兆年かかるだろう。そして、その間に新しい昆虫が生まれ続ける。",
    "世界で最も大きなコンクリートの塊は、中国の三峡ダムである。しかし、そのコンクリートのわずか数ミリを削り取ったとしても、地球の自転には全く影響しない。"
];

const SLIGHTLY_USEFUL_TRIVIA = [
    "スマートフォンの画面がフリーズして操作不能になった場合、電源ボタンと音量下げるボタン（または上げるボタン）を同時に10秒以上長押しすると、強制的に再起動できることが多い。ただし、機種によっては異なる。",
    "調理中に玉ねぎを切って涙が出るときは、切る前に玉ねぎを冷蔵庫で30分ほど冷やすと、刺激成分の揮発を抑えられ、涙が出にくくなる。ただし、冷やしすぎると風味が落ちる場合がある。",
    "靴紐がほどけやすいと感じるなら、通常の蝶々結びのあと、もう一度だけ紐をクロスさせて結ぶと、ほどけにくくなる（二重結びの一種）。ただし、見た目が少しごつくなることもある。",
    "古くなった新聞紙は、窓ガラスを拭くのに非常に効果的で、繊維が残らずピカピカになる。ただし、インクが手に付くので手袋をした方が良い。",
    "災害時などで停電した際、スマートフォンのライトを水の入ったペットボトルに当てることで、簡易的なランタンとして部屋を明るくできる。ただし、光量は限られる。",
    "段ボール箱を開ける際、カッターがない場合は、定規や硬貨の縁で強く押し付けると、比較的きれいに破ることができる。ただし、手が滑らないように注意すること。",
    "電子レンジで冷めたピザを温め直す際、一緒に小さな耐熱性のコップに水を入れて温めると、ピザが乾燥しにくく、生地がもちもちになる。ただし、効果は限定的かもしれない。",
    "油性ペンで書いてしまったホワイトボードの落書きは、アルコール消毒液や除光液を布に含ませて拭くと落とせる場合がある。ただし、ボードの素材によっては跡が残る可能性もあるので、目立たない場所で試すこと。"
];

// 無駄:微益の比率 (例: 5:1なので、6回に1回が微益)
const USELESS_TO_SLIGHTLY_USEFUL_RATIO = 6;

// デバッグ用パスワード (このパスワードはあなたしか知らない、安全なものに設定してください)
const DEBUG_PASSWORD = "zz939721"; // ★★★ ここを「zz939721」に変更しました！ ★★★

// HTML要素の取得
const triviaDisplay = document.getElementById('trivia-display');
const getTriviaButton = document.getElementById('get-trivia-button');
const submitTriviaButton = document.getElementById('submit-trivia-button');

// 新しく追加するデバッグ用パスワード入力要素
const debugPasswordInput = document.createElement('input');
debugPasswordInput.type = 'password';
debugPasswordInput.placeholder = 'デバッグパスワード';
debugPasswordInput.style.marginTop = '15px'; // 見た目を調整
debugPasswordInput.style.padding = '8px';
debugPasswordInput.style.borderRadius = '5px';
debugPasswordInput.style.border = '1px solid #ccc';
debugPasswordInput.style.width = 'calc(100% - 20px)'; // 幅を調整
debugPasswordInput.style.maxWidth = '250px';
debugPasswordInput.style.display = 'block'; // ブロック要素にする
debugPasswordInput.style.margin = '15px auto 0 auto'; // 中央寄せにする

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
            debugPasswordInput.style.display = 'none'; // パスワード入力欄を非表示にする
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


// ページロード時の初期チェック
window.onload = () => {
    const today = new Date().toISOString().slice(0, 10);
    const { lastShownDate, lastShownTrivia } = getStoredData();

    // ページにデバッグ用パスワード入力欄を追加
    // triviaDisplay の直後、または getTriviaButton の直後など、適切な場所に追加してください
    // ここでは getTriviaButton の直後に追加します
    getTriviaButton.parentNode.insertBefore(debugPasswordInput, getTriviaButton.nextSibling);


    if (lastShownDate === today) {
        triviaDisplay.textContent = `今日の知識はすでに表示されました。\n明日またお越しください！\n\n【今日の知識】\n${lastShownTrivia}`;
        getTriviaButton.disabled = true;
        getTriviaButton.textContent = "明日に期待";
    }
};
