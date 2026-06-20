// 認証管理システム
async function validateAccess() {
    const currentPage = window.location.pathname.split("/").pop();

    // すでにログイン済み
    if (sessionStorage.getItem("beta_access") === "granted") {
        hideOverlay();
        return;
    }

    // GitHub Pages の index.html は "" または "index.html" になる
    const isIndex = (currentPage === "" || currentPage === "index.html");

    if (isIndex) {
        const input = prompt("パスワードを入力してください（ベータサイト用）:");
        if (!input) return redirect403();

        // SHA-256 ハッシュ化
        const buffer = new TextEncoder().encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hexResult = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // 照合キー
        const key = "7c65da985392bda40656708453488880608fa8fa7924d5598687ba4efdc84360";

        if (hexResult !== key) {
            return redirect403();
        }

        // 認証成功
        sessionStorage.setItem("beta_access", "granted");
        hideOverlay();
        return;
    }

    // index 以外のページに未ログインで来た場合
    if (currentPage !== "403.html") {
        return redirect403();
    }

    // 403 ページはオーバーレイを外す
    hideOverlay();
}

// 共通関数
function redirect403() {
    window.location.href = "/403.html"; // GitHub Pages では絶対パス推奨
}

function hideOverlay() {
    const overlay = document.getElementById("loading-overlay");
    if (overlay) overlay.style.display = "none";
}

document.addEventListener('DOMContentLoaded', validateAccess);
