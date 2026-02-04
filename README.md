```md
🔮 Copilot Commit Crystalball
=============================

An AI-powered CLI tool that reviews your **staged Git commits** and predicts risks **before you commit**.

Copilot Commit Crystalball acts like a crystal ball 🔮 for your Git workflow —
it analyzes your staged changes and tells you **what might go wrong before you commit**.

---

## ❓ What Problem Does This Solve?

Many developers commit code without fully understanding:

- What exactly changed
- Whether the change is risky
- If the commit message is meaningful
- If the change may cause future bugs
- If documentation or context is missing

Copilot Commit Crystalball helps you **pause and reflect** before committing by providing AI-powered risk analysis and suggestions.

---

## ✨ Features

- 🔍 Analyzes **staged changes** (`git add`)
- 🤖 Uses **GitHub Copilot CLI** for AI-based analysis
- ⚠️ Detects:
  - Vague or unclear changes
  - Poor commit practices
  - Missing documentation or context
  - Potential risks or confusion
- 💻 Works on **Windows CMD**
- 🧠 Falls back to local analysis if Copilot model is unavailable
- 🛠 Designed for real developer workflows

---

## 📁 Project Structure

```

copilot-commit-crystalball/
├─ crystalball.js    # Main CLI tool
├─ package.json      # Node.js configuration
├─ README.md         # Documentation
└─ LICENSE           # MIT License

````

---

## 🚀 Requirements

- Node.js (v18 or later recommended)
- Git
- GitHub CLI (`gh`)
- GitHub Copilot CLI access enabled

---

## ▶️ How to Run Crystalball

```bat
node crystalball.js
````

> Crystalball only analyzes **staged files**.

---

## 🧪 How to Test With a Buggy File

### 1️⃣ Create a broken file (example: HTML)

```html
<html>
<head>
  <title>Broken Page</title>
</head>
<body>
  <h1>Hello World
  <p>This paragraph is not closed

  <script>
    function broken() {
      alert("Broken")
  </script>
</body>
</html>
```

---

### 2️⃣ Stage the file (required)

```bat
git add test.html
```

---

### 3️⃣ Run Crystalball

```bat
node crystalball.js
```

---

### 4️⃣ Expected Result

Crystalball should warn about:

* Missing closing HTML tags
* Broken JavaScript syntax
* Invalid structure
* Risky or unclear code
* High risk level

---

## 📝 Notes

* Crystalball does **not** modify files
* Crystalball does **not** auto-commit
* Only staged files are analyzed

---

## 📜 License

MIT License
See the `LICENSE` file for details.

```
```

