// ================================================
// Gacha Animation Controller
// ================================================

class GachaAnimation {
    constructor() {
        this.container = null;
        this.capsule = null;
        this.isAnimating = false;
    }

    // Initialize gacha elements
    init() {
        this.container = document.getElementById('gachaContainer');
        this.capsule = this.container.querySelector('.gacha-capsule');
    }

    // Play gacha animation sequence
    async play() {
        if (this.isAnimating) return;

        this.isAnimating = true;

        // Show gacha container
        this.container.classList.remove('hidden');

        // Reset capsule state
        this.capsule.classList.remove('opening');

        // Wait for appear and shake animations (0.6s appear + 0.8s shake)
        await this.wait(1400);

        // Open capsule
        this.capsule.classList.add('opening');

        // Wait for opening animation
        await this.wait(800);

        // Hide gacha container
        this.container.classList.add('hidden');

        this.isAnimating = false;
    }

    // Reset gacha animation
    reset() {
        this.capsule.classList.remove('opening');
        this.container.classList.add('hidden');
        this.isAnimating = false;
    }

    // Wait helper
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export for use in other modules
window.GachaAnimation = GachaAnimation;
