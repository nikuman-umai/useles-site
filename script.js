const triviaList = [
  "富士山は日本一高い山です。",
  "猫はヒゲで周囲の幅を測っています。",
  "日本の国鳥はキジです。",
  "カブトムシは力持ちです。",
  "竹は1日に最大で1m成長することがあります。"
];

// 初期状態ではボタンは有効だけど、1回だけ表示可能にする
let debugMode = false;
let triviaShown = false;

const triviaDisplay = document.getElementById("trivia-display");
const getTriviaButton = document.getElementById("get-trivia-button");
const passwordInput = document.getElementById("passwordInput");

// ボタン押下で豆知識表示
getTriviaButton.addEventListener("click", () => {
  if (!debugMode && triviaShown) {
    alert("通常モードでは一度しか知識を解禁できません。パスワードを入力してデバッグモードを使ってください。");
    return;
  }

  // ランダムに豆知識を選んで表示
  const trivia = triviaList[Math.floor(Math.random() * triviaList.length)];
  triviaDisplay.textContent = trivia;

  triviaShown = true;
});

// Enterキーでパスワード判定＆デバッグモード起動
passwordInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    const pw = this.value.trim();
    if (!pw) {
      alert("パスワードを入力してください");
      return;
    }
    const correctPassword = "秘密のパスワード"; // ←ここを書き換えてください

    if (pw === correctPassword) {
      alert("正しいパスワードです！デバッグモードを起動しました。");
      debugMode = true;
      triviaShown = false; // デバッグモードでは何度でも表示可能に
      this.value = ""; // 入力欄をクリア
    } else {
      alert("パスワードが違います");
    }
  }
});
