from django.shortcuts import render_to_response, render, get_object_or_404
from django.http import HttpResponseRedirect
from wellvis.views import generate_sidepanel
from django.contrib.auth.decorators import login_required

@login_required(login_url='/')
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

    context['headline'] = "wControlPanel"

    return render(request, 'wellvis/home.html', context)
