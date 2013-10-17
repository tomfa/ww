from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from wellvis.views import generate_sidepanel
from main.models import Well, WellPath, Project

@login_required(login_url='/')
def home(request):
    """
    Home page for wpath module. Should show list of recent changes, and 
    general information about the well. Restore-possibilites of previous 
    paths and links to what do next.
    """
    context = {
    }

    context['sidepanel_hidden'] = "1"
    context['page_title'] = "wPath"

    context = generate_sidepanel(context, request)
    context['path'] = "kake"

    return render(request, 'wellvis/home.html', context)


@login_required(login_url='/')
def edit_well(request, wellpk):
    """
    Page for editing existing well. 
    If: no project exists. Send to create project page.
    if: no path exists. Send to create path page.
    else: Send to edit page with graph
    """
    context = {'messages':[]}

    if not request.user.is_authenticated():
        context['messages'].append("403 Error: You are not authenticated")
        return render(request, 'wellvis/home.html', generate_sidepanel(context, request))
    
    well = Well.objects.filter(pk=wellpk)  # could be replaced with get_or_404
    
    if not well:
        context['messages'].append("404 Error: Well " + wellpk + " not found")
        return render(request, 'wellvis/home.html', generate_sidepanel(context, request))
    
    well = well[0]
    project = Project.objects.filter(well=well).order_by('-created_date')

    if not project:
        context['messages'].append("404 Error: Project not found attached to well " + str(well.pk))
        # TODO: Send to create-project page
        return render(request, 'wellvis/home.html', generate_sidepanel(context, request))
    
    project = project[0]
    path = WellPath.objects.filter(project=project).order_by('-date')
    if not path:
        path = WellPath.objects.create(project=project, creator=request.user, path=get_default_path())
        path.save()
    else:
        path = path[0]
    context['wellpk'] = well.pk
    #context['path'] = path.path
    context['page_title'] = "wPath"

    return render(request, 'wpath/3D_View.html', context)

def get_default_path():
    return '{ "minX": -100, "maxX": 100, "minY": -100, "maxY": 100, "theZ": 150, "theUnit": 50, "theValues": []}'
