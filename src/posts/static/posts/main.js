
const postsbox = document.querySelector('#posts-box')
const spinnerBox = document.getElementById('spinner-box')
const loadBtn = document.querySelector('#load-btn')
const endBox = document.querySelector('#end-box')

const postForm = document.querySelector('#post-form')
const title = document.getElementById('id_title')
const body = document.getElementById('id_body')
const csrf = document.getElementsByName('csrfmiddlewaretoken')

const url = window.location.href

const alertbox = document.querySelector('#alert-box')

const dropzone = document.querySelector('#my-dropzone')
const addBtn = document.querySelector('#add-btn')
const closeBtns = [...document.getElementsByClassName('add-modal-close')]

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

const deleted = localStorage.getItem('title')
if (deleted){
    handleAlerts('danger', `"${deleted}" foi deletado`)
    localStorage.clear()
}
const likeUnlikePosts=()=>{
    const likeUnlikeForms = [...document.getElementsByClassName('like-unlike-forms')]
    likeUnlikeForms.forEach(form=>form.addEventListener('submit', e=>{
        e.preventDefault()
        const clickedId = e.target.getAttribute('data-form-id')
   
        const clickedBtn = document.getElementById(`like-unlike-${clickedId}`)
        $.ajax({
            type: 'POST',
            url: '/like-unlike/',
            data:{
                'csrfmiddlewaretoken':csrftoken,
                'pk':clickedId,

            },
            success: function(response){
                console.log(response)
                clickedBtn.textContent = response.liked ? `Unlike (${response.count})` : `Like (${response.count})`
            },
            error: function(error){
                console.log(error)
            }
        })
    }))
}

let visible = 3

const getData = ()=>{
    $.ajax({
        type:'GET',
        url: `/data/${visible}`,
        success:function(response){
            const data = response.data
            spinnerBox.classList.add('not-visible')
            data.forEach(el => {
                postsbox.innerHTML += `
                <div class="card mb-2" >
                    <div class="card-body">
                        <h5 class="card-title">${el.title}</h5>
                        <p class="card-text">${el.body}</p>                 
                    </div>
                    <div class='card-footer'>
                    <div class='row'>
                       <div class='col-2'>
                            <a href="${url}detail/${el.id}" class="btn btn-primary">Detalhe</a>
                       </div>
                       <div class='col-2'>
                            <form class='like-unlike-forms' data-form-id='${el.id}'>
                            
                                <button href="#" class="btn btn-primary" id='like-unlike-${el.id}'>${el.liked ? `Unlike (${el.count})` : `Like (${el.count})`}</button>
                            </form>
                        </div>  
                    </div>                 
                    </div>  
                </div>
                
                `
            });
            likeUnlikePosts()
            if (response.size ===0){
                endBox.textContent = 'Sem posts...'
            }
            else if (response.size <= visible){
                loadBtn.classList.add('not-visible')
                endBox.textContent = 'Sem posts mais a carregar'
            }
    
        },
        error: function(error){
            console.log(error)
        }
    })
}

loadBtn.addEventListener('click', ()=>{
    spinnerBox.classList.remove('not-visible')
    visible += 3
    getData()
})

let newPostId= null
postForm.addEventListener('submit', e=>{
    e.preventDefault()
    $.ajax({
        type: 'POST',
        url: '',
        data: {
            'csrfmiddlewaretoken': csrf[0].value,
            'title':title.value,
            'body':body.value,
        },
        success: function(response){
            console.log(response)
            newPostId = response.id
            postsbox.insertAdjacentHTML('afterbegin', `
                
                <div class="card mb-2" >
                    <div class="card-body">
                        <h5 class="card-title">${response.title}</h5>
                        <p class="card-text">${response.body}</p>                 
                    </div>
                    <div class='card-footer'>
                    <div class='row'>
                       <div class='col-2'>
                            <a href="${url}detail/${response.id}" class="btn btn-primary">Detalhe</a>
                       </div>
                       <div class='col-2'>
                            <form class='like-unlike-forms' data-form-id='${response.id}'>
                            
                                <button href="#" class="btn btn-primary" id='like-unlike-${response.id}'>Like (0)</button>
                            </form>
                        </div>  
                    </div>                 
                    </div>  
                </div>
                
            
            `)
            likeUnlikePosts()
            // $('#addPostModal').modal('hide')
            handleAlerts('success', 'Seu post foi criado com sucesso! :)')
            // postForm.reset()
        },
        error: function(error){
            $('#addPostModal').modal('hide')
            handleAlerts('danger', 'Oops... aconteceu um problema ao criar seu post :/')
        }
    })
})

addBtn.addEventListener('click', ()=>{
    dropzone.classList.remove('not-visible')
})

closeBtns.forEach(btn => btn.addEventListener('click',()=>{
    postForm.reset()
    if (!dropzone.classList.contains('not-visible')){
        dropzone.classList.add('not-visible')
    }
    const myDropzone = Dropzone.forElement("#my-dropzone")
    myDropzone.removeAllFiles(true)
}))

Dropzone.autoDiscover =  false
const myDropzone = new Dropzone('#my-dropzone',{
    url: 'upload/',
    init: function(){
        this.on('sending', function(file, xhr, formData){
            formData.append('csrfmiddlewaretoken', csrftoken)
            formData.append('new_post_id', newPostId)
        })
    },
    maxFiles: 3,
    maxFilesize: 4,
    acceptedFiles:'.png, .jpg, .jpeg'
})


getData()