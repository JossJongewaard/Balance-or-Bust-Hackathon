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
        
        // Clear wheel icons when times up screen shows
        clearWheelIcons();
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

            // Create explosion effect before marking as sold
            createPurchaseExplosion(dealItem);

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
            
            // If balance is negative, show BUST screen
            if (newBalance < 0) {
                showBustScreen(newBalance);
            }
        });
    });

    // Create floating coins
    function createCoinsGroup(container, position) {
        const numCoins = 5;
        const baseDelay = 100;
        
        for (let i = 0; i < numCoins; i++) {
            setTimeout(() => {
        const coin = document.createElement('div');
        coin.className = 'coin';
                
                // Random starting position within the container
                const startX = Math.random() * 50 - 25;
                const startY = Math.random() * 50 - 25;
                coin.style.left = `calc(50% + ${startX}px)`;
                coin.style.top = `calc(50% + ${startY}px)`;
                
                // Calculate center-ward movement based on position
                let centerX, centerY;
                switch(position) {
                    case 'left-bottom':
                        centerX = 150;
                        centerY = -200;
                        break;
                    case 'right-bottom':
                        centerX = -150;
                        centerY = -200;
                        break;
                    case 'left-top':
                        centerX = 150;
                        centerY = 200;
                        break;
                    case 'right-top':
                        centerX = -150;
                        centerY = 200;
                        break;
                }
                
                const randomOffset = 50;
                const travelX = centerX + (Math.random() * randomOffset * 2 - randomOffset);
                const travelY = centerY + (Math.random() * randomOffset * 2 - randomOffset);
                const rotation = (position.includes('left') ? 1 : -1) * (360 + Math.random() * 720);
                
                coin.style.setProperty('--travel-x', `${travelX}px`);
                coin.style.setProperty('--travel-y', `${travelY}px`);
                coin.style.setProperty('--rotation', `${rotation}deg`);
                
                container.appendChild(coin);
                
                // Remove coin after animation
                setTimeout(() => {
                    coin.remove();
                }, 1200);
            }, i * baseDelay);
        }
    }

    function animateCoins() {
        const leftBottomContainer = document.querySelector('.left-coins');
        const rightBottomContainer = document.querySelector('.right-coins');
        
        // Create top corner containers
        const leftTopContainer = document.createElement('div');
        leftTopContainer.className = 'coins left-top-coins';
        document.body.appendChild(leftTopContainer);
        
        const rightTopContainer = document.createElement('div');
        rightTopContainer.className = 'coins right-top-coins';
        document.body.appendChild(rightTopContainer);
        
        // Create initial groups for all corners
        createCoinsGroup(leftBottomContainer, 'left-bottom');
        createCoinsGroup(rightBottomContainer, 'right-bottom');
        createCoinsGroup(leftTopContainer, 'left-top');
        createCoinsGroup(rightTopContainer, 'right-top');
        
        // Continue creating new groups
        setInterval(() => {
            createCoinsGroup(leftBottomContainer, 'left-bottom');
            createCoinsGroup(rightBottomContainer, 'right-bottom');
            createCoinsGroup(leftTopContainer, 'left-top');
            createCoinsGroup(rightTopContainer, 'right-top');
        }, 800);
    }

    animateCoins();

    function createBustCoins() {
        const bustCoins = document.querySelector('.bust-coins');
        bustCoins.innerHTML = '';
        
        // Create more coins for a more dramatic effect
        for (let i = 0; i < 100; i++) {
            const coin = document.createElement('div');
            coin.className = 'bust-coin';
            
            // Random position and rotation with wider spread
            const tx = (Math.random() - 0.5) * 2000; // Wider horizontal spread
            const ty = (Math.random() - 0.5) * 2000; // Wider vertical spread
            const rotation = (Math.random() - 0.5) * 1080; // More rotation
            
            coin.style.setProperty('--tx', `${tx}px`);
            coin.style.setProperty('--ty', `${ty}px`);
            coin.style.setProperty('--rotation', `${rotation}deg`);
            
            // Random starting position in the center
            coin.style.left = '50%';
            coin.style.top = '50%';
            
            // Random size for variety
            const size = 20 + Math.random() * 40;
            coin.style.width = `${size}px`;
            coin.style.height = `${size}px`;
            
            // Random delay for staggered animation
            coin.style.animationDelay = `${Math.random() * 0.5}s`;
            
            bustCoins.appendChild(coin);
        }
    }

    function clearWheelIcons() {
        // Clear the spawn interval
        if (window.wheelSpawnInterval) {
            clearInterval(window.wheelSpawnInterval);
            window.wheelSpawnInterval = null;
        }
        
        // Remove any existing wheel icons
        const wheelIcons = document.querySelectorAll('.wheel-icon');
        wheelIcons.forEach(icon => icon.remove());
    }

    function showBustScreen(amountOwed) {
        const bustOverlay = document.querySelector('.bust-overlay');
        const amountOwedElement = document.querySelector('.amount-owed');
        
        // Update the amount owed text
        amountOwedElement.textContent = `You owe us $${Math.abs(amountOwed).toFixed(2)}`;
        
        createBustCoins();
        bustOverlay.classList.add('active');
        
        // Clear wheel icons when bust screen shows
        clearWheelIcons();
    }

    // Modify the buyItem function to allow negative balance
    function buyItem(price) {
        // Always deduct the price
        currentBalance -= price;
        updateBalance(currentBalance);
        
        // If balance is negative, show BUST screen
        if (currentBalance < 0) {
            showBustScreen(currentBalance);
        }
        
        return true;
    }

    // Add event listeners for Back To Balance buttons
    document.querySelectorAll('.back-to-balance').forEach(button => {
        button.addEventListener('click', () => {
            // Hide both overlays
            document.querySelector('.times-up-overlay').classList.remove('active');
            document.querySelector('.bust-overlay').classList.remove('active');
        });
    });

    function createMoneyRain() {
        const moneyRain = document.createElement('div');
        moneyRain.className = 'money-rain';
        document.body.appendChild(moneyRain);

        function createBill() {
            const bill = document.createElement('div');
            bill.className = 'money-bill';
            
            // Random pattern selection
            const patterns = ['moneyFallA', 'moneyFallB', 'moneyFallC'];
            const pattern = patterns[Math.floor(Math.random() * patterns.length)];
            
            // Even distribution across screen width
            const xPos = Math.random() * 100;
            bill.style.left = xPos + 'vw';
            
            // Slightly faster animation duration for more dynamic movement
            const duration = 3 + Math.random() * 2;
            bill.style.animation = `${pattern} ${duration}s linear forwards`;
            
            // Random size variation
            const scale = 0.7 + Math.random() * 0.6;
            bill.style.transform = `scale(${scale})`;
            
            moneyRain.appendChild(bill);
            
            // Clean up bills after animation
            bill.addEventListener('animationend', () => bill.remove());
        }

        // Create initial batch of bills
        for (let i = 0; i < 25; i++) {
            setTimeout(() => {
                createBill();
            }, i * 100); // Stagger initial creation
        }

        // Create bills more frequently
        function spawnBills() {
            // Create 2-3 bills at once for maintaining density
            const billCount = Math.floor(Math.random() * 2) + 2;
            for (let i = 0; i < billCount; i++) {
                setTimeout(createBill, i * 50);
            }
        }

        // Spawn new bills every 200ms to maintain density
        setInterval(spawnBills, 200);
    }

    // Start the money rain
    createMoneyRain();

    function createPurchaseExplosion(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Create 10 bills that explode outward
        for (let i = 0; i < 10; i++) {
            const bill = document.createElement('div');
            bill.className = 'purchase-money';
            
            // Position at the center of the purchased item
            bill.style.left = centerX + 'px';
            bill.style.top = centerY + 'px';
            
            // Calculate random explosion direction
            const angle = (i * 36 + Math.random() * 20 - 10) * (Math.PI / 180);
            const distance = 100 + Math.random() * 100;
            const explodeX = Math.cos(angle) * distance;
            const explodeY = Math.sin(angle) * distance;
            
            // Set custom properties for the animation
            bill.style.setProperty('--explode-x', explodeX + 'px');
            bill.style.setProperty('--explode-y', explodeY + 'px');
            bill.style.setProperty('--explode-rotate', (Math.random() * 720 - 360) + 'deg');
            
            // Add animation
            bill.style.animation = 'purchaseExplode 1s ease-out forwards';
            
            document.body.appendChild(bill);
            
            // Clean up after animation
            setTimeout(() => bill.remove(), 1000);
        }
    }

    function createWheelSystem() {
        // Create wheel overlay
        const wheelOverlay = document.createElement('div');
        wheelOverlay.className = 'wheel-overlay';
        document.body.appendChild(wheelOverlay);

        const wheelContainer = document.createElement('div');
        wheelContainer.className = 'wheel-container';
        wheelOverlay.appendChild(wheelContainer);

        // Create wheel
        const wheel = document.createElement('div');
        wheel.className = 'wheel';
        wheelContainer.appendChild(wheel);

        // Add wheel sections
        const sections = ['30- Seconds', 'Free Car*', '30+ Seconds', 'NOTHING!'];
        sections.forEach(text => {
            const section = document.createElement('div');
            section.className = 'wheel-section';
            section.textContent = text;
            wheel.appendChild(section);
        });

        // Add arrow
        const arrow = document.createElement('div');
        arrow.className = 'wheel-arrow';
        wheelContainer.appendChild(arrow);

        // Add result display
        const result = document.createElement('div');
        result.className = 'wheel-result';
        wheelContainer.appendChild(result);

        // Function to spawn wheel icon
        function spawnWheelIcon() {
            const icon = document.createElement('div');
            icon.className = 'wheel-icon';
            
            // Random position (keeping away from edges)
            const x = Math.random() * (window.innerWidth - 150) + 75;
            const y = Math.random() * (window.innerHeight - 150) + 75;
            
            icon.style.left = x + 'px';
            icon.style.top = y + 'px';
            
            // Click handler
            icon.addEventListener('click', () => {
                icon.remove();
                spinWheel();
                // Clear any existing spawn intervals
                if (window.wheelSpawnInterval) {
                    clearInterval(window.wheelSpawnInterval);
                }
            });
            
            document.body.appendChild(icon);

            // Remove the icon after 2 seconds
            setTimeout(() => {
                if (icon && icon.parentNode) {
                    icon.remove();
                }
            }, 2000);
        }

        // Function to spin wheel
        function spinWheel() {
            wheelOverlay.classList.add('active');
            
            // Randomly select one of the four sections (0-3)
            const selectedSection = Math.floor(Math.random() * 4);
            
            // Calculate the angle to land on the selected section
            // The arrow is at the top (0 degrees)
            // We need to rotate the wheel so the selected section is at the top
            // Since the sections are positioned at 45, 135, 225, and 315 degrees,
            // we need to rotate the wheel by the negative of the section's position
            // to bring it to the top
            const sectionAngle = -(selectedSection * 90 + 45);
            
            // Add multiple full rotations (5-10) plus the section angle
            const rotations = 5 + Math.floor(Math.random() * 5);
            const totalDegrees = rotations * 360 + sectionAngle;
            
            // Set the final rotation as a CSS variable
            wheel.style.setProperty('--final-rotation', `${totalDegrees}deg`);
            wheel.classList.add('spinning');
            
            // After spin completes
            setTimeout(() => {
                // Use the selected section directly
                handleResult(sections[selectedSection]);
            }, 5000);
        }

        // Function to handle spin result
        function handleResult(result) {
            const resultDisplay = wheelContainer.querySelector('.wheel-result');
            resultDisplay.textContent = result;
            resultDisplay.classList.add('show');
            
            // Play celebration effect if it's a good result
            if (result === '30+ Seconds' || result === 'Free Car*') {
                createPurchaseExplosion(wheelContainer);
            }
            
            setTimeout(() => {
                wheelOverlay.classList.remove('active');
                resultDisplay.classList.remove('show');
                wheel.classList.remove('spinning');
                wheel.style.transform = '';
                
                // Handle time modifications
                if (result === '30+ Seconds') {
                    timeLeft += 30;
                    updateTimer();
                } else if (result === '30- Seconds') {
                    timeLeft = Math.max(0, timeLeft - 30);
                    updateTimer();
                } else if (result === 'Free Car*') {
                    alert('You won a free car! (Terms and conditions apply)');
                }

                // Remove the wheel overlay after result
                setTimeout(() => {
                    wheelOverlay.remove();
                }, 1000);
            }, 3000);
        }

        // Start spawning wheel icons after 3 seconds
        setTimeout(() => {
            spawnWheelIcon(); // Spawn first icon
            window.wheelSpawnInterval = setInterval(spawnWheelIcon, 2000); // Spawn new icon every 2 seconds
        }, 3000);
    }

    // Start the wheel system
    createWheelSystem();
<<<<<<< HEAD
}); 
=======
}); 
>>>>>>> c6a1a12da6753e332bfdb85c29631bcc7a5c71ca
