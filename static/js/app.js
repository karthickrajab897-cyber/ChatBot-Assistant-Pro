document.addEventListener("DOMContentLoaded", () => {

    // --- Loading Screen Logic ---
    setTimeout(() => {
        const loadingScreen = document.getElementById("loadingScreen");
        const mainApp = document.getElementById("mainApp");
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.remove(); // Completely remove to avoid d-flex !important override
            mainApp.style.setProperty('display', 'flex', 'important');
        }, 500);
    }, 1000); // Artificial delay to show loading animation

    // --- DOM Elements ---
    const chatForm = document.getElementById("chatForm");
    const userInput = document.getElementById("userInput");
    const chatWindow = document.getElementById("chatWindow");
    const welcomePanel = document.getElementById("welcomePanel");
    const emptyState = document.getElementById("emptyState");
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const htmlElement = document.documentElement;
    const clearBtn = document.getElementById("clearBtn");

    // Export buttons
    const exportTxtBtn = document.getElementById("btnExportTxt");
    const exportJsonBtn = document.getElementById("btnExportJson");
    const exportStatsBtn = document.getElementById("btnExportStats");

    const searchChat = document.getElementById("searchChat");
    const quickActionCards = document.querySelectorAll(".quick-action-card");
    const viewTitle = document.getElementById("viewTitle");

    // Sidebar toggles
    const openSidebar = document.getElementById("openSidebar");
    const closeSidebar = document.getElementById("closeSidebar");
    const sidebar = document.getElementById("sidebar");

    // SPA Navigation
    const navBtns = document.querySelectorAll(".nav-btn");
    const viewSections = document.querySelectorAll(".view-section");
    const viewSpecificElements = document.querySelectorAll(".view-specific");

    // Stats elements
    const statTotal = document.getElementById("stat-total");
    const statUser = document.getElementById("stat-user");
    const statBot = document.getElementById("stat-bot");
    const statTopic = document.getElementById("stat-topic");
    const statSessions = document.getElementById("stat-sessions");
    const statExports = document.getElementById("stat-exports");
    const statActive = document.getElementById("stat-active");
    const currentDateEl = document.getElementById("currentDate");

    // Chart instances
    let trendChartInstance = null;
    let topicChartInstance = null;

    // --- SPA Navigation Logic ---
    navBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Update active button
            navBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Switch view
            const targetId = btn.getAttribute("data-target");
            viewSections.forEach(section => {
                section.classList.remove("active");
            });
            document.getElementById(targetId).classList.add("active");

            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove("open");
            }

            // Update UI context
            viewSpecificElements.forEach(el => el.classList.add("d-none"));

            if (targetId === "view-chat") {
                viewTitle.textContent = "ChatBot Assistant Pro";
                document.querySelectorAll(".chat-view-specific").forEach(el => el.classList.remove("d-none"));
                scrollToBottom();
            } else if (targetId === "view-analytics") {
                viewTitle.textContent = "Analytics Dashboard";
                updateStats(); // Refresh stats when opening dashboard
            } else if (targetId === "view-export") {
                viewTitle.textContent = "Export Center";
            }
        });
    });

    // --- Date Time ---
    const updateDateTime = () => {
        const now = new Date();
        if (currentDateEl) {
            currentDateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        }
    };
    updateDateTime();
    setInterval(updateDateTime, 60000);

    // --- Sidebar Mobile ---
    if (openSidebar) openSidebar.addEventListener("click", () => sidebar.classList.add("open"));
    if (closeSidebar) closeSidebar.addEventListener("click", () => sidebar.classList.remove("open"));

    // --- Theme Logic ---
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute("data-bs-theme", savedTheme);
    if (themeIcon) {
        if (savedTheme === 'light') {
            themeIcon.classList.remove("fa-moon");
            themeIcon.classList.add("fa-sun");
        } else {
            themeIcon.classList.remove("fa-sun");
            themeIcon.classList.add("fa-moon");
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const currentTheme = htmlElement.getAttribute("data-bs-theme");
            let newTheme = currentTheme === "dark" ? 'light' : 'dark';
            htmlElement.setAttribute("data-bs-theme", newTheme);
            localStorage.setItem('theme', newTheme);

            if (newTheme === 'light') {
                themeIcon.classList.remove("fa-moon");
                themeIcon.classList.add("fa-sun");
            } else {
                themeIcon.classList.remove("fa-sun");
                themeIcon.classList.add("fa-moon");
            }

            // Re-render charts for theme colors
            if (trendChartInstance) updateStats();
        });
    }

    // --- Chart.js Rendering ---
    const renderCharts = (data) => {
        const isDark = htmlElement.getAttribute("data-bs-theme") === 'dark';
        const textColor = isDark ? '#e0e0e0' : '#333';
        const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

        // Trend Chart (Bar)
        const ctxTrend = document.getElementById('trendChart');
        if (ctxTrend) {
            if (trendChartInstance) trendChartInstance.destroy();
            trendChartInstance = new Chart(ctxTrend, {
                type: 'bar',
                data: {
                    labels: data.trend_labels.length ? data.trend_labels : ['No Data'],
                    datasets: [{
                        label: 'Messages',
                        data: data.trend_data.length ? data.trend_data : [0],
                        backgroundColor: '#0d6efd',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: textColor } },
                        x: { grid: { display: false }, ticks: { color: textColor } }
                    }
                }
            });
        }

        // Topic Chart (Pie)
        const ctxTopic = document.getElementById('topicChart');
        if (ctxTopic) {
            if (topicChartInstance) topicChartInstance.destroy();
            topicChartInstance = new Chart(ctxTopic, {
                type: 'doughnut',
                data: {
                    labels: data.topic_labels.length ? data.topic_labels : ['No Data'],
                    datasets: [{
                        data: data.topic_data.length ? data.topic_data : [1],
                        backgroundColor: ['#0d6efd', '#10a37f', '#ffc107', '#dc3545', '#6f42c1'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { color: textColor } }
                    }
                }
            });
        }
    };

    // --- Logic functions ---
    const scrollToBottom = () => {
        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    const updateStats = async () => {
        try {
            const res = await fetch("/stats");
            const data = await res.json();

            // Update Text Stats
            if (statTotal) statTotal.textContent = data.total_messages;
            if (statUser) statUser.textContent = data.total_questions;
            if (statBot) statBot.textContent = data.total_responses;
            if (statTopic) statTopic.textContent = data.most_asked_topic;
            if (statSessions) statSessions.textContent = data.total_sessions;
            if (statExports) statExports.textContent = data.export_count;
            if (statActive) statActive.textContent = data.last_active;

            // Update Charts
            renderCharts(data);

        } catch (error) {
            console.error("Error fetching stats", error);
        }
    };

    const loadHistory = async () => {
        try {
            const res = await fetch("/history");
            const data = await res.json();

            if (data.length > 0) {
                if (welcomePanel) welcomePanel.style.display = "none";
                if (emptyState) emptyState.style.display = "none";

                data.forEach(chat => {
                    appendMessage("user", chat.user_msg, chat.timestamp);
                    appendMessage("bot", chat.bot_msg, chat.timestamp);
                });
                scrollToBottom();
            } else {
                if (welcomePanel) welcomePanel.style.display = "block";
            }
            updateStats();
        } catch (error) {
            console.error("Error loading history", error);
        }
    };
    loadHistory();

    // --- Export Logic ---
    if (exportTxtBtn) {
        exportTxtBtn.addEventListener("click", () => {
            window.location.href = "/export/txt";
            setTimeout(updateStats, 1000);
        });
    }
    if (exportJsonBtn) {
        exportJsonBtn.addEventListener("click", () => {
            window.location.href = "/export/json";
            setTimeout(updateStats, 1000);
        });
    }
    if (exportStatsBtn) {
        exportStatsBtn.addEventListener("click", () => {
            window.location.href = "/export/stats";
            setTimeout(updateStats, 1000);
        });
    }

    // --- Clear History ---
    if (clearBtn) {
        clearBtn.addEventListener("click", async () => {
            if (confirm("Are you sure you want to clear the chat history?")) {
                await fetch("/clear", { method: "POST" });
                const messages = document.querySelectorAll(".message-wrapper");
                messages.forEach(msg => msg.remove());

                if (welcomePanel) welcomePanel.style.display = "none";
                if (emptyState) emptyState.style.display = "block";

                updateStats();
            }
        });
    }

    // --- UI Append Message ---
    const appendMessage = (sender, text, timestamp) => {
        if (welcomePanel && welcomePanel.style.display !== "none") {
            welcomePanel.style.display = "none";
        }
        if (emptyState && emptyState.style.display !== "none") {
            emptyState.style.display = "none";
        }

        const wrapper = document.createElement("div");
        wrapper.className = `message-wrapper ${sender} searchable-message`;

        const avatar = document.createElement("div");
        avatar.className = `avatar ${sender}-avatar`;
        avatar.innerHTML = sender === "bot" ? '<i class="fa-solid fa-robot"></i>' : '<i class="fa-solid fa-user"></i>';

        const bubbleWrap = document.createElement("div");
        bubbleWrap.className = "d-flex flex-column";

        const bubble = document.createElement("div");
        bubble.className = "message-bubble";
        bubble.textContent = text;

        const timeSpan = document.createElement("span");
        timeSpan.className = "message-time";
        timeSpan.textContent = timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        bubble.appendChild(timeSpan);
        bubbleWrap.appendChild(bubble);

        if (sender === "user") {
            wrapper.appendChild(bubbleWrap);
            wrapper.appendChild(avatar);
        } else {
            wrapper.appendChild(avatar);
            wrapper.appendChild(bubbleWrap);
        }

        chatWindow.appendChild(wrapper);
        scrollToBottom();
    };

    // --- Typing Indicator ---
    const showTypingIndicator = () => {
        const wrapper = document.createElement("div");
        wrapper.className = "message-wrapper bot typing-indicator-wrapper";
        wrapper.id = "typingIndicator";

        const avatar = document.createElement("div");
        avatar.className = "avatar bot-avatar";
        avatar.innerHTML = '<i class="fa-solid fa-robot"></i>';

        const bubble = document.createElement("div");
        bubble.className = "message-bubble typing-indicator d-flex align-items-center";

        const textSpan = document.createElement("span");
        textSpan.className = "fs-8 text-muted me-2 fw-medium";
        textSpan.textContent = "Assistant is typing";

        bubble.appendChild(textSpan);
        bubble.innerHTML += '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';

        wrapper.appendChild(avatar);
        wrapper.appendChild(bubble);
        chatWindow.appendChild(wrapper);
        scrollToBottom();
    };

    const removeTypingIndicator = () => {
        const indicator = document.getElementById("typingIndicator");
        if (indicator) indicator.remove();
    };

    // --- Send Message ---
    const sendMessage = async (text) => {
        if (!text) return;

        appendMessage("user", text);
        showTypingIndicator();

        try {
            const res = await fetch("/get", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ msg: text })
            });
            const data = await res.json();

            removeTypingIndicator();
            if (data.error) {
                appendMessage("bot", "Sorry, an error occurred.");
            } else {
                appendMessage("bot", data.response, data.timestamp);
                updateStats();
            }
        } catch (error) {
            removeTypingIndicator();
            appendMessage("bot", "Network error. Please try again.");
        }
    };

    if (chatForm) {
        chatForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const text = userInput.value.trim();
            if (text) {
                userInput.value = "";
                sendMessage(text);
            }
        });
    }

    quickActionCards.forEach(card => {
        card.addEventListener("click", () => {
            const msg = card.getAttribute("data-msg");
            if (msg) sendMessage(msg);
        });
    });

    // --- Search logic ---
    if (searchChat) {
        searchChat.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            const messages = document.querySelectorAll(".searchable-message");

            messages.forEach(msg => {
                const bubble = msg.querySelector(".message-bubble");
                const textNodes = Array.from(bubble.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
                let fullText = "";
                textNodes.forEach(node => fullText += node.textContent);

                if (!fullText) {
                    fullText = bubble.textContent.replace(msg.querySelector(".message-time").textContent, "");
                }

                if (fullText.toLowerCase().includes(query) && query !== "") {
                    msg.style.display = "flex";
                    const regex = new RegExp(`(${query})`, "gi");
                    const newHtml = fullText.replace(regex, "<span class='highlight'>$1</span>");
                    const timeSpan = msg.querySelector(".message-time").outerHTML;
                    bubble.innerHTML = newHtml + timeSpan;
                } else if (query === "") {
                    msg.style.display = "flex";
                    const timeSpan = msg.querySelector(".message-time").outerHTML;
                    bubble.innerHTML = fullText + timeSpan;
                } else {
                    msg.style.display = "none";
                }
            });
        });
    }

    // --- Typewriter ---
    const typedTextElement = document.getElementById("typed-text");
    if (typedTextElement) {
        const textToType = "Your AI-powered assistant for Python, AI, Machine Learning, Flask, Web Development, Data Science, and Technology.";
        let i = 0;
        const typeWriter = () => {
            if (i < textToType.length) {
                typedTextElement.innerHTML += textToType.charAt(i);
                i++;
                setTimeout(typeWriter, 35);
            }
        };
        setTimeout(typeWriter, 1500); // Wait for loading screen to finish
    }
});
