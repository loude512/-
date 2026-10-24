# 让远处朋友通过网址玩游戏

本地 `http://127.0.0.1:5173` 只能让你自己玩。  
同一 Wi-Fi/局域网下，其他设备可以通过服务器打印的局域网网址玩。  
如果朋友在几公里外、使用其他网络，就需要把游戏部署到**公网静态托管**。

这个游戏是纯静态的：只需 `index.html`、`style.css`、`game.js` 和 `assets/`。  
不需要运行 Node.js 服务器，所以非常适合免费托管。

## 方式一：Vercel（推荐）

1. 安装并登录 Vercel：

```bash
npm i -g vercel
vercel login
```

2. 在项目目录执行：

```bash
npm run deploy
```

3. 完成后终端会输出类似：

```
https://zombie-side-scroller.vercel.app
```

4. 把这个网址发给朋友，浏览器打开即可。项目已包含 `vercel.json`。

> 如果没有全局安装 Vercel，也可以执行：`npx vercel --prod`

## 方式二：Netlify

```bash
npm i -g netlify-cli
netlify login
npm run deploy:netlify
```

或者打开 [app.netlify.com/drop](https://app.netlify.com/drop)，把这 4 个文件/文件夹拖进去：

- `index.html`
- `style.css`
- `game.js`
- `assets/`

## 方式三：Cloudflare Pages

```bash
npx wrangler login
npm run deploy:cloudflare
```

## 方式四：GitHub Pages

项目已包含 `.github/workflows/deploy.yml`，推送后可以使用 GitHub Actions 自动发布，通常不需要 VPN。

1. 在 GitHub 创建一个 **Public（公开）** 仓库，例如 `zombie-game`
2. 把项目所有文件上传到仓库根目录，保留 `assets/` 和 `.github/` 目录
3. 打开仓库 `Settings` → `Pages`
4. `Source` 选择 **GitHub Actions**
5. 等待 Actions 完成后，得到类似：

```
https://你的用户名.github.io/zombie-game/
```

如果用 Git 上传：

```bash
git init
git add .
git commit -m "Add zombie game"
git branch -M main
git remote add origin https://github.com/你的用户名/zombie-game.git
git push -u origin main
```

注意：

- 仓库必须是公开的，否则 GitHub Pages 默认不可用。
- `index.html`、`style.css`、`game.js`、`assets/player.png` 必须保持原有相对路径。
- 部署后可能需要等 1-2 分钟。

## 临时测试：内网穿透

如果只是想临时让朋友连你电脑上的服务器，可以用内网穿透工具，例如：

```bash
cloudflared tunnel --url http://localhost:5173
```

或：

```bash
npx localtunnel --port 5173
```

这类工具会给你一个临时 https 网址。适合测试，不适合长期稳定分享，因为网址可能会变化。
