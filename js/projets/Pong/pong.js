// Variables globales
var DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};
 
var rounds = [5, 5, 3, 3, 2];
var colors = ['#1abc9c', '#2ecc71', '#3498db', '#8c52ff', '#9b59b6'];
 
// L'objet balle (le cube qui rebondit d'un côté à l'autre)
var Ball = {
    new: function (incrementedSpeed) {
        return {
            width: 18,
            height: 18,
            x: (this.canvas.width / 2) - 9,
            y: (this.canvas.height / 2) - 9,
            moveX: DIRECTION.IDLE,
            moveY: DIRECTION.IDLE,
            speed: incrementedSpeed || 7 
        };
    }
};
 
// L'objet AI (les deux barres qui se déplacent de haut en bas)
var Ai = {
    new: function (side) {
        return {
            width: 18,
            height: 180,
            x: side === 'left' ? 150 : this.canvas.width - 150,
            y: (this.canvas.height / 2) - 35,
            score: 0,
            move: DIRECTION.IDLE,
            speed: 8
        };
    }
};
 
var Game = {
    initialize: function () {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');
 
        this.canvas.width = 1400;
        this.canvas.height = 1000;
 
        this.canvas.style.width = (this.canvas.width / 2) + 'px';
        this.canvas.style.height = (this.canvas.height / 2) + 'px';
 
        this.player = Ai.new.call(this, 'left');
        this.ai = Ai.new.call(this, 'right');
        this.ball = Ball.new.call(this);
 
        this.ai.speed = 5;
        this.running = this.over = false;
        this.turn = this.ai;
        this.timer = this.round = 0;
        this.color = '#8c52ff';
 
        Pong.menu();
        Pong.listen();
    },
 
    endGameMenu: function (text) {
        // Change la taille et la couleur de la police du canvas
        Pong.context.font = '45px Courier New';
        Pong.context.fillStyle = this.color;
 
        // Dessine le rectangle derrière le texte 'Appuyez sur une touche pour commencer'
        Pong.context.fillRect(
            Pong.canvas.width / 2 - 350,
            Pong.canvas.height / 2 - 48,
            700,
            100
        );
 
        // Change la couleur du canvas
        Pong.context.fillStyle = '#ffffff';
 
        // Dessine le texte du menu de fin de jeu ('Game Over' et 'Gagnant')
        Pong.context.fillText(text,
            Pong.canvas.width / 2,
            Pong.canvas.height / 2 + 15
        );
 
        setTimeout(function () {
            Pong = Object.assign({}, Game);
            Pong.initialize();
        }, 3000);
    },
 
    menu: function () {
        // Dessine tous les objets Pong dans leur état actuel
        Pong.draw();
 
        // Change la taille et la couleur de la police
        this.context.font = '50px Courier New';
        this.context.fillStyle = this.color;
 
        // Dessine le rectangle derrière le texte 'Appuyez sur une touche pour commencer'
        this.context.fillRect(
            this.canvas.width / 2 - 350,
            this.canvas.height / 2 - 48,
            700,
            100
        );
 
        // Change la couleur du canvas
        this.context.fillStyle = '#ffffff';
 
        // Dessine le texte 'appuyez sur une touche pour commencer'
        this.context.fillText('Press any key to begin',
            this.canvas.width / 2,
            this.canvas.height / 2 + 15
        );
    },
 
    // Met à jour tous les objets (déplacer le joueur, l'IA, la balle, augmenter le score, etc.)
    update: function () {
        if (!this.over) {
            // Si la balle entre en collision avec les limites - corriger les coordonnées x et y.
            if (this.ball.x <= 0) Pong._resetTurn.call(this, this.ai, this.player);
            if (this.ball.x >= this.canvas.width - this.ball.width) Pong._resetTurn.call(this, this.player, this.ai);
            if (this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
            if (this.ball.y >= this.canvas.height - this.ball.height) this.ball.moveY = DIRECTION.UP;
 
            // Déplace le joueur si player.move a été mis à jour par un événement clavier
            if (this.player.move === DIRECTION.UP) this.player.y -= this.player.speed;
            else if (this.player.move === DIRECTION.DOWN) this.player.y += this.player.speed;
 
            // Au nouveau service (début de chaque tour), déplace la balle du côté correct
            // et randomise la direction pour ajouter un peu de challenge.
            if (Pong._turnDelayIsOver.call(this) && this.turn) {
                this.ball.moveX = this.turn === this.player ? DIRECTION.LEFT : DIRECTION.RIGHT;
                this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
                this.ball.y = Math.floor(Math.random() * this.canvas.height - 200) + 200;
                this.turn = null;
            }
 
            // Si le joueur entre en collision avec les limites, met à jour les coordonnées y.
            if (this.player.y <= 0) this.player.y = 0;
            else if (this.player.y >= (this.canvas.height - this.player.height)) this.player.y = (this.canvas.height - this.player.height);
 
            // Déplace la balle dans la direction voulue selon moveY et moveX
            if (this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speed / 1.5);
            else if (this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speed / 1.5);
            if (this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
            else if (this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;
 
            // Gère le mouvement de l'IA (haut et bas)
            if (this.ai.y > this.ball.y - (this.ai.height / 2)) {
                if (this.ball.moveX === DIRECTION.RIGHT) this.ai.y -= this.ai.speed / 1.5;
                else this.ai.y -= this.ai.speed / 4;
            }
            if (this.ai.y < this.ball.y - (this.ai.height / 2)) {
                if (this.ball.moveX === DIRECTION.RIGHT) this.ai.y += this.ai.speed / 1.5;
                else this.ai.y += this.ai.speed / 4;
            }
 
            // Gère la collision de l'IA avec les murs
            if (this.ai.y >= this.canvas.height - this.ai.height) this.ai.y = this.canvas.height - this.ai.height;
            else if (this.ai.y <= 0) this.ai.y = 0;
 
            // Gère la collision entre le joueur et la balle
            if (this.ball.x - this.ball.width <= this.player.x && this.ball.x >= this.player.x - this.player.width) {
                if (this.ball.y <= this.player.y + this.player.height && this.ball.y + this.ball.height >= this.player.y) {
                    this.ball.x = (this.player.x + this.ball.width);
                    this.ball.moveX = DIRECTION.RIGHT;
                }
            }
 
            // Gère la collision entre l'IA et la balle
            if (this.ball.x - this.ball.width <= this.ai.x && this.ball.x >= this.ai.x - this.ai.width) {
                if (this.ball.y <= this.ai.y + this.ai.height && this.ball.y + this.ball.height >= this.ai.y) {
                    this.ball.x = (this.ai.x - this.ball.width);
                    this.ball.moveX = DIRECTION.LEFT;
                }
            }
        }
 
        // Gère la transition de fin de manche
        // Vérifie si le joueur a gagné la manche.
        if (this.player.score === rounds[this.round]) {
            // Vérifie s'il y a d'autres manches/niveaux et affiche l'écran de victoire sinon
            if (!rounds[this.round + 1]) {
                this.over = true;
                setTimeout(function () { Pong.endGameMenu('Winner!'); }, 1000);
            } else {
                // S'il y a une autre manche, réinitialise les valeurs et incrémente le numéro de manche.
                this.color = this._generateRoundColor();
                this.player.score = this.ai.score = 0;
                this.player.speed += 0.5;
                this.ai.speed += 1;
                this.ball.speed += 1;
                this.round += 1;
            }
        }
        // Vérifie si l'IA a gagné la manche.
        else if (this.ai.score === rounds[this.round]) {
            this.over = true;
            setTimeout(function () { Pong.endGameMenu('Game Over!'); }, 1000);
        }
    },
 
    // Dessine les objets sur le canvas
    draw: function () {
        // Efface le canvas
        this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
 
        // Définit la couleur de remplissage en noir
        this.context.fillStyle = this.color;
 
        // Dessine le fond
        this.context.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
 
        // Définit la couleur de remplissage en blanc (pour les raquettes et la balle)
        this.context.fillStyle = '#ffffff';
 
        // Dessine le joueur
        this.context.fillRect(
            this.player.x,
            this.player.y,
            this.player.width,
            this.player.height
        );
 
        // Dessine l'IA
        this.context.fillRect(
            this.ai.x,
            this.ai.y,
            this.ai.width,
            this.ai.height 
        );
 
        // Dessine la balle
        if (Pong._turnDelayIsOver.call(this)) {
            this.context.fillRect(
                this.ball.x,
                this.ball.y,
                this.ball.width,
                this.ball.height
            );
        }
 
        // Dessine le filet (ligne au milieu)
        this.context.beginPath();
        this.context.setLineDash([7, 15]);
        this.context.moveTo((this.canvas.width / 2), this.canvas.height - 140);
        this.context.lineTo((this.canvas.width / 2), 140);
        this.context.lineWidth = 10;
        this.context.strokeStyle = '#ffffff';
        this.context.stroke();
 
        // Définit la police par défaut et centre le texte
        this.context.font = '100px Courier New';
        this.context.textAlign = 'center';
 
        // Dessine le score du joueur (gauche)
        this.context.fillText(
            this.player.score.toString(),
            (this.canvas.width / 2) - 300,
            200
        );
 
        // Dessine le score de l'IA (droite)
        this.context.fillText(
            this.ai.score.toString(),
            (this.canvas.width / 2) + 300,
            200
        );
 
        this.context.font = '30px Courier New';
 
        this.context.fillText(
            'Round ' + (Pong.round + 1),
            (this.canvas.width / 2),
            35
        );
 
        this.context.font = '40px Courier';
 
        // Dessine le nombre de points nécessaires pour gagner la manche actuelle
        this.context.fillText(
            rounds[Pong.round] ? rounds[Pong.round] : rounds[Pong.round - 1],
            (this.canvas.width / 2),
            100
        );
    },
 
    loop: function () {
        Pong.update();
        Pong.draw();
        if (!Pong.over) requestAnimationFrame(Pong.loop);
    },
 
    listen: function () {
        document.addEventListener('keydown', function (key) {
            if (Pong.running === false) {
                Pong.running = true;
                window.requestAnimationFrame(Pong.loop);
            }
 
            if (key.keyCode === 38 || key.keyCode === 90) Pong.player.move = DIRECTION.UP;
            if (key.keyCode === 40 || key.keyCode === 83) Pong.player.move = DIRECTION.DOWN;
        });
 
        // Arrête le déplacement du joueur quand aucune touche n'est pressée.
        document.addEventListener('keyup', function (key) { Pong.player.move = DIRECTION.IDLE; });
    },
 
    // Réinitialise la position de la balle, la prise de tour et met un délai avant le prochain tour.
    _resetTurn: function(victor, loser) {
        this.ball = Ball.new.call(this, this.ball.speed);
        this.turn = loser;
        this.timer = (new Date()).getTime();
 
        victor.score++;
    },
 
    _turnDelayIsOver: function() {
        return ((new Date()).getTime() - this.timer >= 1000);
    },
 
    _generateRoundColor: function () {
        var newColor = colors[Math.floor(Math.random() * colors.length)];
        if (newColor === this.color) return Pong._generateRoundColor();
        return newColor;
    }
};
 
var Pong = Object.assign({}, Game);
Pong.initialize();
