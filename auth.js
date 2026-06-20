　　// 認証管理システム
async function validateAccess() {
    // 現在のファイル名を取得
    const currentPage = window.location.pathname.split("/").pop();

    // すでにログイン済みの合図がある場合 
    if (sessionStorage.getItem("beta_access") === "granted") {
        const overlay = document.getElementById("loading-overlay");
        if (overlay) overlay.style.display = "none";
        return;
    }

    // トップページ（index.html または ルートパス）での処理
    if (currentPage === "index.html" || currentPage === "") {
        const input = prompt("パスワードを入力してください（ベータサイト用）:");
        if (!input) {
            window.location.href = "403.html";
            return;
        }

        // 入力文字の暗号化計算
        const buffer = new TextEncoder().encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hexResult = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // 照合用暗号キー
        const key = "7c65da985392bda40656708453488880608fa8fa7924d5598687ba4efdc84360";

        if (hexResult !== key) {
            window.location.href = "403.html";
        } else {
            sessionStorage.setItem("beta_access", "granted");
            const overlay = document.getElementById("loading-overlay");
            if (overlay) overlay.style.display = "none";
        }
    } else {
        // index.html 以外のページ（規約、ポリシー、404など）に未ログインで直接アクセスしてきた場合
        // 例外として403ページ自体は無限ループを防ぐため除外
        if (currentPage !== "403.html") {
            window.location.href = "403.html";
        } else {
            // 403ページ自体のマスクを外す
            const overlay = document.getElementById("loading-overlay");
            if (overlay) overlay.style.display = "none";
        }
    }
}

// 起動時に実行
document.addEventListener('DOMContentLoaded', validateAccess);


