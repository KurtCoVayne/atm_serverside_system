$(function () {
    const socket = io();

    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    const $nickForm = $('#nickForm')
    const $nickError = $('#nickError')
    const $nickName = $('#nickName')

    const $users = $('#usernames')


    $nickForm.submit(e => {
        e.preventDefault();
        socket.emit('new-user', $nickName.val(), (data) => {
            if (data) {
                $('#nickWrap').hide();
                $('#contentWrap').show();
            } else {
                $nickError.html(`
                <div class="alert alert-danger mt-2">
                    That Username already exists.
                </div>
                `)
            }
            $nickName.val('')
        });
    });
    $messageForm.submit(e => {
        e.preventDefault();
        socket.emit('send-message', $messageBox.val(), data => {
            $chat.append(`<p class="error">${data}</p>`)
        });
        $messageBox.val('')
    });
    socket.on('new-message', function (data) {
        console.log($chat.children().length, $chat.children().slice(0, 2))
        if ($chat.children().length > 28) {
            $chat.children().slice(0, 2).remove()
        }
        $chat.append(`<b class="text-primary"><strong>${data.nick}</strong>: ${data.msg}</b><br/>`)
    });
    socket.on('usernames', data => {
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += `<p><i class="fas fa-user"></i> ${data[i]}</p>`
        }
        $users.html(html);
    });
    socket.on('whisper', data => {
        displayMessage(data)
    });
    socket.on('load-old-messages', data => {
        for (let i = data.length - 1; i > 0; i--) {
            displayMessage(data[i])
        }
    })
    function displayMessage(data) {
        $chat.append(`<b class="whisper">${data.nick}: ${data.msg}</b><br/>`)
    }
})