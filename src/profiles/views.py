from .models import Profile
from .forms import ProfileForm
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, logout
from django.contrib.auth import login as auth_login
from django.shortcuts import (
    redirect,
    render,
)
from django.contrib import messages
from posts_proj import settings

@login_required
def my_profile_view(request):
    obj = Profile.objects.get(user=request.user)
    form = ProfileForm(request.POST or None, request.FILES or None, instance=obj)
    if request.is_ajax():
        instance = form.save()
        return JsonResponse({
            'bio':instance.bio,
            'avatar':instance.avatar.url,
            'user': instance.user.username,
        })
    context = {
        'obj':obj,
        'form':form,
    }

    return render(request, 'profiles/main.html', context)

def login(request):
    if request.user.is_authenticated:

        return redirect("posts:main-board")
    else:
        if request.method == "POST":
            user=authenticate(username=request.POST['username'],password=request.POST['password'])
            if user is not None:
                auth_login(request, user)
                return redirect("/")
            else:
                messages.info(request, "Usuario ou Senha Inválida!")

    return render(request, "registration/login.html")
