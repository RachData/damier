

/******************

 *Some functions used by both the AJAX and WS implementations 

 ******************/

​

// Utility DOM functions

const $ = document.querySelector.bind(document);

const append = (node, type) => node.appendChild(document.createElement(type));

​

// Create table from user list

const createUserList = (users) => {

  const table = document.createElement('table');

​

  const row = append(table, 'tr');

  const header = append(row, 'th');

  header.textContent = 'username';

  append(row, 'th');

  

  for (var u of users) {

    const row = append(table, 'tr');

    append(row, 'td').textContent = u.name;

    const button = append(append(row, 'th'), 'button');

    button.textContent = 'Challenge';

    button.className = 'challenge';

    button.dataset.username = u.name;

    if (u.state != 'AVAILABLE' || u.name == sessionStorage.username)

      button.disabled = true;

  }

  

  return table

}

​

