class Dames
{

  // Varialbe
  // Constructeur
  constructor(element_id,ligne=10, colonne=10)
  {
    //this.ws = ws;

    this.ligne = ligne;
    this.colonne = colonne;
    this.selection = null;
    this.nbPion = 20;
    this.multiprise = false;
    this.initialisation();
    this.gagnant = 0;
    this.element = document.querySelector(element_id);
    //this.element.addEventListener('click', (event) => this.handle_click(event));
    this.render();
    this.element.addEventListener('click', (e) => this.action(e));
    //this.echiquier = [];
  }

  // Initialisation du jeu
  initialisation()
  {
    this.turn =1;
    this.echiquier = [];
    for(let i=0; i<this.ligne; i++)
    {
      this.echiquier[i] = [];

      for(let j=0; j<this.colonne; j++)
      {
        this.echiquier[i][j] = {"type":0 , "dame":false, "possible":0};
      }
    }
    this.initiJour1();
    this.initiJour2();
    this.coupsJouer = 0;
    this.gagnant = null;
    //console.log(this.echiquier);
  }

  initiJour2()
  {
    for(let i=0; i<(this.nbPion * 2)/this.ligne; i++)
    {
      for(let j=0; j<this.colonne; j++)
      {
        if(i%2 === 0 && j%2 === 1)
        {
          this.echiquier[i][j].type = 2;
        }
        else if(i%2 === 1 && j%2 === 0)
        {
          this.echiquier[i][j].type = 2;
        }
      }
    }
  }

  initiJour1()
  {
    for(let i=this.ligne-1; i>=this.ligne - (this.nbPion * 2)/this.ligne; i--)
    {
      for(let j=0; j<this.colonne; j++)
      {
        if(i%2 === 0 && j%2 === 1)
        {
          this.echiquier[i][j].type = 1;
        }
        else if(i%2 === 1 && j%2 === 0)
        {
          this.echiquier[i][j].type = 1;
        }
      }
    }
    //console.log(this.echiquier.type);
  }

  initPossibilite()
  {
    for (let i = 0; i<this.ligne; i++) {
      for (let j = 0; j < this.colonne; j++) {
        this.echiquier[i][j].possible = 0;
      }
    }
  }

  /* Affiche le plateau de jeu dans le DOM */
  render()
  {
    var table = document.createElement('table');
    for (var i = 0; i<this.ligne; i++)
    {
      var tr = table.appendChild(document.createElement('tr'));
      //console.log('ligne');
      for (var j = 0; j < this.colonne; j++)
      {
        //console.log('colonne');
        var td = tr.appendChild(document.createElement('td'));
        var div = td.appendChild(document.createElement('div'));
        var colour = this.echiquier[i][j].type;
        //console.log(this.echiquier[i][j].type);
        if (colour)
        {
             //console.log(colour);
          if(this.echiquier[i][j].dame){

            div.className = 'dames' + colour;
          } else {
             console.log(colour);
            div.className = 'player' + colour;
            //console.log(div.className);
            //div.className='player2';
            //div.style.backgroundColor = "red";
            //div.style.backgroundColor = "green";
          }
        }


        if((i%2 === 0 && j%2 === 0) || (i%2 === 1 && j%2 === 1))
        {
          td.className = 'blanc';
        }
        else
        {
          td.className = 'noir';
        }

        if (this.selection && this.selection.row == i && this.selection.column == j) {
          td.className += ' selected';
        }

       /*if(this.echiquier[i][j].obligatoire === 1){
          td.style["background-color"] = "red";
        }
        if(this.echiquier[i][j].possible === 1) {
          td.style["background-color"] = "green";
        }*/

        /*
       if(this.pionCliquer.status === 1 && this.pionCliquer.row === i && this.pionCliquer.column === j) {
          td.style["background-color"] = "#919190";
        }
        */

        div.dataset.column = j;
        div.dataset.row = i;
      }
    }
    this.element.innerHTML = '';
    this.element.appendChild(table);
  }

possible_pion(dx, dy, dsx, dsy, dir, mange) {
  if (!mange) {
    return (!this.echiquier[dsx][dsy].type && dsx == dx + dir && Math.abs(dy - dsy) == Math.abs(dir))
  }
  else {
    isPion = this.checkPion(dx, dy, dsx, dsy);
    return (!this.echiquier[dsx][dsy].type && isPion && dsx == dx + dir && Math.abs(dy - dsy) == Math.abs(dir))
  }
}

possible(dx, dy) {
  if (!this.echiquier[dx][dy].dame) {
    var dir = this.turn == 1 ? -1 : 1;
    var dir2 = this.turn == 1 ? -2 : 2;
    return  possible_pion(dx , dy, dsx, dsy, dir, false) ||
            possible_pion(dx, dy, dsx, dsy, dir2, true);
    
  }
  else {

  }
}

gagnant(dx, dy) {


    var possibleJ1 = this.turn == 1 ? false : true;
    var possibleJ2 = this.turn == 2 ? false : true;
    var cptJ1 = 0;
    var cptJ2 = 0;
    for (let i = 0; i < this.ligne; i++) {
      for (let j = 0; j < this.colonne; j++) {
        if (this.echiquier[i][j].type === 1) {
          if (this.turn == 1 && !possibleJ1) possibleJ1 = this.possible(i, j);
          cptJ1++;
        }
        else if (this.echiquier[i][j].type === 2) {
          if (this.turn == 2 && !possibleJ2) possibleJ2 = this.possible(i, j);
          cptJ2++;
        }
      }
    }
    if (!cptJ1 || !possibleJ1) {
      this.gagnant = 2;
      return true;
    }
    else if (!cptJ2 || !possibleJ2) {
      this.gagnant = 1; 
      return true;
    }

    return false;
}

/*
  winner(){
    let compteurJoueur1 = 0;
    let compteurJoueur2 = 0;
    for (let i = 0; i<this.ligne; i++) {
      for (let j = 0; j < this.colonne; j++) {
        if(this.echiquier[i][j].type === 1) {compteurJoueur1++;}
        else if(this.echiquier[i][j].type === 2) {compteurJoueur2++;}
      }
    }
    if(compteurJoueur1 === 0){this.gagnant = 2;}
    else if(compteurJoueur2 === 0){this.gagnant = 1;}
  }
  */
  play(row,column,t,RowUnset,ColumnUnset){

    if (column && row)
    { this.echiquier[row][column].type=t;
      this.echiquier[RowUnset][ColumnUnset]=0;
     this.turn =3-t;
    }
  }

  checkPion(depart_x, depart_y, dest_x, dest_y) {
    var vec_x = dest_x - depart_x;
    var vec_y = dest_y - depart_y;
    if (!vec_x || !vec_y) return false;
    var typePion = this.echiquier[depart_x + (vec_x/Math.abs(vec_x))][depart_y + (vec_y/Math.abs(vec_y))].type;
    return typePion && (typePion != this.echiquier[depart_x][depart_y].type);
  }

  getPionX(depart_x, depart_y, dest_x, dest_y) {
    var vec_x = dest_x - depart_x;
    var vec_y = dest_y - depart_y;
    return depart_x + vec_x/Math.abs(vec_x);
  }

  getPionY(depart_x, depart_y, dest_x, dest_y) {
    var vec_x = dest_x - depart_x;
    var vec_y = dest_y - depart_y;
    return depart_y + vec_y/Math.abs(vec_y);
  }

  checkPrise(dx, dy) { //////////////// VERIFIER TYPE DE PION AVANT DE MANGER
    var bas = dx + 2 < this.ligne ? true : false;
    var haut  = dx - 2 >= 0 ? true : false;
    var droite = dy + 2 < this.colonne ? true : false;
    var gauche = dy - 2 >= 0 ? true : false;
    return  (bas && droite && !this.echiquier[dx + 2][dy + 2].type && this.checkPion(dx, dy, dx + 2, dy + 2))   ||
            (bas && gauche && !this.echiquier[dx + 2][dy - 2].type && this.checkPion(dx, dy, dx + 2, dy - 2))   ||
            (haut && droite && !this.echiquier[dx - 2][dy + 2].type && this.checkPion(dx, dy, dx - 2, dy + 2))  ||
            (haut && gauche && !this.echiquier[dx - 2][dy - 2].type && this.checkPion(dx, dy, dx - 2, dy - 2));
  }

  action(e){
    var data = e.target.dataset || null;
    if (!data || (typeof data.row === 'undefined') || (this.echiquier[data.row][data.column] === 'undefined')) {
      // juste au cas où ...
      return;
    }
    // la case ou je veux partir au 2eme clique .
    var destinationSquare = this.echiquier[data.row][data.column];

    if (this.selection) {
      var selectedSquare = this.echiquier[this.selection.row][this.selection.column];
      if (destinationSquare.type == selectedSquare.type) {
        // on sélectionne un nouveau pion
        if(!this.multiprise) this.selection = data;
      } else {
        var isPion = this.checkPion(parseInt(this.selection.row), parseInt(this.selection.column), parseInt(data.row), parseInt(data.column));
        var direction = this.turn == 1 ? -1 : 1;
        var direction2 = this.turn == 1 ? -2 : 2;
        //if ((!selectedSquare.dame && parseInt(data.row) != parseInt(this.selection.row) + direction) ||
            //(selectedSquare.dame && Math.abs(parseInt(this.selection.row) - parseInt(data.row)) != 1) ||
            //Math.abs(parseInt(this.selection.column) - parseInt(data.column)) != 1
        //) 
        if ( 
            (!selectedSquare.dame && ( 
                                      (!this.multiprise && 
                                        ((!isPion && parseInt(data.row) != parseInt(this.selection.row) + direction)
                                                      || 
                                        (isPion && parseInt(data.row) != parseInt(this.selection.row) + direction2))
                                      ) || (this.multiprise && Math.abs(parseInt(data.row) - parseInt(this.selection.row)) != 2)
                                      )
            ) 
            || 
            (isPion && Math.abs(parseInt(this.selection.column) - parseInt(data.column)) != Math.abs(direction2)) 
            || 
            (!isPion && Math.abs(parseInt(this.selection.column) - parseInt(data.column)) != Math.abs(direction))
            )
        {
          // destination non valide
          console.log("erreur")
          this.selection = null;
        } 
        else {
          if (destinationSquare.type == 0) {
            // capture ...
              console.log("CAPTURE")
            destinationSquare.dame = selectedSquare.dame;
            destinationSquare.possible = selectedSquare.possible;
            destinationSquare.type = selectedSquare.type;
            if (isPion) {
                var pion_x = this.getPionX(parseInt(this.selection.row), parseInt(this.selection.column), parseInt(data.row), parseInt(data.column));
                var pion_y = this.getPionY(parseInt(this.selection.row), parseInt(this.selection.column), parseInt(data.row), parseInt(data.column));
                this.echiquier[pion_x][pion_y].dame = 0;
                this.echiquier[pion_x][pion_y].possible = 0;
                this.echiquier[pion_x][pion_y].type = 0;
                selectedSquare.type = 0;
                this.multiprise = this.checkPrise(parseInt(data.row), parseInt(data.column));
                if (!this.multiprise) this.selection = null;
                else this.selection = data;
            }
            else {
              this.multiprise = false;
              selectedSquare.type = 0;
              this.selection = null;
            }
          }

          if (data.row ==  (this.turn == 1 ? 0 : 9)) {
            // promotion ...
            destinationSquare.dame = true;
          }

          if (this.multiprise) console.log("multiprise");
          else console.log("pas multiprise");
          if (!this.multiprise) this.turn = this.turn % 2 + 1;
        }
      }
    } else {
      // aucune sélection, si l'on clique sur une case, ça devient la nouvelle sélection
      if (destinationSquare.type == this.turn) {
        this.selection = data;
      }
    }

    this.render();
  }
}
     //turn = (turn % 2) + 1;



// boucle de vérification :

//var turn=1;
var a=new Dames('#principal');
//document.querySelector("#principal").addEventListener('click',action);
console.log(a);