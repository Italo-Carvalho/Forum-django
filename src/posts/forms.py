from django import forms
from .models import Post

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ('title', 'body',)

        labels = {
            'title':'Titulo',
            'body':'Texto'
        }



