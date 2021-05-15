from .models import Profile
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect

def user(request):
    if request.user.is_authenticated:
        user_p = Profile.objects.get(user=request.user)
        return {'user_p':user_p }
    else:
        return {'x':[1,2,3]} #gambiarra 
