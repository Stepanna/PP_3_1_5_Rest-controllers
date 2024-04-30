displayCurrentUser()

async function displayCurrentUser() {
    try {
        const response = await fetch('/current_user', {
            method: 'GET'
        })
        const data = await response.json()
        const userRoles = data.roles[0].name.replace('ROLE_', '')
        $('#current-user-name').append(`${data.username}`)
        $('#current-user-roles').append(`${userRoles}`)
        let userInfo = `$(
            <tr>
                <td>${data.id}</td>
                <td>${data.username}</td>
                <td>${data.name}</td>
                <td>${data.lastName}</td>
                <td>${data.age}</td>
                <td>${userRoles}</td>
                </tr>
                )`
        $('#current-user').append(userInfo)
    } catch (error) {
        console.error('Error fetching current user data:', error)
    }
}

listUsers()

async function listUsers() {
    $('#listUsersTable').empty()
    try {
        const response = await fetch('/list_users', {
            method: 'GET'
        })
        const data = await response.json()
        data.forEach(user => {
            let roles = user.roles.map(role => " " + role.name.substring(5));
            let usersList = `$(
            <tr>           
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.name}</td>
                <td>${user.lastName}</td>
                <td>${user.age}</td>
                <td>${roles}</td>
                <td>
                    <button type="button" class="btn btn-primary" data-toggle="modal" 
                    id="btnEdit" data-action="edit" data-id="${user.id}" data-target="#edit">
                        Edit
                    </button>
                </td>
                <td>
                    <button type="button" class="btn btn-danger" data-toggle="modal"
                    id="btnDelete" data-action="delete" data-id="${user.id}" data-target="#delete">
                            Delete
                    </button>
                </td>
                </tr>
                )`

            $('#listUsersTable').append(usersList)
        })
    } catch (error) {
        console.error('Error fetching users list:', error)
    }
}

$(document).on('show.bs.modal', '#edit', ev => {
    console.log('here editing')
    let button = $(ev.relatedTarget);
    let id = button.data('id');
    showEditModal(id);
})

async function showEditModal(id) {
    $('#edit-role').empty()
    let user = await getUser(id)

    $('#edit-id').val(id)
    $('#edit-username').val(user.username)
    $('#edit-password').val('')
    $('#edit-name').val(user.name)
    $('#edit-lastname').val(user.lastName)
    $('#edit-age').val(user.age)

    await fetch("http://localhost:8080/list_roles")
        .then(res => res.json())
        .then(roles => {
            roles.forEach(role => {
                let selectedRole = false;
                for (let i = 0; i < user.roles.length; i++) {
                    if (user.roles[i].name === role.name) {
                        selectedRole = true;
                        break;
                    }
                }
                let el = document.createElement("option");
                el.text = role.name.replace('ROLE_','')
                el.value = role.id
                el.label = role.name.replace('ROLE_','')
                if (selectedRole) el.selected = true
                $('#edit-role')[0].appendChild(el)
            })
        })
}

editUser()

async function editUser(){
    const editForm= document.getElementById('formEditUser')
    editForm.addEventListener('submit', async event => {
        event.preventDefault()
        let editUserRoles = []

        const currentRoles = $('#edit-role').val()
        for (let i = 0; i < currentRoles.length; i++) {
            console.log(currentRoles[i])
            editUserRoles.push({
                id: currentRoles[i]
            })
        }

        const response = await fetch("http://localhost:8080/edit/" + editForm.id.value, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: $('#edit-id').val(),
                username: $('#edit-username').val(),
                password: $('#edit-password').val(),
                name: $('#edit-name').val(),
                lastName: $('#edit-lastname').val(),
                age: $('#edit-age').val(),
                roles: editUserRoles
            })
        })
        if (response.ok){
            console.log('edited')
            $('#edit-close').click();
            await listUsers();
        } else {
            let error = await response.json();
            (error.info)
        }
    })
}

$(document).on('show.bs.modal', '#delete', ev => {
    console.log('here deleting')
    let button = $(ev.relatedTarget);
    let id = button.data('id');
    showDeleteModal(id);
})

async function showDeleteModal(id){
    $('#delete-role').empty()
    let user = await getUser(id)

    $('#delete-id').val(user.id)
    $('#delete-username').val(user.username)
    $('#delete-name').val(user.name)
    $('#delete-lastname').val(user.lastName)
    $('#delete-age').val(user.age)

    await fetch("http://localhost:8080/list_roles")
        .then(res => res.json())
        .then(roles => {
            roles.forEach(role => {
                let selectedRole = false;
                for (let i = 0; i < user.roles.length; i++) {
                    if (user.roles[i].name === role.name) {
                        selectedRole = true;
                        break;
                    }
                }
                let el = document.createElement("option");
                el.text = role.name.replace('ROLE_','')
                el.value = role.id
                el.label = role.name.replace('ROLE_','')
                if (selectedRole) el.selected = true
                $('#delete-role')[0].appendChild(el)
            })
        })
}

deleteUser()

async function deleteUser(){
    const deleteForm= document.getElementById('formDeleteUser')
    deleteForm.addEventListener('submit', async event => {
        event.preventDefault()
        console.log(deleteForm.id.value)
        const response = await fetch("http://localhost:8080/delete/" + deleteForm.id.value, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: deleteForm.id.value
            })
        })
        if (response.ok){
            console.log('deleted')
            $('#delete-close').click();
            await listUsers();
        } else {
            let error = await response.json();
            (error.info)
        }
    })
}

createNewUser()

async function createNewUser() {
    await fetch('http://localhost:8080/list_roles', {method: 'GET'})
        .then(result => result.json())
        .then(roles => {
            roles.forEach(role => {
                let roleOption = document.createElement("option");
                roleOption.text = role.name.replace('ROLE_', '');
                roleOption.value = role.id;
                $('#roles-select').append(roleOption);
            })
        })
    const newUserForm = document.forms['create-new-user']
    newUserForm.addEventListener('submit', userCreation)

    async function userCreation(event) {
        event.preventDefault()
        let newUserRoles = []
        for (let i = 0; i < newUserForm.roles.options.length; i++) {
            if (newUserForm.roles.options[i].selected) newUserRoles.push({
                id: newUserForm.roles.options[i].value,
                name: newUserForm.roles.options[i].name
            })
        }

        const response = await fetch('http://localhost:8080/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: newUserForm.name.value,
                name: newUserForm.name.value,
                lastName: newUserForm.lastName.value,
                age: newUserForm.age.value,
                password: newUserForm.password.value,
                roles: newUserRoles
            })
        })
        if (response.ok) {
            newUserForm.reset()
            await listUsers()
            $('#nav-users_table-tab').click()
        } else {
            let error = await response.json()
            console.log(error.info)
        }
    }
}


async function getUser(id) {
    try {
        const response = await fetch('http://localhost:8080/user/' + id, {
            method: 'GET'
        })
        return await response.json()
    } catch (error) {
        console.error("Error fetching user data", error)
    }
}