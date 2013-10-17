from django.shortcuts import render_to_response, render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from main.models import Country, Field, Platform, Well, Project, WellPath
from wpath.models import Path, HelpPoint, IntermediatePoint, HelpPointType, Algorithm
from datetime import datetime
import json


def get_wellJSON(request, wellpk):
    response_data = {}

    if not request.user.is_authenticated():
        response_data['message'] = "403 Error: You are not authenticated"
        return HttpResponse(json.dumps(response_data), content_type="application/json")
    
    well = Well.objects.filter(pk=wellpk)
    
    if not well:
        response_data['message'] = "404 Error: Well " + wellpk + " not found"
        return HttpResponse(json.dumps(response_data), content_type="application/json")
    
    well = well[0]
    project = Project.objects.filter(well=well).order_by('-created_date')

    if not project:
        response_data['message'] = "404 Error: Project not found attached to well " + well.pk
        return HttpResponse(json.dumps(response_data), content_type="application/json")
    
    project = project[0]
    path = WellPath.objects.filter(project=project).order_by('-date')

    if not path:
        response_data['message'] = "No path has been created yet"
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    response_data['message'] = "200: Path retrieved successfully"
    response_data['path'] = path[0].path
    return HttpResponse(json.dumps(response_data), content_type="application/json")


def update_wellJSON(request, wellpk):
    response_data = {}
    time_threshold = 300  # Minimum number of seconds before making new restorepoint

    if not request.user.is_authenticated():
        response_data['message'] = "403 Error: You are not authenticated"
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    well = Well.objects.filter(pk=wellpk)

    if not well:
        response_data['message'] = "404 Error: Well " + wellpk + " not found"
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    well = well[0]
    project = Project.objects.filter(well=well).order_by('-created_date')

    if not project:
        response_data['message'] = "404 Error: Project not found attached to well " + well.pk
        return HttpResponse(json.dumps(response_data), content_type="application/json")
    
    project = project[0]
    if request.method == 'POST':
        if request.POST.has_key('graph'):
            json_dump = request.POST.get('graph')
        else:
            response_data['message'] = "500 Error: Missing key graph"
            return HttpResponse(json.dumps(response_data), content_type="application/json")

    # TODO: LOG
    previous_path = WellPath.objects.filter(project=project).order_by('-date')
    if (previous_path and previous_path.creator == request.user):
        previous_path = previous_path[0]
        if seconds_since(previous_path.date) > time_threshold:
            path = WellPath.objects.create(project=project, path=json_dump, creator=request.user)
            path.save()
            response_data['message'] = "New wellpath should be saved"
        else:
            previous_path.path = json_dump
            previous_path.updated = datetime.now(previous_path.date.tzinfo)
            response_data['message'] = "Existing wellpath is updated"
    
    return HttpResponse(json.dumps(response_data), content_type="application/json")


def userconfig(request, userpk):
    """
    Dump/read of user 3d configuration
    """
    response_data = {}
        # if user is not logged in, return the home function
    if not request.user.is_authenticated():
        response_data['message'] = "403 Error: You are not authenticated"
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    # TODO: Implement update from POST object
    response_data['message'] = "500 Error: Not implemented functionality"

    return HttpResponse(json.dumps(response_data), content_type="application/json")


def seconds_since(date):
    """
    Time since the timestamp, in seconds. 
    """
    return (datetime.now(date.tzinfo) - date).seconds


'''
# LEGACY CODE FOR DB-AWARE GET AND UPDATE
def get_well(request, wellpk):
    """
    Read of well data. Reads from database models (not JSON dump) and
    creates JSON response
    """
    response_data = {}

    if not request.user.is_authenticated():
        response_data['message'] = "403 Error: You are not authenticated"
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    well = Well.objects.filter(pk=wellpk)

    if not well:
        response_data['message'] = "404 Error: Well " + wellpk + " not found"
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    well = well[0]
    project = Project.objects.filter(well=well)

    if not project:
        response_data['message'] = "404 Error: Project not found attached to well " + well.pk
        return HttpResponse(json.dumps(response_data), content_type="application/json")
    
    project = project[0]
    path = Path.objects.filter(project=project)

    if not path:
        response_data['message'] = "404 Error: Path not found attached to project " + project.pk
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    path = path[0]

    serialized_well = {
        "minX"  : path.minX,
        "maxX"  : path.maxX,
        "minY"  : path.minY,
        "maxY"  : path.maxY,
        "theZ"  : path.theZ,
        "theUnit" : path.theUnit,
        "theValues": []
    }

    selected_wellpoint = HelpPoint.objects.filter(wpath=path, previous_point=None)
    wellpoints = []
    if selected_wellpoint:
        while selected_wellpoint:
            wellpoints.append(selected_wellpoint[0])
            selected_wellpoint = selected_wellpoint[0].next_point


    for wellpoint in wellpoints:
        wellpointObj = {}
        wellpointObj['theMD'] = wellpoint.depth
        wellpointObj['theINC'] = wellpoint.direction
        wellpointObj['theAZI'] = wellpoint.inclination
        wellpointObj['x'] = wellpoint.x
        wellpointObj['y'] = wellpoint.y
        wellpointObj['z'] = wellpoint.z
        wellpointObj['thePoints'] = []

        selected_intermediatepoint = IntermediatePoint.filter(parentPoint=wellpoint, previous_point=None)
        intermediatePoints = []
        if selected_intermediatepoint:
            while selected_intermediatepoint:
                intermediatePoints.append(selected_intermediatepoint[0])
                selected_intermediatepoint = selected_intermediatepoint[0].next.point
        
        for intermediatePoint in intermediatePoints:
            wellpointObj['thePoints'].append({
                "x": intermediatePoint.x,
                "y": intermediatePoint.y,
                "z": intermediatePoint.z,
            })

        serialized_well['theValues'].append(wellpointObj)
    
    return HttpResponse(json.dumps(serialized_well), content_type="application/json")


def update_well(request, wellpk):
    """
    Write of well data.
    """
    response_data = {}

    if not request.user.is_authenticated():
        # TODO: must also have write access on specific well-path
        response_data['message'] = "403 Error: You are not authenticated"
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    well = Well.objects.filter(pk=wellpk)

    if not well:
        response_data['message'] = "404 Error: Well not found"
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    well = well[0]
    project = Project.objects.filter(well=well)

    if not project:
        response_data['message'] = "404 Error: Project not found attached to well " + well.pk
        return HttpResponse(json.dumps(response_data), content_type="application/json")
    
    project = project[0]
    path = Path.objects.filter(project=project)

    if not path:
        response_data['message'] = "404 Error: Path not found attached to project " + project.pk
        return HttpResponse(json.dumps(response_data), content_type="application/json")

    path = path[0]

    # TODO: read from request
    updated_well = {}

    path.minX = updated_well['minX']
    path.maxX = updated_well['maxX']
    path.minY = updated_well['minY']
    path.maxY = updated_well['maxY']
    path.theZ = updated_well['theZ']
    path.theUnit = updated_well['theUnit']

    for point in updated_well['theValues']:
        update_wellpoint()
    serialized_well = {

    selected_wellpoint = HelpPoint.objects.filter(wpath=path, previous_point=None)
    wellpoints = []
    if selected_wellpoint:
        while selected_wellpoint:
            wellpoints.append(selected_wellpoint[0])
            selected_wellpoint = selected_wellpoint[0].next_point


    for wellpoint in wellpoints:
        wellpointObj = {}
        wellpointObj['theMD'] = wellpoint.depth
        wellpointObj['theINC'] = wellpoint.direction
        wellpointObj['theAZI'] = wellpoint.inclination
        wellpointObj['x'] = wellpoint.x
        wellpointObj['y'] = wellpoint.y
        wellpointObj['z'] = wellpoint.z
        wellpointObj['thePoints'] = []

        selected_intermediatepoint = IntermediatePoint.filter(parentPoint=wellpoint, previous_point=None)
        intermediatePoints = []
        if selected_intermediatepoint:
            while selected_intermediatepoint:
                intermediatePoints.append(selected_intermediatepoint[0])
                selected_intermediatepoint = selected_intermediatepoint[0].next.point
        
        for intermediatePoint in intermediatePoints:
            wellpointObj['thePoints'].append({
                "x": intermediatePoint.x,
                "y": intermediatePoint.y,
                "z": intermediatePoint.z,
            })

        serialized_well['theValues'].append(wellpointObj)
    
    return HttpResponse(json.dumps(serialized_well), content_type="application/json")

'''

