from django.shortcuts import render_to_response, render, get_object_or_404
from main.models import Country, Field, Platform, Well

# Which method is called, is defined from urls.py
def home(request):
    """
    View for home page, introducing what the page is for non-logged in users,
    showing a demo of the software, contact info and such.
    """
    context = {
        # This dataformat is JSON
        'thisDataFormat':'JSON',
        'cake':'is Always Good'
    }

    return render(request, 'wellvis/home.html', context)

def dashboard(request):
    """
    Dashboard view for logged in users. Should show the hierarchy of 
    well projects, with the ability to click and view simple things
    """

    # if user is not logged in, return the home function
    if not request.user.is_authenticated():
        return home(request)  

    countries = Country.objects.all()
    fields = Field.objects.all()
    platforms = Platform.objects.all()
    wells = Well.objects.all()

    context = {
        'countries': countries,
        'fields': fields,
        'platforms': platforms,
        'wells': wells
    }

    return render(request, 'wellvis/dashboard.html', context)
