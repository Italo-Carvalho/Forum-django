from django.urls import path, include
from .views import my_profile_view, login

app_name = 'profiles'

urlpatterns = [
    path('my/', my_profile_view, name='my-profile'),
    # path('login/', login, name='login'),
]
