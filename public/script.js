const socket = io();

const form = document.querySelector('.right form');
const msg = document.querySelector('#msg');
const typing = document.querySelector('.typing');
const roomNamePage = document.querySelector('#roomNamePage');
const lists = document.querySelector('.lists');





const {room_name,name} = Qs.parse(location.search,{ignoreQueryPrefix: true});

let userName = name;
let roomName = room_name

roomNamePage.innerHTML = roomName;

msg.addEventListener('keyup', (e) => {
   
    if(msg.value.length > 0) {
    socket.emit('typing', userName);
}
else{
    socket.emit('typing', null);
}
})

socket.emit('joinRoom', {userName, roomName });

socket.on('onlineUsers', function(data) {

    socket.emit('users', data);

});

socket.on('getUsers', function(data) {
    lists.innerHTML = '';
    data.forEach((dat) => {
        
        
            lists.innerHTML += `<li> ${dat.username} - Room:   ${dat.roomname} </li>`

    });
})

socket.on('typingPrint', function(data) {
    
    typing.innerHTML = `<span class="typingUsername"> ${data}</span> is typing... `

    if(data == null) {
        typing.innerHTML = ` `

    }
})







form.addEventListener('submit', (e) => {
    e.preventDefault();

    let user = userName;
    let message = msg.value;
    msg.value = "";

    let data = {user,message};

    socket.emit('chatMsg', data);
    

})



socket.on('getMsg', (data) => {
     printChatArea(data);
})

function printChatArea(data) {

    let div = document.createElement('div');
    div.classList.add('message_area');

    div.innerHTML = `<div class="name">
    <p>${data.user}</p>
</div>
<div class="message">
    <p>${data.message}</p>
</div>`;

    document.querySelector('.rightMsg').appendChild(div);
}