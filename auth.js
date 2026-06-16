// 認証管理システム
async function validateAccess() {
    if (sessionStorage.getItem("beta_access") === "granted") {
        const overlay = document.getElementById("loading-overlay");
        if (overlay) overlay.style.display = "none";
        return;
    }

    const input = prompt("パスワードを入力してください（ベータサイト用）:");
    if (!input) {
        window.location.href = "403.html";
        return;
    }

    // 入力文字列の暗号化計算
    const buffer = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hexResult = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // 照合用データ
    const key = "7c65da985392bda40656708453488880608fa8fa7924d5598687ba4efdc84360";

    if (hexResult !== key) {
        window.location.href = "403.html";
    } else {
        sessionStorage.setItem("beta_access", "granted");
        const overlay = document.getElementById("loading-overlay");
        if (overlay) overlay.style.display = "none";
    }
}

// 起動時に認証を実行
document.addEventListener('DOMContentLoaded', validateAccess);
