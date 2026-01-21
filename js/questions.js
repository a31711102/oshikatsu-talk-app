// ================================================
// Questions Data Loader
// ================================================

class QuestionsLoader {
    constructor() {
        this.data = null;
        this.categories = [];
        this.mode = 'normal'; // 'normal' or 'deep'
    }

    // Load questions from JSON file
    async load() {
        try {
            const response = await fetch('data/questions.json');
            if (!response.ok) {
                throw new Error('Failed to load questions data');
            }
            this.data = await response.json();
            this.categories = this.data.categories;
            return true;
        } catch (error) {
            console.error('Error loading questions:', error);
            return false;
        }
    }

    // Set mode (normal or deep)
    setMode(mode) {
        this.mode = mode;
    }

    // Get all categories
    getCategories() {
        return this.categories;
    }

    // Get category by ID
    getCategoryById(id) {
        return this.categories.find(cat => cat.id === id);
    }

    // Get questions for a category (filtered by mode)
    getQuestionsForCategory(categoryId) {
        const category = this.getCategoryById(categoryId);
        if (!category || !category.questions) {
            return [];
        }

        // Filter questions based on current mode
        return category.questions.filter(q => this.isQuestionAllowed(q));
    }

    // Check if question is allowed in current mode
    isQuestionAllowed(question) {
        // データには low/medium のみ含まれる想定
        // （high risk質問は最初から除外）

        if (this.mode === 'normal') {
            // ノーマル: light/medium tone × low risk
            return (question.tone === 'light' || question.tone === 'medium')
                && question.risk === 'low';
        } else {
            // 深堀: medium/deep tone × low/medium risk
            return (question.tone === 'medium' || question.tone === 'deep')
                && (question.risk === 'low' || question.risk === 'medium');
        }
    }

    // Get random question from category (with history to avoid repeats)
    getRandomQuestion(categoryId, history = []) {
        const questions = this.getQuestionsForCategory(categoryId);

        if (questions.length === 0) {
            return null;
        }

        // Filter out recently shown questions
        const availableQuestions = questions.filter(q =>
            !history.some(h => h.text === q.text)
        );

        // If all questions have been shown, reset history
        const questionPool = availableQuestions.length > 0
            ? availableQuestions
            : questions;

        // deep × medium (⑤) の排出率を下げる
        const weightedPool = this.applyWeighting(questionPool);

        const randomIndex = Math.floor(Math.random() * weightedPool.length);
        return weightedPool[randomIndex];
    }

    // Apply weighting to reduce deep × medium question frequency
    applyWeighting(questions) {
        const weighted = [];

        questions.forEach(q => {
            if (q.tone === 'deep' && q.risk === 'medium') {
                // deep × medium は 20% の確率（1回のみ追加）
                weighted.push(q);
            } else {
                // その他は 100% の確率（5回追加で相対的に5倍）
                for (let i = 0; i < 5; i++) {
                    weighted.push(q);
                }
            }
        });

        return weighted;
    }
}

// Export for use in other modules
window.QuestionsLoader = QuestionsLoader;
