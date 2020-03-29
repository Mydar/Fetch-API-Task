document.getElementById("get-users").addEventListener('click', getUsers);
document.getElementById("get-user").addEventListener('click', getUser);


let usersSearch = document.getElementById('search-users');

function getUsers() {
  console.log(usersSearch.value);
  
  if (usersSearch.value === '') {
      alert('Please Enter atleast one username!');
    } else {
      let replaceSpace = usersSearch.value.replace(/\s/g, '');
      let users = replaceSpace.split(',');
      
      outputUsers(users).then((usersResponse) => {
        console.log(usersResponse);
        renderUsers(usersResponse);
      })
      .catch((err) => {
        alert('ERROR! Check that all usernames are correct.');
      })
    }
  }


  // output users : call api
  async function outputUsers(users) {
  let userRequests = [];
  let output;
  
  users.forEach((user) => {
    let userRequest = fetch(`https://api.github.com/users/${user}`);
    userRequests.push(userRequest);
  })
	output = await Promise.all(userRequests)
	.then(responses => Promise.all(responses.map(response => {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(response)
    }
  })))
	.then(users => {return users});
  console.log(output);
  return output;
}

function renderUsers(users) {

  let usersView = "";
  users.forEach((user) => {
    usersView += `
    <div class="user">
      <img src="${user.avatar_url}" width="70" height="70">
      <ul>
        <li>ID: ${user.id}</li>
        <li>Login: ${user.login}</li>
        <li><a href="${user.html_url}" class="github-link" target="_blank">VISIT GITHUB PROFILE</a></li>
      </ul>
    </div>
    `
    document.getElementById('github-users').innerHTML = usersView;
  })
}
function getUser() {
  let searchUser = document.getElementById('search-user');
  if (searchUser.value == '') {
    alert('Please Enter A Username to search for');
  } else {
    let usersInput = searchUser.value.replace(/\s/g, '');
    outputUser(usersInput);
  }
}

function outputUser(name) {
  let userView = "";
  fetch(`https://api.github.com/users/${name}`)
  .then((response) => {
    if (response.ok) {
      return response.json();
    }else {
      return Promise.reject(response);
    }
  })
  .then((data) => {
    userView += `
    <div class="user">
      <img src="${data.avatar_url}" width="70" height="70">
      <ul>
        <li>ID: ${data.id}</li>
        <li>Login: ${data.login}</li>
        <li><a href="${data.html_url}" class="github-link" target="_blank">VISIT GITHUB PROFILE</a></li>
      </ul>
    </div>
    `
    document.getElementById('github-user').innerHTML = userView;
  })
  .catch((err) => {
    alert('ERROR! Please enter correct username');
  })
}