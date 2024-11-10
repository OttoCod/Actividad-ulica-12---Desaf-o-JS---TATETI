class TatetiGame {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
            [0, 4, 8], [2, 4, 6] // Diagonales
        ];

        // Obtener elementos del DOM
        this.statusDisplay = document.getElementById('status');
        this.restartButton = document.getElementById('restart');
        this.cells = document.querySelectorAll('.cell');

        // Crear el elemento para el flash
        this.createFlashElement();

        // Vincular métodos
        this.handleCellClick = this.handleCellClick.bind(this);
        this.restartGame = this.restartGame.bind(this);

        // Inicializar el juego
        this.initializeGame();
    }

    createFlashElement() {
        // Remover flash anterior si existe
        const existingFlash = document.getElementById('winner-flash');
        if (existingFlash) {
            existingFlash.remove();
        }
        
        // Crear nuevo elemento flash
        const flash = document.createElement('div');
        flash.id = 'winner-flash';
        document.body.appendChild(flash);
    }

    initializeGame() {
        this.cells.forEach(cell => {
            cell.removeEventListener('click', this.handleCellClick);
            cell.addEventListener('click', () => this.handleCellClick(cell));
            cell.textContent = '';
            cell.classList.remove('x-marker', 'o-marker');
        });

        this.restartButton.removeEventListener('click', this.restartGame);
        this.restartButton.addEventListener('click', this.restartGame);

        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.updateStatus();
    }

    handleCellClick(cell) {
        const index = parseInt(cell.getAttribute('data-index'));

        if (this.board[index] === '' && this.gameActive) {
            this.board[index] = this.currentPlayer;
            cell.textContent = this.currentPlayer;
            cell.classList.add(this.currentPlayer === 'X' ? 'x-marker' : 'o-marker');

            if (this.checkWin()) {
                this.gameActive = false;
                this.statusDisplay.textContent = `¡${this.currentPlayer} ha ganado!`;
                this.triggerWinningFlash();
                return;
            }

            if (this.checkDraw()) {
                this.gameActive = false;
                this.statusDisplay.textContent = '¡Empate!';
                this.triggerDrawFlash();
                return;
            }

            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateStatus();
        }
    }

    triggerWinningFlash() {
        const flash = document.getElementById('winner-flash');
        flash.className = ''; // Limpiar clases anteriores
        void flash.offsetWidth; // Forzar reflow
        flash.classList.add('flash', this.currentPlayer === 'X' ? 'flash-x' : 'flash-o');
        
        // Remover la clase después de la animación
        setTimeout(() => {
            flash.className = '';
        }, 1000);
    }

    triggerDrawFlash() {
        const flash = document.getElementById('winner-flash');
        flash.className = '';
        void flash.offsetWidth; // Forzar reflow
        flash.classList.add('flash', 'flash-draw');
        
        setTimeout(() => {
            flash.className = '';
        }, 1000);
    }

    checkWin() {
        return this.winningCombinations.some(combination => {
            return combination.every(index => {
                return this.board[index] === this.currentPlayer;
            });
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    updateStatus() {
        this.statusDisplay.textContent = `Turno de ${this.currentPlayer}`;
    }

    restartGame() {
        this.initializeGame();
    }
}

// Iniciar el juego cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    window.game = new TatetiGame();
});