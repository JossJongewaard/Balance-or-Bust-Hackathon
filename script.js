document.addEventListener('DOMContentLoaded', () => {
    // Intro overlay functionality
    const introOverlay = document.querySelector('.intro-overlay');
    
    // Remove intro overlay after 3 seconds
    setTimeout(() => {
        introOverlay.style.opacity = '0';
        setTimeout(() => {
            introOverlay.style.display = 'none';
        }, 1000); // Wait for fade out animation
    }, 3000); // Changed from 5000 to 3000 for 3 seconds

    // Timer functionality
    const timerElement = document.querySelector('.timer');
    const timesUpOverlay = document.querySelector('.times-up-overlay');
    let timeLeft = 60; // 1 minute in seconds

    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft === 0) {
            clearInterval(timerInterval);
            showTimesUpOverlay();
        }
        timeLeft--;
    }

    function showTimesUpOverlay() {
        timesUpOverlay.classList.add('active');
        // Add a subtle shake effect to the whole page
        document.body.style.animation = 'shake 0.5s ease';
    }

    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer(); // Initial call

    // Purchase functionality
    const balanceElement = document.querySelector('.balance');
    let currentBalance = 1000.00; // Starting balance

    function updateBalance(newBalance) {
        currentBalance = newBalance;
        balanceElement.textContent = `$${newBalance.toFixed(2)}`;
        
        // Add red flash effect if balance is low
        if (newBalance < 100) {
            balanceElement.style.color = '#ff0000';
            balanceElement.style.animation = 'pulse 0.5s infinite';
        }
    }

    // Buy Now button functionality
    const buyButtons = document.querySelectorAll('.buy-now');
    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const dealItem = button.closest('.deal-item');
            const priceElement = dealItem.querySelector('.deal-price');
            const price = parseFloat(priceElement.textContent.replace('$', ''));

            if (currentBalance >= price) {
                // Deduct price from balance
                const newBalance = currentBalance - price;
                updateBalance(newBalance);

                // Mark item as sold
                dealItem.classList.add('sold');
                button.textContent = 'SOLD OUT';

                // Add purchase effect
                dealItem.style.animation = 'pulse 0.5s';
                setTimeout(() => {
                    dealItem.style.animation = '';
                }, 500);
            } else {
                // Not enough money effect
                balanceElement.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    balanceElement.style.animation = '';
                }, 500);
                
                // Show insufficient funds message
                button.textContent = 'Insufficient Funds!';
                setTimeout(() => {
                    button.textContent = 'BUY NOW';
                }, 1000);
            }
        });
    });

    // Create floating coins
    function createCoin() {
        const coin = document.createElement('div');
        coin.className = 'coin';
        return coin;
    }

    function animateCoins() {
        const leftCoins = document.querySelector('.left-coins');
        const rightCoins = document.querySelector('.right-coins');

        // Create multiple coins at once
        function createCoinsGroup() {
            // Create 5 coins for each side
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    // Left coins
                    const leftCoin = createCoin();
                    leftCoins.appendChild(leftCoin);
                    
                    // Right coins
                    const rightCoin = createCoin();
                    rightCoins.appendChild(rightCoin);

                    // Remove coins after animation
                    setTimeout(() => {
                        leftCoin.remove();
                        rightCoin.remove();
                    }, 800); // Match the animation duration
                }, i * 100); // Faster stagger between coins
            }
        }

        // Create coins more frequently
        setInterval(createCoinsGroup, 600); // Create new group every 0.6 seconds
        createCoinsGroup(); // Initial call
    }

    animateCoins();
}); 