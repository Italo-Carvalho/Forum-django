const postBox = document.querySelector('#post-box')
const backBtn = document.querySelector('#back-btn')
const updateBtn = document.querySelector('#update-btn')
const deleteBtn = document.querySelector('#delete-btn')
alertbox = document.querySelector('#alert-box')
const url = window.location.href + 'data/'
const updateurl = window.location.href + 'update/'
const deleteurl = window.location.href + 'delete/'

const updateForm = document.getElementById('update-form')
const deleteForm = document.getElementById('delete-form')
const csrf = document.getElementsByName('csrfmiddlewaretoken')
const spinnerBox = document.querySelector('#spinner-box')

const titleInput = document.querySelector('#id_title')
const bodyInput = document.querySelector('#id_body')

// backBtn.addEventListener('click', ()=>{
//     history.back()
// })

const getCookie=(name)=> {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

$.ajax({
    type:'GET',
    url: url,
    success: function(response){
        console.log(response)
        const data = response.data
        if (data.logged_in !== data.author){
            console.log('diferente')
        }else{
            updateBtn.classList.remove('not-visible')
            deleteBtn.classList.remove('not-visible')
        }
        const titleEl = document.createElement('h3')
        titleEl.setAttribute('class','mt-3')
        titleEl.setAttribute('id','title')

        const bodyEl = document.createElement('p')
        bodyEl.setAttribute('class','mt-1')
        bodyEl.setAttribute('id','body')

        titleEl.textContent = data.title
        bodyEl.textContent = data.body

        postBox.appendChild(titleEl)
        postBox.appendChild(bodyEl)

        titleInput.value = data.title
        bodyInput.value = data.body

        spinnerBox.classList.add('not-visible')
    },
    error: function(error){
        console.log(error)
    }
})

updateForm.addEventListener('submit', e=>{
    e.preventDefault()

    const title = document.getElementById('title')
    const body = document.getElementById('body')

    $.ajax({
        type:'POST',
        url: updateurl,
        data:{
            'csrfmiddlewaretoken': csrf[0].value,
            'title': titleInput.value,
            'body': bodyInput.value,
        },
        success: function(response){
            console.log(response)
            handleAlerts('success', 'O post foi atualizado!')
            title.textContent = response.title
            body.textContent = response.body
        },
        error: function(error){
            console.log(error)
        }
    })
})

deleteForm.addEventListener('submit', e=>{
    e.preventDefault()

    $.ajax({
        type: 'POST',
        url: deleteurl,
        data: {
            'csrfmiddlewaretoken': csrf[0].value,

        },
        success: function(response){
            window.location.href = window.location.origin
            localStorage.setItem('title', titleInput.value)
        },
        error: function(error){
            console.log(error)
        }
    })
})