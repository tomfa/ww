from django.shortcuts import render_to_response, render, get_object_or_404
from django.http import HttpResponseRedirect
from wellvis.views import generate_sidepanel


def home(request):
    """
    View for home page, introducing what the page is for non-logged in users,
    showing a demo of the software, contact info and such.
    """
    context = {
    }

    generate_sidepanel(context, request)

    context['headline'] = "wDesign"

    return render(request, 'wellvis/home.html', context)
