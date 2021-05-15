from django.shortcuts import render
from .models import Profile
from .forms import ProfileForm
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

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
