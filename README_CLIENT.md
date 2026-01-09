# 🌍 GEOSCOPE Intelligence Terminal - User Guide

Welcome to the GEOSCOPE Intelligence Terminal. This guide will help you get the system up and running on your computer.

## 📋 Prerequisites
Before starting, ensure you have **Node.js** installed on your computer. 
*   If you don't have it, download the "LTS" version from [nodejs.org](https://nodejs.org/).

---

## 🚀 How to Start the Terminal

To run the terminal, you need to start two components: the **Backend** (the brain) and the **Frontend** (the interface).

### Step 1: Start the Backend (The Brain)
1.  Open your terminal or command prompt.
2.  Navigate to the `server` folder:
    ```bash
    cd server
    ```
3.  Start the brain:
    ```bash
    npm run dev
    ```
    *Keep this window open.*

### Step 2: Start the Frontend (The Interface)
1.  Open a **second** terminal or command prompt window.
2.  In the main project folder, start the interface:
    ```bash
    npm run dev
    ```
3.  Once it says "Ready", open your web browser and go to:
    **[http://localhost:3000](http://localhost:3000)**

---

## 🛠️ How to Use the Terminal

*   **Search Bar:** Type any keyword, country, or entity at the top to filter the feed in real-time.
*   **Filters:** Use the sidebar to filter news by **Country**, **Region**, or **Language**.
*   **Save Reports:** Click the **Bookmark icon** (top-right of each news item) to save it. View these in the **"Saved Feeds"** tab.
*   **Alerts:** The **"Alerts"** tab shows only critical, AI-recognized high-impact news.
*   **Link Active / Off-Grid:** Use the toggle at the bottom to pause the live data feed if you need to analyze reports without the list moving.
*   **Manual Entry:** Use the `+ Manual Entry` button at the bottom to inject your own reports or field observations into the feed.
*   **Dark/Light Mode:** Use the Sun/Moon icon in the top right to switch visual themes.

---

**Note:** The system requires an active internet connection to fetch the latest global news feeds.
