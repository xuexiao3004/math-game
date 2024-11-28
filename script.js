class MathGame {
    constructor() {
        this.maxNumber = 20;
        this.initializeElements();
        this.bindEvents();
        this.startNewGame();
    }

    initializeElements() {
        this.numberTree = document.getElementById('number-tree');
        this.decompositionOptions = document.getElementById('decomposition-options');
        this.calculationOptions = document.getElementById('calculation-options');
        this.problem = document.getElementById('problem');
        this.resultMessage = document.getElementById('result-message');
        this.newGameButton = document.getElementById('new-game');
        
        this.tabButtons = document.querySelectorAll('.tab-button');
        this.gameSections = document.querySelectorAll('.game-section');
    }

    bindEvents() {
        this.newGameButton.addEventListener('click', () => this.startNewGame());
        this.tabButtons.forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e));
        });
    }

    switchTab(e) {
        const targetTab = e.target.dataset.tab;
        this.tabButtons.forEach(button => button.classList.remove('active'));
        this.gameSections.forEach(section => section.classList.remove('active'));
        e.target.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    }

    startNewGame() {
        this.generateDecompositionGame();
        this.generateCalculationGame();
    }

    generateDecompositionGame() {
        const number = Math.floor(Math.random() * (this.maxNumber - 5)) + 5;
        const [num1, num2] = this.generateRandomDecomposition(number);
        
        // 随机选择一个位置放置问号（0：顶部，1：左下，2：右下）
        const questionPosition = Math.floor(Math.random() * 3);
        
        let treeHTML = '<div class="tree-container">';
        
        // 第一层
        treeHTML += '<div class="tree-level level-0">';
        treeHTML += `<div class="tree-node">
            <span class="node-content ${questionPosition === 0 ? 'question' : ''}">${questionPosition === 0 ? '?' : number}</span>
        </div></div>`;
        
        // 第二层
        treeHTML += '<div class="tree-level level-1">';
        treeHTML += `<div class="tree-node">
            <span class="node-content ${questionPosition === 1 ? 'question' : ''}">${questionPosition === 1 ? '?' : num1}</span>
        </div>`;
        treeHTML += `<div class="tree-node">
            <span class="node-content ${questionPosition === 2 ? 'question' : ''}">${questionPosition === 2 ? '?' : num2}</span>
        </div></div>`;
        
        treeHTML += '</div>';
        
        this.numberTree.innerHTML = treeHTML;

        // 设置正确答案
        this.currentDecompositionAnswer = questionPosition === 0 ? number : 
                                        questionPosition === 1 ? num1 : num2;

        // 生成选项
        this.generateNumberOptions(this.currentDecompositionAnswer);
    }

    generateRandomDecomposition(number) {
        const num1 = Math.floor(Math.random() * (number - 1)) + 1;
        return [num1, number - num1];
    }

    generateNumberOptions(correctAnswer) {
        const options = [correctAnswer];
        while (options.length < 4) {
            const newOption = Math.floor(Math.random() * this.maxNumber) + 1;
            if (!options.includes(newOption)) {
                options.push(newOption);
            }
        }
        
        options.sort(() => Math.random() - 0.5);

        this.decompositionOptions.innerHTML = options
            .map(option => `
                <button class="option" data-value="${option}">${option}</button>
            `).join('');

        document.querySelectorAll('#decomposition-options .option').forEach(button => {
            button.addEventListener('click', (e) => {
                const selectedValue = parseInt(e.target.dataset.value);
                const isCorrect = selectedValue === this.currentDecompositionAnswer;
                this.showResult(isCorrect ? '答对了！' : '答错了，请重试！', isCorrect);
                if (isCorrect) {
                    setTimeout(() => this.generateDecompositionGame(), 1000);
                }
            });
        });
    }

    generateCalculationGame() {
        const operationType = Math.random() < 0.5 ? 'addition' : 'subtraction';
        const numCount = Math.random() < 0.7 ? 2 : 3; // 70%概率生成2个数，30%概率生成3个数
        let numbers = [];
        let problem = '';
        let correctAnswer = 0;

        if (operationType === 'addition') {
            // 生成2-3个数的加法
            numbers = Array(numCount).fill(0).map(() => Math.floor(Math.random() * 10) + 1);
            problem = numbers.join(' + ');
            correctAnswer = numbers.reduce((a, b) => a + b, 0);
        } else {
            // 生成2-3个数的减法
            const maxStart = Math.min(20, 10 * numCount); // 确保最终结果为正数
            numbers = [Math.floor(Math.random() * (maxStart - 5)) + 5]; // 第一个数
            
            // 生成剩余的数，确保它们的和小于第一个数
            let remainingSum = numbers[0] - 1;
            for (let i = 1; i < numCount; i++) {
                const maxNum = i === numCount - 1 ? remainingSum : remainingSum - 1;
                const num = Math.floor(Math.random() * maxNum) + 1;
                numbers.push(num);
                remainingSum -= num;
            }
            
            problem = numbers.join(' - ');
            correctAnswer = numbers.reduce((a, b) => a - b);
        }

        problem += ' = ?';
        this.problem.textContent = problem;
        this.currentCalculationAnswer = correctAnswer;

        // 生成选项
        const options = [correctAnswer];
        while (options.length < 4) {
            const wrong = Math.floor(Math.random() * 20) + 1;
            if (!options.includes(wrong)) {
                options.push(wrong);
            }
        }
        
        options.sort(() => Math.random() - 0.5);

        this.calculationOptions.innerHTML = options
            .map(option => `
                <button class="option" data-value="${option}">${option}</button>
            `).join('');

        document.querySelectorAll('#calculation-options .option').forEach(button => {
            button.addEventListener('click', (e) => {
                const selectedValue = parseInt(e.target.dataset.value);
                const isCorrect = selectedValue === this.currentCalculationAnswer;
                this.showResult(isCorrect ? '答对了！' : '答错了，请重试！', isCorrect);
                if (isCorrect) {
                    setTimeout(() => this.generateCalculationGame(), 1000);
                }
            });
        });
    }

    showResult(message, isSuccess) {
        this.resultMessage.textContent = message;
        this.resultMessage.className = isSuccess ? 'success' : 'error';
    }
}

// 初始化游戏
window.addEventListener('DOMContentLoaded', () => {
    new MathGame();
}); 