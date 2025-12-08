// ページが開かれたら、保存されているデータを読み込む
document.addEventListener('DOMContentLoaded', restoreOptions);

// 保存ボタンが押されたら保存する
document.getElementById('saveTarget').addEventListener('click', saveTargetUrl);
document.getElementById('addBlock').addEventListener('click', addBlockUrl);

// ★デフォルトURLを定数として定義
const DEFAULT_URL = 'https://youtu.be/dQw4w9WgXcQ';

// 1. リダイレクト先URLを保存する関数
function saveTargetUrl() {
  const targetUrl = document.getElementById('targetUrl').value;
  chrome.storage.local.set({ targetUrl: targetUrl }, () => {
    document.getElementById('currentTarget').textContent = targetUrl || DEFAULT_URL;
    alert('リダイレクト先を保存しました');
  });
}

// 2. ブロックするドメインを追加する関数
function addBlockUrl() {
  const blockUrl = document.getElementById('blockUrl').value.trim();
  if (!blockUrl) return;

  chrome.storage.local.get({ blockList: [] }, (result) => {
    const list = result.blockList;
    if (!list.includes(blockUrl)) {
      list.push(blockUrl);
      chrome.storage.local.set({ blockList: list }, () => {
        document.getElementById('blockUrl').value = '';
        renderList(list);
      });
    }
  });
}

// 3. データ読み込み関数（★ここを変更）
function restoreOptions() {
  // 保存データがない場合、デフォルトURLを使う
  chrome.storage.local.get({ targetUrl: DEFAULT_URL, blockList: [] }, (result) => {
    document.getElementById('currentTarget').textContent = result.targetUrl;
    document.getElementById('targetUrl').value = result.targetUrl;
    renderList(result.blockList);
  });
}

// 4. リスト描画関数
function renderList(list) {
  const ul = document.getElementById('blockList');
  ul.innerHTML = ''; 

  list.forEach((domain) => {
    const li = document.createElement('li');
    li.textContent = domain;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '削除';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = () => removeBlockUrl(domain);

    li.appendChild(deleteBtn);
    ul.appendChild(li);
  });
}

// 5. 削除関数
function removeBlockUrl(domainToRemove) {
  chrome.storage.local.get({ blockList: [] }, (result) => {
    const newList = result.blockList.filter(domain => domain !== domainToRemove);
    chrome.storage.local.set({ blockList: newList }, () => {
      renderList(newList);
    });
  });
}