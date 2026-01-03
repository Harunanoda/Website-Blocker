// タブが更新されたら毎回チェックするイベント
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // URLが変わったとき（ページ読み込み時）だけチェックを実行
  if (changeInfo.url) {
    checkUrl(tabId, changeInfo.url);
  }
});

function checkUrl(tabId, currentUrl) {
  // ★ここを変更: targetUrlのデフォルト値を設定
  const defaultUrl = "https://youtu.be/dQw4w9WgXcQ";

  chrome.storage.local.get({ targetUrl: defaultUrl, blockList: [] }, (data) => {
    const { targetUrl, blockList } = data;

    // もし今開いているのが「飛ばす先」そのものなら、何もしない（無限ループ防止）
    if (currentUrl.includes(targetUrl)) return;

    // 今のURLの中に、ブロックリストの文字が含まれているかチェック
    const isBlocked = blockList.some((domain) => currentUrl.includes(domain));

    if (isBlocked) {
      // ブロック対象なら、強制的にターゲットURLへ書き換える
      chrome.tabs.update(tabId, { url: targetUrl });
    }
  });
}
