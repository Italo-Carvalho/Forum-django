const avatarBox = document.querySelector('#avatar-box')
const alertbox = document.querySelector('#alert-box')
const profileForm = document.querySelector('#profile-form')
const csrf = document.getElementsByName('csrfmiddlewaretoken')

const bioInput = document.querySelector('#id_bio')
const avatarInput = document.querySelector('#id_avatar')

profileForm.addEventListener('submit', e=>{
    e.preventDefault()

    const formData = new FormData()
    formData.append('csrfmiddlewaretoken',csrf[0].value)
    formData.append('bio', bioInput.value)
    formData.append('avatar', avatarInput.files[0])

    $.ajax({
        type:'POST',
        url:'',
        enctype: 'multipart/form-data',
        data: formData,
        success: function(response){
            console.log(response)
            avatarBox.innerHTML = `
                <img src="${response.avatar}" class='rounded' height='200px' width='auto' alt='${response.user}'>
            `
            bioInput.value = response.bio
            handleAlerts('success', 'Seu perfil foi atualizado')
            
        },
        error: function(error){
            console.log(error)
        },
        processData:false,
        contentType:false,
        cache:false,

    })
})