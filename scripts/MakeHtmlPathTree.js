// ファイル操作モジュール
const fs = require("fs");
// パス操作用
const path = require("path");

// 監視対象フォルダ
const baseDir = "./pages";

// フォルダを引数にページをツリー構造オブジェクトとして作成
function buildTree(dir) {
    // フォルダ名を取得
    const name = path.basename(dir);
    // フォルダのデータ構造を宣言
    const item = {
        name,
        type: "dir",
        children: []
    };

    // フォルダ内のファイルの中身一覧を取得
    const files = fs.readdirSync(dir);

    // 中身一覧を処理
    files.forEach(file => {
        // フルパス生成
        const fullPath = path.join(dir, file);
        // ファイルorフォルダを判断
        const stat = fs.statSync(fullPath);

        // フォルダの場合
        if (stat.isDirectory()) {
            // メソッドを再帰して子の中身を取得
            item.children.push(buildTree(fullPath));
        }
        // HTMLファイルの場合
        else if (file.endsWith(".html")) {
            // データ構造に登録
            item.children.push({
                name: file,
                type: "file",
                path: fullPath.replace("./", "")
            });
        }
    });

    // フォルダのソート（降順(日付新しい順)）
    item.children.sort((a, b) => {
        // フォルダのみ対象
        if (a.type === "dir" && b.type === "dir") {
            return parseInt(b.name, 10) - parseInt(a.name, 10);
        }
        return 0;
    });
    return item;
}

// ページのツリー構造オブジェクト生成
const tree = buildTree(baseDir);

// ページのツリー構造オブジェクトをjsonに出力
fs.writeFileSync("HtmlPathTree.json", JSON.stringify(tree, null, 2));

// ログ出力
console.log("made HtmlPathTree.json");