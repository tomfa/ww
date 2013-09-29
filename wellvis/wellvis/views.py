from django.shortcuts import render_to_response, render, get_object_or_404, redirect
from django.http import HttpResponseRedirect
from main.models import Country, Field, Platform, Well


def home(request):
    """
    View for home page, introducing what the page is for non-logged in users,
    showing a demo of the software, contact info and such.
    """
    context = {
        'thisDataFormat':'JSON',
        'cake':'is Always Good',
        'page_title': "Homesweethome",
    }

    try:
        add_sidepanel_to_context(context, request.COOKIES.get('sidepanel_type'), request.COOKIES.get('sidepanel_id'), hidden=request.COOKIES.get('sidepanel_hidden'))
    except:
        pass

    return render(request, 'wellvis/home.html', context)


def view_country(request, countryid):
    """
    View for country.
    """
    context = {}
    add_sidepanel_to_context(context, "country", countryid, hidden=request.COOKIES.get('sidepanel_hidden'))

    response = render(request, 'wellvis/country.html', context)

    response.set_cookie("sidepanel_type", value='country', max_age=None, expires=None, path='/', domain=None, secure=None, httponly=False)
    response.set_cookie("sidepanel_id", value=countryid, max_age=None, expires=None, path='/', domain=None, secure=None, httponly=False)

    return response


def view_field(request, fieldid):
    """
    View for field.
    """
    context = {}
    add_sidepanel_to_context(context, "field", fieldid, request.COOKIES.get('sidepanel_hidden'))

    response = render(request, 'wellvis/field.html', context)

    response.set_cookie("sidepanel_type", value='field', max_age=None, expires=None, path='/', domain=None, secure=None, httponly=False)
    response.set_cookie("sidepanel_id", value=fieldid, max_age=None, expires=None, path='/', domain=None, secure=None, httponly=False)

    return response


def generate_sidepanel(context, request):
    if (request):
        type = request.COOKIES.get('sidepanel_type')
        id = request.COOKIES.get('sidepanel_id')
        hidden = request.COOKIES.get('sidepanel_hidden')
    return add_sidepanel_to_context(context, type, id, hidden)


def add_sidepanel_to_context(context, type=None, id=1, hidden=0):
    
    '''
    Adds sidepanel with selected project based on cookies.
    Issue: Will give 404-page if you delete a project saved in cookies
    '''

    

    if type == None:
        countries = Country.objects.all()
        newcontext = {
            'countries':countries,
        }

    elif type == "country":
        selected_country = get_object_or_404(Country, pk=id)
        fields = Field.objects.filter(country=selected_country)

        newcontext = {
            'selected_country':selected_country,
            'fields':fields,
            'page_title': selected_country.name,
        }
        
    elif type == "field":
        selected_field = get_object_or_404(Field, pk=id)
        selected_country = selected_field.country
        platforms = Platform.objects.filter(field=selected_field)

        newcontext = {
            'selected_field':selected_field,
            'selected_country':selected_country,
            'platforms': platforms,
            'page_title': selected_field.name,
        }

    elif type == "platform":
        selected_platform = get_object_or_404(Platform, pk=id)
        selected_field = selected_platform.field
        selected_country = selected_field.country
        wells = Well.objects.filter(platform=selected_platform)

        newcontext = {
            'selected_platform':selected_platform,
            'selected_country':selected_country,
            'selected_field':selected_field,
            'wells': wells,
            'page_title': selected_platform.name,
        }

    elif type == "well":
        selected_well = get_object_or_404(Well, pk=id)
        selected_platform = selected_well.platform
        selected_field = selected_platform.field
        selected_country = selected_field.country

        newcontext = {
            'selected_well':selected_well,
            'selected_platform':selected_platform,
            'selected_field':selected_field,
            'selected_country':selected_country,
            'page_title': selected_well.name,
        }

    if hidden == "1":
        newcontext['sidepanel_hidden'] = '0'
    else:
        newcontext['sidepanel_hidden'] = '1'

            

    context.update(newcontext)
    return context

def view_platform(request, platformid):
    """
    View for platform.
    """
    context = {}
    add_sidepanel_to_context(context, "platform", platformid, request.COOKIES.get('sidepanel_hidden'))

    response = render(request, 'wellvis/platform.html', context)

    response.set_cookie("sidepanel_type", value='platform', max_age=None, expires=None, path='/', domain=None, secure=None, httponly=False)
    response.set_cookie("sidepanel_id", value=platformid, max_age=None, expires=None, path='/', domain=None, secure=None, httponly=False)

    return response


def view_well(request, wellid):
    """
    View for well.
    """
    context = {}
    add_sidepanel_to_context(context, "well", wellid, request.COOKIES.get('sidepanel_hidden'))

    response = render(request, 'wellvis/well.html', context)

    response.set_cookie("sidepanel_type", value='well', max_age=None, expires=None, path='/', domain=None, secure=None, httponly=False)
    response.set_cookie("sidepanel_id", value=wellid, max_age=None, expires=None, path='/', domain=None, secure=None, httponly=False)

    return response

def dashboard(request):
    """
    Dashboard view for logged in users. Should show the hierarchy of 
    well projects, with the ability to click and view simple things
    """

    # if user is not logged in, return the home function
    if not request.user.is_authenticated():
        return redirect('/')

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

    add_sidepanel_to_context(context, hidden=request.COOKIES.get('sidepanel_hidden'))

    return render(request, 'wellvis/dashboard.html', context)
