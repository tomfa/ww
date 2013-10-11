from django.shortcuts import render_to_response, render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from wellvis.views import generate_sidepanel


@login_required(login_url='/')
def home(request):
    """
    View for home page, introducing what the page is for non-logged in users,
    showing a demo of the software, contact info and such.
    """
    context = {
    }

    context['sidepanel_hidden'] = "1"
    context['headline'] = "wPath"

    return render(request, 'wpath/3D_View.html', context)
