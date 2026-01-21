// ================================================
// Main Application
// ================================================

class OshikatsuTalkApp {
    constructor() {
        this.questionsLoader = new QuestionsLoader();
        this.gachaAnimation = new GachaAnimation();

        // Current state
        this.currentCategory = null;
        this.currentMode = 'normal';
        this.questionHistory = [];
        this.maxHistorySize = 10;

        // DOM elements
        this.categoryScreen = null;
        this.questionScreen = null;
        this.categoryButtons = null;
        this.modeButtons = null;
        this.questionCard = null;
        this.questionIcon = null;
        this.questionCategory = null;
        this.questionText = null;
        this.actionButtons = null;
        this.nextQuestionBtn = null;
        this.backToCategoryBtn = null;
    }

    // Initialize app
    async init() {
        // Load questions data
        const loaded = await this.questionsLoader.load();
        if (!loaded) {
            alert('質問データの読み込みに失敗しました。ページを再読み込みしてください。');
            return;
        }

        // Initialize gacha animation
        this.gachaAnimation.init();

        // Get DOM elements
        this.categoryScreen = document.getElementById('categoryScreen');
        this.questionScreen = document.getElementById('questionScreen');
        this.categoryButtons = document.getElementById('categoryButtons');
        this.modeButtons = document.querySelectorAll('.mode-btn');
        this.questionCard = document.getElementById('questionCard');
        this.questionIcon = document.getElementById('questionIcon');
        this.questionCategory = document.getElementById('questionCategory');
        this.questionText = document.getElementById('questionText');
        this.actionButtons = document.getElementById('actionButtons');
        this.nextQuestionBtn = document.getElementById('nextQuestionBtn');
        this.backToCategoryBtn = document.getElementById('backToCategoryBtn');

        // Render categories
        this.renderCategories();

        // Set up event listeners
        this.setupEventListeners();
    }

    // Render category buttons
    renderCategories() {
        const categories = this.questionsLoader.getCategories();

        this.categoryButtons.innerHTML = categories.map(category => `
            <button 
                class="category-btn" 
                data-category-id="${category.id}"
                style="--category-color: ${category.color}"
            >
                <div class="category-btn__icon">${category.icon}</div>
                <div class="category-btn__name">${category.name}</div>
            </button>
        `).join('');
    }

    // Set up event listeners
    setupEventListeners() {
        // Mode toggle buttons
        this.modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                this.switchMode(mode);
            });
        });

        // Category button clicks
        this.categoryButtons.addEventListener('click', (e) => {
            const btn = e.target.closest('.category-btn');
            if (btn) {
                const categoryId = btn.dataset.categoryId;
                this.selectCategory(categoryId);
            }
        });

        // Next question button
        this.nextQuestionBtn.addEventListener('click', () => {
            this.showNextQuestion();
        });

        // Back to category button
        this.backToCategoryBtn.addEventListener('click', () => {
            this.backToCategories();
        });
    }

    // Switch mode (normal or deep)
    switchMode(mode) {
        this.currentMode = mode;
        this.questionsLoader.setMode(mode);

        // Update UI
        this.modeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Reset question history when mode changes
        this.questionHistory = [];
    }

    // Select category and show first question
    async selectCategory(categoryId) {
        this.currentCategory = this.questionsLoader.getCategoryById(categoryId);
        if (!this.currentCategory) return;

        // Reset question history for new category
        this.questionHistory = [];

        // Switch to question screen
        this.categoryScreen.classList.remove('active');
        this.questionScreen.classList.add('active');

        // Show first question with gacha animation
        await this.showNextQuestion();
    }

    // Show next question with gacha animation
    async showNextQuestion() {
        if (!this.currentCategory) return;

        // Hide question card and action buttons
        this.questionCard.classList.add('hidden');
        this.actionButtons.classList.add('hidden');

        // Get random question
        const question = this.questionsLoader.getRandomQuestion(
            this.currentCategory.id,
            this.questionHistory
        );

        if (!question) {
            alert('質問が見つかりませんでした。');
            return;
        }

        // Add to history
        this.questionHistory.push(question);
        if (this.questionHistory.length > this.maxHistorySize) {
            this.questionHistory.shift();
        }

        // Play gacha animation
        await this.gachaAnimation.play();

        // Update question card content
        this.questionIcon.textContent = this.currentCategory.icon;
        this.questionCategory.textContent = this.currentCategory.name;
        this.questionText.textContent = question.text;

        // Show question card with reveal animation
        this.questionCard.classList.remove('hidden');
        this.questionCard.classList.add('gacha-reveal');

        // Remove reveal class after animation
        setTimeout(() => {
            this.questionCard.classList.remove('gacha-reveal');
        }, 800);

        // Show action buttons after a short delay
        setTimeout(() => {
            this.actionButtons.classList.remove('hidden');
        }, 400);
    }

    // Back to category selection
    backToCategories() {
        // Reset states
        this.currentCategory = null;
        this.questionHistory = [];
        this.gachaAnimation.reset();

        // Hide question card and action buttons
        this.questionCard.classList.add('hidden');
        this.actionButtons.classList.add('hidden');

        // Switch to category screen
        this.questionScreen.classList.remove('active');
        this.categoryScreen.classList.add('active');
    }
}

// ================================================
// App Initialization
// ================================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const app = new OshikatsuTalkApp();
    app.init();
});

// Register Service Worker for PWA (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}
