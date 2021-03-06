

class User
{
  // Varialbe
  // Constructeur
  constructor(users)
  {
    this.name = users.name;
    this.email = users.email;
  }




getJeu(){
    return this.jeu;
  }
  // set le websocket The WS connection to the user browser
 setWSocket(wsconn)
 {
    this.wsconn = wsconn;       // The WS connection to the user browser
    this.state = 'AVAILABLE';   // An internal state
 }
 
 setState(state)
 {
    this.state = state;
 }
  
  
  // methode
  
 partieGagner()
 {
    this.partieGagner++;
 }
  
 PartiePerdu()
 {
    this.partiePerdu++;
 }
  
 partieJouer()
 {
    this.partieJouer = this.partieGagner + this.partiePerdu;
 }
  
  // inviter un adversaire a un défi
 invite(adversaire)
 { console.log('dans invite');
   console.log(adversaire);
    if(adversaire == null)
    {
      return null;
    }
    if(adversaire !== this && !this.jeux[adversaire.pseudo])
    {
      return true;
    }
    return false;
 }

 lancerDefi(adversaire)
 {
    if(adversaire == null)
    {
      return null;
    }
    else if(!this.jeux[adversaire.pseudo])//adversaire.state === this.state && this.state === 'AVAILABLE')
    {
      this.state = 'PLAYING';
      adversaire.state = 'PLAYING';
      let dame = new Dames('#dame', adversaire, this);
      this.jeux[adversaire.pseudo] = dame;
      adversaire.jeux[this.pseudo] = dame;
      return dame;
    }
    else
    {
      return null;
    }
    
  }
  
  // on quite le jeu
  quiter(adversaire)
  {
    if(adversaire == null)
    {
      return false;
    }
    else if(this.state === 'PLAYING')
    {
      //console.log('jeu '+this.jeux[adversaire.pseudo])
      this.jeux[adversaire.pseudo].quiter();
      return true;
    }
    else
    {
      return false;
    }
    
  }

  // description
  toJSON()
  {
    return {
              name: this.name,
              email: this.email,
              partieGagner: this.partieGagner,
              partiePerdu: this.partiePerdu,
              partieJouer: this.partieJouer,
              state: this.state,
          }
  }
}


module.exports = User;