class User {
  constructor(name, wsconn) {
    this.name = name;
    this.wsconn = wsconn;
    this.state = 'AVAILABLE';
  }
  
  serialize() {
    return {
      name: this.name,
      state: this.state,
    }
  }
  
  invite(opponent) {
    if (this !== opponent
        && this.state == 'AVAILABLE'
        && opponent.state == 'AVAILABLE') {
      this.state = opponent.state = 'PLAYING';
      return this.game = opponent.game = new Game(opponent, this);
    } else {
      return null;
    }
  }
  
  quit() {
    if (this.state == 'PLAYING' && this.game) {
      return this.game.quit();
    } else {
      return false;
    }
  }
}

class Game {
  constructor(p1, p2) {
    this.player1 = p1;
    this.player2 = p2;
  }
  
  quit() {
    this.player2.game = this.player1.game = null;
    this.player2.state = this.player1.state = 'AVAILABLE';
    return this;
  }
}

exports.User = User;
exports.Game = Game;