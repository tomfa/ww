from django.shortcuts import render_to_response, render, get_object_or_404, redirect
from django.http import HttpResponseRedirect
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
        'cake':'is Always Good',
        'page_title': "Homesweethome",
    }

    return render(request, 'wellvis/home.html', context)


def view_country(request, countryid):
    """
    View for country.
    """
    selected_country = get_object_or_404(Country, pk=countryid)
    fields = Field.objects.filter(country=selected_country)

    context = {
        'selected_country':selected_country,
        'fields':fields,
        'page_title': selected_country.name,
    }

    return render(request, 'wellvis/country.html', context)


def view_field(request, fieldid):
    """
    View for field.
    """
    selected_field = get_object_or_404(Field, pk=fieldid)
    selected_country = selected_field.country
    platforms = Platform.objects.filter(field=selected_field)

    context = {
        'selected_field':selected_field,
        'selected_country':selected_country,
        'platforms': platforms,
        'page_title': selected_field.name,
    }

    return render(request, 'wellvis/field.html', context)


def view_platform(request, platformid):
    """
    View for platform.
    """
    selected_platform = get_object_or_404(Platform, pk=platformid)
    selected_field = selected_platform.field
    selected_country = selected_field.country
    wells = Well.objects.filter(platform=selected_platform)

    context = {
        'selected_platform':selected_platform,
        'selected_country':selected_country,
        'selected_field':selected_field,
        'wells': wells,
        'page_title': selected_platform.name,
    }

    return render(request, 'wellvis/platform.html', context)


def view_well(request, wellid):
    """
    View for well.
    """
    selected_well = get_object_or_404(Well, pk=wellid)
    selected_platform = selected_well.platform
    selected_field = selected_platform.field
    selected_country = selected_field.country

    context = {
        'selected_well':selected_well,
        'selected_platform':selected_platform,
        'selected_field':selected_field,
        'selected_country':selected_country,
        'page_title': selected_well.name,
    }

    return render(request, 'wellvis/well.html', context)

def dashboard(request):
    """
    Dashboard view for logged in users. Should show the hierarchy of 
    well projects, with the ability to click and view simple things
    """

    # if user is not logged in, return the home function
    if not request.user.is_authenticated():
        return redirect('/admin/?next=%s' % request.path)

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
