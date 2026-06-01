# Host this portfolio on GitHub Pages

Repository name: `yesh.portfolio`

Expected site URL if your GitHub username is `singhyeshwant`:

`https://singhyeshwant.github.io/yesh.portfolio/`

## What has already been prepared

- `vite.config.js` has been updated to:

```js
base: "/yesh.portfolio/",
```

- `.github/workflows/deploy.yml` has been added so GitHub can build and deploy the Vite React project automatically.
- `public/.nojekyll` has been added.
- `index.html` canonical/Open Graph image URLs have been set for `https://singhyeshwant.github.io/yesh.portfolio/`.

If your GitHub username is not `singhyeshwant`, update those URLs in `index.html`.

## Upload steps

1. Create a new GitHub repository named exactly:

```txt
yesh.portfolio
```

2. Extract this ZIP on your Mac.

3. Open Terminal inside the extracted folder and run:

```bash
git init
git add .
git commit -m "Initial portfolio deployment"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/yesh.portfolio.git
git push -u origin main
```

Example for `singhyeshwant`:

```bash
git remote add origin https://github.com/singhyeshwant/yesh.portfolio.git
git push -u origin main
```

4. On GitHub, open the repository.

5. Go to:

```txt
Settings → Pages
```

6. Under **Build and deployment**, set **Source** to:

```txt
GitHub Actions
```

7. Go to the **Actions** tab and wait for the deployment workflow to finish.

8. Open:

```txt
https://YOUR_GITHUB_USERNAME.github.io/yesh.portfolio/
```

For `singhyeshwant`:

```txt
https://singhyeshwant.github.io/yesh.portfolio/
```

## Common fixes

### Blank page after deployment
Check `vite.config.js`. It must say:

```js
base: "/yesh.portfolio/",
```

### GitHub Action fails during install
Try running this locally first:

```bash
npm install
npm run build
```

Then push again.

### Page shows 404
Make sure:

- Repository name is exactly `yesh.portfolio`
- Branch is `main`
- GitHub Pages source is set to `GitHub Actions`
- The Actions workflow completed successfully
