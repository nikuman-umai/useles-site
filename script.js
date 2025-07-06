// --- 豆知識データ ---
// ここに「無駄知識」と「微益な豆知識」を記述します。
// 実際にはもっとたくさん用意してください！
// この配列を直接編集してGitHubにプッシュすることで、サイトの豆知識を更新します。

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

// HTML要素の取得
const triviaDisplay = document.getElementById('trivia-display');
const getTriviaButton = document.getElementById('get-trivia-button');
const submitTriviaButton = document.getElementById('submit-trivia-button');

// FromZ.ai のPC用とスマホ用フォームのURLを定義
// ★★★ここをあなたのFromZ.aiフォームのURLに置き換えてください★★★
const FORMZU_PC_URL = "https://ws.formzu.net/fgen/S493420122/";
const FORMZU_SP_URL = "https://ws.formzu.net/sfgen/S493420122/";


// 最終表示日をローカルストレージに保存
const LAST_SHOWN_DATE_KEY = 'lastShownDate';
const LAST_SHOWN_TRIVIA_KEY = 'lastShownTrivia'; // 表示された豆知識も保存

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

    // 6回に1回の確率で微益な豆知識を選択
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

    if (lastShownDate === today) {
        // 今日の知識が既に表示されている場合
        triviaDisplay.textContent = `今日の知識はすでに表示されました。\n明日またお越しください！\n\n【今日の知識】\n${lastShownTrivia}`;
        getTriviaButton.disabled = true;
        getTriviaButton.textContent = "明日に期待";
    } else {
        // 今日の知識を新たに表示する場合
        const { text, type } = getRandomTrivia();
        triviaDisplay.textContent = `【今日の${type}知識】\n\n${text}`;
        getTriviaButton.disabled = true;
        getTriviaButton.textContent = "明日また来るのだ";
        updateStoredData(today, text); // 豆知識と日付を保存
    }
}

// --- イベントリスナー ---

// 「知識を解禁する」ボタン
getTriviaButton.addEventListener('click', showDailyTrivia);

// 「豆知識を投稿する」ボタン
submitTriviaButton.addEventListener('click', () => {
    let targetFormUrl = FORMZU_PC_URL; // デフォルトはPC用

    // ユーザーエージェントでモバイルデバイスかどうかを判別
    const isMobile = /Android|webOS|iPhone|iPad|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        targetFormUrl = FORMZU_SP_URL;
    }

    // 新しいタブで適切なFromZ.aiフォームのURLを開く
    window.open(targetFormUrl, '_blank');
});

// ページロード時の初期チェック
window.onload = () => {
    const today = new Date().toISOString().slice(0, 10);
    const { lastShownDate, lastShownTrivia } = getStoredData();

    // ページロード時に既に今日の知識が表示済みであれば、ボタンを無効化し表示内容をセット
    if (lastShownDate === today) {
        triviaDisplay.textContent = `今日の知識はすでに表示されました。\n明日またお越しください！\n\n【今日の知識】\n${lastShownTrivia}`;
        getTriviaButton.disabled = true;
        getTriviaButton.textContent = "明日に期待";
    }
};
