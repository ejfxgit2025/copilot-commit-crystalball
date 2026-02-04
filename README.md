# 🔮 Copilot Commit Crystalball

> An AI-powered CLI tool that reviews your staged Git commits and predicts risks **before you commit**.

**Copilot Commit Crystalball** acts like a *crystal ball* 🔮 for your Git workflow —  
it analyzes your staged changes and tells you **what might go wrong before you commit**.

---

## ❓ What Problem Does This Solve?

Many developers commit code without fully understanding:

- What exactly changed
- Whether the change is risky
- If the commit message is meaningful
- If the change may cause future bugs
- If documentation or context is missing

**Copilot Commit Crystalball** helps you *pause and reflect* before committing by giving
AI-powered risk analysis and suggestions.

---

## ✨ Features

- 🔍 Analyzes **staged changes** (`git add`)
- 🤖 Uses **GitHub Copilot CLI** for AI-based analysis
- ⚠️ Detects:
  - Vague or unclear changes
  - Poor commit practices
  - Missing documentation/context
  - Potential risks or confusion
- 💻 Works on **Windows CMD**
- 🧠 Falls back to **local analysis** if Copilot model is unavailable
- 🛠 Designed for **real developer workflows**

---

## 📁 Project Structure

```text
copilot-commit-crystalball/
├─ crystalball.js    # Main CLI tool
├─ package.json      # Node.js configuration
└─ README.md         # Documentation
