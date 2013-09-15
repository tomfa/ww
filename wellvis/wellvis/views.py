from django.shortcuts import render_to_response, render, get_object_or_404


# Which method is called, is defined from urls.py
def home(request):

    context = {
        # This dataformat is JSON
        'thisDataFormat':'JSON',
        'cake':'is Always Good'
    }

    return render(request, 'wellvis/home.html', context)