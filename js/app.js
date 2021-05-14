const url_user = "https://5ddbb358041ac10014de140b.mockapi.io/user";


async function fetchApi(url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

class User {
    constructor(email, password, id) {
        this.email = email;
        this.password = password;
        this.id = id;
    }
    getID() {
        return this.id;
    }
}

function Login() {
    var email_Form = document.getElementById('email').value;
    var password_Form = document.getElementById('password').value;
    fetchApi(url_user).then(data => {
        var i = 0;
        var message;
        while (i < data.length) {
            if (email_Form == data[i].email) {
                var valid = new User(email_Form, password_Form, data[i].id);
                var queryString = "?id=" + valid.getID();
                window.location.href = "dash.html" + queryString;
                break;

            } else {
                
                i++;
            }
    
        }
alert('User not found');
    });
}
