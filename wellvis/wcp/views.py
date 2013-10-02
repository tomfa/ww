from django.shortcuts import render_to_response, render, get_object_or_404
from django.http import HttpResponseRedirect
from wellvis.views import generate_sidepanel

def home(request):
    """
    View for home page, introducing what the page is for non-logged in users,
    showing a demo of the software, contact info and such.
    """
    context = {
        # This dataformat is JSON
        'thisDataFormat':'THIS IS wControl Panel',
        'cake':'THIS IS wCP'
    }
    
    generate_sidepanel(context, request)

<<<<<<< HEAD
=======
    context['headline'] = "wControlPanel"
>>>>>>> 90e178fd6a0a25a35cce64da586c75eb2408fd59

    return render(request, 'wellvis/home.html', context)
