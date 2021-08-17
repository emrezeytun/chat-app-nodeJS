const users = [];

function getUsers(id,username,roomname) {
    const user = {id,username,roomname};

    users.push(user);

    return users;

}





module.exports = getUsers